In2iGui.Toolbar = function(element) {
	this.element = $id(element);
}

/***************** Icon ***************/

In2iGui.Toolbar.Icon = function(id,name) {
	this.id = id;
	this.name = name;
	this.enabled = true;
	this.element = $id(id);
	this.icon = $class('icon',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.Icon.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.wasClicked();
		}
	},
	setEnabled : function(enabled) {
		this.enabled = enabled;
		N2i.setClass(this.element,'disabled',!this.enabled);
	},
	wasClicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'toolbarIconWasClicked');
			In2iGui.callDelegates(this,'click');
		}
	}
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



