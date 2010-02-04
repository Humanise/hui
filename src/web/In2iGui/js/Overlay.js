/**
 * @constructor
 */
In2iGui.Overlay = function(options) {
	this.element = $(options.element);
	this.content = this.element.select('div.in2igui_inner_overlay')[1];
	this.name = options.name;
	this.icons = new Hash();
	this.visible = false;
	In2iGui.extend(this);
	this.addBehavior();
}

/**
 * Creates a new overlay
 */
In2iGui.Overlay.create = function(options) {
	options = options || {};
	var e = options.element = new Element('div').addClassName('in2igui_overlay').setStyle({'display':'none'});
	e.update('<div class="in2igui_inner_overlay"><div class="in2igui_inner_overlay"></div></div>');
	document.body.appendChild(e);
	return new In2iGui.Overlay(options);
}

In2iGui.Overlay.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		this.hider = function(e) {
			if (self.boundElement) {
				if (In2iGui.isWithin(e,self.boundElement) || In2iGui.isWithin(e,self.element)) return;
				// TODO: should be unreg'ed but it fails
				//self.boundElement.stopObserving(self.hider);
				self.boundElement.removeClassName('in2igui_overlay_bound');
				self.boundElement = null;
				self.hide();
			}
		}
		this.element.observe('mouseout',this.hider);
	},
	addIcon : function(key,icon) {
		var self = this;
		var element = new Element('div').addClassName('in2igui_overlay_icon');
		element.setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(icon,2)+')'});
		element.observe('click',function(e) {
			self.iconWasClicked(key,e);
		});
		this.icons.set(key,element);
		this.content.insert(element);
	},
	hideIcons : function(keys) {
		var self = this;
		keys.each(function(key) {
			self.icons.get(key).hide();
		});
	},
	showIcons : function(keys) {
		var self = this;
		keys.each(function(key) {
			self.icons.get(key).show();
		});
	},
	iconWasClicked : function(key,e) {
		In2iGui.callDelegates(this,'iconWasClicked',key,e);
	},
	showAtElement : function(element,options) {
		options = options || {};
		In2iGui.positionAtElement(this.element,element,options);
		if (this.visible) return;
		if (n2i.browser.msie) {
			this.element.setStyle({'display':'block'});
		} else {
			this.element.setStyle({'display':'block','opacity':0});
			n2i.ani(this.element,'opacity',1,150);
		}
		this.visible = true;
		if (options.autoHide) {
			this.boundElement = element;
			element.observe('mouseout',this.hider);
			element.addClassName('in2igui_overlay_bound');
		}
		return;
	},
	hide : function() {
		this.element.setStyle({'display':'none'});
		this.visible = false;
	}
}

/* EOF */
