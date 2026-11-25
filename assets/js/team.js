/* =======================================================================
   RSQUARED HOLDING — OUR TEAM: credentials dialogs
   Buttons with [data-r2-dialog="id"] open the matching <dialog>.
   Closes on the close button, Esc (native) or a click on the backdrop.
   ======================================================================= */
(function () {
	'use strict';

	document.querySelectorAll('[data-r2-dialog]').forEach(function (btn) {
		var dialog = document.getElementById(btn.getAttribute('data-r2-dialog'));
		if (!dialog || typeof dialog.showModal !== 'function') {
			btn.hidden = true;           // very old browsers: hide the trigger
			return;
		}
		btn.addEventListener('click', function () {
			dialog.showModal();
			document.body.classList.add('r2-lock');
		});
		dialog.addEventListener('close', function () {
			document.body.classList.remove('r2-lock');
			btn.focus();
		});
		dialog.addEventListener('click', function (e) {
			if (e.target === dialog) dialog.close();    // backdrop click
		});
		dialog.querySelectorAll('[data-r2-close]').forEach(function (c) {
			c.addEventListener('click', function () { dialog.close(); });
		});
	});
})();
