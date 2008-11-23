In2iGui.Selection = function(id,name,options) {
	this.options = N2i.override({value:null},options);
	this.element = $(id);
	this.name = name;
	this.items = [];
	this.subItems = [];
	this.value = this.options.value;
	this.selected = [];
	In2iGui.extend(this);
	var self = this;
}

In2iGui.Selection.create = function(name,options) {
	options = N2i.override({width:0},options);
	var e = new Element('div',{'class':'in2igui_selection'});
	if (options.width>0) e.setStyle({width:options.width+'px'});
	return new In2iGui.Selection(e,name,options);
}

In2iGui.Selection.prototype = {
	getValue : function() {
		return this.value;
	},
	getSelection : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i].value == this.value) {
				return this.items[i];
			}
		};
		for (var i=0; i < this.subItems.length; i++) {
			var item = this.subItems[i].getSelection();
			if (item) return item;
		};
	},
	setValue : function(value) {
		this.value = value;
		for (var i=0; i < this.items.length; i++) {
			var item = this.items[i];
			N2i.setClass(item.element,'selected',(item.value==value));
		};
		for (var i=0; i < this.subItems.length; i++) {
			this.subItems[i].updateUI();
		};
	},
	changeValue : function(value) {
		this.setValue(value);
		In2iGui.callDelegates(this,'selectorSelectionChanged'); // deprecated
		In2iGui.callDelegates(this,'selectionChanged',this.value); // deprecated
		In2iGui.callDelegates(this,'onSelectionChange',this.value);
		In2iGui.firePropertyChange(this,'value',this.value);
	},
	registerItems : function(items) {
		items.selection = this;
		this.subItems.push(items);
	},
	registerItem : function(id,title,icon,badge,value,kind) {
		var element = $(id);
		element.in2iGuiValue = value;
		this.items.push({id:id,title:title,icon:icon,badge:badge,element:element,value:value,kind:kind});
		var self = this;
		element.onclick = function() {
			self.itemWasClicked(value);
		}
		element.ondblclick = function() {
			self.itemWasDoubleClicked();
			return false;
		}
		element.dragDropInfo = {kind:kind,value:value};
		N2i.addClass(element,'droppable');
		N2i.addListener(element,'mouseover',In2iGui.dropOverListener);
		N2i.addListener(element,'mouseout',In2iGui.dropOutListener);
	},
	
	setObjects : function(items) {
		var self = this;
		items.each(function(item) {
			self.items.push(item);
			var node = new Element('div',{'class':'in2igui_selection_item'});
			item.element = node;
			self.element.insert(node);
			var inner = new Element('span').update(item.title);
			if (item.icon) {
				inner.setStyle({'backgroundImage' : 'url('+In2iGui.getIconUrl(item.icon,1)+')'}).addClassName('in2igui_icon');
			}
			node.insert(inner);
			node.observe('click',function() {
				self.changeValue(item.value);
			});
			node.observe('dblclick',function() {
				self.itemWasDoubleClicked();
				return false;
			});
		});
	},
	
	// Events
	itemWasClicked : function(value) {
		this.changeValue(value);
	},
	itemWasDoubleClicked : function() {
		In2iGui.callDelegates(this,'selectorObjectWasOpened');
	}
}

/******************************** Items ****************************/

In2iGui.Selection.Items = function(id,name,options) {
	this.element = $(id);
	this.name = name;
	this.selection = null;
	this.options = N2i.override({source:null},options);
	this.items = [];
	In2iGui.extend(this);
	var self = this;
	if (this.options.source) {
		this.options.source.addDelegate(this);
	}
	//N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Selection.Items.prototype = {
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	objectsLoaded : function(objects) {
		this.itemsLoaded(objects);
	},
	itemsLoaded : function(items) {
		this.items = [];
		N2i.removeChildren(this.element);
		var self = this;
		for (var i=0, len=items.length; i < len; ++i) {
			var item = items[i];
			var node = new Element('div',{'class':'in2igui_selection_item'});
			var inner = new Element('span');
			if (item.icon) {
				inner.setStyle({'backgroundImage' : 'url('+In2iGui.getIconUrl(item.icon,1)+')'}).addClassName('in2igui_icon');
			}
			node.in2iGuiIndex = i;
			node.insert(inner.insert(item.title));
			this.element.insert(node);
			node.observe('click',function() {
				self.itemWasClicked(self.items[this.in2iGuiIndex].value);
			});
			node.ondblclick = function() {
				self.itemWasDoubleClicked();
				return false;
			}
			var info = {title:item.title,icon:item.icon,badge:item.badge,kind:item.kind,element:node,value:item.value};
			node.dragDropInfo = info;
			this.items.push(info);
		};
		this.updateUI();
	},
	itemWasClicked : function(value) {
		this.selection.changeValue(value);
	},
	itemWasDoubleClicked : function(node) {
		this.selection.itemWasDoubleClicked();
	},
	getSelection : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i].value == this.selection.value) {
				return this.items[i];
			}
		};
		return null;
	},
	updateUI : function() {
		for (var i=0; i < this.items.length; i++) {
			var item = this.items[i];
			N2i.setClass(item.element,'selected',(item.value==this.selection.value));
		};
	}
}
/* EOF */