function In2iGui() {
	this.overflows = [];
	this.delegates = [];
	this.objects = {};
	this.addBehavior();
}

In2iGui.latestIndex=500;
In2iGui.latestPanelIndex=1000;

In2iGui.get = function(name) {
	if (!In2iGui.instance) {
		In2iGui.instance = new In2iGui();
	}
	if (name) {
		return In2iGui.instance.objects[name];
	} else {
		return In2iGui.instance;
	}
}

N2i.Event.addLoadListener(function() {In2iGui.get().ignite();})


In2iGui.prototype.ignite = function(id) {
	if (window.dwr) {
		if (dwr && dwr.engine && dwr.engine.setErrorHandler) {
			dwr.engine.setErrorHandler(function(msg) {alert(msg)});
		}
	}
	this.resize();
	In2iGui.callSuperDelegates(this,'interfaceIsReady');
}

In2iGui.prototype.addBehavior = function(id) {
	var self = this;
	N2i.Event.addListener(window,'resize',function() {
		self.resize();
	});
}

In2iGui.prototype.addDelegate = function(delegate) {
	this.delegates[this.delegates.length] = delegate;
}

In2iGui.prototype.getTopPad = function(element) {
	var pad = 0;
	var all = parseInt(N2i.getStyle(element,'padding'));
	var top = parseInt(N2i.getStyle(element,'padding-top'));
	if (all) pad+=all;
	if (top) pad+=top;
	return pad;
}

In2iGui.prototype.getBottomPad = function(element) {
	var pad = 0;
	var all = parseInt(N2i.getStyle(element,'padding'));
	var bottom = parseInt(N2i.getStyle(element,'padding-bottom'));
	if (all) pad+=all;
	if (bottom) pad+=bottom;
	return pad;
}

In2iGui.prototype.resize = function(id) {
	var height = N2i.Window.getInnerHeight();
	for (var i=0; i < this.overflows.length; i++) {
		this.overflows[i].element.style.height = height+this.overflows[i].diff+'px';
	};
}

In2iGui.prototype.registerOverflow = function(id,diff) {
	var overflow = $id(id);
	this.overflows.push({element:overflow,diff:diff});
}

In2iGui.nextIndex = function() {
	In2iGui.latestIndex++;
	return 	In2iGui.latestIndex;
}

In2iGui.nextPanelIndex = function() {
	In2iGui.latestPanelIndex++;
	return 	In2iGui.latestPanelIndex;
}

In2iGui.prototype.showAlert = function(options) {
	if (!this.alert) {
		this.alert = In2iGui.Alert.create(options);
		var button = In2iGui.Button.create({text : 'OK'});
		button.addDelegate({buttonWasClicked:function(){
			In2iGui.get().alert.hide();
		}});
		this.alert.addButton(button);
	} else {
		this.alert.update(options);
	}
	this.alert.show();
}

In2iGui.getIconUrl = function(icon,size) {
	return In2iGui.context+'In2iGui/icons/'+icon+size+'.png';
}

/******************* Delegating ****************/

In2iGui.enableDelegating = function(obj) {
	if (obj.name) {
		In2iGui.get().objects[obj.name] = obj;
	}
	obj.delegates = [];
	obj.addDelegate = function(delegate) {
		this.delegates[this.delegates.length] = delegate;
	}
}

In2iGui.callDelegates = function(obj,method) {
	var result = null;
	if (obj.delegates) {
		for (var i=0; i < obj.delegates.length; i++) {
			var delegate = obj.delegates[i];
			var thisResult = null;
			if (obj.name && delegate[method+'$'+obj.name]) {
				thisResult = delegate[method+'$'+obj.name](obj);
			} else if (obj.kind && delegate[method+'$'+obj.kind]) {
				thisResult = delegate[method+'$'+obj.kind](obj);
			} else if (delegate[method]) {
				thisResult = delegate[method](obj);
			}
			if (result==null && thisResult!=null && typeof(thisResult)!='undefined') {
				result = thisResult;
			}
		};
	}
	var superResult = In2iGui.callSuperDelegates(obj,method);
	if (result==null && superResult!=null) result = superResult;
	return result;
}

In2iGui.callSuperDelegates = function(obj,method) {
	var gui = In2iGui.get();
	var result = null;
	for (var i=0; i < gui.delegates.length; i++) {
		var delegate = gui.delegates[i];
		var thisResult = null;
		if (obj.name && delegate[method+'$'+obj.name]) {
			thisResult = delegate[method+'$'+obj.name](obj);
		} else if (obj.kind && delegate[method+'$'+obj.kind]) {
			thisResult = delegate[method+'$'+obj.kind](obj);
		} else if (delegate[method]) {
			thisResult = delegate[method](obj);
		}
		if (result==null && thisResult!=null && typeof(thisResult)!='undefined') {
			result = thisResult;
		}
	};
	return result;
}

/******************** Data *****************/

In2iGui.dwrUpdate = function() {
	var func = arguments[0];
	var delegate = {
  		callback:function(data) { In2iGui.handleDwrUpdate(data) }
	}
	var num = arguments.length;
	if (num==1) {
		func(delegate);
	} else if (num==2) {
		func(arguments[1],delegate);
	} else {
		alert('Too many parameters');
	}
}

In2iGui.handleDwrUpdate = function(data) {
	var gui = In2iGui.get();
	for (var i=0; i < data.length; i++) {
		if (gui.objects[data[i].name]) {
			gui.objects[data[i].name].updateFromObject(data[i]);
		}
	};
}

In2iGui.update = function(url,delegate) {
	var dlgt = {
		onSuccess:function(t) {In2iGui.handleUpdate(t,delegate)}
	}
	$get(url,dlgt);
}

In2iGui.handleUpdate = function(t,delegate) {
	var gui = In2iGui.get();
	var doc = t.responseXML.firstChild;
	var children = doc.childNodes;
	for (var i=0; i < children.length; i++) {
		if (children[i].nodeType==1) {
			var name = children[i].getAttribute('name');
			if (name && name!='' && gui.objects[name]) {
				gui.objects[name].updateFromNode(children[i]);
			}
		}
	};
	delegate.onSuccess();
}

In2iGui.jsonResponse = function(t,key) {
	if (!t.responseXML || !t.responseXML.documentElement) {
		if (t.responseText.length>0) {
			var json = JSON.parse(t.responseText)
		} else {
			json = '';
		}
		In2iGui.callDelegates(json,'success$'+key)
	} else {
		In2iGui.callDelegates(t,'success$'+key)
	}
}

In2iGui.json = function(data,url,delegateOrKey) {
	if (typeof(delegateOrKey)=='string') {
		delegate = {onSuccess:function(t) {In2iGui.jsonResponse(t,delegateOrKey)}}
	} else {
		delegate = delegateOrKey;
	}
	var options = {method:'POST',parameters:{}};
	for (key in data) {
		options.parameters[key]=JSON.stringify(data[key])
	}
	$get(url,delegate,options)
}

