/* =======================================================================
   RSQUARED HOLDING — GROUP COMPANIES behaviour (vanilla JS)
   - Trade: turns the stacked brand panels into tabs (arrow-key support)
   - Skylight: prev/next buttons + progress bar for the photo strip
   Without JS everything stays visible and scrollable.
   ======================================================================= */
(function () {
	'use strict';

	/* ---- Brand tabs ---- */
	document.querySelectorAll('[data-r2-tabs]').forEach(function (wrap) {
		var tablist = wrap.querySelector('[role="tablist"]');
		var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
		var panels = Array.prototype.slice.call(wrap.querySelectorAll('[role="tabpanel"]'));
		if (!tablist || !tabs.length) return;

		tablist.hidden = false;
		wrap.classList.add('r2-brands--tabbed');

		function select(i, focus) {
			tabs.forEach(function (t, j) {
				var on = i === j;
				t.setAttribute('aria-selected', String(on));
				t.tabIndex = on ? 0 : -1;
				panels[j].hidden = !on;
			});
			if (focus) tabs[i].focus();
		}
		tabs.forEach(function (tab, i) {
			tab.addEventListener('click', function () { select(i); });
			tab.addEventListener('keydown', function (e) {
				var n = tabs.length, k = e.key;
				if (k === 'ArrowRight') select((i + 1) % n, true);
				else if (k === 'ArrowLeft') select((i - 1 + n) % n, true);
				else if (k === 'Home') select(0, true);
				else if (k === 'End') select(n - 1, true);
				else return;
				e.preventDefault();
			});
		});
		select(0);
	});

	/* ---- Scrolling strip ---- */
	document.querySelectorAll('[data-r2-strip]').forEach(function (strip) {
		var track = strip.querySelector('.r2-strip__track');
		var prev = strip.querySelector('[data-dir="prev"]');
		var next = strip.querySelector('[data-dir="next"]');
		var bar = strip.querySelector('.r2-strip__progress span');
		if (!track) return;

		function step() {
			var item = track.querySelector('li');
			var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			return item ? item.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
		}
		function update() {
			var max = track.scrollWidth - track.clientWidth;
			var ratio = max > 0 ? track.scrollLeft / max : 1;
			if (prev) prev.disabled = track.scrollLeft <= 2;
			if (next) next.disabled = track.scrollLeft >= max - 2;
			if (bar) {
				var visible = track.clientWidth / track.scrollWidth;
				bar.style.transform = 'scaleX(' + Math.min(1, visible + (1 - visible) * ratio) + ')';
			}
		}
		if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
		if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
		track.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		update();

		/* ---- Mouse drag to scroll (touch already scrolls natively) ---- */
		var drag = null;
		var suppressClick = false;

		track.addEventListener('pointerdown', function (e) {
			if (e.pointerType !== 'mouse' || e.button !== 0) return;
			drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
		});
		track.addEventListener('pointermove', function (e) {
			if (!drag || e.pointerId !== drag.id) return;
			var dx = e.clientX - drag.x;
			if (!drag.moved && Math.abs(dx) > 5) {
				drag.moved = true;
				track.classList.add('is-dragging');      // turns snapping off while dragging
				try { track.setPointerCapture(drag.id); } catch (err) { /* capture is optional */ }
			}
			if (drag.moved) {
				e.preventDefault();
				track.scrollLeft = drag.left - dx;
			}
		});
		function endDrag() {
			if (!drag) return;
			var moved = drag.moved;
			drag = null;
			if (!moved) return;
			suppressClick = true;                      // a drag must not trigger card buttons
			setTimeout(function () { suppressClick = false; }, 0);
			// settle on the nearest card, then hand control back to CSS snapping
			var s = step();
			var target = Math.round(track.scrollLeft / s) * s;
			track.scrollTo({ left: target, behavior: 'smooth' });
			setTimeout(function () { track.classList.remove('is-dragging'); }, 400);
		}
		track.addEventListener('pointerup', endDrag);
		track.addEventListener('pointercancel', endDrag);
		track.addEventListener('lostpointercapture', endDrag);
		track.addEventListener('click', function (e) {
			if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
		}, true);
		track.addEventListener('dragstart', function (e) { e.preventDefault(); });   // no ghost-image drag
	});
})();
