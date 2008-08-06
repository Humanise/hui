In2iGui.Overlay = function(element,name,options) {
	this.element = $(element);
	this.content = this.element.select('div.in2igui_inner_overlay')[1];
	this.name = name;
	this.icons = new Hash();
	this.visible = false;
	In2iGui.extend(this);
}

In2iGui.Overlay.create = function(name,options) {
	var element = new Element('div').addClassName('in2igui_overlay').setStyle({'display':'none'});
	element.update('<div class="in2igui_inner_overlay"><div class="in2igui_inner_overlay"></div></div>');
	document.body.appendChild(element);
	return new In2iGui.Overlay(element,name);
}

In2iGui.Overlay.prototype = {
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
		In2iGui.positionAtElement(this.element,element,options);
		if (this.visible) return;
		this.element.setStyle({'display':'block','opacity':0});
		$ani(this.element,'opacity',1,300);
		this.visible = true;
		return;
	},
	hide : function() {
		this.element.setStyle({'display':'none'});
		this.visible = false;
	}
}

/* EOF */
