var controller = {
	interfaceIsReady : function() {
		this.refreshList();
	},
	click$refresh : function() {
		this.refreshList();
	},
	refreshList : function() {
		AppSetup.listEntities(function(data) {
			list.setObjects(data);
		});
	}
}