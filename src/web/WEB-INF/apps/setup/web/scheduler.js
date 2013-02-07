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
		var item = list.getFirstSelection();
		if (item && item.data) {
			hui.ui.request({
				url : 'startJob',
				parameters : item.data,
				$success : function() {
					listSource.refresh();
				}
			})
		}
	},
	
	$click$toggle : function() {
		hui.ui.request({
			url : 'toggleScheduler',
			$success : function() {
				listSource.refresh();
			}
		})
	}
}