var controller = {
	userId:0,
	
	interfaceIsReady : function() {
	},
	$valueChanged$search : function() {
		list.resetState();
	},
	$listRowWasOpened : function(row) {
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
	$click$saveUser : function() {
		var values = userFormula.getValues();
		AppSetup.updateUser(this.userId,values.username,values.password,function() {
			userFormula.reset();
			userEditor.hide();
			listSource.refresh();
		});
	},
	$click$deleteUser : function() {
		AppSetup.deleteUser(this.userId,function() {
			userFormula.reset();
			userEditor.hide();
			listSource.refresh();
		});
	},
	$selectionChanged$selection : function() {
		list.resetState();
	}
}