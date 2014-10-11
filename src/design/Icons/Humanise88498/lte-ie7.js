/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Humanise\'">' + entity + '</span>' + html;
	}
	var icons = {
			'hui_font_arrow_right' : '&#x3e;',
			'hui_font_arrow_left' : '&#x3c;',
			'hui_font_download' : '&#x64;',
			'hui_font_expand' : '&#x78;',
			'hui_font_user' : '&#x75;',
			'hui_font_onlineobjects' : '&#xa4;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/hui_font_[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};