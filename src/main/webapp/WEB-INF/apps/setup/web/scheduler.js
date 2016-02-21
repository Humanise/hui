var controller = {

	$ready : function() {
		this._checkStatus();
	},
	$select$list : function() {
		var item = list.getFirstSelection();
		if (item && item.data && item.data.status=='PAUSED') {
			pause.setLabel('Resume');
			pause.setIcon('common/move_right');
		} else {
			pause.setLabel('Pause');
			pause.setIcon('common/pause');
		}
    interrupt.setEnabled(item && item.data.running);
		pause.setEnabled(item!=null);
		start.setEnabled(item!=null);
	},
	$clickIcon$list : function(info) {
		if (info.data=='play') {
			this._startJob(info.row.data);			
		}
	},
	_refresh : function() {
		listSource.refresh();
		window.setTimeout(this._refresh.bind(this),2000);
	},
	$click$refresh : function() {
		listSource.refresh();
	},
	$valueChanged$active : function(value) {
		hui.ui.request({
			url : 'toggleScheduler',
			parameters : {active : value},
			$success : function() {
				listSource.refresh();
				this._checkStatus();
			}.bind(this)
		})
	},
	
	$click$start : function() {
		var item = list.getFirstSelection();
		if (item && item.data) {
			this._startJob(item.data);
		}
	},
	
	_startJob : function(data) {
		hui.ui.request({
			url : 'startJob',
			parameters : data,
			$success : function() {
				listSource.refresh();
			}
		})		
	},
	
	$click$interrupt : function() {
		var item = list.getFirstSelection();
		if (item && item.data) {
			hui.ui.request({
				url : 'stopJob',
				parameters : item.data,
				$success : function() {
					listSource.refresh();
				}
			})
		}
	},
	$click$pause : function() {
		var item = list.getFirstSelection();
		if (item && item.data) {
			var url = item.data.status=='PAUSED' ? 'resumeJob' : 'pauseJob';
			hui.ui.request({
				url : url,
				parameters : item.data,
				$success : function() {
					listSource.refresh();
				}
			})
		}
	},
	_checkStatus : function() {
		hui.ui.request({
			url : 'getSchedulerStatus',
			$object : function(status) {
				statusText.setText(status.running ? 'Running' : 'Paused');
				active.setValue(status.running)
			}
		})
	},
		
	///////////// Live refresh ///////////
	
	live : true,

	$valueChanged$live : function(value) {
		this.live = value;
		if (value) {
			this.$sourceIsNotBusy$listSource();
			this.$sourceIsNotBusy$logListSource();
		}
	},
	$sourceIsNotBusy$listSource : function() {
		if (this.live) {
			window.clearTimeout(this.liveTimer);
			this.liveTimer = window.setTimeout(function() {
				listSource.refresh();
			},2000);
		}
	},
	$sourceIsNotBusy$logListSource : function() {
		if (this.live) {
			window.clearTimeout(this.logTimer);
			this.logTimer = window.setTimeout(function() {
				logListSource.refresh();
			},2000);
		}
	}

}