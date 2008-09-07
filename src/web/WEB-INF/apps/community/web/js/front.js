if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};


OO.Community.Front = function() {
	this.signupForm = $id('signup');
	this.loginForm = $id('login');
	this.images = [];
	this.searchField = new In2iGui.TextField('search_field','searchField');
	this.searchField.addDelegate(this);
	this.addBehavior();
	this.search();
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
		if (this.signupForm) {
			this.signupForm.onsubmit = function() {
				var username = this.username.value;
				var password = this.password.value;
				try {
					var delegate = {
			  			callback:function() { self.userDidSignUp(username) },
			  			errorHandler:function(errorString, exception) { N2i.log(exception);self.setSignUpMessage(errorString); }
					};
					AppCommunity.signUp(username,password,delegate);
				} catch (e) {
					self.displayError(e);
				}
				return false;
			}
		}
		this.loginForm.onsubmit = function() {
			if (!In2iGui.browser.gecko && !In2iGui.browser.webkit && !In2iGui.browser.msie7) {
				In2iGui.get().alert({
					title:'Den webbrowser De anvender er ikke understøttet.',
					text:''+
					'De kan anvende enten Internet Explorer 7, Firefox 2+ eller Safari 3+. Vi vil iøvrigt anbefale at '+
					'anvende enten FireFox eller Safari da disse er hurtigere og mere stabile end InternetExplorer.',
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
	userDidSignUp : function(username) {
		var msg = In2iGui.Alert.create(null,{
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: 'Du vil modtage en e-mail hvor du skal bekræfte at du er dig. Indtil dette er gjort kan du frit anvende dit nye websted i op til 7 dage.'
		});
		var button = In2iGui.Button.create(null,{text : 'Gå til mit ny websted :-)!'});
		button.addDelegate({buttonWasClicked:function(){
			document.location=username+'/site/';
		}});
		msg.addButton(button);
		msg.show();
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

document.observe('dom:loaded', function() {new OO.Community.Front();});