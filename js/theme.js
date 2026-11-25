/* =======================================================================
   RSQUARED HOLDING — THEME (light / dark)
   Load in <head> before the stylesheets render, so a saved choice is
   applied before first paint (no flash).
   - Default: follows the operating system, live.
   - Toggle (.r2-theme-toggle): switches and remembers the choice.
   <html> gets:
     data-theme            only when the visitor picked one ("light"|"dark")
     data-theme-effective  always — what is actually showing (for the icon)
   ======================================================================= */
(function () {
	'use strict';

	var KEY = 'r2-theme';
	var root = document.documentElement;
	var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

	var memo = null;   // fallback when localStorage is blocked (this visit only)
	function saved() {
		try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; }
		catch (e) { return memo; }
	}
	function system() { return media && media.matches ? 'dark' : 'light'; }
	function effective() { return saved() || system(); }

	function apply() {
		var choice = saved();
		if (choice) root.setAttribute('data-theme', choice);
		else root.removeAttribute('data-theme');
		var eff = effective();
		root.setAttribute('data-theme-effective', eff);
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', eff === 'dark' ? '#0e0e0e' : '#ffffff');
		document.querySelectorAll('.r2-theme-toggle').forEach(function (btn) {
			var next = eff === 'dark' ? 'light' : 'dark';
			btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
			btn.setAttribute('title', 'Switch to ' + next + ' theme');
			btn.setAttribute('aria-pressed', String(eff === 'dark'));
		});
	}

	apply();   // before first paint

	// Follow the OS while the visitor hasn't chosen.
	if (media) {
		var onChange = function () { if (!saved()) apply(); };
		media.addEventListener ? media.addEventListener('change', onChange) : media.addListener(onChange);
	}

	function toggle() {
		var next = effective() === 'dark' ? 'light' : 'dark';
		// Picking the same as the system clears the override, so the site
		// keeps following the OS from then on.
		var value = next === system() ? null : next;
		try {
			if (value) localStorage.setItem(KEY, value);
			else localStorage.removeItem(KEY);
		} catch (e) {
			memo = value;
		}
		root.classList.add('r2-theme-anim');
		apply();
		setTimeout(function () { root.classList.remove('r2-theme-anim'); }, 400);
	}

	document.addEventListener('click', function (e) {
		var btn = e.target.closest && e.target.closest('.r2-theme-toggle');
		if (btn) toggle();
	});
	document.addEventListener('DOMContentLoaded', apply);   // label buttons once they exist
})();
