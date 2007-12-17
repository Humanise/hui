if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};


OO.Community.Front = function() {
	this.signupForm = $id('signup');
	this.loginForm = $id('login');
	this.poster = $id('poster');
	this.searchInput = $id('search_field');
	this.searchField = null;
	this.setupSearch();
	this.addBehavior();
	this.loadData();
}

OO.Community.Front.prototype.setupSearch = function() {
	var self = this;
	var delegate = {
		placeholder:'Live søgning!',
		valueDidChange: function(field) {
			if (field.getValue().length>2) {
				self.showSearchBox();
			} else {
				self.hideSearchBox();
			}
		}
	};
	this.searchField = new N2i.TextField('search_field',null,delegate);
}

OO.Community.Front.prototype.addBehavior = function() {
	var self = this;
	this.signupForm.onsubmit = function() {
		var username = self.signupForm.username.value;
		var password = self.signupForm.password.value;
		try {
			var delegate = {
	  			callback:function() { self.userDidSignUp(username) },
	  			errorHandler:function(errorString, exception) { N2i.log(exception);self.setSignUpMessage(errorString); }
			};
			CommunityTool.signUp(username,password,delegate);
		} catch (e) {
			self.displayError(e);
		}
		return false;
	}
	this.loginForm.onsubmit = function() {
		var username = self.loginForm.username.value;
		var password = self.loginForm.password.value;
		//try {
			var delegate = {
	  			callback:function(data) {
					if (data==true) {
						self.userDidLogIn(username);
					} else {
						self.setLogInMessage('Kunne ikke logge ind!')
					}
				},
	  			errorHandler:function(errorString, exception) { self.setLogInMessage(errorString); }
			};
			CoreSecurity.changeUser(username,password,delegate);
		//} catch (e) {
		//	self.displayError(e);
		//}
		return false;
	}
}

OO.Community.Front.prototype.userDidSignUp = function(username) {
	if (!this.signedUpMessage) {
		this.signedUpMessage = new OO.Community.Message();
		var body = document.createElement('div');
		body.appendChild(OO.Community.Message.buildHeader('Du er nu oprettet som bruger...'));
		body.appendChild(OO.Community.Message.buildParagraph('Du vil modtage en e-mail hvor du skal bekræfte at du er dig. Indtil dette er gjort kan du frit anvende dit nye websted i op til 7 dage.'));
		this.signedUpButton = OO.Community.Message.buildButton('Gå til mit ny websted :-)');
		body.appendChild(this.signedUpButton);
		this.signedUpMessage.setContents(body);
	}
	this.signedUpButton.href=username+'/';
	this.signedUpMessage.show();
}

OO.Community.Front.prototype.userDidLogIn = function(username) {
	if (!this.logInMessage) {
		this.logInMessage = new OO.Community.Message();
		var body = document.createElement('div');
		body.appendChild(OO.Community.Message.buildHeader('Du er nu logget ind!'));
		body.appendChild(OO.Community.Message.buildParagraph('...og vil blive taget til dit websted om få sekunder.'));
		this.logInMessage.setContents(body);
	}
	this.logInMessage.show();
	window.setTimeout(function() {
		document.location=username+'/';
	},2000);
}

OO.Community.Front.prototype.setSignUpMessage = function(text) {
	var message = $class('response',this.signupForm)[0];
	message.innerHTML=text;
}

OO.Community.Front.prototype.setLogInMessage = function(text) {
	var message = $class('response',this.loginForm)[0];
	message.innerHTML=text;
}

OO.Community.Front.prototype.displayError = function(text) {
	alert(text);
}

OO.Community.Front.prototype.showSearchBox = function(text) {
	$ani('poster','opacity',0,1000);
	$ani('poster','height','0px',1000);
	$ani('search_field','margin-left','0px',1000);
}

OO.Community.Front.prototype.hideSearchBox = function(text) {
	$ani('poster','opacity',1,1000);
	$ani('poster','height','400px',1000);
	$ani('search_field','margin-left','95px',1000);
}

OO.Community.Front.prototype.loadData = function() {
	var self = this;
	CommunityTool.getLatestImages(function(images) {self.buildImages(images)});
}

OO.Community.Front.prototype.buildImages = function(images) {
	var container = $id('images_container');
	var elements = [];
	for (var i=0; i < images.length; i++) {
		var image = images[i];
		var width = Math.round(image.width/image.height*60);
		var height = Math.round(image.height/Math.max(image.width,image.height)*60);
		var thumb = N2i.create(
			'div',
			{'class':'thumbnail'},
			{'width':(width)+'px','marginLeft': '600px','backgroundImage':'url("'+info.baseContext+'/service/image/?id='+image.id+'&thumbnail='+Math.max(width,height)+'")'}
		);
		container.appendChild(thumb);
		$ani(thumb,'margin-left','0px',1000,{ease:N2i.Animation.fastSlow});
	};
}

N2i.Event.addLoadListener(function() {
	new OO.Community.Front();
})