
In2iGui.Menu = function(element,name,options) {
	this.options = N2i.override({},options);
	this.element = $(element);
	this.name = name;
	this.value = null;
	this.subMenus = [];
	this.visible = false;
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
	addItem : function(item) {
		var self = this;
		var element = new Element('div').addClassName('in2igui_menu_item').update(item.title);
		element.observe('mouseup',function(e) {
			self.itemWasClicked(item.value);
			Event.stop(e);
		});
		if (item.children) {
			var sub = In2iGui.Menu.create();
			sub.addItems(item.children);
			element.observe('mouseover',function(e) {
				sub.showAtElement(element,e,'horizontal');
			});
			sub.addDelegate({itemWasClicked:function(value) {self.itemWasClicked(value)}});
			self.subMenus.push(sub);
			element.addClassName('in2igui_menu_item_children');
		}
		this.element.insert(element);
	},
	addItems : function(items) {
		for (var i=0; i < items.length; i++) {
			this.addItem(items[i]);
		};
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
	showAtElement : function(element,event,position) {
		if (event) Event.stop(event);
		var point = element.cumulativeOffset();
		if (position=='horizontal') {
			point.left += element.getWidth();
		} else if (position=='vertical') {
			point.top += element.getHeight();
		}
		this.showAtPoint(point);
	},
	showAtPoint : function(pos) {
		if (this.visible) return;
		var innerWidth = N2i.Window.getInnerWidth();
		this.element.setStyle({'display':'block','visibility':'hidden',opacity:0});
		var width = this.element.getWidth();
		this.element.setStyle({'top':pos.top+'px','left':Math.min(pos.left,innerWidth-width-20)+'px','visibility':'visible'});
		$ani(this.element,'opacity',1,200);
		this.addHider();
		this.visible = true;
	},
	hide : function() {
		if (!this.visible) return;
		var self = this;
		$ani(this.element,'opacity',0,200,{onComplete:function() {
			self.element.setStyle({'display':'none'});
		}})
		this.removeHider();
		for (var i=0; i < this.subMenus.length; i++) {
			this.subMenus[i].hide();
		};
		this.visible = false;
	},
	addHider : function() {
		Element.observe(document.body,'click',this.hider);
	},
	removeHider : function() {
		Event.stopObserving(document.body,'click',this.hider);
	}
}



/* EOF */