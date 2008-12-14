In2iGui.Sidebar = function(element) {
	this.element = $(element);
}

/***************** Icon ***************/

In2iGui.Sidebar.Selector = function(id,source) {
	this.element = $(id);
	this.items = [];
	this.selected = [];
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Sidebar.Selector.prototype.addBehavior = function() {
	
}

In2iGui.Sidebar.Selector.prototype.getValues = function() {
	var values = [];
	for (var i=0; i < this.selected.length; i++) {
		values[values.length] = this.items[this.selected[i]].value;
	};
	return values;
}

In2iGui.Sidebar.Selector.prototype.registerItem = function(id,title,icon,badge,value,selected) {
	var element = $(id);
	var index = this.items.length;
	element.in2iGuiIndex = index;
	this.items[index] = {id:id,title:title,icon:icon,badge:badge,element:element,value:value};
	if (selected=='true') {
		element.addClassName('selected');
		this.selected[this.selected.length] = index;
	}
	var self = this;
	element.onclick = function() {
		self.itemWasClicked(this);
	}
}

In2iGui.Sidebar.Selector.prototype.itemWasClicked = function(item) {
	this.setSelection([item.in2iGuiIndex]);
}

In2iGui.Sidebar.Selector.prototype.setSelection = function(ids) {
	for (var i=0; i < this.selected.length; i++) {
		this.items[this.selected[i]].element.removeClassName('selected');
	};
	this.selected = ids;
	for (var i=0; i < this.selected.length; i++) {
		this.items[this.selected[i]].element.addClassName('selected');
	};
	In2iGui.callDelegates(this,'selectorSelectionChanged');
}

/* EOF */