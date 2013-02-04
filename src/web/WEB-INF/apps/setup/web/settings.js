var controller = {
	$submit$formula : function() {
		var values = formula.getValues();
		if (values.password1!==values.password2) {
			hui.ui.showMessage({text:'The two passwords are not equal',icon:'common/warning',duration:2000})
			formula.focus();
			return;
		}
		hui.ui.request({
			url : 'changeAdminPassword',
			parameters : {password:values.password1},
			$success : function() {
				formula.reset();
				hui.ui.showMessage({text:'The password is now changed',icon:'common/success',duration:2000})
			},
			$failure : function() {
				hui.ui.showMessage({text:'The password could not be changed',icon:'common/warning',duration:2000})
				formula.focus();
			}
		})
	}
}