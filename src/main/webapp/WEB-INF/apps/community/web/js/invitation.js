oo.community.Invitation = {
	code : null,
	
	$ready : function() {
		var username = hui.ui.get('invitationUsername');
		if (username) {
			hui.ui.get('invitationUsername').select();
		}
	},
	
	$click$changePassword : function() {
		this.signUp();
	},
	$submit$invitationPassword : function() {
		this.signUp();
	},
	$submit$invitationPasswordAgain : function() {
		this.signUp();
	},
	$submit$invitationUsername : function() {
		this.signUp();
	},

	signUp : function() {
		var usernameField = hui.ui.get('invitationUsername');
		var passwordField = hui.ui.get('invitationPassword');
		var passwordAgainField = hui.ui.get('invitationPasswordAgain');
		var username = usernameField.getValue();
		var password = passwordField.getValue();
		var passwordAgain = passwordAgainField.getValue();
		if (hui.isEmpty(username)) {
			hui.ui.showMessage({text:'Brugernavnet skal udfyldes',duration:2000});
			usernameField.focus();
		} else if (hui.isEmpty(password) || hui.isEmpty(passwordAgain)) {
			hui.ui.showMessage({text:'Begge kodeord skal udfyldes',duration:2000});
			if (hui.isEmpty(password)) {
				 passwordField.focus();
			} else if (hui.isEmpty(passwordAgain)) {
				 passwordAgainField.focus();
			}
		} else if (password!==passwordAgain) {
			hui.ui.showMessage({text:'De to kodeord er ikke ens',duration:2000});
			passwordAgainField.select();
		} else {			
			var delegate = {
	  			callback:function() { this.userDidSignUp(username) }.bind(this),
	  			errorHandler:this.errorOccurred.bind(this)
			};
			AppCommunity.signUpFromInvitation(this.code,username,password,delegate);
		}
	},
	errorOccurred : function(error,exception) {
		if (exception.code=='userExists') {
			hui.ui.alert({
				emotion: 'gasp',
				title: 'Brugernavnet er optaget',
				text: 'Der findes desværre allerede en bruger med dette brugernavn. Prøv venligst med et andet...',
				onOK : function() {hui.ui.get('invitationUsername').select()}
			});
		} else if (exception.code=='invalidUsername') {
			hui.ui.alert({
				emotion: 'gasp',
				title: 'Brugernavnet indeholder ugyldige tegn',
				text: 'Det er kun tilladt at anvende små bogstaver mellem "a" og "z" samt tal. Du kan ikke anvende store bogstaver eller specialtegn.',
				onOK : function() {hui.ui.get('invitationUsername').select()}
			});
		} else {
			hui.log(exception);
			hui.ui.alert({
				emotion: 'gasp',
				title: 'Der skete en fejl!',
				text: 'Fejlbesked: '+error
			});
		}
	},
	
	userDidSignUp : function(username) {
		var msg = hui.ui.Alert.create({
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: 'Der er oprettet et website til dig. Desuden har du din egen profilside hvor du kan fortælle andre om dig selv...'
		});
		var button = hui.ui.Button.create({text : 'Gå til min profilside :-)'});
		button.listen({$click:function(){
			document.location=oo.appContext+'/'+username+'/';
		}});
		msg.addButton(button);
		msg.show();
	}
};
hui.ui.listen(oo.community.Invitation);















if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};

OO.Community.InvitationPage = function() {
	this.form = $id('formula');
	this.addBehavior();
}

OO.Community.InvitationPage.prototype = {
	
	addBehavior : function() {
		var self = this;
		this.form.onsubmit = function() {
			try {
				self.formDidSubmit();
			} catch (e) {N2i.log(e)}
			return false;
		}
	},

	formDidSubmit : function() {
		var username = this.form.username.value;
		var password1 = this.form.password1.value;
		var password2 = this.form.password2.value;
		var code = this.form.code.value;
		var error = false;
		error = this.checkNotEmpty('username') || error;
		error = this.checkNotEmpty('password1') || error;
		error = this.checkNotEmpty('password2') || error;
		if (!error && password1!=password2) {
			$id('password2_error').innerHTML='er ikke ens';
			error = true;
		}
		if (!error) {
			this.signUp(code,username,password1);
		}
	},
	
	checkNotEmpty : function(name) {
		var field = this.form[name];
		if (field.value.length==0) {
			$id(name+'_error').innerHTML = 'skal udfyldes';
			return true;
		} else {
			$id(name+'_error').innerHTML = '';
			return false;
		}
	},
	
	signUp : function(code,username,password) {
		var self = this;
		var delegate = {
  			callback:function() { self.userDidSignUp(username) },
  			errorHandler:function(errorString, exception) { self.errorOccurred(errorString); }
		};
		AppCommunity.signUpFromInvitation(code,username,password,delegate);
	},
	
	errorOccurred : function(error) {
		hui.ui.alert({
			emotion: 'gasp',
			title: 'Der skete en fejl!',
			text: 'Fejlbesked: '+error
		});
	},
	
	userDidSignUp : function(username) {
		var msg = hui.ui.Alert.create(null,{
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: 'Du vil modtage en e-mail hvor du skal bekræfte at du er dig. Indtil dette er gjort kan du frit anvende dit nye websted i op til 7 dage.'
		});
		var button = hui.ui.Button.create({text : 'Gå til mit ny websted :-)!'});
		button.listen({$click:function(){
			document.location=OnlineObjects.appContext+'/'+username+'/site/';
		}});
		msg.addButton(button);
		msg.show();
	}
}