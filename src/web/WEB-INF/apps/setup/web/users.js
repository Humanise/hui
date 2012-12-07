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
		hui.ui.request({
			url : 'loadUser',
			parameters :{id : row.id},
			$object : function(user) {
				userFormula.setValues(user);
				userEditor.show();
			}
		})
	},
	$click$saveUser : function() {
		var values = userFormula.getValues();
		values.id = this.userId;
		hui.ui.request({
			url : 'saveUser',
			json : {user : values},
			$success : function(user) {
				list.refresh();
			}
		})
		this.userId = 0;
		userFormula.reset();
		userEditor.hide();
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