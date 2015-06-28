var photosLayoutView = {
	$click$addImageGallery : function() {
		hui.ui.request({
			messages : {start:'Creating gallery'},
			url : oo.appContext+'/createGallery',
			$object : function(gallery) {
				hui.ui.showMessage({text:'Gallery created',icon:'common/success',duration:2000});
				window.setTimeout(function() {
					document.location = oo.appContext+'/'+oo.language+'/gallery/'+gallery.id+'/';
				},1000);
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Could not create gallery',icon:'common/warning',duration:2000});
			}
		});

	}
}
hui.ui.listen(photosLayoutView);