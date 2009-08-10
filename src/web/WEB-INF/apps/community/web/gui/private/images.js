var imagesController = {
	dragDrop : [
		{drag:'image',drop:'tag'}
	],
	images : [],
	$interfaceIsReady : function() {
		imageGallery.addDelegate({$resolveImageUrl:this.$resolveImageUrl});
	},
	
	
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
			this.viewer = ui.ImageViewer.create();
			this.viewer.addDelegate(this);
		}
		this.viewer.clearImages();
		this.viewer.addImages(imageGallery.getObjects());
		this.viewer.show();
	},
	
	///////////// Image gallery //////////
	
	$resolveImageUrl : function(image,width,height) {
		return In2iGui.context+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	}
}