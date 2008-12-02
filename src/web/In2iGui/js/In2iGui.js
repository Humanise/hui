var in2igui = {};

/**
 * @constructor
 * The base class of the In2iGui framework
 */
function In2iGui() {
	this.domLoaded = false;
	this.overflows = null;
	this.delegates = [];
	this.objects = $H();
	this.addBehavior();
}

In2iGui.latestObjectIndex=0;

In2iGui.latestIndex=500;
In2iGui.latestPanelIndex=1000;
In2iGui.latestAlertIndex=1500;
In2iGui.latestTopIndex=2000;
In2iGui.toolTips = {};

In2iGui.browser = {};
In2iGui.browser.opera = /opera/i.test(navigator.userAgent);
In2iGui.browser.msie = !In2iGui.browser.opera && /MSIE/.test(navigator.userAgent);
In2iGui.browser.msie7 = navigator.userAgent.indexOf('MSIE 7')!=-1;
In2iGui.browser.webkit = navigator.userAgent.indexOf('WebKit')!=-1;
In2iGui.browser.gecko = !In2iGui.browser.webkit && navigator.userAgent.indexOf('Gecko')!=-1;

/**
 * Gets the one instance of In2iGui
 */
In2iGui.get = function(name) {
	if (!In2iGui.instance) {
		In2iGui.instance = new In2iGui();
	}
	if (name) {
		return In2iGui.instance.objects.get(name);
	} else {
		return In2iGui.instance;
	}
}

document.observe('dom:loaded', function() {In2iGui.get().ignite();});

In2iGui.dwrErrorhandler = function(msg,e) {
	N2i.log(msg);
	N2i.log(e);
	In2iGui.get().showAlert({title:'An unexpected error occurred!',text:msg,emotion:'gasp'});
}

In2iGui.prototype = {
	ignite : function(id) {
		if (window.dwr) {
			if (dwr && dwr.engine && dwr.engine.setErrorHandler) {
				dwr.engine.setErrorHandler(In2iGui.dwrErrorhandler);
			}
		}
		this.domLoaded = true;
		this.resize();
		In2iGui.callSuperDelegates(this,'interfaceIsReady');
	},
	addBehavior : function(id) {
		var self = this;
		N2i.Event.addListener(window,'resize',function() {
			self.resize();
		});
	},
	addDelegate : function(delegate) {
		this.delegates[this.delegates.length] = delegate;
	},
	getTopPad : function(element) {
		var pad = 0;
		var all = parseInt(N2i.getStyle(element,'padding'));
		var top = parseInt(N2i.getStyle(element,'padding-top'));
		if (all) pad+=all;
		if (top) pad+=top;
		return pad;
	},
	getBottomPad : function(element) {
		var pad = 0;
		var all = parseInt(N2i.getStyle(element,'padding'));
		var bottom = parseInt(N2i.getStyle(element,'padding-bottom'));
		if (all) pad+=all;
		if (bottom) pad+=bottom;
		return pad;
	},
	resize : function(id) {
		if (!this.overflows) return;
		var height = N2i.Window.getInnerHeight();
		this.overflows.each(function(overflow) {
			if (In2iGui.browser.webkit || In2iGui.browser.gecko) {
				overflow.element.style.display='none';
				overflow.element.style.width = overflow.element.parentNode.clientWidth+'px';
				overflow.element.style.display='';
			}
			overflow.element.style.height = height+overflow.diff+'px';
		});
	},
	registerOverflow : function(id,diff) {
		if (!this.overflows) this.overflows=[];
		var overflow = $(id);
		this.overflows.push({element:overflow,diff:diff});
	},
	alert : function(options,callBack) {
		if (!this.alertBox) {
			this.alertBox = In2iGui.Alert.create(null,options);
			this.alertBoxButton = In2iGui.Button.create('in2iGuiAlertBoxButton',{text : 'OK'});
			this.alertBoxButton.addDelegate(this);
			this.alertBox.addButton(this.alertBoxButton);
		} else {
			this.alertBox.update(options);
		}
		this.alertBoxCallBack = callBack;
		this.alertBoxButton.setText(options.button ? options.button : 'OK')
		this.alertBox.show();
	},
	click$in2iGuiAlertBoxButton : function() {
		In2iGui.get().alertBox.hide();
		if (this.alertBoxCallBack) {
			this.alertBoxCallBack();
			this.alertBoxCallBack = null;
		}
	},
	/** @deprecated */
	showAlert : function(options) {
		this.alert(options);
	},
	confirm : function(name,options) {
		var alert = In2iGui.get(name);
		if (!alert) {
			alert = In2iGui.Alert.create(name,options);
			var cancel = In2iGui.Button.create(name+'_cancel',{text : options.cancel || 'Cancel',highlighted:options.highlighted=='cancel'});
			cancel.addDelegate({buttonWasClicked:function(){
				In2iGui.get(name).hide();
				In2iGui.callDelegates(In2iGui.get(name),'cancel');
			}});
			alert.addButton(cancel);
		
			var ok = In2iGui.Button.create(name+'_ok',{text : options.ok || 'OK',highlighted:options.highlighted=='ok'});
			ok.addDelegate({buttonWasClicked:function(){
				In2iGui.get(name).hide();
				In2iGui.callDelegates(In2iGui.get(name),'ok');
			}});
			alert.addButton(ok);
		} else {
			alert.update(options);
			In2iGui.get(name+'_ok').setText(options.ok || 'ok');
			In2iGui.get(name+'_ok').setHighlighted(options.highlighted=='ok');
			In2iGui.get(name+'_cancel').setText(options.ok || 'cancel');
			In2iGui.get(name+'_cancel').setHighlighted(options.highlighted=='cancel');
			if (options.cancel) In2iGui.get(name+'_cancel').setText(options.cancel);
		}
		alert.show();
	},
	changeState : function(state) {
		if (this.state==state) return;
		var objects = this.objects.values();
		objects.each(function(obj) {
			if (obj.state) {
				if (obj.state==state) obj.show();
				else obj.hide();
			}
		});
	},
	getDescendants : function(widget) {
		var desc = [];
		var e = widget.getElement();
		if (e) {
			var d = e.descendants();
			var self = this;
			d.each(function(node) {
				self.objects.values().each(function(obj) {
					if (obj.getElement()==node) {
						desc.push(obj);
					}
				})
			});
		}
		return desc;
	}
}

///////////////////////////////// Indexes /////////////////////////////

In2iGui.nextIndex = function() {
	In2iGui.latestIndex++;
	return 	In2iGui.latestIndex;
}

In2iGui.nextPanelIndex = function() {
	In2iGui.latestPanelIndex++;
	return 	In2iGui.latestPanelIndex;
}
In2iGui.nextAlertIndex = function() {
	In2iGui.latestAlertIndex++;
	return 	In2iGui.latestAlertIndex;
}
In2iGui.nextTopIndex = function() {
	In2iGui.latestTopIndex++;
	return 	In2iGui.latestTopIndex;
}

///////////////////////////////// Curtain /////////////////////////////

In2iGui.showCurtain = function(widget,zIndex) {
	if (!widget.curtain) {
		widget.curtain = N2i.create('div',{'class':'in2igui_curtain'},{'z-index':'none'});
		widget.curtain.onclick = function() {
			if (widget.curtainWasClicked) {
				widget.curtainWasClicked();
			}
		}
		document.body.appendChild(widget.curtain);
	}
	widget.curtain.style.height=N2i.getDocumentHeight()+'px';
	widget.curtain.style.zIndex=zIndex;
	N2i.setOpacity(widget.curtain,0);
	widget.curtain.style.display='block';
	$ani(widget.curtain,'opacity',.5,1000,{ease:N2i.Animation.slowFastSlow});
}

In2iGui.hideCurtain = function(widget) {
	if (widget.curtain) {
		$ani(widget.curtain,'opacity',0,200,{hideOnComplete:true});
	}
}

//////////////////////////////// Message //////////////////////////////

in2igui.showMessage = function(msg) {
	if (!In2iGui.message) {
		In2iGui.message = new Element('div',{'class':'in2igui_message'}).update('<div><div></div></div>');
		document.body.appendChild(In2iGui.message);
	}
	In2iGui.message.select('div')[1].update(msg);
	In2iGui.message.setStyle({'display':'block',zIndex:In2iGui.nextTopIndex()});
	if (!In2iGui.browser.msie) {
		In2iGui.message.setStyle({opacity:0});
	}
	In2iGui.message.setStyle({marginLeft:(In2iGui.message.getWidth()/-2)+'px',marginTop:N2i.Window.getScrollTop()+'px'});
	if (!In2iGui.browser.msie) {
		$ani(In2iGui.message,'opacity',1,300);
	}
}

in2igui.hideMessage = function() {
	if (In2iGui.message) {
		if (!In2iGui.browser.msie) {
			$ani(In2iGui.message,'opacity',0,300,{hideOnComplete:true});
		} else {
			In2iGui.message.setStyle({display:'none'});
		}
	}
}

in2igui.showToolTip = function(options) {
	var key = options.key || 'common';
	var t = In2iGui.toolTips[key];
	if (!t) {
		t = new Element('div',{'class':'in2igui_tooltip'}).update('<div><div></div></div>').setStyle({display:'none'});
		document.body.appendChild(t);
		In2iGui.toolTips[key] = t;
	}
	t.onclick = function() {in2igui.hideToolTip(options)};
	var n = $(options.element);
	var pos = n.cumulativeOffset();
	t.select('div')[1].update(options.text);
	if (t.style.display=='none' && !In2iGui.browser.msie) t.setStyle({opacity:0});
	t.setStyle({'display':'block',zIndex:In2iGui.nextTopIndex()});
	t.setStyle({left:(pos.left-t.getWidth()+4)+'px',top:(pos.top+2-(t.getHeight()/2)+(n.getHeight()/2))+'px'});
	if (!In2iGui.browser.msie) {
		$ani(t,'opacity',1,300);
	}
}

in2igui.hideToolTip = function(options) {
	var key = options ? options.key || 'common' : 'common';
	var t = In2iGui.toolTips[key];
	if (t) {
		if (!In2iGui.browser.msie) {
			$ani(t,'opacity',0,300,{hideOnComplete:true});
		} else {
			t.setStyle({display:'none'});
		}
	}
}

/////////////////////////////// Utilities /////////////////////////////

In2iGui.isWithin = function(e,element) {
	Event.extend(e);
	var offset = element.cumulativeOffset();
	var dims = element.getDimensions();
	return e.pointerX()>offset.left && e.pointerX()<offset.left+dims.width && e.pointerY()>offset.top && e.pointerY()<offset.top+dims.height;
}

In2iGui.getIconUrl = function(icon,size) {
	return In2iGui.context+'/In2iGui/icons/'+icon+size+'.png';
}

In2iGui.onDomReady = function(func) {
	document.observe('dom:loaded', func);
}

/////////////////////////////// Animation /////////////////////////////

in2igui.fadeIn = function(node,time) {
	if (node.style.display=='none') {
		node.setStyle({opacity:0,display:''});
	}
	$ani(node,'opacity',1,time);
}

in2igui.fadeOut = function(node,time) {
	$ani(node,'opacity',0,time,{hideOnComplete:true});
}

//////////////////////////// Positioning /////////////////////////////

In2iGui.positionAtElement = function(element,target,options) {
	options = options || {};
	element = $(element);
	target = $(target);
	var origDisplay = element.getStyle('display');
	if (origDisplay=='none') {
		element.setStyle({'visibility':'hidden','display':'block'});
	}
	var pos = target.cumulativeOffset();
	var left = pos.left;
	var top = pos.top;
	if (options.horizontal && options.horizontal=='right') {
		left = left+target.getWidth()-element.getWidth();
	}
	if (options.vertical && options.vertical=='topOutside') {
		top = top-element.getHeight();
	}
	element.setStyle({'left':left+'px','top':top+'px'});
	if (origDisplay=='none') {
		element.setStyle({'visibility':'visible','display':'none'});
	}
}


//////////////////////////////// Drag drop //////////////////////////////

In2iGui.getDragProxy = function() {
	if (!In2iGui.dragProxy) {
		In2iGui.dragProxy = N2i.create('div',{'class':'in2igui_dragproxy'},{'display':'none'});
		document.body.appendChild(In2iGui.dragProxy);
	}
	return In2iGui.dragProxy;
}

In2iGui.startDrag = function(e,element,options) {
	var info = element.dragDropInfo;
	In2iGui.dropTypes = In2iGui.findDropTypes(info);
	if (!In2iGui.dropTypes) return;
	var event = new N2i.Event(e);
	var proxy = In2iGui.getDragProxy();
	N2i.addListener(document.body,'mousemove',In2iGui.dragListener);
	N2i.addListener(document.body,'mouseup',In2iGui.dragEndListener);
	In2iGui.dragInfo = info;
	if (info.icon) {
		proxy.style.backgroundImage = 'url('+In2iGui.getIconUrl(info.icon,1)+')';
	}
	In2iGui.startDragPos = {top:event.mouseTop(),left:event.mouseLeft()};
	proxy.innerHTML = '<span>'+info.title+'</span>' || '###';
	In2iGui.dragging = true;
}

In2iGui.findDropTypes = function(drag) {
	var gui = In2iGui.get();
	var drops = null;
	for (var i=0; i < gui.delegates.length; i++) {
		if (gui.delegates[i].dragDrop) {
			for (var j=0; j < gui.delegates[i].dragDrop.length; j++) {
				var rule = gui.delegates[i].dragDrop[j];
				if (rule.drag==drag.kind) {
					if (drops==null) drops={};
					drops[rule.drop] = {};
				}
			};
		}
	}
	return drops;
}

In2iGui.dragListener = function(e) {
	var event = new N2i.Event(e);
	In2iGui.dragProxy.style.left = (event.mouseLeft()+10)+'px';
	In2iGui.dragProxy.style.top = event.mouseTop()+'px';
	In2iGui.dragProxy.style.display='block';
	var target = In2iGui.findDropTarget(event.getTarget());
	if (target && In2iGui.dropTypes[target.dragDropInfo['kind']]) {
		if (In2iGui.latestDropTarget) {
			N2i.removeClass(In2iGui.latestDropTarget,'in2igui_drop');
		}
		N2i.addClass(target,'in2igui_drop');
		In2iGui.latestDropTarget = target;
	} else if (In2iGui.latestDropTarget) {
		N2i.removeClass(In2iGui.latestDropTarget,'in2igui_drop');
		In2iGui.latestDropTarget = null;
	}
	return false;
}

In2iGui.findDropTarget = function(node) {
	while (node) {
		if (node.dragDropInfo) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}

In2iGui.dragEndListener = function(event) {
	N2i.removeListener(document.body,'mousemove',In2iGui.dragListener);
	N2i.removeListener(document.body,'mouseup',In2iGui.dragEndListener);
	In2iGui.dragging = false;
	if (In2iGui.latestDropTarget) {
		N2i.removeClass(In2iGui.latestDropTarget,'in2igui_drop');
		In2iGui.callDelegatesDrop(In2iGui.dragInfo,In2iGui.latestDropTarget.dragDropInfo);
		In2iGui.dragProxy.style.display='none';
	} else {
		$ani(In2iGui.dragProxy,'left',(In2iGui.startDragPos.left+10)+'px',300,{ease:N2i.Animation.fastSlow});
		$ani(In2iGui.dragProxy,'top',(In2iGui.startDragPos.top-5)+'px',300,{ease:N2i.Animation.fastSlow,hideOnComplete:true});
	}
	In2iGui.latestDropTarget=null;
}

In2iGui.dropOverListener = function(event) {
	if (In2iGui.dragging) {
		//this.style.backgroundColor='#3875D7';
	}
}

In2iGui.dropOutListener = function(event) {
	if (In2iGui.dragging) {
		//this.style.backgroundColor='';
	}
}

/* ****************** Delegating *************** */

In2iGui.extend = function(obj) {
	if (!obj.name) {
		In2iGui.latestObjectIndex++;
		obj.name = 'unnamed'+In2iGui.latestObjectIndex;
	}
	In2iGui.get().objects.set(obj.name,obj);
	obj.delegates = [];
	obj.addDelegate = function(delegate) {
		this.delegates[this.delegates.length] = delegate;
	}
	if (!obj.getElement) {
		obj.getElement = function() {
			return this.element;
		}
	}
	if (!obj.valueForProperty) {
		obj.valueForProperty = function(p) {return this[p]};
	}
}

In2iGui.callDelegatesDrop = function(dragged,dropped) {
	var gui = In2iGui.get();
	var result = null;
	for (var i=0; i < gui.delegates.length; i++) {
		if (gui.delegates[i]['drop$'+dragged.kind+'$'+dropped.kind]) {
			gui.delegates[i]['drop$'+dragged.kind+'$'+dropped.kind](dragged,dropped);
		}
	}
}

In2iGui.callDelegates = function(obj,method,value,event) {
	if (typeof(value)=='undefined') value=obj;
	var result = null;
	if (obj.delegates) {
		for (var i=0; i < obj.delegates.length; i++) {
			var delegate = obj.delegates[i];
			var thisResult = null;
			if (obj.name && delegate[method+'$'+obj.name]) {
				thisResult = delegate[method+'$'+obj.name](value,event);
			} else if (obj.kind && delegate[method+'$'+obj.kind]) {
				thisResult = delegate[method+'$'+obj.kind](value,event);
			} else if (delegate[method]) {
				thisResult = delegate[method](value,event);
			}
			if (result==null && thisResult!=null && typeof(thisResult)!='undefined') {
				result = thisResult;
			}
		};
	}
	var superResult = In2iGui.callSuperDelegates(obj,method,value,event);
	if (result==null && superResult!=null) result = superResult;
	return result;
}

In2iGui.callSuperDelegates = function(obj,method,value,event) {
	if (typeof(value)=='undefined') value=obj;
	var gui = In2iGui.get();
	var result = null;
	for (var i=0; i < gui.delegates.length; i++) {
		var delegate = gui.delegates[i];
		var thisResult = null;
		if (obj.name && delegate[method+'$'+obj.name]) {
			thisResult = delegate[method+'$'+obj.name](value,event);
		} else if (obj.kind && delegate[method+'$'+obj.kind]) {
			thisResult = delegate[method+'$'+obj.kind](value,event);
		} else if (delegate[method]) {
			thisResult = delegate[method](value,event);
		}
		if (result==null && thisResult!=null && typeof(thisResult)!='undefined') {
			result = thisResult;
		}
	};
	return result;
}

////////////////////////////// Bindings ///////////////////////////

In2iGui.firePropertyChange = function(obj,name,value) {
	In2iGui.callDelegates(obj,'propertyChanged',{property:name,value:value});
}

In2iGui.bind = function(expression,delegate) {
	if (expression.charAt(0)=='@') {
		var pair = expression.substring(1).split('.');
		var obj = eval(pair[0]);
		obj.addDelegate({
			propertyChanged : function(prop) {
				if (prop.property==pair[1]) {
					delegate(prop.value);
				}
			}
		});
		return obj.valueForProperty(pair[1]);
	}
	return expression;
}

//////////////////////////////// Data /////////////////////////////

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
		if (gui.objects.get(data[i].name)) {
			gui.objects.get(data[i].name).updateFromObject(data[i]);
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
			if (name && name!='' && gui.objects.get(name)) {
				gui.objects.get(name).updateFromNode(children[i]);
			}
		}
	};
	delegate.onSuccess();
}

In2iGui.jsonResponse = function(t,key) {
	if (!t.responseXML || !t.responseXML.documentElement) {
		var str = t.responseText.replace(/^\s+|\s+$/g, '');
		if (str.length>0) {
			var json = t.responseText.evalJSON(true);
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
		options.parameters[key]=Object.toJSON(data[key])
	}
	$get(url,delegate,options)
}

In2iGui.parseItems = function(doc) {
	var out = [];
	var items = doc.getElementsByTagName('item');
	for (var i=0; i < items.length; i++) {
		var item = items[i];
		var title = item.getAttribute('title');
		var value = item.getAttribute('value');
		var icon = item.getAttribute('icon');
		var kind = item.getAttribute('kind');
		out.push({title:title,value:value,icon:icon,kind:kind});
	}
	return out;
}

////////////////////////////////// Source ///////////////////////////

In2iGui.Source = function(id,name,options) {
	this.options = N2i.override({url:null,dwr:null},options);
	this.parameters = [];
	In2iGui.extend(this);
	this.busy=false;
	var self = this;
	In2iGui.onDomReady(function() {self.init()});
}

In2iGui.Source.prototype = {
	init : function() {
		var self = this;
		this.parameters.each(function(parm) {
			parm.value = In2iGui.bind(parm.value,function(value) {
				self.changeParameter(parm.key,value);
			});
		})
		this.refresh();
	},
	refresh : function() {
		if (this.busy) {
			this.pendingRefresh = true;
			return;
		}
		this.pendingRefresh = false;
		var self = this;
		if (this.options.url) {
			this.busy=true;
			In2iGui.callDelegates(this,'sourceIsBusy',data);
			new Ajax.Request(this.options.url, {onSuccess: function(t) {self.parse(t)}});
		} else if (this.options.dwr) {
			var pair = this.options.dwr.split('.');
			var facade = eval(pair[0]);
			var method = pair[1];
			var args = facade[method].argumentNames();
			for (var i=0; i < args.length; i++) {
				if (this.parameters[i])
					args[i]=this.parameters[i].value || null;
			};
			args[args.length-1]=function(r) {self.parseDWR(r)};
			this.busy=true;
			In2iGui.callDelegates(this,'sourceIsBusy');
			facade[method].apply(facade,args);
		}
	},
	end : function() {
		In2iGui.callDelegates(this,'sourceIsNotBusy');
		this.busy=false;
		if (this.pendingRefresh) {
			this.refresh();
		}
	},
	parse : function(t) {
		if (t.responseXML) {
			this.parseXML(t.responseXML);
		}
		this.end();
	},
	parseXML : function(doc) {
		if (doc.documentElement.tagName=='items') {
			var data = In2iGui.parseItems(doc);
			In2iGui.callDelegates(this,'itemsLoaded',data);
		}
	},
	parseDWR : function(data) {
		In2iGui.callDelegates(this,'objectsLoaded',data);
		this.end();
	},
	addParameter : function(parm) {
		this.parameters.push(parm);
	},
	changeParameter : function(key,value) {
		this.parameters.each(function(p) {
			if (p.key==key) p.value=value;
		})
		var self = this;
		window.clearTimeout(this.paramDelay);
		this.paramDelay = window.setTimeout(function() {
			this.refresh();
		}.bind(this),100)
	}
}

/////////////////////////////////////// Localization //////////////////////////////////

In2iGui.localize = function(loc) {
	//alert(Object.toJSON(loc));
}

///////////////////////////////////// Common text field ////////////////////////

In2iGui.TextField = function(id,name,options) {
	this.options = N2i.override({placeholder:null,placeholderElement:null},options);
	var e = this.element = $(id);
	this.element.setAttribute('autocomplete','off');
	this.value = this.element.value;
	this.isPassword = this.element.type=='password';
	this.name = name;
	In2iGui.extend(this);
	this.addBehavior();
	if (this.options.placeholderElement && this.value!='') {
		in2igui.fadeOut(this.options.placeholderElement,0);
	}
	this.checkPlaceholder();
	if (e==document.activeElement) this.focused();
}

In2iGui.TextField.prototype = {
	addBehavior : function() {
		var self = this;
		var e = this.element;
		var p = this.options.placeholderElement;
		e.observe('keyup',this.keyDidStrike.bind(this));
		e.observe('focus',this.focused.bind(this));
		e.observe('blur',this.checkPlaceholder.bind(this));
		if (p) {
			p.setStyle({cursor:'text'});
			p.observe('mousedown',this.focus.bind(this)).observe('click',this.focus.bind(this));
		}
	},
	focused : function() {
		var e = this.element;
		var p = this.options.placeholderElement;
		if (p && e.value=='') {
			in2igui.fadeOut(p,0);
		}
		if (e.value==this.options.placeholder) {
			e.value='';
			e.removeClassName('in2igui_placeholder');
			if (this.isPassword && !In2iGui.browser.msie) {
				e.type='password';
				if (In2iGui.browser.webkit) {
					e.select();
				}
			}
		}
		e.select();		
	},
	checkPlaceholder : function() {
		if (this.options.placeholderElement && this.value=='') {
			in2igui.fadeIn(this.options.placeholderElement,200);
		}
		if (this.options.placeholder && this.value=='') {
			if (!this.isPassword || !In2iGui.browser.msie) {
				this.element.value=this.options.placeholder;
				this.element.addClassName('in2igui_placeholder');
			}
			if (this.isPassword && !In2iGui.browser.msie) {
				this.element.type='text';
			}
		} else {
			this.element.removeClassName('in2igui_placeholder');
			if (this.isPassword && !In2iGui.browser.msie) {
				this.element.type='password';
			}
		}
	},
	keyDidStrike : function() {
		if (this.value!=this.element.value && this.element.value!=this.options.placeholder) {
			this.value = this.element.value;
			In2iGui.callDelegates(this,'valueChanged');
		}
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		if (value==undefined || value==null) value='';
		this.value = value;
		this.element.value = value;
	},
	isEmpty : function() {
		return this.value=='';
	},
	isBlank : function() {
		return this.value.strip()=='';
	},
	focus : function() {
		this.element.focus();
	},
	setError : function(error) {
		var isError = error ? true : false;
		this.element.setClassName('in2igui_field_error',isError);
		if (typeof(error) == 'string') {
			in2igui.showToolTip({text:error,element:this.element,key:this.name});
		}
		if (!isError) {
			in2igui.hideToolTip({key:this.name});
		}
	}
}

////////////////////////////////////// Info view /////////////////////////////

In2iGui.InfoView = function(id,name,options) {
	this.options = {clickObjects:false};
	N2i.override(this.options,options);
	this.element = $(id);
	this.body = this.element.select('tbody')[0];
	this.name = name;
	In2iGui.extend(this);
}

In2iGui.InfoView.create = function(name,options) {
	options = options || {};
	var element = new Element('div',{'class':'in2igui_infoview'});
	if (options.height) {
		element.setStyle({height:options.height+'px','overflow':'auto','overflowX':'hidden'});
	}
	if (options.margin) {
		element.setStyle({margin:options.margin+'px'});
	}
	element.update('<table><tbody></tbody></table>');
	return new In2iGui.InfoView(element,name,options);
}

In2iGui.InfoView.prototype = {
	addHeader : function(text) {
		var row = new Element('tr');
		row.insert(new Element('th',{'class' : 'in2igui_infoview_header','colspan':'2'}).insert(text));
		this.body.insert(row);
	},
	addProperty : function(label,text) {
		var row = new Element('tr');
		row.insert(new Element('th').insert(label));
		row.insert(new Element('td').insert(text));
		this.body.insert(row);
	},
	addObjects : function(label,objects) {
		if (!objects || objects.length==0) return;
		var row = new Element('tr');
		row.insert(new Element('th').insert(label));
		var cell = new Element('td');
		var click = this.options.clickObjects;
		objects.each(function(obj) {
			var node = new Element('div').insert(obj.title);
			if (click) {
				node.addClassName('in2igui_infoview_click')
				node.observe('click',function() {
					In2iGui.callDelegates(this,'objectWasClicked',obj);
				});
			}
			cell.insert(node);
		});
		row.insert(cell);
		this.body.insert(row);
	},
	setBusy : function(busy) {
		if (busy) {
			this.element.addClassName('in2igui_infoview_busy');
		} else {
			this.element.removeClassName('in2igui_infoview_busy');
		}
	},
	clear : function() {
		this.body.update();
	},
	update : function(data) {
		this.clear();
		for (var i=0; i < data.length; i++) {
			switch (data[i].type) {
				case 'header': this.addHeader(data[i].value); break;
				case 'property': this.addProperty(data[i].label,data[i].value); break;
				case 'objects': this.addObjects(data[i].label,data[i].value); break;
			}
		};
	}
}


/********************************* Prototype extensions **************************/

Element.addMethods({
	setClassName : function(element,name,set) {
		if (set) {
			element.addClassName(name);
		} else {
			element.removeClassName(name);
		}
		return element;
	}
});

/* EOF */
