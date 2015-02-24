if (!OO) var OO={};

OO.Editor = function(delegate) {
	this.delegate = delegate;
	this.delegate.setEditor(this);
	this.textEditors = [];
	this.active = false;
	this.buildActivator();
	this.toolbarPadder = hui.get.firstByClass(document.body,'toolbar_padder');
	this.toolbar = null;
	this.templates = {
		all : [
			{value:'blog',title:'Blog',image:OnlineObjects.appContext+'/designs/blog/info/thumbnail.png'},
			{value:'basic',title:'Basal',image:OnlineObjects.appContext+'/designs/basic/info/thumbnail.png'},
			{value:'modern',title:'Moderne',image:OnlineObjects.appContext+'/designs/modern/info/thumbnail.png'},
			{value:'cartoon',title:'Tegneserie',image:OnlineObjects.appContext+'/designs/cartoon/info/thumbnail.png'},
			{value:'ocean',title:'Dykker',image:OnlineObjects.appContext+'/designs/ocean/info/thumbnail.png'},
			{value:'beach',title:'Strand',image:OnlineObjects.appContext+'/designs/beach/info/thumbnail.jpg'},
			{value:'snow',title:'Snow',image:OnlineObjects.appContext+'/designs/snow/info/thumbnail.png'},
			{value:'babygirl',title:'Baby (pige)',image:OnlineObjects.appContext+'/designs/babygirl/info/thumbnail.png'},
			{value:'babyboy',title:'Baby (dreng)',image:OnlineObjects.appContext+'/designs/babyboy/info/thumbnail.png'}
		],
		simple : [
			{value:'basic',title:'Basal',image:OnlineObjects.appContext+'/designs/basic/info/thumbnail.png'},
			{value:'modern',title:'Moderne',image:OnlineObjects.appContext+'/designs/modern/info/thumbnail.png'}
		],
		holliday : [
			{value:'cartoon',title:'Tegneserie',image:OnlineObjects.appContext+'/designs/cartoon/info/thumbnail.png'},
			{value:'ocean',title:'Dykker',image:OnlineObjects.appContext+'/designs/ocean/info/thumbnail.png'},
			{value:'beach',title:'Strand',image:OnlineObjects.appContext+'/designs/beach/info/thumbnail.jpg'},
			{value:'snow',title:'Snow',image:OnlineObjects.appContext+'/designs/snow/info/thumbnail.png'}
		],
		'event' : [
			{value:'babygirl',title:'Baby (pige)',image:OnlineObjects.appContext+'/designs/babygirl/info/thumbnail.png'},
			{value:'babyboy',title:'Baby (dreng)',image:OnlineObjects.appContext+'/designs/babyboy/info/thumbnail.png'}
		]
	};
	this.templateCategories = [
		{title:'Alle',icon:'common/color',value:'all'},
		{title:'Simple',icon:'common/color',value:'simple'},
		{title:'Ferie',icon:'common/color',value:'holliday'},
		{title:'Begivenhed',icon:'common/color',value:'event'}
	];
	var self = this;
	var editmode = hui.location.getBoolean('edit');
	if (editmode) {
		this.activate(true);
	}
	hui.ui.listen(this);
	hui.ui.Editor.get().ignite();
}

OO.Editor.prototype = {
	activate : function(instantly) {
		this.active=true;
		this.activator.className='deactivate';
		hui.cls.add(document.body,'editor_mode');
		this.buildToolBar();
		hui.animate(this.toolbarPadder,'padding-top','58px',instantly ? 0 : 600,{ease:hui.ease.slowFastSlow});
		this.toolbarRevealer.show(instantly);
		this.enableWebNodeEditing();
		var self = this;
		window.setTimeout(function() {
			self.delegate.activate();
			hui.ui.Editor.get().activate();
		},700);
	},
	deactivate : function() {
		if (!this.active) return;
		this.active=false;
		this.activator.className='activate';
		if (this.templatePanel) {
			this.templatePanel.hide();
		}
		if (this.newPagePanel) {
			this.newPagePanel.hide();
		}
		if (this.infoWindow) {
			this.infoWindow.hide();
		}
		hui.cls.remove(document.body,'editor_mode');
		hui.animate(this.toolbarPadder,'padding-top','0px',500,{ease:hui.ease.slowFastSlow});
		this.toolbarRevealer.hide();
		this.delegate.deactivate();
		hui.ui.Editor.get().deactivate();
	},


	// Editor
	
	$partChanged : function(part) {
		if (part.type=='header') {
			CoreParts.updateHeaderPart(part.id,part.getValue(),part.properties);
		} else if (part.type=='html') {
			CoreParts.updateHtmlPart(part.id,part.getValue(),part.properties);
		} else if (part.type=='image') {
			CoreParts.updateImagePart(part.id,part.getImageId(),part.properties);
		}
	},
	
	// Activator
	
	buildActivator : function() {
		var self = this;
	
		this.activator = document.createElement('div');
		this.activator.className='activate';
		this.activator.onclick = function() {
			self.toggle()
		};
		document.body.appendChild(this.activator);
	
		this.logout = document.createElement('div');
		this.logout.className='logout';
		this.logout.onclick = function() {
			self.logOut();
		};
		document.body.appendChild(this.logout);
	
		if (hui.browser.gecko || hui.browser.webkit) {
			this.private = document.createElement('div');
			this.private.className='private';
			this.private.onclick = function() {
				self.goPrivate()
			};
			document.body.appendChild(this.private);
		}
	},
	removeActivator : function() {
		this.activator.style.display = 'none';
		this.logout.style.display = 'none';
		if (this.private) {
			this.private.style.display = 'none';
		}
	},
	goPrivate : function() {
		document.location='../private/';
	},
	
	// Actions
	
	logOut : function() {
		var self = this;
		CoreSecurity.logOut(function(data) {
			self.removeActivator();
			self.deactivate();
		});
	},
	toggle : function() {
		if (this.active) {
			this.deactivate();
		} else {
			this.activate();
		}
	},
	
	enableWebNodeEditing : function() {
		if (this.webnodes) {return;}
		this.webnodes = hui.get.byClass(document.body,'webnode');
		var self = this;
		hui.each(this.webnodes,function(node) {
			hui.listen(node,'click',function(e) {
				if (!self.active) return;
				hui.stop(e);
				self.showNodePanel(node);
			})
		})
	},
	
	showNodePanel : function(node) {
		this.activeNodeId = node.id.split('-')[1];
		if (!this.nodePanel) {
			var p = this.nodePanel = hui.ui.BoundPanel.create({});
			p.add(hui.ui.Button.create({name:'goToNode',title:'Gå til »',small:true,rounded:true}));
			p.add(hui.ui.Button.create({name:'editNodeText',title:'Rediger tekst',small:true,rounded:true}));
			p.add(hui.ui.Button.create({name:'moveNodeUp',title:'Flyt til venstre',small:true,rounded:true}));
			p.add(hui.ui.Button.create({name:'moveNodeDown',title:'Flyt til højre',small:true,rounded:true}));
			p.add(hui.ui.Button.create({name:'cancelNodePanel',title:'Luk',small:true,rounded:true}));
		}
		this.nodePanel.position(node);
		this.nodePanel.show();
	},
	$click$editNodeText : function() {
		this.nodePanel.hide();
		var id = this.activeNodeId;
		new OO.Editor.TextEditor({element:hui.get('node-'+id),$textChanged:function(text) {
			CorePublishing.updateWebNode(id,text);
		}});
	},
	$click$goToNode : function() {
		document.location=hui.get('node-'+this.activeNodeId).href+'&edit=true';
	},
	$click$cancelNodePanel : function() {
		if (this.nodePanel) {
			this.nodePanel.hide();
		}
	},
	$click$moveNodeUp : function() {
		CorePublishing.moveNodeUp(this.activeNodeId,function() {
			document.location.reload();
		});
	},
	$click$moveNodeDown : function() {
		CorePublishing.moveNodeDown(this.activeNodeId,function() {
			document.location.reload();
		});
	},
	
	// Templates
	
	$click$changeTemplate : function() {
		this.openTemplateWindow();
	},
	openTemplateWindow : function() {
		if (!this.templatePanel) {
			var category = this.templateCategories[0].value;
			this.templatePanel = hui.ui.Window.create({title:'Skift design',variant:'dark',width:550});
			var c = hui.ui.Columns.create();
			var s = hui.ui.Selection.create({name:'templateCategories'});
			var tp = hui.ui.Picker.create({name:'templatePicker',itemWidth:92,itemHeight:120,itemsVisible:4});
			tp.setObjects(this.templates[category]);
			tp.setValue(OnlineObjects.page.design);
			c.addToColumn(0,s);
			c.addToColumn(1,tp);
			c.setColumnWidth(0,120);
			s.setObjects(this.templateCategories);
			s.setValue(category);
			this.templatePanel.add(c);
		}
		this.templatePanel.show();
	},
	$select$templatePicker : function(value) {
		var path = OnlineObjects.appContext+'/designs/'+value+'/css/style.css';
		hui.get('pageDesign').setAttribute('href',path);
		CorePublishing.changePageTemplate(OnlineObjects.page.id,value);
	},
	$select$templateCategories : function(value) {
		var p = hui.ui.get('templatePicker');
		if (p) {
			p.setObjects(this.templates[value.value]);
		}
	},
	
	// Toolbar
	
	buildToolBar : function() {
		if (!this.toolbar) {
			this.toolbarRevealer = hui.ui.RevealingToolbar.create();
			var t = this.toolbar = this.toolbarRevealer.getToolbar();
			t.add(hui.ui.Toolbar.Icon.create({name:'newPage',icon:'common/page',overlay:'new','title':'Ny side'}));
			t.add(hui.ui.Toolbar.Icon.create({name:'deletePage',icon:'common/page',overlay:'delete','title':'Slet side'}));
			t.addDivider();
			t.add(hui.ui.Toolbar.Icon.create({name:'pageProperties',icon:'common/info','title':'Info'}));
			t.add(hui.ui.Toolbar.Icon.create({name:'changeTemplate',icon:'common/design','title':'Skift design'}));
			t.addDivider();
			this.delegate.addToToolbar(t);
		}
	},
	
	// Page info
	
	$click$pageProperties : function() {
		if (!this.infoWindow) {
			var w = this.infoWindow = hui.ui.Window.create({title:'Sidens egenskaber',icon:'common/info',padding:5,variant:'dark',width:250});
			var f = hui.ui.Formula.create({name:'pageInfoForm'});
			w.add(f);
			var g = f.buildGroup({above:true},[
				{type:'TextField',options:{label:'Website titel',key:'siteTitle'}},
				{type:'TextField',options:{label:'Sidens titel',key:'pageTitle'}},
				{type:'TextField',options:{label:'Menupunkt',key:'nodeTitle'}},
				{type:'TokenField',options:{label:'Nøgleord',key:'tags'}}
			]);
			var b = g.createButtons({top:10});
			b.add(hui.ui.Button.create({name:'cancelPageInfo',text:'Annuller'}));
			b.add(hui.ui.Button.create({name:'savePageInfo',text:'Gem',highlighted:true}));
		}
		var self = this;
		CorePublishing.getPageInfo(OnlineObjects.page.id,function(data) {
			hui.ui.get('pageInfoForm').setValues(data);
			self.infoWindow.show();
		});
	},
	$click$cancelPageInfo : function() {
		this.infoWindow.hide();
	},
	$click$savePageInfo : function() {
		var form = hui.ui.get('pageInfoForm');
		var data = form.getValues();
		data.id = OnlineObjects.page.id;
		CorePublishing.updatePageInfo(data,function() {
			var header = hui.get.firstByClass(document.body,'header');
			hui.get.firstByClass(header,'selected').innerHTML = data.nodeTitle;
			form.reset();
			this.infoWindow.hide();
		}.bind(this));
	},
	
	// New page
	
	$click$newPage : function() {
		if (!this.newPagePanel) {
			this.newPagePanel = hui.ui.Window.create({title:'Ny side',padding:0,variant:'dark'});
			this.newPagePicker = hui.ui.Picker.create({name:'documentPicker',title:'Vælg venligst typen af side der skal oprettes',itemWidth:90,itemHeight:120,valueProperty:'simpleName'});
			this.newPagePanel.add(this.newPagePicker);
			var self = this;
			CorePublishing.getDocumentClasses(function(list) {
				self.updateAndShowNewPagePicker(list);
			});
		} else {
			this.newPagePanel.show();
		}
	},
	updateAndShowNewPagePicker : function(list) {
		for (var i=0; i < list.length; i++) {
			list[i].image = OnlineObjects.appContext+'/documents/'+list[i].simpleName+'/thumbnail.png';
		};
		this.newPagePicker.setObjects(list);
		this.newPagePanel.show();
	},
	$select$documentPicker : function(value) {
		CorePublishing.createWebPage(OnlineObjects.site.id,value,function(pageId) {
			document.location='./?id='+pageId+'&edit=true';
		});
	},
	
	// Delete page
	
	$click$deletePage : function() {
		hui.ui.get().confirm({
			name:'confirmDeletePage',
			title:'Er du sikker på at du vil slette siden?',
			text:'Handlingen kan ikke fortrydes og siden kan ikke genskabes',
			ok:'Ja, slet siden',
			cancel:'Nej, jeg fortryder',
			highlighted:'cancel',emotion:'gasp'
		});
	},
	$ok$confirmDeletePage : function() {
		CorePublishing.deleteWebPage(
			OnlineObjects.page.id,
			{
				callback : function() {
					document.location='.?edit=true';
				},
				errorHandler : function(msg,e) {
					if (e.code=='lastPage') {
						hui.ui.showMessage({text:'Den sidste side kan ikke slettes',duration:3000});
					} else {
						hui.ui.showMessage({text:'Der skete en ukendt fejl',duration:3000});
					}
				}
			}
		);
	}
}


/*********************** Utilities **********************/

OO.Editor.getEntityProperty = function(entity,key) {
	for (var i=0; i < entity.properties.length; i++) {
		if (entity.properties[i].key==key) {
			return entity.properties[i].value;
		}
	};
	return null;
}

OO.Editor.setEntityProperty = function(entity,key,value) {
	for (var i=0; i < entity.properties.length; i++) {
		if (entity.properties[i].key==key) {
			entity.properties[i].value=value;
		}
	};
}

OO.Editor.getEntityProperties = function(entity,key) {
	var values = [];
	for (var i=0; i < entity.properties.length; i++) {
		if (entity.properties[i].key==key) {
			values.push(entity.properties[i].value);
		}
	};
	return values;
}

/*********************** Text editor **********************/

OO.Editor.TextEditor = function(options) {
	this.options = options;
	this.activate();
}

OO.Editor.TextEditor.prototype.activate = function() {
	var e = this.options.element;
	var field = this.field = hui.build('input');
	hui.style.set(field,{width:((e.clientWidth || e.offsetWidth)+30)+'px',textAlign:'center'});
	e.style.display='none';
	this.field.value = this.original = e.innerHTML;
	hui.style.copy(e,field,['font-size','color','background-color','line-height','font-family','text-transform']);
	hui.style.set(this.field,{border:'none',textAlign:'center'});
	e.parentNode.insertBefore(field,e);
	field.focus();
	field.select();
	this.field.onblur = this.deactivate.bind(this);
	hui.listen(this.field,'keydown',function(e) {
		e = hui.event(e);
		if (e.returnKey) {
			this.deactivate();
		}
	}.bind(this));
}

OO.Editor.TextEditor.prototype.deactivate = function() {
	var value = this.field.value;
	if (!hui.isBlank(value)) {
		this.options.element.innerHTML = value;
	}
	this.field.style.display='none';
	this.options.element.style.display='';
	this.field.parentNode.removeChild(this.field);
	delete(this.field);
	if (!hui.isBlank(value) && value!==this.original) {
		if (this.options['$textChanged']) {
			this.options.$textChanged(value,this.options);
		}
	}
}

OO.Editor.TextEditor.prototype.destroy = function() {
	this.element.onclick = null;
}