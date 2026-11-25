/* =======================================================================
   RSQUARED HOLDING — PAGE LOADER
   Load in <head> (not deferred) so the loader is set up before first paint.
   Hides the loader once the page is usable — DOM ready, web fonts and the
   first hero photo — instead of waiting for every image on the page.
   Always shown for at least MIN ms (shorter on repeat visits in a session)
   and never longer than MAX ms.
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
	var MAX = 4000;
	var start = Date.now();
	var done = false;

	function finish() {
		if (done) return;
		done = true;
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

	function whenDomReady() {
		return new Promise(function (resolve) {
			if (document.readyState !== 'loading') resolve();
			else document.addEventListener('DOMContentLoaded', resolve, { once: true });
		});
	}

	function whenHeroImage() {
		return whenDomReady().then(function () {
			var slide = document.querySelector('.r2-hero__slide');
			if (!slide) return;
			var m = /url\(["']?([^"')]+)["']?\)/.exec(slide.style.backgroundImage || '');
			if (!m) return;
			return new Promise(function (resolve) {
				var img = new Image();
				img.onload = img.onerror = resolve;
				img.src = m[1];
			});
		});
	}

	function whenFonts() {
		return document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
	}

	if (typeof Promise === 'undefined') {
		// very old browsers: just wait for load
		window.addEventListener('load', finish);
	} else {
		Promise.all([whenDomReady(), whenFonts(), whenHeroImage()]).then(finish, finish);
	}
	setTimeout(finish, MAX);
})();
