var controller = {
	interfaceIsReady : function() {
		this.refreshList();
		Common.getClasses(function(data) {
			classes.itemsLoaded(data);
		})
	},
	click$refresh : function() {
		this.refreshList();
	},
	refreshList : function() {
		AppSetup.listEntities(selection.getValue(),function(data) {
			list.setObjects(data);
		});
	},
	selectionChanged : function() {
		this.refreshList();
	}
}