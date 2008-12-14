In2iGui.Button = function(id,name) {
	this.name = name;
	this.element = $(id);
	this.inner = this.element.getElementsByTagName('span')[1];
	this.enabled = true;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Button.create = function(name,opts) {
	var options = {text:'',highlighted:false};
	n2i.override(options,opts);
	var className = 'in2igui_button'+(options.highlighted ? ' in2igui_button_highlighted' : '');
	var element = new Element('a',{'class':className,href:'#'});
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
	if (options.title && options.title.length>0) {
		element3.insert(options.title);
	}
	return new In2iGui.Button(element,name);
}

In2iGui.Button.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.clicked();
			return false;
		}
	},
	clicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'buttonWasClicked'); // deprecated
			In2iGui.callDelegates(this,'click');
			In2iGui.callDelegates(this,'onClick');
		}
	},
	setEnabled : function(enabled) {
		this.enabled = enabled;
		this.updateUI();
	},
	setHighlighted : function(highlighted) {
		this.element.setClassName('in2igui_button_highlighted',highlighted);
	},
	updateUI : function() {
		this.element.setClassName('in2igui_button_disabled',!this.enabled);
	},
	setText : function(text) {
		this.inner.innerHTML = text;
	}
}

In2iGui.Buttons = function(id,name) {
	this.name = name;
	this.element = $(id);
	this.body = this.element.select('.in2igui_buttons_body')[0];
	In2iGui.extend(this);
}

In2iGui.Buttons.create = function(name,options) {
	options = n2i.override({top:0},options);
	var e = new Element('div',{'class':'in2igui_buttons'});
	if (options.top>0) e.setStyle({paddingTop:options.top+'px'});
	e.insert(new Element('div',{'class':'in2igui_buttons_body'}));
	return new In2iGui.Buttons(e,name);
}

In2iGui.Buttons.prototype = {
	add : function(widget) {
		this.body.insert(widget.getElement());
	}
}

/* EOF */