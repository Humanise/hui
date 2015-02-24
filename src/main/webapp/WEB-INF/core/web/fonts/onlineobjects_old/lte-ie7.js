/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'OnlineObjects\'">' + entity + '</span>' + html;
	}
	var icons = {
			'oo_icon_arrow_right' : '&#x3e;',
			'oo_icon_arrow_left' : '&#x3c;',
			'oo_icon_download' : '&#x64;',
			'oo_icon_expand' : '&#x78;',
			'oo_icon_user' : '&#x75;',
			'oo_icon_onlineobjects' : '&#xa4;',
			'oo_icon_at' : '&#x40;',
			'oo_icon_globe' : '&#x67;',
			'oo_icon_envelope' : '&#x65;',
			'oo_icon_tag' : '&#x74;',
			'oo_icon_globus' : '&#x47;',
			'oo_icon_phone' : '&#x70;',
			'oo_icon_warning' : '&#x77;',
			'oo_icon_camera' : '&#x63;',
			'oo_icon_file' : '&#x66;',
			'oo_icon_time' : '&#x54;',
			'oo_icon_dimensions' : '&#x44;',
			'oo_icon_book' : '&#x62;',
			'oo_icon_delete' : '&#x2a;',
			'oo_icon_share' : '&#x23;',
			'oo_icon_album' : '&#x6c;',
			'oo_icon_add' : '&#x2b;',
			'oo_icon_edit' : '&#x3d;',
			'oo_icon_present' : '&#x21;',
			'oo_icon_info' : '&#x69;',
			'oo_icon_photos' : '&#x5e;',
			'oo_icon_close' : '&#x6b;',
			'oo_icon_gear' : '&#x22;',
			'oo_icon_info_light' : '&#x27;',
			'oo_icon_first' : '&#x28;',
			'oo_icon_statistics' : '&#x25;',
			'oo_icon_search' : '&#x24;',
			'oo_icon_marker' : '&#x26;',
			'oo_icon_inbox' : '&#x29;',
			'oo_icon_locked' : '&#x2c;',
			'oo_icon_support' : '&#x2d;',
			'oo_icon_list_bullet' : '&#x2e;',
			'oo_icon_humanise' : '&#x2f;'
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
		c = c.match(/oo_icon_[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};