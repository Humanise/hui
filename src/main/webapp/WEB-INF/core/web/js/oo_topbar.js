oo.TopBar = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	this._addBehavior();
	hui.ui.listen(this);
};

oo.TopBar.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
	},
	_onClick : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			var data = a.getAttribute('data');
			if (data=='user') {
				e.stop();
				if (this._userPanel && this._userPanel.isVisible()) {
					this._userPanel.hide();
				} else {
					this._showUserPanel(a)
				}
			}
			else if (data=='login') {
				e.stop();
				this._showLoginPanel(a)
			}
			else if (data=='inbox') {
				e.stop();
				this._showInbox(a)
			}
		}
	},
	
	_showUserPanel : function(a) {
		var panel = this._buildUserPanel();
		panel.position(a);
		panel.show();
		this._updatePanel();
	},
	_buildUserPanel : function() {
		if (!this._userPanel) {
			var p = this._userPanel = hui.ui.BoundPanel.create({width:250,variant:'light',padding:10,hideOnClick:true});
			this._userInfoBlock = hui.build('div',{'class':'oo_topbar_info oo_topbar_info_busy'});
			p.add(this._userInfoBlock);
			var buttons = hui.build('div',{'class':'oo_topbar_info_buttons'});
			p.add(buttons);
			var logout = hui.ui.Button.create({text:'Log out',variant:'paper',small:true, listener: {
				$click : this._doLogout.bind(this)
			}});
			buttons.appendChild(logout.element);
			var changeUser = hui.ui.Button.create({text:'Change user',variant:'paper',small:true, listener: {
				$click : this._showLoginPanel.bind(this)
			}});
			buttons.appendChild(changeUser.element);
		}
		return this._userPanel;
	},
	_updatePanel : function() {
		var node = this._userInfoBlock;
		hui.ui.request({
			url : oo.baseContext+'/service/authentication/getUserInfo',
      parameters : {language : oo.language},
			$object : function(info) {
				hui.cls.remove(node,'oo_topbar_info_busy')
				var html = '<div class="oo_topbar_info_photo">';
				if (info.photoId) {
					html+='<div class="oo_topbar_info_photo_img" style="background-image: url('+oo.baseContext+'/service/image/id'+info.photoId+'width60height60sharpen0.7cropped.jpg)"></div>';
				}
				html+='</div><div class="oo_topbar_info_content">'+
					'<p class="oo_topbar_info_name">'+hui.string.escape(info.fullName)+'</p>'+
        '<p class="oo_topbar_info_username">'+hui.string.escape(info.username)+'</p>';
        for (var i = 0; i < info.links.length; i++) {
          var link = info.links[i];
					html += '<p class="oo_topbar_info_account"><a class="oo_link" href="' + link.value + '"><span class="oo_link_text">' + hui.string.escape(link.label) + '</span></a></p>';
        }
				html += '</div>';
				node.innerHTML = html;
				
			}.bind(this),
			$failure : function() {
				hui.cls.remove(node,'oo_topbar_info_busy');
				node.innerHTML = '<p>Error</p>';
			}
		});
		
		window.setTimeout(function() {
			
		}.bind(this),2000)
	},

	_showLoginPanel : function(a) {
		var panel = this._buildLoginPanel();
		panel.position(a);
		panel.show();
		this._loginForm.focus();
	},
	_buildLoginPanel : function() {
		if (!this._loginPanel) {
			var p = this._loginPanel = hui.ui.BoundPanel.create({width:200,variant:'light',hideOnClick:true,padding:10});
			
			var form = this._loginForm = hui.ui.Formula.create({name:'topBarLoginForm'});
			form.buildGroup(null,[
				{type:'TextField',label:'Username',options:{key:'username'}},
				{type:'TextField',label:'Password',options:{secret:true,key:'password'}}
			]);
			p.add(form);
			var login = hui.ui.Button.create({text:'Log in',variant:'paper',name:'topBarLoginButton'});
			p.add(login);
			var forgot = hui.build('div',{className:'oo_topbar_forgot',html:'<a class="oo_link" href="javascript://"><span>Forgot password?</span></a>'});
			p.add(forgot);
			hui.listen(forgot,'click',this._showPasswordRecovery.bind(this));
		}
		return this._loginPanel;
	},
	$submit$topBarLoginForm : function() {
		this._doLogin();
	},
	$click$topBarLoginButton : function() {
		this._doLogin();
	},
	_doLogin : function() {
		var values = this._loginForm.getValues();
		if (hui.isBlank(values.username) || hui.isBlank(values.password)) {
			this._loginForm.focus();
			return;
		}
		hui.ui.request({
			url : oo.baseContext+'/service/authentication/changeUser',
			parameters : {username:values.username,password:values.password},
			$object : function(response) {
				if (response.success===true) {
					this._loginPanel.clear();
					this._loginPanel.add(hui.build('div',{'class':'oo_topbar_login_success',text:'You are logged in'}))
					document.location.reload();
				} else {
					hui.ui.showMessage({text:'Unable to log in',icon:'common/warning',duration:2000});
				}
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Unable to log in',icon:'common/warning',duration:2000});
			},
			$exception : function(e) {
				throw e;
			}
		})
	},
	_doLogout : function() {
		hui.ui.request({
			url : oo.baseContext+'/service/authentication/logout',
			$success : function() {
				document.location.reload();
			}
		})
	},
	_showPasswordRecovery : function() {
		if (!this._passwordRecoveryBox) {
			var box = this._passwordRecoveryBox = hui.ui.Box.create({modal:true,title:'I forgot my password',closable:true,absolute:true,width:400,padding:10});
			box.add(hui.build('div',{'class':'op_topbar_forgot_intro',text:'Please provide either your username or your e-mail. We will then mail you instructions on how to change your password.'}))
			var form = this._passwordRecoveryForm = hui.ui.Formula.create();
			var group = form.buildGroup(null,[
				{type:'TextField',label:'Username or e-mail:',options:{key:'usernameOrMail',name:'ooTopBarUsernameOrMail'}}
			]);
			var buttons = group.createButtons();
			var cancel = hui.ui.Button.create({text:'Cancel'});
			buttons.add(cancel);
			buttons.add(hui.ui.Button.create({text:'Go',highlighted:true,submit:true}));
			box.add(form);
			box.addToDocument();
			form.listen({
				$submit : function(vars) {
					var values = form.getValues();
					if (hui.isBlank(values.usernameOrMail)) {
						form.focus();
						hui.ui.stress(hui.ui.get('ooTopBarUsernameOrMail'));
						return;
					}

					hui.ui.msg({text:'Let\'s see if we can find you...',busy:true});
					hui.ui.request({
						url : oo.baseContext+'/service/authentication/recoverPassword',
						parameters : {usernameOrMail:values.usernameOrMail},
						$success : function() {
							hui.ui.msg.success({text:'Look in your inbox :-)'});
							form.reset();
							box.hide();
						},
						$failure : function() {
							hui.ui.msg.fail({text:'We could not find you, please try something else'});
							form.focus();
						}
					})
				}
			});
			cancel.listen({
				$click : function() {
					form.reset();
					box.hide();
				}
			})
		}
		this._passwordRecoveryBox.show();
		this._passwordRecoveryForm.focus();
	},
	
	_showInbox : function(a) {
		if (!this._inboxPanel) {
			var p = this._inboxPanel = hui.ui.BoundPanel.create({width:200,variant:'light',hideOnClick:true,padding:5});
			//p.add(hui.build('div',{style:'height: 300px'}));
			var list = hui.ui.List.create({
				variant : 'light',
				source : new hui.ui.Source({url:oo.baseContext+'/service/model/listInbox'})
			});
			list.listen({
				$select : function(info) {
					document.location = info.data.url;
				},
				$clickIcon : function(info) {
					hui.ui.request({
						url : oo.baseContext+'/service/model/removeFromInbox',
						parameters : {id:info.row.id},
						$success : function() {
							list.refresh();
						}
					})
				}
			})
			p.add(list);
			
		}
		this._inboxPanel.show({target:a});
	}
};