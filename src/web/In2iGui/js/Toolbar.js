In2iGui.Toolbar = function(element) {
	this.element = $id(element);
}

/***************** Icon ***************/

In2iGui.Toolbar.Icon = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.icon = $class('icon',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.Icon.prototype.addBehavior = function() {
	var self = this;
	this.element.onmouseover = function() {
		In2iGui.hoverOverBG(self.icon);
	}
	this.element.onmouseout = function() {
		In2iGui.hoverOutBG(self.icon);
	}
	this.element.onclick = function() {
		self.wasClicked();
	}
}

In2iGui.Toolbar.Icon.prototype.wasClicked = function() {
	In2iGui.callDelegates(this,'toolbarIconWasClicked');
}


/***************** Search field ***************/

In2iGui.Toolbar.SearchField = function(element) {
	this.element = $id(element);
	this.field = this.element.getElementsByTagName('input')[0];
	this.value = this.field.value;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.SearchField.prototype.getValue = function() {
	return this.field.value;
}

In2iGui.Toolbar.SearchField.prototype.addBehavior = function() {
	var self = this;
	this.field.onkeyup = function() {
		self.fieldChanged();
	}
}

In2iGui.Toolbar.SearchField.prototype.fieldChanged = function() {
	if (this.field.value!=this.value) {
		this.value=this.field.value;
		In2iGui.callDelegates(this,'searchFieldChanged');
	}
}