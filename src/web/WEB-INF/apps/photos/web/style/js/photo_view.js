var photoView = {
	imageId : null,
	editable : false,
	
	$ready : function() {
		if (this.editable) {
			new oo.InlineEditor({
				element : 'editableTitle',
				name : 'titleEditor'
			});
		}
	},
	$valueChanged$titleEditor : function(value) {
		AppPhotos.updateImageTitle(this.imageId,value,{
			callback : function() {
				hui.ui.showMessage({text:'The title is changed',duration:1000,icon:'common/success'});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to change title',icon:'common/warning',duration:2000});
			}
		})
	}
};

hui.ui.listen(photoView)