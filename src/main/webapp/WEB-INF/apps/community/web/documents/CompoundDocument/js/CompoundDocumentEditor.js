OO.Editor.CompoundDocument = function() {
	hui.ui.listen(this);
	hui.ui.Editor.get().addPartController('header','Overskrift',hui.ui.Editor.Header);
	hui.ui.Editor.get().addPartController('html','Tekst',hui.ui.Editor.Html);
	hui.ui.Editor.get().addPartController('image','Billede',OO.Editor.Image);
	this.base = hui.get.firstByClass('.compounddocument');
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
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'addRow',icon:'layout/row',overlay:'new','title':'Tilføj række'}));
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'reload',icon:'common/refresh','title':'Genindlæs'}));
	},
	$click$addRow : function() {
		var self = this;
		CompoundDocumentDocument.addRow(OnlineObjects.content.id,function() {
			self.updateAll();
		});
	},
	updateAll : function() {
		var self = this;
		CompoundDocumentDocument.getStructureHTML(OnlineObjects.content.id,function(html) {
			self.base.innerHTML=html;
			hui.ui.Editor.get().reload();
		});
	},
	$click$reload : function() {
		this.updateAll();
	},
	setEditor : function(editor) {
		this.editor = editor;
	},
	deletePart : function(part) {
		this.partToDelete = part;
		hui.ui.confirm({name:'cofirmDeletePart',title:'Er du sikker på at du vil slette afsnittet?',text:'Handlingen kan ikke fortrydes',ok:'Ja, slet',cancel:'Nej, jeg fotryder',highlighted:'cancel',emotion:'gasp',modal:true});
	},
	$ok$cofirmDeletePart : function() {
		var self = this;
		CompoundDocumentDocument.removePart(OnlineObjects.content.id,this.partToDelete.id,function() {
			self.updateAll();
		});
	},
	// Editor responders
	$addPart$huiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.addPart(OnlineObjects.content.id,info.row,info.column,info.position,info.type,function() {
			self.updateAll();
		});
	},
	$removeColumn$huiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.removeColumn(OnlineObjects.content.id,info.row,info.column,function() {
			self.updateAll();
		});
	},
	$addColumn$huiEditor : function(info) {
		var self = this;
		CompoundDocumentDocument.addColumn(OnlineObjects.content.id,info.row,info.position,function() {
			self.updateAll();
		});
	},
	$updateColumn$huiEditor : function(info) {
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

hui.ui.onReady(function() {
	new OO.Editor(OO.Editor.CompoundDocument.getInstance());
});

////////////////////////////////// Image editor ////////////////////////////////

/**
 * @constructor
 */
OO.Editor.Image = function(element,row,column,position) {
	this.element = $(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.imageId = null;
	this.img = this.element.select('img')[0];
	this.id = hui.ui.Editor.getPartId(this.element);
	this.field = null;
}

OO.Editor.Image.prototype = {
	addBehavior : function() {
		if (!this.behaviorAdded) {
			if (this.img) {
				this.img.observe('click',this.showImagePicker.bind(this));
			}
			this.behaviorAdded = true;
		}
	},
	activate : function() {
		this.active = true;
		this.addBehavior();
		this.showImagePicker();
	},
	save : function() {
		this.deactivate();
		hui.ui.Editor.get().partChanged(this);
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		if (this.picker) {
			this.picker.hide();
		}
		hui.ui.Editor.get().partDidDeacivate(this);
		this.active = false;
	},
	getImageId : function() {
		return this.imageId;
	},
	showImagePicker : function() {
		if (!this.active) return;
		if (!this.picker) {
			var win = this.picker = hui.ui.Window.create({title:'Vælg billede',width:300});
			var overflow = hui.ui.Overflow.create({height:300});
			var gallery = hui.ui.Gallery.create();
			gallery.listen(this);
			win.add(overflow.add(gallery));
			AppCommunity.getLatestImages('',function(images) {
				gallery.setObjects(images);
			});
		}
		this.picker.show();
	},
	$resolveImageUrl : function(image,width,height) {
		return OnlineObjects.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	},
	$select : function(gallery) {
		var obj = gallery.getFirstSelection();
		if (!this.img) {
			this.img = new Element('img');
			this.element.insert(this.img);
		}
		this.img.src=this.$resolveImageUrl(obj,200,200);
		this.imageId=obj.id;
	}
}