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
		var fades = [];
		if (options.fade) {
			for (var i=0; i < nodes.length; i++) {
				var node = nodes[i];
				var pos = hui.position.get(node);
				var hider = hui.build('div',{parent:document.body,style:{
					position : 'absolute',
					left : pos.left+'px',
					top : pos.top+'px',
					width : node.offsetWidth+'px',
					height : node.offsetHeight+'px',
					background : '#fff',
					opacity : 0,
					webkitUserSelect : 'none',
					cursor : 'wait'
				}})
				hui.animate({node:hider,css:{opacity:0.2},delay:200,ease:hui.ease.slowFastSlow,duration:300});
				fades.push(hider);
			};
		}
		hui.ui.request({
			url : document.location+'',
			$success : function(t) {
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
			},$exception : function(a,b) {
				hui.log(a);
				hui.log(b);
			},
			$finally : function() {
				hui.each(fades,function(fade) {
					hui.log(fade)
					hui.animate({node:fade,css:{opacity:'0'},duration:100,ease:hui.ease.slowFastSlow,$complete : function() {
						hui.dom.remove(fade);
					}});
				});
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
	presentImage : function(img) {
		if (!this.imagePresenter) {
			this.imagePresenter = oo.PhotoViewer.create();
		}
		this.imagePresenter.setImages([img]);
		this.imagePresenter.show();
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
		this._addWord();
	},
	$click$wordFinderEmpty : function() {
		this._addWord();
	},
	_addWord : function() {
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
			e.stop();
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