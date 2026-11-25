/* =======================================================================
   RSQUARED HOLDING — CONTACT + FOOTER behaviour
   - Contact form: the site is static, so on submit it opens the visitor's
     email app with a pre-filled message to the group's address.
     (Swap this for a real form endpoint when one exists.)
   - Footer: current year + back-to-top button.
   ======================================================================= */
(function () {
	'use strict';

	/* ---- Contact form -> mailto ---- */
	var form = document.querySelector('[data-r2-contact-form]');
	if (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (!form.reportValidity()) return;

			var v = function (name) {
				var el = form.elements[name];
				return el ? String(el.value || '').trim() : '';
			};
			var to = form.getAttribute('data-to');
			var topic = v('topic');
			var subject = 'Website enquiry' + (topic ? ' — ' + topic : '') + ' — ' + v('name');
			var body = [
				v('message'),
				'',
				'—',
				'Name: ' + v('name'),
				'Email: ' + v('email'),
				v('phone') ? 'Phone: ' + v('phone') : '',
				v('company') ? 'Company: ' + v('company') : '',
				topic ? 'Regarding: ' + topic : ''
			].filter(function (line, i) { return line !== '' || i === 1; }).join('\n');

			window.location.href = 'mailto:' + to +
				'?subject=' + encodeURIComponent(subject) +
				'&body=' + encodeURIComponent(body);

			var status = form.querySelector('.r2-form__status');
			if (status) status.textContent = 'Your email app should open with the message ready to send.';
		});
	}

	/* ---- Footer: year ---- */
	document.querySelectorAll('[data-r2-year]').forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});

	/* ---- Footer: back to top ---- */
	document.querySelectorAll('[data-r2-totop]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
		});
	});
})();
