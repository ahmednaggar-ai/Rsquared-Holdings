/* =======================================================================
   RSQUARED HOLDING — ANIMATED COUNTERS
   Numbers count up the first time they scroll into view.

   <span data-count="1000"             target value (required)
         data-count-from="0"           start value (default 0; years use value − 40)
         data-count-suffix="+"         text after the number ("+", "K" …)
         data-count-group>             format with thousands separators (1,000)
     1,000+                            ← final text; shown as-is without JS
   </span>

   Skipped entirely with prefers-reduced-motion or without IntersectionObserver.
   ======================================================================= */
(function () {
	'use strict';

	var items = document.querySelectorAll('[data-count]');
	if (!items.length || !('IntersectionObserver' in window)) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var DURATION = 1800;
	var easeOutExpo = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };

	function format(el, value) {
		var n = Math.round(value);
		var text = el.hasAttribute('data-count-group') ? n.toLocaleString('en-US') : String(n);
		return text + (el.getAttribute('data-count-suffix') || '');
	}

	function run(el) {
		var to = parseFloat(el.getAttribute('data-count'));
		var from = parseFloat(el.getAttribute('data-count-from') || '0');
		if (isNaN(to)) return;

		// Lock the final width so the layout doesn't shift while digits change.
		el.style.display = 'inline-block';
		el.style.minWidth = el.getBoundingClientRect().width + 'px';

		var start = null;
		function frame(now) {
			if (start === null) start = now;
			var t = Math.min(1, (now - start) / DURATION);
			el.textContent = format(el, from + (to - from) * easeOutExpo(t));
			if (t < 1) requestAnimationFrame(frame);
			else el.textContent = format(el, to);
		}
		el.textContent = format(el, from);
		requestAnimationFrame(frame);
	}

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			io.unobserve(entry.target);
			run(entry.target);
		});
	}, { threshold: 0.6 });

	items.forEach(function (el) { io.observe(el); });
})();
