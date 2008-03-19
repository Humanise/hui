In2iGui.BoundPanel = function(element,name) {
	this.element = $id(element);
	this.visible = false;
	this.content=$class('content',this.element)[0];
	this.arrow=$class('arrow',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.BoundPanel.prototype.addBehavior = function() {
	var self = this;
	
	//this.element.onmouseover = function() {$ani(this,'opacity',1,200);}
	//this.element.onmouseout = function() {$ani(this,'opacity',.5,1000);}
}

In2iGui.BoundPanel.create = function(opts) {
	var options = {name:null,top:'0px',left:'0px'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_boundpanel'},
		{'display':'none','zIndex':In2iGui.nextIndex(),'top':options.top,'left':options.left}
	);
	
	var html = 
		'<div class="arrow"></div>'+
		'<div class="top"><div><div></div></div></div>'+
		'<div class="body"><div class="body"><div class="body"><div class="content"></div></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	element.innerHTML=html;
	document.body.appendChild(element);
	return new In2iGui.BoundPanel(element);
}

/********************************* Public methods ***********************************/

In2iGui.BoundPanel.prototype.show = function() {
	if (!this.visible) {
		N2i.setOpacity(this.element,0);
		if (this.relativePosition=='left') {
			this.element.style.marginLeft='30px';
		} else {
			this.element.style.marginLeft='-30px';
		}
		this.element.style.marginTop='0px';
		this.element.style.display='block';
		$ani(this.element,'opacity',1,200,{ease:N2i.Animation.fastSlow});
		$ani(this.element,'margin-left','0px',800,{ease:N2i.Animation.bounce});
	}
	this.element.style.zIndex = In2iGui.nextPanelIndex();
	this.visible=true;
}

In2iGui.BoundPanel.prototype.hide = function() {
	$ani(this.element,'opacity',0,300,{ease:N2i.Animation.slowFast,hideOnComplete:true});
	N2i.log(this.visible);
	this.visible=false;
}

In2iGui.BoundPanel.prototype.addWidget = function(widget) {
	this.content.appendChild(widget.getElement());
}

In2iGui.BoundPanel.prototype.add = function(obj) {
	if (obj.getElement) {
		this.content.appendChild(obj.getElement());
	} else {
		this.content.appendChild(obj);
	}
}

In2iGui.BoundPanel.prototype.addNode = function(node) {
	this.content.appendChild(node);
}

In2iGui.BoundPanel.prototype.getDimensions = function() {
	if (this.element.style.display=='none') {
		this.element.style.visibility='hidden';
		this.element.style.display='block';
		var width = N2i.getWidth(this.element);
		var height = N2i.getHeight(this.element);
		this.element.style.display='none';
		this.element.style.visibility='';
	} else {
		var width = N2i.getWidth(this.element);
		var height = N2i.getHeight(this.element);
	}
	return {width:width,height:height};
}

In2iGui.BoundPanel.prototype.position = function(node) {
	var dims = this.getDimensions();
	var winWidth = N2i.Window.getInnerWidth();
	var nodeLeft = N2i.getLeft(node);
	var nodeWidth = N2i.getWidth(node);
	if ((nodeLeft+nodeWidth/2)/winWidth<.5) {
		this.relativePosition='left';
		var left = nodeLeft+nodeWidth+10+'px';
		this.arrow.className='arrow arrow_left';
		var arrowLeft=-14;
	} else {
		this.relativePosition='right';
		var left = nodeLeft-dims.width-10+'px';
		this.arrow.className='arrow arrow_right';
		var arrowLeft=dims.width-4;
	}
	this.arrow.style.marginTop = (Math.min(N2i.getHeight(node),dims.height)-32)/2+'px';
	this.arrow.style.marginLeft = arrowLeft+'px';
	var top = N2i.getTop(node)+'px';
	if (this.visible) {
		$ani(this.element,'top',top,500,{ease:N2i.Animation.fastSlow});
		$ani(this.element,'left',left,500,{ease:N2i.Animation.fastSlow});
	} else {
		this.element.style.top=top;
		this.element.style.left=left;
	}
}

