var oo = {
	buildThumbnail : function(options) {
		var t = hui.build('span',{'class':'oo_thumbnail'});
		var height = options.height;
		var width = options.width;
		if (!width && options.image) {
			width = Math.round(options.image.width/options.image.height*height);
		}
		t.style.width=width+'px';
		t.style.height=height+'px';
		if (options.variant) {
			hui.cls.add(t,'oo_thumbnail_'+options.variant);
		}
		if (options.image) {
			var img = hui.build('img',{'src':oo.baseContext+'/service/image/id'+options.image.id+'width'+width+'height'+height+'.jpg'});
			t.appendChild(img);
			if (options.zoom) {
				hui.cls.add(t,'oo_thumbnail_zoom');
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
		if (hui.isArray(id)) {
			for (var i=0; i < id.length; i++) {
				var nd = hui.get(id[i]);
				if (nd) {
					nodes.push(nd);
				} else {
					hui.log('Node not found : '+id[i]);
				}
			};
		} else {
			var node = hui.get(id);
			if (!node) {
				hui.log('Node not found: '+id);
			} else {
				nodes.push(node);
			}
		}
		hui.request({
			url : document.location+'',
			onSuccess : function(t) {
				var e = hui.build('div',{html:t.responseText});
				for (var i=0; i < nodes.length; i++) {
					var oldNode = nodes[i];
					hui.ui.destroyDescendants(oldNode);
					try {
						var newNode = hui.get.byId(e,oldNode.id);
						hui.dom.replaceNode(oldNode,newNode);
						hui.dom.runScripts(newNode);
					} catch (e) {
						hui.log(e);
					}
				};
				if (options.onComplete) {
					options.onComplete();
				}
			},onException : function(a,b) {
				hui.log(a);
				hui.log(b);
			}
		})
	}
}

oo.Gallery = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.images = options.images;
	hui.ui.extend(this);
	this.addBehavior();
}

oo.Gallery.prototype = {
	addBehavior : function() {
		var self = this;
		var slideShow = hui.get.firstByClass(this.element,'oo_gallery_slideshow');
		if (slideShow) {
			hui.listen(slideShow,'click',function(e) {
				self.imageWasClicked(0);
				hui.stop(e);
			});
		}
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