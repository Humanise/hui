oo.Diagram = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	this._attach();
}

oo.Diagram.get = function(options) {
	if (!this._singleton) {
		this._singleton = oo.Diagram.create(options);
	}
	return this._singleton;
};