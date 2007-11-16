if (!OO) var OO={};

OO.Editor = function(delegate) {
	this.delegate = delegate;
	this.delegate.setEditor(this);
	this.textEditors = [];
	this.active = false;
	this.buildActivator();
	this.toolbar = null;
	this.templates = [
		{key:'basic',title:'Basal',image:'../templates/basic/info/thumbnail.png'},
		{key:'modern',title:'Moderne',image:'../templates/modern/info/thumbnail.png'},
		{key:'cartoon',title:'Tegneserie',image:'../templates/cartoon/info/thumbnail.png'},
		{key:'ocean',title:'Ocean',image:'../templates/ocean/info/thumbnail.png'}
	];
	var self = this;
	this.toolbarItems = [
		{title:'Opret side',action:function() {self.addPage()},icon:'addpage'},
		{title:'Slet side',action:function() {self.confirmDeletePage()},icon:'deletepage'},
		{title:'Skift skabelon',action:function() {self.openTemplateWindow()},icon:'changetemplate'},
		'divider'
	];
}

OO.Editor.prototype.buildActivator = function() {
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
	
	this.private = document.createElement('div');
	this.private.className='private';
	this.private.onclick = function() {
		self.goPrivate()
	};
	document.body.appendChild(this.private);
}

OO.Editor.prototype.removeActivator = function() {
	this.activator.style.display = 'none';
	this.logout.style.display = 'none';
	this.private.style.display = 'none';
}

OO.Editor.prototype.goPrivate = function() {
	document.location='./private/';
}

OO.Editor.prototype.logOut = function() {
	var self = this;
	var delegate = {
		callback:function(data) {
			self.removeActivator();
			self.deactivate();
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	CoreSecurity.logOut(delegate);
}

OO.Editor.prototype.toggle = function() {
	if (this.active) {
		this.deactivate();
	} else {
		this.activate();
	}
}

OO.Editor.prototype.disableWebNodeEditing = function() {
	for (var i=0; i < this.textEditors.length; i++) {
		this.textEditors[i].destroy();
	};
	this.textEditors = [];
}

OO.Editor.prototype.enableWebNodeEditing = function() {
	this.webnodes = $class('webnode');
	var self = this;
	for (var i=0; i < this.webnodes.length; i++) {
		var delegate = {
			textChanged : function(element,value) {
				var id = element.id.split('-')[1];
				self.updateWebNode(id,value);
			}
		}
		var editor = new OO.Editor.TextEditor(this.webnodes[i],delegate);
		this.textEditors[this.textEditors.length] = editor;
	};
}

OO.Editor.prototype.updateWebNode = function(id,name) {
	var delegate = {
		callback:function(data) {
			// success
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	CommunityTool.updateWebNode(id,name,delegate);
}

OO.Editor.prototype.activate = function() {
	this.active=true;
	this.activator.className='deactivate';
	N2i.Element.addClassName(document.body,'editor_mode');
	this.buildToolBar();
	$ani(this.toolbar,'height','58px',300);
	$ani(document.body,'padding-top','58px',300);
	this.enableWebNodeEditing();
	this.delegate.activate();
}

OO.Editor.prototype.deactivate = function() {
	if (!this.active) return;
	this.active=false;
	this.activator.className='activate';
	if (this.templateWindow) {
		this.templateWindow.hide();
	}
	N2i.Element.removeClassName(document.body,'editor_mode');
	$ani(this.toolbar,'height','0px',500);
	$ani(document.body,'padding-top','0px',500);
	this.disableWebNodeEditing();
	this.delegate.deactivate();
}

OO.Editor.prototype.buildToolBar = function() {
	if (!this.toolbar) {
		this.toolbar = document.createElement('div');
		this.toolbar.className = 'editor_toolbar';
		var bars = [this.toolbarItems,this.delegate.toolbarItems];
		for (var i=0; i < bars.length; i++) {
			var bar = bars[i]
			for (var j=0; j < bar.length; j++) {
				var item = bar[j];
				if (item=='divider') {
					var element = document.createElement('div');
					element.className = 'divider';
					this.toolbar.appendChild(element);
				} else {
					var element = document.createElement('div');
					element.onclick = item.action;
					element.appendChild(document.createTextNode(item.title));
					element.className = 'icon '+item.icon;
					this.toolbar.appendChild(element);
				}
			};
		};
		document.body.appendChild(this.toolbar);
	}
}

OO.Editor.prototype.confirmDeletePage = function() {
	if (!this.confirmDeleteDialog) {
		var self = this;
		this.confirmDeleteDialog = new OO.Community.Message();
		this.confirmDeleteDialog.style='gasp';
		var body = document.createElement('div');
		body.appendChild(OO.Community.Message.buildHeader('Er du sikker på at du vil slette siden?'));
		body.appendChild(OO.Community.Message.buildParagraph('Handlingen kan ikke fortydes.'));
		var cancelButton = OO.Community.Message.buildButton('Nej, jeg fortryder',{buttonWasClicked:function() {self.confirmDeleteDialog.hide()}});
		var deleteButton = OO.Community.Message.buildButton('Ja, slet siden',{buttonWasClicked:function() {self.deletePage()}});
		body.appendChild(cancelButton);
		body.appendChild(deleteButton);
		this.confirmDeleteDialog.setContents(body);
	}
	this.confirmDeleteDialog.show();
}

OO.Editor.prototype.deletePage = function() {
	var delegate = {
		callback:function(data) {
			document.location='.';
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	CommunityTool.deleteWebPage(info.page.id,delegate);
}

OO.Editor.prototype.addPage = function() {
	var delegate = {
		callback:function(pageId) {
			document.location='./?id='+pageId;
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	CommunityTool.createWebPage(info.site.id,delegate);
}


OO.Editor.prototype.openTemplateWindow = function() {
	if (!this.templateWindow) {
		this.templateWindow = new N2i.Window(new OO.Editor.TemplateWindowDelegate(this));
	}
	this.templateWindow.show();
}

OO.Editor.prototype.changeTemplate = function(key) {
	var delegate = {
		callback:function(data) {
			document.location=document.location;
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	CommunityTool.changePageTemplate(info.page.id,key,delegate);
}

/************************* Template window deleagte *********************/



OO.Editor.TemplateWindowDelegate = function(editor) {
	this.editor = editor;
	this.position = {top : 100,left: 200};
	this.title='Skift skabelon';
	this.chooser = new OO.Editor.Chooser({items:this.editor.templates},this);
}

OO.Editor.TemplateWindowDelegate.prototype.getContent = function() {
	var self = this;
	this.body = document.createElement('div');
	this.body.style.width='465px';
	this.body.appendChild(this.chooser.getElement());
	return this.body;
}

OO.Editor.TemplateWindowDelegate.prototype.chooserItemWasSelected = function(info) {
	this.editor.changeTemplate(info.key);
}

/************************* Template window deleagte *********************/

OO.Editor.Chooser = function(options,delegate) {
	this.element = null;
	this.delegate = delegate || {};
	this.options = options || {};
}

OO.Editor.Chooser.prototype.getElement = function() {
	if (!this.element) {
		var self = this;
		this.element = document.createElement('div');
		this.element.className='chooser';
		for (var i=0; i < this.options.items.length; i++) {
			var info = this.options.items[i];
			var item = document.createElement('div');
			if (info.image) {
				item.className='item';
				var inner = document.createElement('div');
				inner.style.backgroundImage='url(\''+info.image+'\')';
				inner.ooEditorChooserInfo = info;
				inner.onclick = function() {
					self.itemWasClicked(this.ooEditorChooserInfo);
				}
				item.appendChild(inner);				
			} else if (info.className) {
				item.className=info.className;
				item.ooEditorChooserInfo = info;
				item.onclick = function() {
					self.itemWasClicked(this.ooEditorChooserInfo);
				}
			}
			this.element.appendChild(item);
		};
	}
	return this.element;
}

OO.Editor.Chooser.prototype.itemWasClicked = function(info) {
	if (this.delegate.chooserItemWasSelected) {
		this.delegate.chooserItemWasSelected(info);
	}
}


/*********************** Text editor **********************/

OO.Editor.TextEditor = function(element,delegate) {
	this.element=element;
	this.delegate=delegate || {};
	var self = this;
	this.element.onclick = function() {
		self.activate();
		return false;
	}
}

OO.Editor.TextEditor.prototype.activate = function() {
	var field = document.createElement('input');
	field.style.width=(N2i.Element.getWidth(this.element)+30)+'px';
	this.element.style.display='none';
	field.value = this.element.innerHTML;
	this.element.parentNode.insertBefore(field,this.element);
	field.focus();
	field.select();
	var element = this.element;
	var delegate = this.delegate;
	field.onblur = function() {
		var value = field.value;
		element.innerHTML = value;
		field.style.display='none';
		element.style.display='';
		field.parentNode.removeChild(field);
		if (delegate.textChanged) {
			delegate.textChanged(element,value);
		}
	}
}

OO.Editor.TextEditor.prototype.destroy = function() {
	this.element.onclick = null;
}