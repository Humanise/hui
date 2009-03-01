/**
	Used to get a geografical location
	@constructor
*/
In2iGui.LocationPicker = function(o) {
	this.name = o.name;
	this.options = o.options || {};
	this.element = $(o.element);
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.LocationPicker.prototype = {
	/** @private */
	addBehavior : function() {
	}
}

/* EOF */