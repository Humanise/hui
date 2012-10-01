var controller = {
	userId : 0,
	entityId : undefined,
	
	$valueChanged$search : function() {
		list.resetState();
	},
	$open$list : function(row) {
		this.entityId = row.id;
		entityEditor.setTitle(row.title);
		AppSetup.getEntityInfo(row.id,function(info) {
			entityFormula.setValues(info);
			entityEditor.show();
		});
	},
	$click$updateEntity : function() {
		var info = entityFormula.getValues();
		info.id = this.entityId;
		AppSetup.updateEntityInfo(info,function() {
			listSource.refresh();
			entityFormula.reset();
			entityEditor.hide();
		});
	},
	$select$selection : function() {
		list.resetState();
	}
}