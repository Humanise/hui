In2iGui.Selection = function(id,name,options) {
	this.options = N2i.override({value:null},options);
	this.element = $(id);
	this.name = name;
	this.items = [];
	this.sources = [];
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
		for (var i=0; i < this.sources.length; i++) {
			var item = this.sources[i].getSelection();
			if (item) return item;
		};
	},
	setValue : function(value) {
		this.value = value;
		for (var i=0; i < this.items.length; i++) {
			var item = this.items[i];
			N2i.setClass(item.element,'selected',(item.value==value));
		};
		for (var i=0; i < this.sources.length; i++) {
			var source = this.sources[i];
			source.updateUI();
		};
	},
	changeValue : function(value) {
		this.setValue(value);
		In2iGui.callDelegates(this,'selectorSelectionChanged');
		In2iGui.callDelegates(this,'selectionChanged',this.value);
	},
	registerSource : function(source) {
		source.selection = this;
		this.sources.push(source);
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

/******************************** Source ****************************/

In2iGui.Selection.Source = function(id,name,options) {
	this.element = $(id);
	this.name = name;
	this.selection = null;
	this.options = options;
	this.items = [];
	In2iGui.enableDelegating(this);
	var self = this;
	N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Selection.Source.prototype = {
	refresh : function() {
		var self = this;
		new Ajax.Request(this.options.url, {onSuccess:function(t) {self.updateSource(t.responseXML)}});
	},
	updateSource : function(doc) {
		this.items = [];
		N2i.removeChildren(this.element);
		var self = this;
		var items = doc.getElementsByTagName('item');
		for (var i=0, len=items.length; i < len; ++i) {
			var item = items[i];
			var node = new Element('div',{'class':'in2igui_selection_item'});
			var inner = new Element('span');
			var title = item.getAttribute('title');
			var badge = item.getAttribute('badge');
			var icon = item.getAttribute('icon');
			var value = item.getAttribute('value');
			var kind = item.getAttribute('kind');
			if (icon) {
				inner.setStyle({'backgroundImage' : 'url('+In2iGui.getIconUrl(icon,1)+')'}).addClassName('in2igui_icon');
			}
			node.in2iGuiIndex = i;
			node.insert(inner.insert(title));
			this.element.insert(node);
			node.observe('click',function() {
				self.itemWasClicked(self.items[this.in2iGuiIndex].value);
			});
			node.ondblclick = function() {
				self.itemWasDoubleClicked();
				return false;
			}
			var info = {title:title,icon:icon,badge:badge,kind:kind,element:node,value:value};
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