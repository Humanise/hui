var oo = {
	buildThumbnail : function(options) {
		var t = hui.build('span',{'class':'oo_thumbnail oo_thumbnail_frame'});
		var height = options.height;
		var width = options.width;
		if (!width && options.image) {
			width = Math.round(options.image.width/options.image.height*height);
		}
		t.style.width=width+'px';
		t.style.height=height+'px';
		if (options.variant) {
			hui.cls.add(t,'oo_thumbnail_'+options.variant);
		}
		if (options.image) {
			var img = hui.build('img',{'src':oo.baseContext+'/service/image/id'+options.image.id+'width'+width+'height'+height+'.jpg'});
			t.appendChild(img);
			if (options.zoom) {
				hui.cls.add(t,'oo_thumbnail_zoom');
				img.onclick = function() {oo.community.showImage(options.image)};
			}
		}
		return t;
	},
	buildThumbnailHtml : function(options) {
		var cls = options.variant ? 'oo_thumbnail oo_thumbnail_frame oo_thumbnail_'+options.variant : 'oo_thumbnail';
		var html = '<span class="'+cls+'" style="width: '+options.width+'px; height: '+options.height+'px;"></span>';
		return html;
	},
	update : function(options) {
		var id = options.id;
		var nodes = [];
		if (hui.isArray(id)) {
			for (var i=0; i < id.length; i++) {
				var nd = hui.get(id[i]);
				if (nd) {
					nodes.push(nd);
				} else {
					hui.log('Node not found : '+id[i]);
				}
			};
		} else {
			var node = hui.get(id);
			if (!node) {
				hui.log('Node not found: '+id);
			} else {
				nodes.push(node);
			}
		}
		hui.request({
			url : document.location+'',
			onSuccess : function(t) {
				var e = hui.build('div',{html:t.responseText});
				for (var i=0; i < nodes.length; i++) {
					var oldNode = nodes[i];
					hui.ui.destroyDescendants(oldNode);
					try {
						var newNode = hui.get.byId(e,oldNode.id);
						var next = hui.get.next(newNode);
						hui.dom.replaceNode(oldNode,newNode);
						hui.dom.runScripts(newNode);
						hui.log('Next node:',next);
						if (hui.dom.isElement(next,'script')) {
							hui.log('Running script next to element');
							hui.dom.runScripts(next);
						} else {
							hui.log('No associated script found');
						}
					} catch (e) {
						hui.log(e);
					}
				};
				if (options.onComplete) {
					options.onComplete();
				}
				if (options.$success) {
					options.$success();
				}
			},onException : function(a,b) {
				hui.log(a);
				hui.log(b);
			}
		})
	},
	render : function(options) {
		jsf.ajax.request(document.createElement('form'),null,{render:options.id,onSuccess:function() {
			if (options.$success) {
				options.$success();
			}
		}})
	},
	showImage : function(img) {
		var v = this.getViewer();
		v.clearImages();
		v.addImage(img);
		v.show();
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = hui.ui.ImageViewer.create();
			v.listen({
				$resolveImageUrl : function(image,width,height) {
					return oo.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
				}
			});
		}
		return this.imageViewer;
	}
	
}

if (false) {	
	hui.ui.listen({
		$ready : function() {
			hui.listen(document.body,'mousemove',this._onMove.bind(this));
			this._setTimer();
			/*
			if (hui.browser.msie) {
				hui.cls.add(document.body,'oo_msie');
			}
			if (hui.browser.msie6) {
				hui.cls.add(document.body,'oo_msie6');
			}
			if (hui.browser.msie7) {
				hui.cls.add(document.body,'oo_msie7');
			}
			if (hui.browser.msie8) {
				hui.cls.add(document.body,'oo_msie8');
			}*/
		},
		_onMove : function() {
			hui.cls.remove(document.body,'oo_fade');
			this._setTimer();
		},
		_fade : function() {
			hui.cls.add(document.body,'oo_fade');
		},
		_setTimer : function() {
			window.clearTimeout(this._timer);
			this._timer = window.setTimeout(this._fade.bind(this),3000);
		}
	})
}

oo.Gallery = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.images = options.images;
	hui.ui.extend(this);
	this._addBehavior();
}

oo.Gallery.prototype = {
	_addBehavior : function() {
		var self = this;
		var slideShow = hui.get.firstByClass(this.element,'oo_gallery_slideshow');
		if (slideShow) {
			hui.listen(slideShow,'click',function(e) {
				self.imageWasClicked(0);
				hui.stop(e);
			});
		}
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = hui.ui.ImageViewer.create();
			v.listen(this);
			v.addImages(this.images);
		}
		return this.imageViewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
	}
}








oo.TopBar = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	this._addBehavior();
	hui.ui.listen(this);
}

oo.TopBar.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
	},
	_onClick : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			if (a.getAttribute('data')=='user') {
				e.stop();
				if (this._userPanel && this._userPanel.isVisible()) {
					this._userPanel.hide();
				} else {
					this._showUserPanel(a)
				}
			}
			else if (a.getAttribute('data')=='login') {
				e.stop();
				this._showLoginPanel(a)
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
			$object : function(info) {
				hui.cls.remove(node,'oo_topbar_info_busy')
				var html = '<div class="oo_topbar_info_photo">';
				if (info.photoId) {
					html+='<div style="background: url('+oo.baseContext+'/service/image/id'+info.photoId+'width50height60sharpen0.7cropped.jpg)"></div>';
				}
				html+='</div><div class="oo_topbar_info_content">'+
					'<p class="oo_topbar_info_name">'+hui.string.escape(info.fullName)+'</p>'+
					'<p class="oo_topbar_info_username">'+hui.string.escape(info.username)+'</p>'+
					'<p class="oo_topbar_info_account"><strong>&rsaquo;</strong> <a href="http://account.'+oo.baseDomainContext+'/"><span>Account</span></a></p>'+
					'</div>';
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
		
	}
}






oo.Link = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this._addBehavior();
}

oo.Link.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
	},
	_onClick : function(e) {
		hui.stop(e)
		this.fire('click');
	}
}


oo.WordFinder = function() {
	this.name = 'oo_wordfinder';
	hui.ui.extend(this);
	var win = this._finder = hui.ui.Window.create({title:{en:'Add word',da:'Tilføj ord'},width:300});
	
	
	var bar = hui.ui.Bar.create({variant:'window'});
	
	var pages = hui.ui.Pages.create();

	var add = hui.ui.Button.create({text:'New word',small:true,listener:{$click:function() {
		pages.next();
	}}});
	bar.add(add);
	win.add(bar);
	
	var search = hui.ui.SearchField.create();
	bar.addToRight(search);
	
	win.add(pages);
	
	var src = new hui.ui.Source({url:oo.baseContext+'/service/model/listWords'});
	var list = hui.ui.List.create({source:src});
	var overflow = hui.ui.Overflow.create({height:300});
	overflow.add(list)
	pages.add(overflow);
	
	
	var form = hui.ui.Formula.create({padding:10});
	form.buildGroup({},[
		{type:'TextField',label:'Text',options:{}},
		{type:'DropDown',label:'Sprog',options:{
			items:[{text:'English',value:'en'},{text:'Danish',value:'da'}]
		}}
	])
	pages.add(form);
	
	return;
	this._finder = hui.ui.Finder.create({
		title : {en:'Add word',da:'Tilføj ord'},
		list : {url : oo.baseContext+'/service/model/listWords',pageParameter:'page'},
		search : {parameter:'text'}
	});
	this._finder.listen({
		$select : function(value) {
			this._finder.clear();
			this._finder.hide();
			this.fire('select',{id:value.id});
		}.bind(this)
	})
}

oo.WordFinder.show = function() {
	if (!this._instance) {
		this._instance = new oo.WordFinder();
	}
	this._instance.show();
}

oo.WordFinder.prototype = {
	show : function() {
		this._finder.show();
	}
}



oo.WordGetter = function() {
	this.name = 'wordFinder';
	hui.ui.extend(this);
	hui.ui.listen(this);
	this.pages = hui.ui.get('wordFinderPages');
	this.form = hui.ui.get('wordFinderForm');
	this.list = hui.ui.get('wordFinderList');
}

oo.WordGetter.prototype = {
	show : function(callback) {
		hui.ui.get('wordFinderListSource').setParameter('language',oo.language);
		hui.log(hui.ui.get('wordFinderListSource').parameters)
		hui.ui.get('wordFinderWindow').show();
		hui.ui.get('wordFinderSearch').focus();
		this.callback = callback;
	},
	_found : function(obj) {
		if (this.callback) {
			this.callback(obj);
		} else {
			this.fire('found',obj);
		}
		hui.ui.get('wordFinderWindow').hide();
	},
	$click$wordFinderCancel : function() {
		this.pages.next();
	},
	$click$wordFinderAdd : function() {
		this.pages.goTo('new');
		this.form.focus();
	},
	$click$wordFinderEmpty : function() {
		this.pages.goTo('new');
		var text = hui.ui.get('wordFinderSearch').getValue();
		this.form.setValues({
			text : text
		})
		this.form.focus();
	},
	$valueChanged$wordFinderSearch : function() {
		hui.ui.get('wordFinderList').resetState();
		this.pages.goTo('list');
	},
	$select$wordFinderList : function() {
		var row = this.list.getFirstSelection();
		if (row) {
			this._found(row);
		}
	},
	$submit$wordFinderForm : function(form) {
		var values = form.getValues();
		if (hui.isBlank(values.text) || hui.isBlank(values.language)) {
			hui.ui.showMessage({text:'Please provide the text and language',duration:2000,icon:'common/warning'});
			form.focus();
			return;
		}
		hui.ui.request({
			url : oo.baseContext+'/service/model/addWord',
			parameters : values,
			$object : this._found.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Unable to add word',duration:2000,icon:'common/warning'});
			}
		})
	}
}







oo.Words = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this._addBehavior();
}

oo.Words.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
	},
	_onClick : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			if (hui.cls.has(a,'oo_words_add')) {
				this._showFinder();
			} else {
				hui.ui.confirmOverlay({element:a,text:'Delete word?',$ok : function() {
					this.fire('delete',{id:parseInt(a.getAttribute('data')),callback:this._reload.bind(this)});
				}.bind(this)})
			}
		}
	},
	_showFinder : function() {
		hui.ui.get('wordFinder').show(function(value) {
			this.fire('add',{id:value.id,callback:this._reload.bind(this)});
		}.bind(this))
	},
	_reload : function() {
		oo.update({id:this.element.id,$success : this._addBehavior.bind(this)});
	}
}