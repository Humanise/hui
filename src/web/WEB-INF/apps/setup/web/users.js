hui.ui.listen({
	userId : 0,
	
	interfaceIsReady : function() {
	},
	$valueChanged$search : function() {
		list.resetState();
	},
	$open$list : function(row) {
		if (row.kind=='user') {
			this.loadUser(row);
		} else {
			this.entityId = row.id;
			entityEditor.setTitle(row.title);
			AppSetup.getEntityInfo(row.id,function(info) {
				entityFormula.setValues(info);
				entityEditor.show();
			});
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
	$click$cancelUser : function() {
		this.userId = 0;
		userFormula.reset();
		userEditor.hide();
	},
	$click$deleteUser : function() {
		AppSetup.deleteUser(this.userId,function() {
			userFormula.reset();
			userEditor.hide();
			listSource.refresh();
		});
	},
	$select$selection : function() {
		list.resetState();
	}
});