oo.community.RecoverPassword = {
	key : null,
	userUrl : null,
	
	$interfaceIsReady : function() {
		hui.ui.get('password').focus();
	},
	
	$click$changePassword : function() {
		this.changePassword();
	},
	$submit$password : function() {
		this.changePassword();
	},
	$submit$passwordAgain : function() {
		this.changePassword();
	},

	changePassword : function() {
		var password = hui.ui.get('password').getValue();
		var passwordAgain = hui.ui.get('passwordAgain').getValue();
		if (hui.isBlank(password) || hui.isBlank(passwordAgain)) {
			hui.ui.showMessage({text:'Begge kodeord skal udfyldes',duration:2000});
			if (hui.isBlank(password)) {
				 hui.ui.get('password').focus();
			} else if (hui.isBlank(passwordAgain)) {
				 hui.ui.get('passwordAgain').focus();
			}
		} else if (password!==passwordAgain) {
			hui.ui.showMessage({text:'De to kodeord er ikke ens',duration:2000});
		} else {
			var url = this.userUrl;
			CoreSecurity.changePassword(this.key,password,function(success) {
				if (success) {
					hui.ui.showMessage({text:'Dit kodeord er nu ændret',duration:3000});
					window.setTimeout(function() {window.location=url}.bind(this),2000)
				} else {
					hui.ui.alert({title:'Kodeordet kunne ikke ændres',text:'Dette kan skyldes at koden allerede er ændret eller at tidsfristen er udløbet.',emotion:'gasp'});
				}
			})
		}
	}
};
hui.ui.listen(oo.community.RecoverPassword);