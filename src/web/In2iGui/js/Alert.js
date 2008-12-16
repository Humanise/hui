/**
 * An alert that can be
 * @constructor
 */
In2iGui.Alert = function(element,name,options) {
	this.options = n2i.override({modal:false},options);
	this.element = $(element);
	this.name = name;
	this.body = this.element.select('.in2igui_alert_body')[0];
	this.content = this.element.select('.in2igui_alert_content')[0];
	this.emotion = null;
	var h1s = this.element.select('h1');
	this.title = h1s.length>0 ? h1s[0] : null;
	In2iGui.extend(this);
}

/**
 * Creates a new instance of an alert
 * @static
 */
In2iGui.Alert.create = function(name,options) {
	options = n2i.override({title:'',text:'',emotion:null,variant:null,title:null},options);
	
	var element = new Element('div',{'class':'in2igui_alert'});
	var body = new Element('div',{'class':'in2igui_alert_body'});
	element.insert(body);
	var content = new Element('div',{'class':'in2igui_alert_content'});
	body.insert(content);
	document.body.appendChild(element);
	var obj = new In2iGui.Alert(element,name,options);
	if (options.variant) {
		obj.setVariant(options.variant);
	}
	if (options.emotion) {
		obj.setEmotion(options.emotion);
	}
	if (options.title) {
		obj.setTitle(options.title);
	}
	if (options.text) {
		obj.setText(options.text);
	}
	
	return obj;
}

In2iGui.Alert.prototype = {
	show : function() {
		var zIndex = In2iGui.nextAlertIndex();
		if (this.options.modal) {
			In2iGui.showCurtain(this,zIndex);
			zIndex++;
		}
		this.element.style.zIndex=zIndex;
		this.element.style.display='block';
		this.element.style.top=(n2i.getScrollTop()+100)+'px';
		n2i.ani(this.element,'opacity',1,2000);
		n2i.ani(this.element,'margin-top','40px',600,{ease:n2i.ease.elastic});
	},
	hide : function() {
		n2i.ani(this.element,'opacity',0,200,{hideOnComplete:true});
		n2i.ani(this.element,'margin-top','0px',200);
		In2iGui.hideCurtain(this);
	},
	setTitle : function(text) {
		if (!this.title) {
			this.title = new Element('h1');
			this.content.appendChild(this.title);
		}
		this.title.innerHTML = text;
	},
	setText : function(text) {
		if (!this.text) {
			this.text = new Element('p');
			this.content.appendChild(this.text);
		}
		this.text.innerHTML = text || '';
	},
	/** @deprecated */
	setVariant : function(variant) {
		this.setEmotion(variant);
	},
	setEmotion : function(emotion) {
		if (this.emotion) {
			this.body.removeClassName(this.emotion);
		}
		this.emotion = emotion;
		this.body.addClassName(emotion);
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
			this.buttons = new Element('div',{'class':'in2igui_buttons'});
			this.body.appendChild(this.buttons);
		}
		this.buttons.appendChild(button.getElement());
	}
}

/* EOF */