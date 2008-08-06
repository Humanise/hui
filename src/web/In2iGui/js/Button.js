In2iGui.Button = function(id,name) {
	this.name = name;
	this.element = $id(id);
	this.inner = this.element.getElementsByTagName('span')[1];
	this.enabled = true;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Button.create = function(name,opts) {
	var options = {text:'',highlighted:false};
	N2i.override(options,opts);
	var className = 'in2igui_button'+(options.highlighted ? ' in2igui_button_highlighted' : '');
	var element = new Element('a',{'class':className});
	var element2 = new Element('span');
	element.appendChild(element2);
	var element3 = new Element('span');
	element2.appendChild(element3);
	if (options.icon) {
		var icon = new Element('em',{'class':'in2igui_button_icon'}).setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(options.icon,1)+')'});
		if (!options.text || options.text.length==0) {
			icon.addClassName('in2igui_button_icon_notext');
		}
		element3.insert(icon);
	}
	if (options.text && options.text.length>0) {
		element3.insert(options.text);
	}
	return new In2iGui.Button(element,name);
}

In2iGui.Button.prototype = {
	getElement : function() {
		return this.element;
	},
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.clicked();
		}
	},
	clicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'buttonWasClicked'); // deprecated
			In2iGui.callDelegates(this,'click');
		}
	},
	setEnabled : function(enabled) {
		this.enabled = enabled;
		this.updateUI();
	},
	setHighlighted : function(highlighted) {
		N2i.setClass(this.element,'in2igui_button_highlighted',highlighted);
	},
	updateUI : function() {
		N2i.setClass(this.element,'in2igui_button_disabled',!this.enabled);
	},
	setText : function(text) {
		this.inner.innerHTML = text;
	}
}

/* EOF */