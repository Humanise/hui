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
						hui.dom.replaceNode(oldNode,newNode);
						hui.dom.runScripts(newNode);
					} catch (e) {
						hui.log(e);
					}
				};
				if (options.onComplete) {
					options.onComplete();
				}
			},onException : function(a,b) {
				hui.log(a);
				hui.log(b);
			}
		})
	}
}

hui.ui.listen({
	$ready : function() {
		hui.listen(document.body,'mousemove',this._onMove.bind(this));
		this._setTimer();
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
				this._showUserPanel(a)
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
	},
	_buildUserPanel : function() {
		if (!this._userPanel) {
			var p = this._userPanel = hui.ui.BoundPanel.create({width:200,variant:'light',hideOnClick:true});
			var logout = hui.ui.Button.create({text:'Log out'});
			logout.listen({
				$click : function() {
					CoreSecurity.logOut(function() {
						document.location.reload()
					})
				}
			})
			p.add(logout);
		}
		return this._userPanel;
	},

	_showLoginPanel : function(a) {
		var panel = this._buildLoginPanel();
		panel.position(a);
		panel.show();
		this._loginForm.focus();
	},
	_buildLoginPanel : function() {
		if (!this._loginPanel) {
			var p = this._loginPanel = hui.ui.BoundPanel.create({width:200,variant:'light',hideOnClick:true,padding:5});
			
			var form = this._loginForm = hui.ui.Formula.create({name:'topBarLoginForm'});
			form.buildGroup(null,[
				{type:'TextField',label:'Username',options:{key:'username'}},
				{type:'TextField',label:'Password',options:{secret:true,key:'password'}}
			]);
			p.add(form);
			var logout = hui.ui.Button.create({text:'Log in',name:'topBarLoginButton'});
			logout.listen({
				$click : function() {
					
				}.bind(this)
			})
			p.add(logout);
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
		CoreSecurity.changeUser(values.username,values.password,{
			callback:function() {
				document.location.reload()
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to log in',icon:'common/warning',duration:2000});
			}
		})
	}
}



oo.InlineEditor = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this._addBehavior();
}

oo.InlineEditor.prototype = {
	originalValue : null,
	
	_addBehavior : function() {
		hui.listen(this.element,'click',this._edit.bind(this));
	},
	_edit : function() {
		var el = this.element;
		var field = this._getField();
		hui.style.copy(el,field,['font-size','font-family','font-weight'])
		el.style.visibility = 'hidden'
		hui.position.place({source:{element:field},target:{element:el}});
		hui.style.set(field,{display:'block',width:el.clientWidth+'px',height:el.clientHeight+'px'})
		field.value = hui.dom.getText(el);
		field.style.display='block';
		field.focus();
		field.select();
		this.originalValue = field.value;
	},
	_getField : function() {
		if (!this._field) {
			this._field = hui.build('textarea',{style:'border:none; background:none; position:absolute; display:none; padding: 0; margin: 0;',parent:document.body})
			hui.listen(this._field,'blur',this._save.bind(this));
			hui.listen(this._field,'keydown',function(e) {
				e = hui.event(e);
				if (e.returnKey) {
					e.stop();
					this._save()					
				}
			}.bind(this));
		}
		return this._field;
	},
	_save : function() {
		var value = this._field.value;
		hui.dom.setText(this.element,value);
		this._field.style.display='none';
		this.element.style.visibility = '';
		this.element.focus();
		if (this.originalValue!=value) {
			this.fire('valueChanged',value);			
		}
	}
}