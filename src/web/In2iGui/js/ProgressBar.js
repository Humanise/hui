In2iGui.ProgressBar = function(element,name) {
	this.element = $id(element);
	this.indicator = $tag('div',this.element)[0];
	this.name = name;
	In2iGui.enableDelegating(this);
}

In2iGui.ProgressBar.create = function(name) {
	var element = N2i.create('div',{'class':'in2igui_progressbar'});
	element.appendChild(N2i.create('div'));
	return new In2iGui.ProgressBar(element,name);
}

In2iGui.ProgressBar.prototype.getElement = function() {
	return this.element;
}
	
In2iGui.ProgressBar.prototype.setValue = function(value) {
	$ani(this.indicator,'width',(value*100)+'%',200);
}
	
In2iGui.ProgressBar.prototype.reset = function() {
	this.indicator.style.width='0%';
}
	
In2iGui.ProgressBar.prototype.hide = function() {
	this.element.style.display = 'none';
}
	
In2iGui.ProgressBar.prototype.show = function() {
	this.element.style.display = 'block';
}

