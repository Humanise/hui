
/** @constructor */
hui.ui.Toolbar = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.Toolbar.create = function(options) {
	options = options || {};
	var element = options.element = hui.build('div.hui_toolbar');
  if (options.labels===false) {
    hui.cls.add(element,'hui_toolbar-nolabels');
  }
  if (options.variant) {
    hui.cls.add(element,'hui_toolbar-'+options.variant);
  }
	return new hui.ui.Toolbar(options);
}

hui.ui.Toolbar.prototype = {
	add : function(widget) {
		this.element.appendChild(widget.getElement());
	},
	addDivider : function() {
		this.element.appendChild(hui.build('span.hui_toolbar_divider'));
	},
	setSelection : function(key) {
		var desc = hui.ui.getDescendants(this);
		for (var i=0; i < desc.length; i++) {
			var widget = desc[i];
			if (widget.setSelected) {
				widget.setSelected(widget.key==key);
			}
		};
	},
	getByKey : function(key) {
		var desc = hui.ui.getDescendants(this);
		for (var i=0; i < desc.length; i++) {
			var widget = desc[i];
			if (widget.key==key) {
				return widget;
			}
		};
	}
}



/////////////////////// Icon ///////////////////

/** @constructor */
hui.ui.Toolbar.Icon = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.key = options.key;
	this.enabled = !hui.cls.has(this.element,'hui_toolbar_icon_disabled');
	this.element.tabIndex=this.enabled ? 0 : -1;
	this.icon = hui.get.firstByClass(this.element,'hui_icon');
	hui.ui.extend(this);
  if (options.listener) {
    this.listen(options.listener);
  }
	this._attach();
}

hui.ui.Toolbar.Icon.create = function(options) {
	var element = options.element = hui.build('a.hui_toolbar_icon');
	var icon = hui.build('span.hui_icon',{style:'background-image: url('+hui.ui.getIconUrl(options.icon,32)+')', parent: element});
	if (options.overlay) {
		hui.build('span.hui_icon_overlay',{parent:icon,style:'background-image: url('+hui.ui.getIconUrl('overlay/'+options.overlay,32)+')'});
	}
	hui.build('span.hui_toolbar_icon_text',{text:options.title || options.text, parent:element});
	return new hui.ui.Toolbar.Icon(options);
}

hui.ui.Toolbar.Icon.prototype = {
	_attach : function() {
		var self = this;
		this.element.onclick = function() {
			self._click();
		}
	},
	/** Sets wether the icon should be enabled */
	setEnabled : function(enabled) {
		this.enabled = enabled;
		this.element.tabIndex=enabled ? 0 : -1;
		hui.cls.set(this.element,'hui_toolbar_icon_disabled',!this.enabled);
	},
	/** Disables the icon */
	disable : function() {
		this.setEnabled(false);
	},
	/** Enables the icon */
	enable : function() {
		this.setEnabled(true);
	},
	setOverlay : function(overlay) {
		var node = hui.get.firstByClass(this.element,'hui_icon_overlay');
		if (node && !overlay) {
			node.style.backgroundImage = '';
		} else if (node && overlay) {
			node.style.backgroundImage = "url('"+hui.ui.getIconUrl('overlay/'+overlay,32)+"')";
		} else if (overlay) {
			var parent = hui.get.firstByClass(this.element,'hui_icon');
			hui.build('span',{'class':'hui_icon_overlay',parent:parent,style:'background-image: url('+hui.ui.getIconUrl('overlay/'+overlay,32)+')'});
		}
	},
	setBadge : function(value) {
		var node = hui.get.firstByClass(this.element,'hui_icon_badge');
		if (!node && !hui.isBlank(value)) {
			node = hui.build('span',{'class':'hui_icon_badge',parent:hui.get.firstByClass(this.element,'hui_icon'),text:value});
		} else if (hui.isBlank(value) && node) {
			hui.dom.remove(node);
		} else if (node) {
			hui.dom.setText(node,value);
		}
	},
	setLabel : function(label) {
		var e = hui.get.firstByTag(this.element,'strong');
		hui.dom.setText(e,label);
	},
	setIcon : function(icon) {
		var e = hui.get.firstByClass(this.element,'hui_icon');
		e.style.backgroundImage = 'url('+hui.ui.getIconUrl(icon,32)+')';
	},
	/** Sets wether the icon should be selected */
	setSelected : function(selected) {
		if (selected) {
			this.element.blur();
		}
		hui.cls.set(this.element,'hui_toolbar_icon_selected',selected);
	},
	/** @private */
	_click : function() {
		if (this.enabled) {
			if (this.options.confirm) {
				hui.ui.confirmOverlay({
					widget : this,
					text : this.options.confirm.text,
					okText : this.options.confirm.okText,
					cancelText : this.options.confirm.cancelText,
					onOk : this._fireClick.bind(this)
				});
			} else {
				this._fireClick();
			}
		}
	},
	_fireClick : function() {
		this.fire('toolbarIconWasClicked'); // TODO deprecated
		this.fire('click');
	}
}


//////////////////////// More ///////////////////////

/** @constructor */
hui.ui.Toolbar.More = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	this.button = hui.get.firstByClass(this.element,'hui_toolbar_more_toggle');
	hui.listen(this.button,'click',this.toggle.bind(this));
	hui.ui.extend(this);
}

hui.ui.Toolbar.More.prototype = {
	toggle : function() {
    hui.cls.toggle(this.element,'hui_is_expanded');
	}
}

/* EOF */