oo.community.RecoverPassword = {
	key : null,
	userUrl : null,
	
	$interfaceIsReady : function() {
		ui.get('password').focus();
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
		var password = ui.get('password').getValue();
		var passwordAgain = ui.get('passwordAgain').getValue();
		if (n2i.isEmpty(password) || n2i.isEmpty(passwordAgain)) {
			ui.showMessage({text:'Begge kodeord skal udfyldes',duration:2000});
			if (n2i.isEmpty(password)) {
				 ui.get('password').focus();
			} else if (n2i.isEmpty(passwordAgain)) {
				 ui.get('passwordAgain').focus();
			}
		} else if (password!==passwordAgain) {
			ui.showMessage({text:'De to kodeord er ikke ens',duration:2000});
		} else {
			var url = this.userUrl;
			CoreSecurity.changePassword(this.key,password,function(success) {
				if (success) {
					ui.showMessage({text:'Dit kodeord er nu ændret',duration:3000});
					window.setTimeout(function() {window.location=url}.bind(this),2000)
				} else {
					ui.alert({title:'Kodeordet kunne ikke ændres',text:'Dette kan skyldes at koden allerede er ændret eller at tidsfristen er udløbet.',emotion:'gasp'});
				}
			})
		}
	}
};
ui.get().listen(oo.community.RecoverPassword);