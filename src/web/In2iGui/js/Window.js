In2iGui.Window = function(element,name) {
	this.element = $(element);
	this.name = name;
	this.close = this.element.select('.close')[0];
	this.titlebar = this.element.select('.titlebar')[0];
	this.title = this.titlebar.select('.title')[0];
	this.content = this.element.select('.in2igui_window_content')[2];
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Window.create = function(name,options) {
	N2i.log(options);
	options = N2i.override({title:'Window'},options);
	N2i.log(options);
	var element = new Element('div',{'class':'in2igui_window'+(options.variant ? ' in2igui_window_'+options.variant : '')});
	element.update('<div class="close"></div>'+
		'<div class="titlebar"><div class="titlebar"><div class="titlebar"><span>'+options.title+'</span></div></div></div>'+
		'<div class="in2igui_window_content"><div class="in2igui_window_content"><div class="in2igui_window_content" style="'+
		(options.width ? 'width:'+options.width+'px;':'')+
		(options.padding ? 'padding:'+options.padding+'px;':'')+
		'">'+
		'</div></div></div>'+
		'<div class="in2igui_window_bottom"><div class="in2igui_window_bottom"><div class="in2igui_window_bottom"></div></div></div>'+
		'</div>');
	document.body.appendChild(element);
	return new In2iGui.Window(element,name);
}

In2iGui.Window.prototype = {
	addBehavior : function() {
		var self = this;
		this.close.observe('click',function() {self.hide();});
		this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
	},
	setTitle : function(title) {
		this.title.update(title);
	},
	show : function() {
		this.element.setStyle({
			zIndex : In2iGui.nextPanelIndex(), visibility : 'hidden', display : 'block'
		})
		var width = this.element.clientWidth;
		this.element.setStyle({
			width : width+'px' , visibility : 'visible'
		});
		if (!N2i.isIE()) {
			$ani(this.element,'opacity',1,0);
		}
	},
	hide : function() {
		if (!N2i.isIE()) {
			$ani(this.element,'opacity',0,200,{hideOnComplete:true});
		} else {
			this.element.setStyle({display:'none'});
		}
	},
	add : function(widgetOrNode) {
		if (widgetOrNode.getElement) {
			this.content.insert(widgetOrNode.getElement());
		} else {
			this.content.insert(widgetOrNode);
		}
	},

////////////////////////////// Dragging ////////////////////////////////

	startDrag : function(e) {
		this.element.style.zIndex=In2iGui.nextPanelIndex();
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
	},
	calc : function(top,left) {
		// TODO: No need to do this all the time
		this.a = this.latestPosition.left-left;
		this.b = this.latestPosition.top-top;
		this.dist = Math.sqrt(Math.pow((this.a),2),Math.pow((this.b),2));
		this.latestTime = new Date().getMilliseconds();
		this.latestPosition = {'top':top,'left':left};
	},
	drag : function(e) {
		var event = new N2i.Event(e);
		this.element.style.right = 'auto';
		var top = (event.mouseTop()-this.dragState.top);
		var left = (event.mouseLeft()-this.dragState.left);
		this.element.style.top = Math.max(top,0)+'px';
		this.element.style.left = Math.max(left,0)+'px';
		//this.calc(top,left);
		return false;
	},
	endDrag : function(e) {
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
}

/* EOF */