var N2i = {};

/**
 * @todo Maybe improve performace
 */
function $id() {
	var elements = new Array();

	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string') {
			element = document.getElementById(element);
		}
		if (arguments.length == 1) {
			return element;			
		}
		elements.push(element);
	}

	return elements;
}

function $class(className,parentElement) {
	var children = ($id(parentElement) || document.body).getElementsByTagName('*');
	var elements = [];
	for (var i=0;i<children.length;i++) {
		if (N2i.hasClass(children[i],className)) {
			elements[elements.length] = children[i];
		}
	}
	return elements;
}

function $firstClass(className,parentElement) {
	var children = ($id(parentElement) || document.body).getElementsByTagName('*');
	for (var i=0;i<children.length;i++) {
		if (N2i.hasClass(children[i],className)) {
			return children[i];
		}
	}
	return null;
}

function $tag(name,parentElement) {
	parentElement = parentElement ? $id(parentElement) : document.body;
	return parentElement.getElementsByTagName(name);
}

function $ani(element,style,value,duration,delegate) {
	if (N2i.Animation) {
		N2i.Animation.get(element).animate(null,value,style,duration,delegate);
	}
}

function $get(url,delegate,options) {
	var req = new N2i.Request(delegate);
	req.request(url,options);
}

/**
 * Implement push on array if not implemented
 */
if (!Array.prototype.push) {
	Array.prototype.push = function() {
		var startLength = this.length;
		for (var i = 0; i < arguments.length; i++) {
			this[startLength + i] = arguments[i];
		}
		return this.length;
	}
}


///////////////////////////////////////// Util //////////////////////////////////////

N2i.override = function(original,subject) {
	if (subject) {
		for (prop in subject) {
			original[prop] = subject[prop];
		}
	}
}

N2i.camelize = function(str) {
    var oStringList = str.split('-');
    if (oStringList.length == 1) return oStringList[0];

    var camelizedString = str.indexOf('-') == 0
      ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
      : oStringList[0];

    for (var i = 1, len = oStringList.length; i < len; i++) {
      var s = oStringList[i];
      camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }

    return camelizedString;
}

N2i.log = function(obj) {
	try {
		console.log(obj);
	} catch (ignore) {};
}

N2i.objToString = function (obj,level) {
	var str = '';
	level = level | 0;
	level+=2;
	if (typeof(obj)=='object') {
		str+='{';
		for (var prop in obj) {
			var value = obj[prop];
			if (value==null) {
				value='null';
			} else if (typeof(value)=='string') {
				value = '\''+value+'\'';
			} else if (typeof(value)=='object') {
				value = N2i.objToString(value,level);
			}
			str+='\n';
			for (var i=0;i<level;i++) {
				str+=' ';
			}
			str+=prop+' : '+value;
		}
		str+='\n}';
	}
	else {
		str=obj;
	}
	return str;
}

/////////////////////////////////////// Element /////////////////////////////////////

N2i.create = function(name,attributes,styles,properties) {
	var element = document.createElement(name);
	if (attributes) {
		for (attribute in attributes) {
			if (attribute=='class') {
				element.className = attributes[attribute];
			} else {
				element.setAttribute(attribute,attributes[attribute]);
			}
		}
	}
	if (styles) {
		for (style in styles) {
			element.style[style] = styles[style];
		}
	}
	if (properties) {
		for (property in properties) {
			element[property] = properties[property];
		}
	}
	return element;
}

N2i.removeChildren = function(node) {
	var children = node.childNodes;
	for (var i = children.length - 1; i >= 0; i--){
		node.removeChild(children[i]);
	};
}

N2i.ELEMENT_NODE=1;
N2i.ATTRIBUTE_NODE=2;
N2i.TEXT_NODE=3;

N2i.Element = {}

N2i.Element.removeClassName = N2i.removeClass = function(element, className) {
	element = $id(element);
	if (!element) return;		

	var newClassName = '';
	var a = element.className.split(' ');
	for (var i = 0; i < a.length; i++) {
		if (a[i] != className) {
			if (i > 0) {
				newClassName += ' ';				
			}
			newClassName += a[i];
		}
	}
	element.className = newClassName;
}

N2i.Element.hasClassName = N2i.hasClass = function(element, className) {
	element = $id(element);
	if (!element) return;
	alert
	var a = element.className.split(/\s+/);
	for (var i = 0; i < a.length; i++) {
		if (a[i] == className) {
			return true;
		}
	}
	return false;
}

N2i.Element.addClassName = N2i.addClass = function(element, className) {
    element = $id(element);
	if (!element) return;
	
    N2i.Element.removeClassName(element, className);
    element.className += ' ' + className;
}

N2i.toggleClass = function(element,className) {
	if (N2i.hasClass(element,className)) {
		N2i.removeClass(element,className);
	} else {
		N2i.addClass(element,className);
	}
}

N2i.setClass = function(element,className,add) {
	if (add) {
		N2i.addClass(element,className);
	} else {
		N2i.removeClass(element,className);
	}
}


N2i.Element.scrollTo = function(element) {
	element = $id(element);
	window.scrollTo(N2i.Element.getLeft(element), N2i.Element.getTop(element)-20);
}

N2i.Element.getLeft = N2i.getLeft = function(element) {
    element = $id(element);
	if (element) {
		xPos = element.offsetLeft;
		tempEl = element.offsetParent;
		while (tempEl != null) {
			xPos += tempEl.offsetLeft;
			tempEl = tempEl.offsetParent;
		}
		return xPos;
	}
	else return 0;
}


N2i.Element.getTop = N2i.getTop = function(element) {
    element = $id(element);
	if (element) {
		yPos = element.offsetTop;
		tempEl = element.offsetParent;
		while (tempEl != null) {
			yPos += tempEl.offsetTop;
			tempEl = tempEl.offsetParent;
		}
		return yPos;
	}
	else return 0;
}

/**
 * Finds an elements width as displayed by the browser
 * @param {Object} obj The element to analyze
 * @return {int} The width in pixels of the element
 */
N2i.Element.getWidth = N2i.getWidth = function(element) {
	element = $id(element);
	return element.offsetWidth;
}

/**
 * Finds an elements height as displayed by the browser
 * @param {Object} obj The element to analyze
 * @return {int} The height in pixels of the element
 */
N2i.Element.getHeight = N2i.getHeight = function(element) {
	element = $id(element);
	return element.offsetHeight;
}

N2i.Element.getRect = function(element) {
	return {
		left:	N2i.Element.getLeft(element),
		top:	N2i.Element.getTop(element),
		width:	N2i.Element.getWidth(element),
		height:	N2i.Element.getHeight(element)
	};
}


N2i.Element.getStyle = N2i.getStyle = function(element, style) {
	element = $id(element);
	var cameled = N2i.camelize(style);
	var value = element.style[cameled];
	if (!value) {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			var css = document.defaultView.getComputedStyle(element, null);
			value = css ? css.getPropertyValue(style) : null;
		} else if (element.currentStyle) {
			value = element.currentStyle[cameled];
		}
	}
	if (window.opera && ['left', 'top', 'right', 'bottom'].include(style)) {
		if (N2i.Element.getStyle(element, 'position') == 'static') value = 'auto';
	}
	return value == 'auto' ? null : value;
}

N2i.setOpacity = function(element,opacity) {
	if (N2i.isIE()) {
			alert(opacity);
		if (opacity==1) {
			element.style['filter']=null;
		} else {
			element.style['filter']='alpha(opacity='+(opacity*100)+')';
		}
	} else {
		element.style['opacity']=opacity;
	}
}

////////////////////////////////////// Window ////////////////////////////////


N2i.Window = function() {}

/**
 * Finds how far the window has scrolled from the top
 * @return {int} The number of pixels the window is scrolled from the top
 */
N2i.Window.getScrollTop = function() {
	var x,y;
	if (self.pageYOffset) // all except Explorer
	{
		y = self.pageYOffset;
	}
	else if (document.documentElement && document.documentElement.scrollTop)
		// Explorer 6 Strict
	{
		y = document.documentElement.scrollTop;
	}
	else if (document.body) // all other Explorers
	{
		y = document.body.scrollTop;
	}
	return y;
}

/**
 * Finds how far the window has scrolled from the left
 * @return {int} The number of pixels the window is scrolled from the left
 */
N2i.Window.getScrollLeft = function() {
	var x;
	if (self.pageYOffset) // all except Explorer
	{
		x = self.pageXOffset;
	}
	else if (document.documentElement && document.documentElement.scrollTop)
		// Explorer 6 Strict
	{
		x = document.documentElement.scrollLeft;
	}
	else if (document.body) // all other Explorers
	{
		x = document.body.scrollLeft;
	}
	return x;
}


/**
 * Finds how much the window is scrolled
 * @return {Object} An object with left,top
 */
N2i.Window.getScrollPosition = function() {
	return {
		left:	N2i.Window.getScrollLeft(),
		top:	N2i.Window.getScrollTop()
	};
}

/**
 * Finds the height of the windows visible view of the document
 * @return {int} The height of the windows view of the document in pixels
 */
N2i.Window.getInnerHeight = function() {
	var y;
	if (self.innerHeight) // all except Explorer
	{
		y = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
		// Explorer 6 Strict Mode
	{
		y = document.documentElement.clientHeight;
	}
	else if (document.body) // other Explorers
	{
		y = document.body.clientHeight;
	}
	return y;
}

/**
 * Finds the width of the windows visible view of the document
 * @return {int} The width of the windows view of the document in pixels
 */
N2i.Window.getInnerWidth = function() {
	var x;
	if (self.innerHeight) // all except Explorer
	{
		x = self.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
		// Explorer 6 Strict Mode
	{
		x = document.documentElement.clientWidth;
	}
	else if (document.body) // other Explorers
	{
		x = document.body.clientWidth;
	}
	return x;
}


/**
 * Finds the dimensions of the visible area of the document
 * @return {Object} An object with left,top,width,height
 */
N2i.Window.getDocumentRect = function() {
	return {
		left:	0,
		top:	0,
		width:	N2i.Window.getInnerWidth(),
		height:	N2i.Window.getInnerHeight()
	};
}

////////////////////////////////////// Event /////////////////////////////////

/**
 * Creates a new In2iEvent object from an event
 * @class A wrapper for an event
 * @constructor
 */
N2i.Event = function(event) {
    if (!event) {
		this.event = window.event;
	} else {
		this.event=event;
	}
}

/**
 * Get the cursors distance to the left of the document
 * @return {int} The distance of the cursor to the left of the document
 */
N2i.Event.prototype.mouseLeft = function() {
    var left = 0;
	if (this.event) {
	    if (this.event.pageX) {
		    left = this.event.pageX;
	    }
	    else if (this.event.clientX) {
		    left = this.event.clientX + document.body.scrollLeft;
	    }
	}
    return left;
}


N2i.Event.prototype.isReturnKey = function() {
	return this.event.keyCode==13;
}


/**
 * Get the cursors distance to the top of the document
 * @return {int} The distance of the cursor to the top of the document
 */
N2i.Event.prototype.mouseTop = function() {
    var top = 0;
	if (this.event) {
	    if (this.event.pageY) {
		    top = this.event.pageY;
	    }
	    else if (this.event.clientY) {
		    top = this.event.clientY + document.body.scrollTop;
	    }
	}
    return top;
}


N2i.Event.addListener = function(el,type,listener,useCapture) {
	el = $id(el);
	if(document.addEventListener) {
		// W3C DOM Level 2 Events - used by Mozilla, Opera and Safari
		if(!useCapture) {useCapture = false;} else {useCapture = true;} {
			el.addEventListener(type,listener,useCapture);
		}
	} else {
		// MS implementation - used by Internet Explorer
		el.attachEvent('on'+type, listener);
	}
}

N2i.Event.removeListener = function(el,type,listener,useCapture) {
	el = $id(el);
	if(document.removeEventListener) {
		// W3C DOM Level 2 Events - used by Mozilla, Opera and Safari
		if(!useCapture) {useCapture = false;} else {useCapture = true;} {
			el.removeEventListener(type,listener,useCapture);
		}
	} else {
		// MS implementation - used by Internet Explorer
		el.detachEvent('on'+type, listener);
	}
}

N2i.Event.stop = function(e) {
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}

N2i.Event.addLoadListener = function(delegate) {
	if(typeof window.addEventListener != 'undefined')
	{
		//.. gecko, safari, konqueror and standard
		window.addEventListener('load', delegate, false);
	}
	else if(typeof document.addEventListener != 'undefined')
	{
		//.. opera 7
		document.addEventListener('load', delegate, false);
	}
	else if(typeof window.attachEvent != 'undefined')
	{
		//.. win/ie
		window.attachEvent('onload', delegate);
	}

	//** remove this condition to degrade older browsers
	else
	{
		//.. mac/ie5 and anything else that gets this far
	
		//if there's an existing onload function
		if(typeof window.onload == 'function')
		{
			//store it
			var existing = window.onload;
		
			//add new onload handler
			window.onload = function()
			{
				//call existing onload function
				existing();
			
				//call delegate onload function
				delegate();
			};
		}
		else
		{
			//setup onload function
			window.onload = delegate;
		}
	}
}

N2i.Location = {};

N2i.Location.getParameter = function(name) {
	var parms = N2i.Location.getParameters();
	for (var i=0; i < parms.length; i++) {
		if (parms[i].name==name) {
			return parms[i].value;
		}
	};
	return null;
}

N2i.Location.setParameter = function(name,value) {
	var parms = N2i.Location.getParameters();
	var found = false;
	for (var i=0; i < parms.length; i++) {
		if (parms[i].name==name) {
			parms[i].value=value;
			found=true;
			break;
		}
	};
	if (!found) {
		parms.push({name:name,value:value});
	}
	N2i.Location.setParameters(parms);
}

N2i.Location.setParameters = function(parms) {
	var query = '';
	for (var i=0; i < parms.length; i++) {
		query+= i==0 ? '?' : '&';
		query+=parms[i].name+'='+parms[i].value;
	};
	document.location.search=query;
}

N2i.Location.getBoolean = function(name) {
	var value = N2i.Location.getParameter(name);
	return (value=='true' || value=='1');
}

N2i.Location.getParameters = function() {
	var items = document.location.search.substring(1).split('&');
	var parsed = [];
	for( var i = 0; i < items.length; i++) {
		var item = items[i].split('=');
		var name = unescape(item[0]).replace(/^\s*|\s*$/g,"");
		var value = unescape(item[1]).replace(/^\s*|\s*$/g,"");
		if (name) {
			parsed.push({name:name,value:value});
		}
	};
	return parsed;
}

/************************************* Request ******************************/

N2i.Request = function(delegate) {
	this.delegate = delegate;
	this.options = {method:'GET',async:true};
}

N2i.Request.prototype.request = function(url,options) {
	N2i.override(this.options,options);
	this.initTransport();
	var req = this.transport;
	var self = this;
	req.onreadystatechange = function() {
		try {
			if (req.readyState == 4) {
				if (req.status == 200) {
					self.callDelegate('onSuccess');
				} else {
					self.callDelegate('onFailure');
				}
			}
		} catch (e) {
			N2i.log(e);
		}
	};
	var method = this.options.method.toUpperCase();
	req.open(method, url, this.options.async);
	var parameters = null;
	var body = '';
    if (method=='POST' && this.options.parameters) {
		body = this.buildPostBody(this.options.parameters);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
		req.setRequestHeader("Content-length", body.length);
		req.setRequestHeader("Connection", "close");
	}
	req.send(body);
}

N2i.Request.prototype.buildPostBody = function(parameters) {
	if (!parameters) return null;
	var output = '';
	for (param in parameters) {
		if (output.length>0) output+='&';
		output+=encodeURIComponent(param)+'='+encodeURIComponent(parameters[param]);
	}
	return output;
}

N2i.Request.prototype.callDelegate = function(method) {
	if (this.delegate && this.delegate[method]) {
		this.delegate[method](this.transport);
	}
}

N2i.Request.prototype.initTransport = function() {
	this.transport = N2i.Request.createTransport();
}

N2i.Request.createTransport = function() {
	try {
		if (window.XMLHttpRequest) {
			var req = new XMLHttpRequest();
			if (req.readyState == null) {
				req.readyState = 1;
				req.addEventListener("load", function () {
					req.readyState = 4;
					if (typeof req.onreadystatechange == "function")
						req.onreadystatechange();
				}, false);
			}
			return req;
		}
		else if (window.ActiveXObject) {
			return N2i.Request.getActiveX();
		} else {
			// Could not create transport
			this.delegate.onError(this);
		}
	}
	catch (ex) {
		if (this.delegate.onError) {
			this.delegate.onError(this,ex);
		}
	}
}

N2i.Request.getActiveX = function() {
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return o;
		}
		catch (ex) {};
	}
	
	throw new Error("Could not find an installed XML parser");
}






N2i.inArray = function(arr,value) {
	for (var i=0; i < arr.length; i++) {
		if (arr[i]==value) return true;
	};
}


N2i.flipInArray = function(arr,value) {
	if (N2i.inArray(arr,value)) {
		N2i.removeFromArray(arr,value);
	} else {
		arr.push(value);
	}
}

N2i.removeFromArray = function(arr,value) {
	for (var i = arr.length - 1; i >= 0; i--){
		if (arr[i]==value) {
			arr.splice(i,1);
		}
	};
}

N2i.addToArray = function(arr,value) {
	if (value.constructor==Array) {
		for (var i=0; i < value.length; i++) {
			if (!N2i.inArray(arr,value[i])) {
				arr.push(value);
			}
		};
	} else {
		if (!N2i.inArray(arr,value)) {
			arr.push(value);
		}
	}
}



N2i.Browser = function() {
	
}

N2i.Browser.isIE = N2i.isIE = function() {
	var ua = navigator.userAgent;
	var opera = /opera [56789]|opera\/[56789]/i.test(ua);
	var ie = !opera && /MSIE/.test(ua);
	return ie;
}

/**
 * Tests if the browser is Opera
 * @return {bool} True if the browser is Opera, false otherwise
 */
N2i.Browser.isOpera = function() {
	return /opera [56789]|opera\/[56789]/i.test(navigator.userAgent);
}


if (!N2i) {var N2i = {};}

N2i.Animation = {
	objects : {},
	running : false,
	latestId : 0,
	IE : navigator.userAgent.indexOf('MSIE')!=-1
};

N2i.Animation.loco = function(val) {
	return Math.sin(3*val*Math.PI-Math.PI/2)*.5+.5;
}

N2i.Animation.ease = function(val) {
	return Math.sin(val*Math.PI-Math.PI/2)*.5+.5;
}

N2i.Animation.func2 = function(val) {
	return (-1*Math.pow((val-1),2))+1;
}

N2i.Animation.fastSlow = function(val) {
	var a = .5;
	var b = .7
	return -1*Math.pow(Math.cos((Math.PI/2)*Math.pow(val,a)),Math.pow(Math.PI,b))+1;
}

N2i.Animation.slowFastSlow = function(val) {
	var a = 1.6;
	var b = 1.4;
	return -1*Math.pow(Math.cos((Math.PI/2)*Math.pow(val,a)),Math.pow(Math.PI,b))+1;
}



N2i.Animation.bounce = function(t) {
	if (t < (1/2.75)) {
		return 7.5625*t*t;
	} else if (t < (2/2.75)) {
		return (7.5625*(t-=(1.5/2.75))*t + .75);
	} else if (t < (2.5/2.75)) {
		return (7.5625*(t-=(2.25/2.75))*t + .9375);
	} else {
		return (7.5625*(t-=(2.625/2.75))*t + .984375);
	}
}

N2i.Animation.elastic = function(t) {
	return 1 - N2i.Animation.elastic2(1-t);
}

N2i.Animation.elastic2 = function (t, a, p) {
	if (t<=0 || t>=1) return t;  if (!p) p=0.45;
	var s;
	if (!a || a < Math.abs(1)) { a=1; s=p/4; }
	else s = p/(2*Math.PI) * Math.asin (1/a);
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
}

N2i.Animation.get = function(element) {
	element = $id(element);
	if (!element.n2iAnimationId) element.n2iAnimationId = this.latestId++;
	if (!this.objects[element.n2iAnimationId]) {
		this.objects[element.n2iAnimationId] = new N2i.Animation.Item(element);
	}
	return this.objects[element.n2iAnimationId];
}

N2i.Animation.start = function() {
	if (!this.running) {
		N2i.Animation.render();
	}
}

N2i.Animation.render = function(element) {
	this.running = true;
	var next = false;
	var stamp = new Date().getTime();
	for (id in this.objects) {
		var obj = this.objects[id];
		if (obj.work) {
			for (var i=0; i < obj.work.length; i++) {
				var work = obj.work[i];
				if (work.finished) continue;
				var place = (stamp-work.start)/(work.end-work.start);
				if (isNaN(place)) place = 1;
				if (place>1) place=1;
				if (place<1) next=true;
				var v = place;
				if (work.delegate && work.delegate.ease) {
					v = work.delegate.ease(v);
				}
				var value = null;
				if (!work.css) {
					obj.element[work.property] = Math.round(work.from+(work.to-work.from)*v);
				} else if (work.to.red!=null) {
					var red = Math.round(work.from.red+(work.to.red-work.from.red)*v);
					var green = Math.round(work.from.green+(work.to.green-work.from.green)*v);
					var blue = Math.round(work.from.blue+(work.to.blue-work.from.blue)*v);
					value = 'rgb('+red+','+green+','+blue+')';
					obj.element.style[work.property]=value;
				} else if (N2i.Animation.IE && work.property=='opacity') {
					var opacity = (work.from+(work.to-work.from)*v);
					obj.element.style['filter']='alpha(opacity='+(opacity*100)+')';
				} else {
					value = new String(work.from+(work.to-work.from)*v)+(work.unit!=null ? work.unit : '');
					obj.element.style[work.property]=value;
				}
				if (place==1) {
					work.finished = true;
					if (work.delegate && work.delegate.onComplete) {
						work.delegate.onComplete();
					} else if (work.delegate && work.delegate.hideOnComplete) {
						obj.element.style.display='none';
					}
				}
			};
		}
	}
	if (next) {
		window.setTimeout(function() {
			N2i.Animation.render();
		},0);
	} else {
		this.running = false;
	}
	//window.status = this.running;
}

N2i.Animation.parseStyle = function(value) {
	var parsed = {type:null,value:null,unit:null};
	var match;
	if (!isNaN(value)) {
		parsed.value=parseFloat(value);
	} else if (match=value.match(/([\-]?[0-9\.]+)(px|pt|%)/)) {
		parsed.type = 'length';
		parsed.value = parseFloat(match[1]);
		parsed.unit = match[2];
	} else if (match=value.match(/rgb\(([0-9]+),[ ]?([0-9]+),[ ]?([0-9]+)\)/)) {
		parsed.type = 'color';
		parsed.value = {
			red:parseInt(match[1]),
			green:parseInt(match[2]),
			blue:parseInt(match[3])
		};
	} else {
		var color = new N2i.Color(value);
		if (color.ok) {
			parsed.value = {
				red:color.r,
				green:color.g,
				blue:color.b
			};
		}
	}
	return parsed;
}

/********************************* Item **********************************/

N2i.Animation.Item = function(element) {
	this.element = element;
	this.work = [];
}

N2i.Animation.Item.prototype.animate = function(from,to,property,duration,delegate) {
	var css = true;
	if (property=='scrollLeft') {
		css = false;
	}
	
	var work = this.getWork(css ? N2i.camelize(property) : property);
	work.delegate = delegate;
	work.finished = false;
	work.css = css;
	if (from!=null) {
		work.from = from;
	} else if (work.css && N2i.Animation.IE && property=='opacity') {
		work.from = this.getIEOpacity(this.element);
	} else if (work.css) {
		var style = N2i.Element.getStyle(this.element,property);
		var parsedStyle = N2i.Animation.parseStyle(style);
		work.from = parsedStyle.value;
	} else {
		work.from = this.element[property];
	}
	if (work.css) {
		var parsed = N2i.Animation.parseStyle(to);
		work.to = parsed.value;
		work.unit = parsed.unit;
	} else {
		work.to = to;
		work.unit = null;
	}
	work.start = new Date().getTime();
	work.end = work.start+duration;
	//console.log(work);
	N2i.Animation.start();
}

N2i.Animation.Item.prototype.getIEOpacity = function(element) {
	var filter = N2i.Element.getStyle(element,'filter').toLowerCase();
	var match;
	if (match = filter.match(/opacity=([0-9]+)/)) {
		return parseFloat(match[1])/100;
	} else {
		return 1;
	}
}

N2i.Animation.Item.prototype.getWork = function(property) {
	for (var i=0; i < this.work.length; i++) {
		if (this.work[i].property==property) {
			return this.work[i];
		}
	};
	var work = {property:property};
	this.work[this.work.length] = work;
	return work;
}

/************************************** Loop **********************************/

N2i.Animation.Loop = function(recipe) {
	this.recipe = recipe;
	this.position = -1;
	this.running = false;
}

N2i.Animation.Loop.prototype.next = function() {
	this.position++;
	if (this.position>=this.recipe.length) {
		this.position = 0;
	}
	var item = this.recipe[this.position];
	if (typeof(item)=='function') {
		item();
	} else if (item.element) {
		$ani(item.element,item.property,item.value,item.duration,{ease:item.ease});
	}
	var self = this;
	var time = item.duration || 0;
	window.setTimeout(function() {self.next()},time);
}

N2i.Animation.Loop.prototype.start = function() {
	this.running=true;
	this.next();
}

/************************************** Color *********************************/


N2i.Color = function(color_string) {
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

}


if (!N2i) {var N2i = {};}

N2i.TextField = function(field,options,delegate) {
	this.field = $id(field);
	this.value = this.field.value;
	this.options = options || {};
	this.delegate = delegate || {};
	if (this.options.placeholder && this.field.value=='') {
		this.field.value=this.options.placeholder;
	}
	this.addBehaviour();
}

N2i.TextField.prototype.addBehaviour = function() {
	var self = this;
	this.field.onfocus = function() {
		self.onfocus();
	}
	this.field.onblur = function() {
		self.blur();
	}
	this.field.onkeydown = this.field.onkeyup = this.field.onkeypress = function() {
		self.key();
	}
}

N2i.TextField.prototype.setDelegate = function(delegate) {
	this.delegate = delegate || {};
}

N2i.TextField.prototype.setEnabled = function(enabled) {
	this.field.disabled = !enabled;
}

N2i.TextField.prototype.getValue = function() {
	return this.value;
}

N2i.TextField.prototype.setValue = function(value) {
	value = value || '';
	this.value = this.field.value = value;
}

N2i.TextField.prototype.focus = function() {
	this.field.focus();
}

N2i.TextField.prototype.onfocus = function() {
	if (this.field.value==this.options.placeholder) {
		this.field.value='';
	}
}

N2i.TextField.prototype.blur = function() {
	if (this.field.value=='' && this.options.placeholder) {
		this.field.value=this.options.placeholder;
	}
}

N2i.TextField.prototype.key = function() {
	if (this.value != this.field.value) {
		this.value = this.field.value;
		if (this.delegate.valueDidChange) {
			this.delegate.valueDidChange(this);
		}
	}
}

/********************** Date *******************/

N2i.DateField = function(field,options,delegate) {
	this.field = $id(field);
	this.value = this.field.value;
	this.date = null;
	this.inputFormats = ['d-m-Y','d-m-Y','d-m-Y','d-m-Y','d-m','d/m','d','m-d-Y','m-d-Y','m-d-Y','m-d-Y','m-d','m/d'];
	this.outputFormat = 'd-m-Y';
	this.delegate = delegate || {};
	this.options = options || {};
	if (this.options.placeholder && this.field.value=='') {
		this.field.value=this.options.placeholder;
	}
	this.addBehaviour();
	this.check();
}

N2i.DateField.prototype.setDelegate = function(delegate) {
	this.delegate = delegate || {};
}

N2i.DateField.prototype.setEnabled = function(enabled) {
	this.field.disabled = !enabled;
}

N2i.DateField.prototype.setDate = function(date) {
	this.date = date;
	this.field.value = this.date.dateFormat(this.outputFormat);
	this.value = this.field.value;
}

N2i.DateField.prototype.getDate = function() {
	return this.date;
}

N2i.DateField.prototype.addBehaviour = function() {
	var self = this;
	this.field.onfocus = function() {
		self.focus();
	}
	this.field.onblur = function() {
		self.blur();
	}
	this.field.onkeydown = this.field.onkeyup = this.field.onkeypress = function() {
		self.key();
	}
}

N2i.DateField.prototype.check = function() {
	var parsed = null;
	for (var i=0; i < this.inputFormats.length && parsed==null; i++) {
		parsed = Date.parseDate(this.value,	this.inputFormats[i]);
	};
	if (parsed) {
		this.date = parsed;
	}
	if (this.date==null) {
		this.field.value = '';
	} else {
		this.field.value = this.date.dateFormat(this.outputFormat);
	}
	this.value = this.field.value;
}

N2i.DateField.prototype.getValue = function() {
	return this.value;
}

N2i.DateField.prototype.focus = function() {
	if (this.field.value==this.options.placeholder) {
		this.field.value='';
	}
}

N2i.DateField.prototype.blur = function() {
	this.check();
	if (this.field.value=='' && this.options.placeholder) {
		this.field.value=this.options.placeholder;
	}
}

N2i.DateField.prototype.key = function() {
	if (this.value != this.field.value) {
		this.value = this.field.value;
		if (this.options.valueDidChange) {
			this.options.valueDidChange(this);
		}
	}
}

/********************** Date time *******************/

N2i.DateTimeField = function(field,delegate) {
	this.field = $id(field);
	this.value = this.field.value;
	this.date = null;
	this.inputFormats = ['d-m-Y H:i:s','d-m-Y H:i','d-m-Y H','d-m-Y','d-m','d/m'];
	this.outputFormat = 'd-m-Y H:i:s';
	this.delegate = delegate || {};
	if (this.delegate.placeholder && this.field.value=='') {
		this.field.value=this.delegate.placeholder;
	}
	this.addBehaviour();
	this.check();
}

N2i.DateTimeField.prototype.addBehaviour = function() {
	var self = this;
	this.field.onfocus = function() {
		self.focus();
	}
	this.field.onblur = function() {
		self.blur();
	}
	this.field.onkeydown = this.field.onkeyup = this.field.onkeypress = function() {
		self.key();
	}
}

N2i.DateTimeField.prototype.check = function() {
	var parsed = null;
	for (var i=0; i < this.inputFormats.length && parsed==null; i++) {
		parsed = Date.parseDate(this.value,	this.inputFormats[i]);
	};
	if (parsed) {
		this.date = parsed;
	}
	this.field.value = this.date.dateFormat(this.outputFormat);
	this.value = this.field.value;
}

N2i.DateTimeField.prototype.getValue = function() {
	return this.value;
}

N2i.DateTimeField.prototype.focus = function() {
	if (this.field.value==this.delegate.placeholder) {
		this.field.value='';
	}
}

N2i.DateTimeField.prototype.blur = function() {
	this.check();
	if (this.field.value=='' && this.delegate.placeholder) {
		this.field.value=this.delegate.placeholder;
	}
}

N2i.DateTimeField.prototype.key = function() {
	if (this.value != this.field.value) {
		this.value = this.field.value;
		if (this.delegate.valueDidChange) {
			this.delegate.valueDidChange(this);
		}
	}
}


/*
    json2.js
    2008-01-17

    Public Domain

    No warranty expressed or implied. Use at your own risk.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods:

        JSON.stringify(value, whitelist)
            value       any JavaScript value, usually an object or array.

            whitelist   an optional array prameter that determines how object
                        values are stringified.

            This method produces a JSON text from a JavaScript value.
            There are three possible ways to stringify an object, depending
            on the optional whitelist parameter.

            If an object has a toJSON method, then the toJSON() method will be
            called. The value returned from the toJSON method will be
            stringified.

            Otherwise, if the optional whitelist parameter is an array, then
            the elements of the array will be used to select members of the
            object for stringification.

            Otherwise, if there is no whitelist parameter, then all of the
            members of the object will be stringified.

            Values that do not have JSON representaions, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays will be replaced with null.
            JSON.stringify(undefined) returns undefined. Dates will be
            stringified as quoted ISO dates.

            Example:

            var text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'

        JSON.parse(text, filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function that can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:

            // Parse the text. If a key contains the string 'date' then
            // convert the value to a date.

            myData = JSON.parse(text, function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    Use your own copy. It is extremely unwise to load third party
    code into your pages.
*/

/*jslint evil: true */

/*global JSON */

/*members "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    charCodeAt, floor, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join, length,
    parse, propertyIsEnumerable, prototype, push, replace, stringify, test,
    toJSON, toString
*/

if (!this.JSON) {

    JSON = function () {

        function f(n) {    // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function () {

// Eventually, this method will be based on the date.toISOString method.

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };


        var m = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

        function stringify(value, whitelist) {
            var a,          // The array holding the partial texts.
                i,          // The loop counter.
                k,          // The member key.
                l,          // Length.
                r = /["\\\x00-\x1f\x7f-\x9f]/g,
                v;          // The member value.

            switch (typeof value) {
            case 'string':

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe sequences.

                return r.test(value) ?
                    '"' + value.replace(r, function (a) {
                        var c = m[a];
                        if (c) {
                            return c;
                        }
                        c = a.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) +
                                                   (c % 16).toString(16);
                    }) + '"' :
                    '"' + value + '"';

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':

// Due to a specification blunder in ECMAScript,
// typeof null is 'object', so watch out for that case.

                if (!value) {
                    return 'null';
                }

// If the object has a toJSON method, call it, and stringify the result.

                if (typeof value.toJSON === 'function') {
                    return stringify(value.toJSON());
                }
                a = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {

// The object is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    l = value.length;
                    for (i = 0; i < l; i += 1) {
                        a.push(stringify(value[i], whitelist) || 'null');
                    }

// Join all of the elements together and wrap them in brackets.

                    return '[' + a.join(',') + ']';
                }
                if (whitelist) {

// If a whitelist (array of keys) is provided, use it to select the components
// of the object.

                    l = whitelist.length;
                    for (i = 0; i < l; i += 1) {
                        k = whitelist[i];
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v);
                            }
                        }
                    }
                }

// Join all of the member texts together and wrap them in braces.

                return '{' + a.join(',') + '}';
            }
        }

        return {
            stringify: stringify,
            parse: function (text, filter) {
                var j;

                function walk(k, v) {
                    var i, n;
                    if (v && typeof v === 'object') {
                        for (i in v) {
                            if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                                n = walk(i, v[i]);
                                if (n !== undefined) {
                                    v[i] = n;
                                }
                            }
                        }
                    }
                    return filter(k, v);
                }


// Parsing happens in three stages. In the first stage, we run the text against
// regular expressions that look for non-JSON patterns. We are especially
// concerned with '()' and 'new' because they can cause invocation, and '='
// because it can cause mutation. But just to be safe, we want to reject all
// unexpected forms.

// We split the first stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace all backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the second stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

// In the optional third stage, we recursively walk the new structure, passing
// each name/value pair to a filter function for possible transformation.

                    return typeof filter === 'function' ? walk('', j) : j;
                }

// If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('parseJSON');
            }
        };
    }();
}


function In2iGui() {
	this.overflows = [];
	this.delegates = [];
	this.objects = {};
	this.addBehavior();
}

In2iGui.latestIndex=500;

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

In2iGui.Window = function(element) {
	this.element = $id(element);
	this.close = $firstClass('close',this.element);
	this.titlebar = $firstClass('titlebar',this.element);
	this.title = $firstClass('title',this.titlebar);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Window.prototype.addBehavior = function() {
	var self = this;
	this.close.onclick = function() {self.hide();}
	this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
}

In2iGui.Window.prototype.setTitle = function(title) {
	this.title.innerHTML = title;
}

In2iGui.Window.prototype.show = function() {
	this.element.style.zIndex=In2iGui.nextIndex();
	this.element.style.visibility='hidden';
	this.element.style.display='block';
	this.element.style.width = this.element.clientWidth+'px';
	this.element.style.visibility='visible';
	if (!N2i.isIE()) {
		$ani(this.element,'opacity',1,0);
	} else {
		//alert(this.element.clientWidth);
	}
}

In2iGui.Window.prototype.hide = function() {
	if (!N2i.isIE()) {
		$ani(this.element,'opacity',0,200,{hideOnComplete:true});
	} else {
		this.element.style.display='none';
	}
}

/************************************ Dragging **************************************/

In2iGui.Window.prototype.startDrag = function(e) {
	this.element.style.zIndex=In2iGui.nextIndex();
	var event = new N2i.Event(e);
	this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.element),top:event.mouseTop()-N2i.Element.getTop(this.element)};
	this.latestPosition = {left: this.dragState.left, top:this.dragState.top};
	this.latestTime = new Date().getMilliseconds();
	var self = this;
	this.moveListener = function(e) {self.drag(e)};
	this.upListener = function(e) {self.endDrag(e)};
	N2i.Event.addListener(document,'mousemove',this.moveListener);
	N2i.Event.addListener(document,'mouseup',this.upListener);
	N2i.Event.stop(e);
	document.body.onselectstart = function () { return false; };
	return false;
}

In2iGui.Window.prototype.calc = function(top,left) {
	// TODO: No need to do this all the time
	this.a = this.latestPosition.left-left;
	this.b = this.latestPosition.top-top;
	this.dist = Math.sqrt(Math.pow((this.a),2),Math.pow((this.b),2));
	this.latestTime = new Date().getMilliseconds();
	this.latestPosition = {'top':top,'left':left};
}

In2iGui.Window.prototype.drag = function(e) {
	var event = new N2i.Event(e);
	this.element.style.right = 'auto';
	var top = (event.mouseTop()-this.dragState.top);
	var left = (event.mouseLeft()-this.dragState.left);
	this.element.style.top = Math.max(top,0)+'px';
	this.element.style.left = Math.max(left,0)+'px';
	//this.calc(top,left);
	return false;
}

In2iGui.Window.prototype.endDrag = function(e) {
	N2i.Event.removeListener(document,'mousemove',this.moveListener);
	N2i.Event.removeListener(document,'mouseup',this.upListener);
	document.body.onselectstart = null;
	/*
	var func = N2i.Animation.fastSlow;
	var newTop = parseInt(this.element.style.top)-this.b*10;
	var newLeft = parseInt(this.element.style.left)-this.a*10;
	if (newTop<0) {newTop=0; func=N2i.Animation.bounce};
	if (newLeft<0) {newLeft=0; func=N2i.Animation.bounce};
	$ani(this.element,'top',newTop+'px',1000,{ease:func});
	$ani(this.element,'left',newLeft+'px',1000,{ease:func});
	*/
}


In2iGui.Formula = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.inputs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.create = function(opts) {
	var options = {name:null};
	N2i.override(options,opts);
	var element = N2i.create('form',
		{'class':'in2igui_formula'}
	);
	return new In2iGui.Formula(element,options.name);
}

In2iGui.Formula.prototype.addBehavior = function() {
	var self = this;
	this.element.onsubmit=function() {
		In2iGui.callDelegates(self,'submit');
		return false
	};
}

In2iGui.Formula.prototype.getElement = function() {
	return this.element;
}

In2iGui.Formula.prototype.registerInput = function(obj) {
	this.inputs[this.inputs.length] = obj;
}

In2iGui.Formula.prototype.getValues = function() {
	var data = {};
	for (var i=0; i < this.inputs.length; i++) {
		if (this.inputs[i].name) {
			data[this.inputs[i].name] = this.inputs[i].getValue();
		}
	};
	return data;
}

In2iGui.Formula.prototype.reset = function() {
	for (var i=0; i < this.inputs.length; i++) {
		this.inputs[i].reset();
	}
}

In2iGui.Formula.prototype.addContent = function(node) {
	this.element.appendChild(node);
}

/********************** Group **********************/


In2iGui.Formula.Group = function(elementOrId,name,opts) {
	this.name = name;
	this.element = $id(elementOrId);
	this.options = {above:true};
	N2i.override(this.options,opts);
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Group.prototype.getElement = function() {
	return this.element;
}

In2iGui.Formula.Group.create = function(opts) {
	var options = {name:null};
	N2i.override(options,opts);
	var element = N2i.create('table',
		{'class':'in2igui_formula_group'}
	);
	return new In2iGui.Formula.Group(element,options.name,options);
}

In2iGui.Formula.Group.prototype.addWidget = function(widget) {
	var tr = N2i.create('tr');
	this.element.appendChild(tr);
	var th = N2i.create('th');
	th.appendChild(widget.getLabel());
	tr.appendChild(th);
	var td = N2i.create('td');
	td.appendChild(widget.getElement());
	if (this.options.above) {
		var tr = N2i.create('tr');
		this.element.appendChild(tr);
	}
	tr.appendChild(td);
}

/********************** Text ***********************/

In2iGui.Formula.Text = function(elementOrId,name,options) {
	//this.id = id;
	this.name = name;
	this.options = options;
	this.element = $id(elementOrId);
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Text.create = function(opts) {
	var options = {name:null,lines:1};
	N2i.override(options,opts);
	if (options.lines>1) {
		var element = N2i.create('textarea',
			{'class':'in2igui_formula_text','rows':options.lines}
		);		
	} else {
		var element = N2i.create('input',
			{'class':'in2igui_formula_text'}
		);		
	}
	return new In2iGui.Formula.Text(element,options.name,options);
}

In2iGui.Formula.Text.prototype.updateFromNode = function(node) {
	if (node.firstChild) {
		this.setValue(node.firstChild.nodeValue);
	} else {
		this.setValue(null);
	}
}

In2iGui.Formula.Text.prototype.updateFromObject = function(data) {
	this.setValue(data.value);
}

In2iGui.Formula.Text.prototype.focus = function() {
	try {
		this.element.focus();
	} catch (ignore) {}
}

In2iGui.Formula.Text.prototype.reset = function() {
	this.setValue('');
}

In2iGui.Formula.Text.prototype.setValue = function(value) {
	this.element.value = value;
}

In2iGui.Formula.Text.prototype.getValue = function() {
	return this.element.value;
}

In2iGui.Formula.Text.prototype.getElement = function() {
	return this.element;
}

In2iGui.Formula.Text.prototype.getLabel = function() {
	if (!this.label) {
		this.label = N2i.create('label');
		this.label.innerHTML = this.options.label;
	}
	return this.label;
}


/********************************* Radio buttons ****************************/

In2iGui.Formula.Radiobuttons = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.radios = [];
	this.value = options.value;
	this.defaultValue = this.value;
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Radiobuttons.prototype = {
	click : function() {
		this.value = !this.value;
		this.updateUI();
	},
	updateUI : function() {
		for (var i=0; i < this.radios.length; i++) {
			var radio = this.radios[i];
			N2i.setClass(radio.id,'selected',radio.value==this.value);
		};
	},
	setValue : function(value) {
		this.value = value;
		this.updateUI();
	},
	getValue : function() {
		return this.value;
	},
	reset : function() {
		this.setValue(this.defaultValue);
	},
	registerRadiobutton : function(radio) {
		this.radios.push(radio);
		var element = $id(radio.id);
		var self = this;
		element.onclick = function() {
			self.setValue(radio.value);
		}
	}
}


/********************************* Checkboxes ****************************/

In2iGui.Formula.Checkbox = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.value = options.value=='true';
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Formula.Checkbox.prototype = {
	addBehavior : function() {
		var control = $firstClass('check',this.element);
		var self = this;
		control.onclick = function() {self.click()};
	},
	click : function() {
		this.value = !this.value;
		this.updateUI();
	},
	updateUI : function() {
		N2i.setClass(this.element,'checked',this.value);
	},
	setValue : function(value) {
		this.value = value;
		this.updateUI();
	},
	getValue : function() {
		return this.value;
	},
	reset : function() {
		this.setValue(false);
	}
}

/********************************* Checkboxes ****************************/

In2iGui.Formula.Checkboxes = function(id,name) {
	this.element = $id(id);
	this.name = name;
	this.checkboxes = [];
	this.sources = [];
	this.values = [];
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.Checkboxes.prototype.getValues = function() {
	return this.values;
}

In2iGui.Formula.Checkboxes.prototype.checkValues = function() {
	var newValues = [];
	for (var i=0; i < this.values.length; i++) {
		var value = this.values[i];
		var found = false;
		for (var j=0; j < this.sources.length; j++) {
			found = found || this.sources[j].hasValue(value);
		};
		if (found) {
			newValues.push(value);
		}
	};
	this.values=newValues;
}

In2iGui.Formula.Checkboxes.prototype.setValues = function(values) {
	this.values=values;
	this.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.prototype.flipValue = function(value) {
	N2i.flipInArray(this.values,value);
	this.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.prototype.updateUI = function() {
	for (var i=0; i < this.sources.length; i++) {
		this.sources[i].updateUI();
	};
}

In2iGui.Formula.Checkboxes.prototype.refresh = function() {
	for (var i=0; i < this.sources.length; i++) {
		this.sources[i].refresh();
	};
}

In2iGui.Formula.Checkboxes.prototype.reset = function() {
	this.setValues([]);
}

In2iGui.Formula.Checkboxes.prototype.registerSource = function(source) {
	source.parent = this;
	this.sources.push(source);
}

In2iGui.Formula.Checkboxes.prototype.itemWasClicked = function(item) {
	this.changeValue(item.in2iGuiValue);
}

/******************************** Source ****************************/

In2iGui.Formula.Checkboxes.Source = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.parent = null;
	this.options = options;
	this.checkboxes = [];
	In2iGui.enableDelegating(this);
	var self = this;
	N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Formula.Checkboxes.Source.prototype.refresh = function() {
	var self = this;
	$get(this.options.url,{onSuccess:function(t) {self.update(t.responseXML)}});
}

In2iGui.Formula.Checkboxes.Source.prototype.update = function(doc) {
	this.checkboxes = [];
	N2i.removeChildren(this.element);
	var self = this;
	var items = doc.getElementsByTagName('checkbox');
	for (var i=0; i < items.length; i++) {
		var item = items[i];
		var node = N2i.create('div',{'class':'checkbox'});
		var label = item.getAttribute('label');
		var value = item.getAttribute('value');
		var check = N2i.create('div',{'class':'check'});
		node.appendChild(check);
		node.appendChild(document.createTextNode(label));
		this.element.appendChild(node);
		node.in2iGuiValue = value;
		node.onclick = function() {
			self.itemWasClicked(this);
		}
		this.checkboxes.push({label:label,element:node,value:value});
	};
	if (items.length==0) {
		this.element.innerHTML='&nbsp;';
	}
	this.parent.checkValues();
	this.updateUI();
}

In2iGui.Formula.Checkboxes.Source.prototype.itemWasClicked = function(node) {
	this.parent.flipValue(node.in2iGuiValue);
}

In2iGui.Formula.Checkboxes.Source.prototype.updateUI = function() {
	for (var i=0; i < this.checkboxes.length; i++) {
		var item = this.checkboxes[i];
		N2i.setClass(item.element,'checked',N2i.inArray(this.parent.values,item.value));
	};
}


In2iGui.Formula.Checkboxes.Source.prototype.hasValue = function(value) {
	for (var i=0; i < this.checkboxes.length; i++) {
		if (this.checkboxes[i].value==value) {
			return true;
		}
	};
	return false;
}

In2iGui.List = function(element,name,options) {
	this.element = $id(element);
	this.name = name;
	this.source = options.source;
	this.head = this.element.getElementsByTagName('thead')[0];
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.columns = [];
	this.rows = [];
	this.selected = [];
	this.navigation = $class('navigation',this.element)[0];
	this.count = $class('count',this.navigation)[0];
	this.windowSize = $class('window_size',this.navigation)[0];
	this.windowNumber = $firstClass('window_number',this.navigation);
	this.windowNumberBody = $firstClass('window_number_body',this.navigation);
	this.window = {size:null,number:1,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.List.prototype.registerColumn = function(column) {
	this.columns.push(column);
}

In2iGui.List.prototype.getSelection = function() {
	var items = [];
	for (var i=0; i < this.selected.length; i++) {
		items.push(this.rows[this.selected[i]]);
	};
	return items;
}

In2iGui.List.prototype.getFirstSelection = function() {
	var items = this.getSelection();
	if (items.length>0) return items[0];
	else return null;
}

In2iGui.List.prototype.loadData = function(url) {
	this.source = url;
	this.selected = [];
	this.window.number = 0;
	this.refresh();
}

/**
 * @private
 */
In2iGui.List.prototype.refresh = function() {
	if (!this.source) return;
	var self = this;
	var delegate = {
		onSuccess:function(t) {
			self.parse(t.responseXML);
		}
	};
	var url = this.source;
	if (this.window.number) {
		url+=url.indexOf('?')==-1 ? '?' : '&';
		url+='windowNumber='+this.window.number;
	}
	if (this.window.size) {
		url+=url.indexOf('?')==-1 ? '?' : '&';
		url+='windowSize='+this.window.size;
	}
	$get(url,delegate);
}

/**
 * @private
 */
In2iGui.List.prototype.parse = function(doc) {
	this.parseWindow(doc);
	this.buildNavigation();
	N2i.removeChildren(this.body);
	N2i.removeChildren(this.head);
	this.rows = [];
	var headTr = N2i.create('tr');
	var headers = doc.getElementsByTagName('header');
	for (var i=0; i < headers.length; i++) {
		var th = N2i.create('th');
		var width = headers[i].getAttribute('width');
		if (width && width!='') {
			th.style.width=width+'%';
		}
		th.appendChild(document.createTextNode(headers[i].getAttribute('title')));
		headTr.appendChild(th);
	};
	this.head.appendChild(headTr);
	var rows = doc.getElementsByTagName('row');
	for (var i=0; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName('cell');
		var row = document.createElement('tr');
		for (var j=0; j < cells.length; j++) {
			var text = null;
			var cell = document.createElement('td');
			this.parseCell(cells[j],cell);
			cell.appendChild(document.createTextNode(text || ' '));
			row.appendChild(cell);
		};
		this.addRowBehavior(row,i);
		this.body.appendChild(row);
		this.rows.push({uid:rows[i].getAttribute('uid'),kind:rows[i].getAttribute('kind'),index:i});
	};
}

In2iGui.List.prototype.parseCell = function(node,cell) {
	if (node.getAttribute('icon')!=null) {
		var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.context+'In2iGui/icons/'+node.getAttribute('icon')+'1.png")'});
		cell.appendChild(icon);
	}
	for (var i=0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if (child.nodeType==N2i.TEXT_NODE && child.nodeValue.length>0) {
			cell.appendChild(document.createTextNode(child.nodeValue));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='break') {
			cell.appendChild(N2i.create('br'));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='object') {
			var obj = N2i.create('div',{'class':'object'});
			if (child.getAttribute('icon')!=null) {
				var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.context+'In2iGui/icons/'+child.getAttribute('icon')+'1.png")'});
				obj.appendChild(icon);
			}
			if (child.firstChild && child.firstChild.nodeType==N2i.TEXT_NODE && child.firstChild.nodeValue.length>0) {
				obj.appendChild(document.createTextNode(child.firstChild.nodeValue));
			}
			cell.appendChild(obj);
		}
	};
}

/**
 * @private
 */
In2iGui.List.prototype.parseWindow = function(doc) {
	var wins = doc.getElementsByTagName('window');
	if (wins.length>0) {
		var win = wins[0];
		this.window.total = parseInt(win.getAttribute('total'));
		this.window.size = parseInt(win.getAttribute('size'));
		this.window.number = parseInt(win.getAttribute('number'));
	} else {
		this.window.total = 0;
		this.window.size = 0;
		this.window.number = 0;
	}
}

In2iGui.List.prototype.buildNavigation = function(doc) {
	var self = this;
	if (this.window.total==0) {
		this.navigation.style.display='none';
		return;
	}
	this.navigation.style.display='';
	var from = ((this.window.number-1)*this.window.size+1);
	this.count.innerHTML = from+'-'+Math.min((this.window.number)*this.window.size,this.window.total)+'/'+this.window.total;
	this.windowNumberBody.innerHTML = '';
	var pages = Math.ceil(this.window.total/this.window.size);
	if (pages<2) {
		this.windowNumber.style.display='none';	
	} else {
		for (var i=1;i<=pages;i++) {
			var a = document.createElement('a');
			a.appendChild(document.createTextNode(i));
			a.in2GuiNumber = i;
			a.onclick = function() {
				self.windowNumberWasClicked(this);
				return false;
			}
			if (i==this.window.number) {
				a.className='selected';
			}
			this.windowNumberBody.appendChild(a);
		}
		this.windowNumber.style.display='block';
	}
}

/********************************** Update from objects *******************************/

In2iGui.List.prototype.setObjects = function(objects) {
	this.selected = [];
	this.body.innerHTML='';
	this.rows = [];
	for (var i=0; i < objects.length; i++) {
		var row = N2i.create('tr');
		var obj = objects[i];
		for (var j=0; j < this.columns.length; j++) {
			var cell = N2i.create('td');
			if (this.builder) {
				cell.innerHTML = this.builder.buildColumn(this.columns[j],obj);
			} else {
				cell.innerHTML = obj[this.columns[j].key];
			}
			row.appendChild(cell);
		};
		this.body.appendChild(row);
		this.addRowBehavior(row,i);
		this.rows.push(obj);
	};
}

/************************************* Behavior ***************************************/


/**
 * @private
 */
In2iGui.List.prototype.addRowBehavior = function(row,index) {
	var self = this;
	row.onmousedown = function() {
		self.rowDown(index);
		return false;
	}
	row.ondblclick = function() {
		self.rowDoubleClick(index);
		return false;
	}
}

In2iGui.List.prototype.changeSelection = function(indexes) {
	var rows = this.body.getElementsByTagName('tr');
	for (var i=0;i<this.selected.length;i++) {
		N2i.Element.removeClassName(rows[this.selected[i]],'selected');
	}
	for (var i=0;i<indexes.length;i++) {
		N2i.Element.addClassName(rows[indexes[i]],'selected');
	}
	this.selected = indexes
}

/**
 * @private
 */
In2iGui.List.prototype.rowDown = function(index) {
	this.changeSelection([index]);
}

/**
 * @private
 */
In2iGui.List.prototype.rowDoubleClick = function(index) {
	In2iGui.callDelegates(this,'listRowsWasOpened');
}

/**
 * @private
 */
In2iGui.List.prototype.windowNumberWasClicked = function(tag) {
	this.window.number = tag.in2GuiNumber;
	this.refresh();
}

In2iGui.Icons = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.source = options.source;
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.prototype.registerTab = function(obj) {
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabs.prototype.addBehavior = function() {
	var self = this;
	var tabs = $class('tabs_bar',this.element)[0].getElementsByTagName('span');
	for (var i=0; i < tabs.length; i++) {
		tabs[i].in2iGuiIndex = i;
		tabs[i].onclick = function() {
			self.tabWasClicked(this);
		}
	};
}

In2iGui.Tabs.prototype.tabWasClicked = function(tag) {
	this.activeTab = tag.in2iGuiIndex;
	this.updateGUI();
}

In2iGui.Tabs.prototype.updateGUI = function() {
	for (var i=0; i < this.tabs.length; i++) {
		this.tabs[i].element.style.display = (i==this.activeTab ? 'block' : 'none');
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabs.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
}


In2iGui.ViewStack = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.contents = [];
	In2iGui.enableDelegating(this);
}

In2iGui.ViewStack.prototype.registerContent = function(id,name) {
	this.contents[this.contents.length] = {element:$id(id),name:name};
}

In2iGui.ViewStack.prototype.change = function(name) {
	for (var i=0; i < this.contents.length; i++) {
		if (this.contents[i].name==name) {
			this.contents[i].element.style.display='block';
		} else {
			this.contents[i].element.style.display='none';
		}
	};
}

In2iGui.Tabbox = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.panes = $class('tab',$class('tabbox_top',this.element)[0]);
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	this.updateGUI();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabbox.prototype.registerTab = function(obj) {
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabbox.prototype.addBehavior = function() {
	var self = this;
	var tabs = $class('tabbox_top',this.element)[0].getElementsByTagName('a');
	for (var i=0; i < tabs.length; i++) {
		tabs[i].in2iGuiIndex = i;
		tabs[i].onclick = function() {
			self.tabWasClicked(this);
		}
	};
}

In2iGui.Tabbox.prototype.tabWasClicked = function(tag) {
	this.activeTab = tag.in2iGuiIndex;
	this.updateGUI();
}

In2iGui.Tabbox.prototype.updateGUI = function() {
	var body = $class('tabbox_body',this.element)[0];
	$ani(body,'scrollLeft',this.activeTab*592,700,{ease:N2i.Animation.slowFastSlow});
	for (var i=0; i < this.panes.length; i++) {
		if (i==this.activeTab) {
			N2i.Element.addClassName(this.panes[i],'tab_selected');
		} else {
			N2i.Element.removeClassName(this.panes[i],'tab_selected');
		}
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabbox.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	In2iGui.enableDelegating(this);
}


In2iGui.ObjectList = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.template = [];
	this.objects = [];
	In2iGui.enableDelegating(this);
}

In2iGui.ObjectList.prototype.ignite = function() {
	this.addObject({id:0});
}

In2iGui.ObjectList.prototype.addObject = function(data,addToEnd) {
	if (this.objects.length==0 || addToEnd) {
		var obj = new In2iGui.ObjectList.Object(this.objects.length,data,this);
		this.objects.push(obj);
		this.body.appendChild(obj.getElement());
	} else {
		var last = this.objects.pop();
		var obj = new In2iGui.ObjectList.Object(last.index,data,this);
		last.index++;
		this.objects.push(obj);
		this.objects.push(last);
		this.body.insertBefore(obj.getElement(),last.getElement())
	}
}

In2iGui.ObjectList.prototype.reset = function() {
	for (var i=0; i < this.objects.length; i++) {
		var element = this.objects[i].getElement();
		element.parentNode.removeChild(element);
	};
	this.objects = [];
	this.addObject({id:0});
}

In2iGui.ObjectList.prototype.addObjects = function(data) {
	for (var i=0; i < data.length; i++) {
		this.addObject(data[i]);
	};
}

In2iGui.ObjectList.prototype.setObjects = function(data) {
	this.reset();
	this.addObjects(data);
}

In2iGui.ObjectList.prototype.getObjects = function(data) {
	var list = [];
	for (var i=0; i < this.objects.length-1; i++) {
		list.push(this.objects[i].getData());
	};
	return list;
}

In2iGui.ObjectList.prototype.registerTemplateItem = function(key,type) {
	this.template.push({key:key,type:type});
}

In2iGui.ObjectList.prototype.objectDidChange = function(obj) {
	if (obj.index>=this.objects.length-1) {
		this.addObject({},true);
	}
}

/********************** Object ********************/

In2iGui.ObjectList.Object = function(index,data,list) {
	this.data = data;
	this.index = index;
	this.list = list;
	this.fields = {};
}

In2iGui.ObjectList.Object.prototype.getElement = function() {
	if (!this.element) {
		var self = this;
		this.element = document.createElement('tr');
		for (var i=0; i < this.list.template.length; i++) {
			var key = this.list.template[i].key;
			var cell = document.createElement('td');
			if (i==0) cell.className='first';
			var input = N2i.create('input',{'class':'text'});
			var field = N2i.create('div',{'class':'field'});
			field.appendChild(input);
			cell.appendChild(field);
			this.element.appendChild(cell);
			var field = new N2i.TextField(input);
			field.in2iGuiObjectListKey = key;
			field.setValue(this.data[key]);
			field.setDelegate(this);
			this.fields[key] = field;
		};
	}
	return this.element;
}

In2iGui.ObjectList.Object.prototype.valueDidChange = function(field) {
	this.data[field.in2iGuiObjectListKey] = field.getValue();
	this.list.objectDidChange(this);
}

In2iGui.ObjectList.Object.prototype.getData = function() {
	return this.data;
}


In2iGui.Alert = function(elementOrId,name) {
	this.element = $id(elementOrId);
	this.name = name;
	this.body = $class('in2igui_alert_body',this.element)[0];
	this.variant = null;
	var h1s = $tag('h1',this.element);
	this.title = h1s.length>0 ? h1s[0] : null;
	In2iGui.enableDelegating(this);
}

In2iGui.Alert.create = function(opts) {
	var options = {title:'',text:'',name:null,variant:null,title:null};
	N2i.override(options,opts);
	
	var element = N2i.create('div',{'class':'in2igui_alert'});
	var body = N2i.create('div',{'class':'in2igui_alert_body'});
	element.appendChild(body);
	document.body.appendChild(element);
	var obj = new In2iGui.Alert(element);
	if (options.variant) {
		obj.setVariant(options.variant);
	}
	if (options.title) {
		obj.setTitle(options.title);
	}
	if (options.text) {
		obj.setText(options.text);
	}
	
	return obj;
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

In2iGui.Alert.prototype.setVariant = function(variant) {
	if (this.variant) {
		N2i.removeClass(this.body,this.variant);
	}
	this.variant = variant;
	N2i.addClass(this.body,variant);
}

In2iGui.Alert.prototype.update = function(options) {
	if (options.title) this.setTitle(options.title);
	if (options.text) this.setText(options.text);
	if (options.variant) this.setVariant(options.variant);
}

In2iGui.Alert.prototype.addButton = function(button) {
	if (!this.buttons) {
		this.buttons = N2i.create('div',{'class':'buttons'});
		this.body.appendChild(this.buttons);
	}
	this.buttons.appendChild(button.getElement());
}

In2iGui.Button = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.enabled = true;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Button.create = function(opts) {
	var options = {text:'Button',name:null,highlighted:false};
	N2i.override(options,opts);
	var className = 'in2igui_button'+(options.highlighted ? ' in2igui_button_highlighted' : '');
	var element = N2i.create('span',{'class':className});
	var element2 = N2i.create('span');
	element.appendChild(element2);
	var element3 = N2i.create('span');
	element2.appendChild(element3);
	element3.innerHTML = options.text;
	return new In2iGui.Button(element,options.name);
}

In2iGui.Button.prototype.getElement = function() {
	return this.element;
}

In2iGui.Button.prototype.addBehavior = function() {
	var self = this;
	this.element.onclick = function() {
		self.clicked();
	}
}

In2iGui.Button.prototype.clicked = function() {
	if (this.enabled) {
		In2iGui.callDelegates(this,'buttonWasClicked'); // deprecated
		In2iGui.callDelegates(this,'click');
	}
}

In2iGui.Button.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
	this.updateUI();
}

In2iGui.Button.prototype.updateUI = function() {
	N2i.setClass(this.element,'in2igui_button_disabled',!this.enabled);
}

In2iGui.Selection = function(id,name,source) {
	this.element = $id(id);
	this.name = name;
	this.items = [];
	this.sources = [];
	this.value = null;
	this.selected = [];
	In2iGui.enableDelegating(this);
	var self = this;
}

In2iGui.Selection.prototype.getValue = function() {
	return this.value;
}

In2iGui.Selection.prototype.getSelection = function() {
	for (var i=0; i < this.items.length; i++) {
		if (this.items[i].value == this.value) {
			return this.items[i];
		}
	};
	for (var i=0; i < this.sources.length; i++) {
		var item = this.sources[i].getSelection();
		if (item) return item;
	};
}

In2iGui.Selection.prototype.changeValue = function(value) {
	this.value = value;
	for (var i=0; i < this.items.length; i++) {
		var item = this.items[i];
		N2i.setClass(item.element,'selected',(item.value==value));
	};
	for (var i=0; i < this.sources.length; i++) {
		var source = this.sources[i];
		source.updateUI();
	};
	In2iGui.callDelegates(this,'selectorSelectionChanged');
}

In2iGui.Selection.prototype.registerSource = function(source) {
	source.selection = this;
	this.sources.push(source);
}

In2iGui.Selection.prototype.registerItem = function(id,title,icon,badge,value) {
	var element = $id(id);
	element.in2iGuiValue = value;
	this.items.push({id:id,title:title,icon:icon,badge:badge,element:element,value:value,kind:''});
	var self = this;
	element.onclick = function() {
		self.itemWasClicked(this);
	}
}

In2iGui.Selection.prototype.itemWasClicked = function(item) {
	this.changeValue(item.in2iGuiValue);
}

/******************************** Source ****************************/

In2iGui.Selection.Source = function(id,name,options) {
	this.element = $id(id);
	this.name = name;
	this.selection = null;
	this.options = options;
	this.items = [];
	In2iGui.enableDelegating(this);
	var self = this;
	N2i.Event.addLoadListener(function() {self.refresh()});
}

In2iGui.Selection.Source.prototype.refresh = function() {
	var self = this;
	$get(this.options.url,{onSuccess:function(t) {self.updateSource(t.responseXML)}});
}

In2iGui.Selection.Source.prototype.updateSource = function(doc) {
	this.items = [];
	N2i.removeChildren(this.element);
	var self = this;
	var items = doc.getElementsByTagName('item');
	for (var i=0; i < items.length; i++) {
		var item = items[i];
		var node = N2i.create('div',{'class':'item'});
		var title = item.getAttribute('title');
		var badge = item.getAttribute('badge');
		var icon = item.getAttribute('icon');
		var value = item.getAttribute('value');
		var kind = item.getAttribute('kind');
		if (icon) {
			var img = N2i.create('div',{'class':'icon'},{'backgroundImage' : 'url('+In2iGui.getIconUrl(icon,1)+')'});
			node.appendChild(img);
		}
		node.appendChild(document.createTextNode(title));
		this.element.appendChild(node);
		node.in2iGuiValue = value;
		node.onclick = function() {
			self.itemWasClicked(this);
		}
		this.items.push({title:title,icon:icon,badge:badge,kind:kind,element:node,value:value});
	};
	this.updateUI();
}

In2iGui.Selection.Source.prototype.itemWasClicked = function(node) {
	this.selection.changeValue(node.in2iGuiValue);
}

In2iGui.Selection.Source.prototype.getSelection = function() {
	for (var i=0; i < this.items.length; i++) {
		if (this.items[i].value == this.selection.value) {
			return this.items[i];
		}
	};
	return null;
}

In2iGui.Selection.Source.prototype.updateUI = function() {
	for (var i=0; i < this.items.length; i++) {
		var item = this.items[i];
		N2i.setClass(item.element,'selected',(item.value==this.selection.value));
	};
}

In2iGui.Toolbar = function(element) {
	this.element = $id(element);
}

/***************** Icon ***************/

In2iGui.Toolbar.Icon = function(id,name) {
	this.id = id;
	this.name = name;
	this.enabled = true;
	this.element = $id(id);
	this.icon = $class('icon',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.Icon.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.wasClicked();
		}
	},
	setEnabled : function(enabled) {
		this.enabled = enabled;
		N2i.setClass(this.element,'disabled',!this.enabled);
	},
	wasClicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'toolbarIconWasClicked');
			In2iGui.callDelegates(this,'click');
		}
	}
}


/***************** Search field ***************/

In2iGui.Toolbar.SearchField = function(element) {
	this.element = $id(element);
	this.field = this.element.getElementsByTagName('input')[0];
	this.value = this.field.value;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Toolbar.SearchField.prototype.getValue = function() {
	return this.field.value;
}

In2iGui.Toolbar.SearchField.prototype.addBehavior = function() {
	var self = this;
	this.field.onkeyup = function() {
		self.fieldChanged();
	}
}

In2iGui.Toolbar.SearchField.prototype.fieldChanged = function() {
	if (this.field.value!=this.value) {
		this.value=this.field.value;
		In2iGui.callDelegates(this,'searchFieldChanged');
	}
}



