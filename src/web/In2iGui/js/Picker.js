
In2iGui.Picker = function(element,name,options) {
	this.options = N2i.override({itemWidth:100,itemHeight:150},options);
	this.element = $id(element);
	this.name = name;
	this.container = $firstClass('in2igui_picker_container',this.element);
	this.title = $firstClass('in2igui_picker_title',this.element);
	this.objects = [];
	this.selected = null;
	In2iGui.extend(this);
}

In2iGui.Picker.create = function(name,options) {
	options = N2i.override({shadow:true},options);
	var element = new Element('div',{'class':'in2igui_picker'});
	element.update('<div class="in2igui_picker_top"><div><div></div></div></div>'+
	'<div class="in2igui_picker_middle"><div class="in2igui_picker_middle">'+
	(options.title ? '<div class="in2igui_picker_title">'+options.title+'</div>' : '')+
	'<div class="in2igui_picker_container"></div>'+
	'</div></div>'+
	'<div class="in2igui_picker_bottom"><div><div></div></div></div>');
	if (options.shadow==true) {
		element.addClassName('in2igui_picker_shadow')
	}
	return new In2iGui.Picker(element,name,options);
}

In2iGui.Picker.prototype = {
	setObjects : function(objects) {
		this.objects = objects;
		this.updateUI();
	},
	getSelection : function() {
		return this.selected==null ? null : this.objects[this.selected];
	},
	reset : function() {
		this.selected = null;
		this.updateSelection();
	},
	updateUI : function() {
		this.container.style.width=(this.objects.length*(this.options.itemWidth+14))+'px';
		this.container.style.height=(this.options.itemHeight+10)+'px';
		for (var i=0; i < this.objects.length; i++) {
			var item = new Element('div',{'class':'in2igui_picker_item'});
			item.update(
				'<div class="in2igui_picker_item_middle"><div class="in2igui_picker_item_middle">'+
				'<div style="width:'+this.options.itemWidth+'px;height:'+this.options.itemHeight+'px;background-image:url(\''+this.objects[i].image+'\')"></div>'+
				'</div></div>'+
				'<div class="in2igui_picker_item_bottom"><div><div></div></div></div>'
			);
			item.in2iguiIndex = i;
			var self = this;
			item.onclick = function() {self.selectionChanged(this.in2iguiIndex)};
			this.container.appendChild(item);
		};
	},
	updateSelection : function() {
		var children = this.container.childNodes;
		for (var i=0; i < children.length; i++) {
			N2i.setClass(children[i],'in2igui_picker_item_selected',i==this.selected);
		};
	},
	selectionChanged : function(index) {
		this.selected = index;
		this.updateSelection();
		In2iGui.callDelegates(this,'selectionChanged');
	}
}

/* EOF */