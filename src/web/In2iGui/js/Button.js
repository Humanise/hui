In2iGui.Button = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.enabled = true;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Button.create = function(opts) {
	var options = {text:'Button',name:null,highlighted:false};
	N2i.override(options,opts);
	var className = 'in2igui_button'+(options.highlighted ? ' in2igui_button_highlighted' : '');
	var element = N2i.create('span',{'class':className});
	var element2 = N2i.create('span');
	element.appendChild(element2);
	var element3 = N2i.create('span');
	element2.appendChild(element3);
	element3.innerHTML = options.text;
	return new In2iGui.Button(element,options.name);
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
	updateUI : function() {
		N2i.setClass(this.element,'in2igui_button_disabled',!this.enabled);
	}
}