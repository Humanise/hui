/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'OnlineObjects\'">' + entity + '</span>' + html;
	}
	var icons = {
			'oo_font_arrow_right' : '&#x3e;',
			'oo_font_arrow_left' : '&#x3c;',
			'oo_font_download' : '&#x64;',
			'oo_font_expand' : '&#x78;',
			'oo_font_user' : '&#x75;',
			'oo_font_onlineobjects' : '&#xa4;',
			'oo_font_at' : '&#x40;',
			'oo_font_globe' : '&#x67;',
			'oo_font_envelope' : '&#x65;',
			'oo_font_tag' : '&#x74;',
			'oo_font_globus' : '&#x47;',
			'oo_font_phone' : '&#x70;',
			'oo_font_warning' : '&#x77;',
			'oo_font_camera' : '&#x63;',
			'oo_font_file' : '&#x66;',
			'oo_font_time' : '&#x54;',
			'oo_font_dimensions' : '&#x44;',
			'oo_font_book' : '&#x62;',
			'oo_font_delete' : '&#x2a;',
			'oo_font_share' : '&#x23;',
			'oo_font_album' : '&#x2b;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/oo_font_[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};