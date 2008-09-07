In2iGui.Tabs = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $(id);
	this.bar = this.element.select('.in2igui_tabs_bar')[0];
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.prototype.registerTab = function(obj) {
	obj.parent = this;
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabs.prototype.addBehavior = function() {
	var self = this;
	var tabs = this.bar.select('li');
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
		this.tabs[i].setActive(i==this.activeTab);
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabs.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.parent = null;
	this.element = $(id+'_content');
	this.tab = $(id+'_tab');
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.Tab.prototype = {
	setActive : function(active) {
		this.element.style.display = (active ? 'block' : 'none');
		N2i.setClass(this.tab,'in2igui_tabs_selected',active);
	}
}

/* EOF */