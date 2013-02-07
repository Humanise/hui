hui.ui.listen({
	live : false,
	
	$ready : function() {
		
	},
	$click$refresh : function() {
		listSource.refresh();
	},
	$valueChanged$live : function(value) {
		this.live = value;
		if (value) {
			this.$sourceIsNotBusy$listSource();
		}
	},
	$sourceIsNotBusy$listSource : function() {
		if (this.live) {
			window.setTimeout(function() {
				listSource.refresh();
			},2000);
		}
	}
});