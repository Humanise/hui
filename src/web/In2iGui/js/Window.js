In2iGui.Window = function(element) {
	this.element = $id(element);
	this.close = $class('close',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Window.prototype.addBehavior = function() {
	var self = this;
	this.close.onclick = function() {self.hide();}
}

In2iGui.Window.prototype.show = function() {
	this.element.style.display='block';
}

In2iGui.Window.prototype.hide = function() {
	this.element.style.display='none';
}