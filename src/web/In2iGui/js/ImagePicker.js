In2iGui.ImagePicker = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.options = options || {};
	this.element = $id(id);
	this.images = [];
	this.object = null;
	this.thumbnailsLoaded = false;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.ImagePicker.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.showPicker();
		}
	},
	setObject : function(obj) {
		this.object = obj;
		this.updateUI();
	},
	getObject : function() {
		return this.object;
	},
	reset : function() {
		this.object = null;
		this.updateUI();
	},
	updateUI : function() {
		if (this.object==null) {
			this.element.style.backgroundImage='';
		} else {
			var url = In2iGui.callDelegates(this,'getImageUrl');
			this.element.style.backgroundImage='url('+url+')';
		}
	},
	showPicker : function() {
		if (!this.picker) {
			var self = this;
			this.picker = In2iGui.BoundPanel.create();
			this.content = N2i.create('div',{'class':'in2igui_imagepicker_thumbs'});
			var buttons = N2i.create('div',{'class':'in2igui_imagepicker_buttons'});
			var close = In2iGui.Button.create(null,{text:'Luk',highlighted:true});
			close.addDelegate({
				click:function() {self.hidePicker()}
			});
			var remove = In2iGui.Button.create(null,{text:'Fjern'});
			remove.addDelegate({
				click:function() {self.setObject(null);self.hidePicker()}
			});
			buttons.appendChild(close.getElement());
			buttons.appendChild(remove.getElement());
			this.picker.add(this.content);
			this.picker.add(buttons);
		}
		this.picker.position(this.element);
		this.picker.show();
		if (!this.thumbnailsLoaded) {
			this.updateImages();
			this.thumbnailsLoaded = true;
		}
	},
	hidePicker : function() {
		this.picker.hide();
	},
	updateImages : function() {
		var self = this;
		var delegate = {
			onXML:function(doc) {
				self.parse(doc);
			}
		};
		$get(this.options.source,delegate);
	},
	parse : function(doc) {
		N2i.removeChildren(this.content);
		var images = doc.getElementsByTagName('image');
		var self = this;
		for (var i=0; i < images.length && i<50; i++) {
			var id = images[i].getAttribute('id');
			var url = '../../../util/images/?id='+id+'&maxwidth=48&maxheight=48&format=jpg';
			var thumb = N2i.create('div',{'class':'in2igui_imagepicker_thumbnail'},{'backgroundImage':'url('+url+')'});
			thumb.in2iguiObject = {'id':id};
			thumb.onclick = function() {
				self.setObject(this.in2iguiObject);
				self.hidePicker();
			}
			this.content.appendChild(thumb);
		};
	}
}

/* EOF */