OO.Editor.ImageGallery = function() {
	this.imageSize=150;
	this.columns = 3;
	this.images = [];
	this.tempImages = [];
	this.cells = [];
	this.cellDims = [];
	this.grid = $class('grid')[0];
	var self = this;
	this.toolbarItems = [
		{title:'Tilføj billede',action:function() {self.openAddImageWindow()},icon:'addimage'},
		{title:'Skift ramme',action:function() {self.openStyleWindow()},icon:'style'}
	];
}

OO.Editor.ImageGallery.prototype.activate = function() {
	if (!this.styleWindow) {
		this.refreshImages();
	}
}

OO.Editor.ImageGallery.prototype.deactivate = function() {
	if (this.addImageWindow) {
		this.addImageWindow.hide();
	}
	if (this.styleWindow) {
		this.styleWindow.hide();
	}
	OO.ImageGallery.getInstance().rebuild();
}

OO.Editor.ImageGallery.prototype.isActive = function() {
	return this.editor.active;
}

OO.Editor.ImageGallery.prototype.buildToolBar = function() {
	this.toolbar = document.createElement('div');
	this.toolbar.className = 'editor_toolbar';
	document.body.appendChild(this.toolbar);
}

OO.Editor.ImageGallery.prototype.setEditor = function(editor) {
	this.editor = editor;
}


OO.Editor.ImageGallery.prototype.saveImagePositions = function() {
	OO.ImageGallery.getInstance().clearImages();
	var ids = [];
	for (var i=0; i < this.images.length; i++) {
		ids[ids.length]=this.images[i].image.id;
		OO.ImageGallery.getInstance().addImage(this.images[i].image.id);
	};
	var self = this;
	var delegate = {
		callback:function(data) {},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	ImageGalleryDocument.updateImagePsitions(info.content.id,ids,delegate);
}


OO.Editor.ImageGallery.prototype.refreshImages = function() {
	var self = this;
	var delegate = {
		callback:function(data) {
			self.parseImages(data);
			self.updateImages()
		},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	ImageGalleryDocument.listImages(info.content.id,delegate);
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

OO.Editor.ImageGallery.prototype.changeStyle = function(style) {
	OO.ImageGallery.getInstance().style = style;
	for (var i=0; i < this.images.length; i++) {
		this.images[i].setStyle(style);
	};
	ImageGalleryDocument.changeFrameStyle(info.content.id,style);
}

OO.Editor.ImageGallery.prototype.updateImages = function(useTemp) {
	var images = useTemp ? this.tempImages : this.images;
 	this.grid.innerHTML='';
	this.grid.className='grid grid_'+this.columns;
	this.grid.style.width=((this.imageSize+80)*this.columns)+'px';
	this.grid.style.marginLeft=((this.imageSize+80)*this.columns/2*-1)+'px';
	var row;
	for (var i=0; i < images.length; i++) {
		if (i % this.columns == 0) {
			row = document.createElement('div');
			this.grid.appendChild(row);
		}
		var image = images[i];
		var cell = document.createElement('div');
		cell.className = 'cell';
		cell.style.width = (this.imageSize+80)+'px';
		cell.style.height = (this.imageSize+80)+'px';
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
		this.cellDims[this.cellDims.length] = {left: N2i.Element.getLeft(cell),right: N2i.Element.getLeft(cell)+N2i.Element.getWidth(cell),top: N2i.Element.getTop(cell),bottom: N2i.Element.getTop(cell)+N2i.Element.getHeight(cell)};
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

OO.Editor.ImageGallery.prototype.imageFinishedDragging = function(event,image) {
	if (this.latestHilitedCell!=null) {
		N2i.Element.removeClassName(this.cells[this.latestHilitedCell],'hover');
		this.latestHilitedCell=null;
	}
	this.saveImagePositions();
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

OO.Editor.ImageGallery.prototype.startUploadListener = function() {
	this.listenToUpload();
}

OO.Editor.ImageGallery.prototype.uploadFailed = function() {
	this.addImageWindowDelegate.reset();
	alert('Upload failed!');
}

OO.Editor.ImageGallery.prototype.listenToUpload = function() {
	var self = this;
	var delegate = {
		callback:function(data) { 
			if (data==null) return;
				if (data.completed==false) {
					self.addImageWindowDelegate.uploadChanged(data);
					if (data.error) {
						self.uploadFailed(data);
					} else {
						self.listenToUpload();
					}
				} else {
					self.refreshImages();
					self.addImageWindowDelegate.reset();
				}
			},
	  	errorHandler:function(errorString, exception) { alert(errorString); }
	};
	window.setTimeout(
		function() {
			CommunityTool.getProcess('imageUpload',delegate);
		}
		,500
	);
}


OO.Editor.ImageGallery.prototype.openStyleWindow = function() {
	if (!this.styleWindow) {
		this.styleWindow = new N2i.Window(new OO.Editor.ImageGallery.StyleWindowDelegate(this));
	}
	this.styleWindow.show();
}


OO.Editor.ImageGallery.prototype.openAddImageWindow = function() {
	if (!this.addImageWindow) {
		this.addImageWindowDelegate = new OO.Editor.ImageGallery.AddImageWindowDelegate(this);
		this.addImageWindow = new N2i.Window(this.addImageWindowDelegate);
	}
	this.addImageWindow.show();
}

OO.Editor.ImageGallery.prototype.deleteImage = function(image) {
	if (confirm('Er du sikker på at du vil slette billedet?')) {
		var self = this;
		var delegate = {
			callback:function(data) { 
				self.refreshImages();
			},
	  		errorHandler:function(errorString, exception) { N2i.log(exception);alert('adsa'+errorString); }
		};
	}
	ImageGalleryDocument.deleteImage(image.image.id,info.content.id,delegate);
}

/***************************** Style window delegate ***************************/

OO.Editor.ImageGallery.StyleWindowDelegate = function(editor) {
	this.editor = editor;
	this.position = {top : 100,left: 200};
	this.title='Skift ramme';
	this.styles = [
		{key:'elegant',title:'Elegant',className:'elegant'},
		{key:'paper',title:'Papir',className:'paper'},
		{key:'simple',title:'Simpel',className:'simple'}
	];
	this.chooser = new OO.Editor.Chooser({items:this.styles},this);
}

OO.Editor.ImageGallery.StyleWindowDelegate.prototype.getContent = function() {
	this.body = document.createElement('div');
	this.body.style.width='355px';
	this.body.appendChild(this.chooser.getElement());
	return this.body;
}

OO.Editor.ImageGallery.StyleWindowDelegate.prototype.chooserItemWasSelected = function(info) {
	this.editor.changeStyle(info.key);
}



/************************************ Add image delegate ***********************************/


OO.Editor.ImageGallery.AddImageWindowDelegate = function(editor) {
	this.editor = editor;
	this.position = {left: 100, top: 100};
	this.title='Tilføjelse af billede';
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.windowWillShow = function() {
	this.progress.hide();
	this.form.style.display='';
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.reset = function() {
	this.progress.hide();
	this.form.style.display='';
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.getContent = function() {
	this.body = document.createElement('div');
	this.body.style.width='300px';
	this.body.style.height='60px';
	this.body.style.paddingLeft='5px';
	this.body.style.paddingRight='5px';
	this.body.style.paddingTop='5px';
	var html = '<form action="uploadImage" method="POST" enctype="multipart/form-data" target="upload">'+
	'<input type="hidden" name="contentId" value="'+info.content.id+'"/>'+
	'<input type="file" name="file"/>'+
	'</form>'+
	'<iframe name="upload" style="display: none;"/>'
	this.body.innerHTML=html;
	var self = this;
	this.form = this.body.getElementsByTagName('form')[0];
	this.chooser = this.body.getElementsByTagName('input')[1];
	this.chooser = this.body.getElementsByTagName('input')[1];
	this.chooser.onchange=function() {self.startUpload()};
	var self = this;
	this.progress = new OO.Community.Window.Progress();
	this.progress.hide();
	this.body.appendChild(this.progress.getBase());
	this.body.appendChild(OO.Community.Window.buildSpace(10));
	this.cancel = N2i.Window.buildButton('Luk',{buttonWasClicked:function() {self.cancelWasClicked()}});
	this.body.appendChild(this.cancel);
	return this.body;
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.cancelWasClicked = function() {
	this.form.reset();
	this.editor.addImageWindow.hide();
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.startUpload = function() {
	this.editor.startUploadListener();
	this.form.submit();
	this.form.reset();
	this.form.style.display = 'none';
	this.progress.reset();
	this.progress.show();
}

OO.Editor.ImageGallery.AddImageWindowDelegate.prototype.uploadChanged = function(data) {
	this.progress.setValue(data.value);
}



/************************************ Image ***********************************/

OO.Editor.ImageGallery.Image = function(image,index,editor) {
	this.index = index;
	this.image = image;
	this.editor = editor;
	
	this.width = this.editor.imageSize;
	this.height = this.editor.imageSize;
	if (this.image.width>this.image.height) {
		this.height = Math.round(this.editor.imageSize*(this.image.height/this.image.width));
	} else if (this.image.height>this.image.width) {
		this.width = Math.round(this.editor.imageSize*(this.image.width/this.image.height));
	}
	this.style = OO.ImageGallery.getInstance().style;
	this.frame = this.build();
	this.buildHover();
	this.addBehavior();
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

OO.Editor.ImageGallery.Image.prototype.build = function() {
	var frame = document.createElement('div');
	frame.className = 'image image_frame '+this.style;
	frame.style.marginLeft = Math.round((this.editor.imageSize-this.width)/2)+'px';
	frame.style.marginTop = Math.round((this.editor.imageSize-this.height)/2)+'px';
	frame.style.cssFloat='left';
	frame.innerHTML=
		'<div class="top"><div><div></div></div></div>'+
		'<div class="middle"><div>'+
		'<img id="image-'+this.image.id+'" src="../../../service/image/?id='+this.image.id+'&amp;thumbnail='+this.editor.imageSize+'" width="'+this.width+'" height="'+this.height+'"/>'+
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
	document.body.appendChild(this.dragger);
	var self = this;
	this.moveListener = function(e) {self.drag(e)};
	this.upListener = function(e) {self.endDrag(e)};
	N2i.Event.addListener(document,'mousemove',this.moveListener);
	N2i.Event.addListener(document,'mouseup',this.upListener);
	$ani(this.dragger,'opacity',1,0);
	this.dragger.style.display='';
	$ani(this.frame,'opacity',.2,500);
	this.drag(e);
}

OO.Editor.ImageGallery.Image.prototype.drag = function(e) {
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
	var shouldReturn = this.editor.imageFinishedDragging(event,this);
	var self = this;
	$ani(this.dragger,'top',N2i.Element.getTop(this.frame)+'px',200);
	$ani(this.dragger,'left',N2i.Element.getLeft(this.frame)+'px',200);
	$ani(this.frame,'opacity',1,400);
	var ender = {onComplete:function() {
		N2i.log(self.dragger);
		self.dragger.style.display='none';
	}}
	$ani(this.dragger,'opacity',1,200,ender);
}

OO.Editor.ImageGallery.Image.prototype.toString = function() {
	return this.image.id;
}



N2i.Event.addLoadListener(function() {
	new OO.Editor(new OO.Editor.ImageGallery());
});