In2iGui.BoundPanel = function(element,name) {
	this.element = $(element);
	this.visible = false;
	this.content=this.element.select('.content')[0];
	this.arrow=this.element.select('.arrow')[0];
	In2iGui.extend(this);
}

In2iGui.BoundPanel.create = function(opts) {
	var options = {name:null,top:'0px',left:'0px'};
	n2i.override(options,opts);
	var element = new Element('div',
		{'class':'in2igui_boundpanel'}).setStyle({'display':'none','zIndex':In2iGui.nextPanelIndex(),'top':options.top,'left':options.left});
	
	var html = 
		'<div class="arrow"></div>'+
		'<div class="top"><div><div></div></div></div>'+
		'<div class="body"><div class="body"><div class="body"><div class="content" style="';
	if (options.width) {
		html+='width:'+options.width+'px;';
	}
	if (options.padding) {
		html+='padding:'+options.padding+'px;';
	}
	html+='"></div></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	element.innerHTML=html;
	document.body.appendChild(element);
	return new In2iGui.BoundPanel(element);
}

/********************************* Public methods ***********************************/

In2iGui.BoundPanel.prototype = {
	show : function() {
		if (!this.visible) {
			if (!n2i.browser.msie) {
				n2i.setOpacity(this.element,0);
			}
			if (this.relativePosition=='left') {
				this.element.style.marginLeft='30px';
			} else {
				this.element.style.marginLeft='-30px';
			}
			this.element.setStyle({
				visibility : 'hidden', display : 'block'
			})
			var width = this.element.clientWidth;
			this.element.setStyle({
				width : width+'px' , visibility : 'visible'
			});
			this.element.style.marginTop='0px';
			this.element.style.display='block';
			if (!n2i.browser.msie) {
				n2i.ani(this.element,'opacity',1,400,{ease:n2i.ease.fastSlow});
			}
			n2i.ani(this.element,'margin-left','0px',800,{ease:n2i.ease.bounce});
		}
		this.element.style.zIndex = In2iGui.nextPanelIndex();
		this.visible=true;
	},
	hide : function() {
		if (n2i.browser.msie) {
			this.element.style.display='none';
		} else {
			n2i.ani(this.element,'opacity',0,300,{ease:n2i.ease.slowFast,hideOnComplete:true});
		}
		this.visible=false;
	},
	add : function(obj) {
		if (obj.getElement) {
			this.content.appendChild(obj.getElement());
		} else {
			this.content.appendChild(obj);
		}
	},
	addSpace : function(height) {
		this.add(new Element('div').setStyle({fontSize:'0px',height:height+'px'}));
	},
	getDimensions : function() {
		if (this.element.style.display=='none') {
			this.element.style.visibility='hidden';
			this.element.style.display='block';
			var width = this.element.getWidth();
			var height = this.element.getHeight();
			this.element.style.display='none';
			this.element.style.visibility='';
		} else {
			var width = this.element.getWidth();
			var height = this.element.getHeight();
		}
		return {width:width,height:height};
	},
	position : function(node) {
		node = $(node);
		var offset = node.cumulativeOffset();
		var scrollOffset = node.cumulativeScrollOffset();
		var dims = this.getDimensions();
		var winWidth = n2i.getInnerWidth();
		var nodeLeft = offset.left-scrollOffset.left+n2i.getScrollLeft();
		var nodeWidth = node.getWidth();
		var nodeHeight = node.getHeight();
		var nodeTop = offset.top-scrollOffset.top+n2i.getScrollTop();
		if ((nodeLeft+nodeWidth/2)/winWidth<.5) {
			this.relativePosition='left';
			var left = nodeLeft+nodeWidth+10;
			this.arrow.className='arrow arrow_left';
			var arrowLeft=-14;
		} else {
			this.relativePosition='right';
			var left = nodeLeft-dims.width-10;
			this.arrow.className='arrow arrow_right';
			var arrowLeft=dims.width-4;
		}
		var top = Math.max(0,nodeTop+(nodeHeight-dims.height)/2);
		this.arrow.style.marginTop = (dims.height-32)/2+Math.min(0,nodeTop+(nodeHeight-dims.height)/2)+'px';
		this.arrow.style.marginLeft = arrowLeft+'px';
		if (this.visible) {
			n2i.ani(this.element,'top',top+'px',500,{ease:n2i.ease.fastSlow});
			n2i.ani(this.element,'left',left+'px',500,{ease:n2i.ease.fastSlow});
		} else {
			this.element.style.top=top+'px';
			this.element.style.left=left+'px';
		}
	}
}

/* EOF */