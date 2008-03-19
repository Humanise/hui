In2iGui.Icons = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.source = options.source;
	In2iGui.enableDelegating(this);
}

