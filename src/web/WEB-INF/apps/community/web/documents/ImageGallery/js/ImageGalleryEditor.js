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
	this.initialUpload = hui.location.hasHash('firstRun');
	var self = this;
	hui.ui.listen(this);
	hui.ui.Editor.get().addPartController('header','Overskrift',hui.ui.Editor.Header);
	hui.ui.Editor.get().addPartController('html','Tekst',hui.ui.Editor.Html);
}

OO.Editor.ImageGallery.getInstance = function() {
	if (!OO.Editor.ImageGallery.instance) {
		OO.Editor.ImageGallery.instance = new OO.Editor.ImageGallery();
	}
	return OO.Editor.ImageGallery.instance;
}

OO.Editor.ImageGallery.prototype = {
	activate : function() {
		this.grid = hui.get.firstByClass(document.body,'grid');
		if (!this.imagesLoaded) {
			this.refreshImages();
			if (this.initialUpload) {
				this.$click$addImages();
				hui.location.clearHash();
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
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'addImages',icon:'common/image','overlay':'new','title':'Tilføj billeder'}));
		toolbar.addDivider();
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'changeFrame',icon:'common/frame','title':'Skift ramme'}));
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'increaseSize',icon:'common/larger','title':'Større'}));
		toolbar.add(hui.ui.Toolbar.Icon.create({name:'decreaseSize',icon:'common/smaller','title':'Mindre'}));
	},
	$click$changeFrame : function() {
		this.openFrameWindow();
	},
	setEditor : function(editor) {
		this.editor = editor;
	},
	saveImagePositions : function() {
		var ig = OO.ImageGallery.getInstance();
		ig.clearImages();
		var ids = [];
		hui.each(this.images,function(img) {
			ids.push(img.image.id);
			ig.addImage(img.image.id);			
		});
		ImageGalleryDocument.updateImagePositions(OnlineObjects.content.id,ids);
	},
	refreshImages : function() {
		this.busy=true;
		hui.ui.showMessage('Indlæser billeder...');
		ImageGalleryDocument.listImages(OnlineObjects.content.id,
			function(data) {
				this.parseImages(data);
				this.updateImages();
				this.imagesLoaded = true;
				hui.ui.hideMessage();
				this.busy=false;
			}.bind(this)
		);
	},
	parseImages : function(images) {
		OO.ImageGallery.getInstance().clearImages();
		this.images = [];
		hui.each(images,function(image,i) {
			var imageCtrl = new OO.Editor.ImageGallery.Image(image,i,this);
			this.images.push(imageCtrl);
			OO.ImageGallery.getInstance().addImage(image.id);			
		}.bind(this));
		this.tempImages = this.images.concat();
	},
	$click$increaseSize : function() {
		if (this.imageWidth+20>300) return;
		this.imageWidth+=20;
		this.imageHeight+=20;
		this.rebuildSize();
	},
	$click$decreaseSize : function() {
		if (this.imageWidth-20<100) return;
		this.imageWidth-=20;
		this.imageHeight-=20;
		this.rebuildSize();
	},
	rebuildSize : function() {
		hui.each(this.images,function(image) {
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
		hui.style.set(this.grid,{
			width:((this.imageWidth+80)*this.columns)+'px',
			marginLeft:((this.imageWidth+80)*this.columns/2*-1)+'px'
		});
		var row;
		hui.each(this.images,function(img,i) {
			if (i % this.columns == 0) {
				row = hui.build('div',{parent:this.grid});
			}
			var cell = hui.build('div',{'class':'cell'});
			hui.style.set(cell,{width:(this.imageWidth+80)+'px',height:(this.imageHeight+80)+'px'});
			cell.appendChild(img.frame);
			row.appendChild(cell);			
		}.bind(this))
		this.registerCells();
	},
	registerCells : function() {
		this.cells = hui.get.byClass(this.grid,'cell');
		this.cellDims = [];
		hui.each(this.cells,function(cell) {
			var pos = hui.position.get(cell);
			this.cellDims.push({
				left: pos.left,
				right: pos.left+cell.clientWidth,
				top: pos.top,
				bottom: pos.top+cell.clientHeight
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
	$click$addImages : function() {
		if (!this.addImagesPanel) {
			var buttons = hui.ui.Buttons.create({top: 10,align:'center'});
			this.cancelUploadButton = hui.ui.Button.create({name:'cancelAddImages',title:'Afslut'});
			buttons.add(this.cancelUploadButton);
			var chooser = hui.ui.Button.create({title:'Vælg billeder...',highlighted:true});
			buttons.add(chooser);
			var up = this.uploader = hui.ui.Upload.create({
				name:'upload',
				widget:chooser,
				url:'uploadImage',
				maxSize:5120,
				types:'*.jpg;*.jpeg;*.gif;*.png',
				parameters:{'contentId':OnlineObjects.content.id},
				placeholder:{title:'Vælg billeder på din computer',text:'Du kan vælge en eller flere billedfiler på din lokale computer...'}
			});
			var box = hui.ui.Box.create({width:400,padding:10,absolute:true,modal:true});
			box.add(up);
			box.add(buttons);
			box.addToDocument();
			this.addImagesPanel = box;
		}
		this.addImagesPanel.show();
	},
	$click$cancelAddImages : function() {
		this.uploader.clear();
		this.addImagesPanel.hide();
		this.initialUpload = false;
	},
	$uploadDidStartQueue$upload : function() {
		this.cancelUploadButton.setEnabled(false);
	},
	$uploadDidCompleteQueue$upload : function() {
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
			this.styleWindow = hui.ui.Window.create({title:'Skift ramme',variant:'dark',width:400});
			var p = hui.ui.Picker.create({name:'framePicker',title:'Vælg billedernes ramme',itemWidth:90,itemHeight:90,shadow:false});
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
	$select$framePicker : function(value) {
		OO.ImageGallery.getInstance().style = value;
		for (var i=0; i < this.images.length; i++) {
			this.images[i].setStyle(value);
		};
		ImageGalleryDocument.changeFrameStyle(OnlineObjects.content.id,value);
	},
	$ok$confirmDeleteImage : function() {
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
		hui.ui.confirm({
			name:'confirmDeleteImage',
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
		hui.ui.get('imageEditorTitle').setValue(photo.image.name || '');
		var desc = OO.Editor.getEntityProperty(photo.image,'item.enity.image.description');
		hui.ui.get('imageEditorDescription').setValue(desc || '');
		var tags = OO.Editor.getEntityProperties(photo.image,'common.tag');
		hui.ui.get('imageEditorTags').setValue(tags);
		//ui.get('imageEditorLocation').reset();
		panel.position(photo.frame.getElementsByTagName('img')[0]);
		panel.show();
	},
	hideImageEditorPanel : function() {
		if (this.imageEditorPanel) this.imageEditorPanel.hide();
	},
	getImageEditorPanel : function() {
		if (!this.imageEditorPanel) {
			var panel = hui.ui.BoundPanel.create({top:50,left:50});
			var formula = hui.ui.Formula.create();
			panel.add(formula);
			var group = formula.createGroup();

			group.add(hui.ui.TextField.create({name:'imageEditorTitle',label:'Titel'}));
			group.add(hui.ui.TextField.create({name:'imageEditorDescription',label:'Beskrivelse',lines:4}));
			group.add(hui.ui.TokenField.create({name:'imageEditorTags',label:'Nøgleord'}));
			//group.add(hui.ui.Formula.Location.create({name:'imageEditorLocation',label:'Lokation'}));
			var buttons = hui.ui.Buttons.create();
			buttons.add(hui.ui.Button.create({name:'deleteImageEditor',text:'Slet',small:true}));
			buttons.add(hui.ui.Button.create({name:'cancelImageEditor',text:'Annuller',small:true}));
			buttons.add(hui.ui.Button.create({name:'saveImageEditor',text:'Gem',highlighted:true,small:true}));
			group.add(buttons);
			this.imageEditorPanel = panel;
		}
		return this.imageEditorPanel;
	},
	$click$cancelImageEditor : function() {
		this.hideImageEditorPanel();
	},
	$click$saveImageEditor : function() {
		var title = hui.ui.get('imageEditorTitle').getValue();
		var desc = hui.ui.get('imageEditorDescription').getValue();
		var tags = hui.ui.get('imageEditorTags').getValue();
		var photo = this.latestEditedPhoto;
		var self = this;

		ImageGalleryDocument.updateImage(photo.image.id,title,desc,tags,
			function(newImage) {
				photo.image = newImage;
				self.hideImageEditorPanel();
			}
		);
	},
	$click$deleteImageEditor : function() {
		this.deleteImage(this.latestEditedPhoto);
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
		this.img = hui.get.firstByTag(this.frame,'img');
		this.addBehavior();
	},
	build : function() {
		var frame = hui.build('div',{'class':'image image_frame '+this.style});
		hui.style.set(frame,{
			marginLeft : Math.round((this.editor.imageWidth-this.width)/2)+'px',
			marginTop : Math.round((this.editor.imageHeight-this.height)/2)+'px',
			cssFloat : 'left',
			width : (this.width+80)+'px'
		})
		frame.innerHTML='<div class="top"><div><div></div></div></div>'+
			'<div class="middle"><div style="width:'+this.width+'px; height:'+this.height+'px">'+
			'<img id="image-'+this.image.id+'" src="'+OnlineObjects.baseContext+'/service/image/?id='+this.image.id+'&amp;width='+this.editor.imageWidth+'&amp;height='+this.editor.imageWidth+'" width="'+this.width+'" height="'+this.height+'"/>'+
			'</div></div>'+
			'<div class="bottom"><div><div></div></div></div>';
		return frame;
	},
	getFrame : function() {
		return this.frame;
	},
	addBehavior : function() {
		var self = this;
		hui.listen(this.frame,'mousedown',function(e) {
			if (!self.editor.isActive()) return;
			self.startDrag(e);
			hui.stop(e);
		});
		this.img.ondragstart = function() {return false}
	},
	startDrag : function(e) {
		e = hui.event(e);
		var pos = hui.position.get(this.frame);
		this.dragState = {left:e.getLeft()-pos.left,top:e.getTop()-pos.top};
		if (!this.dragger) {
			this.dragger = this.build();
		}
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
		hui.listen(document,'mousemove',this.moveListener);
		hui.listen(document,'mouseup',this.upListener);
		//this.drag(e);
		this.hasDragged = false;
	},
	drag : function(e) {
		e = hui.event(e);
		if (!this.hasDragged) {
			if (hui.browser.opacity) {
				hui.animate(this.dragger,'opacity',1,0);
			}
			this.dragger.style.display='';
			if (!hui.browser.msie) {
				hui.animate(this.frame,'opacity',.2,500);
			}
			this.editor.hideImageEditorPanel();
			this.hasDragged = true;
		}
		this.dragger.style.right = 'auto';
		this.dragger.style.top = (e.getTop()-this.dragState.top)+'px';
		this.dragger.style.left = (e.getLeft()-this.dragState.left)+'px';
		var found = this.editor.imageWasDragged(e.getTop(),e.getLeft(),this.index);
		return false;
	},
	endDrag : function(e) {
		hui.unListen(document,'mousemove',this.moveListener);
		hui.unListen(document,'mouseup',this.upListener);
		var shouldReturn = this.editor.imageFinishedDragging(e,this,this.hasDragged);
		var pos = hui.position.get(this.frame);
		var self = this;
		hui.animate(this.dragger,'top',pos.top+'px',400,{ease:hui.ease.elastic});
		hui.animate(this.dragger,'left',pos.left+'px',400,{ease:hui.ease.elastic});
		var ender = {onComplete:function() {
			self.dragger.style.display='none';
		}}
		if (hui.browser.opacity) {
			hui.animate(this.frame,'opacity',1,400);
			hui.animate(this.dragger,'opacity',1,200,ender);
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

hui.ui.onReady(function() {
	new OO.Editor(OO.Editor.ImageGallery.getInstance());
});