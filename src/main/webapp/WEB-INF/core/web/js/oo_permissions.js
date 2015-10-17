oo.Permissions = function(options) {
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	var desc = hui.ui.getDescendants(this);
	desc[0].listen({
		$valueChanged : function(value) {
			hui.ui.request({
				message : {start:'Changing access', delay:300, success:'Access changed'},
				url : oo.appContext+'/service/model/changeAccess',
				parameters : {entityId : options.entityId, publicView : value},
				$failure : function() {
					hui.ui.showMessage({text:'Unable to change access',icon:'common/warning',duration:2000});
				}
			})

		}
	})
};