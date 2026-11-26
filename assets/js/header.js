/* =======================================================================
   RSQUARED HOLDING — NAVBAR behaviour (vanilla JS, no dependencies)
   - solid navbar after scrolling past the top of the hero
   - mobile menu toggle (Esc / link click closes, body scroll lock)
   - "Businesses" dropdown toggle for click / touch / keyboard
   - highlights the nav link of the section currently in view
   ======================================================================= */
(function () {
	'use strict';

	var nav = document.querySelector('.r2-nav');
	if (!nav) return;

	var burger = nav.querySelector('.r2-burger');
	var dropdowns = nav.querySelectorAll('.r2-has-dropdown');
	var mobileQuery = window.matchMedia('(max-width: 991.98px)');

	/* ---- Scrolled state ---- */
	function onScroll() {
		nav.classList.toggle('is-scrolled', window.scrollY > 24);
	}
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	/* ---- Mobile menu ---- */
	function setMenu(open) {
		nav.classList.toggle('is-menu-open', open);
		document.body.classList.toggle('r2-lock', open);
		if (burger) {
			burger.setAttribute('aria-expanded', String(open));
			burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		}
		if (!open) closeDropdowns();
	}
	if (burger) {
		burger.addEventListener('click', function () {
			setMenu(!nav.classList.contains('is-menu-open'));
		});
	}
	mobileQuery.addEventListener
		? mobileQuery.addEventListener('change', function () { setMenu(false); })
		: mobileQuery.addListener(function () { setMenu(false); });

	/* ---- Dropdowns ---- */
	function closeDropdowns(except) {
		dropdowns.forEach(function (dd) {
			if (dd === except) return;
			dd.classList.remove('is-open');
			var t = dd.querySelector('[aria-expanded]');
			if (t) t.setAttribute('aria-expanded', 'false');
		});
	}
	dropdowns.forEach(function (dd) {
		var toggle = dd.querySelector('.r2-nav__link');
		toggle.addEventListener('click', function (e) {
			e.preventDefault();
			var open = !dd.classList.contains('is-open');
			closeDropdowns(dd);
			dd.classList.toggle('is-open', open);
			toggle.setAttribute('aria-expanded', String(open));
		});
	});
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.r2-has-dropdown')) closeDropdowns();
	});

	/* ---- Close everything on navigation / Esc ---- */
	// (the "Businesses" toggle is also an <a href="#…">, but it only opens the dropdown)
	nav.querySelectorAll('a[href^="#"]:not([aria-haspopup])').forEach(function (a) {
		a.addEventListener('click', function () {
			closeDropdowns();
			if (nav.classList.contains('is-menu-open')) setMenu(false);
		});
	});
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		closeDropdowns();
		if (nav.classList.contains('is-menu-open')) {
			setMenu(false);
			burger && burger.focus();
		}
	});

	/* ---- Active section highlighting ---- */
	if (!('IntersectionObserver' in window)) return;
	var links = {};
	nav.querySelectorAll('[data-section]').forEach(function (el) {
		el.getAttribute('data-section').split(' ').forEach(function (id) {
			(links[id] = links[id] || []).push(el);
		});
	});
	var all = nav.querySelectorAll('[data-section]');
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			all.forEach(function (el) { el.classList.remove('is-active'); });
			(links[entry.target.id] || []).forEach(function (el) { el.classList.add('is-active'); });
		});
	}, { rootMargin: '-45% 0px -50% 0px' });
	Object.keys(links).forEach(function (id) {
		var section = document.getElementById(id);
		if (section) io.observe(section);
	});
})();
