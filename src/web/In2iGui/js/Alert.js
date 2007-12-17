In2iGui.Alert = function(elementOrId,name) {
	this.element = $id(elementOrId);
	this.name = name;
	this.body = $class('in2igui_alert_body',this.element)[0];
	var h1s = $tag('h1',this.element);
	this.title = h1s.length>0 ? h1s[0] : null;
	In2iGui.enableDelegating(this);
}

In2iGui.Alert.create = function(opts) {
	var options = {title:'',text:'',name:null,variant:null};
	N2i.override(options,opts);
	
	var element = N2i.create('div',{'class':'in2igui_alert'});
	var body = N2i.create('div',{'class':'in2igui_alert_body'});
	if (options.variant) {
		N2i.addClass(body,options.variant);
	}
	element.appendChild(body);
	document.body.appendChild(element);
	return new In2iGui.Alert(element);
}

In2iGui.Alert.prototype.show = function() {
	this.element.style.display='block';
	$ani(this.element,'opacity',1,200);
	$ani(this.element,'margin-top','40px',600,{ease:N2i.Animation.elastic});
}

In2iGui.Alert.prototype.hide = function() {
	$ani(this.element,'opacity',0,200,{hideOnComplete:true});
	$ani(this.element,'margin-top','0px',200);
}

In2iGui.Alert.prototype.setTitle = function(text) {
	if (!this.title) {
		this.title = N2i.create('h1');
		this.body.appendChild(this.title);
	}
	this.title.innerHTML = text;
}

In2iGui.Alert.prototype.setText = function(text) {
	if (!this.text) {
		this.text = N2i.create('p');
		this.body.appendChild(this.text);
	}
	this.text.innerHTML = text;
}

In2iGui.Alert.prototype.addButton = function(button) {
	if (!this.buttons) {
		this.buttons = N2i.create('div',{'class':'buttons'});
		this.body.appendChild(this.buttons);
	}
	this.buttons.appendChild(button.getElement());
}