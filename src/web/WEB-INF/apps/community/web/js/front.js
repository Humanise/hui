if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};


OO.Community.Front = function() {
	this.loginForm = $('login');
	this.images = [];
	this.searchField = new In2iGui.TextField('search_field','searchField');
	this.searchField.addDelegate(this);
	this.addBehavior();
	this.search();
	new OO.Community.Front.SignUp();
}

OO.Community.Front.prototype = {
	valueChanged$searchField : function(field) {
		this.search(field.getValue());
	},
	setSearch : function(str) {
		this.searchField.setValue(str);
		this.search(str);
	},
	search : function(query) {
		var self = this;
		AppCommunity.getLatestImages(query,function(images) {self.buildImages(images)});
		AppCommunity.getTagCloud(query,function(tags) {self.buildTags(tags)});
		AppCommunity.searchUsers(query,function(users) {self.buildUsers(users)});
	},
	buildTags : function(tags) {
		var self = this;
		tags = new Hash(tags);
		var cloud = $('tags_container');
		cloud.update();
		tags.each(function(entry) {
			var element = new Element('a').addClassName('tag tag-'+Math.round(5*entry.value));
			element.insert(new Element('span').update(entry.key));
			element.href='#';
			element.observe('click',function() {self.setSearch(entry.key)});
			cloud.insert(element);
			cloud.insert(new Element('span').insert(' '));
		});
	},
	buildImages : function(images) {
		this.dirtyImages = true;
		this.images = images;
		var container = $('images_container');
		container.update();
		var self = this;
		images.each(function(image,index) {
			var width = Math.round(image.width/image.height*60);
			var height = Math.round(image.height/Math.max(image.width,image.height)*60);
			var thumb = new Element('div').addClassName('thumbnail').setStyle({
				width:width+'px',opacity:0,'backgroundImage':'url("'+OnlineObjects.baseContext+'/service/image/?id='+image.id+'&thumbnail='+Math.max(width,height)+'")'
			});
			thumb.observe('click',function() {
				self.imageWasClicked(index);
			});
			$ani(thumb,'opacity',1,1000,{ease:N2i.Animation.slowFast,delay:Math.random()*1000});
			container.insert(thumb);
		});
	},
	buildUsers : function(users) {
		var container = $('users_container');
		container.update();
		users.each(function(user) {
			var element = new Element('div').addClassName('user');
			element.insert(new Element('div').addClassName('thumbnail'));
			var link = new Element('a').addClassName('link');
			link.href=OnlineObjects.appContext+'/'+user.username+'/';
			link.insert(new Element('span').update(user.name));
			element.insert(link);
			container.insert(element);
		});
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.viewer) {
			this.viewer = In2iGui.ImageViewer.create();
			this.viewer.addDelegate(this);
		}
		if (this.dirtyImages) {
			this.viewer.clearImages();
			this.viewer.addImages(this.images);
			this.dirtyImages = false;
		}
		return this.viewer;
	},
	resolveImageUrl : function(image,width,height) {
		return OnlineObjects.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	},
	addBehavior : function() {
		var self = this;
		this.loginForm.onsubmit = function() {
			if (!In2iGui.browser.gecko && !In2iGui.browser.webkit && !In2iGui.browser.msie7) {
				In2iGui.get().alert({
					title:'Den webbrowser De anvender er ikke understøttet.',
					text:''+
					'De kan anvende enten Internet Explorer 7, Firefox 2+ eller Safari 3+.',
					emotion:'gasp'
				});
				return false;
			}
			var username = self.loginForm.username.value;
			var password = self.loginForm.password.value;
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
			return false;
		}
		$('feedbackForm').onsubmit=function() {
			In2iGui.get().alert({
				title:'Din besked er ved at blive sendt',
				text:'Du får en besked om lidt med resultatet...',
				emotion:'smile'
			});
			var form = this;
			var delegate = {
	  			callback:function() {
					In2iGui.get().alert({
						title:'Din besked er afsendt!',
						text:'Vi vil svare hurtigst muligt :-)',
						emotion:'smile'
					});
					form.reset();
				},
	  			errorHandler:function(errorString, exception) {
					In2iGui.get().alert({title:'Beskeden kunne ikke sendes!',text:errorString,emotion:'gasp'});
					N2i.log(exception);
				}
			};
			AppCommunity.sendFeedback(form['email'].value,form['message'].value,delegate);
			return false;
		};
	},
	userDidLogIn : function(username) {
		var msg = In2iGui.Alert.create(null,{
			emotion: 'smile',
			title: 'Du er nu logget ind!',
			text: '...og vil blive taget til dit website med det samme.'
		});
		msg.show();
		window.setTimeout(function() {
			document.location=''+username+'/site/';
		},1000);
	},
	setSignUpMessage : function(text) {
		var message = $class('response',this.signupForm)[0];
		message.innerHTML=text;
	},
	setLogInMessage : function(text) {
		var message = $class('response',this.loginForm)[0];
		message.innerHTML=text;
	},
	displayError : function(text) {
		alert(text);
	}
}

/**************************************** Sign up handler *************************************/

OO.Community.Front.SignUp = function() {
	this.form = $('signup');
	this.username = new In2iGui.TextField(this.form.abc);
	this.password = new In2iGui.TextField(this.form.def);
	this.name = new In2iGui.TextField(this.form.name);
	this.email = new In2iGui.TextField(this.form.email);
	this.addBehavior();
}

OO.Community.Front.SignUp.prototype = {
	addBehavior : function() {
		var self = this;
		this.form.onsubmit=function() {
			self.submit();
			return false;
		};
	},
	submit : function() {
		if (!In2iGui.browser.gecko && !In2iGui.browser.webkit && !In2iGui.browser.msie7) {
			In2iGui.get().alert({
				title:'Den webbrowser De anvender er ikke understøttet.',
				text:''+
				'De kan anvende enten Internet Explorer 7, Firefox 2+ eller Safari 3+.',
				emotion:'gasp'
			});
			return false;
		}
		var username = this.username.getValue();
		var password = this.password.getValue();
		var name = this.name.getValue();
		var email = this.email.getValue();
		var valid = true;
		if (this.username.isEmpty()) {
			valid = false;
			this.username.element.addClassName('error');
			$id('username_error').update('Skal udfyldes');
		} else {
			this.username.element.removeClassName('error');
			$id('username_error').update('');
		}
		if (this.password.isEmpty()) {
			valid = false;
			this.password.element.addClassName('error');
			$id('password_error').update('Skal udfyldes');
		} else {
			this.password.element.removeClassName('error');
			$id('password_error').update('');
		}
		if (this.name.isEmpty()) {
			valid = false;
			this.name.element.addClassName('error');
			$id('name_error').update('Skal udfyldes');
		} else {
			this.name.element.removeClassName('error');
			$id('name_error').update('');
		}
		if (this.email.isEmpty()) {
			valid = false;
			this.email.element.addClassName('error');
			$id('email_error').update('Skal udfyldes');
		} else {
			this.email.element.removeClassName('error');
			$id('email_error').update('');
		}
		if (!valid) {
			return false;
		}
		var self = this;
		AppCommunity.signUp(username,password,name,email,{
			callback :function() { self.userDidSignUp(username) },
			errorHandler :function(msg,e) { self.handleFailure(e) }
		});
		return false;
	},
	handleFailure : function(e) {
		if (e.code=='userExists') {
			this.username.element.addClassName('error');
			$id('username_error').update('Navnet er optaget');
		} else if (e.code=='invalidUsername') {
			this.username.element.addClassName('error');
			$id('username_error').update('Navnet er ikke validt');
		} else if (e.code=='invalidEmail') {
			this.email.element.addClassName('error');
			$id('email_error').update('Adressen er ikke valid');
		}
	},
	userDidSignUp : function(username) {
		this.username.setValue();
		this.password.setValue();
		this.name.setValue();
		this.email.setValue();
		In2iGui.get().alert({
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: '...og der er oprettet et websted til dig',
			button: 'Gå til mit nye websted :-)!'
		},function() {document.location=username+'/site/?edit=true'});
	}
}

document.observe('dom:loaded', function() {new OO.Community.Front();});