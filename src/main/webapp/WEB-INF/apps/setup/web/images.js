hui.ui.listen({
	$resolveImageUrl : function(image,width,height) {
		return hui.ui.context+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	},
	$click$syncImages : function(icon) {
		icon.setEnabled(false);
		hui.ui.showMessage({text:'Syncing images...'});
		AppSetup.synchronizeImageMetaData(function() {
			icon.setEnabled(true);
			hui.ui.showMessage({text:'Sync complete!',duration:2000});
		});
	}
})