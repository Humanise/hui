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
				this._clickImage(0);
			}
			if (a.getAttribute('rel')=='remove') {
				e.stop();
				var frame = hui.get.firstAncestorByClass(a,'oo_gallery_photo');
				hui.ui.confirmOverlay({
					element : frame,
					text:'Remove?',
					$ok : function() {
						this.fire('remove',{id : parseInt(a.getAttribute('data')),callback:this.refresh.bind(this)});
					}.bind(this)
				});
			}
		}
	},
	refresh : function() {
		//var hider = hui.build('div',{style})
		//hui.cls.add(this.element,'oo_gallery_busy');
		oo.update({
			id : this.element.id,
			fade : true
		});
	},
	present : function() {
		this.getViewer().show(0);
	},
	_clickImage : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = oo.PhotoViewer.create();
			v.listen({
				$resolveImageUrl : function(image,width,height) {
					return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
				}
			});
			v.setImages(this.images);
		}
		return this.imageViewer;
	},
	
	addIncoming : function() {
		var width = this.options.width,
			height = this.options.height;
		var ol = hui.get.firstByTag(this.element,'ol');
		var li = hui.build('li',{parent:ol});
		var span = hui.build('span',{parent:li,className:'oo_gallery_incoming',style:{visibility:'hidden'}});
		var inner = hui.build('span',{parent:span,style:{width:width+'px',height:height+'px',position:'relative'}});
		var indicator = hui.ui.ProgressIndicator.create({size:30});
		hui.style.set(indicator.element,{position:'absolute',left:'50%',top:'50%',marginLeft:'-15px',marginTop:'-15px'});
		inner.appendChild(indicator.element);
		hui.effect.bounceIn({element:span});
		return {
			$success : function(image) {
				indicator.destroy();
				span.className='oo_gallery_photo';
				span.innerHTML = '<a><img src="'+
					oo.baseContext+'/service/image/id'+image.id+
					'width'+width+'height'+height+
					'sharpen1.0cropped.jpg" style="width:'+width+'px;height:'+height+'px;"/></a>';
			},
			$progress : function(value) {
				indicator.setValue(value);
			},
			$failure : function() {
				
			}
		}
	}
}