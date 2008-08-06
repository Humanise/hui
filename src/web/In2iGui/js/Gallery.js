In2iGui.Gallery = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.options = options || {};
	this.element = $(id);
	this.objects = [];
	this.nodes = [];
	this.selected = new Hash();
	this.width = 100;
	this.height = 100;
	In2iGui.extend(this);
}

In2iGui.Gallery.prototype = {
	setObjects : function(objects) {
		this.objects = objects;
		this.render();
	},
	getObjects : function() {
		return this.objects;
	},
	render : function() {
		this.nodes = [];
		this.element.update();
		var self = this;
		this.objects.each(function(object,i) {
			var url = self.resolveImageUrl(object);
			url = url.replace(/&amp;/,'&');
			if (object.height<object.width) {
				var top = (self.height-(self.height*object.height/object.width))/2;
			} else {
				var top = 0;
			}
			var img = new Element('img',{src:url}).setStyle({margin:top+'px auto 0px'});
			var item = new Element('div',{'class':'in2igui_gallery_item'}).setStyle({'width':self.width+'px','height':self.height+'px'}).insert(img);
			item.observe('click',function() {
				self.itemClicked(i);
			});
			item.observe('dblclick',function() {
				self.itemDoubleClicked(i);
			});
			self.element.insert(item);
			self.nodes.push(item);
		});
	},
	updateUI : function() {
		var self = this;
		this.objects.each(function(object,i) {
			if (self.selected.get(i)) {
				self.nodes[i].addClassName('in2igui_gallery_item_selected');
			} else {
				self.nodes[i].removeClassName('in2igui_gallery_item_selected');
			}
		});
	},
	resolveImageUrl : function(img) {
		for (var i=0; i < this.delegates.length; i++) {
			if (this.delegates[i].resolveImageUrl) {
				return this.delegates[i].resolveImageUrl(img,this.width,this.height);
			}
		};
		return '';
	},
	itemClicked : function(index) {
		this.selected = new Hash();
		this.selected.set(index,true);
		this.updateUI();
	},
	itemDoubleClicked : function(index) {
		In2iGui.callDelegates(this,'itemOpened',this.objects[index]);
	}
}

/* EOF */