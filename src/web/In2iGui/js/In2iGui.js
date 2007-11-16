function In2iGui() {
	this.overflows = [];
	this.delegates = [];
	this.objects = {};
	this.addBehavior();
}

In2iGui.get = function() {
	if (!In2iGui.instance) {
		In2iGui.instance = new In2iGui();
	}
	return In2iGui.instance;
}

N2i.Event.addLoadListener(function() {In2iGui.get().ignite();})


In2iGui.prototype.ignite = function(id) {
	N2i.log('ignite!');
	In2iGui.callSuperDelegates(this,'interfaceIsReady');
}

In2iGui.prototype.addBehavior = function(id) {
	var self = this;
	N2i.Event.addListener(window,'resize',function() {
		self.resized();
	});
}

In2iGui.prototype.addDelegate = function(delegate) {
	this.delegates[this.delegates.length] = delegate;
}

In2iGui.prototype.resized = function(id) {
	for (var i=0; i < this.overflows.length; i++) {
		this.overflows[i].style.height = '1px';
		var parent = this.overflows[i].parentNode;
		if (parent.nodeName=='TD') parent=parent.parentNode;
		var height = parent.clientHeight;
		this.overflows[i].style.height = height+'px';
	};
}

In2iGui.prototype.registerOverflow = function(id) {
	var overflow = $id(id);
	var parent = overflow.parentNode;
	if (parent.nodeName=='TD') parent=parent.parentNode;
	var height = parent.clientHeight;
	overflow.style.height = height+'px';
	this.overflows[this.overflows.length] = overflow;
}

In2iGui.hoverOverBG = function(element) {
	var bg = element.style.backgroundImage;
	element.style.backgroundImage = bg.replace(/\.png/,'hover.png');
}

In2iGui.hoverOutBG = function(element) {
	var bg = element.style.backgroundImage;
	element.style.backgroundImage = bg.replace(/hover\.png/,'.png');
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
	for (var i=0; i < obj.delegates.length; i++) {
		var delegate = obj.delegates[i];
		if (delegate[method]) {
			var thisResult = delegate[method](obj);
			if (result==null && typeof(thisResult)!='undefined') {
				result = thisResult;
			}
		}
	};
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