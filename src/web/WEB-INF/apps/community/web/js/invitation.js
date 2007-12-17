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
		} else {

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
  			errorHandler:function(errorString, exception) { alert(errorString); }
		};
		CommunityTool.signUpFromInvitation(code,username,password,delegate);
	},
	
	userDidSignUp : function(username) {
		alert('Du er nu oprettet som bruger og vil blive taget til dit nye websted!');
		document.location=info.appContext+'/'+username+'/';
	}
}

N2i.Event.addLoadListener(function() {
	new OO.Community.InvitationPage();
})