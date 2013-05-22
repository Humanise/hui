oo.Gallery = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	this.images = options.images;
	this.busy = false;
	hui.ui.extend(this);
	this.thumbnails = 
	this._addBehavior();
}

oo.Gallery.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',this._click.bind(this));
		this._attachDragging();
	},
	_attachDragging : function() {
		var self = this;
		hui.drag.register({
			element : this.element,
			photo : null,
			targets : [],
			subject : null,
			dragIndex : null,
			onBeforeMove : function(e) {
				if (self.busy) {
					return;
				}
				var photo = e.findByClass('oo_gallery_photo');
				if (photo) {
					this.element.style.height = this.element.clientHeight+'px';
					this.subject = photo;
					var all = hui.get.byClass(this.element,'oo_gallery_photo');
					this.targets = [];
					for (var i=0; i < all.length; i++) {
						var targetNode = all[i];
						if (photo==targetNode) {
							this.dragIndex = i;
						}
						var pos = hui.position.get(targetNode);
						this.targets.push({
							index : i+0,
							node : targetNode,
							left : pos.left,
							top : pos.top,
							right : pos.left + targetNode.offsetWidth,
							bottom : pos.top + targetNode.offsetHeight
						});
					};
					for (var i=0; i < all.length; i++) {
						all[i].style.position = 'absolute';
						all[i].style.left = this.targets[i].left+'px';
						all[i].style.top = this.targets[i].top+'px';
					}
					hui.cls.add(photo,'oo_gallery_dragged');
					
					this.dummy = hui.build('span',{'class':'oo_gallery_dummy',parent:document.body,html:photo.innerHTML});
					this.offset = {
						left : this.dummy.clientWidth/-2,
						top : this.dummy.clientHeight/-2
					}
				}
			},
			onMove : function(e) {
				if (!this.dummy) {
					return;
				}
				var left = e.getLeft(),
					top = e.getTop();
				this.dummy.style.left = left + this.offset.left + 'px';
				this.dummy.style.top = top + this.offset.top + 'px';
				for (var i=0; i < this.targets.length; i++) {
					var target = this.targets[i];
					if (left>target.left-10 && left<target.right+10 && top>target.top-10 && top<target.bottom+10) {
						this._changeTarget(target)
					}
				};
			},
			_changeTarget : function(target) {
				//if (this._target!=target) {
					hui.log('_changeTarget',target)
					if (this._target) {
						//hui.cls.remove(this._target.node,'oo_gallery_target');
					}
					this._target = target;
					//hui.cls.add(this._target.node,'oo_gallery_target');
					this.indices = [];
					for (var i=0; i < this.targets.length; i++) {
						this.targets[i]
						if (i>this.dragIndex) {
							this.indices.push(i);
						}
						if (i==target.index) {
							this.indices.push(this.dragIndex);
						}
						if (i<this.dragIndex) {
							this.indices.push(i);
						}
					};
					//hui.get('log').innerHTML = indices.join(',')
					for (var i=0; i < this.indices.length; i++) {
						var target = this.targets[i];
						var node = this.targets[this.indices[i]].node;
						hui.animate({node:node,css:{
							left : target.left+'px',
							top : target.top+'px'
						},duration:300,ease:hui.ease.fastSlow})
						//node.style.left = target.left+'px';
						//node.style.top = target.top+'px';
					};
				//}
			},
			onEnd : function() {
				if (self.busy) {
					return;
				}
				self.busy = true;
				if (this.dummy) {
					hui.dom.remove(this.dummy)
					this.dummy = null;
				}
				if (this._target) {
					hui.cls.remove(this._target.node,'oo_gallery_target');
				}
				if (this.subject) {
					hui.cls.remove(this.subject,'oo_gallery_dragged');
					this.subject = null;
				}
				var all = hui.get.byClass(this.element,'oo_gallery_photo');
				for (var i=0; i < all.length; i++) {
					//all[i].style.left='';
					//all[i].style.top='';
					//all[i].style.position='';
				};
				//this.element.style.height = ''
				var images = [];
				for (var i=0; i < this.indices.length; i++) {
					images.push(self.images[this.indices[i]]);
				};
				self.fire('move',{images : images,callback:self.refresh.bind(self)});
			}
		})
	},
	_click : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			if (hui.cls.has(a,'oo_gallery_slideshow')) {
				e.stop();
				this._clickImage(0);
			}
			if (a.getAttribute('rel')=='remove') {
				e.stop();
				if (this.busy) {
					return;
				}
				var frame = hui.get.firstAncestorByClass(a,'oo_gallery_photo');
				hui.ui.confirmOverlay({
					element : frame,
					text:'Remove?',
					$ok : function() {
						this.busy = true;
						hui.animate({
							node : frame,
							css : {transform:'scale(0)',opacity:0},
							duration : 400,
							ease : hui.ease.backIn
						});
						this.fire('remove',{id : parseInt(a.getAttribute('data')),callback:this.refresh.bind(this)});
					}.bind(this)
				});
			}
		}
	},
	refresh : function() {
		oo.update({
			id : this.element.id,
			fade : true
		});
	},
	present : function() {
		this.getViewer().show(0);
	},
	_clickImage : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.imageViewer) {
			var v = this.imageViewer = oo.PhotoViewer.create();
			v.listen({
				$resolveImageUrl : function(image,width,height) {
					return oo.baseContext+'/service/image/id'+image.id+'width'+Math.round(width)+'height'+Math.round(height)+'.jpg';
				}
			});
			v.setImages(this.images);
		}
		return this.imageViewer;
	},
	
	addIncoming : function() {
		this.busy = true;
		var width = this.options.width,
			height = this.options.height;
		var ol = hui.get.firstByTag(this.element,'ol');
		var li = hui.build('li',{parent:ol});
		var span = hui.build('span',{parent:li,className:'oo_gallery_incoming',style:{visibility:'hidden'}});
		var inner = hui.build('span',{parent:span,style:{width:width+'px',height:height+'px',position:'relative'}});
		var indicator = hui.ui.ProgressIndicator.create({size:30});
		hui.style.set(indicator.element,{position:'absolute',left:'50%',top:'50%',marginLeft:'-15px',marginTop:'-15px'});
		inner.appendChild(indicator.element);
		hui.effect.bounceIn({element:span});
		return {
			$success : function(image) {
				indicator.destroy();
				span.className='oo_gallery_photo';
				span.innerHTML = '<a><img src="'+
					oo.baseContext+'/service/image/id'+image.id+
					'width'+width+'height'+height+
					'sharpen1.0cropped.jpg" style="width:'+width+'px;height:'+height+'px;"/></a>';
			},
			$progress : function(value) {
				indicator.setValue(value);
			},
			$failure : function() {
				
			}
		}
	}
}