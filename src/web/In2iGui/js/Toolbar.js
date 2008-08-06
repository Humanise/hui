
/** @constructor */
In2iGui.Toolbar = function(element,name,options) {
	this.element = $id(element);
	this.name = name;
	In2iGui.extend(this);
}

In2iGui.Toolbar.create = function(name,options) {
	var element = new Element('div',{'class':'in2igui_toolbar'});
	if (options && options.labels==false) {
		element.addClassName('in2igui_toolbar_nolabels');
	}
	return new In2iGui.Toolbar(element,name,options);
}

In2iGui.Toolbar.prototype = {
	add : function(widget) {
		this.element.appendChild(widget.getElement());
	},
	addDivider : function() {
		this.element.appendChild(N2i.create('div',{'class':'in2igui_divider'}));
	}
}



/*************** Revealing **************/

/** @constructor */
In2iGui.RevealingToolbar = function(element,name,options) {
	this.element = $id(element);
	this.name = name;
	In2iGui.extend(this);
}

In2iGui.RevealingToolbar.create = function(name,options) {
	var element = N2i.create('div',{'class':'in2igui_revealing_toolbar'},{'display':'none'});
	document.body.appendChild(element);
	var rev = new In2iGui.RevealingToolbar(element,name,options);
	var toolbar = In2iGui.Toolbar.create();
	rev.setToolbar(toolbar);
	return rev;
}

In2iGui.RevealingToolbar.prototype = {
	setToolbar : function(widget) {
		this.toolbar = widget;
		this.element.appendChild(widget.getElement());
	},
	getToolbar : function() {
		return this.toolbar;
	},
	show : function(instantly) {
		this.element.style.display='';
		$ani(this.element,'height','58px',instantly ? 0 : 600,{ease:N2i.Animation.slowFastSlow});
	},
	hide : function() {
		$ani(this.element,'height','0px',500,{ease:N2i.Animation.slowFastSlow,hideOnComplete:true});
	}
}



/***************** Icon ***************/

/** @constructor */
In2iGui.Toolbar.Icon = function(id,name) {
	this.element = $id(id);
	this.name = name;
	this.enabled = true;
	this.icon = $firstClass('icon',this.element);
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Toolbar.Icon.create = function(name,options) {
	var element = N2i.create('div',{'class':'in2igui_toolbar_icon'});
	var icon = N2i.create('div',{'class':'in2igui_icon'},{'backgroundImage':'url('+In2iGui.getIconUrl(options.icon,2)+')'});
	var title = N2i.create('span');
	title.innerHTML=options.title;
	if (options.overlay) {
		var overlay = N2i.create('div',{'class':'in2igui_icon_overlay'},{'backgroundImage':'url('+In2iGui.getIconUrl('overlay/'+options.overlay,2)+')'});
		icon.appendChild(overlay);
	}
	element.appendChild(icon);
	element.appendChild(title);
	return new In2iGui.Toolbar.Icon(element,name,options);
}

In2iGui.Toolbar.Icon.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.wasClicked();
		}
	},
	/** Sets wether the icon should be enabled */
	setEnabled : function(enabled) {
		this.enabled = enabled;
		N2i.setClass(this.element,'in2igui_toolbar_icon_disabled',!this.enabled);
	},
	/** @private */
	wasClicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'toolbarIconWasClicked');
			In2iGui.callDelegates(this,'click');
		}
	}
}


/***************** Search field ***************/

In2iGui.Toolbar.SearchField = function(element,name) {
	this.element = $id(element);
	this.name = name;
	this.field = this.element.getElementsByTagName('input')[0];
	this.value = this.field.value;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.SearchField.prototype = {
	getValue : function() {
		return this.field.value;
	},
	addBehavior : function() {
		var self = this;
		this.field.onkeyup = function() {
			self.fieldChanged();
		}
		this.field.onfocus = function() {
			$ani(this,'width','120px',500,{ease:N2i.Animation.slowFastSlow});
		}
		this.field.onblur = function() {
			$ani(this,'width','80px',500,{ease:N2i.Animation.slowFastSlow});
		}
	},
	fieldChanged : function() {
		if (this.field.value!=this.value) {
			this.value=this.field.value;
			In2iGui.callDelegates(this,'valueChanged');
		}
	}
}

/* EOF */