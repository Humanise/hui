var accountView = {
	$submit$mailForm : function() {
		var values = hui.ui.get('mailForm').getValues();
		hui.ui.request({
			url : oo.baseContext+'/service/model/changePrimaryEmail',
			parameters : {email:values.mail},
			$success : function() {
				hui.ui.msg({text:'The e-mail address is changed',icon:'common/success',duration:3000});
			},
			$failure : function() {
				hui.ui.msg({text:'The e-mail address was not changed',icon:'common/warning',duration:3000});
			}
		})
	},
	$submit$passwordForm : function(form) {
		var values = form.getValues();
		hui.ui.request({
			url : oo.baseContext+'/changePassword',
			parameters : {
				currentPassword : values.currentPassword,
				newPassword : values.newPassword
			},
			$success : function() {
				hui.ui.msg({text:'Your password is changed',icon:'common/success',duration:3000});
				form.reset();
			},
			$failure : function(e) {
				hui.log(e);
				hui.ui.msg({text:'Unable to change password',icon:'common/warning',duration:3000});
				form.focus();
			}
		})
	},
	$click$newSecret : function() {

		hui.ui.request({
			url : oo.baseContext+'/generateNewSecret',
			$object : function(info) {
				hui.get('secret').value = info;
			},
			$failure : function(e) {
				hui.ui.msg.fail({text:'Unable to generate secret'});
			}
		})
	}
};
hui.ui.listen(accountView);