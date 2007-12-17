In2iGui.Button = function(id,name) {
	N2i.log(name);
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Button.create = function(opts) {
	var options = {text:'Button',name:null};
	N2i.override(options,opts);
	
	var element = N2i.create('div',{'class':'in2igui_button'});
	var element2 = N2i.create('div');
	element.appendChild(element2);
	var element3 = N2i.create('div');
	element2.appendChild(element3);
	element3.innerHTML = options.text;
	return new In2iGui.Button(element,options.name);
}

In2iGui.Button.prototype.getElement = function() {
	return this.element;
}

In2iGui.Button.prototype.addBehavior = function() {
	var self = this;
	this.element.onclick = function() {
		self.clicked();
	}
}

In2iGui.Button.prototype.clicked = function() {
	In2iGui.callDelegates(this,'buttonWasClicked');
}