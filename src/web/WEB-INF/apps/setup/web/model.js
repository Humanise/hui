var controller = {
	userId:0,
	
	interfaceIsReady : function() {
	},
	listRowWasOpened : function(row) {
		if (row.kind=='user') {
			this.loadUser(row);
		} else {
			entityFormula.setValues(row);
			entityEditor.show();
		}
	},
	loadUser : function(row) {
		this.userId = row.id;
		Common.getEntity(row.id,function(user) {
			userFormula.setValues(user);
			userEditor.show();
		});
	},
	onClick$saveUser : function() {
		var values = userFormula.getValues();
		AppSetup.updateUser(this.userId,values.username,values.password,function() {
			userFormula.reset();
			userEditor.hide();
			listSource.refresh();
		});
	},
	onClick$deleteUser : function() {
		AppSetup.deleteUser(this.userId,function() {
			userFormula.reset();
			userEditor.hide();
			listSource.refresh();
		});
	},
	onSelectionChange$selection : function() {
		list.resetState();
	}
}