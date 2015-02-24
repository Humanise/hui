if (!oo) var oo = {};

oo.community = {
	showImage : function(img) {
		var v = this.getViewer();
		v.clearImages();
		v.addImage(img);
		v.show();
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = hui.ui.ImageViewer.create();
			v.listen(this);
		}
		return this.imageViewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return oo.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	},
	checkBrowser : function() {
		if (!hui.browser.gecko && !hui.browser.webkit && !hui.browser.msie7 && !hui.browser.msie8) {
			hui.ui.alert({
				title:'Den webbrowser du anvender er ikke understøttet.',
				text:''+
				'Du kan anvende enten Internet Explorer 7+, Firefox 2+ eller Safari 3+.',
				emotion:'gasp'
			});
			return false;
		}
		return true;
	}
};

hui.ui.listen({
	$click$barPublic : function() {
		document.location=oo.appContext+'/';
	},
	$click$barWebsite : function() {
		document.location=oo.appContext+'/'+oo.user.userName+'/site/';
	},
	$click$barUser : function() {
		document.location=oo.appContext+'/'+oo.user.userName+'/';
	},
	$click$barTools : function() {
		document.location=oo.appContext+'/'+oo.user.userName+'/private/';
	},
	$click$barLogOut : function() {
		CoreSecurity.logOut(function() {
			hui.ui.showMessage('Du er nu logget ud');
			window.setTimeout(function() {
				document.location.reload();
			},1000);
		});
	} 
})

oo.community.util = {
	expand : function(container,toHide,toShow) {
		var width = container.clientWidth;
		hui.style.set(container,{height:container.clientHeight+'px',overflow:'hidden',position:'relative'});
		hui.style.set(toHide,{width:width+'px',position:'absolute',background:'#fff'});
		hui.style.set(toShow,{width:width+'px',opacity:0,display:'block',position:'absolute',background:'#fff'});
		hui.animate(toHide,'opacity',0,500,{hideOnComplete:true});
		hui.animate(toShow,'opacity',1,500,{delay:300});
		hui.animate(container,'height',toShow.clientHeight+'px',500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			toHide.style.position='static';
			toShow.style.position='static';
			hui.style.set(container,{height:'',overflow:'',position:'static'});
		}});
	}
}

oo.community.Chrome = function() {
	this.addBehavior();
	new oo.community.Chrome.Login();
	new oo.community.Chrome.SignUp();
	new oo.community.Chrome.UserInfo();
	new oo.community.Chrome.Search();
}

oo.community.Chrome.get = function() {
	var c = oo.community.Chrome;
	if (!c.instance) {
		c.instance = new c();
	}
	return c.instance;
}

oo.community.Chrome.prototype = {
	addBehavior : function() {
		var self = this;
		var logout = hui.get('logOut');
		if (logout) {
			logout.onclick = function() {
				self.logOut();
				return false;
			}
		}
		var nav = hui.get.firstByClass(document.body,'navigation');
		var as = nav.getElementsByTagName('a');
		for (var i = as.length - 1; i >= 0; i--){
			hui.listen(as[i],'click',function() {
				self.udpateNavigation(this);
			});
		};
	},
	logOut : function() {
		CoreSecurity.logOut(function() {
			hui.ui.fadeOut(hui.get.firstByClass(document.body,'login_info'),1000);
			hui.ui.showMessage('Du er nu logget ud');
			window.setTimeout(function() {
				hui.ui.hideMessage();
			},2000);
		});
	},
	udpateNavigation : function(element) {
		var nav = hui.get.firstByClass(document.body,'navigation');
		var as = nav.getElementsByTagName('a');
		for (var i = as.length - 1; i >= 0; i--) {
			hui.cls.remove(as[i],'selected');
		}
		hui.cls.add(element,'selected');
	}
}

oo.community.Chrome.buildUserWebsiteURL = function(username) {
	return 'http://'+oo.baseDomainContext+'/'+username+'/site/';
	return oo.domainIsIP
		? 'http://'+oo.baseDomainContext+'/'+username+'/site/'
		: 'http://'+username+'.'+oo.baseDomainContext+'/';
}

oo.community.Chrome.buildUserProfileURL = function(username) {
	return oo.appContext+'/'+username+'/';
}

/////////////////////////////////// Search field /////////////////////////////////

oo.community.Chrome.Search = function() {
	this.field = hui.ui.get('casingSearch');
	this.field.listen(this);
	this.result = hui.get('casing_search_result');
	this.busy = false;
	this.expanded = false;
	if (!this.field.isEmpty()) {
		this.$valueChanged(this.field.getValue());
	}
}

oo.community.Chrome.Search.prototype = {
	$submit$casingSearch : function(obj) {
		document.location=oo.appContext+'/search.html?text='+obj.getValue();
	},
	$valueChanged$casingSearch : function(value) {
		this.dirty = value.length>0;
		var c = hui.get.firstByClass(document.body,'content');
		var r = hui.get.firstByClass(document.body,'content_right');
		var b = hui.get.firstByClass(document.body,'content_right_body');
		if (this.dirty) {
			r.style.height=c.clientHeight+'px';
			this.result.style.height = c.clientHeight+'px';
			this.search(value);
		} else {
			hui.cls.remove(r,'content_right_busy');
			r.style.height='';
			this.result.style.display='none';
			b.style.display='block';
		}
		hui.animate(b,'opacity',this.dirty ? 0 : 1,500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			b.style.display = this.dirty ? 'none' : '';
			this.expanded = this.dirty;
			this.checkWaitingResult();
		}.bind(this)});
	},
	search : function(query) {
		if (!this.dirty) return;
		if (this.busy) {
			this.waitingQuery=query;
			return;
		}
		this.waitingQuery = null;
		this.busy = true;
		var right = hui.get.firstByClass(document.body,'content_right');
		hui.cls.add(right,'content_right_busy');
		AppCommunity.getLatest(query,function(map) {
			this.updateList(map);
			this.busy = false;
			hui.cls.remove(right,'content_right_busy');
			if (this.waitingQuery) {
				this.search(this.waitingQuery);
			}
		}.bind(this));
	},
	updateList : function(result) {
		if (!this.dirty) return;
		if (!this.expanded) {
			this.waitingResult = result;
			return;
		}
		this.result.style.display='block';
		if (result.users.length==0) {
			this.result.innerHTML='<div class="casing_result_empty">Søgning gav intet resultat</div>';
		} else {
			this.result.innerHTML=this.buildUsers(result.users);
		}
		this.waitingResult = null;
	},
	checkWaitingResult : function() {
		if (this.waitingResult) this.updateList(this.waitingResult);
	},
	buildUsers : function(users) {
		var html = '<div class="casing_result_group"><h2>Brugere</h2><ul>';
		hui.each(users,function(entry) {
			html+='<li class="user">'+
			oo.buildThumbnailHtml({width: 40,height:45,variant:'user'})+
			'<p class="name"><a href="'+oo.community.Chrome.buildUserProfileURL(entry.user.username)+'" class="oo_link"><span>'+entry.person.fullName+'</span></a></p>'+
			'<p class="username">'+entry.user.username+'</p>'+
			'<p class="website"><a href="'+oo.community.Chrome.buildUserWebsiteURL(entry.user.username)+'" class="oo_link oo_link_dimmed"><span>Website »</span></a></p>'+
			'</li>';
		});
		html+= '</ul></div>';
		return html;
	}
}


oo.community.Chrome.UserInfo = function() {
	this.base = hui.get('userinfo');
	if (!this.base) return;
	hui.ui.get('casingLogout').listen(this);
}

oo.community.Chrome.UserInfo.prototype = {
	$click$casingLogout : function() {
		CoreSecurity.logOut(function() {
			hui.ui.showMessage('Du er nu logget ud');
			window.setTimeout(function() {
				document.location.reload();
			},1000);
		});
	}
}

/////////////////////////////////// Log in handler /////////////////////////////////

oo.community.Chrome.Login = function() {
	this.form = hui.get('login');
	if (!this.form) return;
	this.username = hui.ui.get('casingUsername');
	this.password = hui.ui.get('casingPassword');
	this.recoverLink = hui.get('casing_recoverpassword');
	hui.ui.get('casingLogin').listen(this);
	this.addBeahvior();
}

oo.community.Chrome.Login.prototype = {
	addBeahvior : function() {		
		this.form.onsubmit = this.logIn.bind(this);
		hui.get.firstByClass(this.form,'submit').tabIndex=-1;
		hui.listen(this.recoverLink,'click',function(e) {hui.stop(e);this.recoverPassword()}.bind(this));
	},
	showError : function(text) {
		var e = hui.get.firstByClass(this.form,'fields');
		hui.ui.showToolTip({text:text,element:e,key:'loginError'});
	},
	hideError : function() {
		hui.ui.hideToolTip({key:'loginError'});
	},
	logIn : function() {
		if (!oo.community.checkBrowser()) {
			return false;
		}
		var valid = false;
		if (this.username.isBlank()) {
			this.showError('Skal udfyldes');
			this.username.focus();
		} else if (this.password.isBlank()) {
			this.showError('Skal udfyldes');
			this.password.focus();
		} else {
			this.hideError();
			valid = true;
		}
		if (!valid) return false;
		var username = this.username.getValue();
		var password = this.password.getValue();
		var self = this;
		var delegate = {
  			callback : function(data) {
				if (data==true) {
					self.userDidLogIn(username);
				} else {
					hui.ui.hideMessage();
					self.showError('Brugernavn og/eller kode er forkert')
				}
			},
  			errorHandler : function(errorString, exception) {
				hui.ui.showMessage({text:'Der skete desværre en fejl',icon:'common/warning'});
			}
		};
		hui.ui.showMessage('Logger ind...');
		CoreSecurity.changeUser(username,password,delegate);
		return false;
	},
	
	$click$casingLogin : function() {
		this.logIn();
	},
	userDidLogIn : function(username) {
		hui.ui.showMessage('Du er nu logget ind!');
		window.setTimeout(function() {
			document.location.reload();
		},500);
	},
	recoverPassword : function() {
		if (!this.recoverBox) {
			var box = this.recoverBox = hui.ui.Box.create({title:'Genfind kodeord',closable:true,absolute:true,width:400,padding: 10,modal:true});
			box.addToDocument();
			var form = this.recoverForm = hui.ui.Formula.create();
			var group = form.buildGroup(null,[
				{type:'TextField',options:{label:'Brugernavn eller e-post-adresse',key:'usernameOrEmail'}}
			]);
			var cancel = hui.ui.Button.create({text:'Annuller'});
			cancel.listen({$click:function() {box.hide()}});
			var create = hui.ui.Button.create({text:'Genfind kodeord',highlighted:true,submit:true});
			group.createButtons().add(cancel).add(create);
			box.add(form);
			form.listen({$submit:function() {
				if (this.sendingEmail) return;
				var values = form.getValues();
				var str = values.usernameOrEmail;
				if (hui.isBlank(str)) {
					hui.ui.showMessage({text:'Feltet skal udfyldes',duration:3000});
					form.focus();
				} else {
					this.sendingEmail = true;
					create.setEnabled(false);
					hui.ui.showMessage({text:'Sender e-post-besked, vent venligst...'});
					CoreSecurity.recoverPassword(str,{
						callback:function(success) {
							if (success) {
								hui.ui.hideMessage();
								hui.ui.alert({title:'Vi har nu sendt dig en vejledning på din e-post-adresse.',text:'Vejledningen beskriver hvordan du ændrer dit kodeord. Hvis du ikke modtager beskeden bedes du kontakte os.',emotion:'smile'});
								//ui.showMessage({text:'E-post-beskeden er afsendt, se i din indbakke :-)',duration:5000});
								box.hide();
							} else {
								hui.ui.hideMessage();
								hui.ui.alert({title:'Brugeren kunne ikke findes',text:'Vi kunne ikke finde en bruger med det angivne brugernavn eller e-post-adresse. Prøv venligst igen.',emotion:'gasp',onOK:function() {
									form.focus();
								}});
							}
							create.setEnabled(true);
							this.sendingEmail = false;
						}.bind(this),
						errorHandler:function() {
							hui.ui.alert({title:'Det lykkedes ikke at sende besked',text:'Dette skyldes en fejl fra vores side, prøv venligst igen senere.',emotion:'gasp',onOK:function() {
								form.focus();
							}});
							hui.ui.hideMessage();
							create.setEnabled(true);
							this.sendingEmail = false;
						}.bind(this)
					});
				}
			}.bind(this)});
		}
		this.recoverForm.reset();
		this.recoverBox.show();
		this.recoverForm.focus();
	},
	submitRecoverPassword : function() {
		
	}
}

///////////////////////////////// Sign up handler ///////////////////////////////

oo.community.Chrome.SignUp = function() {
	this.form = hui.get('signup');
	if (this.form) {
		this.username = hui.ui.get('casingSignupUsername');
		this.password = hui.ui.get('casingSignupPassword');
		this.name = hui.ui.get('casingSignupName');
		this.email = hui.ui.get('casingSignupEmail');
		this.addBehavior();
	}
}

oo.community.Chrome.SignUp.prototype = {
	addBehavior : function() {
		var self = this;
		this.form.onsubmit=function() {
			self.submit();
			return false;
		};
		hui.ui.get('casingSignUp').listen({$click:this.submit.bind(this)});
		hui.get.firstByClass(this.form,'submit').tabIndex=-1;
	},
	submit : function() {
		if (!oo.community.checkBrowser()) {
			return false;
		}
		var username = this.username.getValue();
		var password = this.password.getValue();
		var name = this.name.getValue();
		var email = this.email.getValue();
		var valid = true;
		if (this.username.isBlank()) {
			valid = false;
			this.username.setError('Skal udfyldes');
		} else {
			this.username.setError(false);
		}
		if (this.password.isBlank()) {
			valid = false;
			this.password.setError('Skal udfyldes');
		} else {
			this.password.setError(false);
		}
		if (this.name.isBlank()) {
			valid = false;
			this.name.setError('Skal udfyldes');
		} else {
			this.name.setError(false);
		}
		if (this.email.isBlank()) {
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
		} else {
			hui.ui.showMessage({text:'Der skete en uventet fejl',duration:3000});
		}
	},
	userDidSignUp : function(username) {
		this.username.setValue();
		this.password.setValue();
		this.name.setValue();
		this.email.setValue();
		hui.ui.showMessage('Opretter hjemmeside...');
		window.setTimeout(function() {
			document.location=oo.community.Chrome.buildUserWebsiteURL(username)+'?edit=true#firstRun'
		},2000);
		return;
		hui.ui.alert({
			emotion: 'smile',
			title: 'Du er nu oprettet som bruger...',
			text: '...og der er oprettet et websted til dig',
			button: 'Gå til mit nye websted :-)!'
		},function() {document.location=oo.community.Chrome.buildUserWebsiteURL(username)+'?edit=true&firstRun=true'});
	}
}

//////////////////////////////////// Widgets ///////////////////////////////




hui.ui.onReady(function() {oo.community.Chrome.get()});