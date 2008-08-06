In2iGui.Formula = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.inputs = [];
	this.children = [];
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

In2iGui.Formula.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onsubmit=function() {
			In2iGui.callDelegates(self,'submit');
			return false
		};
	},
	getElement : function() {
		return this.element;
	},
	registerInput : function(obj) {
		this.inputs[this.inputs.length] = obj;
	},
	registerChild : function(obj) {
		alert(obj);
		this.children.push(obj);
	},
	getValues : function() {
		var data = {};
		for (var i=0; i < this.inputs.length; i++) {
			if (this.inputs[i].options.key) {
				data[this.inputs[i].options.key] = this.inputs[i].getValue();
			} else if (this.inputs[i].name) {
				data[this.inputs[i].name] = this.inputs[i].getValue();
			}
		};
		return data;
	},
	setValues : function(values) {
		for (var i=0; i < this.inputs.length; i++) {
			var key = this.inputs[i].options.key;
			if (key && values[key]) {
				this.inputs[i].setValue(values[key]);
			}
		}
	},
	reset : function() {
		for (var i=0; i < this.inputs.length; i++) {
			this.inputs[i].reset();
		}
	},
	addContent : function(node) {
		this.element.appendChild(node);
	}
}

/********************** Group **********************/


In2iGui.Formula.Group = function(elementOrId,name,opts) {
	this.name = name;
	this.element = $(elementOrId);
	this.options = {above:true};
	N2i.override(this.options,opts);
	In2iGui.extend(this);
}

In2iGui.Formula.Group.create = function(name,opts) {
	var options = {};
	N2i.override(options,opts);
	var element = new Element('table',
		{'class':'in2igui_formula_group'}
	);
	return new In2iGui.Formula.Group(element,name,options);
}

In2iGui.Formula.Group.prototype = {
	add : function(widget) {
		var tr = new Element('tr');
		this.element.insert(tr);
		var label = widget.getLabel();
		if (label) {
			var th = new Element('th');
			th.insert(new Element('label').insert(label));
			tr.insert(th);
		}
		var td = new Element('td');
		td.insert(widget.getElement());
		if (this.options.above) {
			var tr = new Element('tr');
			this.element.insert(tr);
		}
		tr.insert(td);
	}
}

/********************** Text ***********************/

In2iGui.Formula.Text = function(element,name,options) {
	this.name = name;
	this.options = {label:null,key:null};
	N2i.override(this.options,options);
	this.element = $(element);
	this.input = this.element.select('.in2igui_formula_text')[0];
	In2iGui.extend(this);
}

In2iGui.Formula.Text.create = function(name,opts) {
	var options = {lines:1};
	N2i.override(options,opts);
	if (options.lines>1) {
		var input = N2i.create('textarea',
			{'class':'in2igui_formula_text','rows':options.lines}
		);
	} else {
		var input = N2i.create('input',
			{'class':'in2igui_formula_text'}
		);		
	}
	var element = N2i.create('div',{'class':'in2igui_field'});
	element.appendChild(input);
	return new In2iGui.Formula.Text(element,name,options);
}

In2iGui.Formula.Text.prototype = {
	updateFromNode : function(node) {
		if (node.firstChild) {
			this.setValue(node.firstChild.nodeValue);
		} else {
			this.setValue(null);
		}
	},
	updateFromObject : function(data) {
		this.setValue(data.value);
	},
	focus : function() {
		try {
			this.element.focus();
		} catch (ignore) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		this.input.value = value;
	},
	getValue : function() {
		return this.input.value;
	},
	getLabel : function() {
		return this.options.label;
	},
	isEmpty : function() {
		return N2i.isEmpty(this.input.value);
	}
}

/********************** Dat time ***********************/

In2iGui.Formula.DateTime = function(elementOrId,name,options) {
	this.inputFormats = ['d-m-Y','d/m-Y','d/m/Y','d-m-Y H:i:s','d/m-Y H:i:s','d/m/Y H:i:s','d-m-Y H:i','d/m-Y H:i','d/m/Y H:i','d-m-Y H','d/m-Y H','d/m/Y H','d-m','d/m','d','Y','m-d-Y','m-d','m/d'];
	this.outputFormat = 'd-m-Y H:i:s';
	//this.id = id;
	this.name = name;
	this.options = options;
	this.value = null;
	this.element = $id(elementOrId);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Formula.DateTime.create = function(name,opts) {
	var options = {};
	N2i.override(options,opts);
	var element = N2i.create('input',
		{'class':'in2igui_formula_text'}
	);
	return new In2iGui.Formula.DateTime(element,name,options);
}

In2iGui.Formula.DateTime.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onblur = function() {
			self.check();
		}
	},
	updateFromNode : function(node) {
		if (node.firstChild) {
			this.setValue(node.firstChild.nodeValue);
		} else {
			this.setValue(null);
		}
	},
	updateFromObject : function(data) {
		this.setValue(data.value);
	},
	focus : function() {
		try {this.element.focus();} catch (ignore) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		if (!value) {
			this.value = null;
		} else {
			this.value = new Date();
			this.value.setTime(parseInt(value)*1000);
		}
		this.updateUI();
	},
	check : function() {
		var str = this.element.value;
		var parsed = null;
		for (var i=0; i < this.inputFormats.length && parsed==null; i++) {
			parsed = Date.parseDate(str,this.inputFormats[i]);
		};
		this.value = parsed;
		this.updateUI();
	},
	getValue : function() {
		return (this.value!=null ? Math.round(this.value.getTime()/1000) : null);
	},
	getElement : function() {
		return this.element;
	},
	getLabel : function() {
		if (!this.label) {
			this.label = N2i.create('label');
			this.label.innerHTML = this.options.label;
		}
		return this.label;
	},
	updateUI : function() {
		if (this.value) {
			this.element.value = this.value.dateFormat(this.outputFormat);
		} else {
			this.element.value = ''
		}
	}
}

/************************************* Select *******************************/

In2iGui.Formula.Select = function(elementOrId,name,options) {
	this.name = name;
	this.options = options;
	this.element = $id(elementOrId);
	this.value = null;
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.Formula.Select.prototype = {
	refresh : function() {
		if (this.options.source) {
			var self = this;
			$get(this.options.source,{onSuccess:function(t) {self.update(t.responseXML)}});
		}
	},
	update : function(doc) {
		for (var i = this.element.options.length - 1; i >= 0; i--){
			this.element.remove(i);
		};
		var items = doc.getElementsByTagName('item');
		for (var i=0; i < items.length; i++) {
			var title = items[i].getAttribute('title');
			var value = items[i].getAttribute('value');
			this.element.options[this.element.options.length] = new Option(title,value);
		};
		this.setValue(this.value);
	},
	reset : function() {
		this.element.selectedIndex = 0;
		this.value = null;
	},
	setValue : function(value) {
		value=value+'';
		for (var i=0; i < this.element.options.length; i++) {
			if (this.element.options[i].value==value) {
				this.element.selectedIndex = i;
				this.value = value;
				return;
			}
		};
		if (this.element.options.length==0) {
			this.value = null;
		} else {
			this.element.selectedIndex = 0;
			this.value = this.element.options[0].value;
		}
	},
	getValue : function(value) {
		return this.element.value;
	}
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

In2iGui.Formula.Checkboxes.prototype = {
	getValues : function() {
		return this.values;
	},
	checkValues : function() {
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
	},
	setValues : function(values) {
		this.values=values;
		this.checkValues();
		this.updateUI();
	},
	flipValue : function(value) {
		N2i.flipInArray(this.values,value);
		this.checkValues();
		this.updateUI();
	},
	updateUI : function() {
		for (var i=0; i < this.sources.length; i++) {
			this.sources[i].updateUI();
		};
	},
	refresh : function() {
		for (var i=0; i < this.sources.length; i++) {
			this.sources[i].refresh();
		};
	},
	reset : function() {
		this.setValues([]);
	},
	registerSource : function(source) {
		source.parent = this;
		this.sources.push(source);
	},
	itemWasClicked : function(item) {
		this.changeValue(item.in2iGuiValue);
	}
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

In2iGui.Formula.Checkboxes.Source.prototype = {
	refresh : function() {
		var self = this;
		$get(this.options.url,{onSuccess:function(t) {self.update(t.responseXML)}});
	},
	update : function(doc) {
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
			//this.element.innerHTML='&nbsp;';
		}
		this.parent.checkValues();
		this.updateUI();
	},
	itemWasClicked : function(node) {
		this.parent.flipValue(node.in2iGuiValue);
	},
	updateUI : function() {
		for (var i=0; i < this.checkboxes.length; i++) {
			var item = this.checkboxes[i];
			N2i.setClass(item.element,'checked',N2i.inArray(this.parent.values,item.value));
		};
	},
	hasValue : function(value) {
		for (var i=0; i < this.checkboxes.length; i++) {
			if (this.checkboxes[i].value==value) {
				return true;
			}
		};
		return false;
	}
}

/**************************** Token ************************/

In2iGui.Formula.Tokens = function(element,name,options) {
	this.options = {label:null,key:null};
	N2i.override(this.options,options);
	this.element = $(element);
	this.name = name;
	this.value = [''];
	In2iGui.extend(this);
	this.updateUI();
}

In2iGui.Formula.Tokens.create = function(name,opts) {
	var element = new Element('div').addClassName('in2igui_tokens');
	return new In2iGui.Formula.Tokens(element,name,opts);
}

In2iGui.Formula.Tokens.prototype = {
	setValue : function(objects) {
		this.value = objects;
		this.value.push('');
		this.updateUI();
	},
	reset : function() {
		this.value = [''];
		this.updateUI();
	},
	getValue : function() {
		var out = [];
		this.value.each(function(value) {
			value = value.strip();
			if (value.length>0) out.push(value);
		})
		return out;
	},
	getLabel : function() {
		return this.options.label;
	},
	updateUI : function() {
		this.element.update();
		var self = this;
		this.value.each(function(value,i) {
			var input = new Element('input').addClassName('in2igui_tokens_token');
			input.value = value;
			input.in2iguiIndex = i;
			self.element.insert(input);
			input.observe('keyup',function() {self.inputChanged(input,i)});
		});
	},
	/** @private */
	inputChanged : function(input,index) {
		if (index==this.value.length-1 && input.value!=this.value[index]) {
			this.addField();
		}
		this.value[index] = input.value;
	},
	/** @private */
	addField : function() {
		var input = new Element('input').addClassName('in2igui_tokens_token');
		var i = this.value.length;
		this.value.push('');
		this.element.insert(input);
		var self = this;
		input.observe('keyup',function() {self.inputChanged(input,i)});
	}
}

/* EOF */