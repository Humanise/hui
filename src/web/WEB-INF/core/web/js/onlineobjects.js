var oo = {
	buildThumbnail : function(options) {
		var t = new Element('span',{'class':'oo_thumbnail'});
		var height = options.height;
		var width = options.width;
		if (!width && options.image) {
			width = Math.round(options.image.width/options.image.height*height);
		}
		t.style.width=width+'px';
		t.style.height=height+'px';
		if (options.variant) {
			t.addClassName('oo_thumbnail_'+options.variant);
		}
		if (options.image) {
			var img = new Element('img',{'src':oo.baseContext+'/service/image/id'+options.image.id+'width'+width+'height'+height+'.jpg'});
			t.insert(img);
			if (options.zoom) {
				t.addClassName('oo_thumbnail_zoom');
				img.onclick = function() {oo.community.showImage(options.image)};
			}
		}
		return t;
	},
	buildThumbnailHtml : function(options) {
		var cls = options.variant ? 'oo_thumbnail oo_thumbnail_'+options.variant : 'oo_thumbnail';
		var html = '<span class="'+cls+'" style="width: '+options.width+'px; height: '+options.height+'px;"></span>';
		return html;
	},
	update : function(options) {
		var id = options.id;
		var nodes = [];
		if (Object.isArray(id)) {
			for (var i=0; i < id.length; i++) {
				var nd = $(id[i]);
				if (nd) {
					nodes.push(nd);
				} else {
					n2i.log('Node not found : '+id[i]);
				}
			};
		} else {
			var node = $(id);
			if (!node) {
				n2i.log('Node not found: '+id);
			} else {
				nodes.push(node);
			}
		}
		new Ajax.Request(document.location+'',{onSuccess:function(t) {
			var e = new Element('div');
			e.innerHTML=t.responseText;
			for (var i=0; i < nodes.length; i++) {
				ui.destroyDescendants(nodes[i]);
				try {
					var html = e.select('#'+nodes[i].id)[0];
					n2i.log(html);
					nodes[i].replace(html);
				} catch (e) {
					n2i.log(e);
				}
			};
			if (options.onComplete) {
				options.onComplete();
			}
		},onException : function(a,b) {
			n2i.log(a);
			n2i.log(b);
		}})
	}
}

oo.Gallery = function(options) {
	this.options = options;
	this.element = $(options.element);
	this.images = options.images;
	ui.extend(this);
	this.addBehavior();
}

oo.Gallery.prototype = {
	addBehavior : function() {
		var self = this;
		var slideShow = this.element.select('.oo_gallery_slideshow')[0];
		if (slideShow) {
			slideShow.observe('click',function(e) {
				self.imageWasClicked(0);e.stop();
			});
		}
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = ui.ImageViewer.create();
			v.listen(this);
			v.addImages(this.images);
		}
		return this.imageViewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
	}
}