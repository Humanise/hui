In2iGui.Box = function(element,name,options) {
	this.options = n2i.override({},options);
	this.name = name;
	this.element = $(element);
	this.body = this.element.select('.in2igui_box_body')[0];
	In2iGui.extend(this);
}

In2iGui.Box.create = function(name,options) {
	options = n2i.override({},options);
	var e = new Element('div',{'class':'in2igui_box'});
	if (options.width) e.setStyle({width:options.width+'px'});
	if (options.absolute) e.addClassName('in2igui_box_absolute');
	e.update('<div class="in2igui_box_top"><div><div></div></div></div>'+
		'<div class="in2igui_box_middle"><div class="in2igui_box_middle">'+
		(options.title ? '<div class="in2igui_box_header"><strong class="in2igui_box_title">'+options.title+'</strong></div>' : '')+
		'<div class="in2igui_box_body"'+(options.padding ? ' style="padding: '+options.padding+'px;"' : '')+'></div>'+
		'</div></div>'+
		'<div class="in2igui_box_bottom"><div><div></div></div></div>');
	return new In2iGui.Box(e,name,options);
}

In2iGui.Box.prototype = {
	addToDocument : function() {
		document.body.appendChild(this.element);
	},
	add : function(widget) {
		if (widget.getElement) {
			this.body.insert(widget.getElement());
		} else {
			this.body.insert(widget);
		}
	},
	show : function() {
		var e = this.element;
		if (this.options.modal) {
			var index = In2iGui.nextPanelIndex();
			e.style.zIndex=index+1;
			In2iGui.showCurtain(this,index);
		}
		e.setStyle({display:'block',visibility:'hidden'});
		var w = e.getWidth();
		var top = (n2i.getInnerHeight()-e.getHeight())/2+n2i.getScrollTop();
		e.setStyle({'marginLeft':(w/-2)+'px',top:top+'px'});
		e.setStyle({display:'block',visibility:'visible'});
	},
	hide : function() {
		In2iGui.hideCurtain(this);
		this.element.setStyle({display:'none'});
	},
	curtainWasClicked : function() {
		In2iGui.callDelegates(this,'boxCurtainWasClicked');
	}
}