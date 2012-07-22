ui.listen({
	applicationId : null,
	
	$click$newApplication : function() {
		applicationWindow.show();
		applicationFormula.reset();
		deleteApplication.setEnabled(false);
		applicationFormula.focus();
	},
	_resetApplication : function() {
		applicationFormula.reset();
		this.applicationId = null;
		applicationWindow.hide();
	},
	$click$cancelApplication : function() {
		this._resetApplication();
	},
	$click$deleteApplication : function() {
		AppSetup.deleteApplication(this.applicationId,function() {
			listSource.refresh();
			this._resetApplication();
		}.bind(this));
	},
	$submit$applicationFormula : function() {
		values = applicationFormula.getValues();
		values.id = this.applicationId;
		AppSetup.saveApplication(values,function() {
			listSource.refresh();
			this._resetApplication();
		}.bind(this));
	},
	$open : function(row) {
		AppSetup.getApplication(row.id,function(obj) {
			this.applicationId = obj.id;
			applicationFormula.setValues(obj);
			applicationWindow.show();
			deleteApplication.setEnabled(true);
			applicationFormula.focus();
		}.bind(this));
	}
})