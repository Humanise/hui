hui.ui.listen({
	accountId:0,
	
	$click$newAccount : function() {
		this.accountId = 0;
		accountWindow.show();
		accountFormula.reset();
		deleteAccount.setEnabled(false);
		accountFormula.focus();
	},
	$click$deleteAccount : function() {
		Common.deleteEntity(this.accountId,function() {
			accountFormula.reset();
			accountWindow.hide();
			accountsSource.refresh();
		});
		this.accountId = null;
	},
	$click$cancelAccount : function() {
		this.accountId = 0;
		accountWindow.hide();
		accountFormula.reset();
	},
	$submit$accountFormula : function() {
		var data = accountFormula.getValues();
		data.id = this.accountId;
		AppCommunityTools.saveAccount(data,function() {
			accountsSource.refresh();
			accountFormula.reset();
			accountWindow.hide();
		})
	},
	$open$accountsList : function(item) {
		this.accountId = item.id;
		accountFormula.reset();
		deleteAccount.setEnabled(false);
		Common.getEntity(item.id,function(data) {
			accountFormula.setValues(data);
			accountWindow.show();
			deleteAccount.setEnabled(true);
			accountFormula.focus();
		})
	}
});