desktop.SearchBar = function(options) {
	this.element = hui.get(options.element)
	this.input = new hui.ui.Input({element:hui.get.firstByTag(this.element,'input')});
	hui.ui.extend(this);
	this.input.listen({
		$valueChanged : function(value) {
			this.fire('valueChanged',value);
		}.bind(this)
	});
}

desktop.SearchBar.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{'class':'widget_searchbar widget_nodrag',parent:options.parent,html:'<input/>'});
	return new desktop.SearchBar(options);
}