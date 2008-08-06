In2iGui.Alert = function(element,name) {
	this.element = $id(element);
	this.name = name;
	this.body = $firstClass('in2igui_alert_body',this.element);
	this.content = $firstClass('in2igui_alert_content',this.element);
	this.emotion = null;
	var h1s = $tag('h1',this.element);
	this.title = h1s.length>0 ? h1s[0] : null;
	In2iGui.extend(this);
}

In2iGui.Alert.create = function(name,options) {
	var opts = {title:'',text:'',emotion:null,variant:null,title:null};
	N2i.override(opts,options);
	
	var element = N2i.create('div',{'class':'in2igui_alert'});
	var body = N2i.create('div',{'class':'in2igui_alert_body'});
	element.appendChild(body);
	var content = N2i.create('div',{'class':'in2igui_alert_content'});
	body.appendChild(content);
	document.body.appendChild(element);
	var obj = new In2iGui.Alert(element,name);
	if (opts.variant) {
		obj.setVariant(opts.variant);
	}
	if (opts.emotion) {
		obj.setEmotion(opts.emotion);
	}
	if (opts.title) {
		obj.setTitle(opts.title);
	}
	if (opts.text) {
		obj.setText(opts.text);
	}
	
	return obj;
}

In2iGui.Alert.prototype = {
	show : function() {
		this.element.style.zIndex=In2iGui.nextAlertIndex();
		this.element.style.display='block';
		this.element.style.top=(N2i.Window.getScrollTop()+100)+'px';
		$ani(this.element,'opacity',1,200);
		$ani(this.element,'margin-top','40px',600,{ease:N2i.Animation.elastic});
	},
	hide : function() {
		$ani(this.element,'opacity',0,200,{hideOnComplete:true});
		$ani(this.element,'margin-top','0px',200);
	},
	setTitle : function(text) {
		if (!this.title) {
			this.title = N2i.create('h1');
			this.content.appendChild(this.title);
		}
		this.title.innerHTML = text;
	},
	setText : function(text) {
		if (!this.text) {
			this.text = N2i.create('p');
			this.content.appendChild(this.text);
		}
		this.text.innerHTML = text;
	},
	/** @deprecated */
	setVariant : function(variant) {
		this.setEmotion(variant);
	},
	setEmotion : function(emotion) {
		if (this.emotion) {
			N2i.removeClass(this.body,this.emotion);
		}
		this.emotion = emotion;
		N2i.addClass(this.body,emotion);
	},
	update : function(options) {
		options = options || {};
		this.setTitle(options.title || null);
		this.setText(options.text || null);
		this.setVariant(options.variant || null);
		this.setEmotion(options.emotion || null);
	},
	addButton : function(button) {
		if (!this.buttons) {
			this.buttons = N2i.create('div',{'class':'in2igui_buttons'});
			this.body.appendChild(this.buttons);
		}
		this.buttons.appendChild(button.getElement());
	}
}

/* EOF */