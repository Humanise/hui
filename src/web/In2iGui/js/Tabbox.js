In2iGui.Tabbox = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.panes = $class('tab',$class('tabbox_top',this.element)[0]);
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	this.updateGUI();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabbox.prototype.registerTab = function(obj) {
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabbox.prototype.addBehavior = function() {
	var self = this;
	var tabs = $class('tabbox_top',this.element)[0].getElementsByTagName('a');
	for (var i=0; i < tabs.length; i++) {
		tabs[i].in2iGuiIndex = i;
		tabs[i].onclick = function() {
			self.tabWasClicked(this);
		}
	};
}

In2iGui.Tabbox.prototype.tabWasClicked = function(tag) {
	this.activeTab = tag.in2iGuiIndex;
	this.updateGUI();
}

In2iGui.Tabbox.prototype.updateGUI = function() {
	var body = $class('tabbox_body',this.element)[0];
	$ani(body,'scrollLeft',this.activeTab*592,700,{ease:N2i.Animation.slowFastSlow});
	for (var i=0; i < this.panes.length; i++) {
		if (i==this.activeTab) {
			N2i.Element.addClassName(this.panes[i],'tab_selected');
		} else {
			N2i.Element.removeClassName(this.panes[i],'tab_selected');
		}
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabbox.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
}


