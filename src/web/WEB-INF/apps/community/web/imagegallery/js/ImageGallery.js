if (!OO) var OO={};

OO.ImageGallery = function() {
	this.images = [];
	this.style = 'elegant';
	this.viewer = null;
	this.dirty = false;
}

OO.ImageGallery.getInstance = function() {
	if (!OO.ImageGallery.instance) {
		OO.ImageGallery.instance = new OO.ImageGallery();
	}
	return OO.ImageGallery.instance;
}

OO.ImageGallery.prototype = {
	
	clearImages : function() {
		this.images = [];
		this.dirty = true;
	},
	addImage : function(id,width,height) {
		this.images.push({id:id,width:width,height:height});
		this.dirty = true;
	},
	rebuild : function() {
		this.addBehaviour();
	},
	ignite : function() {
		this.addBehaviour();
	},
	addBehaviour : function() {
		var self = this;
		for (var i=0; i < this.images.length; i++) {
			var tag = $id('image-'+this.images[i].id);
			tag.imageGalleryIndex = i;
			tag.onclick = function() {
				self.imageWasClicked(this.imageGalleryIndex);
			}
		};
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.viewer) {
			this.viewer = In2iGui.ImageViewer.create();
			this.viewer.addDelegate(this);
		}
		if (this.dirty) {
			this.viewer.clearImages();
			this.viewer.addImages(this.images);
			this.dirty = false;
		}
		return this.viewer;
	},
	resolveImageUrl : function(image,width,height) {
		return OnlineObjects.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	}
}

/**************************** Viewer ****************************/

OO.ImageGallery.Viewer = function(gallery) {
	this.currentImage = 0;
	this.width = 800;
	this.height = 600;
	this.gallery = gallery;
	this.build();
}

OO.ImageGallery.Viewer.prototype.destroy = function() {
	this.base.parentNode.removeChild(this.base);
}

OO.ImageGallery.Viewer.prototype.build = function() {
	this.base = document.createElement('div');
	this.base.className='viewer';
	this.base.style.display = 'none';
	
	this.content = document.createElement('div');
	this.content.className='content';
	this.base.appendChild(this.content);
	
	this.controls = document.createElement('div');
	this.controls.className='controls';
	this.base.appendChild(this.controls);
	
	this.previous = document.createElement('div');
	this.previous.className='previous';
	this.controls.appendChild(this.previous);
	
	this.play = document.createElement('div');
	this.play.className='play';
	this.controls.appendChild(this.play);
	
	this.next = document.createElement('div');
	this.next.className='next';
	this.controls.appendChild(this.next);
	
	this.close = document.createElement('div');
	this.close.className='close';
	this.controls.appendChild(this.close);
	
	this.buildImages();
	this.addBehaviour();
	document.body.appendChild(this.base);
}

OO.ImageGallery.Viewer.prototype.buildImages = function() {
	this.container = document.createElement('div');
	this.container.className='container';
	this.container.style.width=(this.width*this.gallery.images.length)+'px';
	for (var i=0; i < this.gallery.images.length; i++) {
		var image = this.gallery.images[i];
		var holder = document.createElement('div');
		holder.className = 'image';
		holder.style.backgroundImage = 'url(\''+OnlineObjects.baseContext+'/service/image/?id='+image.id+'&width=760&height=510\')';
		this.container.appendChild(holder);
	};
	this.content.appendChild(this.container);
}

OO.ImageGallery.Viewer.prototype.addBehaviour = function() {
	var self = this;
	this.next.onclick = function() {
		self.move(1);
	}
	this.previous.onclick = function() {
		self.move(-1);
	}
	this.close.onclick = function() {
		var del = {onComplete : function() {
			self.base.style.display='none';
		}};
		$ani(self.base,'opacity',0,200,del);
	}
}

OO.ImageGallery.Viewer.prototype.move = function(dir) {
	var flip = false;
	this.currentImage+=dir;
	if (this.currentImage<0) {
		this.currentImage = this.gallery.images.length-1;
		flip = true;
	}
	else if (this.currentImage>(this.gallery.images.length-1)) {
	 	this.currentImage = 0;
		flip = true
	}
	$ani(this.content,'scrollLeft',this.currentImage*this.width,flip ? 600 : 600,{ease:N2i.Animation.slowFastSlow});
}

OO.ImageGallery.Viewer.prototype.show = function(index) {
	this.currentImage = index;
	this.base.style.opacity = 0;
	this.base.style.display = '';
	this.content.scrollLeft=this.currentImage*this.width;
	$ani(this.base,'opacity',1,200);
}

N2i.Event.addLoadListener(function() {
	OO.ImageGallery.getInstance().ignite();
});
