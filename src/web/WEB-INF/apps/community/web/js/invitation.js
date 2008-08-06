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
		CommunityTool.signUpFromInvitation(code,username,password,delegate);
	},
	
	errorOccurred : function(error) {
		In2iGui.get().showAlert({
			emotion: 'gasp',
			title: 'Der skete en fejl!',
			text: 'Fejlbesked: '+error
		});
	},
	
	userDidSignUp : function(username) {
		var msg = In2iGui.Alert.create(null,{
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: 'Du vil modtage en e-mail hvor du skal bekræfte at du er dig. Indtil dette er gjort kan du frit anvende dit nye websted i op til 7 dage.'
		});
		var button = In2iGui.Button.create(null,{text : 'Gå til mit ny websted :-)!'});
		button.addDelegate({buttonWasClicked:function(){
			document.location=OnlineObjects.appContext+'/'+username+'/site/';
		}});
		msg.addButton(button);
		msg.show();
	}
}

N2i.Event.addLoadListener(function() {
	new OO.Community.InvitationPage();
})