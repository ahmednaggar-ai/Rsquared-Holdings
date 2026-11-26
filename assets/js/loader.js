/* =======================================================================
   RSQUARED HOLDING — PAGE LOADER
   Load in <head> (not deferred) so the loader is set up before first paint.

   Keeps the loader up until EVERY image on the page has loaded:
   all <img> (including loading="lazy" ones, which are preloaded so they
   appear instantly when scrolled to) and inline background images (hero).
   Also waits for the web fonts. The progress bar and percentage show real
   progress. A failed image counts as done, so one broken file never blocks
   the page. The Google Maps embed is not waited for.

   Timing: at least MIN ms (shorter on repeat visits in the same session),
   and never longer than MAX ms on very slow connections.
   ======================================================================= */
(function () {
	'use strict';

	var root = document.documentElement;
	root.classList.add('r2-js', 'r2-loading');

	var repeat = false;
	try {
		repeat = sessionStorage.getItem('r2-visited') === '1';
		sessionStorage.setItem('r2-visited', '1');
	} catch (e) { /* storage blocked: treat as first visit */ }

	var MIN = repeat ? 400 : 1400;
	var MAX = 25000;
	var start = Date.now();
	var done = false;

	/* ---- Progress UI ---- */
	var shown = 0;
	function setProgress(ratio) {
		ratio = Math.max(shown, Math.min(1, ratio));   // never goes backwards
		shown = ratio;
		var bar = document.querySelector('.r2-loader__progress span');
		var pct = document.querySelector('.r2-loader__pct');
		if (bar) bar.style.transform = 'scaleX(' + ratio + ')';
		if (pct) pct.textContent = Math.round(ratio * 100) + '%';
	}

	/* ---- Finish: reveal the page ---- */
	function finish() {
		if (done) return;
		done = true;
		setProgress(1);
		var wait = Math.max(0, MIN - (Date.now() - start));
		setTimeout(function () {
			root.classList.add('r2-ready');
			// unlock scrolling as the panel starts to slide away
			setTimeout(function () {
				root.classList.remove('r2-loading');
				var el = document.querySelector('.r2-loader');
				if (el) el.setAttribute('aria-hidden', 'true');
			}, 700);
		}, wait);
	}

	/* ---- Collect every image URL on the page ---- */
	function imageUrls() {
		var urls = [];
		var seen = {};
		function add(u) {
			if (!u || u.indexOf('data:') === 0 || seen[u]) return;
			seen[u] = true;
			urls.push(u);
		}
		Array.prototype.forEach.call(document.images, function (img) {
			add(img.currentSrc || img.getAttribute('src'));
		});
		Array.prototype.forEach.call(document.querySelectorAll('[style*="url("]'), function (el) {
			var m = /url\(["']?([^"')]+)["']?\)/.exec(el.getAttribute('style'));
			if (m) add(m[1]);
		});
		return urls;
	}

	function preload(url) {
		return new Promise(function (resolve) {
			var img = new Image();
			img.onload = img.onerror = function () { resolve(); };
			img.src = url;
			if (img.complete) resolve();           // already cached
		});
	}

	function whenDomReady() {
		return new Promise(function (resolve) {
			if (document.readyState !== 'loading') resolve();
			else document.addEventListener('DOMContentLoaded', resolve, { once: true });
		});
	}

	function whenFonts() {
		return document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
	}

	if (typeof Promise === 'undefined') {
		// very old browsers: wait for the normal load event
		window.addEventListener('load', finish);
	} else {
		whenDomReady().then(function () {
			var urls = imageUrls();
			var total = urls.length + 1;              // +1 for the fonts
			var loaded = 0;
			var tick = function () { loaded++; setProgress(loaded / total); };
			setProgress(0);
			return Promise.all(
				urls.map(function (u) { return preload(u).then(tick); })
					.concat([whenFonts().then(tick, tick)])
			);
		}).then(finish, finish);
	}
	setTimeout(finish, MAX);
})();
