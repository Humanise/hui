In2iGui.Formula = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.inputs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.prototype.addBehavior = function() {
	
}

In2iGui.Formula.prototype.registerInput = function(obj) {
	this.inputs[this.inputs.length] = obj;
}

In2iGui.Formula.prototype.getValues = function() {
	var data = {};
	for (var i=0; i < this.inputs.length; i++) {
		if (this.inputs[i].name) {
			data[this.inputs[i].name] = this.inputs[i].getValue();
		}
	};
	return data;
}

In2iGui.Formula.prototype.reset = function() {
	for (var i=0; i < this.inputs.length; i++) {
		this.inputs[i].reset();
	}
}

/********************** Text ***********************/

In2iGui.Formula.Text = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Text.prototype.updateFromNode = function(node) {
	if (node.firstChild) {
		this.setValue(node.firstChild.nodeValue);
	} else {
		this.setValue(null);
	}
}

In2iGui.Formula.Text.prototype.updateFromObject = function(data) {
	this.setValue(data.value);
}

In2iGui.Formula.Text.prototype.reset = function() {
	this.setValue('');
}

In2iGui.Formula.Text.prototype.setValue = function(value) {
	this.element.value = value;
}

In2iGui.Formula.Text.prototype.getValue = function() {
	return this.element.value;
}

/********************** Button ***********************/

In2iGui.Formula.Button = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Formula.Button.prototype.addBehavior = function() {
	var self = this;
	this.element.onclick = function() {
		self.clicked();
	}
}

In2iGui.Formula.Button.prototype.clicked = function() {
	In2iGui.callDelegates(this,'buttonWasClicked');
}