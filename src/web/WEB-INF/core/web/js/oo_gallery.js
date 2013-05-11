oo.Gallery = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	this.images = options.images;
	hui.ui.extend(this);
	this.thumbnails = 
	this._addBehavior();
}

oo.Gallery.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._click.bind(this));
	},
	_click : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			if (hui.cls.has(a,'oo_gallery_slideshow')) {
				e.stop();
				this.imageWasClicked(0);
			}
			if (a.getAttribute('rel')=='remove') {
				e.stop();
				var frame = hui.get.firstAncestorByClass(a,'oo_gallery_photo');
				hui.ui.confirmOverlay({
					element : frame,
					text:'Remove?',
					$ok : function() {
						this.fire('remove',{id : parseInt(a.getAttribute('data')),callback:this._refresh.bind(this)});
					}.bind(this)
				});
			}
		}
	},
	_refresh : function() {
		hui.cls.add(this.element,'oo_gallery_busy');
		oo.update({
			id : this.element.id
			//,$success : this._attachToImages.bind(this)
		});
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = hui.ui.ImageViewer.create();
			v.listen(this);
			v.addImages(this.images);
		}
		return this.imageViewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
	}
}