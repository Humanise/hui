In2iGui.LocationPicker = function(o) {
	this.name = o.name;
	this.options = o.options || {};
	this.element = $(o.element);
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.LocationPicker.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.showPicker();
		}
	}
}

/* EOF */