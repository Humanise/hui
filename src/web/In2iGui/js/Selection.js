In2iGui.Selection = function(id,name,source) {
	this.element = $(id);
	this.name = name;
	this.items = [];
	this.sources = [];
	this.value = null;
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
	changeValue : function(value) {
		this.value = value;
		for (var i=0; i < this.items.length; i++) {
			var item = this.items[i];
			N2i.setClass(item.element,'selected',(item.value==value));
		};
		for (var i=0; i < this.sources.length; i++) {
			var source = this.sources[i];
			source.updateUI();
		};
		In2iGui.callDelegates(this,'selectorSelectionChanged');
		In2iGui.callDelegates(this,'selectionChanged',this.value);
	},
	registerSource : function(source) {
		source.selection = this;
		this.sources.push(source);
	},
	registerItem : function(id,title,icon,badge,value,kind) {
		var element = $id(id);
		element.in2iGuiValue = value;
		this.items.push({id:id,title:title,icon:icon,badge:badge,element:element,value:value,kind:kind});
		var self = this;
		element.onclick = function() {
			self.itemWasClicked(this);
		}
		element.ondblclick = function() {
			self.itemWasDoubleClicked();
			return false;
		}
		element.dropInfo = {kind:kind,controller:this};
		N2i.addClass(element,'droppable');
		N2i.addListener(element,'mouseover',In2iGui.dropOverListener);
		N2i.addListener(element,'mouseout',In2iGui.dropOutListener);
	},
	
	setItems : function(items) {
		var self = this;
		items.each(function(item) {
			self.items.push(item);
			var node = new Element('div',{'class':'item'});
			node.in2iGuiValue = item.value;
			item.element = node;
			self.element.insert(node);
			if (item.icon) {
				var img = new Element('div',{'class':'icon'}).setStyle({'backgroundImage' : 'url('+In2iGui.getIconUrl(item.icon,1)+')'});
				node.insert(img);
			}
			node.insert(item.title);
			node.observe('click',function() {
				self.itemWasClicked(node);
			});
			node.observe('dblclick',function() {
				self.itemWasDoubleClicked(node);
				return false;
			});
		});
	},
	
	// Events
	itemWasClicked : function(item) {
		this.changeValue(item.in2iGuiValue);
	},
	itemWasDoubleClicked : function() {
		In2iGui.callDelegates(this,'selectorObjectWasOpened');
	}
}

/******************************** Source ****************************/

In2iGui.Selection.Source = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.selection = null;
	this.options = options;
	this.items = [];
	In2iGui.enableDelegating(this);
	var self = this;
	N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Selection.Source.prototype.refresh = function() {
	var self = this;
	$get(this.options.url,{onSuccess:function(t) {self.updateSource(t.responseXML)}});
}

In2iGui.Selection.Source.prototype.updateSource = function(doc) {
	this.items = [];
	N2i.removeChildren(this.element);
	var self = this;
	var items = doc.getElementsByTagName('item');
	for (var i=0; i < items.length; i++) {
		var item = items[i];
		var node = N2i.create('div',{'class':'item'});
		var title = item.getAttribute('title');
		var badge = item.getAttribute('badge');
		var icon = item.getAttribute('icon');
		var value = item.getAttribute('value');
		var kind = item.getAttribute('kind');
		if (icon) {
			var img = N2i.create('div',{'class':'icon'},{'backgroundImage' : 'url('+In2iGui.getIconUrl(icon,1)+')'});
			node.appendChild(img);
		}
		node.appendChild(document.createTextNode(title));
		this.element.appendChild(node);
		node.in2iGuiValue = value;
		node.onclick = function() {
			self.itemWasClicked(this);
		}
		node.ondblclick = function() {
			self.itemWasDoubleClicked(this);
			return false;
		}
		var info = {title:title,icon:icon,badge:badge,kind:kind,element:node,value:value};
		node.dragDropInfo = info;
		this.items.push(info);
	};
	this.updateUI();
}

In2iGui.Selection.Source.prototype.itemWasClicked = function(node) {
	this.selection.changeValue(node.in2iGuiValue);
}

In2iGui.Selection.Source.prototype.itemWasDoubleClicked = function(node) {
	this.selection.itemWasDoubleClicked();
}

In2iGui.Selection.Source.prototype.getSelection = function() {
	for (var i=0; i < this.items.length; i++) {
		if (this.items[i].value == this.selection.value) {
			return this.items[i];
		}
	};
	return null;
}

In2iGui.Selection.Source.prototype.updateUI = function() {
	for (var i=0; i < this.items.length; i++) {
		var item = this.items[i];
		N2i.setClass(item.element,'selected',(item.value==this.selection.value));
	};
}

/* EOF */