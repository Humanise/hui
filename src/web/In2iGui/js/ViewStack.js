In2iGui.ViewStack = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.element = $(id);
	this.contents = [];
	In2iGui.extend(this);
}

In2iGui.ViewStack.prototype.registerContent = function(id,name) {
	this.contents[this.contents.length] = {element:$(id),name:name};
}

In2iGui.ViewStack.prototype.change = function(name) {
	for (var i=0; i < this.contents.length; i++) {
		if (this.contents[i].name==name) {
			this.contents[i].element.style.display='block';
		} else {
			this.contents[i].element.style.display='none';
		}
	};
}

/* EOF */