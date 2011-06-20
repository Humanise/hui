/**
 * @class
 * This is a formula
 */
hui.ui.Formula = function(options) {
	this.options = options;
	hui.ui.extend(this,options);
	this.addBehavior();
}

/** @static Creates a new formula */
hui.ui.Formula.create = function(o) {
	o = o || {};
	var atts = {'class':'hui_formula hui_formula'};
	if (o.action) {
		atts.action=o.action;
	}
	if (o.method) {
		atts.method=o.method;
	}
	o.element = hui.build('form',atts);
	return new hui.ui.Formula(o);
}

hui.ui.Formula.prototype = {
	/** @private */
	addBehavior : function() {
		this.element.onsubmit=function() {return false;};
	},
	submit : function() {
		this.fire('submit');
	},
	/** Returns a map of all values of descendants */
	getValues : function() {
		var data = {};
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].options && d[i].options.key && d[i].getValue) {
				data[d[i].options.key] = d[i].getValue();
			} else if (d[i].name && d[i].getValue) {
				data[d[i].name] = d[i].getValue();
			}
		};
		return data;
	},
	/** Sets the values of the descendants */
	setValues : function(values) {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].options && d[i].options.key) {
				var key = d[i].options.key;
				if (key && values[key]!=undefined) {
					d[i].setValue(values[key]);
				}
			}
		}
	},
	/** Sets focus in the first found child */
	focus : function() {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].focus) {
				d[i].focus();
				return;
			}
		}
	},
	/** Resets all descendants */
	reset : function() {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].reset) {
				d[i].reset();
			}
		}
	},
	/** Adds a widget to the form */
	add : function(widget) {
		this.element.appendChild(widget.getElement());
	},
	/** Creates a new form group and adds it to the form
	 * @returns {'hui.ui.Formula.Group'} group
	 */
	createGroup : function(options) {
		var g = hui.ui.Formula.Group.create(options);
		this.add(g);
		return g;
	},
	/** Builds and adds a new group according to a recipe
	 * @returns {'hui.ui.Formula.Group'} group
	 */
	buildGroup : function(options,recipe) {
		var g = this.createGroup(options);
		hui.each(recipe,function(item) {
			if (hui.ui.Formula[item.type]) {
				var w = hui.ui.Formula[item.type].create(item.options);
				g.add(w);
			}
			else if (hui.ui[item.type]) {
				var w = hui.ui[item.type].create(item.options);
				g.add(w);
			}
		});
		return g;
	},
	/** @private */
	childValueChanged : function(value) {
		this.fire('valuesChanged',this.getValues());
	},
	show : function() {
		this.element.style.display='';
	},
	hide : function() {
		this.element.style.display='none';
	}
}

///////////////////////// Group //////////////////////////


/**
 * A form group
 * @constructor
 */
hui.ui.Formula.Group = function(options) {
	this.name = options.name;
	this.element = hui.get(options.element);
	this.body = hui.firstByTag(this.element,'tbody');
	this.options = hui.override({above:true},options);
	hui.ui.extend(this);
}

/** Creates a new form group */
hui.ui.Formula.Group.create = function(options) {
	options = hui.override({above:true},options);
	var element = options.element = hui.build('table',
		{'class':'hui_formula_group'}
	);
	if (options.above) {
		hui.addClass(element,'hui_formula_group_above');
	}
	element.appendChild(hui.build('tbody'));
	return new hui.ui.Formula.Group(options);
}

hui.ui.Formula.Group.prototype = {
	add : function(widget) {
		var tr = hui.build('tr');
		this.body.appendChild(tr);
		var td = hui.build('td',{'class':'hui_formula_group'});
		if (widget.getLabel) {
			var label = widget.getLabel();
			if (label) {
				if (this.options.above) {
					hui.build('label',{text:label,parent:td});
				} else {
					var th = hui.build('th',{parent:tr});
					hui.build('label',{text:label,parent:th});
				}
			}
		}
		var item = hui.build('div',{'class':'hui_formula_item'});
		item.appendChild(widget.getElement());
		td.appendChild(item);
		tr.appendChild(td);
	},
	createButtons : function(options) {
		var tr = hui.build('tr',{parent:this.body});
		var td = hui.build('td',{colspan:this.options.above?1:2,parent:tr});
		var b = hui.ui.Buttons.create(options);
		td.appendChild(b.getElement());
		return b;
	}
}

///////////////////////// Text /////////////////////////

/**
 * A text fields
 * @constructor
 */
hui.ui.Formula.Text = function(options) {
	this.options = hui.override({label:null,key:null,lines:1,live:false,maxHeight:100},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this.input = hui.firstByClass(this.element,'hui_formula_text');
	this.multiline = this.input.tagName.toLowerCase() == 'textarea';
	this.placeholder = hui.firstByClass(this.element,'hui_field_placeholder');
	this.value = this.input.value;
	if (this.placeholder) {
		var self = this;
		hui.ui.onReady(function() {
			window.setTimeout(function() {
				self.value = self.input.value;
				self.updateClass();
			},500);
		});
	}
	this.addBehavior();
}

hui.ui.Formula.Text.create = function(options) {
	options = hui.override({lines:1},options);
	var node,input;
	if (options.lines>1 || options.multiline) {
		input = hui.build('textarea',
			{'class':'hui_formula_text','rows':options.lines,style:'height: 32px;'}
		);
		node = hui.build('span',{'class':'hui_formula_text_multiline'});
		node.appendChild(input);
	} else {
		input = hui.build('input',{'class':'hui_formula_text'});
		if (options.secret) {
			input.setAttribute('type','password');
		}
		node = hui.build('span',{'class':'hui_field_singleline'});
		node.appendChild(input);
	}
	if (options.value!==undefined) {
		input.value=options.value;
	}
	options.element = hui.ui.wrapInField(node);
	return new hui.ui.Formula.Text(options);
}

hui.ui.Formula.Text.prototype = {
	/** @private */
	addBehavior : function() {
		hui.ui.addFocusClass({element:this.input,classElement:this.element,'class':'hui_field_focused'});
		hui.listen(this.input,'keyup',this.onKeyUp.bind(this));
		var p = this.element.getElementsByTagName('em')[0];
		if (p) {
			this.updateClass();
			hui.listen(p,'mousedown',function() {
				window.setTimeout(function() {
					this.input.focus();
					this.input.select();
				}.bind(this)
			)}.bind(this));
			hui.listen(p,'mouseup',function() {
				this.input.focus();
				this.input.select();
			}.bind(this));
		}
	},
	updateClass : function() {
		hui.setClass(this.element,'hui_field_dirty',this.value.length>0);
	},
	/** @private */
	onKeyUp : function(e) {
		if (!this.multiline && e.keyCode===hui.KEY_RETURN) {
			this.fire('submit');
			var form = hui.ui.getAncestor(this,'hui_formula');
			if (form) {form.submit();}
			return;
		}
		if (this.input.value==this.value) {return;}
		this.value=this.input.value;
		this.updateClass();
		this.expand(true);
		hui.ui.callAncestors(this,'childValueChanged',this.input.value);
		this.fire('valueChanged',this.input.value);
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
		try {
			this.input.focus();
		} catch (e) {}
	},
	select : function() {
		try {
			this.input.focus();
			this.input.select();
		} catch (e) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		if (value===undefined || value===null) {
			value='';
		}
		this.value = value;
		this.input.value = value;
		this.expand(true);
	},
	getValue : function() {
		return this.input.value;
	},
	getLabel : function() {
		return this.options.label;
	},
	isEmpty : function() {
		return this.input.value=='';
	},
	isBlank : function() {
		return hui.isBlank(this.input.value);
	},
	setError : function(error) {
		var isError = error ? true : false;
		hui.setClass(this.element,'hui_field_error',isError);
		if (typeof(error) == 'string') {
			hui.ui.showToolTip({text:error,element:this.element,key:this.name});
		}
		if (!isError) {
			hui.ui.hideToolTip({key:this.name});
		}
	},
	// Expanding
	
	$visibilityChanged : function() {
		window.setTimeout(this.expand.bind(this));
	},
	/** @private */
	expand : function(animate) {
		if (!this.multiline) {return};
		if (!hui.dom.isVisible(this.element)) {return};
		var textHeight = hui.ui.getTextAreaHeight(this.input);
		textHeight = Math.max(32,textHeight);
		textHeight = Math.min(textHeight,this.options.maxHeight);
		if (animate) {
			this.updateOverflow();
			hui.animate(this.input,'height',textHeight+'px',300,{ease:hui.ease.slowFastSlow,onComplete:function() {
				this.updateOverflow();
				}.bind(this)
			});
		} else {
			this.input.style.height=textHeight+'px';
			this.updateOverflow();
		}
	},
	updateOverflow : function() {
		if (!this.multiline) return;
		this.input.style.overflowY=this.input.clientHeight>=this.options.maxHeight ? 'auto' : 'hidden';
	}
}

/////////////////////////// Number /////////////////////////

/**
 * A date and time field
 * @constructor
 */
hui.ui.Formula.Number = function(o) {
	this.options = hui.override({min:0,max:10000,value:null,decimals:0,allowNull:false},o);	
	this.name = o.name;
	var e = this.element = hui.get(o.element);
	this.input = hui.firstByTag(e,'input');
	this.up = hui.firstByClass(e,'hui_number_up');
	this.down = hui.firstByClass(e,'hui_number_down');
	this.value = this.options.value;
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.Formula.Number.create = function(o) {
	o.element = hui.build('span',{
		'class':'hui_number',
		html:'<span><span><input type="text" value="'+(o.value!==undefined ? o.value : '0')+'"/><a class="hui_number_up"></a><a class="hui_number_down"></a></span></span>'
	});
	return new hui.ui.Formula.Number(o);
}

hui.ui.Formula.Number.prototype = {
	addBehavior : function() {
		var e = this.element;
		hui.listen(this.input,'focus',function() {hui.addClass(e,'hui_number_focused')});
		hui.listen(this.input,'blur',this.blurEvent.bind(this));
		hui.listen(this.input,'keyup',this.keyEvent.bind(this));
		hui.listen(this.up,'mousedown',this.upEvent.bind(this));
		hui.listen(this.up,'dblclick',this.upEvent.bind(this));
		hui.listen(this.down,'mousedown',this.downEvent.bind(this));
		hui.listen(this.down,'dblclick',this.upEvent.bind(this));
	},
	blurEvent : function() {
		hui.removeClass(this.element,'hui_number_focused');
		this.updateField();
	},
	keyEvent : function(e) {
		e = e || window.event;
		if (e.keyCode==hui.KEY_UP) {
			hui.stop(e);
			this.upEvent();
		} else if (e.keyCode==hui.KEY_DOWN) {
			this.downEvent();
		} else {
			var parsed = parseInt(this.input.value,10);
			if (!isNaN(parsed)) {
				this.setLocalValue(parsed,true);
			} else {
				this.setLocalValue(null,true);
			}
		}
	},
	downEvent : function(e) {
		hui.stop(e);
		if (this.value===null) {
			this.setLocalValue(this.options.min,true);
		} else {
			this.setLocalValue(this.value-1,true);
		}
		this.updateField();
	},
	upEvent : function(e) {
		hui.stop(e);
		this.setLocalValue(this.value+1,true);
		this.updateField();
	},
	focus : function() {
		try {
			this.input.focus();
		} catch (e) {}
	},
	getValue : function() {
		return this.value;
	},
	getLabel : function() {
		return this.options.label;
	},
	setValue : function(value) {
		value = parseInt(value,10);
		if (!isNaN(value)) {
			this.setLocalValue(value,false);
		}
		this.updateField();
	},
	updateField : function() {
		this.input.value = this.value===null || this.value===undefined ? '' : this.value;
	},
	setLocalValue : function(value,fire) {
		var orig = this.value;
		if (value===null || value===undefined && this.options.allowNull) {
			this.value = null;
		} else {
			this.value = Math.min(Math.max(value,this.options.min),this.options.max);
		}
		if (fire && orig!==this.value) {
			hui.ui.callAncestors(this,'childValueChanged',this.value);
			this.fire('valueChanged',this.value);
		}
	},
	reset : function() {
		if (this.options.allowNull) {
			this.value = null;
		} else {
			this.value = Math.min(Math.max(0,this.options.min),this.options.max);
		}
		this.updateField();
	}
}


//////////////////////////// Radio buttons ////////////////////////////

/**
 * @constructor
 */
hui.ui.Formula.Radiobuttons = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.radios = [];
	this.value = options.value;
	this.defaultValue = this.value;
	hui.ui.extend(this);
}

hui.ui.Formula.Radiobuttons.prototype = {
	click : function() {
		this.value = !this.value;
		this.updateUI();
	},
	/** @private */
	updateUI : function() {
		for (var i=0; i < this.radios.length; i++) {
			var radio = this.radios[i];
			hui.setClass(hui.get(radio.id),'hui_selected',radio.value==this.value);
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
		var element = hui.get(radio.id);
		var self = this;
		element.onclick = function() {
			self.setValue(radio.value);
			self.fire('valueChanged',radio.value);
		}
	}
}


///////////////////////////// Checkbox /////////////////////////////////

/**
 * A check box
 * @constructor
 */
hui.ui.Formula.Checkbox = function(o) {
	this.element = hui.get(o.element);
	this.control = hui.firstByTag(this.element,'span');
	this.options = o;
	this.name = o.name;
	this.value = o.value==='true' || o.value===true;
	hui.ui.extend(this);
	this.addBehavior();
}

/**
 * Creates a new checkbox
 */
hui.ui.Formula.Checkbox.create = function(o) {
	var e = o.element = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span><span></span></span>'});
	if (o.value) {
		hui.addClass(e,'hui_checkbox_selected');
	}
	return new hui.ui.Formula.Checkbox(o);
}

hui.ui.Formula.Checkbox.prototype = {
	/** @private */
	addBehavior : function() {
		hui.ui.addFocusClass({element:this.element,'class':'hui_checkbox_focused'});
		hui.listen(this.element,'click',this.click.bind(this));
	},
	/** @private */
	click : function(e) {
		hui.stop(e);
		this.element.focus();
		this.value = !this.value;
		this.updateUI();
		hui.ui.callAncestors(this,'childValueChanged',this.value);
		this.fire('valueChanged',this.value);
	},
	/** @private */
	updateUI : function() {
		hui.setClass(this.element,'hui_checkbox_selected',this.value);
	},
	/** Sets the value
	 * @param {Boolean} value Whether the checkbox is checked
	 */
	setValue : function(value) {
		this.value = value===true || value==='true';
		this.updateUI();
	},
	/** Gets the value
	 * @return {Boolean} Whether the checkbox is checked
	 */
	getValue : function() {
		return this.value;
	},
	/** Resets the checkbox */
	reset : function() {
		this.setValue(false);
	},
	/** Gets the label
	 * @return {String} The checkbox label
	 */
	getLabel : function() {
		return this.options.label;
	}
}

/////////////////////////// Checkboxes ////////////////////////////////

/**
 * Multiple checkboxes
 * @constructor
 */
hui.ui.Formula.Checkboxes = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.items = options.items || [];
	this.sources = [];
	this.subItems = [];
	this.values = options.values || options.value || []; // values is deprecated
	hui.ui.extend(this);
	this.addBehavior();
	this.updateUI();
	if (options.url) {
		new hui.ui.Source({url:options.url,delegate:this});
	}
}

hui.ui.Formula.Checkboxes.create = function(o) {
	o.element = hui.build('div',{'class':o.vertical ? 'hui_checkboxes hui_checkboxes_vertical' : 'hui_checkboxes'});
	if (o.items) {
		hui.each(o.items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'javascript:void(0);',html:'<span><span></span></span>'+item.title});
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			o.element.appendChild(node);
		});
	}
	return new hui.ui.Formula.Checkboxes(o);
}

hui.ui.Formula.Checkboxes.prototype = {
	/** @private */
	addBehavior : function() {
		var checks = hui.byClass(this.element,'hui_checkbox');
		hui.each(checks,function(check,i) {
			hui.listen(check,'click',function(e) {
				hui.stop(e);
				this.flipValue(this.items[i].value);
			}.bind(this))
		}.bind(this))
	},
	getValue : function() {
		return this.values;
	},
	/** @deprecated */
	getValues : function() {
		return this.values;
	},
	checkValues : function() {
		var newValues = [];
		for (var i=0; i < this.values.length; i++) {
			var value = this.values[i],
				found = false,
				j;
			for (j=0; j < this.items.length; j++) {
				found = found || this.items[j].value===value;
			}
			for (j=0; j < this.subItems.length; j++) {
				found = found || this.subItems[j].hasValue(value);
			};
			if (found) {
				newValues.push(value);
			}
		};
		this.values=newValues;
	},
	setValue : function(values) {
		this.values=values;
		this.checkValues();
		this.updateUI();
	},
	/** @deprecated */
	setValues : function(values) {
		this.setValue(values);
	},
	flipValue : function(value) {
		hui.flipInArray(this.values,value);
		this.checkValues();
		this.updateUI();
		this.fire('valueChanged',this.values);
		hui.ui.callAncestors(this,'childValueChanged',this.values);
	},
	updateUI : function() {
		var i,item,found;
		for (i=0; i < this.subItems.length; i++) {
			this.subItems[i].updateUI();
		};
		var nodes = hui.byClass(this.element,'hui_checkbox');
		for (i=0; i < this.items.length; i++) {
			item = this.items[i];
			found = hui.inArray(this.values,item.value);
			hui.setClass(nodes[i],'hui_checkbox_selected',found);
		};
	},
	refresh : function() {
		for (var i=0; i < this.subItems.length; i++) {
			this.subItems[i].refresh();
		};
	},
	reset : function() {
		this.setValues([]);
	},
	registerSource : function(source) {
		source.parent = this;
		this.sources.push(source);
	},
	registerItem : function(item) {
		// If it is a number, treat it as such
		if (parseInt(item.value)==item.value) {
			item.value = parseInt(item.value);
		}
		this.items.push(item);
	},
	registerItems : function(items) {
		items.parent = this;
		this.subItems.push(items);
	},
	getLabel : function() {
		return this.options.label;
	},
	$itemsLoaded : function(items) {
		hui.each(items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'javascript:void(0);',html:'<span><span></span></span>'+hui.escape(item.title)});
			hui.listen(node,'click',function(e) {
				hui.stop(e);
				this.flipValue(item.value);
			}.bind(this))
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			this.element.appendChild(node);
			this.items.push(item);
		}.bind(this));
		this.checkValues();
		this.updateUI();
	}
}

/////////////////////// Checkbox items ///////////////////

/**
 * Check box items
 * @constructor
 */
hui.ui.Formula.Checkboxes.Items = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	this.parent = null;
	this.options = options;
	this.checkboxes = [];
	hui.ui.extend(this);
	if (this.options.source) {
		this.options.source.listen(this);
	}
}

hui.ui.Formula.Checkboxes.Items.prototype = {
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	$itemsLoaded : function(items) {
		this.checkboxes = [];
		this.element.innerHTML='';
		var self = this;
		hui.each(items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span><span></span></span>'+item.title});
			hui.listen(node,'click',function(e) {
				hui.stop(e);
				node.focus();
				self.itemWasClicked(item)
			});
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			self.element.appendChild(node);
			self.checkboxes.push({title:item.title,element:node,value:item.value});
		});
		this.parent.checkValues();
		this.updateUI();
	},
	itemWasClicked : function(item) {
		this.parent.flipValue(item.value);
	},
	updateUI : function() {
		try {
		for (var i=0; i < this.checkboxes.length; i++) {
			var item = this.checkboxes[i];
			var index = hui.indexInArray(this.parent.values,item.value);
			hui.setClass(item.element,'hui_checkbox_selected',index!=-1);
		};
		} catch (e) {
			alert(typeof(this.parent.values));
			alert(e);
		}
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