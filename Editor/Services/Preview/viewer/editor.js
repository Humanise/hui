op.Editor = {
	$ready : function() {
		var ctrl = this.getToolbarController();
		if (ctrl) { // May not be loaded yet
			ctrl.pageDidLoad(op.page.id);
		}
		if (hui.location.hasHash('edit')) {
			if (templateController!==undefined) {
				templateController.edit();
			}
		}
		if (op.page.template=='document') {
			var editor = hui.ui.Editor.get();
			editor.setOptions({
				partClass:'part_section'
			});
			editor.addPartController('header','Overskrift',op.Editor.Header);
			editor.addPartController('text','Text',op.Editor.Text);
			//editor.listen(this);
			editor.ignite();
			editor.activate();
		}
	},
	getToolbarController : function() {
		try {
			return window.parent.controller;
		} catch (e) {
			hui.log('Unable to find toolbar controller');
		}
	},
	$partChanged : function() {
		this.getToolbarController().pageDidChange();
	},
	
	editProperties : function() {
		if (!this.propertiesWindow) {
			var win = this.propertiesWindow = hui.ui.Window.create({width:300,title:'Info',icon:'common/info',padding:10,variant:'dark'});
			var form = this.propertiesFormula = hui.ui.Formula.create();
			var group = form.buildGroup({above:true},[
				{type:'Text',options:{label:'Titel:',key:'title'}},
				{type:'Text',options:{label:'Beskrivelse:',key:'description',multiline:true}},
				{type:'Text',options:{label:'Nøgelord:',key:'keywords'}},
				{type:'Text',options:{label:'Sti:',key:'path'}},
				{type:'DropDown',options:{
					label:'Sprog:',
					key:'language',
					items:[{value:'',title:'Intet'},{value:'DA',title:'Dansk'},{value:'EN',title:'Engelsk'},{value:'DE',title:'Tysk'}]
				}}
			]);
			var buttons = group.createButtons();
			var more = hui.ui.Button.create({text:'Mere...'});
			more.click(this.moreProperties.bind(this));
			buttons.add(more);

			var update = hui.ui.Button.create({text:'Opdater',highlighted:true});
			update.click(this.saveProperties.bind(this));
			buttons.add(update);
			win.add(form);
		}
		hui.ui.request({
			url:'data/LoadPageProperties.php',
			parameters:{id:op.page.id},
			message : {start:'Henter sidens info...',delay:300},
			onJSON:function(obj) {
				this.propertiesFormula.setValues(obj);
				this.propertiesWindow.show();
			}.bind(this)
		})
	},
	saveProperties : function() {
		var values = this.propertiesFormula.getValues();
		values.id = op.page.id;
		hui.ui.request({
			url:'data/SavePageProperties.php',
			parameters:values,
			message : {start:'Gemmer sidens info...',delay:300},
			onSuccess:function() {
				this.propertiesFormula.reset();
				this.propertiesWindow.hide();
			}.bind(this)
		});
	},
	moreProperties : function() {
		if (!window.parent) {
			hui.log('The window has no parent! '+window.location);
			return;
		}
		window.parent.location='../../../Tools/Pages/?action=pageproperties';
	}
}

hui.ui.listen(op.Editor);

/**
 * @constructor
 */
op.Editor.Header = function(element,row,column,position) {
	this.element = hui.get(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = hui.ui.Editor.getPartId(this.element);
	this.header = hui.firstByTag(this.element,'*');
	this.field = null;
}

op.Editor.Header.prototype = {
	activate : function() {
		this._load();
	},
	_load : function() {
		hui.ui.request({url:'parts/load.php',parameters:{type:'header',id:this.id},onJSON:function(part) {
			this.part = part;
			this._edit();
		}.bind(this)});
	},
	_edit : function() {
		this.field = hui.build('textarea',{'class':'in2igui_editor_header',style:'resize: none;'});
		this.field.value = this.part.text;
		this.header.style.visibility='hidden';
		this._updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		hui.ui.listen(this.field,'keydown',function(e) {
			if (e.keyCode==Event.KEY_RETURN) {
				this.save();
			}
		}.bind(this));
	},
	save : function() {
		var value = this.field.value;
		this.deactivate();
		if (value!=this.value) {
			this.value = value;
			this.header.innerHTML = value;
			hui.ui.Editor.get().partChanged(this);
			hui.ui.request({url:'parts/update.php',parameters:{id:this.id,pageId:op.page.id,text:this.value,type:'header'},onText:function(html) {
				this.element.update(html);
				this.header = this.element.firstDescendant();
			}.bind(this)});
		}
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
		hui.ui.Editor.get().partDidDeacivate(this);
	},
	_updateFieldStyle : function() {
		hui.setStyle(this.field,{width:this.header.clientWidth+'px',height:this.header.clientHeight+'px'});
		hui.copyStyle(this.header,this.field,['font-size','line-height','margin-top','font-weight','font-family','text-align','color','font-style']);
	},
	getValue : function() {
		return this.value;
	}
}

/**
 * @constructor
 */
op.Editor.Text = function(element,row,column,position) {
	this.element = hui.get(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = hui.ui.Editor.getPartId(this.element);
	this.header = hui.firstByTag(this.element,'*');
	this.field = null;
}

op.Editor.Text.prototype = {
	activate : function() {
		this._load();
	},
	_load : function() {
		hui.ui.request({url:'parts/load.php',parameters:{type:'text',id:this.id},onJSON:function(part) {
			this.part = part;
			this._edit();
		}.bind(this)});
	},
	_edit : function() {
		this.field = hui.build('textarea',{className:'in2igui_editor_header',style:'resize: none;'});
		this.field.value = this.part.text;
		this.header.style.visibility='hidden';
		this._updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		/*
		this.field.observe('keydown',function(e) {
			if (e.keyCode==Event.KEY_RETURN) {
				this.save();
			}
		}.bind(this));*/
	},
	save : function() {
		var value = this.field.value;
		this.deactivate();
		if (value!=this.value) {
			this.value = value;
			this.header.innerHTML = value;
			hui.ui.Editor.get().partChanged(this);
			hui.ui.request({url:'parts/update.php',parameters:{id:this.id,pageId:op.page.id,text:this.value,type:'text'},onText:function(html) {
				this.element.innerHTML=html;
				this.header = hui.firstByTag(this.element,'*');
			}.bind(this)});
		}
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
		hui.ui.Editor.get().partDidDeacivate(this);
	},
	_updateFieldStyle : function() {
		hui.setStyle(this.field,{width:this.header.clientWidth+'px',height:this.header.clientHeight+'px'});
		hui.copyStyle(this.header,this.field,['font-size','line-height','margin-top','font-weight','font-family','text-align','color','font-style']);
	},
	getValue : function() {
		return this.value;
	}
}