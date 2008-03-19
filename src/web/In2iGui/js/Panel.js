In2iGui.Panel = function(element,name) {
	this.element = $id(element);
	this.titlebar = $class('titlebar',this.element)[0];
	this.content=$class('content',this.element)[0];
	this.close = $class('close',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Panel.latestZindex = 10;

In2iGui.Panel.prototype.addBehavior = function() {
	var self = this;
	this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
	var close = $class('close',this.titlebar)[0];
	close.onclick = function() {self.hide()};
	
	//this.element.onmouseover = function() {$ani(this,'opacity',1,200);}
	//this.element.onmouseout = function() {$ani(this,'opacity',.5,1000);}
}

In2iGui.Panel.create = function(opts) {
	var options = {name:null,title:'Panel'};
	N2i.override(options,opts);
	In2iGui.Panel.latestZindex++;
	var element = N2i.create('div',
		{'class':'in2igui_panel'},
		{'display':'none','zIndex':In2iGui.Panel.latestZindex,'top':'0px','left':'0px'}
	);
	
	var html = '<div class="titlebar"><div><div>'+
			'<div class="close"></div><strong>'+options.title+'</strong>'+
		'</div></div></div>'+
		'<div class="body"><div class="body"><div class="body"><div class="content"></div></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	element.innerHTML=html;
	document.body.appendChild(element);
	return new In2iGui.Panel(element);
}

/********************************* Public methods ***********************************/

In2iGui.Panel.prototype.show = function() {
	this.element.style.display='block';
}

In2iGui.Panel.prototype.hide = function() {
	this.element.style.display='none';
}

In2iGui.Panel.prototype.addContent = function(node) {
	this.content.appendChild(node);
}

/************************************ Dragging **************************************/

In2iGui.Panel.prototype.startDrag = function(e) {
	this.element.style.zIndex=In2iGui.nextIndex();
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
}

In2iGui.Panel.prototype.drag = function(e) {
	var event = new N2i.Event(e);
	this.element.style.right = 'auto';
	this.element.style.top = (event.mouseTop()-this.dragState.top)+'px';
	this.element.style.left = (event.mouseLeft()-this.dragState.left)+'px';
	return false;
}

In2iGui.Panel.prototype.endDrag = function() {
	N2i.Event.removeListener(document,'mousemove',this.moveListener);
	N2i.Event.removeListener(document,'mouseup',this.upListener);
	document.body.onselectstart = null;
}


