In2iGui.RichText = function(id,name,opts) {
	this.element = $id(id);
	this.options = {debug:false,value:'',autoHideToolbar:true};
	N2i.override(this.options,opts);
	this.iframe = this.element.getElementsByTagName('iframe')[0];
	this.toolbar = $firstClass('in2igui_richtext_toolbar',this.element);
	this.toolbarContent = $firstClass('in2igui_richtext_toolbar_content',this.element);
	this.value = this.options.value;
	this.document;
	this.buildToolbar();
	this.ignite();
	In2iGui.extend(this);
}

In2iGui.RichText.actions = [
	{key:'bold',				cmd:'bold',				value:null,		icon:'edit/text_bold'},
	{key:'italic',				cmd:'italic',			value:null,		icon:'edit/text_italic'},
	{key:'underline',			cmd:'underline',		value:null,		icon:'edit/text_underline'},
	null,
	{key:'justifyleft',			cmd:'justifyleft',		value:null,		icon:'edit/text_align_left'},
	{key:'justifycenter',		cmd:'justifycenter',	value:null,		icon:'edit/text_align_center'},
	{key:'justifyright',		cmd:'justifyright',		value:null,		icon:'edit/text_align_right'},
	null,
	{key:'increasefontsize',	cmd:'increasefontsize',	value:null,		icon:'edit/increase_font_size'},
	{key:'decreasefontsize',	cmd:'decreasefontsize',	value:null,		icon:'edit/decrease_font_size'},
	{key:'color',				cmd:null,				value:null,		icon:'common/color'}
	/*,
	null,
	{key:'p',				cmd:'formatblock',		value:'p'},
	{key:'h1',				cmd:'formatblock',		value:'h1'},
	{key:'h2',				cmd:'formatblock',		value:'h2'},
	{key:'h3',				cmd:'formatblock',		value:'h3'},
	{key:'h4',				cmd:'formatblock',		value:'h4'},
	{key:'h5',				cmd:'formatblock',		value:'h5'},
	{key:'h6',				cmd:'formatblock',		value:'h6'},
	{key:'removeformat', 	cmd:'removeformat', 	'value':null}*/
];

In2iGui.RichText.replaceInput = function(options) {
	var input = $id(options.input);
	input.style.display='none';
	options.value = input.value;
	var obj = In2iGui.RichText.create(options);
	input.parentNode.insertBefore(obj.element,input);
	obj.ignite();
}

In2iGui.RichText.create = function(name,options) {
	var base = N2i.create('div',{'class':'in2igui_richtext'});
	var toolbar = N2i.create('div',{'class':'in2igui_richtext_toolbar'});
	base.appendChild(toolbar);
	var iframe = N2i.create('iframe',{frameborder:0});
	base.appendChild(iframe);
	toolbar.innerHTML='<div class="in2igui_richtext_inner_toolbar"><div class="in2igui_richtext_toolbar_content"></div></div>';
	return new In2iGui.RichText(base,name,options);
}

In2iGui.RichText.prototype = {
	ignite : function() {
		this.setupIframe();
	},
	isCompatible : function() {
	    var agt=navigator.userAgent.toLowerCase();
		return true;
		return (agt.indexOf('msie 6')>-1 || agt.indexOf('msie 7')>-1 || (agt.indexOf('gecko')>-1 && agt.indexOf('safari')<0));
	},
	setupIframe : function() {
		var self = this;
		if (!this.iframe.contentWindow) return;
		this.window = this.iframe.contentWindow;
		this.document = this.iframe.contentDocument || this.window.document;
		this.document.designMode='on';
		
		this.document.open();
		this.document.write('<html><head><style>body{margin:0px}</style></head><body>'+this.value+'</body></html>');
		this.document.close();
		
		this.document.body.style.minHeight='100%';
		this.document.documentElement.style.cursor='text';
		this.document.documentElement.style.minHeight='100%';
		
		this.window.onkeypress=function() {self.documentChanged()};
		
		N2i.Event.addListener(this.window,'focus',function() {self.documentFocused()});
		N2i.Event.addListener(this.window,'blur',function() {self.documentBlurred()});
		N2i.Event.addListener(this.window,'keyup',function() {self.documentChanged()});
	},
	setHeight : function(height) {
		this.iframe.style.height=height+'px';
	},
	focus : function() {
		try { // TODO : May only work in gecko
			var r = this.document.createRange();
			r.selectNodeContents(this.document.body);
			this.window.getSelection().addRange(r);
		} catch (ignore) {}
		this.window.focus();
	},
	setValue : function(value) {
		this.value = value;
		this.document.body.innerHTML = value;
	},
	deactivate : function() {
		if (this.colorPicker) this.colorPicker.hide();
	},
	
	buildToolbar : function() {
		var self = this;
		var actions = In2iGui.RichText.actions;
		for (var i=0; i < actions.length; i++) {
			if (actions[i]==null) {
				this.toolbarContent.appendChild(N2i.create('div',{'class':'in2igui_richtext_divider'}));
			} else {
				var div = new Element('div').addClassName('action action_'+actions[i].key);
				div.title=actions[i].key;
				div.in2iguiRichTextAction = actions[i];
				div.onclick = div.ondblclick = function(e) {return self.actionWasClicked(this.in2iguiRichTextAction,e);}
				var img = new Element('img');
				img.src=In2iGui.context+'In2iGui/gfx/trans.png';
				if (actions[i].icon) {
					div.setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(actions[i].icon,1)+')'});
				}
				div.insert(img);
				this.toolbarContent.appendChild(div);
				div.onmousedown = In2iGui.RichText.stopEvent;
			}
		};
	},
	
	documentFocused : function() {
		if (N2i.isIE()) {
			this.toolbar.style.display='block';
			return;
		}
		if (this.toolbar.style.display!='block') {
			this.toolbar.style.marginTop='-40px';
			N2i.setOpacity(this.toolbar,0);
			this.toolbar.style.display='block';
			$ani(this.toolbar,'opacity',1,300);
			$ani(this.toolbar,'margin-top','-32px',300);
		}
	},
	
	documentBlurred : function() {
		if (this.options.autoHideToolbar) {
			if (N2i.isIE()) {
				var self = this;
				window.setTimeout(function() {
					self.toolbar.style.display='none';
				},100);
				return;
			}
			$ani(this.toolbar,'opacity',0,300,{hideOnComplete:true});
			$ani(this.toolbar,'margin-top','-40px',300);
		}
		this.documentChanged();
		In2iGui.callDelegates(this,'richTextDidChange');
	},
	
	documentChanged : function() {
		this.value = this.document.body.innerHTML;
		if (this.options.input) {
			$id(this.options.input).value=this.value;
		}
	},
	
	disabler : function(e) {
		var evt = e ? e : window.event; 
		//if (evt.stopPropagation) {
		//	evt.stopPropagation();
		//}
		if (evt.returnValue) {
			evt.returnValue = false;
		} else if (evt.preventDefault) {
			evt.preventDefault( );
		}
		return false;
	},
	actionWasClicked : function(action,e) {
		In2iGui.RichText.stopEvent(e);
		if (action.key=='color') {
			this.showColorPicker();
		} else {
			this.execCommand(action);
		}
		this.document.body.focus();
		this.documentChanged();
		return false;
	},
	execCommand : function(action) {
		this.document.execCommand(action.cmd,false,action.value);
		this.documentChanged();
	},
	showColorPicker : function() {
		if (!this.colorPicker) {
			var panel = In2iGui.Panel.create();
			var picker = In2iGui.ColorPicker.create();
			picker.addDelegate(this);
			panel.add(picker);
			panel.show();
			this.colorPicker = panel;
		}
		this.colorPicker.show();
	},
	colorWasHovered : function(color) {
		//this.document.execCommand('forecolor',false,color);
	},
	colorWasSelected : function(color) {
		this.document.execCommand('forecolor',false,color);
		this.documentChanged();
	}
}



In2iGui.RichText.stopEvent = function(e) {
  var evt = e ? e : window.event; 
  if (evt.returnValue) {
    evt.returnValue = false;
  } else if (evt.preventDefault) {
    evt.preventDefault( );
  } else {
    return false;
  }
}

/* EOF */