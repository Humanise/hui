In2iGui.Tabs = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.prototype.registerTab = function(obj) {
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabs.prototype.addBehavior = function() {
	var self = this;
	var tabs = $class('tabs_bar',this.element)[0].getElementsByTagName('span');
	for (var i=0; i < tabs.length; i++) {
		tabs[i].in2iGuiIndex = i;
		tabs[i].onclick = function() {
			self.tabWasClicked(this);
		}
	};
}

In2iGui.Tabs.prototype.tabWasClicked = function(tag) {
	this.activeTab = tag.in2iGuiIndex;
	this.updateGUI();
}

In2iGui.Tabs.prototype.updateGUI = function() {
	for (var i=0; i < this.tabs.length; i++) {
		this.tabs[i].element.style.display = (i==this.activeTab ? 'block' : 'none');
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabs.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
}