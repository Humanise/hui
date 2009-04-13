OO.Editor.ImageGallery = function() {
	this.imageWidth=null;
	this.imageHeight=null;
	this.style=null;
	this.columns = 3;
	this.images = [];
	this.tempImages = [];
	this.cells = [];
	this.cellDims = [];
	this.imagesLoaded = false;
	this.busy = false;
	this.initialUpload = n2i.location.getBoolean('firstRun');
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
		this.grid = $$('.grid')[0];
		if (!this.imagesLoaded) {
			this.refreshImages();
			if (this.initialUpload) {
				this.click$addImages();
			}
		}
	},
	deactivate : function() {
		if (this.addImagePanel) {
			this.addImagePanel.hide();
		}
		if (this.addImagesPanel) {
			this.addImagesPanel.hide();
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
		var ig = OO.ImageGallery.getInstance();
		ig.clearImages();
		var ids = [];
		this.images.each(function(img) {
			ids.push(img.image.id);
			ig.addImage(img.image.id);			
		});
		ImageGalleryDocument.updateImagePositions(OnlineObjects.content.id,ids);
	},
	refreshImages : function() {
		this.busy=true;
		In2iGui.showMessage('Indlæser billeder...');
		ImageGalleryDocument.listImages(OnlineObjects.content.id,
			function(data) {
				this.parseImages(data);
				this.updateImages();
				this.imagesLoaded = true;
				In2iGui.hideMessage();
				this.busy=false;
			}.bind(this)
		);
	},
	parseImages : function(images) {
		OO.ImageGallery.getInstance().clearImages();
		this.images = [];
		images.each(function(image,i) {
			var imageCtrl = new OO.Editor.ImageGallery.Image(image,i,this);
			this.images.push(imageCtrl);
			OO.ImageGallery.getInstance().addImage(image.id);			
		}.bind(this));
		this.tempImages = this.images.concat();
	},
	click$increaseSize : function() {
		if (this.imageWidth+20>300) return;
		this.imageWidth+=20;
		this.imageHeight+=20;
		this.rebuildSize();
	},
	click$decreaseSize : function() {
		if (this.imageWidth-20<100) return;
		this.imageWidth-=20;
		this.imageHeight-=20;
		this.rebuildSize();
	},
	rebuildSize : function() {
		this.images.each(function(image) {
			image.rebuild();
		});
		this.updateImages();
		ImageGalleryDocument.updateImageSize(OnlineObjects.content.id,this.imageWidth,this.imageHeight);
	},
	updateImages : function(useTemp) {
		var images = useTemp ? this.tempImages : this.images;
		//this.grid.update(); // TODO Maybe IE doesn't like this
		for (var i = this.grid.childNodes.length - 1; i >= 0; i--){
			this.grid.removeChild(this.grid.childNodes[i]);
		};
		this.grid.className='grid grid_'+this.columns;
		this.grid.setStyle(
			{width:((this.imageWidth+80)*this.columns)+'px',
			 marginLeft:((this.imageWidth+80)*this.columns/2*-1)+'px'});
		var row;
		this.images.each(function(img,i) {
			if (i % this.columns == 0) {
				row = new Element('div');
				this.grid.appendChild(row);
			}
			var cell = new Element('div',{'class':'cell'});
			cell.setStyle({width:(this.imageWidth+80)+'px',height:(this.imageHeight+80)+'px'});
			cell.insert(img.frame);
			row.insert(cell);			
		}.bind(this))
		this.registerCells();
	},
	registerCells : function() {
		this.cells = this.grid.select('.cell');
		this.cellDims = [];
		this.cells.each(function(cell) {
			var pos = cell.cumulativeOffset();
			this.cellDims.push({
				left: pos.left,
				right: pos.left+cell.getWidth(),
				top: pos.top,
				bottom: pos.top+cell.getHeight()
			});
		}.bind(this));
	},
	imageWasDragged : function(top,left,index) {
		var found = false;
		for (var i = this.cellDims.length - 1; i >= 0; i--){
			var cell = this.cellDims[i];
			if (i!=index && left>=cell.left && left<=cell.right && top>=cell.top && top<=cell.bottom) {
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
		for (var i = this.cellDims.length - 1; i >= 0; i--){
			var cell = this.cellDims[i];
			if ((left>=cell.left && left<=cell.right && top>=cell.top && top<=cell.bottom) ) {
				return i;
			}
		};
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
	
	// Multi upload
	click$addImages : function() {
		if (!this.addImagesPanel) {
			//var w = In2iGui.Window.create(null,{title:'Tilføj billede',variant:'dark',padding:5});
			var u = this.uploader = In2iGui.Upload.create({name:'upload',url:'uploadImage',parameters:{'contentId':OnlineObjects.content.id}});
			//w.add(u);
			var box = In2iGui.Box.create({title:'Tilføj billeder',width:400,padding:10,absolute:true,modal:true});
			box.add('<div class="in2igui_text"><h1>Vælg billeder på din computer</h1><p>Du kan vælge en eller flere billedfiler på din lokale computer...</p></div>');
			box.add(u);
			var buttons = In2iGui.Buttons.create({top: 10});
			var upload = In2iGui.Button.create({title:'Vælg billeder...',highlighted:true});
			u.setButton(upload);
			buttons.add(upload);
			this.cancelUploadButton = In2iGui.Button.create({name:'cancelAddImages',title:'Afslut'});
			buttons.add(this.cancelUploadButton);
			box.add(buttons);
			box.addToDocument();
			this.addImagesPanel = box;
		}
		this.addImagesPanel.show();
	},
	click$cancelAddImages : function() {
		this.uploader.clear();
		this.addImagesPanel.hide();
		this.initialUpload = false;
	},
	uploadDidStartQueue$upload : function() {
		this.cancelUploadButton.setEnabled(false);
	},
	uploadDidCompleteQueue$upload : function() {
		this.refreshImages();
		if (this.initialUpload) {
			this.uploader.clear();
			this.addImagesPanel.hide();
			this.initialUpload = false;
		}
		this.cancelUploadButton.setEnabled(true);
	},
	
	
	// Style
	openFrameWindow : function() {
		if (!this.styleWindow) {
			this.styleWindow = In2iGui.Window.create({title:'Skift ramme',variant:'dark',width:400});
			var p = In2iGui.Picker.create({name:'framePicker',title:'Vælg billedernes ramme',itemWidth:90,itemHeight:90,shadow:false});
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
			var group = formula.createGroup();

			group.add(In2iGui.Formula.Text.create({name:'imageEditorTitle',label:'Titel'}));
			group.add(In2iGui.Formula.Text.create({name:'imageEditorDescription',label:'Beskrivelse',lines:4}));
			group.add(In2iGui.Formula.Tokens.create({name:'imageEditorTags',label:'Nøgleord'}));
			var buttons = In2iGui.Buttons.create();
			buttons.add(In2iGui.Button.create({name:'deleteImageEditor',text:'Slet'}));
			buttons.add(In2iGui.Button.create({name:'cancelImageEditor',text:'Annuller'}));
			buttons.add(In2iGui.Button.create({name:'saveImageEditor',text:'Gem',highlighted:true}));
			group.add(buttons);
			this.imageEditorPanel = panel;
			var self = this;
			In2iGui.get().addDelegate({
				click$cancelImageEditor : function() {
					self.hideImageEditorPanel();
				},
				click$saveImageEditor : function() {
					self.saveImageEditorPanel();
				},
				click$deleteImageEditor : function() {
					self.deleteImage(self.latestEditedPhoto);
				}
			});
		}
		return this.imageEditorPanel;
	}
}



/************************************ Image ***********************************/

OO.Editor.ImageGallery.Image = function(image,index,editor) {
	this.index = index;
	this.image = image;
	this.editor = editor;
	this.img = null;
	this.style = editor.style;
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
		this.img = this.frame.select('img')[0];
		this.addBehavior();
	},
	build : function() {
		var frame = new Element('div',{'class':'image image_frame '+this.style});
		frame.setStyle({
			marginLeft : Math.round((this.editor.imageWidth-this.width)/2)+'px',
			marginTop : Math.round((this.editor.imageHeight-this.height)/2)+'px',
			cssFloat : 'left',
			width : (this.width+80)+'px'
		})
		frame.update(
			'<div class="top"><div><div></div></div></div>'+
			'<div class="middle"><div style="width:'+this.width+'px; height:'+this.height+'px">'+
			'<img id="image-'+this.image.id+'" src="'+OnlineObjects.baseContext+'/service/image/?id='+this.image.id+'&amp;width='+this.editor.imageWidth+'&amp;height='+this.editor.imageWidth+'" width="'+this.width+'" height="'+this.height+'"/>'+
			'</div></div>'+
			'<div class="bottom"><div><div></div></div></div>');
		return frame;
	},
	getFrame : function() {
		return this.frame;
	},
	addBehavior : function() {
		var self = this;
		this.frame.observe('mousedown',function(e) {
			if (!self.editor.isActive()) return;
			self.startDrag(e);
			e.stop();
		});
		this.img.ondragstart = function() {return false}
	},
	startDrag : function(e) {
		var pos = this.frame.cumulativeOffset();
		this.dragState = {left:e.pointerX()-pos.left,top:e.pointerY()-pos.top};
		if (!this.dragger) this.dragger = this.build();
		this.dragger.style.position='absolute';
		this.dragger.style.left=pos.left+'px';
		this.dragger.style.top=pos.top+'px';
		this.dragger.style.marginTop='';
		this.dragger.style.marginLeft='';
		this.dragger.style.display='none';
		document.body.appendChild(this.dragger);
		var self = this;
		document.body.onselectstart = function () { return false; };
		this.moveListener = function(e) {self.drag(e)};
		this.upListener = function(e) {self.endDrag(e)};
		Event.observe(document,'mousemove',this.moveListener);
		Event.observe(document,'mouseup',this.upListener);
		//this.drag(e);
		this.hasDragged = false;
	},
	drag : function(e) {
		if (!this.hasDragged) {
			if (!n2i.browser.msie) {
				n2i.animate(this.dragger,'opacity',1,0);
			}
			this.dragger.style.display='';
			if (!n2i.browser.msie) {
				n2i.animate(this.frame,'opacity',.2,500);
			}
			this.editor.hideImageEditorPanel();
			this.hasDragged = true;
		}
		this.dragger.style.right = 'auto';
		this.dragger.style.top = (e.pointerY()-this.dragState.top)+'px';
		this.dragger.style.left = (e.pointerX()-this.dragState.left)+'px';
		var found = this.editor.imageWasDragged(e.pointerY(),e.pointerX(),this.index);
		return false;
	},
	endDrag : function(e) {
		Event.stopObserving(document,'mousemove',this.moveListener);
		Event.stopObserving(document,'mouseup',this.upListener);
		var shouldReturn = this.editor.imageFinishedDragging(e,this,this.hasDragged);
		var pos = this.frame.cumulativeOffset();
		var self = this;
		n2i.animate(this.dragger,'top',pos.top+'px',400,{ease:n2i.ease.elastic});
		n2i.animate(this.dragger,'left',pos.left+'px',400,{ease:n2i.ease.elastic});
		var ender = {onComplete:function() {
			self.dragger.style.display='none';
		}}
		if (!n2i.browser.msie) {
			n2i.animate(this.frame,'opacity',1,400);
			n2i.animate(this.dragger,'opacity',1,200,ender);
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

In2iGui.onDomReady(function() {
	new OO.Editor(OO.Editor.ImageGallery.getInstance());
});