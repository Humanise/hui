var controller = {
	$ready : function() {
		//this._refresh();
	},
	_refresh : function() {
		listSource.refresh();
		window.setTimeout(this._refresh.bind(this),2000);
	},
	$click$refresh : function() {
		listSource.refresh();
	},
	$click$start : function() {
		var item = list.getFirstSelection().data;
		if (item) {
			var self = this;
			AppSetup.startJob(item.name,item.group,function() {
				listSource.refresh();
			});
		}
	}
}