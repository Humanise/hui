In2iGui.Window = function(element) {
	this.element = $id(element);
	this.close = $firstClass('close',this.element);
	this.titlebar = $firstClass('titlebar',this.element);
	this.title = $firstClass('title',this.titlebar);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Window.prototype.addBehavior = function() {
	var self = this;
	this.close.onclick = function() {self.hide();}
	this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
}

In2iGui.Window.prototype.setTitle = function(title) {
	this.title.innerHTML = title;
}

In2iGui.Window.prototype.show = function() {
	this.element.style.zIndex=In2iGui.nextIndex();
	this.element.style.visibility='hidden';
	this.element.style.display='block';
	this.element.style.width = this.element.clientWidth+'px';
	this.element.style.visibility='visible';
	if (!N2i.isIE()) {
		$ani(this.element,'opacity',1,0);
	} else {
		//alert(this.element.clientWidth);
	}
}

In2iGui.Window.prototype.hide = function() {
	if (!N2i.isIE()) {
		$ani(this.element,'opacity',0,200,{hideOnComplete:true});
	} else {
		this.element.style.display='none';
	}
}

/************************************ Dragging **************************************/

In2iGui.Window.prototype.startDrag = function(e) {
	this.element.style.zIndex=In2iGui.nextIndex();
	var event = new N2i.Event(e);
	this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.element),top:event.mouseTop()-N2i.Element.getTop(this.element)};
	this.latestPosition = {left: this.dragState.left, top:this.dragState.top};
	this.latestTime = new Date().getMilliseconds();
	var self = this;
	this.moveListener = function(e) {self.drag(e)};
	this.upListener = function(e) {self.endDrag(e)};
	N2i.Event.addListener(document,'mousemove',this.moveListener);
	N2i.Event.addListener(document,'mouseup',this.upListener);
	N2i.Event.stop(e);
	document.body.onselectstart = function () { return false; };
	return false;
}

In2iGui.Window.prototype.calc = function(top,left) {
	// TODO: No need to do this all the time
	this.a = this.latestPosition.left-left;
	this.b = this.latestPosition.top-top;
	this.dist = Math.sqrt(Math.pow((this.a),2),Math.pow((this.b),2));
	this.latestTime = new Date().getMilliseconds();
	this.latestPosition = {'top':top,'left':left};
}

In2iGui.Window.prototype.drag = function(e) {
	var event = new N2i.Event(e);
	this.element.style.right = 'auto';
	var top = (event.mouseTop()-this.dragState.top);
	var left = (event.mouseLeft()-this.dragState.left);
	this.element.style.top = Math.max(top,0)+'px';
	this.element.style.left = Math.max(left,0)+'px';
	//this.calc(top,left);
	return false;
}

In2iGui.Window.prototype.endDrag = function(e) {
	N2i.Event.removeListener(document,'mousemove',this.moveListener);
	N2i.Event.removeListener(document,'mouseup',this.upListener);
	document.body.onselectstart = null;
	/*
	var func = N2i.Animation.fastSlow;
	var newTop = parseInt(this.element.style.top)-this.b*10;
	var newLeft = parseInt(this.element.style.left)-this.a*10;
	if (newTop<0) {newTop=0; func=N2i.Animation.bounce};
	if (newLeft<0) {newLeft=0; func=N2i.Animation.bounce};
	$ani(this.element,'top',newTop+'px',1000,{ease:func});
	$ani(this.element,'left',newLeft+'px',1000,{ease:func});
	*/
}


