In2iGui.Formula = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.inputs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.create = function(opts) {
	var options = {name:null};
	N2i.override(options,opts);
	var element = N2i.create('form',
		{'class':'in2igui_formula'}
	);
	return new In2iGui.Formula(element,options.name);
}

In2iGui.Formula.prototype.addBehavior = function() {
	var self = this;
	this.element.onsubmit=function() {
		In2iGui.callDelegates(self,'submit');
		return false
	};
}

In2iGui.Formula.prototype.getElement = function() {
	return this.element;
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

In2iGui.Formula.prototype.addContent = function(node) {
	this.element.appendChild(node);
}

/********************** Group **********************/


In2iGui.Formula.Group = function(elementOrId,name,opts) {
	this.name = name;
	this.element = $id(elementOrId);
	this.options = {above:true};
	N2i.override(this.options,opts);
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Group.prototype.getElement = function() {
	return this.element;
}

In2iGui.Formula.Group.create = function(opts) {
	var options = {name:null};
	N2i.override(options,opts);
	var element = N2i.create('table',
		{'class':'in2igui_formula_group'}
	);
	return new In2iGui.Formula.Group(element,options.name,options);
}

In2iGui.Formula.Group.prototype.addWidget = function(widget) {
	var tr = N2i.create('tr');
	this.element.appendChild(tr);
	var th = N2i.create('th');
	th.appendChild(widget.getLabel());
	tr.appendChild(th);
	var td = N2i.create('td');
	td.appendChild(widget.getElement());
	if (this.options.above) {
		var tr = N2i.create('tr');
		this.element.appendChild(tr);
	}
	tr.appendChild(td);
}

/********************** Text ***********************/

In2iGui.Formula.Text = function(elementOrId,name,options) {
	//this.id = id;
	this.name = name;
	this.options = options;
	this.element = $id(elementOrId);
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Text.create = function(opts) {
	var options = {name:null,lines:1};
	N2i.override(options,opts);
	if (options.lines>1) {
		var element = N2i.create('textarea',
			{'class':'in2igui_formula_text','rows':options.lines}
		);		
	} else {
		var element = N2i.create('input',
			{'class':'in2igui_formula_text'}
		);		
	}
	return new In2iGui.Formula.Text(element,options.name,options);
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

In2iGui.Formula.Text.prototype.focus = function() {
	try {
		this.element.focus();
	} catch (ignore) {}
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

In2iGui.Formula.Text.prototype.getElement = function() {
	return this.element;
}

In2iGui.Formula.Text.prototype.getLabel = function() {
	if (!this.label) {
		this.label = N2i.create('label');
		this.label.innerHTML = this.options.label;
	}
	return this.label;
}


/********************************* Radio buttons ****************************/

In2iGui.Formula.Radiobuttons = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.radios = [];
	this.value = options.value;
	this.defaultValue = this.value;
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Radiobuttons.prototype = {
	click : function() {
		this.value = !this.value;
		this.updateUI();
	},
	updateUI : function() {
		for (var i=0; i < this.radios.length; i++) {
			var radio = this.radios[i];
			N2i.setClass(radio.id,'selected',radio.value==this.value);
		};
	},
	setValue : function(value) {
		this.value = value;
		this.updateUI();
	},
	getValue : function() {
		return this.value;
	},
	reset : function() {
		this.setValue(this.defaultValue);
	},
	registerRadiobutton : function(radio) {
		this.radios.push(radio);
		var element = $id(radio.id);
		var self = this;
		element.onclick = function() {
			self.setValue(radio.value);
		}
	}
}


/********************************* Checkboxes ****************************/

In2iGui.Formula.Checkbox = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.value = options.value=='true';
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Formula.Checkbox.prototype = {
	addBehavior : function() {
		var control = $firstClass('check',this.element);
		var self = this;
		control.onclick = function() {self.click()};
	},
	click : function() {
		this.value = !this.value;
		this.updateUI();
	},
	updateUI : function() {
		N2i.setClass(this.element,'checked',this.value);
	},
	setValue : function(value) {
		this.value = value;
		this.updateUI();
	},
	getValue : function() {
		return this.value;
	},
	reset : function() {
		this.setValue(false);
	}
}

/********************************* Checkboxes ****************************/

In2iGui.Formula.Checkboxes = function(id,name) {
	this.element = $id(id);
	this.name = name;
	this.checkboxes = [];
	this.sources = [];
	this.values = [];
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Checkboxes.prototype.getValues = function() {
	return this.values;
}

In2iGui.Formula.Checkboxes.prototype.checkValues = function() {
	var newValues = [];
	for (var i=0; i < this.values.length; i++) {
		var value = this.values[i];
		var found = false;
		for (var j=0; j < this.sources.length; j++) {
			found = found || this.sources[j].hasValue(value);
		};
		if (found) {
			newValues.push(value);
		}
	};
	this.values=newValues;
}

In2iGui.Formula.Checkboxes.prototype.setValues = function(values) {
	this.values=values;
	this.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.prototype.flipValue = function(value) {
	N2i.flipInArray(this.values,value);
	this.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.prototype.updateUI = function() {
	for (var i=0; i < this.sources.length; i++) {
		this.sources[i].updateUI();
	};
}

In2iGui.Formula.Checkboxes.prototype.refresh = function() {
	for (var i=0; i < this.sources.length; i++) {
		this.sources[i].refresh();
	};
}

In2iGui.Formula.Checkboxes.prototype.reset = function() {
	this.setValues([]);
}

In2iGui.Formula.Checkboxes.prototype.registerSource = function(source) {
	source.parent = this;
	this.sources.push(source);
}

In2iGui.Formula.Checkboxes.prototype.itemWasClicked = function(item) {
	this.changeValue(item.in2iGuiValue);
}

/******************************** Source ****************************/

In2iGui.Formula.Checkboxes.Source = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.parent = null;
	this.options = options;
	this.checkboxes = [];
	In2iGui.enableDelegating(this);
	var self = this;
	N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Formula.Checkboxes.Source.prototype.refresh = function() {
	var self = this;
	$get(this.options.url,{onSuccess:function(t) {self.update(t.responseXML)}});
}

In2iGui.Formula.Checkboxes.Source.prototype.update = function(doc) {
	this.checkboxes = [];
	N2i.removeChildren(this.element);
	var self = this;
	var items = doc.getElementsByTagName('checkbox');
	for (var i=0; i < items.length; i++) {
		var item = items[i];
		var node = N2i.create('div',{'class':'checkbox'});
		var label = item.getAttribute('label');
		var value = item.getAttribute('value');
		var check = N2i.create('div',{'class':'check'});
		node.appendChild(check);
		node.appendChild(document.createTextNode(label));
		this.element.appendChild(node);
		node.in2iGuiValue = value;
		node.onclick = function() {
			self.itemWasClicked(this);
		}
		this.checkboxes.push({label:label,element:node,value:value});
	};
	if (items.length==0) {
		this.element.innerHTML='&nbsp;';
	}
	this.parent.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.Source.prototype.itemWasClicked = function(node) {
	this.parent.flipValue(node.in2iGuiValue);
}

In2iGui.Formula.Checkboxes.Source.prototype.updateUI = function() {
	for (var i=0; i < this.checkboxes.length; i++) {
		var item = this.checkboxes[i];
		N2i.setClass(item.element,'checked',N2i.inArray(this.parent.values,item.value));
	};
}


In2iGui.Formula.Checkboxes.Source.prototype.hasValue = function(value) {
	for (var i=0; i < this.checkboxes.length; i++) {
		if (this.checkboxes[i].value==value) {
			return true;
		}
	};
	return false;
}

