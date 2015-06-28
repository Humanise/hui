hui.ui.listen({
	userId : 0,
	
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
		userFormula.reset();
		userEditor.show();
		userEditor.setBusy('Loading');
		this.userId = row.id;
		hui.ui.request({
			url : 'loadUser',
			parameters :{id : row.id},
			$object : function(user) {
				userFormula.setValues(user);
				userEditor.setBusy(false);
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
		hui.ui.request({
			url : 'deleteUser',
			parameters :{id : this.userId},
			$success : function(user) {
				userFormula.reset();
				userEditor.hide();
				listSource.refresh();
			}
		})
	},
	$select$selection : function() {
		list.resetState();
	},
  
  
  // Members...
  
  $click$newMember : function() {
    memberWindow.show();
    memberFormula.reset();
    memberFormula.focus();
  },
  
  $submit$memberFormula : function() {
    var values = memberFormula.getValues();
		memberWindow.setBusy('Creating');

		hui.ui.request({
			url : 'createMember',
			parameters : values,
			$success : function(user) {
				memberFormula.reset();
				memberWindow.hide();
				listSource.refresh();
			},
      $failure : function() {
        hui.ui.msg.fail({text:'Unable to create member'});
      },
      $finally : function() {
    		memberWindow.setBusy(false);
      }
		})
    
  }
});