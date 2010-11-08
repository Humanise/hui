ui.listen({
	imageId : null,
		
	$resolveImageUrl : function(img,width,height) {
		return '../../../../util/images/?id='+img.id+'&maxwidth='+width+'&maxheight='+height+'&format=jpg';
	},
	
	$selectionChanged$gallery : function() {
		ui.get('delete').setEnabled(true);
		ui.get('view').setEnabled(true);
		ui.get('download').setEnabled(true);
		ui.get('info').setEnabled(true);
		ui.get('replace').setEnabled(true);
	},
	$selectionReset$gallery : function() {
		ui.get('delete').setEnabled(false);
		ui.get('view').setEnabled(false);
		ui.get('download').setEnabled(false);
		ui.get('info').setEnabled(false);
		ui.get('replace').setEnabled(false);
	},
	
	$click$view : function() {
		var obj = gallery.getFirstSelection();
		window.open('../../../../util/images/?id='+obj.id,"filewindow"+obj.id);
	},
	$click$download : function() {
		var obj = gallery.getFirstSelection();
		document.location = 'DownloadImage.php?id='+obj.id;
	},
	$click$delete : function() {
		var obj = gallery.getFirstSelection();
		this._deleteImage(obj.id);
	},
	$click$deleteImage : function() {
		this._deleteImage(this.imageId);
	},
	$click$info : function() {
		var obj = gallery.getFirstSelection();
		this._loadImage(obj.id);
	},
	
	$itemOpened$gallery : function(item) {
		this._loadImage(item.id);
	},
	$click$cancelImage : function() {
		this._cancelImage();
	},
	
	$click$saveImage : function() {
		var self = this;
		var data = imageFormula.getValues();
		data.id = this.imageId;
		ui.request({url:'SaveImage.php',json:{data:data},onSuccess:function() {
			imagesSource.refresh();
			groupSource.refresh();
			self._cancelImage();
			ui.showMessage({text:'Billedet er gemt!',duration:2000});			
		}});
	},
	_cancelImage : function() {
		imageFormula.reset();
		imageWindow.hide();
		this.imageId = null;
	},
	_loadImage : function(id) {
		var self = this;
		ui.request({url:'LoadImage.php',parameters:{id:id},onJSON:function(data) {
			self.imageId = id;
			imageFormula.setValues(data.image);
			imageGroups.setValue(data.groups);
			imageWindow.show();
		}});
	},
	_deleteImage : function(id) {
		if (id===this.imageId) {
			this._cancelImage();
		}
		ui.request({url:'DeleteImage.php',parameters:{id:id},onSuccess:function() {
			imagesSource.refresh();
			groupSource.refresh();
			ui.showMessage({text:'Billedet er nu slettet',duration:2000});
		}});
	}
	
});