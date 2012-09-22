var imagesController = {
	dragDrop : [
		{drag:'image',drop:'tag'}
	],
	images : [],
	
	
	$drop$image$tag : function(dragged,dropped) {
		Common.addTag(dragged.id,dropped.value,function() {
			this.refreshAll();
		}.bind(this));
	},
	
	refreshAll : function() {
		tagsSource.refresh();
		imagesSource.refresh();
	},
	
	//////////////// Image //////////////
	
	$itemOpened$imageGallery : function(object) {
		this.imageId = object.id;
		AppCommunity.getImage(object.id,function(image) {
			imageFormula.setValues(image);
			imageWindow.show();
		})
	},
	
	$click$cancelImage : function(object) {
		imageFormula.reset();
		imageWindow.hide();
	},
	
	$click$saveImage : function() {
		var values = imageFormula.getValues();
		var self = this;
		AppCommunity.updateImage(this.imageId,values.name,values.description,values.tags,function() {
			self.refreshAll();
			imageFormula.reset();
			imageWindow.hide();
		});
	},
	
	$click$deleteImage : function() {
		var self = this;
		Common.deleteEntity(this.imageId,function() {
			self.refreshAll();
			imageFormula.reset();
			imageWindow.hide();
		});
	},
	$click$deleteSelectedImage : function() {
		var obj = imageGallery.getFirstSelection();
		if (obj) {			
			Common.deleteEntity(obj.id,function() {
				this.refreshAll();
				imageFormula.reset();
				imageWindow.hide();
			}.bind(this));
		}
	},
	
	//////////////// Upload //////////////
	
	$click$newImage : function() {
		newImageWindow.show();
	},
	
	$uploadDidCompleteQueue : function() {
		this.refreshAll();
	},
	
	/////////////// Slide show ////////////
	
	$click$slideShow : function() {
		if (!this.viewer) {
			this.viewer = hui.ui.ImageViewer.create();
			this.viewer.listen(this);
		}
		this.viewer.clearImages();
		this.viewer.addImages(imageGallery.getObjects());
		this.viewer.show();
	},
	
	///////////// Image gallery //////////
	
	$resolveImageUrl : function(image,width,height) {
		return hui.ui.context+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	}
}