In2iGui.ImageViewer = function(element,name,options) {
	this.options = {maxWidth:800,maxHeight:600};
	N2i.override(this.options,options);
	this.element = $id(element);
	this.viewer = $firstClass('in2igui_imageviewer_viewer',this.element);
	this.innerViewer = $firstClass('in2igui_imageviewer_inner_viewer',this.element);
	this.status = $firstClass('in2igui_imageviewer_status',this.element);
	this.previousControl = $firstClass('in2igui_imageviewer_previous',this.element);
	this.controller = $firstClass('in2igui_imageviewer_controller',this.element);
	this.nextControl = $firstClass('in2igui_imageviewer_next',this.element);
	this.playControl = $firstClass('in2igui_imageviewer_play',this.element);
	this.dirty = false;
	this.width = 600;
	this.height = 460;
	this.index = 0;
	this.playing=false;
	this.name = name;
	this.images = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.ImageViewer.create = function(name,opts) {
	var options = {name:null,top:'0px',left:'0px'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_imageviewer'},
		{'display':'none'}
	);
	element.innerHTML = '<div class="in2igui_imageviewer_viewer"><div class="in2igui_imageviewer_inner_viewer"></div></div>'+
	'<div class="in2igui_imageviewer_status"></div>'+
	'<div class="in2igui_imageviewer_controller">'+
	'<a class="in2igui_imageviewer_previous"></a>'+
	'<a class="in2igui_imageviewer_play"></a>'+
	'<a class="in2igui_imageviewer_next"></a>'+
	'</div>';
	document.body.appendChild(element);
	return new In2iGui.ImageViewer(element,name,options);
}

In2iGui.ImageViewer.prototype = {
	addBehavior : function() {
		var self = this;
		this.nextControl.onclick = function() {
			self.next(true);
		}
		this.previousControl.onclick = function() {
			self.previous(true);
		}
		this.playControl.onclick = function() {
			self.playOrPause();
		}
		this.viewer.onclick = function() {
			self.hide();
		}
		this.timer = function() {
			self.next(false);
		}
		this.keyListener = function(e) {
			var event = new N2i.Event(e);
			if (event.isRightKey()) {
				self.next(true);
			} else if (event.isLeftKey()) {
				self.previous(true);
			} else if (event.isEscapeKey()) {
				self.hide();
			} else if (event.isReturnKey()) {
				self.playOrPause();
			}
		}
	},
	getLargestSize : function(canvas,image) {
		if (image.width<=canvas.width && image.height<=canvas.height) {
			return {width:image.width,height:image.height};
		} else if (canvas.width/canvas.height>image.width/image.height) {
			return {width:canvas.height/image.height*image.width,height:canvas.height};
		} else if (canvas.width/canvas.height<image.width/image.height) {
			return {width:canvas.width,height:canvas.width/image.width*image.height};
		} else {
			return {width:canvas.width,height:canvas.height};
		}
	},	
	calculateSize : function() {
		var newWidth = N2i.Window.getInnerWidth()-100;
		newWidth = Math.floor(newWidth/100)*100;
		newWidth = Math.min(newWidth,this.options.maxWidth);
		var newHeight = N2i.Window.getInnerHeight()-100;
		newHeight = Math.floor(newHeight/100)*100;
		newHeight = Math.min(newHeight,this.options.maxHeight);
		var maxWidth = 0;
		var maxHeight = 0;
		for (var i=0; i < this.images.length; i++) {
			N2i.log('********************');
			N2i.log({width:newWidth,height:newHeight});
			N2i.log(this.images[i]);
			var dims = this.getLargestSize({width:newWidth,height:newHeight},this.images[i]);
			maxWidth = Math.max(maxWidth,dims.width);
			maxHeight = Math.max(maxHeight,dims.height);
			N2i.log(dims);
		};
		newHeight = Math.round(Math.min(newHeight,maxHeight));
		newWidth = Math.round(Math.min(newWidth,maxWidth));
		/*
		
			alert(min);
			alert(newWidth/newHeight);
		if (newHeight>max) {
			newWidth = newHeight*max;
		}
		if (newWidth/newHeight>min) {
			newHeight = newWidth/min;
		}
		*/
		if (newWidth!=this.width || newHeight!=this.height) {
			this.width = newWidth;
			this.height = newHeight;
			this.dirty = true;
		}
	},
	showById: function(id) {
		for (var i=0; i < this.images.length; i++) {
			if (this.images[i].id==id) {
				this.show(i);
				break;
			}
		};
	},
	show: function(index) {
		this.index = index || 0;
		this.calculateSize();
		this.updateUI();
		var curtainIndex = In2iGui.nextPanelIndex();
		this.element.style.zIndex=In2iGui.nextPanelIndex();
		this.element.style.width=(this.width+10)+'px';
		this.element.style.height=(this.height+50)+'px';
		this.element.style.marginLeft='-'+Math.round((this.width+10)/2)+'px';
		this.element.style.top=Math.round((N2i.Window.getInnerHeight()-(this.height+50))/2)+N2i.Window.getScrollTop()+'px';
		this.viewer.style.width=(this.width+10)+'px';
		this.viewer.style.height=this.height+'px';
		this.innerViewer.style.width=((this.width+10)*this.images.length)+'px';
		this.innerViewer.style.height=this.height+'px';
		this.controller.style.marginLeft=((this.width-115)/2+5)+'px';
		this.element.style.display='block';
		this.goToImage(false,0,false);
		In2iGui.showCurtain(this,curtainIndex);
		N2i.addListener(document,'keydown',this.keyListener);
	},
	hide: function(index) {
		this.pause();
		In2iGui.hideCurtain(this);
		this.element.style.display='none';
		N2i.removeListener(document,'keydown',this.keyListener);
	},
	curtainWasClicked : function() {
		this.hide();
	},
	updateUI : function() {
		if (this.dirty) {
			this.innerViewer.innerHTML='';
			for (var i=0; i < this.images.length; i++) {
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/,'&');
				var element = N2i.create('div',{'class':'in2igui_imageviewer_image'},{'width':(this.width+10)+'px','height':this.height+'px'});
				
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/g,'&');
				//element.style.backgroundImage="url('"+url+"')";
				this.innerViewer.appendChild(element);
			};
			this.dirty = false;
			this.preload();
		}
	},
	goToImage : function(animate,num,user) {	
		if (animate) {
			if (num>1) {
				$ani(this.viewer,'scrollLeft',this.index*(this.width+10),Math.min(num*300,2000),{ease:N2i.Animation.slowFastSlow});				
			} else {
				var end = this.index==0 || this.index==this.images.length-1;
				var ease = (end ? N2i.Animation.bounce : N2i.Animation.elastic);
				$ani(this.viewer,'scrollLeft',this.index*(this.width+10),(end ? 800 : 1200),{ease:ease});
			}
		} else {
			this.viewer.scrollLeft=this.index*(this.width+10);
		}
	},
	clearImages : function() {
		this.images = [];
		this.dirty = true;
	},
	addImages : function(images) {
		for (var i=0; i < images.length; i++) {
			this.addImage(images[i]);
		};
	},
	addImage : function(img) {
		this.images.push(img);
		this.dirty = true;
	},
	resolveImageUrl : function(img) {
		for (var i=0; i < this.delegates.length; i++) {
			if (this.delegates[i].resolveImageUrl) {
				return this.delegates[i].resolveImageUrl(img,this.width,this.height);
			}
		};
		return null;
	},
	play : function() {
		if (!this.interval) {
			this.interval = window.setInterval(this.timer,6000);
		}
		this.next(false);
		this.playing=true;
		this.playControl.className='in2igui_imageviewer_pause';
	},
	pause : function() {
		window.clearInterval(this.interval);
		this.interval = null;
		this.playControl.className='in2igui_imageviewer_play';
		this.playing = false;
	},
	playOrPause : function() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	},
	resetPlay : function() {
		if (this.playing) {
			window.clearInterval(this.interval);
			this.interval = window.setInterval(this.timer,6000);
		}
	},
	previous : function(user) {
		var num = 1;
		this.index--;
		if (this.index<0) {
			this.index=this.images.length-1;
			num = this.images.length-1;
		}
		this.goToImage(true,num,user);
		this.resetPlay();
	},
	next : function(user) {
		var num = 1;
		this.index++;
		if (this.index==this.images.length) {
			this.index=0;
			num = this.images.length-1;
		}
		this.goToImage(true,num,user);
		this.resetPlay();
	},
	preload : function() {
		var guiLoader = new N2i.Preloader();
		guiLoader.addImages(In2iGui.context+'In2iGui/gfx/imageviewer_controls.png');
		var self = this;
		guiLoader.setDelegate({allImagesDidLoad:function() {self.preloadImages()}});
		guiLoader.load();
	},
	preloadImages : function() {
		this.loader = new N2i.Preloader();
		this.loader.setDelegate(this);
		for (var i=0; i < this.images.length; i++) {
			this.loader.addImages(this.resolveImageUrl(this.images[i]));
		};
		this.status.innerHTML = '0%';
		this.status.style.display='';
		this.loader.load();
	},
	allImagesDidLoad : function() {
		this.status.style.display='none';
	},
	imageDidLoad : function(loaded,total,index) {
		this.status.innerHTML = Math.round(loaded/total*100)+'%';
		var url = this.resolveImageUrl(this.images[index]);
		url = url.replace(/&amp;/g,'&');
		this.innerViewer.childNodes[index].style.backgroundImage="url('"+url+"')";
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',false);
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',false);
	},
	imageDidGiveError : function(loaded,total,index) {
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',true);
	},
	imageDidAbort : function(loaded,total,index) {
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',true);
	}
}

/* EOF */