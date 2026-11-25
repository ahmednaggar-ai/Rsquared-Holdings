/* =======================================================================
   RSQUARED HOLDING — SCROLL REVEAL
   Elements with [data-reveal] fade up the first time they scroll into view.
   Optional: data-reveal-delay=".1s". Styles live in css/base.css.
   ======================================================================= */
(function () {
	'use strict';

	var items = document.querySelectorAll('[data-reveal]');
	if (!items.length || !('IntersectionObserver' in window)) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-revealed');
			io.unobserve(entry.target);
		});
	}, { rootMargin: '0px 0px -8% 0px' });

	items.forEach(function (el) {
		var delay = el.getAttribute('data-reveal-delay');
		if (delay) el.style.setProperty('--r2-reveal-delay', delay);
		io.observe(el);
	});

	// Hide not-yet-seen items only once observing has started.
	document.documentElement.classList.add('r2-reveal-on');
})();
