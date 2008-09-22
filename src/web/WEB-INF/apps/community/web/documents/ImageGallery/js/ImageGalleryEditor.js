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
	In2iGui.get().addDelegate(this);
	In2iGui.Editor.get().addPartController('header','Overskrift',In2iGui.Editor.Header);
	In2iGui.Editor.get().addPartController('html','Tekst',In2iGui.Editor.Html);
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
		if (this.addImagesWindow) {
			this.addImagesWindow.hide();
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
		toolbar.add(In2iGui.Toolbar.Icon.create('addImage',{icon:'common/image','overlay':'new','title':'Tilføj billede'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('addImages',{icon:'common/image','overlay':'new','title':'Tilføj billeder'}));
		toolbar.addDivider();
		toolbar.add(In2iGui.Toolbar.Icon.create('changeFrame',{icon:'common/frame','title':'Skift ramme'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('increaseSize',{icon:'common/larger','title':'Større'}));
		toolbar.add(In2iGui.Toolbar.Icon.create('decreaseSize',{icon:'common/smaller','title':'Mindre'}));
	},
	click$changeFrame : function() {
		this.openFrameWindow();
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
	},
	parseImages : function(images) {
		OO.ImageGallery.getInstance().clearImages();
		this.images = [];
		for (var i=0; i < images.length; i++) {
			var image = images[i];
			var imageCtrl = new OO.Editor.ImageGallery.Image(image,i,this);
			this.images[this.images.length] = imageCtrl;
			OO.ImageGallery.getInstance().addImage(image.id);
		};
		this.tempImages = this.images.concat();
	},
	click$increaseSize : function() {
		if (this.imageWidth+20>300) return;
		this.imageWidth+=20;
		this.imageHeight+=20;
		for (var i=0; i < this.images.length; i++) {
			this.images[i].rebuild();
		};
		this.updateImages();
		ImageGalleryDocument.updateImageSize(OnlineObjects.content.id,this.imageWidth,this.imageHeight);
	},
	click$decreaseSize : function() {
		if (this.imageWidth-20<100) return;
		this.imageWidth-=20;
		this.imageHeight-=20;
		for (var i=0; i < this.images.length; i++) {
			this.images[i].rebuild();
		};
		this.updateImages();
		ImageGalleryDocument.updateImageSize(OnlineObjects.content.id,this.imageWidth,this.imageHeight);
	},
	updateImages : function(useTemp) {
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
	},
	registerCells : function() {
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
	},
	imageWasDragged : function(top,left,index) {
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
	},
	getCell : function(top,left) {
		for (var i=0; i < this.cellDims.length; i++) {
			var cell = this.cellDims[i];
			if ((left>=cell.left && left<=cell.right && top>=cell.top && top<=cell.bottom) ) {
				return i;
			}
		}
		return null;
	},
	imageFinishedDragging : function(event,image,changed) {
		this.latestHilitedCell=null;
		if (changed) {
			this.saveImagePositions();
		}
	},
	changeImageOrder : function(currentIndex,newIndex,interchange,useTemp) {
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
	},
	moveItemInArray : function(currentIndex,newIndex,array) {
		var removed = array.splice(currentIndex, 1);
		array.splice(newIndex, 0, removed[0]);
	},
	
	// Upload
	
	uploadFailed : function() {
		this.addImagePanelDelegate.reset();
		In2iGui.get().showAlert({emotion:'gasp',title:'Det lykkedes ikke at tilføje billedet.',text:'Det kan skyldes at filen ikke er et understøttet format?'})
	},
	listenToUpload : function() {
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
			AppCommunity.getProcess('imageUpload',delegate);
		},500);
	},
	click$addImage : function() {
		if (!this.addImagePanel) {
			this.addImagePanel = In2iGui.Window.create(null,{title:'Tilføj billede',variant:'dark',padding:5});
			this.addImagePanelDelegate = new OO.Editor.ImageGallery.AddImagePanelDelegate(this);
			this.addImagePanel.add(this.addImagePanelDelegate.getUploader());
		}
		this.addImagePanel.show();
	},
	
	// Multi upload
	click$addImages : function() {
		if (!this.addImagesWindow) {
			var w = In2iGui.Window.create(null,{title:'Tilføj billede',variant:'dark',padding:5});
			var u = In2iGui.MultiUpload.create('multiUpload',{url:'uploadImage',parameters:{'contentId':OnlineObjects.content.id}});
			w.add(u);
			this.addImagesWindow = w;
		}
		this.addImagesWindow.show();
	},
	uploadDidComplete$multiUpload : function() {
		this.refreshImages();
	},
	
	
	// Style
	openFrameWindow : function() {
		if (!this.styleWindow) {
			this.styleWindow = In2iGui.Window.create(null,{title:'Skift ramme',variant:'dark'});
			var p = In2iGui.Picker.create('framePicker',{title:'Vælg billedernes ramme',itemWidth:90,itemHeight:90,shadow:false});
			p.setObjects([
				{value:'elegant',title:'Elegant',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/elegant/thumbnail.png'},
				{value:'paper',title:'Papir',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/paper/thumbnail.png'},
				{value:'simple',title:'Simpel',image:OnlineObjects.appContext+'/documents/ImageGallery/frames/simple/thumbnail.png'}
			]);
			p.setValue(this.style);
			this.styleWindow.add(p);
		}
		this.styleWindow.show();
	},
	selectionChanged$framePicker : function(value) {
		OO.ImageGallery.getInstance().style = value;
		for (var i=0; i < this.images.length; i++) {
			this.images[i].setStyle(value);
		};
		ImageGalleryDocument.changeFrameStyle(OnlineObjects.content.id,value);
	},
	ok$confirmDeleteImage : function() {
		var self = this;
		ImageGalleryDocument.deleteImage(this.imageToDelete.image.id,OnlineObjects.content.id,
			function(data) { 
				self.refreshImages();
			}
		);
		this.hideImageEditorPanel();
	},
	deleteImage : function(image) {
		this.imageToDelete = image;
		In2iGui.get().confirm('confirmDeleteImage',{
			title:'Er du sikker på at du vil slette billedet?',
			emotion:'gasp',
			ok:'Ja, slet billedet',
			cancel:'Nej, jeg fortryder',
			highlighted:'ok',
			modal:true
		});
	},
	showImageEditorPanel : function(photo) {
		this.latestEditedPhoto = photo;
		var panel = this.getImageEditorPanel();
		In2iGui.get('imageEditorTitle').setValue(photo.image.name || '');
		var desc = OO.Editor.getEntityProperty(photo.image,'item.enity.image.description');
		In2iGui.get('imageEditorDescription').setValue(desc || '');
		var tags = OO.Editor.getEntityProperties(photo.image,'common.tag');
		In2iGui.get('imageEditorTags').setValue(tags);
		panel.position(photo.frame.getElementsByTagName('img')[0]);
		panel.show();
	},
	hideImageEditorPanel : function() {
		if (this.imageEditorPanel) this.imageEditorPanel.hide();
	},
	saveImageEditorPanel : function() {
		var title = In2iGui.get('imageEditorTitle').getValue();
		var desc = In2iGui.get('imageEditorDescription').getValue();
		var tags = In2iGui.get('imageEditorTags').getValue();
		var photo = this.latestEditedPhoto;
		var self = this;

		ImageGalleryDocument.updateImage(photo.image.id,title,desc,tags,
			function(newImage) {
				photo.image = newImage;
				self.hideImageEditorPanel();
			}
		);
	},
	getImageEditorPanel : function() {
		if (!this.imageEditorPanel) {
			var panel = In2iGui.BoundPanel.create({top:'50px',left:'50px'});
			var formula = In2iGui.Formula.create();
			panel.add(formula);
			var group = In2iGui.Formula.Group.create();
			formula.add(group);

			var title = In2iGui.Formula.Text.create('imageEditorTitle',{label:'Titel'});
			group.add(title);
			var desc = In2iGui.Formula.Text.create('imageEditorDescription',{label:'Beskrivelse',lines:4});
			group.add(desc);
			var tags = In2iGui.Formula.Tokens.create('imageEditorTags',{label:'Nøgleord'});
			group.add(tags);

			panel.add(N2i.create('div',null,{height:'5px'}));

			var save = In2iGui.Button.create('saveImageEditor',{text:'Gem',highlighted:true});
			panel.add(save);
			var cancel = In2iGui.Button.create('cancelImageEditor',{text:'Annuller'});
			panel.add(cancel);
			this.imageEditorPanel = panel;
			var self = this;
			In2iGui.get().addDelegate({
				click$cancelImageEditor : function() {
					self.hideImageEditorPanel();
				},
				click$saveImageEditor : function() {
					self.saveImageEditorPanel();
				}
			});
		}
		return this.imageEditorPanel;
	}
}



/************************************ Add image delegate ***********************************/

OO.Editor.ImageGallery.AddImagePanelDelegate = function(editor) {
	this.editor = editor;
	this.upload = In2iGui.Upload.create(null,
		{action:'uploadImage',name:'file',parameters:[
			{name:'contentId',value:OnlineObjects.content.id}
		]}
	);
	this.upload.addDelegate(this);
}


OO.Editor.ImageGallery.AddImagePanelDelegate.prototype = {
	getUploader : function() {
		return this.upload;
	},
	uploadDidSubmit : function() {
		this.upload.startProgress();
		this.editor.listenToUpload();
	},
	uploadChanged : function(data) {
		this.upload.setProgress(data.value);
	},
	reset : function(data) {
		this.upload.endProgress();
	}
}



/************************************ Image ***********************************/

OO.Editor.ImageGallery.Image = function(image,index,editor) {
	this.index = index;
	this.image = image;
	this.editor = editor;
	this.img = null;
	this.style = OO.Editor.ImageGallery.getInstance().style;
	this.rebuild();
}

OO.Editor.ImageGallery.Image.prototype = {
	calculateSize : function() {
		this.width = this.editor.imageWidth;
		this.height = this.editor.imageHeight;
		if (this.image.width/this.editor.imageWidth>this.image.height/this.editor.imageHeight) {
			this.height = Math.round(this.editor.imageWidth*(this.image.height/this.image.width));
		} else if (this.image.height/this.editor.imageHeight>this.image.width/this.editor.imageWidth) {
			this.width = Math.round(this.editor.imageHeight*(this.image.width/this.image.height));
		}
	},
	setIndex : function(index) {
		this.index = index;
	},
	setStyle : function(style) {
		this.style = style;
		this.frame.className = 'image image_frame '+style;
		if (this.dragger) {
			this.dragger.className = 'image image_frame '+style;
		}
	},
	rebuild : function() {
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
		this.img = this.frame.select('img')[0];
		this.buildHover();
		this.addBehavior();
	},
	build : function() {
		var frame = new Element('div');
		frame.className = 'image image_frame '+this.style;
		frame.style.marginLeft = Math.round((this.editor.imageWidth-this.width)/2)+'px';
		frame.style.marginTop = Math.round((this.editor.imageHeight-this.height)/2)+'px';
		frame.style.cssFloat='left';
		frame.style.width=(this.width+80)+'px';
		frame.innerHTML=
			'<div class="top"><div><div></div></div></div>'+
			'<div class="middle"><div style="width:'+this.width+'px; height:'+this.height+'px">'+
			'<img id="image-'+this.image.id+'" src="'+OnlineObjects.baseContext+'/service/image/?id='+this.image.id+'&amp;width='+this.editor.imageWidth+'&amp;height='+this.editor.imageWidth+'" width="'+this.width+'" height="'+this.height+'"/>'+
			'</div></div>'+
			'<div class="bottom"><div><div></div></div></div>';
		return frame;
	},
	buildHover : function() {
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
	},
	getFrame : function() {
		return this.frame;
	},
	addBehavior : function() {
		var self = this;
		/*
		this.frame.onmousedown = function(e) {
			if (!self.editor.isActive()) return;
			self.startDrag(e);
			return false;
		}*/
		this.frame.observe('mousedown',function(e) {
			if (!self.editor.isActive()) return;
			self.startDrag(e);
			e.stop();
		});
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
		this.img.ondragstart = function() {return false}
	},
	startDrag : function(e) {
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
		document.body.onselectstart = function () { return false; };
		this.moveListener = function(e) {self.drag(e)};
		this.upListener = function(e) {self.endDrag(e)};
		N2i.Event.addListener(document,'mousemove',this.moveListener);
		N2i.Event.addListener(document,'mouseup',this.upListener);
		//this.drag(e);
		this.hasDragged = false;
	},
	drag : function(e) {
		if (!this.hasDragged) {
			if (!N2i.isIE()) {
				$ani(this.dragger,'opacity',1,0);
			}
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
	},
	endDrag : function(e) {
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
		document.body.onselectstart = null;
	},
	toString : function() {
		return this.image.id;
	}
}

document.observe('dom:loaded',function() {
	new OO.Editor(OO.Editor.ImageGallery.getInstance());
});