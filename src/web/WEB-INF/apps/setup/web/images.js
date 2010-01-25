ui.get().listen({
	$resolveImageUrl : function(image,width,height) {
		return In2iGui.context+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	},
	$click$syncImages : function(icon) {
		icon.setEnabled(false);
		ui.showMessage({text:'Syncing images...'});
		AppSetup.synchronizeImageMetaData(function() {
			icon.setEnabled(true);
			ui.showMessage({text:'Sync complete!',duration:2000});
		});
	}
})