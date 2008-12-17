oo.community.Front = function() {
	this.images = [];
	this.searchField = new In2iGui.TextField('search_field','searchField');
	this.searchField.addDelegate(this);
	this.addBehavior();
	this.search();
	new oo.community.Front.SignUp();
	new oo.community.Front.Login();
}

oo.community.Front.prototype = {
	valueChanged$searchField : function(field) {
		this.search(field.getValue());
	},
	setSearch : function(str) {
		this.searchField.setValue(str);
		this.search(str);
	},
	search : function(query) {
		if (this.busySearch) {
			this.waitingQuery=query;
			return;
		}
		this.waitingQuery = null;
		this.busySearch = true;
		var self = this;
		AppCommunity.getLatest(query,function(map) {
			self.buildImages(map.images);
			self.buildUsers(map.users);
			self.buildTags(map.tags);
			self.busySearch = false;
			if (self.waitingQuery) {
				self.search(self.waitingQuery);
			}
		});
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
			element.observe('click',function(e) {self.setSearch(entry.key);e.stop()});
			cloud.insert(element);
			cloud.appendChild(document.createTextNode(' '));
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
			thumb.observe('click',function(e) {
				self.imageWasClicked(index);
				e.stop();
			});
			thumb.observe('mouseover',function() {
				in2igui.showToolTip({text:image.name,element:thumb});
			})
			thumb.observe('mouseout',function() {
				in2igui.hideToolTip();
			})
			n2i.ani(thumb,'opacity',1,1000,{ease:n2i.ease.slowFast,delay:Math.random()*1000});
			container.insert(thumb);
		});
	},
	buildUsers : function(users) {
		var container = $('users_container');
		container.update();
		users.each(function(pair) {
			var element = new Element('div').addClassName('user');
			element.insert(new Element('div').addClassName('thumbnail'));
			var html = '<p class="name">'+
				'<a class="link" href="'+OnlineObjects.appContext+'/'+pair.user.username+'/">'+
				'<span>'+pair.person.name+'</span></a>'+
				'</p>'+
				'<p class="username">'+pair.user.username+'</p>'+
				'<p class="website"><a class="link" href="'+oo.community.Front.buildUserURL(pair.user.username)+'"><span>Website »</span></a></p>';
			element.insert(html);
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
	}
}

oo.community.Front.buildUserURL = function(username) {
	return OnlineObjects.domainIsIP
		? 'http://'+OnlineObjects.baseDomainContext+'/'+username+'/site/'
		: 'http://'+username+'.'+OnlineObjects.baseDomainContext+'/';
}

/**************************************** Log in handler *************************************/

oo.community.Front.Login = function() {
	this.form = $('login');
	this.username = new In2iGui.TextField(this.form.username,null,{placeholderElement:this.form.select('label')[0]});
	this.password = new In2iGui.TextField(this.form.password,null,{placeholderElement:this.form.select('label')[1]});
	this.addBeahvior();
}

oo.community.Front.Login.prototype = {
	addBeahvior : function() {
		var self = this;		
		this.form.onsubmit = function() {
			if (!In2iGui.browser.gecko && !In2iGui.browser.webkit && !In2iGui.browser.msie7) {
				In2iGui.get().alert({
					title:'Den webbrowser De anvender er ikke understøttet.',
					text:''+
					'De kan anvende enten Internet Explorer 7, Firefox 2+ eller Safari 3+.',
					emotion:'gasp'
				});
				return false;
			}
			var valid = true;
			if (self.username.isBlank()) {
				self.username.setError('Skal udfyldes');
				self.username.focus();
				valid = false;
			} else {
				self.username.setError(false);
			}
			if (self.password.isBlank()) {
				self.password.setError('Skal udfyldes');
				valid = false;
			} else {
				self.password.setError(false);
			}
			if (!valid) return false;
			var username = self.username.getValue();
			var password = self.password.getValue();
			var delegate = {
	  			callback:function(data) {
					if (data==true) {
						self.userDidLogIn(username);
					} else {
						self.username.setError('Kunne ikke logge ind!')
					}
				},
	  			errorHandler:function(errorString, exception) {  }
			};
			CoreSecurity.changeUser(username,password,delegate);
			return false;
		}
		this.form.select('.sidebar_button')[0].onclick = function() {self.form.onsubmit();return false;};
		this.form.select('.submit')[0].tabIndex=-1;
	},
	userDidLogIn : function(username) {
		In2iGui.get().alert({
			emotion: 'smile',
			title: 'Du er nu logget ind!',
			text: '...og vil blive taget til dit website med det samme.'
		});
		window.setTimeout(function() {
			document.location=oo.community.Front.buildUserURL(username);
		},1000);
	}
}

/**************************************** Sign up handler *************************************/

oo.community.Front.SignUp = function() {
	this.form = $('signup');
	var labels = this.form.select('label');
	this.username = new In2iGui.TextField(this.form.abc,null,{placeholderElement:labels[0]});
	this.password = new In2iGui.TextField(this.form.def,null,{placeholderElement:labels[1]});
	this.name = new In2iGui.TextField(this.form.name,null,{placeholderElement:labels[2]});
	this.email = new In2iGui.TextField(this.form.email,null,{placeholderElement:labels[3]});
	this.addBehavior();
}

oo.community.Front.SignUp.prototype = {
	addBehavior : function() {
		var self = this;
		this.form.onsubmit=function() {
			self.submit();
			return false;
		};
		this.form.select('.sidebar_button')[0].onclick = function() {self.form.onsubmit();return false;};
		this.form.select('.submit')[0].tabIndex=-1;
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
			this.username.setError('Skal udfyldes');
		} else {
			this.username.setError(false);
		}
		if (this.password.isEmpty()) {
			valid = false;
			this.password.setError('Skal udfyldes');
		} else {
			this.password.setError(false);
		}
		if (this.name.isEmpty()) {
			valid = false;
			this.name.setError('Skal udfyldes');
		} else {
			this.name.setError(false);
		}
		if (this.email.isEmpty()) {
			valid = false;
			this.email.setError('Skal udfyldes');
		} else {
			this.email.setError(false);
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
			this.username.setError('Navnet er optaget');
		} else if (e.code=='invalidUsername' || e.code=='noUsername') {
			this.username.setError('Navnet er ikke validt');
		} else if (e.code=='noName') {
			this.name.setError('Navnet er ikke validt');
		} else if (e.code=='invalidEmail' || e.code=='noEmail') {
			this.email.setError('Adressen er ikke valid');
		} else if (e.code=='noPassword') {
			this.password.setError('Kodeordet er ikke validt');
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
		},function() {document.location=oo.community.Front.buildUserURL(username)+'?edit=true&firstRun=true'});
	}
}

In2iGui.onDomReady(function() {new oo.community.Front();});