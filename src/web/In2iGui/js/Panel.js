In2iGui.Panel = function(element,name) {
	this.element = $(element);
	this.titlebar = $class('titlebar',this.element)[0];
	this.content=$class('content',this.element)[0];
	this.close = $class('close',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Panel.create = function(opts) {
	var options = {name:null,title:'Panel'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_panel'},
		{'display':'none','top':'100px','left':'100px'}
	);
	
	var html = '<div class="titlebar"><div><div>'+
			'<div class="close"></div><strong>'+options.title+'</strong>'+
		'</div></div></div>'+
		'<div class="body"><div class="body"><div class="body"><div class="content"'+
		(options.padding ? ' style="padding: '+options.padding+'px; padding-bottom: 0px;"' : '')+
		'></div></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	element.innerHTML=html;
	document.body.appendChild(element);
	return new In2iGui.Panel(element);
}

In2iGui.Panel.prototype = {
	addBehavior : function() {
		var self = this;
		this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
		var close = $class('close',this.titlebar)[0];
		close.onclick = function() {self.hide()};
	},
	show : function() {
		this.element.setStyle({
			zIndex : In2iGui.nextPanelIndex(), visibility : 'hidden', display : 'block'
		})
		var width = this.element.clientWidth;
		this.element.setStyle({
			width : width+'px' , visibility : 'visible'
		});
	},
	hide : function() {
		this.element.style.display='none';
	},
	add : function(widget) {
		this.content.appendChild(widget.getElement());
	},
	addContent : function(node) {
		this.content.appendChild(node);
	},
	startDrag : function(e) {
		this.element.style.zIndex=In2iGui.nextPanelIndex();
		var event = new N2i.Event(e);
		this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.element),top:event.mouseTop()-N2i.Element.getTop(this.element)};
		var self = this;
		this.moveListener = function(e) {self.drag(e)};
		this.upListener = function(e) {self.endDrag(e)};
		N2i.Event.addListener(document,'mousemove',this.moveListener);
		N2i.Event.addListener(document,'mouseup',this.upListener);
		N2i.Event.stop(e);
		document.body.onselectstart = function () { return false; };
		return false;
	},

	drag : function(e) {
		var event = new N2i.Event(e);
		this.element.style.right = 'auto';
		this.element.style.top = (event.mouseTop()-this.dragState.top)+'px';
		this.element.style.left = (event.mouseLeft()-this.dragState.left)+'px';
		return false;
	},

	endDrag : function() {
		N2i.Event.removeListener(document,'mousemove',this.moveListener);
		N2i.Event.removeListener(document,'mouseup',this.upListener);
		document.body.onselectstart = null;
	}
}

/* EOF */
