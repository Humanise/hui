/**
 * Base
 */
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
	return original;
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

N2i.escapeHTML = function(str) {
    var div = document.createElement('div');
    var text = document.createTextNode(str);
    div.appendChild(text);
    return div.innerHTML;
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
	var a = element.className.split(/\s+/);
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
		if (opacity==1) {
			element.style['filter']=null;
		} else {
			element.style['filter']='alpha(opacity='+(opacity*100)+')';
		}
	} else {
		element.style['opacity']=opacity;
	}
}

N2i.getDocumentHeight = function() {
	if (window.scrollMaxY && window.innerHeight) {
		return window.scrollMaxY+window.innerHeight;
	} else {
		return Math.max(document.body.clientHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight);
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

N2i.Event.prototype = {
	mouseLeft : function() {
	    var left = 0;
		if (this.event) {
		    if (this.event.pageX) {
			    left = this.event.pageX;
		    } else if (this.event.clientX) {
			    left = this.event.clientX + document.body.scrollLeft;
		    }
		}
	    return left;
	},
	mouseTop : function() {
	    var top = 0;
		if (this.event) {
		    if (this.event.pageY) {
			    top = this.event.pageY;
		    } else if (this.event.clientY) {
			    top = this.event.clientY + document.body.scrollTop;
		    }
		}
	    return top;
	},
	getTarget : function() {
		return this.event.target != null ? this.event.target : this.event.srcElement;
	},
	isReturnKey : function() {
		return this.event.keyCode==13;
	},
	isRightKey : function() {
		return this.event.keyCode==39;
	},
	isLeftKey : function() {
		return this.event.keyCode==37;
	},
	isEscapeKey : function() {
		return this.event.keyCode==27;
	},
	isSpaceKey : function() {
		N2i.log(this.event.keyCode);
		return this.event.keyCode==32;
	},
	stop : function() {
//		this.event.returnValue = false;
//		N2i.Event.stop(this.event);
	}
}


N2i.Event.addListener = N2i.addListener = function(el,type,listener,useCapture) {
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

N2i.Event.removeListener = N2i.removeListener = function(el,type,listener,useCapture) {
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

N2i.Event.addLoadListener = N2i.addLoadListener = function(delegate) {
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
					if (req.responseXML && req.responseXML.documentElement) {
						if (self.callDelegate('onXML',req.responseXML)) {
							return;
						}
					} else {
						if (self.callDelegate('onText',req.responseXML)) {
							return;
						}
					}
					self.callDelegate('onSuccess',req);
				} else {
					self.callDelegate('onFailure',req);
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

N2i.Request.prototype.callDelegate = function(method,variable) {
	if (this.delegate && this.delegate[method]) {
		this.delegate[method](variable);
		return true;
	}
	return false;
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

N2i.Preloader = function(options) {
	this.options = options || {};
	this.delegate = {};
	this.images = [];
	this.loaded = 0;
}

N2i.Preloader.prototype = {
	addImages : function(imageOrImages) {
		if (typeof(imageOrImages)=='object') {
			for (var i=0; i < imageOrImages.length; i++) {
				this.images.push(imageOrImages[i]);
			};
		} else {
			this.images.push(imageOrImages);
		}
	},
	setDelegate : function(d) {
		this.delegate = d;
	},
	load : function() {
		var self = this;
		this.obs = [];
		for (var i=0; i < this.images.length; i++) {
			var img = new Image();
			img.n2iPreloaderIndex = i;
			img.onload = function() {self.imageChanged(this.n2iPreloaderIndex,'imageDidLoad')};
			img.onerror = function() {self.imageChanged(this.n2iPreloaderIndex,'imageDidGiveError')};
			img.onabort = function() {self.imageChanged(this.n2iPreloaderIndex,'imageDidAbort')};
			img.src = (this.options.context ? this.options.context : '')+this.images[i];
			this.obs.push(img);
		};
	},
	imageChanged : function(index,method) {
		this.loaded++;
		if (this.delegate[method]) {
			this.delegate[method](this.loaded,this.images.length,index);
		}
		if (this.loaded==this.images.length && this.delegate.allImagesDidLoad) {
			this.delegate.allImagesDidLoad();
		}
	}
}

///////////////////////////////////// Strings /////////////////////////////////////

N2i.trim = function(str) {
	if (!str) return str;
	return str.replace(/^[\s\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+|[\s\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/g, '');
}

N2i.isEmpty = function(str) {
	if (str==null || typeof(str)=='undefined') return true;
	return N2i.trim(str).length==0;
}

///////////////////////////////////// Arrays /////////////////////////////////////

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

/////////////////////////////////////////////// Browsers //////////////////////////////////////

N2i.isIE = function() {
	var ua = navigator.userAgent;
	var opera = /opera [56789]|opera\/[56789]/i.test(ua);
	var ie = !opera && /MSIE/.test(ua);
	return ie;
}

////////////////////////////////////////////// Cookie ///////////////////////////////////////////

N2i.Cookie = {
	set : function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	get : function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	clear : function(name) {
		this.set(name,"",-1);
	}
}/*  Prototype JavaScript framework, version 1.6.0.2
 *  (c) 2005-2008 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.6.0.2',

  Browser: {
    IE:     !!(window.attachEvent && !window.opera),
    Opera:  !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
  },

  BrowserFeatures: {
    XPath: !!document.evaluate,
    ElementExtensions: !!window.HTMLElement,
    SpecificElementExtensions:
      document.createElement('div').__proto__ &&
      document.createElement('div').__proto__ !==
        document.createElement('form').__proto__
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;


/* Based on Alex Arnell's inheritance implementation. */
var Class = {
  create: function() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      var subclass = function() { };
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;

    return klass;
  }
};

Class.Methods = {
  addMethods: function(source) {
    var ancestor   = this.superclass && this.superclass.prototype;
    var properties = Object.keys(source);

    if (!Object.keys({ toString: true }).length)
      properties.push("toString", "valueOf");

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value, value = Object.extend((function(m) {
          return function() { return ancestor[m].apply(this, arguments) };
        })(property).wrap(method), {
          valueOf:  function() { return method },
          toString: function() { return method.toString() }
        });
      }
      this.prototype[property] = value;
    }

    return this;
  }
};

var Abstract = { };

Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

Object.extend(Object, {
  inspect: function(object) {
    try {
      if (Object.isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

  toJSON: function(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (Object.isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = Object.toJSON(object[property]);
      if (!Object.isUndefined(value))
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  },

  toQueryString: function(object) {
    return $H(object).toQueryString();
  },

  toHTML: function(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  },

  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  clone: function(object) {
    return Object.extend({ }, object);
  },

  isElement: function(object) {
    return object && object.nodeType == 1;
  },

  isArray: function(object) {
    return object != null && typeof object == "object" &&
      'splice' in object && 'join' in object;
  },

  isHash: function(object) {
    return object instanceof Hash;
  },

  isFunction: function(object) {
    return typeof object == "function";
  },

  isString: function(object) {
    return typeof object == "string";
  },

  isNumber: function(object) {
    return typeof object == "number";
  },

  isUndefined: function(object) {
    return typeof object == "undefined";
  }
});

Object.extend(Function.prototype, {
  argumentNames: function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");
    return names.length == 1 && !names[0] ? [] : names;
  },

  bind: function() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = $A(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat($A(arguments)));
    }
  },

  bindAsEventListener: function() {
    var __method = this, args = $A(arguments), object = args.shift();
    return function(event) {
      return __method.apply(object, [event || window.event].concat(args));
    }
  },

  curry: function() {
    if (!arguments.length) return this;
    var __method = this, args = $A(arguments);
    return function() {
      return __method.apply(this, args.concat($A(arguments)));
    }
  },

  delay: function() {
    var __method = this, args = $A(arguments), timeout = args.shift() * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  },

  wrap: function(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, [__method.bind(this)].concat($A(arguments)));
    }
  },

  methodize: function() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      return __method.apply(null, [this].concat($A(arguments)));
    };
  }
});

Function.prototype.defer = Function.prototype.delay.curry(0.01);

Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

/*--------------------------------------------------------------------------*/

var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, {
  gsub: function(pattern, replacement) {
    var result = '', source = this, match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },

  sub: function(pattern, replacement, count) {
    replacement = this.gsub.prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  },

  scan: function(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  },

  truncate: function(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  },

  strip: function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  stripScripts: function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  },

  extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },

  evalScripts: function() {
    return this.extractScripts().map(function(script) { return eval(script) });
  },

  escapeHTML: function() {
    var self = arguments.callee;
    self.text.data = this;
    return self.div.innerHTML;
  },

  unescapeHTML: function() {
    var div = new Element('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? (div.childNodes.length > 1 ?
      $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :
      div.childNodes[0].nodeValue) : '';
  },

  toQueryParams: function(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  },

  toArray: function() {
    return this.split('');
  },

  succ: function() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  },

  times: function(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  },

  camelize: function() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  },

  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  underscore: function() {
    return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
  },

  dasherize: function() {
    return this.gsub(/_/,'-');
  },

  inspect: function(useDoubleQuotes) {
    var escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
      var character = String.specialChar[match[0]];
      return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  },

  toJSON: function() {
    return this.inspect(true);
  },

  unfilterJSON: function(filter) {
    return this.sub(filter || Prototype.JSONFilter, '#{1}');
  },

  isJSON: function() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  },

  evalJSON: function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  },

  include: function(pattern) {
    return this.indexOf(pattern) > -1;
  },

  startsWith: function(pattern) {
    return this.indexOf(pattern) === 0;
  },

  endsWith: function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  },

  empty: function() {
    return this == '';
  },

  blank: function() {
    return /^\s*$/.test(this);
  },

  interpolate: function(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }
});

if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
  escapeHTML: function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  unescapeHTML: function() {
    return this.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
});

String.prototype.gsub.prepareReplacement = function(replacement) {
  if (Object.isFunction(replacement)) return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
};

String.prototype.parseQuery = String.prototype.toQueryParams;

Object.extend(String.prototype.escapeHTML, {
  div:  document.createElement('div'),
  text: document.createTextNode('')
});

with (String.prototype.escapeHTML) div.appendChild(text);

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return '';

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3];
      var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = {
  each: function(iterator, context) {
    var index = 0;
    iterator = iterator.bind(context);
    try {
      this._each(function(value) {
        iterator(value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  },

  eachSlice: function(number, iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var index = -number, slices = [], array = this.toArray();
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  },

  all: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator(value, index);
      if (!result) throw $break;
    });
    return result;
  },

  any: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator(value, index))
        throw $break;
    });
    return result;
  },

  collect: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator(value, index));
    });
    return results;
  },

  detect: function(iterator, context) {
    iterator = iterator.bind(context);
    var result;
    this.each(function(value, index) {
      if (iterator(value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },

  findAll: function(iterator, context) {
    iterator = iterator.bind(context);
    var results = [];
    this.each(function(value, index) {
      if (iterator(value, index))
        results.push(value);
    });
    return results;
  },

  grep: function(filter, iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(filter);

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator(value, index));
    });
    return results;
  },

  include: function(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  },

  inGroupsOf: function(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  },

  inject: function(memo, iterator, context) {
    iterator = iterator.bind(context);
    this.each(function(value, index) {
      memo = iterator(memo, value, index);
    });
    return memo;
  },

  invoke: function(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  },

  max: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator(value, index);
      if (result == null || value >= result)
        result = value;
    });
    return result;
  },

  min: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator(value, index);
      if (result == null || value < result)
        result = value;
    });
    return result;
  },

  partition: function(iterator, context) {
    iterator = iterator ? iterator.bind(context) : Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator(value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  },

  pluck: function(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  },

  reject: function(iterator, context) {
    iterator = iterator.bind(context);
    var results = [];
    this.each(function(value, index) {
      if (!iterator(value, index))
        results.push(value);
    });
    return results;
  },

  sortBy: function(iterator, context) {
    iterator = iterator.bind(context);
    return this.map(function(value, index) {
      return {value: value, criteria: iterator(value, index)};
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  },

  toArray: function() {
    return this.map();
  },

  zip: function() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  },

  size: function() {
    return this.toArray().length;
  },

  inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
};

Object.extend(Enumerable, {
  map:     Enumerable.collect,
  find:    Enumerable.detect,
  select:  Enumerable.findAll,
  filter:  Enumerable.findAll,
  member:  Enumerable.include,
  entries: Enumerable.toArray,
  every:   Enumerable.all,
  some:    Enumerable.any
});
function $A(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

if (Prototype.Browser.WebKit) {
  $A = function(iterable) {
    if (!iterable) return [];
    if (!(Object.isFunction(iterable) && iterable == '[object NodeList]') &&
        iterable.toArray) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  };
}

Array.from = $A;

Object.extend(Array.prototype, Enumerable);

if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;

Object.extend(Array.prototype, {
  _each: function(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  },

  clear: function() {
    this.length = 0;
    return this;
  },

  first: function() {
    return this[0];
  },

  last: function() {
    return this[this.length - 1];
  },

  compact: function() {
    return this.select(function(value) {
      return value != null;
    });
  },

  flatten: function() {
    return this.inject([], function(array, value) {
      return array.concat(Object.isArray(value) ?
        value.flatten() : [value]);
    });
  },

  without: function() {
    var values = $A(arguments);
    return this.select(function(value) {
      return !values.include(value);
    });
  },

  reverse: function(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  },

  reduce: function() {
    return this.length > 1 ? this : this[0];
  },

  uniq: function(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  },

  intersect: function(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  },

  clone: function() {
    return [].concat(this);
  },

  size: function() {
    return this.length;
  },

  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  },

  toJSON: function() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }
});

// use native browser JS 1.6 implementation if available
if (Object.isFunction(Array.prototype.forEach))
  Array.prototype._each = Array.prototype.forEach;

if (!Array.prototype.indexOf) Array.prototype.indexOf = function(item, i) {
  i || (i = 0);
  var length = this.length;
  if (i < 0) i = length + i;
  for (; i < length; i++)
    if (this[i] === item) return i;
  return -1;
};

if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function(item, i) {
  i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
  var n = this.slice(0, i).reverse().indexOf(item);
  return (n < 0) ? n : i - n - 1;
};

Array.prototype.toArray = Array.prototype.clone;

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

if (Prototype.Browser.Opera){
  Array.prototype.concat = function() {
    var array = [];
    for (var i = 0, length = this.length; i < length; i++) array.push(this[i]);
    for (var i = 0, length = arguments.length; i < length; i++) {
      if (Object.isArray(arguments[i])) {
        for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++)
          array.push(arguments[i][j]);
      } else {
        array.push(arguments[i]);
      }
    }
    return array;
  };
}
Object.extend(Number.prototype, {
  toColorPart: function() {
    return this.toPaddedString(2, 16);
  },

  succ: function() {
    return this + 1;
  },

  times: function(iterator) {
    $R(0, this, true).each(iterator);
    return this;
  },

  toPaddedString: function(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  },

  toJSON: function() {
    return isFinite(this) ? this.toString() : 'null';
  }
});

$w('abs round ceil floor').each(function(method){
  Number.prototype[method] = Math[method].methodize();
});
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  return {
    initialize: function(object) {
      this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    },

    _each: function(iterator) {
      for (var key in this._object) {
        var value = this._object[key], pair = [key, value];
        pair.key = key;
        pair.value = value;
        iterator(pair);
      }
    },

    set: function(key, value) {
      return this._object[key] = value;
    },

    get: function(key) {
      return this._object[key];
    },

    unset: function(key) {
      var value = this._object[key];
      delete this._object[key];
      return value;
    },

    toObject: function() {
      return Object.clone(this._object);
    },

    keys: function() {
      return this.pluck('key');
    },

    values: function() {
      return this.pluck('value');
    },

    index: function(value) {
      var match = this.detect(function(pair) {
        return pair.value === value;
      });
      return match && match.key;
    },

    merge: function(object) {
      return this.clone().update(object);
    },

    update: function(object) {
      return new Hash(object).inject(this, function(result, pair) {
        result.set(pair.key, pair.value);
        return result;
      });
    },

    toQueryString: function() {
      return this.map(function(pair) {
        var key = encodeURIComponent(pair.key), values = pair.value;

        if (values && typeof values == 'object') {
          if (Object.isArray(values))
            return values.map(toQueryPair.curry(key)).join('&');
        }
        return toQueryPair(key, values);
      }).join('&');
    },

    inspect: function() {
      return '#<Hash:{' + this.map(function(pair) {
        return pair.map(Object.inspect).join(': ');
      }).join(', ') + '}>';
    },

    toJSON: function() {
      return Object.toJSON(this.toObject());
    },

    clone: function() {
      return new Hash(this);
    }
  }
})());

Hash.prototype.toTemplateReplacements = Hash.prototype.toObject;
Hash.from = $H;
var ObjectRange = Class.create(Enumerable, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },

  _each: function(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  },

  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
};

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});

Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters))
      this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});

Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      // simulate other verbs over post
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      // when GET, append parameters to URL
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    // user-defined headers
    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      // avoid memory leak in MSIE: clean up
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if(readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,
  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  // DOM level 2 ECMAScript Language Binding
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}

(function() {
  var element = this.Element;
  this.Element = function(tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    var cache = Element.cache;
    if (Prototype.Browser.IE && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(this.Element, element || { });
}).call(window);

Element.cache = { };

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide: function(element) {
    $(element).style.display = 'none';
    return element;
  },

  show: function(element) {
    $(element).style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) return element.update().insert(content);
    content = Object.toHTML(content);
    element.innerHTML = content.stripScripts();
    content.evalScripts.bind(content).defer();
    return element;
  },

  replace: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert: function(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes;

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return $(element).recursivelyCollect('parentNode');
  },

  descendants: function(element) {
    return $(element).select("*");
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return $(element).recursivelyCollect('previousSibling');
  },

  nextSiblings: function(element) {
    return $(element).recursivelyCollect('nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return element.previousSiblings().reverse().concat(element.nextSiblings());
  },

  match: function(element, selector) {
    if (Object.isString(selector))
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = element.ancestors();
    return Object.isNumber(expression) ? ancestors[expression] :
      Selector.findElement(ancestors, expression, index);
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return element.firstDescendant();
    return Object.isNumber(expression) ? element.descendants()[expression] :
      element.select(expression)[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = element.previousSiblings();
    return Object.isNumber(expression) ? previousSiblings[expression] :
      Selector.findElement(previousSiblings, expression, index);
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = element.nextSiblings();
    return Object.isNumber(expression) ? nextSiblings[expression] :
      Selector.findElement(nextSiblings, expression, index);
  },

  select: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element, args);
  },

  adjacent: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element.parentNode, args).without(element);
  },

  identify: function(element) {
    element = $(element);
    var id = element.readAttribute('id'), self = arguments.callee;
    if (id) return id;
    do { id = 'anonymous_element_' + self.counter++ } while ($(id));
    element.writeAttribute('id', id);
    return id;
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      var t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute: function(element, name, value) {
    element = $(element);
    var attributes = { }, t = Element._attributeTranslations.write;

    if (typeof name == 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (var attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight: function(element) {
    return $(element).getDimensions().height;
  },

  getWidth: function(element) {
    return $(element).getDimensions().width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    if (!element.hasClassName(className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    return element[element.hasClassName(className) ?
      'removeClassName' : 'addClassName'](className);
  },

  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    var originalAncestor = ancestor;

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (element.sourceIndex && !Prototype.Browser.Opera) {
      var e = element.sourceIndex, a = ancestor.sourceIndex,
       nextAncestor = ancestor.nextSibling;
      if (!nextAncestor) {
        do { ancestor = ancestor.parentNode; }
        while (!(nextAncestor = ancestor.nextSibling) && ancestor.parentNode);
      }
      if (nextAncestor && nextAncestor.sourceIndex)
       return (e > a && e < nextAncestor.sourceIndex);
    }

    while (element = element.parentNode)
      if (element == originalAncestor) return true;
    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = element.cumulativeOffset();
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value) {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    if (Object.isString(styles)) {
      element.style.cssText += ';' + styles;
      return styles.include('opacity') ?
        element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            property] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = $(element).getStyle('display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName == 'BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function(element) {
    element = $(element);
    if (element.getStyle('position') == 'absolute') return;
    // Position.prepare(); // To be done manually by Scripty when it needs it.

    var offsets = element.positionedOffset();
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
    return element;
  },

  relativize: function(element) {
    element = $(element);
    if (element.getStyle('position') == 'relative') return;
    // Position.prepare(); // To be done manually by Scripty when it needs it.

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return $(element);

    return $(document.body);
  },

  viewportOffset: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      // Safari fix
      if (element.offsetParent == document.body &&
        Element.getStyle(element, 'position') == 'absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || element.tagName == 'BODY') {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    // find page position of source
    source = $(source);
    var p = source.viewportOffset();

    // find coordinate system to use
    element = $(element);
    var delta = [0, 0];
    var parent = null;
    // delta [0,0] will do fine with position: fixed elements,
    // position:absolute needs offsetParent deltas
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = element.getOffsetParent();
      delta = parent.viewportOffset();
    }

    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    // set position
    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
};

Element.Methods.identify.counter = 1;

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,
  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    function(proceed, element, style) {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          // returns '0px' for hidden elements; we want it to return null
          if (!Element.visible(element)) return null;

          // returns the border-box dimensions rather than the content-box
          // dimensions, so we subtract padding and borders from the value
          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element['offset' + style.capitalize()])
            return dim + 'px';

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
             'padding-bottom', 'border-bottom-width'];
          }
          else {
            properties = ['border-left-width', 'padding-left',
             'padding-right', 'border-right-width'];
          }
          return properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          }) + 'px';
        default: return proceed(element, style);
      }
    }
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    function(proceed, element, attribute) {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    }
  );
}

else if (Prototype.Browser.IE) {
  // IE doesn't report offsets correctly for static elements, so we change them
  // to "relative" to get the values, then change them back.
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    function(proceed, element) {
      element = $(element);
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    }
  );

  $w('positionedOffset viewportOffset').each(function(method) {
    Element.Methods[method] = Element.Methods[method].wrap(
      function(proceed, element) {
        element = $(element);
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        // Trigger hasLayout on the offset parent so that IE6 reports
        // accurate offsetTop and offsetLeft values for position: fixed.
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
  });

  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset' + style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    element = $(element);
    var currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) ||
      (!currentStyle && element.style.zoom == 'normal'))
        element.style.zoom = 1;

    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ?
        style.filter = filter : style.removeAttribute('filter');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = stripAlpha(filter) +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  Element._attributeTranslations = {
    read: {
      names: {
        'class': 'className',
        'for':   'htmlFor'
      },
      values: {
        _getAttr: function(element, attribute) {
          return element.getAttribute(attribute, 2);
        },
        _getAttrNode: function(element, attribute) {
          var node = element.getAttributeNode(attribute);
          return node ? node.value : "";
        },
        _getEv: function(element, attribute) {
          attribute = element.getAttribute(attribute);
          return attribute ? attribute.toString().slice(23, -2) : null;
        },
        _flag: function(element, attribute) {
          return $(element).hasAttribute(attribute) ? attribute : null;
        },
        style: function(element) {
          return element.style.cssText.toLowerCase();
        },
        title: function(element) {
          return element.title;
        }
      }
    }
  };

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr,
      src:         v._getAttr,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);
}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;

    if (value == 1)
      if(element.tagName == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return element;
  };

  // Safari returns margins on body which is incorrect if the child is absolutely
  // positioned.  For performance reasons, redefine Element#cumulativeOffset for
  // KHTML/WebKit only.
  Element.Methods.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if (Prototype.Browser.IE || Prototype.Browser.Opera) {
  // IE and Opera are missing .innerHTML support for TABLE-related and SELECT elements
  Element.Methods.update = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) return element.update().insert(content);

    content = Object.toHTML(content);
    var tagName = element.tagName.toUpperCase();

    if (tagName in Element._insertionTranslations.tags) {
      $A(element.childNodes).each(function(node) { element.removeChild(node) });
      Element._getContentFromAnonymousElement(tagName, content.stripScripts())
        .each(function(node) { element.appendChild(node) });
    }
    else element.innerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

if ('outerHTML' in document.createElement('div')) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next();
      var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
      else
        fragments.each(function(node) { parent.appendChild(node) });
    }
    else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    t[2].times(function() { div = div.firstChild });
  } else div.innerHTML = html;
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  Object.extend(this.tags, {
    THEAD: this.tags.TBODY,
    TFOOT: this.tags.TBODY,
    TH:    this.tags.TD
  });
}).call(Element._insertionTranslations);

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return node && node.specified;
  }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

if (!Prototype.BrowserFeatures.ElementExtensions &&
    document.createElement('div').__proto__) {
  window.HTMLElement = { };
  window.HTMLElement.prototype = document.createElement('div').__proto__;
  Prototype.BrowserFeatures.ElementExtensions = true;
}

Element.extend = (function() {
  if (Prototype.BrowserFeatures.SpecificElementExtensions)
    return Prototype.K;

  var Methods = { }, ByTag = Element.Methods.ByTag;

  var extend = Object.extend(function(element) {
    if (!element || element._extendedByPrototype ||
        element.nodeType != 1 || element == window) return element;

    var methods = Object.clone(Methods),
      tagName = element.tagName, property, value;

    // extend methods for specific tags
    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    for (property in methods) {
      value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;

  }, {
    refresh: function() {
      // extend methods for all tags (Safari doesn't need this)
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    }
  });

  extend.refresh();
  return extend;
})();

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else {
    if (Object.isArray(tagName)) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    window[klass] = { };
    window[klass].prototype = document.createElement(tagName).__proto__;
    return window[klass];
  }

  if (F.ElementExtensions) {
    copy(Element.Methods, HTMLElement.prototype);
    copy(Element.Methods.Simulated, HTMLElement.prototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};

document.viewport = {
  getDimensions: function() {
    var dimensions = { };
    var B = Prototype.Browser;
    $w('width height').each(function(d) {
      var D = d.capitalize();
      dimensions[d] = (B.WebKit && !document.evaluate) ? self['inner' + D] :
        (B.Opera) ? document.body['client' + D] : document.documentElement['client' + D];
    });
    return dimensions;
  },

  getWidth: function() {
    return this.getDimensions().width;
  },

  getHeight: function() {
    return this.getDimensions().height;
  },

  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
  }
};
/* Portions of the Selector class are derived from Jack Slocumâ€™s DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
  initialize: function(expression) {
    this.expression = expression.strip();
    this.compileMatcher();
  },

  shouldUseXPath: function() {
    if (!Prototype.BrowserFeatures.XPath) return false;

    var e = this.expression;

    // Safari 3 chokes on :*-of-type and :empty
    if (Prototype.Browser.WebKit &&
     (e.include("-of-type") || e.include(":empty")))
      return false;

    // XPath can't do namespaced attributes, nor can it read
    // the "checked" property from DOM nodes
    if ((/(\[[\w-]*?:|:checked)/).test(this.expression))
      return false;

    return true;
  },

  compileMatcher: function() {
    if (this.shouldUseXPath())
      return this.compileXPathMatcher();

    var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
        c = Selector.criteria, le, p, m;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e];
      return;
    }

    this.matcher = ["this.matcher = function(root) {",
                    "var r = root, h = Selector.handlers, c = false, n;"];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          this.matcher.push(Object.isFunction(c[i]) ? c[i](m) :
    	      new Template(c[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push("return h.unique(n);\n}");
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher: function() {
    var e = this.expression, ps = Selector.patterns,
        x = Selector.xpath, le, m;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        if (m = e.match(ps[i])) {
          this.matcher.push(Object.isFunction(x[i]) ? x[i](m) :
            new Template(x[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements: function(root) {
    root = root || document;
    if (this.xpath) return document._getElementsByXPath(this.xpath, root);
    return this.matcher(root);
  },

  match: function(element) {
    this.tokens = [];

    var e = this.expression, ps = Selector.patterns, as = Selector.assertions;
    var le, p, m;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          // use the Selector.assertions methods unless the selector
          // is too complex.
          if (as[i]) {
            this.tokens.push([i, Object.clone(m)]);
            e = e.replace(m[0], '');
          } else {
            // reluctantly do a document-wide search
            // and look for a match in the array
            return this.findElements(document).include(element);
          }
        }
      }
    }

    var match = true, name, matches;
    for (var i = 0, token; token = this.tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!Selector.assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },

  toString: function() {
    return this.expression;
  },

  inspect: function() {
    return "#<Selector:" + this.expression.inspect() + ">";
  }
});

Object.extend(Selector, {
  _cache: { },

  xpath: {
    descendant:   "//*",
    child:        "/*",
    adjacent:     "/following-sibling::*[1]",
    laterSibling: '/following-sibling::*',
    tagName:      function(m) {
      if (m[1] == '*') return '';
      return "[local-name()='" + m[1].toLowerCase() +
             "' or local-name()='" + m[1].toUpperCase() + "']";
    },
    className:    "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id:           "[@id='#{1}']",
    attrPresence: function(m) {
      m[1] = m[1].toLowerCase();
      return new Template("[@#{1}]").evaluate(m);
    },
    attr: function(m) {
      m[1] = m[1].toLowerCase();
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo: function(m) {
      var h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (Object.isFunction(h)) return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=':  "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child':  '[not(following-sibling::*)]',
      'only-child':  '[not(preceding-sibling::* or following-sibling::*)]',
      'empty':       "[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]",
      'checked':     "[@checked]",
      'disabled':    "[@disabled]",
      'enabled':     "[not(@disabled)]",
      'not': function(m) {
        var e = m[6], p = Selector.patterns,
            x = Selector.xpath, le, v;

        var exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (var i in p) {
            if (m = e.match(p[i])) {
              v = Object.isFunction(x[i]) ? x[i](m) : new Template(x[i]).evaluate(m);
              exclusion.push("(" + v.substring(1, v.length - 1) + ")");
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return "[not(" + exclusion.join(" and ") + ")]";
      },
      'nth-child':      function(m) {
        return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
      },
      'nth-last-child': function(m) {
        return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
      },
      'nth-of-type':    function(m) {
        return Selector.xpath.pseudos.nth("position() ", m);
      },
      'nth-last-of-type': function(m) {
        return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
      },
      'first-of-type':  function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type':   function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type':   function(m) {
        var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth: function(fragment, m) {
        var mm, formula = m[6], predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd')  formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
          return '[' + fragment + "= " + mm[1] + ']';
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == "-") mm[1] = -1;
          var a = mm[1] ? Number(mm[1]) : 1;
          var b = mm[2] ? Number(mm[2]) : 0;
          predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
          "((#{fragment} - #{b}) div #{a} >= 0)]";
          return new Template(predicate).evaluate({
            fragment: fragment, a: a, b: b });
        }
      }
    }
  },

  criteria: {
    tagName:      'n = h.tagName(n, r, "#{1}", c);      c = false;',
    className:    'n = h.className(n, r, "#{1}", c);    c = false;',
    id:           'n = h.id(n, r, "#{1}", c);           c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
    attr: function(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
    },
    pseudo: function(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant:   'c = "descendant";',
    child:        'c = "child";',
    adjacent:     'c = "adjacent";',
    laterSibling: 'c = "laterSibling";'
  },

  patterns: {
    // combinators must be listed first
    // (and descendant needs to be last combinator)
    laterSibling: /^\s*~\s*/,
    child:        /^\s*>\s*/,
    adjacent:     /^\s*\+\s*/,
    descendant:   /^\s/,

    // selectors follow
    tagName:      /^\s*(\*|[\w\-]+)(\b|$)?/,
    id:           /^#([\w\-\*]+)(\b|$)/,
    className:    /^\.([\w\-\*]+)(\b|$)/,
    pseudo:
/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,
    attrPresence: /^\[([\w]+)\]/,
    attr:         /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
  },

  // for Selector.match and Element#match
  assertions: {
    tagName: function(element, matches) {
      return matches[1].toUpperCase() == element.tagName.toUpperCase();
    },

    className: function(element, matches) {
      return Element.hasClassName(element, matches[1]);
    },

    id: function(element, matches) {
      return element.id === matches[1];
    },

    attrPresence: function(element, matches) {
      return Element.hasAttribute(element, matches[1]);
    },

    attr: function(element, matches) {
      var nodeValue = Element.readAttribute(element, matches[1]);
      return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
    }
  },

  handlers: {
    // UTILITY FUNCTIONS
    // joins two collections
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        a.push(node);
      return a;
    },

    // marks an array of nodes for counting
    mark: function(nodes) {
      var _true = Prototype.emptyFunction;
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = _true;
      return nodes;
    },

    unmark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = undefined;
      return nodes;
    },

    // mark each child node with its position (for nth calls)
    // "ofType" flag indicates whether we're indexing for nth-of-type
    // rather than nth-child
    index: function(parentNode, reverse, ofType) {
      parentNode._countedByPrototype = Prototype.emptyFunction;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          var node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
      }
    },

    // filters out duplicates and extends all nodes
    unique: function(nodes) {
      if (nodes.length == 0) return nodes;
      var results = [], n;
      for (var i = 0, l = nodes.length; i < l; i++)
        if (!(n = nodes[i])._countedByPrototype) {
          n._countedByPrototype = Prototype.emptyFunction;
          results.push(Element.extend(n));
        }
      return Selector.handlers.unmark(results);
    },

    // COMBINATOR FUNCTIONS
    descendant: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, child; child = node.childNodes[j]; j++)
          if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent: function(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        var next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling: function(node) {
      while (node = node.nextSibling)
	      if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling: function(node) {
      while (node = node.previousSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    // TOKEN FUNCTIONS
    tagName: function(nodes, root, tagName, combinator) {
      var uTagName = tagName.toUpperCase();
      var results = [], h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          // fastlane for ordinary descendant combinators
          if (combinator == "descendant") {
            for (var i = 0, node; node = nodes[i]; i++)
              h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } else nodes = this[combinator](nodes);
          if (tagName == "*") return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName.toUpperCase() === uTagName) results.push(node);
        return results;
      } else return root.getElementsByTagName(tagName);
    },

    id: function(nodes, root, id, combinator) {
      var targetNode = $(id), h = Selector.handlers;
      if (!targetNode) return [];
      if (!nodes && root == document) return [targetNode];
      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Selector.handlers.previousElementSibling(targetNode) == node)
                return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className: function(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName: function(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      var needle = ' ' + className + ' ';
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
          results.push(node);
      }
      return results;
    },

    attrPresence: function(nodes, root, attr, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var results = [];
      for (var i = 0, node; node = nodes[i]; i++)
        if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr: function(nodes, root, attr, value, operator, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var handler = Selector.operators[operator], results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        var nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo: function(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName("*");
      return Selector.pseudos[name](nodes, value, root);
    }
  },

  pseudos: {
    'first-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'last-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'only-child': function(nodes, value, root) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
          results.push(node);
      return results;
    },
    'nth-child':        function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child':   function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type':      function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type':    function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, false, true);
    },
    'last-of-type':     function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, true, true);
    },
    'only-of-type':     function(nodes, formula, root) {
      var p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    // handles the an+b logic
    getIndices: function(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], function(memo, i) {
        if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    // handles nth(-last)-child, nth(-last)-of-type, and (first|last)-of-type
    nth: function(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd')  formula = '2n+1';
      var h = Selector.handlers, results = [], indexed = [], m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._countedByPrototype) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == "-") m[1] = -1;
        var a = m[1] ? Number(m[1]) : 1;
        var b = m[2] ? Number(m[2]) : 0;
        var indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (var j = 0; j < l; j++)
            if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    'empty': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        // IE treats comments as element nodes
        if (node.tagName == '!' || (node.firstChild && !node.innerHTML.match(/^\s*$/))) continue;
        results.push(node);
      }
      return results;
    },

    'not': function(nodes, selector, root) {
      var h = Selector.handlers, selectorType, m;
      var exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node._countedByPrototype) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    'enabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node.disabled) results.push(node);
      return results;
    },

    'disabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.disabled) results.push(node);
      return results;
    },

    'checked': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.checked) results.push(node);
      return results;
    }
  },

  operators: {
    '=':  function(nv, v) { return nv == v; },
    '!=': function(nv, v) { return nv != v; },
    '^=': function(nv, v) { return nv.startsWith(v); },
    '$=': function(nv, v) { return nv.endsWith(v); },
    '*=': function(nv, v) { return nv.include(v); },
    '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
    '|=': function(nv, v) { return ('-' + nv.toUpperCase() + '-').include('-' + v.toUpperCase() + '-'); }
  },

  split: function(expression) {
    var expressions = [];
    expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
      expressions.push(m[1].strip());
    });
    return expressions;
  },

  matchElements: function(elements, expression) {
    var matches = $$(expression), h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++)
      if (element._countedByPrototype) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement: function(elements, expression, index) {
    if (Object.isNumber(expression)) {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements: function(element, expressions) {
    expressions = Selector.split(expressions.join(','));
    var results = [], h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  }
});

if (Prototype.Browser.IE) {
  Object.extend(Selector.handlers, {
    // IE returns comment nodes on getElementsByTagName("*").
    // Filter them out.
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        if (node.tagName !== "!") a.push(node);
      return a;
    },

    // IE improperly serializes _countedByPrototype in (inner|outer)HTML.
    unmark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node.removeAttribute('_countedByPrototype');
      return nodes;
    }
  });
}

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}
var Form = {
  reset: function(form) {
    $(form).reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit;

    var data = elements.inject({ }, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            // a key is already present; construct an array of values
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements: function(form) {
    return $A($(form).getElementsByTagName('*')).inject([],
      function(elements, child) {
        if (Form.Element.Serializers[child.tagName.toLowerCase()])
          elements.push(Element.extend(child));
        return elements;
      }
    );
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {
  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !['button', 'reset', 'submit'].include(element.type)))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.blur();
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;
var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, index) {
    if (Object.isUndefined(index))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, value, single = !Object.isArray(index);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        value = this.optionValue(opt);
        if (single) {
          if (value == index) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = index.include(value);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    // extend element because hasAttribute may not be native
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
if (!window.Event) var Event = { };

Object.extend(Event, {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
  KEY_HOME:     36,
  KEY_END:      35,
  KEY_PAGEUP:   33,
  KEY_PAGEDOWN: 34,
  KEY_INSERT:   45,

  cache: { },

  relatedTarget: function(event) {
    var element;
    switch(event.type) {
      case 'mouseover': element = event.fromElement; break;
      case 'mouseout':  element = event.toElement;   break;
      default: return null;
    }
    return Element.extend(element);
  }
});

Event.Methods = (function() {
  var isButton;

  if (Prototype.Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    isButton = function(event, code) {
      return event.button == buttonMap[code];
    };

  } else if (Prototype.Browser.WebKit) {
    isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };

  } else {
    isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  return {
    isLeftClick:   function(event) { return isButton(event, 0) },
    isMiddleClick: function(event) { return isButton(event, 1) },
    isRightClick:  function(event) { return isButton(event, 2) },

    element: function(event) {
      var node = Event.extend(event).target;
      return Element.extend(node.nodeType == Node.TEXT_NODE ? node.parentNode : node);
    },

    findElement: function(event, expression) {
      var element = Event.element(event);
      if (!expression) return element;
      var elements = [element].concat(element.ancestors());
      return Selector.findElement(elements, expression, 0);
    },

    pointer: function(event) {
      return {
        x: event.pageX || (event.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft)),
        y: event.pageY || (event.clientY +
          (document.documentElement.scrollTop || document.body.scrollTop))
      };
    },

    pointerX: function(event) { return Event.pointer(event).x },
    pointerY: function(event) { return Event.pointer(event).y },

    stop: function(event) {
      Event.extend(event);
      event.preventDefault();
      event.stopPropagation();
      event.stopped = true;
    }
  };
})();

Event.extend = (function() {
  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return "[object Event]" }
    });

    return function(event) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      var pointer = Event.pointer(event);
      Object.extend(event, {
        target: event.srcElement,
        relatedTarget: Event.relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });
      return Object.extend(event, methods);
    };

  } else {
    Event.prototype = Event.prototype || document.createEvent("HTMLEvents").__proto__;
    Object.extend(Event.prototype, methods);
    return Prototype.K;
  }
})();

Object.extend(Event, (function() {
  var cache = Event.cache;

  function getEventID(element) {
    if (element._prototypeEventID) return element._prototypeEventID[0];
    arguments.callee.id = arguments.callee.id || 1;
    return element._prototypeEventID = [++arguments.callee.id];
  }

  function getDOMEventName(eventName) {
    if (eventName && eventName.include(':')) return "dataavailable";
    return eventName;
  }

  function getCacheForID(id) {
    return cache[id] = cache[id] || { };
  }

  function getWrappersForEventName(id, eventName) {
    var c = getCacheForID(id);
    return c[eventName] = c[eventName] || [];
  }

  function createWrapper(element, eventName, handler) {
    var id = getEventID(element);
    var c = getWrappersForEventName(id, eventName);
    if (c.pluck("handler").include(handler)) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
  }

  function findWrapper(id, eventName, handler) {
    var c = getWrappersForEventName(id, eventName);
    return c.find(function(wrapper) { return wrapper.handler == handler });
  }

  function destroyWrapper(id, eventName, handler) {
    var c = getCacheForID(id);
    if (!c[eventName]) return false;
    c[eventName] = c[eventName].without(findWrapper(id, eventName, handler));
  }

  function destroyCache() {
    for (var id in cache)
      for (var eventName in cache[id])
        cache[id][eventName] = null;
  }

  if (window.attachEvent) {
    window.attachEvent("onunload", destroyCache);
  }

  return {
    observe: function(element, eventName, handler) {
      element = $(element);
      var name = getDOMEventName(eventName);

      var wrapper = createWrapper(element, eventName, handler);
      if (!wrapper) return element;

      if (element.addEventListener) {
        element.addEventListener(name, wrapper, false);
      } else {
        element.attachEvent("on" + name, wrapper);
      }

      return element;
    },

    stopObserving: function(element, eventName, handler) {
      element = $(element);
      var id = getEventID(element), name = getDOMEventName(eventName);

      if (!handler && eventName) {
        getWrappersForEventName(id, eventName).each(function(wrapper) {
          element.stopObserving(eventName, wrapper.handler);
        });
        return element;

      } else if (!eventName) {
        Object.keys(getCacheForID(id)).each(function(eventName) {
          element.stopObserving(eventName);
        });
        return element;
      }

      var wrapper = findWrapper(id, eventName, handler);
      if (!wrapper) return element;

      if (element.removeEventListener) {
        element.removeEventListener(name, wrapper, false);
      } else {
        element.detachEvent("on" + name, wrapper);
      }

      destroyWrapper(id, eventName, handler);

      return element;
    },

    fire: function(element, eventName, memo) {
      element = $(element);
      if (element == document && document.createEvent && !element.dispatchEvent)
        element = document.documentElement;

      var event;
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("dataavailable", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "ondataavailable";
      }

      event.eventName = eventName;
      event.memo = memo || { };

      if (document.createEvent) {
        element.dispatchEvent(event);
      } else {
        element.fireEvent(event.eventType, event);
      }

      return Event.extend(event);
    }
  };
})());

Object.extend(Event, Event.Methods);

Element.addMethods({
  fire:          Event.fire,
  observe:       Event.observe,
  stopObserving: Event.stopObserving
});

Object.extend(document, {
  fire:          Element.Methods.fire.methodize(),
  observe:       Element.Methods.observe.methodize(),
  stopObserving: Element.Methods.stopObserving.methodize(),
  loaded:        false
});

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards and John Resig. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearInterval(timer);
    document.fire("dom:loaded");
    document.loaded = true;
  }

  if (document.addEventListener) {
    if (Prototype.Browser.WebKit) {
      timer = window.setInterval(function() {
        if (/loaded|complete/.test(document.readyState))
          fireContentLoadedEvent();
      }, 0);

      Event.observe(window, "load", fireContentLoadedEvent);

    } else {
      document.addEventListener("DOMContentLoaded",
        fireContentLoadedEvent, false);
    }

  } else {
    document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
    $("__onDOMContentLoaded").onreadystatechange = function() {
      if (this.readyState == "complete") {
        this.onreadystatechange = null;
        fireContentLoadedEvent();
      }
    };
  }
})();
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

// This should be moved to script.aculo.us; notice the deprecated methods
// further below, that map to the newer Element methods.
var Position = {
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,

  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  // caches x/y coordinate pair to use with overlap
  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  // within must be called directly before
  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },

  // Deprecation layer -- use newer Element methods now (1.5.2).

  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

Element.addMethods();/**
 * SWFUpload v2.1.0 by Jacob Roberts, Feb 2008, http://www.swfupload.org, http://swfupload.googlecode.com, http://www.swfupload.org
 * -------- -------- -------- -------- -------- -------- -------- --------
 * SWFUpload is (c) 2006 Lars Huring, Olov Nilz�n and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * See Changelog.txt for version history
 *
 */


/* *********** */
/* Constructor */
/* *********** */

var SWFUpload = function (settings) {
	this.initSWFUpload(settings);
};

SWFUpload.prototype.initSWFUpload = function (settings) {
	try {
		this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;

		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings.  Load the Flash movie.
		this.initSettings();
		this.loadFlash();
		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.1.0";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED	  		: -100,
	FILE_EXCEEDS_SIZE_LIMIT  		: -110,
	ZERO_BYTE_FILE			  		: -120,
	INVALID_FILETYPE		  		: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR				  		: -200,
	MISSING_UPLOAD_URL	      		: -210,
	IO_ERROR				  		: -220,
	SECURITY_ERROR			  		: -230,
	UPLOAD_LIMIT_EXCEEDED	  		: -240,
	UPLOAD_FAILED			  		: -250,
	SPECIFIED_FILE_ID_NOT_FOUND		: -260,
	FILE_VALIDATION_FAILED	  		: -270,
	FILE_CANCELLED			  		: -280,
	UPLOAD_STOPPED					: -290
};
SWFUpload.FILE_STATUS = {
	QUEUED		 : -1,
	IN_PROGRESS	 : -2,
	ERROR		 : -3,
	COMPLETE	 : -4,
	CANCELLED	 : -5
};


/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function () {
	this.ensureDefault = function (settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
	};
	
	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	
	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload_f9.swf");
	this.ensureDefault("flash_color", "#FFFFFF");

	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API
	
	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);
	
	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);
	
	this.ensureDefault("debug_handler", function(msg) {
		N2i.log(msg)
	});

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	delete this.ensureDefault;
};

// Private: loadFlash generates the HTML tag for the Flash
// It then adds the flash to the body
SWFUpload.prototype.loadFlash = function () {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the body tag where we will be adding the flash movie
	targetElement = document.getElementsByTagName("body")[0];

	if (targetElement == undefined) {
		throw "Could not find the 'body' element.";
	}

	// Append the container and load the flash
	container = document.createElement("div");
	container.style.top = "-100px";
	container.style.left = "-100px";
	container.style.position = "absolute";

	targetElement.appendChild(container);
	if (N2i.isIE()) {
		container.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	} else {
		var object = N2i.create('object',{id:this.movieName,data:this.settings.flash_url},{width:'1px',height:'1px'});
		object.appendChild(N2i.create('param',{name:'movie',value:this.settings.flash_url}));
		object.appendChild(N2i.create('param',{name:'flashvars',value: this.getFlashVars()}));
		container.appendChild(object);
	}
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="1" height="1" style="-moz-user-focus: ignore;">',
				'<param name="movie" value="', this.settings.flash_url, '" />',
				'<param name="bgcolor" value="', this.settings.flash_color, '" />',
				'<param name="quality" value="high" />',
				'<param name="menu" value="false" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function () {
	// Build a string from the post param object
	var paramString = this.buildParamString();

	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&params=", encodeURIComponent(paramString),
			"&filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&fileTypes=", encodeURIComponent(this.settings.file_types),
			"&fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			"&fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			"&debugEnabled=", encodeURIComponent(this.settings.debug_enabled)].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function () {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}
	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function () {
	var postParams = this.settings.post_params;
	var paramStringPairs = [];

	if (typeof(postParams) === "object") {
		for (var name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
SWFUpload.prototype.destroy = function () {
	try {
		// Make sure Flash is done before we try to remove it
		this.stopUpload();
		
		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		try {
			movieElement = this.getMovieElement();
		} catch (ex) {
		}
		
		if (movieElement != undefined && movieElement.parentNode != undefined && typeof(movieElement.parentNode.removeChild) === "function") {
			var container = movieElement.parentNode;
			if (container != undefined) {
				container.removeChild(movieElement);
				if (container.parentNode != undefined && typeof(container.parentNode.removeChild) === "function") {
					container.parentNode.removeChild(container);
				}
			}
		}
		
		// Destroy references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		delete this.movieElement;
		delete this.settings;
		delete this.customSettings;
		delete this.eventQueue;
		delete this.movieName;
		
		return true;
	} catch (ex1) {
		return false;
	}
};

// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function () {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:             ", this.settings.upload_url, "\n",
			"\t", "use_query_string:       ", this.settings.use_query_string.toString(), "\n",
			"\t", "file_post_name:         ", this.settings.file_post_name, "\n",
			"\t", "post_params:            ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:             ", this.settings.file_types, "\n",
			"\t", "file_types_description: ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:        ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:      ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:       ", this.settings.file_queue_limit, "\n",
			"\t", "flash_url:              ", this.settings.flash_url, "\n",
			"\t", "flash_color:            ", this.settings.flash_color, "\n",
			"\t", "debug:                  ", this.settings.debug.toString(), "\n",
			"\t", "custom_settings:        ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof(this.settings.swfupload_loaded_handler) === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof(this.settings.file_dialog_start_handler) === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof(this.settings.file_queued_handler) === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof(this.settings.file_queue_error_handler) === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof(this.settings.upload_start_handler) === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof(this.settings.upload_progress_handler) === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof(this.settings.upload_error_handler) === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof(this.settings.upload_success_handler) === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof(this.settings.upload_complete_handler) === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof(this.settings.debug_handler) === "function").toString(), "\n"
		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function (name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
	}

    return "";
};



// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function (functionName, argumentArray) {
	argumentArray = argumentArray || [];
	
	var self = this;
	var callFunction = function () {
		var movieElement = self.getMovieElement();
		var returnValue;
		if (typeof(movieElement[functionName]) == "function") {
			// We have to go through all this if/else stuff because the Flash functions don't have apply() and only accept the exact number of arguments.
			if (argumentArray.length === 0) {
				returnValue = movieElement[functionName]();
			} else if (argumentArray.length === 1) {
				returnValue = movieElement[functionName](argumentArray[0]);
			} else if (argumentArray.length === 2) {
				returnValue = movieElement[functionName](argumentArray[0], argumentArray[1]);
			} else if (argumentArray.length === 3) {
				returnValue = movieElement[functionName](argumentArray[0], argumentArray[1], argumentArray[2]);
			} else {
				throw "Too many arguments";
			}
			
			// Unescape file post param values
			if (returnValue != undefined && typeof(returnValue.post) === "object") {
				returnValue = self.unescapeFilePostParams(returnValue);
			}
			
			return returnValue;
		} else {
			throw "Invalid function name";
		}
	};
	
	return callFunction();
};


/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function () {
	this.callFlash("SelectFiles");
};


// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startUpload = function (fileID) {
	this.callFlash("StartUpload", [fileID]);
};

/* Cancels a the file upload.  You must specify a file_id */
// Public: cancelUpload cancels any queued file.  The fileID parameter
// must be specified.
SWFUpload.prototype.cancelUpload = function (fileID) {
	this.callFlash("CancelUpload", [fileID]);
};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
	this.callFlash("StopUpload");
};

/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function () {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function (statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function (fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function (fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function (url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function (paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function (name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function (name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function (types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function (fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function (fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function (fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function (filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function (useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function (requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function (debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};


/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function (handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop
	
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	
	var self = this;
	if (typeof(this.settings[handlerName]) === "function") {
		// Queue the event
		this.eventQueue.push(function () {
			this.settings[handlerName].apply(this, argumentArray);
		});
		
		// Execute the next queued event
		setTimeout(function () {
			self.executeNextEvent();
		}, 0);
		
	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function () {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var  f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterfance cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function (file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if (file != undefined) {
		for (var k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x"+match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

SWFUpload.prototype.flashReady = function () {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = this.getMovieElement();
	if (typeof(movieElement.StartUpload) !== "function") {
		throw "ExternalInterface methods failed to initialize.";
	}
	
	this.queueEvent("swfupload_loaded_handler");
};


/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function () {
	this.queueEvent("file_dialog_start_handler");
};


/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};


/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function (numFilesSelected, numFilesQueued) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued]);
};

SWFUpload.prototype.uploadStart = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function (file) {
	var returnValue;
	if (typeof(this.settings.upload_start_handler) === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	returnValue = !!returnValue;
	
	this.callFlash("ReturnUploadStart", [returnValue]);
};



SWFUpload.prototype.uploadProgress = function (file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function (file, serverData) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData]);
};

SWFUpload.prototype.uploadComplete = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function (message) {
	this.queueEvent("debug_handler", message);
};
if (!N2i) {var N2i = {};}

/**
 * @class
 */
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

N2i.Animation.elasticIn = function(n) {
	if(n==0){ return 0; }
	if(n==1){ return 1; }
	var p = .3;
	var s = p/4;
	n = n - 1;
	return -1 * Math.pow(2,10*n) * Math.sin((n-s)*(2*Math.PI)/p);
}

N2i.Animation.backOut = function(n) {
	n = n - 1;
	var s = 1.70158;
	return Math.pow(n, 2) * ((s + 1) * n + s) + 1;
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
	if (t<=0 || t>=1) return t;
	if (!p) p=0.45;
	var s;
	if (!a || a < 1) {
		a=1;
		s=p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (1/a);
	}
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
				if (place<0) {
					next=true;
					continue;
				}
				else if (isNaN(place)) place = 1;
				else if (place>1) place=1;
				else if (place<1) next=true;
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
	if (delegate && delegate.delay) work.start+=delegate.delay;
	work.end = work.start+duration;
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


N2i.ease = {
	
	linear: function(/* Decimal? */n){
		// summary: A linear easing function
		return n;
	},

	quadIn: function(/* Decimal? */n){
		return Math.pow(n, 2);
	},

	quadOut: function(/* Decimal? */n){
		return n * (n-2) * -1;
	},

	quadInOut: function(/* Decimal? */n){
		n=n*2;
		if(n<1){ return Math.pow(n, 2) / 2; }
		return -1 * ((--n)*(n-2) - 1) / 2;
	},

	cubicIn: function(/* Decimal? */n){
		return Math.pow(n, 3);
	},

	cubicOut: function(/* Decimal? */n){
		return Math.pow(n-1, 3) + 1;
	},

	cubicInOut: function(/* Decimal? */n){
		n=n*2;
		if(n<1){ return Math.pow(n, 3) / 2; }
		n-=2;
		return (Math.pow(n, 3) + 2) / 2;
	},

	quartIn: function(/* Decimal? */n){
		return Math.pow(n, 4);
	},

	quartOut: function(/* Decimal? */n){
		return -1 * (Math.pow(n-1, 4) - 1);
	},

	quartInOut: function(/* Decimal? */n){
		n=n*2;
		if(n<1){ return Math.pow(n, 4) / 2; }
		n-=2;
		return -1/2 * (Math.pow(n, 4) - 2);
	},

	quintIn: function(/* Decimal? */n){
		return Math.pow(n, 5);
	},

	quintOut: function(/* Decimal? */n){
		return Math.pow(n-1, 5) + 1;
	},

	quintInOut: function(/* Decimal? */n){
		n=n*2;
		if(n<1){ return Math.pow(n, 5) / 2; };
		n-=2;
		return (Math.pow(n, 5) + 2) / 2;
	},

	sineIn: function(/* Decimal? */n){
		return -1 * Math.cos(n * (Math.PI/2)) + 1;
	},

	sineOut: function(/* Decimal? */n){
		return Math.sin(n * (Math.PI/2));
	},

	sineInOut: function(/* Decimal? */n){
		return -1 * (Math.cos(Math.PI*n) - 1) / 2;
	},

	expoIn: function(/* Decimal? */n){
		return (n==0) ? 0 : Math.pow(2, 10 * (n - 1));
	},

	expoOut: function(/* Decimal? */n){
		return (n==1) ? 1 : (-1 * Math.pow(2, -10 * n) + 1);
	},

	expoInOut: function(/* Decimal? */n){
		if(n==0){ return 0; }
		if(n==1){ return 1; }
		n = n*2;
		if(n<1){ return Math.pow(2, 10 * (n-1)) / 2; }
		--n;
		return (-1 * Math.pow(2, -10 * n) + 2) / 2;
	},

	circIn: function(/* Decimal? */n){
		return -1 * (Math.sqrt(1 - Math.pow(n, 2)) - 1);
	},

	circOut: function(/* Decimal? */n){
		n = n-1;
		return Math.sqrt(1 - Math.pow(n, 2));
	},

	circInOut: function(/* Decimal? */n){
		n = n*2;
		if(n<1){ return -1/2 * (Math.sqrt(1 - Math.pow(n, 2)) - 1); }
		n-=2;
		return 1/2 * (Math.sqrt(1 - Math.pow(n, 2)) + 1);
	},

	backIn: function(/* Decimal? */n){
		var s = 1.70158;
		return Math.pow(n, 2) * ((s+1)*n - s);
	},

	backOut: function(/* Decimal? */n){
		// summary: an easing function that pops past the range briefly, and 
		// 	slowly comes back. 
		n = n - 1;
		var s = 1.70158;
		return Math.pow(n, 2) * ((s + 1) * n + s) + 1;
	},

	backInOut: function(/* Decimal? */n){
		var s = 1.70158 * 1.525;
		n = n*2;
		if(n < 1){ return (Math.pow(n, 2)*((s+1)*n - s))/2; }
		n-=2;
		return (Math.pow(n, 2)*((s+1)*n + s) + 2)/2;
	},

	elasticIn: function(/* Decimal? */n){
		if(n==0){ return 0; }
		if(n==1){ return 1; }
		var p = .3;
		var s = p/4;
		n = n - 1;
		return -1 * Math.pow(2,10*n) * Math.sin((n-s)*(2*Math.PI)/p);
	},

	elasticOut: function(/* Decimal? */n){
		// summary: An easing function that elasticly snaps around the target value, near the end of the Animation
		if(n==0) return 0;
		if(n==1) return 1;
		var p = .3;
		var s = p/4;
		return Math.pow(2,-10*n) * Math.sin((n-s)*(2*Math.PI)/p) + 1;
	},

	elasticInOut: function(/* Decimal? */n){
		// summary: An easing function that elasticly snaps around the value, near the beginning and end of the Animation		
		if(n==0) return 0;
		n = n*2;
		if(n==2) return 1;
		var p = .3*1.5;
		var s = p/4;
		if(n<1){
			n-=1;
			return -.5*(Math.pow(2,10*n) * Math.sin((n-s)*(2*Math.PI)/p));
		}
		n-=1;
		return .5*(Math.pow(2,-10*n) * Math.sin((n-s)*(2*Math.PI)/p)) + 1;
	},

	bounceIn: function(/* Decimal? */n){
		// summary: An easing function that "bounces" near the beginning of an Animation
		return (1 - N2i.ease.bounceOut(1-n)); // Decimal
	},

	bounceOut: function(/* Decimal? */n){
		// summary: An easing function that "bounces" near the end of an Animation
		var s=7.5625;
		var p=2.75;
		var l; 
		if(n < (1 / p)){
			l = s*Math.pow(n, 2);
		}else if(n < (2 / p)){
			n -= (1.5 / p);
			l = s * Math.pow(n, 2) + .75;
		}else if(n < (2.5 / p)){
			n -= (2.25 / p);
			l = s * Math.pow(n, 2) + .9375;
		}else{
			n -= (2.625 / p);
			l = s * Math.pow(n, 2) + .984375;
		}
		return l;
	},

	bounceInOut: function(/* Decimal? */n){
		// summary: An easing function that "bounces" at the beginning and end of the Animation
		if(n<0.5){ return N2i.ease.bounceIn(n*2) / 2; }
		return (N2i.ease.bounceOut(n*2-1) / 2) + 0.5; // Decimal
	}
};if (!N2i) {var N2i = {};}

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
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */

Date.parseFunctions = {count:0};
Date.parseRegexes = [];
Date.formatFunctions = {count:0};

Date.prototype.dateFormat = function(format) {
    if (Date.formatFunctions[format] == null) {
        Date.createNewFormat(format);
    }
    var func = Date.formatFunctions[format];
    return this[func]();
}

Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            code += "'" + String.escape(ch) + "' + ";
        }
        else {
            code += Date.getFormatCode(ch);
        }
    }
    eval(code.substring(0, code.length - 3) + ";}");
}

Date.getFormatCode = function(character) {
    switch (character) {
    case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";
    case "D":
        return "Date.dayNames[this.getDay()].substring(0, 3) + ";
    case "j":
        return "this.getDate() + ";
    case "l":
        return "Date.dayNames[this.getDay()] + ";
    case "S":
        return "this.getSuffix() + ";
    case "w":
        return "this.getDay() + ";
    case "z":
        return "this.getDayOfYear() + ";
    case "W":
        return "this.getWeekOfYear() + ";
    case "F":
        return "Date.monthNames[this.getMonth()] + ";
    case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
    case "M":
        return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
    case "n":
        return "(this.getMonth() + 1) + ";
    case "t":
        return "this.getDaysInMonth() + ";
    case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";
    case "Y":
        return "this.getFullYear() + ";
    case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";
    case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";
    case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
    case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
    case "G":
        return "this.getHours() + ";
    case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";
    case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";
    case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";
    case "O":
        return "this.getGMTOffset() + ";
    case "T":
        return "this.getTimezone() + ";
    case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
    default:
        return "'" + String.escape(character) + "' + ";
    }
}

Date.parseDate = function(input, format) {
    if (Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
}

Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
        + "if (results && results.length > 0) {"
    var regex = "";

    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            regex += String.escape(ch);
        }
        else {
            obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{return new Date(y, m, d, h, i, s);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{return new Date(y, m, d, h, i);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{return new Date(y, m, d, h);}\n"
        + "else if (y > 0 && m >= 0 && d > 0)\n"
        + "{return new Date(y, m, d);}\n"
        + "else if (y > 0 && m >= 0)\n"
        + "{return new Date(y, m);}\n"
        + "else if (y > 0)\n"
        + "{return new Date(y);}\n"
        + "}return null;}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    eval(code);
}

Date.formatCodeToRegex = function(character, currentGroup) {
    switch (character) {
    case "D":
        return {g:0,
        c:null,
        s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
    case "j":
    case "d":
        return {g:1,
            c:"d = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "l":
        return {g:0,
            c:null,
            s:"(?:" + Date.dayNames.join("|") + ")"};
    case "S":
        return {g:0,
            c:null,
            s:"(?:st|nd|rd|th)"};
    case "w":
        return {g:0,
            c:null,
            s:"\\d"};
    case "z":
        return {g:0,
            c:null,
            s:"(?:\\d{1,3})"};
    case "W":
        return {g:0,
            c:null,
            s:"(?:\\d{2})"};
    case "F":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
            s:"(" + Date.monthNames.join("|") + ")"};
    case "M":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
            s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
    case "n":
    case "m":
        return {g:1,
            c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s:"(\\d{1,2})"};
    case "t":
        return {g:0,
            c:null,
            s:"\\d{1,2}"};
    case "L":
        return {g:0,
            c:null,
            s:"(?:1|0)"};
    case "Y":
        return {g:1,
            c:"y = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{4})"};
    case "y":
        return {g:1,
            c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s:"(\\d{1,2})"};
    case "a":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(am|pm)"};
    case "A":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(AM|PM)"};
    case "g":
    case "G":
    case "h":
    case "H":
        return {g:1,
            c:"h = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "i":
        return {g:1,
            c:"i = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "s":
        return {g:1,
            c:"s = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "O":
        return {g:0,
            c:null,
            s:"[+-]\\d{4}"};
    case "T":
        return {g:0,
            c:null,
            s:"[A-Z]{3}"};
    case "Z":
        return {g:0,
            c:null,
            s:"[+-]\\d{1,5}"};
    default:
        return {g:0,
            c:null,
            s:String.escape(character)};
    }
}

Date.prototype.getTimezone = function() {
    return this.toString().replace(
        /^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(
        /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
}

Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
        + String.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0")
        + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
}

Date.prototype.getDayOfYear = function() {
    var num = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var i = 0; i < this.getMonth(); ++i) {
        num += Date.daysInMonth[i];
    }
    return num + this.getDate() - 1;
}

Date.prototype.getWeekOfYear = function() {
    // Skip to Thursday of this week
    var now = this.getDayOfYear() + (5 - this.getDay());
    // Find the first Thursday of the year
    var jan1 = new Date(this.getFullYear(), 0, 1);
    var then = (5 - jan1.getDay());
    return String.leftPad(((now - then) / 7) + 1, 2, "0");
}

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
}

Date.prototype.getFirstDayOfMonth = function() {
    var day = (this.getDay() - (this.getDate() - 1)) % 7;
    return (day < 0) ? (day + 7) : day;
}

Date.prototype.getLastDayOfMonth = function() {
    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (day < 0) ? (day + 7) : day;
}

Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
}

Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th";
    }
}

String.escape = function(string) {
    return string.replace(/('|\\)/g, "\\$1");
}

String.leftPad = function (val, size, ch) {
    var result = new String(val);
    if (ch == null) {
        ch = " ";
    }
    while (result.length < size) {
        result = ch + result;
    }
    return result;
}

Date.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
Date.monthNames =
   ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];
Date.dayNames =
   ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];
Date.y2kYear = 50;
Date.monthNumbers = {
    Jan:0,
    Feb:1,
    Mar:2,
    Apr:3,
    May:4,
    Jun:5,
    Jul:6,
    Aug:7,
    Sep:8,
    Oct:9,
    Nov:10,
    Dec:11};
Date.patterns = {
    ISO8601LongPattern:"Y-m-d H:i:s",
    ISO8601ShortPattern:"Y-m-d",
    ShortDatePattern: "n/j/Y",
    LongDatePattern: "l, F d, Y",
    FullDateTimePattern: "l, F d, Y g:i:s A",
    MonthDayPattern: "F d",
    ShortTimePattern: "g:i A",
    LongTimePattern: "g:i:s A",
    SortableDateTimePattern: "Y-m-d\\TH:i:s",
    UniversalSortableDateTimePattern: "Y-m-d H:i:sO",
    YearMonthPattern: "F, Y"};
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
	this.objects = new Hash();
	this.addBehavior();
}

In2iGui.latestObjectIndex=0;

In2iGui.latestIndex=500;
In2iGui.latestPanelIndex=1000;
In2iGui.latestAlertIndex=1500;

In2iGui.browser = {};
In2iGui.browser.msie7 = navigator.userAgent.indexOf('MSIE 7')!=-1;
In2iGui.browser.webkit = navigator.userAgent.indexOf('WebKit')!=-1;
In2iGui.browser.gecko = !In2iGui.browser.webkit && navigator.userAgent.indexOf('Gecko')!=-1;

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
		var height = N2i.Window.getInnerHeight();
		for (var i=0; i < this.overflows.length; i++) {
			this.overflows[i].element.style.height = height+this.overflows[i].diff+'px';
		};
	},
	registerOverflow : function(id,diff) {
		var overflow = $id(id);
		this.overflows.push({element:overflow,diff:diff});
	},
	alert : function(options) {
		if (!this.alertBox) {
			this.alertBox = In2iGui.Alert.create(null,options);
			var button = In2iGui.Button.create(null,{text : 'OK'});
			button.addDelegate({click:function(){
				In2iGui.get().alertBox.hide();
			}});
			this.alertBox.addButton(button);
		} else {
			this.alertBox.update(options);
		}
		this.alertBox.show();
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
	}
}

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

In2iGui.isWithin = function(e,element) {
	var offset = element.cumulativeOffset();
	var dims = element.getDimensions();
	return e.pointerX()>=offset.left && e.pointerX()<offset.left+dims.width && e.pointerY()>offset.top && e.pointerY()<offset.top+dims.height;
}

In2iGui.getIconUrl = function(icon,size) {
	return In2iGui.context+'/In2iGui/icons/'+icon+size+'.png';
}

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


/* ********************** Frag drop ******************* */

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
	proxy.innerHTML = info.title;
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
		$ani(In2iGui.dragProxy,'left',In2iGui.startDragPos.left+'px',300,{ease:N2i.Animation.fastSlow});
		$ani(In2iGui.dragProxy,'top',In2iGui.startDragPos.top+'px',300,{ease:N2i.Animation.fastSlow,hideOnComplete:true});
	}
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

In2iGui.extend = In2iGui.enableDelegating = function(obj) {
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


///////////////////////////////////// Common text field ////////////////////////

In2iGui.TextField = function(id,name,options) {
	this.options = {};
	N2i.override(this.options,options);
	this.element = $(id);
	this.element.setAttribute('autocomplete','off');
	this.value = this.element.value;
	this.name = name;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.TextField.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.observe('keyup',function() {
			self.keyDidStrike();
		});
	},
	keyDidStrike : function() {
		if (this.value!=this.element.value) {
			this.value = this.element.value;
			In2iGui.callDelegates(this,'valueChanged');
		}
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		this.value = value;
		this.element.value = value;
	}
}

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

/* EOF */
In2iGui.Window = function(element,name) {
	this.element = $(element);
	this.name = name;
	this.close = this.element.select('.close')[0];
	this.titlebar = this.element.select('.titlebar')[0];
	this.title = this.titlebar.select('.title')[0];
	this.content = this.element.select('.in2igui_window_body')[0];
	this.visible = false;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Window.create = function(name,options) {
	N2i.log(options);
	options = N2i.override({title:'Window'},options);
	N2i.log(options);
	var element = new Element('div',{'class':'in2igui_window'+(options.variant ? ' in2igui_window_'+options.variant : '')});
	element.update('<div class="close"></div>'+
		'<div class="titlebar"><div class="titlebar"><div class="titlebar"><span>'+options.title+'</span></div></div></div>'+
		'<div class="in2igui_window_content"><div class="in2igui_window_content"><div class="in2igui_window_body" style="'+
		(options.width ? 'width:'+options.width+'px;':'')+
		(options.padding ? 'padding:'+options.padding+'px;':'')+
		'">'+
		'</div></div></div>'+
		'<div class="in2igui_window_bottom"><div class="in2igui_window_bottom"><div class="in2igui_window_bottom"></div></div></div>'+
		'</div>');
	document.body.appendChild(element);
	return new In2iGui.Window(element,name);
}

In2iGui.Window.prototype = {
	addBehavior : function() {
		var self = this;
		this.close.observe('click',function() {self.hide();});
		this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
		this.titlebar.observe('touchstart',function(e) {self.startDrag(e);return false;});
	},
	setTitle : function(title) {
		this.title.update(title);
	},
	show : function() {
		if (this.visible) return;
		this.element.setStyle({
			zIndex : In2iGui.nextPanelIndex(), visibility : 'hidden', display : 'block'
		})
		var width = this.element.clientWidth;
		this.element.setStyle({
			width : width+'px' , visibility : 'visible'
		});
		if (!N2i.isIE()) {
			$ani(this.element,'opacity',1,0);
		}
		this.visible = true;
	},
	toggle : function() {
		(this.visible ? this.hide() : this.show() );
	},
	hide : function() {
		if (!this.visible) return;
		if (!N2i.isIE()) {
			$ani(this.element,'opacity',0,200,{hideOnComplete:true});
		} else {
			this.element.setStyle({display:'none'});
		}
		this.visible = false;
	},
	add : function(widgetOrNode) {
		if (widgetOrNode.getElement) {
			this.content.insert(widgetOrNode.getElement());
		} else {
			this.content.insert(widgetOrNode);
		}
	},

////////////////////////////// Dragging ////////////////////////////////

	startDrag : function(e) {
		this.element.style.zIndex=In2iGui.nextPanelIndex();
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
	},
	calc : function(top,left) {
		// TODO: No need to do this all the time
		this.a = this.latestPosition.left-left;
		this.b = this.latestPosition.top-top;
		this.dist = Math.sqrt(Math.pow((this.a),2),Math.pow((this.b),2));
		this.latestTime = new Date().getMilliseconds();
		this.latestPosition = {'top':top,'left':left};
	},
	drag : function(e) {
		var event = new N2i.Event(e);
		this.element.style.right = 'auto';
		var top = (event.mouseTop()-this.dragState.top);
		var left = (event.mouseLeft()-this.dragState.left);
		this.element.style.top = Math.max(top,0)+'px';
		this.element.style.left = Math.max(left,0)+'px';
		//this.calc(top,left);
		return false;
	},
	endDrag : function(e) {
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
}

/* EOF */In2iGui.Formula = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $(id);
	this.inputs = [];
	this.children = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Formula.create = function(name) {
	var e = new Element('form',
		{'class':'in2igui_formula'}
	);
	return new In2iGui.Formula(e,name);
}

In2iGui.Formula.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onsubmit=function() {
			In2iGui.callDelegates(self,'submit');
			return false
		};
	},
	getElement : function() {
		return this.element;
	},
	registerInput : function(obj) {
		this.inputs[this.inputs.length] = obj;
	},
	registerChild : function(obj) {
		this.children.push(obj);
	},
	getValues : function() {
		var data = {};
		for (var i=0; i < this.inputs.length; i++) {
			if (this.inputs[i].options.key) {
				data[this.inputs[i].options.key] = this.inputs[i].getValue();
			} else if (this.inputs[i].name) {
				data[this.inputs[i].name] = this.inputs[i].getValue();
			}
		};
		return data;
	},
	setValues : function(values) {
		for (var i=0; i < this.inputs.length; i++) {
			var key = this.inputs[i].options.key;
			if (key && values[key]) {
				this.inputs[i].setValue(values[key]);
			}
		}
	},
	reset : function() {
		for (var i=0; i < this.inputs.length; i++) {
			this.inputs[i].reset();
		}
	},
	addContent : function(node) {
		this.element.insert(node);
	},
	add : function(widget) {
		widget.parent = this;
		this.element.insert(widget.getElement());
	},
	createGroup : function(options) {
		var g = In2iGui.Formula.Group.create(null,options);
		this.add(g);
		return g;
	}
}

/********************** Group **********************/


In2iGui.Formula.Group = function(elementOrId,name,options) {
	this.name = name;
	this.element = $(elementOrId);
	this.body = this.element.select('tbody')[0];
	this.options = N2i.override({above:true},options);
	this.parent = null;
	In2iGui.extend(this);
}

In2iGui.Formula.Group.create = function(name,options) {
	options = N2i.override({above:true},options);
	var element = new Element('table',
		{'class':'in2igui_formula_group'}
	);
	if (options.above) {
		element.addClassName('in2igui_formula_group_above');
	}
	element.insert(new Element('tbody'));
	return new In2iGui.Formula.Group(element,name,options);
}

In2iGui.Formula.Group.prototype = {
	add : function(widget) {
		var tr = new Element('tr');
		this.body.insert(tr);
		var label = widget.getLabel();
		if (label) {
			var th = new Element('th');
			th.insert(new Element('label').insert(label));
			tr.insert(th);
		}
		var td = new Element('td');
		td.insert(widget.getElement());
		if (this.options.above) {
			tr = new Element('tr');
			this.body.insert(tr);
		}
		tr.insert(td);
		if (this.parent) {
			this.parent.registerInput(widget);
		}
	},
	createButtons : function(options) {
		var tr = new Element('tr');
		this.body.insert(tr);
		var td = new Element('td',{colspan:this.options.above?1:2});
		tr.insert(td);
		var b = In2iGui.Buttons.create(null,options);
		td.insert(b.getElement());
		return b;
	}
}

/********************** Text ***********************/

In2iGui.Formula.Text = function(element,name,options) {
	this.name = name;
	this.options = {label:null,key:null};
	N2i.override(this.options,options);
	this.element = $(element);
	this.input = this.element.select('.in2igui_formula_text')[0];
	In2iGui.extend(this);
}

In2iGui.Formula.Text.create = function(name,options) {
	options = N2i.override({lines:1},options);
	if (options.lines>1) {
		var input = N2i.create('textarea',
			{'class':'in2igui_formula_text','rows':options.lines}
		);
	} else {
		var input = N2i.create('input',
			{'class':'in2igui_formula_text'}
		);		
	}
	var element = N2i.create('div',{'class':'in2igui_field'});
	element.appendChild(input);
	return new In2iGui.Formula.Text(element,name,options);
}

In2iGui.Formula.Text.prototype = {
	updateFromNode : function(node) {
		if (node.firstChild) {
			this.setValue(node.firstChild.nodeValue);
		} else {
			this.setValue(null);
		}
	},
	updateFromObject : function(data) {
		this.setValue(data.value);
	},
	focus : function() {
		try {
			this.element.focus();
		} catch (ignore) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		this.input.value = value;
	},
	getValue : function() {
		return this.input.value;
	},
	getLabel : function() {
		return this.options.label;
	},
	isEmpty : function() {
		return N2i.isEmpty(this.input.value);
	}
}

/********************** Dat time ***********************/

In2iGui.Formula.DateTime = function(elementOrId,name,options) {
	this.inputFormats = ['d-m-Y','d/m-Y','d/m/Y','d-m-Y H:i:s','d/m-Y H:i:s','d/m/Y H:i:s','d-m-Y H:i','d/m-Y H:i','d/m/Y H:i','d-m-Y H','d/m-Y H','d/m/Y H','d-m','d/m','d','Y','m-d-Y','m-d','m/d'];
	this.outputFormat = 'd-m-Y H:i:s';
	//this.id = id;
	this.name = name;
	this.options = options;
	this.value = null;
	this.element = $id(elementOrId);
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Formula.DateTime.create = function(name,opts) {
	var options = {};
	N2i.override(options,opts);
	var element = N2i.create('input',
		{'class':'in2igui_formula_text'}
	);
	return new In2iGui.Formula.DateTime(element,name,options);
}

In2iGui.Formula.DateTime.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onblur = function() {
			self.check();
		}
	},
	updateFromNode : function(node) {
		if (node.firstChild) {
			this.setValue(node.firstChild.nodeValue);
		} else {
			this.setValue(null);
		}
	},
	updateFromObject : function(data) {
		this.setValue(data.value);
	},
	focus : function() {
		try {this.element.focus();} catch (ignore) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		if (!value) {
			this.value = null;
		} else {
			this.value = new Date();
			this.value.setTime(parseInt(value)*1000);
		}
		this.updateUI();
	},
	check : function() {
		var str = this.element.value;
		var parsed = null;
		for (var i=0; i < this.inputFormats.length && parsed==null; i++) {
			parsed = Date.parseDate(str,this.inputFormats[i]);
		};
		this.value = parsed;
		this.updateUI();
	},
	getValue : function() {
		return (this.value!=null ? Math.round(this.value.getTime()/1000) : null);
	},
	getElement : function() {
		return this.element;
	},
	getLabel : function() {
		if (!this.label) {
			this.label = N2i.create('label');
			this.label.innerHTML = this.options.label;
		}
		return this.label;
	},
	updateUI : function() {
		if (this.value) {
			this.element.value = this.value.dateFormat(this.outputFormat);
		} else {
			this.element.value = ''
		}
	}
}

/************************************* Select *******************************/

In2iGui.Formula.Select = function(elementOrId,name,options) {
	this.name = name;
	this.options = options;
	this.element = $id(elementOrId);
	this.value = null;
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.Formula.Select.prototype = {
	refresh : function() {
		if (this.options.source) {
			var self = this;
			$get(this.options.source,{onSuccess:function(t) {self.update(t.responseXML)}});
		}
	},
	update : function(doc) {
		for (var i = this.element.options.length - 1; i >= 0; i--){
			this.element.remove(i);
		};
		var items = doc.getElementsByTagName('item');
		for (var i=0; i < items.length; i++) {
			var title = items[i].getAttribute('title');
			var value = items[i].getAttribute('value');
			this.element.options[this.element.options.length] = new Option(title,value);
		};
		this.setValue(this.value);
	},
	reset : function() {
		this.element.selectedIndex = 0;
		this.value = null;
	},
	setValue : function(value) {
		value=value+'';
		for (var i=0; i < this.element.options.length; i++) {
			if (this.element.options[i].value==value) {
				this.element.selectedIndex = i;
				this.value = value;
				return;
			}
		};
		if (this.element.options.length==0) {
			this.value = null;
		} else {
			this.element.selectedIndex = 0;
			this.value = this.element.options[0].value;
		}
	},
	getValue : function(value) {
		return this.element.value;
	}
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

In2iGui.Formula.Checkboxes.prototype = {
	getValues : function() {
		return this.values;
	},
	checkValues : function() {
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
	},
	setValues : function(values) {
		this.values=values;
		this.checkValues();
		this.updateUI();
	},
	flipValue : function(value) {
		N2i.flipInArray(this.values,value);
		this.checkValues();
		this.updateUI();
	},
	updateUI : function() {
		for (var i=0; i < this.sources.length; i++) {
			this.sources[i].updateUI();
		};
	},
	refresh : function() {
		for (var i=0; i < this.sources.length; i++) {
			this.sources[i].refresh();
		};
	},
	reset : function() {
		this.setValues([]);
	},
	registerSource : function(source) {
		source.parent = this;
		this.sources.push(source);
	},
	itemWasClicked : function(item) {
		this.changeValue(item.in2iGuiValue);
	}
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

In2iGui.Formula.Checkboxes.Source.prototype = {
	refresh : function() {
		var self = this;
		$get(this.options.url,{onSuccess:function(t) {self.update(t.responseXML)}});
	},
	update : function(doc) {
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
			//this.element.innerHTML='&nbsp;';
		}
		this.parent.checkValues();
		this.updateUI();
	},
	itemWasClicked : function(node) {
		this.parent.flipValue(node.in2iGuiValue);
	},
	updateUI : function() {
		for (var i=0; i < this.checkboxes.length; i++) {
			var item = this.checkboxes[i];
			N2i.setClass(item.element,'checked',N2i.inArray(this.parent.values,item.value));
		};
	},
	hasValue : function(value) {
		for (var i=0; i < this.checkboxes.length; i++) {
			if (this.checkboxes[i].value==value) {
				return true;
			}
		};
		return false;
	}
}

/**************************** Token ************************/

In2iGui.Formula.Tokens = function(element,name,options) {
	this.options = {label:null,key:null};
	N2i.override(this.options,options);
	this.element = $(element);
	this.name = name;
	this.value = [''];
	In2iGui.extend(this);
	this.updateUI();
}

In2iGui.Formula.Tokens.create = function(name,opts) {
	var element = new Element('div').addClassName('in2igui_tokens');
	return new In2iGui.Formula.Tokens(element,name,opts);
}

In2iGui.Formula.Tokens.prototype = {
	setValue : function(objects) {
		this.value = objects;
		this.value.push('');
		this.updateUI();
	},
	reset : function() {
		this.value = [''];
		this.updateUI();
	},
	getValue : function() {
		var out = [];
		this.value.each(function(value) {
			value = value.strip();
			if (value.length>0) out.push(value);
		})
		return out;
	},
	getLabel : function() {
		return this.options.label;
	},
	updateUI : function() {
		this.element.update();
		var self = this;
		this.value.each(function(value,i) {
			var input = new Element('input').addClassName('in2igui_tokens_token');
			input.value = value;
			input.in2iguiIndex = i;
			self.element.insert(input);
			input.observe('keyup',function() {self.inputChanged(input,i)});
		});
	},
	/** @private */
	inputChanged : function(input,index) {
		if (index==this.value.length-1 && input.value!=this.value[index]) {
			this.addField();
		}
		this.value[index] = input.value;
	},
	/** @private */
	addField : function() {
		var input = new Element('input').addClassName('in2igui_tokens_token');
		var i = this.value.length;
		this.value.push('');
		this.element.insert(input);
		var self = this;
		input.observe('keyup',function() {self.inputChanged(input,i)});
	}
}

/* EOF */In2iGui.List = function(element,name,options) {
	this.element = $(element);
	this.name = name;
	this.state = options.state;
	
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
	this.parameters = {};
	this.sortKey = null;
	this.sortDirection = null;
	
	this.window = {size:null,number:1,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.List.prototype = {
	hide : function() {
		this.element.hide();
	},
	show : function() {
		this.element.show();
	},
	registerColumn : function(column) {
		this.columns.push(column);
	},
	getSelection : function() {
		var items = [];
		for (var i=0; i < this.selected.length; i++) {
			items.push(this.rows[this.selected[i]]);
		};
		return items;
	},
	getFirstSelection : function() {
		var items = this.getSelection();
		if (items.length>0) return items[0];
		else return null;
	},
	setParameter : function(key,value) {
		this.parameters[key]=value;
	},
	loadData : function(url) {
		this.source = url;
		this.selected = [];
		this.sortKey = null;
		this.sortDirection = null;
		this.window.number = 0;
		this.refresh();
	},

/**
 * @private
 */
	refresh : function() {
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
		if (this.sortKey) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='sort='+this.sortKey;
		}
		if (this.sortDirection) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='direction='+this.sortDirection;
		}
		for (key in this.parameters) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+=key+'='+this.parameters[key];
		}
		$get(url,delegate);
	},
	sort : function(index) {
		var key = this.columns[index].key;
		if (key==this.sortKey) {
			this.sortDirection = this.sortDirection=='ascending' ? 'descending' : 'ascending';
		}
		this.sortKey = key;
		this.refresh();
	},

	/**
	 * @private
	 */
	parse : function(doc) {
		this.parseWindow(doc);
		this.buildNavigation();
		N2i.removeChildren(this.body);
		N2i.removeChildren(this.head);
		this.rows = [];
		this.columns = [];
		var headTr = N2i.create('tr');
		var sort = doc.getElementsByTagName('sort');
		this.sortKey=null;
		this.sortDirection=null;
		if (sort.length>0) {
			this.sortKey=sort[0].getAttribute('key');
			this.sortDirection=sort[0].getAttribute('direction');
		}
		var headers = doc.getElementsByTagName('header');
		for (var i=0; i < headers.length; i++) {
			var className = '';
			var th = N2i.create('th');
			var width = headers[i].getAttribute('width');
			var key = headers[i].getAttribute('key');
			var sortable = headers[i].getAttribute('sortable')=='true';
			if (width && width!='') {
				th.style.width=width+'%';
			}
			if (sortable) {
				var self = this;
				th.in2iguiIndex = i;
				th.onclick=function() {self.sort(this.in2iguiIndex)};
				className+='sortable';
			}
			if (key==this.sortKey) {
				className+=' sort_'+this.sortDirection;
			}
			th.className=className;
			var span = N2i.create('span');
			th.appendChild(span);
			span.appendChild(document.createTextNode(headers[i].getAttribute('title')));
			headTr.appendChild(th);
			this.columns.push({'key':key,'sortable':sortable,'width':width});
		};
		this.head.appendChild(headTr);
		var rows = doc.getElementsByTagName('row');
		for (var i=0; i < rows.length; i++) {
			var cells = rows[i].getElementsByTagName('cell');
			var row = document.createElement('tr');
			var info = {uid:rows[i].getAttribute('uid'),kind:rows[i].getAttribute('kind'),icon:rows[i].getAttribute('icon'),title:rows[i].getAttribute('title'),index:i};
			row.dragDropInfo = info;
			for (var j=0; j < cells.length; j++) {
				//var text = null;
				var cell = document.createElement('td');
				this.parseCell(cells[j],cell);
				//cell.appendChild(document.createTextNode(' '));
				row.appendChild(cell);
			};
			this.addRowBehavior(row,i);
			this.body.appendChild(row);
			this.rows.push(info);
		};
	}
};

In2iGui.List.prototype.filter = function(str) {
	var len = 20;
	var regex = new RegExp("[\\w]{"+len+",}","g");
	var match = regex.exec(str);
	if (match) {
		for (var i=0; i < match.length; i++) {
			var rep = '';
			for (var j=0; j < match[i].length; j++) {
				rep+=match[i][j];
				if ((j+1)%len==0) rep+='\u200B';
			};
			str = str.replace(match[i],rep);
		};
	}
	return str;
}

In2iGui.List.prototype.parseCell = function(node,cell) {
	if (node.getAttribute('icon')!=null) {
		var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.getIconUrl(node.getAttribute('icon'),1)+'")'});
		cell.appendChild(icon);
	}
	for (var i=0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if (child.nodeType==N2i.TEXT_NODE && child.nodeValue.length>0) {
			cell.appendChild(document.createTextNode(this.filter(child.nodeValue)));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='break') {
			cell.appendChild(N2i.create('br'));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='object') {
			var obj = N2i.create('div',{'class':'object'});
			if (child.getAttribute('icon')!=null) {
				var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.getIconUrl(child.getAttribute('icon'),1)+'")'});
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
	var pages = this.window.size>0 ? Math.ceil(this.window.total/this.window.size) : 0;
	if (pages<2) {
		this.navigation.style.display='none';
		return;
	}
	this.navigation.style.display='block';
	var from = ((this.window.number-1)*this.window.size+1);
	this.count.innerHTML = '<span><span>'+from+'-'+Math.min((this.window.number)*this.window.size,this.window.total)+'/'+this.window.total+'</span></span>';
	this.windowNumberBody.innerHTML = '';
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
		var row = new Element('tr');
		var obj = objects[i];
		for (var j=0; j < this.columns.length; j++) {
			var cell = new Element('td');
			if (this.builder) {
				cell.update(this.builder.buildColumn(this.columns[j],obj));
			} else {
				var value = obj[this.columns[j].key] || '';
				if (value.constructor == Array) {
					for (var k=0; k < value.length; k++) {
						if (value[k].constructor == Object) {
							cell.insert(this.createObject(value[k]));
						} else {
							cell.insert(new Element('div').update(value));
						}
					};
				} else if (value.constructor == Object) {
					cell.insert(this.createObject(value[j]));
				} else {
					cell.insert(value);
				}
			}
			row.insert(cell);
		};
		this.body.appendChild(row);
		this.addRowBehavior(row,i);
		this.rows.push(obj);
	};
}

In2iGui.List.prototype.createObject = function(object) {
	var node = new Element('div',{'class':'object'});
	if (object.icon) {
		node.insert(new Element('div',{'class':'icon'}).setStyle({'backgroundImage':'url("'+In2iGui.getIconUrl(object.icon,1)+'")'}));
	}
	return node.insert(object.text || object.name || '');
}

/************************************* Behavior ***************************************/


/**
 * @private
 */
In2iGui.List.prototype.addRowBehavior = function(row,index) {
	var self = this;
	row.onmousedown = function(e) {
		self.rowDown(index);
		In2iGui.startDrag(e,row);
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

/* EOF */In2iGui.Icons = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.source = options.source;
	In2iGui.enableDelegating(this);
}

/* EOF */In2iGui.Tabs = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $(id);
	this.bar = this.element.select('.in2igui_tabs_bar')[0];
	this.activeTab = 0;
	this.tabs = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.prototype.registerTab = function(obj) {
	obj.parent = this;
	this.tabs[this.tabs.length] = obj;
}

In2iGui.Tabs.prototype.addBehavior = function() {
	var self = this;
	var tabs = this.bar.select('li');
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
		this.tabs[i].setActive(i==this.activeTab);
	};
}

//////////////////////////////////// Tab ////////////////////////////////

In2iGui.Tabs.Tab = function(id,name) {
	this.id = id;
	this.name = name;
	this.parent = null;
	this.element = $(id+'_content');
	this.tab = $(id+'_tab');
	In2iGui.enableDelegating(this);
}

In2iGui.Tabs.Tab.prototype = {
	setActive : function(active) {
		this.element.style.display = (active ? 'block' : 'none');
		N2i.setClass(this.tab,'in2igui_tabs_selected',active);
	}
}

/* EOF */In2iGui.ViewStack = function(id,name,options) {
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

/* EOF */In2iGui.Tabbox = function(id,name) {
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

/* EOF */
In2iGui.ObjectList = function(id,name,options) {
	this.options = {key:null};
	N2i.override(this.options,options);
	this.name = name;
	this.element = $id(id);
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.template = [];
	this.objects = [];
	In2iGui.extend(this);
}

In2iGui.ObjectList.prototype = {
	ignite : function() {
		this.addObject({id:0});
	},
	addObject : function(data,addToEnd) {
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
	},
	reset : function() {
		for (var i=0; i < this.objects.length; i++) {
			var element = this.objects[i].getElement();
			element.parentNode.removeChild(element);
		};
		this.objects = [];
		this.addObject({id:0});
	},
	addObjects : function(data) {
		for (var i=0; i < data.length; i++) {
			this.addObject(data[i]);
		};
	},
	setObjects : function(data) {
		this.reset();
		this.addObjects(data);
	},
	getObjects : function(data) {
		var list = [];
		for (var i=0; i < this.objects.length-1; i++) {
			list.push(this.objects[i].getData());
		};
		return list;
	},
	getValue : function() {
		return this.getObjects();
	},
	setValue : function(data) {
		this.setObjects(data);
	},
	registerTemplateItem : function(item) {
		this.template.push(item);
	},
	objectDidChange : function(obj) {
		if (obj.index>=this.objects.length-1) {
			this.addObject({},true);
		}
	}
}

/********************** Object ********************/

In2iGui.ObjectList.Object = function(index,data,list) {
	this.data = data;
	this.index = index;
	this.list = list;
	this.fields = [];
}

In2iGui.ObjectList.Object.prototype = {
	getElement : function() {
		if (!this.element) {
			var self = this;
			this.element = document.createElement('tr');
			for (var i=0; i < this.list.template.length; i++) {
				var template = this.list.template[i];
				var field = template.clone();
				field.object = this;
				this.fields.push(field);
				var cell = document.createElement('td');
				if (i==0) cell.className='first';
				cell.appendChild(field.getElement());
				field.setValue(this.data[template.key]);
				this.element.appendChild(cell);
			};
		}
		return this.element;
	},
	valueDidChange : function() {
		this.list.objectDidChange(this);
	},
	getData : function() {
		var data = this.data;
		for (var i=0; i < this.fields.length; i++) {
			data[this.fields[i].key] = this.fields[i].getValue();
		};
		return data;
	}
}

/*************************** Text **************************/

In2iGui.ObjectList.Text = function(key) {
	this.key = key;
	this.value = null;
}

In2iGui.ObjectList.Text.prototype = {
	clone : function() {
		return new In2iGui.ObjectList.Text(this.key);
	},
	getElement : function() {
		var input = N2i.create('input',{'class':'in2igui_formula_text'});
		var field = N2i.create('div',{'class':'in2igui_field'});
		field.appendChild(input);
		this.wrapper = new N2i.TextField(input);
		this.wrapper.setDelegate(this);
		return field;
	},
	valueDidChange : function(field) {
		this.value = field.getValue();
		this.object.valueDidChange();
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		this.value = value;
		this.wrapper.setValue(value);
	}
}

/*************************** Select **************************/

In2iGui.ObjectList.Select = function(key) {
	this.key = key;
	this.value = null;
	this.options = [];
}

In2iGui.ObjectList.Select.prototype = {
	clone : function() {
		var copy = new In2iGui.ObjectList.Select(this.key);
		copy.options = this.options;
		return copy;
	},
	getElement : function() {
		this.select = N2i.create('select');
		for (var i=0; i < this.options.length; i++) {
			this.select.options[this.select.options.length] = new Option(this.options[i].label,this.options[i].value);
		};
		var self = this;
		this.select.onchange = function() {
			self.object.valueDidChange();
		}
		return this.select;
	},
	getValue : function() {
		return this.select.value;
	},
	setValue : function(value) {
		this.select.value = value;
	},
	addOption : function(value,label) {
		this.options.push({value:value,label:label});
	}
}

/* EOF *//**
 * An alert that can be
 * @constructor
 */
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

/**
 * Creates a new instance of an alert
 * @static
 */
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

/* EOF */In2iGui.Button = function(id,name) {
	this.name = name;
	this.element = $(id);
	this.inner = this.element.getElementsByTagName('span')[1];
	this.enabled = true;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Button.create = function(name,opts) {
	var options = {text:'',highlighted:false};
	N2i.override(options,opts);
	var className = 'in2igui_button'+(options.highlighted ? ' in2igui_button_highlighted' : '');
	var element = new Element('a',{'class':className});
	var element2 = new Element('span');
	element.appendChild(element2);
	var element3 = new Element('span');
	element2.appendChild(element3);
	if (options.icon) {
		var icon = new Element('em',{'class':'in2igui_button_icon'}).setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(options.icon,1)+')'});
		if (!options.text || options.text.length==0) {
			icon.addClassName('in2igui_button_icon_notext');
		}
		element3.insert(icon);
	}
	if (options.text && options.text.length>0) {
		element3.insert(options.text);
	}
	return new In2iGui.Button(element,name);
}

In2iGui.Button.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.clicked();
		}
	},
	clicked : function() {
		if (this.enabled) {
			In2iGui.callDelegates(this,'buttonWasClicked'); // deprecated
			In2iGui.callDelegates(this,'click');
		}
	},
	setEnabled : function(enabled) {
		this.enabled = enabled;
		this.updateUI();
	},
	setHighlighted : function(highlighted) {
		N2i.setClass(this.element,'in2igui_button_highlighted',highlighted);
	},
	updateUI : function() {
		N2i.setClass(this.element,'in2igui_button_disabled',!this.enabled);
	},
	setText : function(text) {
		this.inner.innerHTML = text;
	}
}

In2iGui.Buttons = function(id,name) {
	this.name = name;
	this.element = $(id);
	In2iGui.extend(this);
}

In2iGui.Buttons.create = function(name,options) {
	options = N2i.override({top:0},options);
	var e = new Element('div',{'class':'in2igui_buttons'});
	if (options.top>0) e.setStyle({paddingTop:options.top+'px'});
	return new In2iGui.Buttons(e,name);
}

In2iGui.Buttons.prototype = {
	add : function(widget) {
		this.element.insert(widget.getElement());
	}
}

/* EOF */In2iGui.Selection = function(id,name,source) {
	this.element = $(id);
	this.name = name;
	this.items = [];
	this.sources = [];
	this.value = null;
	this.selected = [];
	In2iGui.extend(this);
	var self = this;
}

In2iGui.Selection.create = function(name,options) {
	options = N2i.override({width:0},options);
	var e = new Element('div',{'class':'in2igui_selection'});
	if (options.width>0) e.setStyle({width:options.width+'px'});
	return new In2iGui.Selection(e,name,options);
}

In2iGui.Selection.prototype = {
	getValue : function() {
		return this.value;
	},
	getSelection : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i].value == this.value) {
				return this.items[i];
			}
		};
		for (var i=0; i < this.sources.length; i++) {
			var item = this.sources[i].getSelection();
			if (item) return item;
		};
	},
	changeValue : function(value) {
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
		In2iGui.callDelegates(this,'selectionChanged',this.value);
	},
	registerSource : function(source) {
		source.selection = this;
		this.sources.push(source);
	},
	registerItem : function(id,title,icon,badge,value,kind) {
		var element = $id(id);
		element.in2iGuiValue = value;
		this.items.push({id:id,title:title,icon:icon,badge:badge,element:element,value:value,kind:kind});
		var self = this;
		element.onclick = function() {
			self.itemWasClicked(this);
		}
		element.ondblclick = function() {
			self.itemWasDoubleClicked();
			return false;
		}
		element.dropInfo = {kind:kind,controller:this};
		N2i.addClass(element,'droppable');
		N2i.addListener(element,'mouseover',In2iGui.dropOverListener);
		N2i.addListener(element,'mouseout',In2iGui.dropOutListener);
	},
	
	setItems : function(items) {
		var self = this;
		items.each(function(item) {
			self.items.push(item);
			var node = new Element('div',{'class':'item'});
			node.in2iGuiValue = item.value;
			item.element = node;
			self.element.insert(node);
			if (item.icon) {
				var img = new Element('div',{'class':'icon'}).setStyle({'backgroundImage' : 'url('+In2iGui.getIconUrl(item.icon,1)+')'});
				node.insert(img);
			}
			node.insert(item.title);
			node.observe('click',function() {
				self.itemWasClicked(node);
			});
			node.observe('dblclick',function() {
				self.itemWasDoubleClicked(node);
				return false;
			});
		});
	},
	
	// Events
	itemWasClicked : function(item) {
		this.changeValue(item.in2iGuiValue);
	},
	itemWasDoubleClicked : function() {
		In2iGui.callDelegates(this,'selectorObjectWasOpened');
	}
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
		node.ondblclick = function() {
			self.itemWasDoubleClicked(this);
			return false;
		}
		var info = {title:title,icon:icon,badge:badge,kind:kind,element:node,value:value};
		node.dragDropInfo = info;
		this.items.push(info);
	};
	this.updateUI();
}

In2iGui.Selection.Source.prototype.itemWasClicked = function(node) {
	this.selection.changeValue(node.in2iGuiValue);
}

In2iGui.Selection.Source.prototype.itemWasDoubleClicked = function(node) {
	this.selection.itemWasDoubleClicked();
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

/* EOF */
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
	this.element = $(id);
	this.name = name;
	this.enabled = !this.element.hasClassName('in2igui_toolbar_icon_disabled');
	this.icon = this.element.select('.in2igui_icon')[0];
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Toolbar.Icon.create = function(name,options) {
	var element = new Element('div',{'class':'in2igui_toolbar_icon'});
	var icon = new Element('div',{'class':'in2igui_icon'}).setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(options.icon,2)+')'});
	var inner = new Element('div',{'class':'in2igui_toolbar_inner_icon'});
	var innerest = new Element('div',{'class':'in2igui_toolbar_inner_icon'});
	element.insert(inner);
	inner.insert(innerest);
	var title = N2i.create('span');
	title.innerHTML=options.title;
	if (options.overlay) {
		var overlay = N2i.create('div',{'class':'in2igui_icon_overlay'},{'backgroundImage':'url('+In2iGui.getIconUrl('overlay/'+options.overlay,2)+')'});
		icon.insert(overlay);
	}
	innerest.insert(icon);
	innerest.insert(title);
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


/***************** Badge ***************/

In2iGui.Toolbar.Badge = function(element,name) {
	this.element = $(element);
	this.name = name;
	this.label = this.element.select('strong')[0];
	this.text = this.element.select('span')[0];
	In2iGui.enableDelegating(this);
}

In2iGui.Toolbar.Badge.prototype = {
	setLabel : function(str) {
		this.label.update(str);
	},
	setText : function(str) {
		this.text.update(str);
	}
}

/* EOF */In2iGui.ImagePicker = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.options = options || {};
	this.element = $id(id);
	this.images = [];
	this.object = null;
	this.thumbnailsLoaded = false;
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.ImagePicker.prototype = {
	addBehavior : function() {
		var self = this;
		this.element.onclick = function() {
			self.showPicker();
		}
	},
	setObject : function(obj) {
		this.object = obj;
		this.updateUI();
	},
	getObject : function() {
		return this.object;
	},
	reset : function() {
		this.object = null;
		this.updateUI();
	},
	updateUI : function() {
		if (this.object==null) {
			this.element.style.backgroundImage='';
		} else {
			var url = In2iGui.callDelegates(this,'getImageUrl');
			this.element.style.backgroundImage='url('+url+')';
		}
	},
	showPicker : function() {
		if (!this.picker) {
			var self = this;
			this.picker = In2iGui.BoundPanel.create();
			this.content = N2i.create('div',{'class':'in2igui_imagepicker_thumbs'});
			var buttons = N2i.create('div',{'class':'in2igui_imagepicker_buttons'});
			var close = In2iGui.Button.create(null,{text:'Luk',highlighted:true});
			close.addDelegate({
				click:function() {self.hidePicker()}
			});
			var remove = In2iGui.Button.create(null,{text:'Fjern'});
			remove.addDelegate({
				click:function() {self.setObject(null);self.hidePicker()}
			});
			buttons.appendChild(close.getElement());
			buttons.appendChild(remove.getElement());
			this.picker.add(this.content);
			this.picker.add(buttons);
		}
		this.picker.position(this.element);
		this.picker.show();
		if (!this.thumbnailsLoaded) {
			this.updateImages();
			this.thumbnailsLoaded = true;
		}
	},
	hidePicker : function() {
		this.picker.hide();
	},
	updateImages : function() {
		var self = this;
		var delegate = {
			onXML:function(doc) {
				self.parse(doc);
			}
		};
		$get(this.options.source,delegate);
	},
	parse : function(doc) {
		N2i.removeChildren(this.content);
		var images = doc.getElementsByTagName('image');
		var self = this;
		for (var i=0; i < images.length && i<50; i++) {
			var id = images[i].getAttribute('id');
			var url = '../../../util/images/?id='+id+'&maxwidth=48&maxheight=48&format=jpg';
			var thumb = N2i.create('div',{'class':'in2igui_imagepicker_thumbnail'},{'backgroundImage':'url('+url+')'});
			thumb.in2iguiObject = {'id':id};
			thumb.onclick = function() {
				self.setObject(this.in2iguiObject);
				self.hidePicker();
			}
			this.content.appendChild(thumb);
		};
	}
}

/* EOF */In2iGui.BoundPanel = function(element,name) {
	this.element = $(element);
	this.visible = false;
	this.content=this.element.select('.content')[0];
	this.arrow=this.element.select('.arrow')[0];
	In2iGui.extend(this);
}

In2iGui.BoundPanel.create = function(opts) {
	var options = {name:null,top:'0px',left:'0px'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_boundpanel'},
		{'display':'none','zIndex':In2iGui.nextPanelIndex(),'top':options.top,'left':options.left}
	);
	
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
			if (!N2i.isIE()) {
				N2i.setOpacity(this.element,0);
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
			if (!N2i.isIE()) {
				$ani(this.element,'opacity',1,400,{ease:N2i.Animation.fastSlow});
			}
			$ani(this.element,'margin-left','0px',800,{ease:N2i.Animation.bounce});
		}
		this.element.style.zIndex = In2iGui.nextPanelIndex();
		this.visible=true;
	},
	hide : function() {
		if (N2i.isIE()) {
			this.element.style.display='none';
		} else {
			$ani(this.element,'opacity',0,300,{ease:N2i.Animation.slowFast,hideOnComplete:true});
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
			var width = N2i.getWidth(this.element);
			var height = N2i.getHeight(this.element);
			this.element.style.display='none';
			this.element.style.visibility='';
		} else {
			var width = N2i.getWidth(this.element);
			var height = N2i.getHeight(this.element);
		}
		return {width:width,height:height};
	},
	position : function(node) {
		node = $(node);
		var offset = node.cumulativeOffset();
		var scrollOffset = node.cumulativeScrollOffset();
		var dims = this.getDimensions();
		var winWidth = N2i.Window.getInnerWidth();
		var nodeLeft = offset.left-scrollOffset.left+N2i.Window.getScrollLeft();
		var nodeWidth = N2i.getWidth(node);
		var nodeHeight = N2i.getHeight(node);
		var nodeTop = offset.top-scrollOffset.top+N2i.Window.getScrollTop();
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
			$ani(this.element,'top',top+'px',500,{ease:N2i.Animation.fastSlow});
			$ani(this.element,'left',left+'px',500,{ease:N2i.Animation.fastSlow});
		} else {
			this.element.style.top=top+'px';
			this.element.style.left=left+'px';
		}
	}
}

/* EOF */In2iGui.Panel = function(element,name) {
	this.element = $(element);
	this.titlebar = $class('titlebar',this.element)[0];
	this.content=$class('content',this.element)[0];
	this.close = $class('close',this.element)[0];
	In2iGui.enableDelegating(this);
	this.addBehavior();
}

In2iGui.Panel.create = function(opts) {
	var options = {name:null,title:'Panel'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_panel'},
		{'display':'none','top':'100px','left':'100px'}
	);
	
	var html = '<div class="titlebar"><div><div>'+
			'<div class="close"></div><strong>'+options.title+'</strong>'+
		'</div></div></div>'+
		'<div class="body"><div class="body"><div class="body"><div class="content"'+
		(options.padding ? ' style="padding: '+options.padding+'px; padding-bottom: 0px;"' : '')+
		'></div></div></div></div>'+
		'<div class="bottom"><div><div></div></div></div>';
	element.innerHTML=html;
	document.body.appendChild(element);
	return new In2iGui.Panel(element);
}

In2iGui.Panel.prototype = {
	addBehavior : function() {
		var self = this;
		this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
		var close = $class('close',this.titlebar)[0];
		close.onclick = function() {self.hide()};
	},
	show : function() {
		this.element.setStyle({
			zIndex : In2iGui.nextPanelIndex(), visibility : 'hidden', display : 'block'
		})
		var width = this.element.clientWidth;
		this.element.setStyle({
			width : width+'px' , visibility : 'visible'
		});
	},
	hide : function() {
		this.element.style.display='none';
	},
	add : function(widget) {
		this.content.appendChild(widget.getElement());
	},
	addContent : function(node) {
		this.content.appendChild(node);
	},
	startDrag : function(e) {
		this.element.style.zIndex=In2iGui.nextPanelIndex();
		var event = new N2i.Event(e);
		this.dragState = {left:event.mouseLeft()-N2i.Element.getLeft(this.element),top:event.mouseTop()-N2i.Element.getTop(this.element)};
		var self = this;
		this.moveListener = function(e) {self.drag(e)};
		this.upListener = function(e) {self.endDrag(e)};
		N2i.Event.addListener(document,'mousemove',this.moveListener);
		N2i.Event.addListener(document,'mouseup',this.upListener);
		N2i.Event.stop(e);
		document.body.onselectstart = function () { return false; };
		return false;
	},

	drag : function(e) {
		var event = new N2i.Event(e);
		this.element.style.right = 'auto';
		this.element.style.top = (event.mouseTop()-this.dragState.top)+'px';
		this.element.style.left = (event.mouseLeft()-this.dragState.left)+'px';
		return false;
	},

	endDrag : function() {
		N2i.Event.removeListener(document,'mousemove',this.moveListener);
		N2i.Event.removeListener(document,'mouseup',this.upListener);
		document.body.onselectstart = null;
	}
}

/* EOF */
In2iGui.RichText = function(id,name,options) {
	this.element = $id(id);
	this.options = N2i.override({debug:false,value:'',autoHideToolbar:true,style:'font-family: sans-serif;'},options);
	this.iframe = this.element.getElementsByTagName('iframe')[0];
	this.toolbar = $firstClass('in2igui_richtext_toolbar',this.element);
	this.toolbarContent = $firstClass('in2igui_richtext_toolbar_content',this.element);
	this.value = this.options.value;
	this.document = null;
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
		this.document.write('<html><head><style>body{margin:0px;'+this.options.style+'}</style></head><body>'+this.value+'</body></html>');
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
	getValue : function() {
		return this.value;
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
				img.src=In2iGui.context+'/In2iGui/gfx/trans.png';
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
			var panel = In2iGui.Window.create(null,{variant:'dark'});
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

/* EOF */In2iGui.ImageViewer = function(element,name,options) {
	this.options = {maxWidth:800,maxHeight:600};
	N2i.override(this.options,options);
	this.element = $id(element);
	this.viewer = $firstClass('in2igui_imageviewer_viewer',this.element);
	this.innerViewer = $firstClass('in2igui_imageviewer_inner_viewer',this.element);
	this.status = $firstClass('in2igui_imageviewer_status',this.element);
	this.previousControl = $firstClass('in2igui_imageviewer_previous',this.element);
	this.controller = $firstClass('in2igui_imageviewer_controller',this.element);
	this.nextControl = $firstClass('in2igui_imageviewer_next',this.element);
	this.playControl = $firstClass('in2igui_imageviewer_play',this.element);
	this.dirty = false;
	this.width = 600;
	this.height = 460;
	this.index = 0;
	this.playing=false;
	this.name = name;
	this.images = [];
	this.addBehavior();
	In2iGui.enableDelegating(this);
}

In2iGui.ImageViewer.create = function(name,opts) {
	var options = {name:null,top:'0px',left:'0px'};
	N2i.override(options,opts);
	var element = N2i.create('div',
		{'class':'in2igui_imageviewer'},
		{'display':'none'}
	);
	element.innerHTML = '<div class="in2igui_imageviewer_viewer"><div class="in2igui_imageviewer_inner_viewer"></div></div>'+
	'<div class="in2igui_imageviewer_status"></div>'+
	'<div class="in2igui_imageviewer_controller">'+
	'<a class="in2igui_imageviewer_previous"></a>'+
	'<a class="in2igui_imageviewer_play"></a>'+
	'<a class="in2igui_imageviewer_next"></a>'+
	'</div>';
	document.body.appendChild(element);
	return new In2iGui.ImageViewer(element,name,options);
}

In2iGui.ImageViewer.prototype = {
	addBehavior : function() {
		var self = this;
		this.nextControl.onclick = function() {
			self.next(true);
		}
		this.previousControl.onclick = function() {
			self.previous(true);
		}
		this.playControl.onclick = function() {
			self.playOrPause();
		}
		this.viewer.onclick = function() {
			self.hide();
		}
		this.timer = function() {
			self.next(false);
		}
		this.keyListener = function(e) {
			var event = new N2i.Event(e);
			if (event.isRightKey()) {
				self.next(true);
			} else if (event.isLeftKey()) {
				self.previous(true);
			} else if (event.isEscapeKey()) {
				self.hide();
			} else if (event.isReturnKey()) {
				self.playOrPause();
			}
		}
	},
	getLargestSize : function(canvas,image) {
		if (image.width<=canvas.width && image.height<=canvas.height) {
			return {width:image.width,height:image.height};
		} else if (canvas.width/canvas.height>image.width/image.height) {
			return {width:canvas.height/image.height*image.width,height:canvas.height};
		} else if (canvas.width/canvas.height<image.width/image.height) {
			return {width:canvas.width,height:canvas.width/image.width*image.height};
		} else {
			return {width:canvas.width,height:canvas.height};
		}
	},	
	calculateSize : function() {
		var newWidth = N2i.Window.getInnerWidth()-100;
		newWidth = Math.floor(newWidth/100)*100;
		newWidth = Math.min(newWidth,this.options.maxWidth);
		var newHeight = N2i.Window.getInnerHeight()-100;
		newHeight = Math.floor(newHeight/100)*100;
		newHeight = Math.min(newHeight,this.options.maxHeight);
		var maxWidth = 0;
		var maxHeight = 0;
		for (var i=0; i < this.images.length; i++) {
			N2i.log('********************');
			N2i.log({width:newWidth,height:newHeight});
			N2i.log(this.images[i]);
			var dims = this.getLargestSize({width:newWidth,height:newHeight},this.images[i]);
			maxWidth = Math.max(maxWidth,dims.width);
			maxHeight = Math.max(maxHeight,dims.height);
			N2i.log(dims);
		};
		newHeight = Math.round(Math.min(newHeight,maxHeight));
		newWidth = Math.round(Math.min(newWidth,maxWidth));
		/*
		
			alert(min);
			alert(newWidth/newHeight);
		if (newHeight>max) {
			newWidth = newHeight*max;
		}
		if (newWidth/newHeight>min) {
			newHeight = newWidth/min;
		}
		*/
		if (newWidth!=this.width || newHeight!=this.height) {
			this.width = newWidth;
			this.height = newHeight;
			this.dirty = true;
		}
	},
	showById: function(id) {
		for (var i=0; i < this.images.length; i++) {
			if (this.images[i].id==id) {
				this.show(i);
				break;
			}
		};
	},
	show: function(index) {
		this.index = index || 0;
		this.calculateSize();
		this.updateUI();
		var curtainIndex = In2iGui.nextPanelIndex();
		this.element.style.zIndex=In2iGui.nextPanelIndex();
		this.element.style.width=(this.width+10)+'px';
		this.element.style.height=(this.height+50)+'px';
		this.element.style.marginLeft='-'+Math.round((this.width+10)/2)+'px';
		this.element.style.top=Math.round((N2i.Window.getInnerHeight()-(this.height+50))/2)+N2i.Window.getScrollTop()+'px';
		this.viewer.style.width=(this.width+10)+'px';
		this.viewer.style.height=this.height+'px';
		this.innerViewer.style.width=((this.width+10)*this.images.length)+'px';
		this.innerViewer.style.height=this.height+'px';
		this.controller.style.marginLeft=((this.width-115)/2+5)+'px';
		this.element.style.display='block';
		this.goToImage(false,0,false);
		In2iGui.showCurtain(this,curtainIndex);
		N2i.addListener(document,'keydown',this.keyListener);
	},
	hide: function(index) {
		this.pause();
		In2iGui.hideCurtain(this);
		this.element.style.display='none';
		N2i.removeListener(document,'keydown',this.keyListener);
	},
	curtainWasClicked : function() {
		this.hide();
	},
	updateUI : function() {
		if (this.dirty) {
			this.innerViewer.innerHTML='';
			for (var i=0; i < this.images.length; i++) {
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/,'&');
				var element = N2i.create('div',{'class':'in2igui_imageviewer_image'},{'width':(this.width+10)+'px','height':this.height+'px'});
				
				var url = this.resolveImageUrl(this.images[i]);
				url = url.replace(/&amp;/g,'&');
				//element.style.backgroundImage="url('"+url+"')";
				this.innerViewer.appendChild(element);
			};
			this.dirty = false;
			this.preload();
		}
	},
	goToImage : function(animate,num,user) {	
		if (animate) {
			if (num>1) {
				$ani(this.viewer,'scrollLeft',this.index*(this.width+10),Math.min(num*300,2000),{ease:N2i.Animation.slowFastSlow});				
			} else {
				var end = this.index==0 || this.index==this.images.length-1;
				var ease = (user ? (end ? N2i.Animation.bounce : N2i.Animation.elastic) : N2i.ease.backInOut);
				$ani(this.viewer,'scrollLeft',this.index*(this.width+10),(end ? 800 : 1200),{ease:ease});
			}
		} else {
			this.viewer.scrollLeft=this.index*(this.width+10);
		}
	},
	clearImages : function() {
		this.images = [];
		this.dirty = true;
	},
	addImages : function(images) {
		for (var i=0; i < images.length; i++) {
			this.addImage(images[i]);
		};
	},
	addImage : function(img) {
		this.images.push(img);
		this.dirty = true;
	},
	resolveImageUrl : function(img) {
		for (var i=0; i < this.delegates.length; i++) {
			if (this.delegates[i].resolveImageUrl) {
				return this.delegates[i].resolveImageUrl(img,this.width,this.height);
			}
		};
		return null;
	},
	play : function() {
		if (!this.interval) {
			this.interval = window.setInterval(this.timer,6000);
		}
		this.next(false);
		this.playing=true;
		this.playControl.className='in2igui_imageviewer_pause';
	},
	pause : function() {
		window.clearInterval(this.interval);
		this.interval = null;
		this.playControl.className='in2igui_imageviewer_play';
		this.playing = false;
	},
	playOrPause : function() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	},
	resetPlay : function() {
		if (this.playing) {
			window.clearInterval(this.interval);
			this.interval = window.setInterval(this.timer,6000);
		}
	},
	previous : function(user) {
		var num = 1;
		this.index--;
		if (this.index<0) {
			this.index=this.images.length-1;
			num = this.images.length-1;
		}
		this.goToImage(true,num,user);
		this.resetPlay();
	},
	next : function(user) {
		var num = 1;
		this.index++;
		if (this.index==this.images.length) {
			this.index=0;
			num = this.images.length-1;
		}
		this.goToImage(true,num,user);
		this.resetPlay();
	},
	preload : function() {
		var guiLoader = new N2i.Preloader();
		guiLoader.addImages(In2iGui.context+'In2iGui/gfx/imageviewer_controls.png');
		var self = this;
		guiLoader.setDelegate({allImagesDidLoad:function() {self.preloadImages()}});
		guiLoader.load();
	},
	preloadImages : function() {
		this.loader = new N2i.Preloader();
		this.loader.setDelegate(this);
		for (var i=0; i < this.images.length; i++) {
			this.loader.addImages(this.resolveImageUrl(this.images[i]));
		};
		this.status.innerHTML = '0%';
		this.status.style.display='';
		this.loader.load();
	},
	allImagesDidLoad : function() {
		this.status.style.display='none';
	},
	imageDidLoad : function(loaded,total,index) {
		this.status.innerHTML = Math.round(loaded/total*100)+'%';
		var url = this.resolveImageUrl(this.images[index]);
		url = url.replace(/&amp;/g,'&');
		this.innerViewer.childNodes[index].style.backgroundImage="url('"+url+"')";
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',false);
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',false);
	},
	imageDidGiveError : function(loaded,total,index) {
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_error',true);
	},
	imageDidAbort : function(loaded,total,index) {
		N2i.setClass(this.innerViewer.childNodes[index],'in2igui_imageviewer_image_abort',true);
	}
}

/* EOF */
In2iGui.Picker = function(element,name,options) {
	this.options = N2i.override({itemWidth:100,itemHeight:150},options);
	this.element = $id(element);
	this.name = name;
	this.container = $firstClass('in2igui_picker_container',this.element);
	this.title = $firstClass('in2igui_picker_title',this.element);
	this.objects = [];
	this.selected = null;
	In2iGui.extend(this);
}

In2iGui.Picker.create = function(name,options) {
	options = N2i.override({shadow:true},options);
	var element = new Element('div',{'class':'in2igui_picker'});
	element.update('<div class="in2igui_picker_top"><div><div></div></div></div>'+
	'<div class="in2igui_picker_middle"><div class="in2igui_picker_middle">'+
	(options.title ? '<div class="in2igui_picker_title">'+options.title+'</div>' : '')+
	'<div class="in2igui_picker_container"></div>'+
	'</div></div>'+
	'<div class="in2igui_picker_bottom"><div><div></div></div></div>');
	if (options.shadow==true) {
		element.addClassName('in2igui_picker_shadow')
	}
	return new In2iGui.Picker(element,name,options);
}

In2iGui.Picker.prototype = {
	setObjects : function(objects) {
		this.objects = objects;
		this.updateUI();
	},
	getSelection : function() {
		return this.selected==null ? null : this.objects[this.selected];
	},
	reset : function() {
		this.selected = null;
		this.updateSelection();
	},
	updateUI : function() {
		this.container.style.width=(this.objects.length*(this.options.itemWidth+14))+'px';
		this.container.style.height=(this.options.itemHeight+10)+'px';
		for (var i=0; i < this.objects.length; i++) {
			var item = new Element('div',{'class':'in2igui_picker_item'});
			item.update(
				'<div class="in2igui_picker_item_middle"><div class="in2igui_picker_item_middle">'+
				'<div style="width:'+this.options.itemWidth+'px;height:'+this.options.itemHeight+'px;background-image:url(\''+this.objects[i].image+'\')"></div>'+
				'</div></div>'+
				'<div class="in2igui_picker_item_bottom"><div><div></div></div></div>'
			);
			item.in2iguiIndex = i;
			var self = this;
			item.onclick = function() {self.selectionChanged(this.in2iguiIndex)};
			this.container.appendChild(item);
		};
	},
	updateSelection : function() {
		var children = this.container.childNodes;
		for (var i=0; i < children.length; i++) {
			N2i.setClass(children[i],'in2igui_picker_item_selected',i==this.selected);
		};
	},
	selectionChanged : function(index) {
		this.selected = index;
		this.updateSelection();
		In2iGui.callDelegates(this,'selectionChanged');
	}
}

/* EOF */
In2iGui.Editor = function(element,name,options) {
	this.name = 'In2iGuiEditor';
	this.parts = [];
	this.rows = [];
	this.partControllers = [];
	this.activePart = null;
	this.active = false;
	this.dragProxy = null;
}

In2iGui.Editor.get = function() {
	if (!In2iGui.Editor.instance) {
		In2iGui.Editor.instance = new In2iGui.Editor();
	}
	return In2iGui.Editor.instance;
}

In2iGui.Editor.prototype = {
	ignite : function(options) {
		this.reload();
	},
	addPartController : function(key,title,controller) {
		this.partControllers.push({key:key,'title':title,'controller':controller});
	},
	getPartController : function(key) {
		var ctrl = null;
		this.partControllers.each(function(item) {
			if (item.key==key) ctrl=item;
		});
		return ctrl;
	},
	reload : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
		var self = this;
		this.parts = [];
		var rows = $$('.row');
		rows.each(function(row,i) {
			var columns = row.select('.column');
			self.reloadColumns(columns,i);
			columns.each(function(column,j) {
				var parts = column.select('.part');
				self.reloadParts(parts,i,j);
			});
		});
		var parts = $$('.part');
		this.parts.each(function(part) {
			var i = parts.indexOf(part.element);
			if (i!=-1) delete(parts[i]);
		});
		this.reloadParts(parts,-1,-1);
	},
	partExists : function(element) {
		
	},
	reloadColumns : function(columns,rowIndex) {
		var self = this;
		columns.each(function(column,columnIndex) {
			column.observe('mouseover',function() {
				self.hoverColumn(column);
			});
			column.observe('mouseout',function() {
				self.blurColumn();
			});
			column.observe('contextmenu',function(e) {
				self.contextColumn(column,rowIndex,columnIndex,e);
			});
		});
	},
	reloadParts : function(parts,row,column) {
		var self = this;
		parts.each(function(element,partIndex) {
			if (!element) return;
			var match = element.className.match(/part_([\w]+)/i);
			if (match && match[1]) {
				var handler = self.getPartController(match[1]);
				if (handler) {
					var part = new handler.controller(element,row,column,partIndex);
					part.type=match[1];
					element.observe('click',function() {
						//self.editPart(part);
					});
					element.observe('mouseover',function(e) {
						self.hoverPart(part);
					});
					element.observe('mouseout',function(e) {
						self.blurPart(e);
					});
					element.observe('mousedown',function(e) {
						self.startPartDrag(e);
					});
					self.parts.push(part);
				}
			}
		});
	},
	activate : function() {
		this.active = true;
	},
	deactivate : function() {
		this.active = false;
		if (this.activePart) {
			this.activePart.deactivate();
		}
		if (this.partControls) this.partControls.hide();
	},
	
	
	///////////////////////// Columns ////////////////////////
	
	hoverColumn : function(column) {
		this.hoveredColumn = column;
		if (!this.active || this.activePart) return;
		column.addClassName('in2igui_editor_column_hover');
	},
	
	blurColumn : function() {
		if (!this.active || !this.hoveredColumn) return;
		this.hoveredColumn.removeClassName('in2igui_editor_column_hover');
	},
	
	contextColumn : function(column,rowIndex,columnIndex,e) {
		if (!this.columnMenu) {
			var menu = In2iGui.Menu.create('In2iGuiEditorColumnMenu');
			menu.addItem('Slet kolonne','removeColumn');
			menu.addItem('Tilføj kolonne','addColumn');
			this.partControllers.each(function(item) {
				menu.addItem(item.title,item.key);
			});
			this.columnMenu = menu;
			menu.addDelegate(this);
		}
		this.hoveredRow=rowIndex;
		this.hoveredColumnIndex=columnIndex;
		this.columnMenu.showAtPointer(e);
	},
	itemWasClicked$In2iGuiEditorColumnMenu : function(value) {
		if (value=='removeColumn') {
			In2iGui.callDelegates(this,'removeColumn',{'row':this.hoveredRow,'column':this.hoveredColumnIndex});
		} else if (value=='addColumn') {
			In2iGui.callDelegates(this,'addColumn',{'row':this.hoveredRow,'position':this.hoveredColumnIndex+1});
		} else {
			In2iGui.callDelegates(this,'addPart',{'row':this.hoveredRow,'column':this.hoveredColumnIndex,'position':0,type:value});
		}
	},
	
	
	///////////////////////// Parts //////////////////////////
	
	hoverPart : function(part,event) {
		if (!this.active || this.activePart) return;
		this.hoveredPart = part;
		part.element.addClassName('in2igui_editor_part_hover');
		var self = this;
		this.partControlTimer = window.setTimeout(function() {self.showPartControls()},200);
	},
	blurPart : function(e) {
		window.clearTimeout(this.partControlTimer);
		if (!this.active) return;
		if (this.partControls && !In2iGui.isWithin(e,this.partControls.element)) {
			this.hidePartControls();
			this.hoveredPart.element.removeClassName('in2igui_editor_part_hover');
		}
		if (!this.partControls) {
			this.hoveredPart.element.removeClassName('in2igui_editor_part_hover');			
		}
	},
	showPartEditControls : function() {
		if (!this.partEditControls) {
			this.partEditControls = In2iGui.Overlay.create('In2iGuiEditorPartEditActions');
			this.partEditControls.addIcon('save','common/save');
			this.partEditControls.addIcon('cancel','common/close');
			this.partEditControls.addDelegate(this);
		}
		this.partEditControls.showAtElement(this.activePart.element,{'horizontal':'right','vertical':'topOutside'});
	},
	showPartControls : function() {
		if (!this.partControls) {
			this.partControls = In2iGui.Overlay.create('In2iGuiEditorPartActions');
			this.partControls.addIcon('edit','common/edit');
			this.partControls.addIcon('new','common/new');
			this.partControls.addIcon('delete','common/delete');
			var self = this;
			this.partControls.getElement().observe('mouseout',function(e) {
				self.blurControls(e);
			});
			this.partControls.getElement().observe('mouseover',function(e) {
				self.hoverControls(e);
			});
			this.partControls.addDelegate(this);
		}
		if (this.hoveredPart.column==-1) {
			this.partControls.hideIcons(['new','delete']);
		} else {
			this.partControls.showIcons(['new','delete']);
		}
		this.partControls.showAtElement(this.hoveredPart.element,{'horizontal':'right'});
	},
	hoverControls : function(e) {
		this.hoveredPart.element.addClassName('in2igui_editor_part_hover');
	},
	blurControls : function(e) {
		this.hoveredPart.element.removeClassName('in2igui_editor_part_hover');
		if (!In2iGui.isWithin(e,this.hoveredPart.element)) {
			this.hidePartControls();
		}
	},
	iconWasClicked$In2iGuiEditorPartActions : function(key,event) {
		if (key=='delete') {
			this.deletePart(this.hoveredPart);
		} else if (key=='new') {
			this.newPart(event);
		} else if (key=='edit') {
			this.editPart(this.hoveredPart);
		}
	},
	iconWasClicked$In2iGuiEditorPartEditActions : function(key,event) {
		if (key=='cancel') {
			this.cancelPart(this.activePart);
		} else if (key=='save') {
			this.savePart(this.activePart);
		}
	},
	hidePartControls : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
	},
	hidePartEditControls : function() {
		if (this.partEditControls) {
			this.partEditControls.hide();
		}
	},
	editPart : function(part) {
		if (!this.active || this.activePart) return;
		if (this.activePart) this.activePart.deactivate();
		this.activePart = part;
		this.showPartEditControls();
		part.element.addClassName('in2igui_editor_part_active');
		part.activate();
		window.clearTimeout(this.partControlTimer);
		this.hidePartControls();
		this.blurColumn();
	},
	cancelPart : function(part) {
		part.cancel();
	},
	savePart : function(part) {
		part.save();
	},
	getEditorForElement : function(element) {
		for (var i=0; i < this.parts.length; i++) {
			if (this.parts[i].element==element) {
				return this.parts[i];
			}
		};
		return null;
	},
	partDidDeacivate : function(part) {
		part.element.removeClassName('in2igui_editor_part_active');
		this.activePart = null;
		this.hidePartEditControls();
	},
	partChanged : function(part) {
		In2iGui.callDelegates(part,'partChanged');
	},
	deletePart : function(part) {
		In2iGui.callDelegates(part,'deletePart');
		this.partControls.hide();
	},
	newPart : function(e) {
		if (!this.newPartMenu) {
			var menu = In2iGui.Menu.create('In2iGuiEditorNewPartMenu');
			this.partControllers.each(function(item) {
				menu.addItem(item.title,item.key);
			});
			menu.addDelegate(this);
			this.newPartMenu=menu;
		}
		this.newPartMenu.showAtPointer(e);
	},
	itemWasClicked$In2iGuiEditorNewPartMenu : function(value) {
		var info = {row:this.hoveredPart.row,column:this.hoveredPart.column,position:this.hoveredPart.position+1,type:value};
		In2iGui.callDelegates(this,'addPart',info);
	},
	/**** Dragging ****/
	startPartDrag : function(e) {
		return true;
		if (!this.active || this.activePart) return true;
		if (!this.dragProxy) {
			this.dragProxy = new Element('div').addClassName('in2igui_editor_dragproxy part part_header');
			document.body.appendChild(this.dragProxy);
		}
		var element = this.hoveredPart.element;
		this.dragProxy.setStyle({'width':element.getWidth()+'px'});
		this.dragProxy.innerHTML = element.innerHTML;
		In2iGui.Editor.startDrag(e,this.dragProxy);
		return;
		Element.observe(document.body,'mouseup',function() {
			self.endPartDrag();
		})
	},
	dragPart : function() {
		
	},
	endPartDrag : function() {
		In2iGui.get();
	}
}



In2iGui.Editor.startDrag = function(e,element) {
	In2iGui.Editor.dragElement = element;
	Element.observe(document.body,'mousemove',In2iGui.Editor.dragListener);
	Element.observe(document.body,'mouseup',In2iGui.Editor.dragEndListener);
	In2iGui.Editor.startDragPos = {top:e.pointerY(),left:e.pointerX()};
	e.stop();
	return false;
}

In2iGui.Editor.dragListener = function(e) {
	var element = In2iGui.Editor.dragElement;
	element.style.left = e.pointerX()+'px';
	element.style.top = e.pointerY()+'px';
	element.style.display='block';
	return false;
}

In2iGui.Editor.dragEndListener = function(event) {
	Event.stopObserving(document.body,'mousemove',In2iGui.Editor.dragListener);
	Event.stopObserving(document.body,'mouseup',In2iGui.Editor.dragEndListener);
	In2iGui.Editor.dragElement.style.display='none';
	In2iGui.Editor.dragElement=null;
}

////////////////////////////////// Header editor ////////////////////////////////

In2iGui.Editor.Header = function(element,row,column,position) {
	this.element = $(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = this.element.id.match(/part\-([\d]+)/i)[1];
	this.header = $tag('*',this.element)[0];
	this.field = null;
}

In2iGui.Editor.Header.prototype = {
	activate : function() {
		this.value = this.header.innerHTML;
		this.field = new Element('textarea').addClassName('in2igui_editor_header');
		this.field.value = this.value;
		this.header.style.visibility='hidden';
		this.updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		var self = this;
		this.field.onblur = function() {
			//self.deactivate();
		}
		this.field.onkeydown = function(e) {
			if (new N2i.Event(e).isReturnKey()) {
				self.save();
			}
		}
	},
	save : function() {
		var value = this.field.value;
		this.header.innerHTML = value;
		this.deactivate();
		if (value!=this.value) {
			this.value = value;
			In2iGui.Editor.get().partChanged(this);
		}
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
		In2iGui.Editor.get().partDidDeacivate(this);
	},
	updateFieldStyle : function() {
		this.field.style.width=N2i.getWidth(this.header)+'px';
		this.field.style.height=N2i.getHeight(this.header)+'px';
		this.field.style.fontSize=N2i.getStyle(this.header,'font-size');
		this.field.style.fontWeight=N2i.getStyle(this.header,'font-weight');
		this.field.style.fontFamily=N2i.getStyle(this.header,'font-family');
		this.field.style.textAlign=N2i.getStyle(this.header,'text-align');
		this.field.style.color=N2i.getStyle(this.header,'color');
	},
	getValue : function() {
		return this.value;
	}
}

////////////////////////////////// Html editor ////////////////////////////////

In2iGui.Editor.Html = function(element,row,column,position) {
	this.element = $(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = this.element.id.match(/part\-([\d]+)/i)[1];
	this.field = null;
}

In2iGui.Editor.Html.prototype = {
	activate : function() {
		this.value = this.element.innerHTML;
		if (Prototype.Browser.IE) return;
		var height = this.element.getHeight();
		this.element.update('');
		var style = this.getStyle();
		this.editor = In2iGui.RichText.create(null,{autoHideToolbar:false,style:style});
		this.editor.setHeight(height);
		this.element.appendChild(this.editor.getElement());
		this.editor.addDelegate(this);
		this.editor.ignite();
		this.editor.setValue(this.value);
		this.editor.focus();
	},
	getStyle : function() {
		var style = '';
		style+='text-align:'+N2i.getStyle(this.element,'text-align')+';';
		style+='font-family:'+N2i.getStyle(this.element,'font-family')+';';
		style+='font-size:'+N2i.getStyle(this.element,'font-size')+';';
		style+='font-weight:'+N2i.getStyle(this.element,'font-weight')+';';
		style+='color:'+N2i.getStyle(this.element,'color')+';';
		return style;
	},
	cancel : function() {
		this.deactivate();
		this.element.innerHTML = this.value;
	},
	save : function() {
		this.deactivate();
		if (Prototype.Browser.IE) return;
		var value = this.editor.value;
		if (value!=this.value) {
			this.value = value;
			In2iGui.Editor.get().partChanged(this);
		}
		this.element.innerHTML = this.value;
	},
	deactivate : function() {
		if (!Prototype.Browser.IE) {
			this.editor.deactivate();
		}
		In2iGui.Editor.get().partDidDeacivate(this);
	},
	richTextDidChange : function() {
		//this.deactivate();
	},
	getValue : function() {
		return this.value;
	}
}

/* EOF */
In2iGui.Menu = function(element,name,options) {
	this.options = {};
	N2i.override(this.options,options);
	this.element = $id(element);
	this.name = name;
	this.value = null;
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Menu.create = function(name,options) {
	options = options || {};
	var element = new Element('div').addClassName('in2igui_menu');
	var obj = new In2iGui.Menu(element,name,options);
	document.body.appendChild(element);
	return obj;
}

In2iGui.Menu.prototype = {
	addBehavior : function() {
		var self = this;
		this.hider = function() {self.hide();}
	},
	addItem : function(title,value) {
		var self = this;
		var item = new Element('div').addClassName('in2igui_menu_item').update(title);
		item.observe('click',function(e) {
			self.itemWasClicked(value);
			e.stop();
		})
		this.element.insert(item);
	},
	getValue : function() {
		return this.value;
	},
	itemWasClicked : function(value) {
		this.value = value;
		In2iGui.callDelegates(this,'itemWasClicked',value);
		this.hide();
	},
	showAtPointer : function(event) {
		this.showAtPoint({'top':event.pointerY(),'left':event.pointerX()});
		event.stop();
	},
	showAtElement : function(element) {
		this.showAtPoint(element.cumulativeOffset());
	},
	showAtPoint : function(pos) {
		var innerWidth = N2i.Window.getInnerWidth();
		this.element.setStyle({'display':'block','visibility':'hidden'});
		var width = this.element.getWidth();
		this.element.setStyle({'top':pos.top+'px','left':Math.min(pos.left,innerWidth-width-20)+'px','visibility':'visible'});
		this.addHider();
	},
	hide : function() {
		this.element.setStyle({'display':'none'});
		this.removeHider();
	},
	addHider : function() {
		Element.observe(document.body,'click',this.hider);
	},
	removeHider : function() {
		Event.stopObserving(document.body,'click',this.hider);
	}
}



/* EOF */In2iGui.Overlay = function(element,name,options) {
	this.element = $(element);
	this.content = this.element.select('div.in2igui_inner_overlay')[1];
	this.name = name;
	this.icons = new Hash();
	this.visible = false;
	In2iGui.extend(this);
}

In2iGui.Overlay.create = function(name,options) {
	var element = new Element('div').addClassName('in2igui_overlay').setStyle({'display':'none'});
	element.update('<div class="in2igui_inner_overlay"><div class="in2igui_inner_overlay"></div></div>');
	document.body.appendChild(element);
	return new In2iGui.Overlay(element,name);
}

In2iGui.Overlay.prototype = {
	addIcon : function(key,icon) {
		var self = this;
		var element = new Element('div').addClassName('in2igui_overlay_icon');
		element.setStyle({'backgroundImage':'url('+In2iGui.getIconUrl(icon,2)+')'});
		element.observe('click',function(e) {
			self.iconWasClicked(key,e);
		});
		this.icons.set(key,element);
		this.content.insert(element);
	},
	hideIcons : function(keys) {
		var self = this;
		keys.each(function(key) {
			self.icons.get(key).hide();
		});
	},
	showIcons : function(keys) {
		var self = this;
		keys.each(function(key) {
			self.icons.get(key).show();
		});
	},
	iconWasClicked : function(key,e) {
		In2iGui.callDelegates(this,'iconWasClicked',key,e);
	},
	showAtElement : function(element,options) {
		In2iGui.positionAtElement(this.element,element,options);
		if (this.visible) return;
		this.element.setStyle({'display':'block','opacity':0});
		$ani(this.element,'opacity',1,300);
		this.visible = true;
		return;
	},
	hide : function() {
		this.element.setStyle({'display':'none'});
		this.visible = false;
	}
}

/* EOF */
In2iGui.Upload = function(element,name,options) {
	this.element = $(element);
	this.name = name;
	this.file = $class('file',this.element)[0];
	this.form = $tag('form',this.element)[0];
	In2iGui.extend(this);
	this.loader = null;
	this.addBehavior();
	this.createProgressBar();
}

In2iGui.Upload.create = function(name,options) {
	var element = new Element('div',{'class':'in2igui_upload'});
	var form = new Element('form',{'action':options.action, 'method':'post', 'enctype':'multipart/form-data','encoding':'multipart/form-data','target':'upload'});
	for (var i=0; i < options.parameters.length; i++) {
		var hidden = new Element('input',{'type':'hidden','name':options.parameters[i].name,'value':options.parameters[i].value});
		form.insert(hidden);
	};
	var file = N2i.create('input',{'type':'file','class':'file','name':options.name});
	form.insert(file);
	element.insert(form);
	element.insert(new Element('iframe',{name:'upload',id:'upload'}).setStyle({display:'none'}));
	return new In2iGui.Upload(element,name,options);
}

In2iGui.Upload.prototype = {
	addBehavior : function() {
		var self = this;
		this.file.onchange = function() {
			self.submit();
		}
	},
	createProgressBar : function() {
		this.progressBar = In2iGui.ProgressBar.create();
		this.progressBar.hide();
		this.element.appendChild(this.progressBar.getElement());
	},
	submit : function() {
		this.form.submit();
		In2iGui.callDelegates(this,'uploadDidSubmit');
	},
	startProgress : function() {
		this.form.style.display='none';
		this.progressBar.show();
	},
	setProgress : function(value) {
		this.progressBar.setValue(value);
	},
	endProgress : function() {
		this.form.style.display='block';
		this.form.reset();
		this.progressBar.reset();
		this.progressBar.hide();
	}
}





//////////////////////////////////////// Mulit-upload ////////////////////////////////////////



In2iGui.MultiUpload = function(element,name,options) {
	this.options = {url:''};
	N2i.override(this.options,options);
	this.element = $(element);
	this.itemContainer = this.element.select('.in2igui_multiupload_items')[0];

	this.name = name;
	this.items = [];
	this.busy = false;

	this.button = this.element.select('.in2igui_button')[0];
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.MultiUpload.prototype = {
	addBehavior : function() {
		var self = this;
		this.button.observe('click',function() {
			self.loader.selectFiles();
		});
		document.observe('dom:loaded', function() {self.createLoader()});
	},
	createLoader : function() {
		var loc = new String(document.location);
		var url = loc.slice(0,loc.lastIndexOf('/')+1);
		url += this.options.url;
		var session = N2i.Cookie.get('JSESSIONID');
		if (session) {
			url+=';jsessionid='+session;
		}
		var self = this;
		this.loader = new SWFUpload({
			upload_url : url,
			flash_url : In2iGui.context+"/In2iGui/lib/swfupload/swfupload_f8.swf",
			file_size_limit : "20480",
			file_upload_limit : 100,
			debug : true,
			
			swfupload_loaded_handler : function() {self.loaded()},
			file_queued_handler : function(file) {self.fileQueued(file)},
			file_queue_error_handler : function(file, error, message) {self.fileQueueError(file, error, message)},
			file_dialog_complete_handler : function() {self.fileDialogComplete()},
			upload_start_handler : function() {self.uploadStart()},
			upload_progress_handler : function(file,complete,total) {self.uploadProgress(file,complete,total)},
			upload_error_handler : function(file, error, message) {self.uploadError(file, error, message)},
			upload_success_handler : function(file,data) {self.uploadSuccess(file,data)},
			upload_complete_handler : function(file) {self.uploadComplete(file)},
			queue_complete_handler : function() {self.queueComplete()},
		
			// SWFObject settings
			swfupload_pre_load_handler : function() {},
			swfupload_load_failed_handler : function() {}

		});
	},
	startNextUpload : function() {
		this.loader.startUpload();
	},
	addError : function(error,file) {
		var element = new Element('div',{'class':'in2igui_multiupload_item_error'});
		element.insert(new Element('a',{'class':'in2igui_link'}).update('<span>Fjern</span>').observe('click',function() {this.parentNode.remove(); return false;}));
		element.insert('<strong>'+In2iGui.MultiUpload.errors[error]+'</strong><br/><em>'+file.name+'</em>');
		this.itemContainer.insert(element);
	},
	
	//////////////////// Events //////////////
	
	loaded : function() {
		
	},
	fileQueued : function(file) {
		var item = new In2iGui.MultiUpload.Item(file);
		this.items[file.index] = item;
		this.itemContainer.insert(item.element);
	},
	fileQueueError : function(file, error, message) {
		this.addError(error,file);
	},
	fileDialogComplete : function() {
		this.startNextUpload();
	},
	uploadStart : function() {
		
	},
	uploadProgress : function(file,complete,total) {
		this.items[file.index].updateProgress(complete,total);
	},
	uploadError : function(file, error, message) {
		if (file) {
			this.items[file.index].update(file);
		}
		this.addError(error,file);
	},
	uploadSuccess : function(file,data) {
		this.items[file.index].updateProgress(file.size,file.size);
	},
	uploadComplete : function(file) {
		this.startNextUpload();
		var self = this;
		window.setTimeout(function() {
			self.items[file.index].hide();
		},100);
		In2iGui.callDelegates(this,'uploadDidComplete',file);
	},
	queueComplete : function() {
		
	}
}

In2iGui.MultiUpload.Item = function(file) {
	this.element = new Element('div').addClassName('in2igui_multiupload_item');
	this.info = new Element('strong');
	this.progress = In2iGui.ProgressBar.create();
	this.element.insert(this.progress.getElement());
	this.element.insert(this.info);
	this.update(file);
}

In2iGui.MultiUpload.Item.prototype = {
	update : function(file) {
		this.info.update(file.name);
	},
	updateProgress : function(complete,total) {
		this.progress.setValue(complete/total);
	},
	hide : function() {
		this.element.hide();
	}
}

if (window.SWFUpload) {
In2iGui.MultiUpload.errors = {};
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED]			= 'Der er for mange filer i køen';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]		= 'Filen er for stor';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]				= 'Filen er tom';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]				= 'Filens type er ikke understøttet';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]					= 'Der skete en netværksfejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]			= 'Upload-adressen findes ikke';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.IO_ERROR]						= 'Der skete en IO-fejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]				= 'Der skete en sikkerhedsfejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]			= 'Upload-størrelsen er overskredet';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]				= 'Upload af filen fejlede';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]	= 'Filens id kunne ikke findes';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]		= 'Validering af filen fejlede';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]				= 'Filen blev afbrudt';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]				= 'Upload af filen blev stoppet';
}
/* EOF */In2iGui.ProgressBar = function(element,name) {
	this.element = $(element);
	this.indicator = this.element.firstDescendant();
	this.name = name;
	In2iGui.extend(this);
}

In2iGui.ProgressBar.create = function(name) {
	var element = new Element('div',{'class':'in2igui_progressbar'}).insert(N2i.create('div'));
	return new In2iGui.ProgressBar(element,name);
}
	
In2iGui.ProgressBar.prototype = {
	setValue : function(value) {
		$ani(this.indicator,'width',(value*100)+'%',value==1 ? 10 : 200);
	},
	reset : function() {
		this.indicator.style.width='0%';
	},
	hide : function() {
		this.element.style.display = 'none';
	},
	show : function() {
		this.element.style.display = 'block';
	}
}

/* EOF */In2iGui.Gallery = function(id,name,options) {
	this.id = id;
	this.name = name;
	this.options = options || {};
	this.element = $(id);
	this.objects = [];
	this.nodes = [];
	this.selected = new Hash();
	this.width = 100;
	this.height = 100;
	In2iGui.extend(this);
}

In2iGui.Gallery.prototype = {
	setObjects : function(objects) {
		this.objects = objects;
		this.render();
	},
	getObjects : function() {
		return this.objects;
	},
	render : function() {
		this.nodes = [];
		this.element.update();
		var self = this;
		this.objects.each(function(object,i) {
			var url = self.resolveImageUrl(object);
			url = url.replace(/&amp;/,'&');
			if (object.height<object.width) {
				var top = (self.height-(self.height*object.height/object.width))/2;
			} else {
				var top = 0;
			}
			var img = new Element('img',{src:url}).setStyle({margin:top+'px auto 0px'});
			var item = new Element('div',{'class':'in2igui_gallery_item'}).setStyle({'width':self.width+'px','height':self.height+'px'}).insert(img);
			item.observe('click',function() {
				self.itemClicked(i);
			});
			item.observe('dblclick',function() {
				self.itemDoubleClicked(i);
			});
			self.element.insert(item);
			self.nodes.push(item);
		});
	},
	updateUI : function() {
		var self = this;
		this.objects.each(function(object,i) {
			if (self.selected.get(i)) {
				self.nodes[i].addClassName('in2igui_gallery_item_selected');
			} else {
				self.nodes[i].removeClassName('in2igui_gallery_item_selected');
			}
		});
	},
	resolveImageUrl : function(img) {
		for (var i=0; i < this.delegates.length; i++) {
			if (this.delegates[i].resolveImageUrl) {
				return this.delegates[i].resolveImageUrl(img,this.width,this.height);
			}
		};
		return '';
	},
	itemClicked : function(index) {
		this.selected = new Hash();
		this.selected.set(index,true);
		this.updateUI();
	},
	itemDoubleClicked : function(index) {
		In2iGui.callDelegates(this,'itemOpened',this.objects[index]);
	}
}

/* EOF */In2iGui.Calendar = function(id,name,options) {
	this.name = name;
	this.options = {startHour:7,endHour:24};
	N2i.override(this.options,options);
	this.element = $(id);
	this.head = $(this.element.getElementsByTagName('thead')[0]);
	this.body = $(this.element.getElementsByTagName('tbody')[0]);
	this.date = new Date();
	In2iGui.extend(this);
	this.buildUI();
	this.updateUI();
}

In2iGui.Calendar.prototype = {
	getFirstDay : function() {
		var date = new Date(this.date.getTime());
		date.setDate(date.getDate()-date.getDay()+1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return date;
	},
	getLastDay : function() {
		var date = new Date(this.date.getTime());
		date.setDate(date.getDate()-date.getDay()+7);
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		return date;
	},
	clearEvents : function() {
		this.events = [];
		var nodes = this.element.select('.in2igui_calendar_event');
		nodes.each(function(node) {
			node.remove();
		});
		this.hideEventViewer();
	},
	setEvents : function(events) {
		this.setBusy(false);
		this.clearEvents();
		this.events = events;
		var self = this;
		var pixels = (this.options.endHour-this.options.startHour)*40;
		this.events.each(function(event) {
			var day = self.body.select('.day')[event.startTime.getDay()-1];
			var node = new Element('div',{'class':'in2igui_calendar_event'});
			var top = ((event.startTime.getHours()*60+event.startTime.getMinutes())/60-self.options.startHour)*40-1;
			var height = (event.endTime.getTime()-event.startTime.getTime())/1000/60/60*40+1;
			var height = Math.min(pixels-top,height);
			node.setStyle({'marginTop':top+'px','height':height+'px'});
			var content = new Element('div');
			content.insert(new Element('p',{'class':'in2igui_calendar_event_time'}).update(event.startTime.dateFormat('H:i')));
			content.insert(new Element('p',{'class':'in2igui_calendar_event_text'}).update(event.text));
			if (event.location) {
				content.insert(new Element('p',{'class':'in2igui_calendar_event_location'}).update(event.location));
			}
			day.insert(node.insert(content));
			node.observe('click',function() {
				self.eventWasClicked(event,this);
			});
		});
	},
	eventWasClicked : function(event,node) {
		this.showEvent(event,node);
	},
	setBusy : function(busy) {
		if (busy) {
			this.element.addClassName('in2igui_calendar_busy');
		} else {
			this.element.removeClassName('in2igui_calendar_busy');
		}
	},
	updateUI : function() {
		var first = this.getFirstDay();
		var x = this.head.select('.time')[0];
		x.update('<div>Uge '+this.date.getWeekOfYear()+' '+this.date.getFullYear()+'</div>');
		
		var days = this.head.select('.day');
		for (var i=0; i < days.length; i++) {
			var date = new Date(first.getTime());
			date.setDate(date.getDate()+i);
			days[i].update(date.dateFormat('l \\d. d M'))
		};
	},
	buildUI : function() {
		var bar = this.element.select('.in2igui_calendar_bar')[0];
		this.toolbar = In2iGui.Toolbar.create(null,{labels:false});
		bar.insert(this.toolbar.getElement());
		var previous = In2iGui.Button.create('in2iguiCalendarPrevious',{text:'',icon:'monochrome/previous'});
		previous.addDelegate(this);
		this.toolbar.add(previous);
		var today = In2iGui.Button.create('in2iguiCalendarToday',{text:'Idag'});
		today.addDelegate(this);
		this.toolbar.add(today);
		var next = In2iGui.Button.create('in2iguiCalendarNext',{text:'',icon:'monochrome/next'});
		next.addDelegate(this);
		this.toolbar.add(next);
		this.datePickerButton = In2iGui.Button.create('in2iguiCalendarDatePicker',{text:'Vælg dato...'});
		this.datePickerButton.addDelegate(this);
		this.toolbar.add(this.datePickerButton);
		
		var time = this.body.select('.time')[0];
		for (var i=this.options.startHour; i <= this.options.endHour; i++) {
			var node = new Element('div').update('<span><em>'+i+':00</em></span>');
			if (i==this.options.startHour) {
				node.addClassName('first');
			}
			if (i==this.options.endHour) {
				node.addClassName('last');
			}
			time.insert(node);
		};
	},
	click$in2iguiCalendarPrevious : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()-7);
		this.setDate(date);
	},
	click$in2iguiCalendarNext : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()+7);
		this.setDate(date);
	},
	click$in2iguiCalendarToday : function() {
		this.setDate(new Date());
	},
	setDate: function(date) {
		this.date = new Date(date.getTime());
		this.updateUI();
		this.refresh();
		if (this.datePicker) {
			this.datePicker.setValue(this.date);
		}
	},
	click$in2iguiCalendarDatePicker : function() {
		this.showDatePicker();
	},
	refresh : function() {
		this.clearEvents();
		this.setBusy(true);
		var info = {'startTime':this.getFirstDay(),'endTime':this.getLastDay()};
		In2iGui.callDelegates(this,'calendarSpanChanged',info);
	},
	
	////////////////////////////////// Date picker ///////////////////////////
	showDatePicker : function() {
		if (!this.datePickerPanel) {
			this.datePickerPanel = In2iGui.BoundPanel.create();
			this.datePicker = In2iGui.DatePicker.create('in2iguiCalendarDatePicker',{value:this.date});
			this.datePicker.addDelegate(this);
			this.datePickerPanel.add(this.datePicker);
			this.datePickerPanel.addSpace(5);
			var button = In2iGui.Button.create('in2iguiCalendarDatePickerClose',{text:'Luk'});
			button.addDelegate(this);
			this.datePickerPanel.add(button);
		}
		this.datePickerPanel.position(this.datePickerButton.getElement());
		this.datePickerPanel.show();
	},
	click$in2iguiCalendarDatePickerClose : function() {
		this.datePickerPanel.hide();
	},
	dateChanged$in2iguiCalendarDatePicker : function(date) {
		this.setDate(date);
	},
	
	//////////////////////////////// Event viewer //////////////////////////////
	
	showEvent : function(event,node) {
		if (!this.eventViewerPanel) {
			this.eventViewerPanel = In2iGui.BoundPanel.create({width:270,padding: 3});
			this.eventInfo = In2iGui.InfoView.create(null,{height:240,clickObjects:true});
			this.eventViewerPanel.add(this.eventInfo);
			this.eventViewerPanel.addSpace(5);
			var button = In2iGui.Button.create('in2iguiCalendarEventClose',{text:'Luk'});
			button.addDelegate(this);
			this.eventViewerPanel.add(button);
		}
		this.eventInfo.clear();
		this.eventInfo.setBusy(true);
		this.eventViewerPanel.position(node);
		this.eventViewerPanel.show();
		In2iGui.callDelegates(this,'requestEventInfo',event);
		return;
	},
	updateEventInfo : function(event,data) {
		this.eventInfo.setBusy(false);
		this.eventInfo.update(data);
	},
	click$in2iguiCalendarEventClose : function() {
		this.hideEventViewer();
	},
	hideEventViewer : function() {
		if (this.eventViewerPanel) {
			this.eventViewerPanel.hide();
		}
	}
}


/********************** Date picker ***************/

In2iGui.DatePicker = function(id,name,options) {
	this.name = name;
	this.element = $(id);
	this.options = {};
	N2i.override(this.options,options);
	this.cells = [];
	this.title = this.element.select('strong')[0];
	this.today = new Date();
	this.value = this.options.value ? new Date(this.options.value.getTime()) : new Date();
	this.viewDate = new Date(this.value.getTime());
	this.viewDate.setDate(1);
	In2iGui.extend(this);
	this.addBehavior();
	this.updateUI();
}

In2iGui.DatePicker.create = function(name,options) {
	var element = new Element('div',{'class':'in2igui_datepicker'});
	element.insert('<div class="in2igui_datepicker_header"><a class="in2igui_datepicker_next"></a><a class="in2igui_datepicker_previous"></a><strong></strong></div>');
	var table = new Element('table');
	var head = new Element('tr');
	table.insert(new Element('thead').insert(head));
	for (var i=0;i<7;i++) {
		head.insert(new Element('th').update(Date.dayNames[i].substring(0,3)));
	}
	var body = new Element('tbody');
	table.insert(body);
	for (var i=0;i<6;i++) {
		var row = new Element('tr');
		for (var j=0;j<7;j++) {
			var cell = new Element('td');
			row.insert(cell);
		}
		body.insert(row);
	}
	element.insert(table);
	return new In2iGui.DatePicker(element,name,options);
}

In2iGui.DatePicker.prototype = {
	addBehavior : function() {
		var self = this;
		this.cells = this.element.select('td');
		this.cells.each(function(cell,index) {
			cell.observe('mousedown',function() {self.selectCell(index)});
		})
		this.element.select('.in2igui_datepicker_next')[0].observe('mousedown',function() {self.next()});
		this.element.select('.in2igui_datepicker_previous')[0].observe('mousedown',function() {self.previous()});
	},
	setValue : function(date) {
		this.value = new Date(date.getTime());
		this.viewDate = new Date(date.getTime());
		this.viewDate.setDate(1);
		this.updateUI();
	},
	updateUI : function() {
		this.title.update(this.viewDate.dateFormat('F Y'));
		var isSelectedYear =  this.value.getFullYear()==this.viewDate.getFullYear();
		var month = this.viewDate.getMonth();
		for (var i=0; i < this.cells.length; i++) {
			var date = this.indexToDate(i);
			var cell = this.cells[i];
			if (date.getMonth()<month) {
				cell.className = 'in2igui_datepicker_dimmed';
			} else if (date.getMonth()>month) {
				cell.className = 'in2igui_datepicker_dimmed';
			} else {
				cell.className = '';
			}
			if (date.getDate()==this.value.getDate() && date.getMonth()==this.value.getMonth() && isSelectedYear) {
				cell.addClassName('in2igui_datepicker_selected');
			}
			if (date.getDate()==this.today.getDate() && date.getMonth()==this.today.getMonth() && date.getFullYear()==this.today.getFullYear()) {
				cell.addClassName('in2igui_datepicker_today');
			}
			cell.update(date.getDate());
		};
	},
	getPreviousMonth : function() {
		var previous = new Date(this.viewDate.getTime());
		previous.setMonth(previous.getMonth()-1);
		return previous;
	},
	getNextMonth : function() {
		var previous = new Date(this.viewDate.getTime());
		previous.setMonth(previous.getMonth()+1);
		return previous;
	},
	////////////////// Events ///////////////
	previous : function() {
		this.viewDate = this.getPreviousMonth();
		this.updateUI();
	},
	next : function() {
		this.viewDate = this.getNextMonth();
		this.updateUI();
	},
	selectCell : function(index) {
		this.value = this.indexToDate(index);
		this.viewDate = new Date(this.value.getTime());
		this.viewDate.setDate(1);
		this.updateUI();
		In2iGui.callDelegates(this,'dateChanged',this.value);
	},
	indexToDate : function(index) {
		var first = this.viewDate.getDay();
		var days = this.viewDate.getDaysInMonth();
		var previousDays = this.getPreviousMonth().getDaysInMonth();
		if (index<first) {
			var date = this.getPreviousMonth();
			date.setDate(previousDays-first+index+1);
			return date;
		} else if (index>first+days-1) {
			var date = this.getPreviousMonth();
			date.setDate(index-first-days+1);
			return date;
			cell.update(i-first-days+1);
		} else {
			var date = new Date(this.viewDate.getTime());
			date.setDate(index+1-first);
			return date;
		}
	}
}

Date.monthNames =
   ["Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December"];
Date.dayNames =
   ["Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag"];

/* EOF */In2iGui.Columns = function(id,name,options) {
	this.name = name;
	this.options = options || {};
	this.element = $(id);
	this.body = this.element.select('tr')[0];
	In2iGui.extend(this);
}

In2iGui.Columns.create = function(name,options) {
	var e = new Element('table',{'class':'in2igui_columns'}).insert(new Element('tbody').insert(new Element('tr')));
	return new In2iGui.Columns(e,name,options);
}

In2iGui.Columns.prototype = {
	addToColumn : function(index,widget) {
		var c = this.ensureColumn(index);
		N2i.log(c);
		c.insert(widget.getElement());
	},
	ensureColumn : function(index) {
		var children = this.body.childElements();
		N2i.log(children.length-1);
		for (var i=children.length-1;i<index;i++) {
			this.body.insert(new Element('td',{'class':'in2igui_columns_column'}));
			N2i.log('insert');
		}
		N2i.log(this.body);
		return this.body.childElements()[index];
	}
}

/* EOF */