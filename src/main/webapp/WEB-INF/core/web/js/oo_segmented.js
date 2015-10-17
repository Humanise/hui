oo.Segmented = function(options) {
	this.options = hui.override({selectedClass:'oo_segmented_item_selected'},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.current = hui.get.firstByClass(this.element,this.options.selectedClass);
	this.value = options.value || (this.current ? this.current.getAttribute('data-value') : null);
	hui.ui.extend(this);
	this._attach();
}

oo.Segmented.prototype = {
	_attach : function() {
		hui.listen(this.element,'click',this._click.bind(this));
	},
	_click : function(e) {
		e = hui.event(e);
		e.stop();
		var a = e.findByTag('a');
		if (a) {
			this._change(a);
		}
	},
	_change : function(node) {
		if (this.current) {
			hui.cls.remove(this.current,this.options.selectedClass);
		}
		this.value = node.getAttribute('data-value');
		hui.cls.add(node,this.options.selectedClass);
		this.fireValueChange();
		this.current = node;
	},
	getValue : function() {
		return this.value;
	}
};