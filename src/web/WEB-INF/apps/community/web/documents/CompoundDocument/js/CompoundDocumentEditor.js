OO.Editor.CompoundDocument = function() {
	In2iGui.get().addDelegate(this);
	In2iGui.Editor.get().addPartController('header','Overskrift',In2iGui.Editor.Header);
	In2iGui.Editor.get().addPartController('html','Tekst',In2iGui.Editor.Html);
	this.base = $$('.compounddocument')[0];
}

OO.Editor.CompoundDocument.getInstance = function() {
	if (!OO.Editor.CompoundDocument.instance) {
		OO.Editor.CompoundDocument.instance = new OO.Editor.CompoundDocument();
	}
	return OO.Editor.CompoundDocument.instance;
}

OO.Editor.CompoundDocument.prototype = {
	activate : function() {
	},
	deactivate : function() {
	},
	addToToolbar : function(toolbar) {
		toolbar.add(In2iGui.Toolbar.Icon.create('addRow',{icon:'layout/row',overlay:'new','title':'Tilføj række'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('reload',{icon:'common/refresh','title':'Genindlæs'}));
	},
	click$addRow : function() {
		var self = this;
		CompoundDocumentDocument.addRow(OnlineObjects.content.id,function() {
			self.updateAll();
		});
	},
	updateAll : function() {
		var self = this;
		CompoundDocumentDocument.getStructureHTML(OnlineObjects.content.id,function(html) {
			self.base.update(html);
			In2iGui.Editor.get().reload();
		});
	},
	click$reload : function() {
		this.updateAll();
	},
	setEditor : function(editor) {
		this.editor = editor;
	},
	deletePart : function(part) {
		this.partToDelete = part;
		In2iGui.get().confirm('cofirmDeletePart',{title:'Er du sikker på at du vil slette afsnittet?',text:'Handlingen kan ikke fortrydes',ok:'Ja, slet',cancel:'Nej, jeg fotryder',highlighted:'cancel',emotion:'gasp',modal:true});
	},
	ok$cofirmDeletePart : function() {
		var self = this;
		CompoundDocumentDocument.removePart(OnlineObjects.content.id,this.partToDelete.id,function() {
			self.updateAll();
		});
	},
	// Editor responders
	addPart$In2iGuiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.addPart(OnlineObjects.content.id,info.row,info.column,info.position,info.type,function() {
			self.updateAll();
		});
	},
	removeColumn$In2iGuiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.removeColumn(OnlineObjects.content.id,info.row,info.column,function() {
			self.updateAll();
		});
	},
	addColumn$In2iGuiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.addColumn(OnlineObjects.content.id,info.row,info.position,function() {
			self.updateAll();
		});
	},
	updateColumn$In2iGuiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.updateColumn(
			OnlineObjects.content.id,
			info.row,
			info.column,
			info.width,
			info.left,
			info.right,
			this.updateAll.bind(this)
		);
	}
}

In2iGui.onDomReady(function() {
	new OO.Editor(OO.Editor.CompoundDocument.getInstance());
});