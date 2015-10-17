oo.Finder = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.window = hui.ui.get(this.name+'_window');
	this.gallery = hui.ui.get(this.name+'_gallery');
	this.addButton = hui.ui.get(this.name+'_add');
	hui.ui.extend(this);
	this._attach();
}

oo.Finder.prototype = {
	_attach : function() {
		this.addButton.listen({
			$click : this._add.bind(this)
		})
		this.gallery.listen({
			$open : this._add.bind(this),
			$resolveImageUrl : function(image,width,height) {
				return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
			}
		})
	},
	_add : function() {
		var items = this.gallery.getSelection();
		this.fire('add',items)
	},
	show : function() {
		this.window.show();
	}
	
};