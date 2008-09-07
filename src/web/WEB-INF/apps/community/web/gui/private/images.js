var imagesController = {
	interfaceIsReady : function() {
		this.refreshImageGallery();
		imageGallery.addDelegate({resolveImageUrl:this.resolveImageUrl});
	},
	
	//////////////// Image //////////////
	
	itemOpened$imageGallery : function(object) {
		this.imageId = object.id;
		AppCommunity.getImage(object.id,function(image) {
			N2i.log(image);
			imageFormula.setValues(image);
			imageWindow.show();
		})
	},
	
	click$cancelImage : function(object) {
		imageFormula.reset();
		imageWindow.hide();
	},
	
	click$saveImage : function() {
		var values = imageFormula.getValues();
		var self = this;
		AppCommunity.updateImage(this.imageId,values.name,values.description,values.tags,function() {
			self.refreshImageGallery();
			imageFormula.reset();
			imageWindow.hide();
		});
	},
	
	click$deleteImage : function() {
		var self = this;
		Common.deleteEntity(this.imageId,function() {
			self.refreshImageGallery();
			imageFormula.reset();
			imageWindow.hide();
		});
	},
	
	//////////////// Upload //////////////
	
	click$newImage : function() {
		newImageWindow.show();
	},
	
	uploadDidComplete : function() {
		this.refreshImageGallery();
	},
	
	/////////////// Slide show ////////////
	
	click$slideShow : function() {
		if (!this.viewer) {
			this.viewer = In2iGui.ImageViewer.create('imageViewer');
			this.viewer.addDelegate(this);
		}
		this.viewer.clearImages();
		this.viewer.addImages(imageGallery.getObjects());
		this.viewer.show();
	},
	
	///////////// Image gallery //////////
	
	refreshImageGallery : function() {
		AppCommunity.listImages(function(list) {
			imageGallery.setObjects(list);
		});
	},
	resolveImageUrl : function(image,width,height) {
		return In2iGui.context+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	}
}