(function() {

var w = In2iGui.Wizard = function(o) {
	this.options = o || {};
	this.element = $(o.element);
	this.name = o.name;
	this.steps = this.element.select('.in2igui_wizard_step');
	this.anchors = this.element.select('ul.in2igui_wizard a');
	this.selected = 0;
	In2iGui.extend(this);
	this.addBehavior();
}
	
w.prototype = {
	addBehavior : function() {
		this.anchors.each(function(node,i) {
			node.observe('click',function(e) {e.stop();this.shift(i)}.bind(this));
		}.bind(this));
	},
	shift : function(index) {
		this.anchors[this.selected].removeClassName('in2igui_selected');
		this.steps[this.selected].hide();
		this.anchors[index].addClassName('in2igui_selected');
		this.steps[index].show();
		this.selected=index;
	}
}

}());

/* EOF */