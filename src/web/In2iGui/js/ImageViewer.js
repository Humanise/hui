/**
 @constructor
 */
In2iGui.ImageViewer = function(element,name,options) {
	this.options = n2i.override({
		maxWidth:800,maxHeight:600,perimeter:100,sizeSnap:100,
		ease:n2i.ease.slowFastSlow,
		easeEnd:n2i.ease.bounce,
		easeAuto:n2i.ease.slowFastSlow,
		easeReturn:n2i.ease.cubicInOut,transition:400,transitionEnd:1000,transitionReturn:300
		},options);
	this.element = $(element);
	this.box = this.options.box;
	this.viewer = this.element.select('.in2igui_imageviewer_viewer')[0];
	this.innerViewer = this.element.select('.in2igui_imageviewer_inner_viewer')[0];
	this.status = this.element.select('.in2igui_imageviewer_status')[0];
	this.previousControl = this.element.select('.in2igui_imageviewer_previous')[0];
	this.controller = this.element.select('.in2igui_imageviewer_controller')[0];
	this.nextControl = this.element.select('.in2igui_imageviewer_next')[0];
	this.playControl = this.element.select('.in2igui_imageviewer_play')[0];
	this.text = this.element.select('.in2igui_imageviewer_text')[0];
	this.dirty = false;
	this.width = 600;
	this.height = 460;
	this.index = 0;
	this.playing=false;
	this.name = name;
	this.images = [];
	this.box.addDelegate(this);
	this.addBehavior();
	In2iGui.extend(this);
}

In2iGui.ImageViewer.create = function(name,options) {
	options = options || {};
	var element = new Element('div',{'class':'in2igui_imageviewer'});
	element.update('<div class="in2igui_imageviewer_viewer"><div class="in2igui_imageviewer_inner_viewer"></div></div>'+
	'<div class="in2igui_imageviewer_text"></div>'+
	'<div class="in2igui_imageviewer_status"></div>'+
	'<div class="in2igui_imageviewer_controller">'+
	'<a class="in2igui_imageviewer_previous"></a>'+
	'<a class="in2igui_imageviewer_play"></a>'+
	'<a class="in2igui_imageviewer_next"></a>'+
	'</div>');
	var box = In2iGui.Box.create(null,{absolute:true,modal:true});
	box.add(element);
	box.addToDocument();
	options.box=box;
	return new In2iGui.ImageViewer(element,name,options);
}

In2iGui.ImageViewer.prototype = {
	/** @private */
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
			if (n2i.isRightKey(e)) {
				self.next(true);
			} else if (n2i.isLeftKey(e)) {
				self.previous(true);
			} else if (n2i.isEscapeKey(e)) {
				self.hide();
			} else if (n2i.isReturnKey(e)) {
				self.playOrPause();
			}
		}
	},
	/** @private */
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
	/** @private */
	calculateSize : function() {
		var snap = this.options.sizeSnap;
		var newWidth = n2i.getInnerWidth()-this.options.perimeter;
		newWidth = Math.floor(newWidth/snap)*snap;
		newWidth = Math.min(newWidth,this.options.maxWidth);
		var newHeight = n2i.getInnerHeight()-this.options.perimeter;
		newHeight = Math.floor(newHeight/snap)*snap;
		newHeight = Math.min(newHeight,this.options.maxHeight);
		var maxWidth = 0;
		var maxHeight = 0;
		for (var i=0; i < this.images.length; i++) {
			var dims = this.getLargestSize({width:newWidth,height:newHeight},this.images[i]);
			maxWidth = Math.max(maxWidth,dims.width);
			maxHeight = Math.max(maxHeight,dims.height);
		};
		newHeight = Math.round(Math.min(newHeight,maxHeight));
		newWidth = Math.round(Math.min(newWidth,maxWidth));
		
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
		var space = this.shouldShowController() ? 50 : 10;
		this.element.setStyle({width:(this.width+10)+'px',height:(this.height+space)+'px'});
		this.viewer.setStyle({width:(this.width+10)+'px',height:this.height+'px'});
		this.innerViewer.setStyle({width:((this.width+10)*this.images.length)+'px',height:this.height+'px'});
		this.controller.setStyle({paddingLeft:((this.width-115)/2+5)+'px'});
		this.box.show();
		this.goToImage(false,0,false);
		Event.observe(document,'keydown',this.keyListener);
	},
	hide: function(index) {
		this.pause();
		this.box.hide();
		Event.stopObserving(document,'keydown',this.keyListener);
	},
	/** @private */
	boxCurtainWasClicked : function() {
		this.hide();
	},
	/** @private */
	updateUI : function() {
		if (this.dirty) {
			this.innerViewer.innerHTML='';
			for (var i=0; i < this.images.length; i++) {
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/,'&');
				var element = new Element('div',{'class':'in2igui_imageviewer_image'}).setStyle({'width':(this.width+10)+'px','height':this.height+'px'});
				
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/g,'&');
				this.innerViewer.appendChild(element);
			};
			if (this.shouldShowController()) {
				this.controller.show();
			} else {
				this.controller.hide();
			}
			this.dirty = false;
			this.preload();
		}
	},
	/** @private */
	shouldShowController : function() {
		return this.images.length>1;
	},
	/** @private */
	goToImage : function(animate,num,user) {	
		if (animate) {
			if (num>1) {
				n2i.ani(this.viewer,'scrollLeft',this.index*(this.width+10),Math.min(num*this.options.transitionReturn,2000),{ease:this.options.easeReturn});				
			} else {
				var end = this.index==0 || this.index==this.images.length-1;
				var ease = (end ? this.options.easeEnd : this.options.ease);
				if (!user) ease = this.options.easeAuto;
				n2i.ani(this.viewer,'scrollLeft',this.index*(this.width+10),(end ? this.options.transitionEnd : this.options.transition),{ease:ease});
			}
		} else {
			this.viewer.scrollLeft=this.index*(this.width+10);
		}
		var text = this.images[this.index].text;
		if (text) {
			this.text.update(text).show();			
		} else {
			this.text.update().hide();
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
	/** @private */
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
	/** @private */
	preload : function() {
		var guiLoader = new n2i.Preloader();
		guiLoader.addImages(In2iGui.context+'In2iGui/gfx/imageviewer_controls.png');
		var self = this;
		guiLoader.setDelegate({allImagesDidLoad:function() {self.preloadImages()}});
		guiLoader.load();
	},
	/** @private */
	preloadImages : function() {
		this.loader = new n2i.Preloader();
		this.loader.setDelegate(this);
		for (var i=0; i < this.images.length; i++) {
			this.loader.addImages(this.resolveImageUrl(this.images[i]));
		};
		this.status.innerHTML = '0%';
		this.status.style.display='';
		this.loader.load();
	},
	/** @private */
	allImagesDidLoad : function() {
		this.status.style.display='none';
	},
	/** @private */
	imageDidLoad : function(loaded,total,index) {
		this.status.innerHTML = Math.round(loaded/total*100)+'%';
		var url = this.resolveImageUrl(this.images[index]);
		url = url.replace(/&amp;/g,'&');
		this.innerViewer.childNodes[index].style.backgroundImage="url('"+url+"')";
		Element.setClassName(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',false);
		Element.setClassName(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',false);
	},
	/** @private */
	imageDidGiveError : function(loaded,total,index) {
		Element.setClassName(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',true);
	},
	/** @private */
	imageDidAbort : function(loaded,total,index) {
		Element.setClassName(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',true);
	}
}

/* EOF */