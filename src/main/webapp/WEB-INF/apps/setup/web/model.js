var controller = {
	userId : 0,
	entityId : undefined,
	
	$valueChanged$search : function() {
		list.resetState();
	},
	$open$list : function(row) {
		this.entityId = row.id;
		entityEditor.setTitle(row.title);
		hui.ui.request({
			url : 'getEntityInfo',
			parameters : {id:row.id},
			$object : function(info) {
				entityFormula.setValues(info);
				entityEditor.show();
			}
		})
	},
	$click$updateEntity : function() {
		var info = entityFormula.getValues();
		info.id = this.entityId;

		hui.ui.request({
			url : 'updateEntityInfo',
			json : {data:info},
			$success : function(info) {
				listSource.refresh();
				entityFormula.reset();
				entityEditor.hide();
			}
		})
	},
	$select$selection : function() {
		list.resetState();
	}
}