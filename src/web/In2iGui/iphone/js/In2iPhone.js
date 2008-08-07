var In2iPhone = {};

In2iPhone.addTouchBehavior = function(element) {
	element.ontouchstart=function() {
		if (this.hasClassName('disabled')) return;
		this.addClassName('touched');
	};
	//=element.ontouchcancel
	//=element.ontouchmove
	element.ontouchend=function() {
		if (this.hasClassName('disabled')) return;
		this.removeClassName('touched');
	};
}

In2iPhone.Button = function(element,name,options) {
	this.element = $(element);
	In2iPhone.addTouchBehavior(this.element);
	this.name = name;
	In2iGui.extend(this);
}

In2iPhone.Button.prototype = {
	addBehavior : function() {
		this.element.observe('touchstart',function() {
			this.addClassName('touched');
		});
	}
}