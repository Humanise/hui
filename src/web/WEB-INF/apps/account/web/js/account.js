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
			$failure : function() {
				hui.ui.msg({text:'Unable to change password',icon:'common/warning',duration:3000});
				form.focus();
			}
		})
	}
};

var passwordView = {
	
	key : null,
	
	$ready : function() {
		hui.ui.get('resetPasswordForm').focus();
	},
	$submit$resetPasswordForm : function(form) {
		var values = form.getValues();
		if (hui.isBlank(values.password) || hui.isBlank(values.passwordAgain)) {
			form.focus();
			hui.ui.msg.fail({text:{da:'Udfyld venligst begge felter',en:'Please fill in both fields'}});
			return;
		}
		if (values.password!==values.passwordAgain) {
			form.focus();
			hui.ui.msg.fail({text:{da:'De to kodeord er ikke ens',en:'The passwords are not equal'}});
			return;			
		}
		hui.ui.request({
			url : oo.baseContext+'/changePasswordUsingKey',
			parameters : {
				key : this.key,
				password : values.password
			},
			$success : function() {
				hui.ui.msg.success({text:{da:'Din kode er ændret',en:'Your password is changed'}});
				form.reset();
				setTimeout(function() {
					document.location = oo.baseContext+'/';					
				},1000);
			},
			$failure : function() {
				hui.ui.msg.fail({text:{da:'Det lykkedes ikke, ',en:'Your password is changed'}});
				form.focus();
			}
		})
	}
}