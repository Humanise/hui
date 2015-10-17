oo.PhotoViewer = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.body = hui.get.firstByClass(this.element,'oo_photoviewer_body');
	this.photos = hui.get.firstByClass(this.element,'oo_photoviewer_photos');
	this.thumbs = hui.get.firstByClass(this.element,'oo_photoviewer_thumbs');
	this.thumbItems = [];
	this.imageItems = [];
	this.images = [];
	this.index = 0;
	this.size = {
		width : 0, height : 0 
	}
	
	hui.ui.extend(this);
	this._attach();
	
	
	var guiLoader = new hui.Preloader();
	guiLoader.addImages(hui.ui.context+'/hui/gfx/progress/spinner_grey_32.gif');
	guiLoader.addImages(hui.ui.context+'/hui/gfx/progress/spinner_grey_24.gif');
	guiLoader.load();
}

oo.PhotoViewer.get = function(options) {
	if (!this._singleton) {
		this._singleton = oo.PhotoViewer.create(options);
	}
	return this._singleton;
}

oo.PhotoViewer.create = function(options) {
	options = hui.override({name:'ooPhotoViewer'},options);
	options.element = hui.build('div',{
		'class':'oo_photoviewer',
		html:'<div class="oo_photoviewer_body"><div class="oo_photoviewer_photos"></div></div><div class="oo_photoviewer_bottom"><div class="oo_photoviewer_thumbs"></div></div>'+
			'<div class="oo_photoviewer_actions">'+
				'<a rel="previous" class="oo_photoviewer_arrow"><span class="oo_icon oo_icon_32">&lt;</span></a>'+
				'<a rel="next" class="oo_photoviewer_arrow"><span class="oo_icon oo_icon_32">&gt;</span></a>'+
				(hui.browser.chrome ? '<a rel="full"><span class="oo_icon oo_icon_32">x</span></a>' : '')+
				'<a rel="close"><span class="oo_icon oo_icon_32">k</span></a>'+
			'</div>',
		parent:document.body
	});
	return new oo.PhotoViewer(options);
}

oo.PhotoViewer.prototype = {
	_attach : function() {
		hui.listen(this.element,'click',this._click.bind(this));
		this._keyDown = function(e) {
			e = hui.event(e);
			if (e.rightKey) {
				this.next();
			} else if (e.leftKey) {
				this.previous();
			} else if (e.escapeKey) {
				this.hide();
			} else if (e.returnKey) {
				//self.playOrPause();
			}
		}.bind(this)
		hui.ui.listen({
			$$afterResize : this._redraw.bind(this)
		})
	},
	
	
	_click : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (!a) {
			this.hide();
		} else {
			var rel = a.getAttribute('rel');
			if (rel=='full') {
				this.toggleFull();
			} else if (rel=='close') {
				this.hide();
			} else if (rel=='next') {
				this.next();
			} else if (rel=='previous') {
				this.previous();
			} else {
				this.index = parseInt(a.getAttribute('data'));
				this._transition();				
			}
		}
	},
	toggleFull : function() {
		this.fullScreen = !this.fullScreen;
		if (!this.fullScreen) {
			var cl = document.requestCancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen;
			if (cl) {
				cl.call(document);
			}
		}
		var el = this.element,
			rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
		if (rfs) {
    		rfs.call(el);
		}
	},
	show : function() {
		hui.cls.add(this.element,'oo_photoviewer_visible');
		hui.listen(document,'keydown',this._keyDown);
		this._build();
	},
	hide : function() {
		if (this.fullScreen) {
			this.toggleFull();
		}
		hui.cls.remove(this.element,'oo_photoviewer_visible');
		hui.unListen(document,'keydown',this._keyDown);
	},
	setImages : function(images) {
		this.images = images;
	},
	
	next : function() {
		this.index++;
		if (this.index>this.images.length-1) {
			this.index = 0;
		}
		this._transition();
	},
	previous : function() {
		this.index--;
		if (this.index<0) {
			this.index = this.images.length-1;
		}
		this._transition();
	},
	_transition : function() {
		hui.animate({
			node : this.body,
			property : 'scrollLeft',
			value : this.index*(this.body.clientWidth),
			duration: 500,
			ease : hui.ease.slowFastSlow
		});
		for (var i=0; i < this.thumbItems.length; i++) {
			hui.cls.set(this.thumbItems[i],'oo_photoviewer_thumb_selected',i==this.index);
		};
	},
	$$layout : function() {
		var width = this.element.clientWidth,
			height = this.body.clientHeight,
			w = Math.floor(width/100)*100,
			h = Math.floor(height/100)*100;
		var ps = hui.get.byClass(this.element,'oo_photoviewer_photo');
		for (var i=0; i < ps.length; i++) {
			ps[i].style.width = width+'px';
		};
		this.body.scrollLeft = this.index*width;
		
	},
	_redraw : function() {
		if (this._checkSize()) {
			var urls = [];
			for (var i=0; i < this.images.length; i++) {
				hui.cls.add(this.thumbItems[i],'oo_photoviewer_thumb_loading');
				hui.cls.add(this.imageItems[i],'oo_photoviewer_photo_loading');
				urls.push(oo.baseContext+'/service/image/id'+this.images[i].id+'width'+this.size.width+'height'+this.size.height+'_inherit.jpg');
			};
			var preloader = new hui.Preloader();
			preloader.setDelegate({
				imageDidLoad : function(loaded,total,index) {
					hui.log('loaded '+index)
					hui.cls.remove(this.thumbItems[index],'oo_photoviewer_thumb_loading');
					hui.cls.remove(this.imageItems[index],'oo_photoviewer_photo_loading');
					this.imageItems[index].style.backgroundImage = 'url('+urls[index]+')';
					this.imageItems[index].innerHTML = '<span></span>';
					this.thumbItems[index].innerHTML = '<span></span>';
				}.bind(this),
				imageDidGiveError : function(loaded,total,index) {
					hui.cls.remove(this.thumbItems[index],'oo_photoviewer_thumb_loading');
					hui.cls.remove(this.imageItems[index],'oo_photoviewer_photo_loading');
					this.imageItems[index].innerHTML = '<span></span><span class="oo_icon_warning"></span>';
					this.thumbItems[index].innerHTML = '<span></span><span class="oo_icon_warning"></span>';
				}.bind(this)
			})
			preloader.addImages(urls);
			preloader.load(this.index);
		}
	},
	_checkSize : function() {
		var w = Math.max(1,Math.ceil(this.body.clientWidth / 100)) * 100,
			h = Math.max(1,Math.ceil(this.body.clientHeight / 100)) * 100;
		if (this.size.width!=w || this.size.height!=h) {
			this.size = {width : w, height : h};
			return true;
		}
		return false;
	},
	_build : function() {
		this.size = {width:0,height:0}
		this.thumbItems = [];
		this.imageItems  = [];
		this.photos.innerHTML = '';
		this.thumbs.innerHTML = '';
		this.photos.style.width = this.images.length*100+'%';
		this.thumbs.style.width = this.images.length*100+'px';
		hui.cls.set(this.element,'oo_photoviewer_single',this.images.length<2);
		var width = this.body.clientWidth,
			height = this.body.clientHeight;
		for (var i=0; i < this.images.length; i++) {
			var image = this.images[i];
			var n = hui.build('div',{
				'class' : 'oo_photoviewer_photo',style:{width:width+'px'},parent:this.photos,html:'<span></span>'});
			var t = hui.build('a',{
				'class' : (i==0 ? 'oo_photoviewer_thumb_selected ' : '') + 'oo_photoviewer_thumb',
				data : i,
				html : '<span></span>',
				parent : this.thumbs,
				style : {
					backgroundImage : 'url('+oo.baseContext+'/service/image/id'+image.id+'width100height100sharpen1.0cropped_inherit.jpg'+')'
				}
			});
			this.thumbItems.push(t);
			this.imageItems.push(n);
		};
		this._redraw();
	}
};