var controller = {
	interfaceIsReady : function() {
		this.refreshList();
	},
	click$refresh : function() {
		this.refreshList();
	},
	refreshList : function() {
		AppSetup.listJobs(function(data) {
			list.setObjects(data);
		})
	},
	click$start : function() {
		var item = list.getFirstSelection();
		if (item) {
			var self = this;
			AppSetup.startJob(item.name,item.group,function() {
				self.refreshList();
			});
		}
	}
}