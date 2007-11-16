if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};

OO.Community.Window = function(delegate) {
	this.delegate = delegate;
	this.build();
	this.setupDrag();
}

OO.Community.Window.prototype.build = function() {
	var self = this;
	this.window = document.createElement('div');
	this.window.className='floating_window';
	this.window.innerHTML = '<div class="top"><div class="close"></div></div><div class="titlebar"><div><div><span>'+this.delegate.title+'</span></div></div></div>'+
		'<div class="body"><div class="body"><div class="content"></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	this.titlebar = $class('titlebar',this.window)[0];
	this.content = $class('content',this.window)[0];
	this.close = $class('close',this.window)[0];
	this.close.onclick = function() {
		self.hide();
	}
	this.content.appendChild(this.delegate.getContent());
	document.body.appendChild(this.window);
}

OO.Community.Window.prototype.show = function() {
	if (this.delegate.windowWillShow) {
		this.delegate.windowWillShow();
	}
	this.window.style.display = 'block';
}

OO.Community.Window.prototype.hide = function() {
	this.window.style.display = 'none';
}

/********************* Dragging *********************/

OO.Community.Window.prototype.setupDrag = function(e) {
	var self = this;
	this.titlebar.onmousedown = function(e) {if (self.isDragging) {self.endDrag()} else {self.startDrag(e)};return false;};
	this.titlebar.onmouseup = function(e) {self.endDrag(e);return false;};
}

OO.Community.Window.prototype.startDrag = function(e) {
	OO.Community.Window.latestZindex++;
	this.window.style.zIndex=OO.Community.Window.latestZindex;
	var event = new N2i.Event(e);
	this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.window),top:event.mouseTop()-N2i.Element.getTop(this.window)};
	var self = this;
	this.moveListener = function(e) {self.drag(e)};
	this.upListener = function(e) {self.endDrag(e)};
	N2i.Event.addListener(document,'mousemove',this.moveListener);
	N2i.Event.addListener(document,'mouseup',this.upListener);
	N2i.Event.stop(e);
	this.isDragging = true;
	return false;
}

OO.Community.Window.prototype.drag = function(e) {
	var event = new N2i.Event(e);
	this.window.style.right = 'auto';
	this.window.style.top = (event.mouseTop()-this.dragState.top)+'px';
	this.window.style.left = (event.mouseLeft()-this.dragState.left)+'px';
	return false;
}

OO.Community.Window.prototype.endDrag = function() {
	N2i.Event.removeListener(document,'mousemove',this.moveListener);
	N2i.Event.removeListener(document,'mouseup',this.upListener);
	this.isDragging = false;
}


/********************** Generators ******************/

OO.Community.Window.buildButton = function(title,delegate) {
	var element = document.createElement('div');
	if (delegate.onclick) {
		element.onclick=delegate.onclick;
	}
	element.className='button';
	element.innerHTML = '<div><div>'+title+'</div></div>';
	return element;
}

OO.Community.Window.buildSpace = function(size) {
	var element = document.createElement('div');
	element.style.height=size+'px';
	return element;
}

/********************** Browser ******************/

OO.Community.Window.Browser = function(options) {
	this.options = options;
	
}

OO.Community.Window.Browser.prototype.build = function() {
	this.base = document.createElement('div');
	this.base.className = 'browser';
}

OO.Community.Window.Browser.prototype.getBase = function() {
	return this.base;
}



/********************** Browser ******************/

OO.Community.Window.Progress = function(options) {
	this.options = options;
	this.build();
}

with (OO.Community.Window.Progress) {

	prototype.build = function() {
		this.base = document.createElement('div');
		this.base.className = 'progress';
		this.indicator = document.createElement('div');
		this.base.appendChild(this.indicator);
	}

	prototype.getBase = function() {
		return this.base;
	}
	
	prototype.setValue = function(value) {
		$ani(this.indicator,'width',(value*100)+'%',200);
	}
	
	prototype.reset = function() {
		this.indicator.style.width='0%';
	}
	
	prototype.hide = function() {
		this.base.style.display = 'none';
	}
	
	prototype.show = function() {
		this.base.style.display = 'block';
	}

}