
In2iGui.Menu = function(element,name,options) {
	this.options = {};
	N2i.override(this.options,options);
	this.element = $id(element);
	this.name = name;
	this.value = null;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Menu.create = function(name,options) {
	options = options || {};
	var element = new Element('div').addClassName('in2igui_menu');
	var obj = new In2iGui.Menu(element,name,options);
	document.body.appendChild(element);
	return obj;
}

In2iGui.Menu.prototype = {
	addBehavior : function() {
		var self = this;
		this.hider = function() {self.hide();}
	},
	addItem : function(title,value) {
		var self = this;
		var item = new Element('div').addClassName('in2igui_menu_item').update(title);
		item.observe('click',function(e) {
			self.itemWasClicked(value);
			e.stop();
		})
		this.element.insert(item);
	},
	getValue : function() {
		return this.value;
	},
	itemWasClicked : function(value) {
		this.value = value;
		In2iGui.callDelegates(this,'itemWasClicked',value);
		this.hide();
	},
	showAtPointer : function(event) {
		this.showAtPoint({'top':event.pointerY(),'left':event.pointerX()});
		event.stop();
	},
	showAtElement : function(element) {
		this.showAtPoint(element.cumulativeOffset());
	},
	showAtPoint : function(pos) {
		var innerWidth = N2i.Window.getInnerWidth();
		this.element.setStyle({'display':'block','visibility':'hidden'});
		var width = this.element.getWidth();
		this.element.setStyle({'top':pos.top+'px','left':Math.min(pos.left,innerWidth-width-20)+'px','visibility':'visible'});
		this.addHider();
	},
	hide : function() {
		this.element.setStyle({'display':'none'});
		this.removeHider();
	},
	addHider : function() {
		Element.observe(document.body,'click',this.hider);
	},
	removeHider : function() {
		Event.stopObserving(document.body,'click',this.hider);
	}
}



/* EOF */