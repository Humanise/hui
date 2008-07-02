OO.Editor.ImageGallery = function() {
	this.imageWidth=null;
	this.imageHeight=null;
	this.style=null;
	this.columns = 3;
	this.images = [];
	this.tempImages = [];
	this.cells = [];
	this.cellDims = [];
	var self = this;
	this.toolbarItems = [
		{title:'Tilføj billede',action:function() {self.openAddImagePanel()},icon:'addimage'},
		{title:'Skift ramme',action:function() {self.openStyleWindow()},icon:'style'},
		{title:'Mindre',action:function() {self.smaller()},icon:'style'},
		{title:'Større',action:function() {self.bigger()},icon:'style'}
	];
	In2iGui.get().addDelegate(this);
	In2iGui.Editor.get().addPartController('header','Overskrift',In2iGui.Editor.Header);
}

OO.Editor.ImageGallery.getInstance = function() {
	if (!OO.Editor.ImageGallery.instance) {
		OO.Editor.ImageGallery.instance = new OO.Editor.ImageGallery();
	}
	return OO.Editor.ImageGallery.instance;
}

OO.Editor.ImageGallery.prototype = {
	activate : function() {
		this.grid = $class('grid')[0];
		if (!this.styleWindow) {
			this.refreshImages();
		}
	},
	deactivate : function() {
		if (this.addImagePanel) {
			this.addImagePanel.hide();
		}
		if (this.styleWindow) {
			this.styleWindow.hide();
		}
		this.hideImageEditorPanel();
		OO.ImageGallery.getInstance().rebuild();
	},
	isActive : function() {
		return this.editor.active;
	},
	addToToolbar : function(toolbar) {
		toolbar.add(In2iGui.Toolbar.Icon.create('changeFrame',{icon:'common/color','title':'Skift ramme'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('addImage',{icon:'common/image','overlay':'new','title':'Tilføj billede'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('increaseSize',{icon:'common/image','overlay':'new','title':'Større'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('decreaseSize',{icon:'common/image','overlay':'new','title':'Mindre'}));
	},
	click$changeFrame : function() {
		this.openStyleWindow();
	},
	setEditor : function(editor) {
		this.editor = editor;
	},
	saveImagePositions : function() {
		OO.ImageGallery.getInstance().clearImages();
		var ids = [];
		for (var i=0; i < this.images.length; i++) {
			ids[ids.length]=this.images[i].image.id;
			OO.ImageGallery.getInstance().addImage(this.images[i].image.id);
		};
		ImageGalleryDocument.updateImagePositions(OnlineObjects.content.id,ids);
	},
	refreshImages : function() {
		var self = this;
		ImageGalleryDocument.listImages(OnlineObjects.content.id,
			function(data) {
				self.parseImages(data);
				self.updateImages()
			}
		);
	}
}

OO.Editor.ImageGallery.prototype.parseImages = function(images) {
	OO.ImageGallery.getInstance().clearImages();
	this.images = [];
	for (var i=0; i < images.length; i++) {
		var image = images[i];
		var imageCtrl = new OO.Editor.ImageGallery.Image(image,i,this);
		this.images[this.images.length] = imageCtrl;
		OO.ImageGallery.getInstance().addImage(image.id);
	};
	this.tempImages = this.images.concat();
}

OO.Editor.ImageGallery.prototype.click$increaseSize = function() {
	if (this.imageWidth+20>300) return;
	this.imageWidth+=20;
	this.imageHeight+=20;
	for (var i=0; i < this.images.length; i++) {
		this.images[i].rebuild();
	};
	this.updateImages();
	ImageGalleryDocument.updateImageSize(OnlineObjects.content.id,this.imageWidth,this.imageHeight);
}

OO.Editor.ImageGallery.prototype.click$decreaseSize = function() {
	if (this.imageWidth-20<100) return;
	this.imageWidth-=20;
	this.imageHeight-=20;
	for (var i=0; i < this.images.length; i++) {
		this.images[i].rebuild();
	};
	this.updateImages();
	ImageGalleryDocument.updateImageSize(OnlineObjects.content.id,this.imageWidth,this.imageHeight);
}

OO.Editor.ImageGallery.prototype.updateImages = function(useTemp) {
	var images = useTemp ? this.tempImages : this.images;
	for (var i = this.grid.childNodes.length - 1; i >= 0; i--){
		this.grid.removeChild(this.grid.childNodes[i]);
	};
	this.grid.className='grid grid_'+this.columns;
	this.grid.style.width=((this.imageWidth+80)*this.columns)+'px';
	this.grid.style.marginLeft=((this.imageWidth+80)*this.columns/2*-1)+'px';
	var row;
	for (var i=0; i < images.length; i++) {
		if (i % this.columns == 0) {
			row = document.createElement('div');
			this.grid.appendChild(row);
		}
		var image = images[i];
		var cell = document.createElement('div');
		cell.className = 'cell';
		cell.style.width = (this.imageWidth+80)+'px';
		cell.style.height = (this.imageHeight+80)+'px';
		cell.appendChild(image.getFrame());
		row.appendChild(cell);
	};
	this.registerCells();
}

OO.Editor.ImageGallery.prototype.registerCells = function() {
	this.cells = $class('cell',this.grid);
	this.cellDims = [];
	for (var i=0; i < this.cells.length; i++) {
		var cell = this.cells[i];
		this.cellDims[this.cellDims.length] = {
			left: N2i.Element.getLeft(cell),
			right: N2i.Element.getLeft(cell)+N2i.Element.getWidth(cell),
			top: N2i.Element.getTop(cell),
			bottom: N2i.Element.getTop(cell)+N2i.Element.getHeight(cell)
		};
	};
}

OO.Editor.ImageGallery.prototype.imageWasDragged = function(top,left,index) {
	var found = false;
	for (var i=0; i < this.cellDims.length; i++) {
		var cell = this.cellDims[i];
		if ((left>=cell.left && left<=cell.right && top>=cell.top && top<=cell.bottom && i!=index) ) {
			if (i!=this.latestHilitedCell) {
				this.latestHilitedCell = i;
				this.changeImageOrder(index,i,false,false);
			}
			found = true;
			break;
		}
	}
	if (!found && this.latestHilitedCell!=null) {
		this.latestHilitedCell=null
	}
	return found;
}

OO.Editor.ImageGallery.prototype.getCell = function(top,left) {
	for (var i=0; i < this.cellDims.length; i++) {
		var cell = this.cellDims[i];
		if ((left>=cell.left && left<=cell.right && top>=cell.top && top<=cell.bottom) ) {
			return i;
		}
	}
	return null;
}

OO.Editor.ImageGallery.prototype.imageFinishedDragging = function(event,image,changed) {
	this.latestHilitedCell=null;
	if (changed) {
		this.saveImagePositions();
	}
}

OO.Editor.ImageGallery.prototype.changeImageOrder = function(currentIndex,newIndex,interchange,useTemp) {
	var images = useTemp ? this.tempImages : this.images;
	if (interchange) {
		var cur = images[currentIndex];
		images[currentIndex] = images[newIndex];
		images[newIndex] = cur;
	} else {
		this.moveItemInArray(currentIndex,newIndex,images);
	}
	for (var i=0; i < images.length; i++) {
		images[i].setIndex(i);
	};
	this.updateImages(useTemp);
}

OO.Editor.ImageGallery.prototype.moveItemInArray = function(currentIndex,newIndex,array) {
	var removed = array.splice(currentIndex, 1);
	array.splice(newIndex, 0, removed[0]);
}

OO.Editor.ImageGallery.prototype.uploadFailed = function() {
	this.addImagePanelDelegate.reset();
	In2iGui.get().showAlert({variant:'gasp',title:'Det lykkedes ikke at tilføje billedet.',text:'Det kan skyldes at filen ikke er et understøttet format?'})
}

OO.Editor.ImageGallery.prototype.listenToUpload = function() {
	var self = this;
	var delegate = {
		callback:function(data) { 
			if (data==null) return;
			if (data.completed==false) {
				self.addImagePanelDelegate.uploadChanged(data);
				if (data.error) {
					self.uploadFailed(data);
				} else {
					self.listenToUpload();
				}
			} else {
				self.refreshImages();
				self.addImagePanelDelegate.reset();
			}
		}
	};
	window.setTimeout(function() {
		CommunityTool.getProcess('imageUpload',delegate);
	},500);
}


OO.Editor.ImageGallery.prototype.openStyleWindow = function() {
	if (!this.styleWindow) {
		this.styleWindow = In2iGui.Panel.create({title:'Skift ramme',padding:10});
		this.stylePicker = In2iGui.Picker.create('framePicker',{title:'Vælg den ny ramme',itemWidth:90,itemHeight:80});
		this.stylePicker.setObjects([
			{key:'elegant',title:'Elegant',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/elegant/thumbnail.png'},
			{key:'paper',title:'Papir',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/paper/thumbnail.png'},
			{key:'simple',title:'Simpel',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/simple/thumbnail.png'}
		])
		this.styleWindow.add(this.stylePicker);
	}
	this.styleWindow.show();
}

OO.Editor.ImageGallery.prototype.selectionChanged$framePicker = function(picker) {
	var obj = picker.getSelection();
	OO.ImageGallery.getInstance().style = obj.key;
	for (var i=0; i < this.images.length; i++) {
		this.images[i].setStyle(obj.key);
	};
	ImageGalleryDocument.changeFrameStyle(OnlineObjects.content.id,obj.key);
}


OO.Editor.ImageGallery.prototype.click$addImage = function() {
	if (!this.addImagePanel) {
		this.addImagePanel = In2iGui.Panel.create({title:'Tilføj billede'});
		this.addImagePanelDelegate = new OO.Editor.ImageGallery.AddImagePanelDelegate(this);
		this.addImagePanel.addDelegate(this.addImagePanelDelegate);
	}
	this.addImagePanel.show();
}

OO.Editor.ImageGallery.prototype.ok$confirmDeleteImage = function() {
	var self = this;
	ImageGalleryDocument.deleteImage(this.imageToDelete.image.id,OnlineObjects.content.id,
		function(data) { 
			self.refreshImages();
		}
	);
	this.hideImageEditorPanel();
}

OO.Editor.ImageGallery.prototype.deleteImage = function(image) {
	this.imageToDelete = image;
	In2iGui.get().confirm('confirmDeleteImage',{
		title:'Er du sikker på at du vil slette billedet?',
		variant:'gasp',
		ok:'Ja, slet billedet',
		cancel:'Nej, jeg fortryder',
		highlighted:'ok'
	});
}

OO.Editor.ImageGallery.prototype.showImageEditorPanel = function(photo) {
	this.latestEditedImage = photo.image;
	var panel = this.getImageEditorPanel();
	In2iGui.get('imageEditorTitle').setValue(photo.image.name || '');
	var desc = OO.Editor.getEntityProperty(photo.image,'image.description');
	In2iGui.get('imageEditorDescription').setValue(desc || '');
	panel.position(photo.frame.getElementsByTagName('img')[0]);
	panel.show();
}

OO.Editor.ImageGallery.prototype.hideImageEditorPanel = function() {
	if (this.imageEditorPanel) this.imageEditorPanel.hide();
}

OO.Editor.ImageGallery.prototype.saveImageEditorPanel = function() {
	var title = In2iGui.get('imageEditorTitle').getValue();
	var desc = In2iGui.get('imageEditorDescription').getValue();
	var image = this.latestEditedImage;
	var self = this;

	ImageGalleryDocument.updateImage(image.id,title,desc,
		function() {
			image.name = title;
			OO.Editor.setEntityProperty(image,'image.description',desc);
			self.hideImageEditorPanel();
		}
	);
}

OO.Editor.ImageGallery.prototype.getImageEditorPanel = function() {
	if (!this.imageEditorPanel) {
		var panel = In2iGui.BoundPanel.create({top:'50px',left:'50px'});
		var formula = In2iGui.Formula.create();
		panel.addWidget(formula);
		var group = In2iGui.Formula.Group.create();
		formula.addContent(group.getElement());

		var title = In2iGui.Formula.Text.create({label:'Titel',name:'imageEditorTitle'});
		group.addWidget(title);
		var desc = In2iGui.Formula.Text.create({label:'Beskrivelse',lines:6,name:'imageEditorDescription'});
		group.addWidget(desc);

		panel.addNode(N2i.create('div',null,{height:'5px'}));

		var save = In2iGui.Button.create('saveImageEditor',{text:'Gem',highlighted:true});
		panel.addWidget(save);
		var cancel = In2iGui.Button.create('cancelImageEditor',{text:'Annuller'});
		panel.addWidget(cancel);
		this.imageEditorPanel = panel;
		this.imageEditorDelegate = new OO.Editor.ImageGallery.ImageEditorDelegate(this);
		var self = this;
		In2iGui.get().addDelegate({
			buttonWasClicked$cancelImageEditor : function() {
				self.hideImageEditorPanel();
			},
			buttonWasClicked$saveImageEditor : function() {
				self.saveImageEditorPanel();
			}
		});
	}
	return this.imageEditorPanel;
}

/***************************** Image Editor delegate ***************************/

OO.Editor.ImageGallery.ImageEditorDelegate = function(editor) {
	this.editor = editor;
	In2iGui.get().addDelegate(this);
}

OO.Editor.ImageGallery.ImageEditorDelegate.prototype = {
	buttonWasClicked$cancelImageEditor : function() {
		this.editor.hideImageEditorPanel();
	}
}



/************************************ Add image delegate ***********************************/

OO.Editor.ImageGallery.AddImagePanelDelegate = function(editor) {
	this.editor = editor;
	this.upload = In2iGui.Upload.create(
		{action:'uploadImage',name:'file',parameters:[
			{name:'contentId',value:OnlineObjects.content.id}
		]}
	);
	this.upload.addDelegate(this);
	this.updatePanel();
}

OO.Editor.ImageGallery.AddImagePanelDelegate.prototype.updatePanel = function() {
	var content = N2i.create('div',null,{'width':'280px','padding':'10px'});
	content.appendChild(this.upload.getElement());
	this.editor.addImagePanel.addContent(content);
}

OO.Editor.ImageGallery.AddImagePanelDelegate.prototype.uploadDidSubmit = function() {
	this.upload.startProgress();
	this.editor.listenToUpload();
}

OO.Editor.ImageGallery.AddImagePanelDelegate.prototype.uploadChanged = function(data) {
	this.upload.setProgress(data.value);
}

OO.Editor.ImageGallery.AddImagePanelDelegate.prototype.reset = function(data) {
	this.upload.endProgress();
}



/************************************ Image ***********************************/

OO.Editor.ImageGallery.Image = function(image,index,editor) {
	this.index = index;
	this.image = image;
	this.editor = editor;
	this.style = OO.Editor.ImageGallery.getInstance().style;
	this.rebuild();
}

OO.Editor.ImageGallery.Image.prototype.calculateSize = function() {
	this.width = this.editor.imageWidth;
	this.height = this.editor.imageHeight;
	if (this.image.width/this.editor.imageWidth>this.image.height/this.editor.imageHeight) {
		this.height = Math.round(this.editor.imageWidth*(this.image.height/this.image.width));
	} else if (this.image.height/this.editor.imageHeight>this.image.width/this.editor.imageWidth) {
		this.width = Math.round(this.editor.imageHeight*(this.image.width/this.image.height));
	}
}

OO.Editor.ImageGallery.Image.prototype.setIndex = function(index) {
	this.index = index;
}

OO.Editor.ImageGallery.Image.prototype.setStyle = function(style) {
	this.style = style;
	this.frame.className = 'image image_frame '+style;
	if (this.dragger) {
		this.dragger.className = 'image image_frame '+style;
	}
}

OO.Editor.ImageGallery.Image.prototype.rebuild = function() {
	this.calculateSize();
	this.frame = this.build();
	if (this.dragger) {
		this.dragger.parentNode.removeChild(this.dragger);
		this.dragger = null;
	}
	if (this.hover) {
		this.hover.parentNode.removeChild(this.hover);
		this.hover = null;
	}
	this.buildHover();
	this.addBehavior();
}

OO.Editor.ImageGallery.Image.prototype.build = function() {
	var frame = document.createElement('div');
	frame.className = 'image image_frame '+this.style;
	frame.style.marginLeft = Math.round((this.editor.imageWidth-this.width)/2)+'px';
	frame.style.marginTop = Math.round((this.editor.imageHeight-this.height)/2)+'px';
	frame.style.cssFloat='left';
	frame.style.width=(this.width+80)+'px';
	frame.innerHTML=
		'<div class="top"><div><div></div></div></div>'+
		'<div class="middle"><div style="width:'+this.width+'px">'+
		'<img id="image-'+this.image.id+'" src="'+OnlineObjects.baseContext+'/service/image/?id='+this.image.id+'&amp;width='+this.editor.imageWidth+'&amp;height='+this.editor.imageWidth+'" width="'+this.width+'" height="'+this.height+'"/>'+
		'</div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	return frame;
}

OO.Editor.ImageGallery.Image.prototype.buildHover = function() {
	this.hover = document.createElement('div');
	this.hover.className='imagegallery_image_hover';
	this.hover.style.display='none';
	this.hover.style.marginLeft=(10+this.width)+'px';
	this.hover.style.marginTop=(10+this.height)+'px';
	this.hover.style.opacity='0';
	this.deleteButton = document.createElement('div');
	this.deleteButton.className='delete';
	this.hover.appendChild(this.deleteButton);
	this.frame.insertBefore(this.hover,this.frame.firstChild);
}

OO.Editor.ImageGallery.Image.prototype.getFrame = function() {
	return this.frame;
}

OO.Editor.ImageGallery.Image.prototype.addBehavior = function() {
	var self = this;
	this.frame.onmousedown = function(e) {
		if (!self.editor.isActive()) return;
		self.startDrag(e);
		return false;
	}
	this.frame.onmouseover = function(e) {
		if (!self.editor.isActive()) return;
		self.hover.style.display='';
		$ani(self.hover,'opacity',1,200);
	}
	this.frame.onmouseout = function(e) {
		if (!self.editor.isActive()) return;
		$ani(self.hover,'opacity',0,200,{onComplete:function() {self.hover.style.display='none'}});
	}
	this.deleteButton.onmousedown = function(e) {
		if (!self.editor.isActive()) return;
		N2i.Event.stop(e);
	}
	this.deleteButton.onclick = function(e) {
		if (!self.editor.isActive()) return;
		N2i.Event.stop(e);
		self.editor.deleteImage(self);
	}
}

OO.Editor.ImageGallery.Image.prototype.startDrag = function(e) {
	this.startLeft = N2i.Element.getLeft(this.frame);
	this.startTop = N2i.Element.getTop(this.frame);
	var event = new N2i.Event(e);
	this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.frame),top:event.mouseTop()-N2i.Element.getTop(this.frame)};
	if (!this.dragger) this.dragger = this.build();
	this.dragger.style.position='absolute';
	this.dragger.style.left=this.startLeft+'px';
	this.dragger.style.top=this.startTop+'px';
	this.dragger.style.marginTop='';
	this.dragger.style.marginLeft='';
	this.dragger.style.display='none';
	document.body.appendChild(this.dragger);
	var self = this;
	this.moveListener = function(e) {self.drag(e)};
	this.upListener = function(e) {self.endDrag(e)};
	N2i.Event.addListener(document,'mousemove',this.moveListener);
	N2i.Event.addListener(document,'mouseup',this.upListener);
	//this.drag(e);
	this.hasDragged = false;
}

OO.Editor.ImageGallery.Image.prototype.drag = function(e) {
	if (!this.hasDragged) {
		$ani(this.dragger,'opacity',1,0);
		this.dragger.style.display='';
		if (!N2i.isIE()) {
			$ani(this.frame,'opacity',.2,500);
		}
		this.editor.hideImageEditorPanel();
	}
	this.hasDragged = true;
	var event = new N2i.Event(e);
	this.dragger.style.right = 'auto';
	this.dragger.style.top = (event.mouseTop()-this.dragState.top)+'px';
	this.dragger.style.left = (event.mouseLeft()-this.dragState.left)+'px';
	var found = this.editor.imageWasDragged(event.mouseTop(),event.mouseLeft(),this.index);
	return false;
}

OO.Editor.ImageGallery.Image.prototype.endDrag = function(e) {
	var event = new N2i.Event(e);
	N2i.Event.removeListener(document,'mousemove',this.moveListener);
	N2i.Event.removeListener(document,'mouseup',this.upListener);
	var shouldReturn = this.editor.imageFinishedDragging(event,this,this.hasDragged);
	var self = this;
	$ani(this.dragger,'top',N2i.Element.getTop(this.frame)+'px',400,{ease:N2i.Animation.elastic});
	$ani(this.dragger,'left',N2i.Element.getLeft(this.frame)+'px',400,{ease:N2i.Animation.elastic});
	var ender = {onComplete:function() {
		self.dragger.style.display='none';
	}}
	if (!N2i.isIE()) {
		$ani(this.frame,'opacity',1,400);
		$ani(this.dragger,'opacity',1,200,ender);
	} else {
		window.setTimeout(function() {
		self.dragger.style.display='none';
	},200);
	}
	if (!this.hasDragged) {
		this.editor.showImageEditorPanel(this);
	}
}

OO.Editor.ImageGallery.Image.prototype.toString = function() {
	return this.image.id;
}



N2i.Event.addLoadListener(function() {
	new OO.Editor(OO.Editor.ImageGallery.getInstance());
});