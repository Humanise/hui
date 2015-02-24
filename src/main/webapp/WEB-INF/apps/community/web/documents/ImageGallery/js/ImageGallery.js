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
	isActiveEditor : function() {
		if (OO.Editor && OO.Editor.ImageGallery) {
			return OO.Editor.ImageGallery.getInstance().isActive();
		}
		return false;
	},
	addBehaviour : function() {
		var self = this;
		for (var i=0; i < this.images.length; i++) {
			var tag = hui.get('image-'+this.images[i].id);
			tag.imageGalleryIndex = i;
			tag.onclick = function() {
				if (!self.isActiveEditor()) {
					self.imageWasClicked(this.imageGalleryIndex);
				}
			}
		};
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.viewer) {
			this.viewer = hui.ui.ImageViewer.create();
			this.viewer.listen(this);
		}
		if (this.dirty) {
			this.viewer.clearImages();
			this.viewer.addImages(this.images);
			this.dirty = false;
		}
		return this.viewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return OnlineObjects.baseContext+'/service/image/?id='+image.id+'&width='+Math.ceil(width)+'&height='+Math.ceil(height);
	}
}

hui.onReady(function() {
	OO.ImageGallery.getInstance().ignite();
});
