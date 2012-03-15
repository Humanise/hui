/** @namespace */
var hui = {
	/** @namespace */
	browser : {},
	ELEMENT_NODE : 1,
	ATTRIBUTE_NODE : 2,
	TEXT_NODE : 3,
	KEY_BACKSPACE : 8,
    KEY_TAB : 9,
    KEY_RETURN : 13,
    KEY_ESC : 27,
    KEY_LEFT : 37,
    KEY_UP : 38,
    KEY_RIGHT : 39,
    KEY_DOWN : 40,
    KEY_DELETE : 46,
    KEY_HOME : 36,
    KEY_END : 35,
    KEY_PAGEUP : 33,
    KEY_PAGEDOWN : 34,
    KEY_INSERT : 45
};




//////////////////////// Browser //////////////////////////

/** If the browser is opera */
hui.browser.opera = /opera/i.test(navigator.userAgent);
/** If the browser is any version of InternetExplorer */
hui.browser.msie = !hui.browser.opera && /MSIE/.test(navigator.userAgent);
/** If the browser is InternetExplorer 6 */
hui.browser.msie6 = navigator.userAgent.indexOf('MSIE 6') !== -1;
/** If the browser is InternetExplorer 7 */
hui.browser.msie7 = navigator.userAgent.indexOf('MSIE 7') !== -1;
/** If the browser is InternetExplorer 8 */
hui.browser.msie8 = navigator.userAgent.indexOf('MSIE 8') !== -1;
/** If the browser is InternetExplorer 9 */
hui.browser.msie9 = navigator.userAgent.indexOf('MSIE 9') !== -1;
/** If the browser is InternetExplorer 9 in compatibility mode */
hui.browser.msie9compat = hui.browser.msie7 && navigator.userAgent.indexOf('Trident/5.0') !== -1;
/** If the browser is WebKit based */
hui.browser.webkit = navigator.userAgent.indexOf('WebKit') !== -1;
/** If the browser is any version of Safari */
hui.browser.safari = navigator.userAgent.indexOf('Safari') !== -1;
/** If the browser is any version of Chrome */
hui.browser.chrome = navigator.userAgent.indexOf('Chrome') !== -1;
/** The version of WebKit (null if not WebKit) */
hui.browser.webkitVersion = null;
/** If the browser is Gecko based */
hui.browser.gecko = !hui.browser.webkit && navigator.userAgent.indexOf('Gecko') !== -1;
/** If the browser is safari on iPad */
hui.browser.ipad = hui.browser.webkit && navigator.userAgent.indexOf('iPad') !== -1;
/** If the browser is on Windows */
hui.browser.windows = navigator.userAgent.indexOf('Windows') !== -1;

/** If the browser supports CSS opacity */
hui.browser.opacity = !hui.browser.msie || hui.browser.msie9;

(function() {
	var result = /Safari\/([\d.]+)/.exec(navigator.userAgent);
	if (result) {
		hui.browser.webkitVersion = parseFloat(result[1]);
	}
})()







////////////////////// Common ////////////////////////

/**
 * Log something
 * @param {Object} obj The object to log
 */
hui.log = function(obj) {
	try {
		console.log(obj);
	} catch (ignore) {};
}

/**
 * Defer a function so it will fire when the current "thread" is done
 * @param {Function} func The fundtion to defer
 * @param {Object} ?bind Optional, the object to bind "this" to
 */
hui.defer = function(func,bind) {
	if (bind) {
		func = func.bind(bind);
	}
	window.setTimeout(func);
}

/**
 * Override the properties on the first argument with properties from the last object
 * @param {Object} original The object to override
 * @param {Object} subject The object to copy the properties from
 * @return {Object} The original
 */
hui.override = function(original,subject) {
	if (subject) {
		for (prop in subject) {
			original[prop] = subject[prop];
		}
	}
	return original;
}

/**
 * Loop through items in array or properties in an object.
 * If «items» is an array «func» is called with each item.
 * If «items» is an object «func» is called with each (key,value)
 * @param {Object | Array} items The object or array to loop through
 * @param {Function} func The callback to handle each item
 */
hui.each = function(items,func) {
	if (hui.isArray(items)) {		
		for (var i=0; i < items.length; i++) {
			func(items[i],i);
		};
	} else {
		for (var key in items) {
			func(key,items[key]);
		}
	}
}

/**
 * Converts a string to an int if it is only digits, otherwise remains a string
 * @param {String} str The string to convert
 * @returns {Object} An int of the string or the same string
 */
hui.intOrString = function(str) {
	if (hui.isDefined(str)) {
		var result = /[0-9]+/.exec(str);
		if (result!==null && result[0]==str) {
			if (parseInt(str,10)==str) {
				return parseInt(str,10);
			}
		}
	}
	return str;
}

/**
 * Checks if a string has non-whitespace characters
 * @param {String} str The string
 */
hui.isBlank = function(str) {
	if (str===null || typeof(str)==='undefined' || str==='') {
		return true;
	}
	return typeof(str)=='string' && hui.string.trim(str).length==0;
}

/**
 * Checks that an object is not null and not undefined
 * @param {Object} obj The object to check
 */
hui.isDefined = function(obj) {
	return obj!==null && typeof(obj)!=='undefined';
}

/**
 * Checks if an object is an array
 * @param {Object} obj The object to check
 */
hui.isArray = function(obj) {
	if (obj==null || obj==undefined) {
		return false;
	}
	if (obj.constructor == Array) {
		return true;
	} else {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}











///////////////////////// Strings ///////////////////////

/** @namespace */
hui.string = {
	
	/**
	 * Test that a string start with another string
	 * @param {String} str The string to test
	 * @param {String} start The string to look for at the start
	 * @returns {Boolean} True if «str» starts with «start»
	 */
	startsWith : function(str,start) {
		if (!typeof(str)=='string' || !typeof(start)=='string') {
			return false;
		}
		return (str.match("^"+start)==start);
	},
	/**
	 * Test that a string ends with another string
	 * @param {String} str The string to test
	 * @param {String} end The string to look for at the end
	 * @returns {Boolean} True if «str» ends with «end»
	 */
	endsWith : function(str,end) {
		if (!typeof(str)=='string' || !typeof(end)=='string') {
			return false;
		}
		return (str.match(end+"$")==end);
	},
	
	/** 
	 * Make a string camelized
	 * @param {String} The string to camelize
	 * @returns {String} The camelized string
	 */
	camelize : function(str) {
		if (str.indexOf('-')==-1) {return str}
	    var oStringList = str.split('-');

	    var camelizedString = str.indexOf('-') == 0
	      ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
	      : oStringList[0];

	    for (var i = 1, len = oStringList.length; i < len; i++) {
	      var s = oStringList[i];
	      camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
	    }

	    return camelizedString;
	},
	/**
 	 * Trim whitespace including unicode chars
	 * @param {String} str The text to trim
	 * @returns {String} The trimmed text
	 */
	trim : function(str) {
		if (str===null || str===undefined) {
			return ''
		}
		if (typeof(str)!='string') {
			str=new String(str)
		}
		return str.replace(/^[\s\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+|[\s\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/g, '');
	},
	/**
	 * Inserts invisible break chars in string so it will wrap
	 * @param {String} str The text to wrap
	 * @returns {String} The wrapped text
	 */
	wrap : function(str) {
		if (str===null || str===undefined) {
			return '';
		}
		return str.split('').join("\u200B");
	},
	/**
	 * Escape the html in a string (robust)
	 * @param {String} str The text to escape
	 * @returns {String} The escaped text
	 */
	escapeHTML : function(str) {
		if (str===null || str===undefined) {return ''};
	   	return hui.build('div',{text:str}).innerHTML;
	},
	/**
	 * Escape the html in a string (fast)
	 * @param {String} str The text to escape
	 * @returns {String} The escaped text
	 */
	escape : function(str) {
		if (!hui.isDefined(str)) {return ''};
		return str.replace(/&/g,'&amp;').
			replace(/>/g,'&gt;').
			replace(/</g,'&lt;').
			replace(/"/g,'&quot;')
	},
	/**
	 * Converts a JSON string into an object
	 * @param json {String} The JSON string to parse
	 * @returns {Object} The object
	 */
	fromJSON : function(json) {
		return JSON.parse(json);
	},

	/**
	 * Converts an object into a JSON string
	 * @param obj {Object} the object to convert
	 * @returns {String} A JSON representation
	 */
	toJSON : function(obj) {
		return JSON.stringify(obj);
	}
}







//////////////////////// Array //////////////////////////

/** @namespace */
hui.array = {
	/**
	 * Add an object to an array if it not already exists
	 * @param {Array} arr The array
	 * @param {Object} value The object to add
	 */
	add : function(arr,value) {
		if (value.constructor==Array) {
			for (var i=0; i < value.length; i++) {
				if (!hui.array.contains(arr,value[i])) {
					arr.push(value);
				}
			};
		} else {
			if (!hui.array.contains(arr,value)) {
				arr.push(value);
			}
		}
	},
	/**
	 * Check if an array contains a value
	 * @param {Array} arr The array
	 * @param {Object} value The object to check for
	 * @returns {boolean} true if the value is in the array
	 */
	contains : function(arr,value) {
		for (var i=0; i < arr.length; i++) {
			if (arr[i]===value) {
				return true;
			}
		};
		return false;
	},
	/**
	 * Add or remove a value from an array.
	 * If the value exists all instances are removed, otherwise the value is added
	 * @param {Array} arr The array to change
	 * @param {Object} value The value to flip
	 */
	flip : function(arr,value) {
		if (hui.array.contains(arr,value)) {
			hui.array.remove(arr,value);
		} else {
			arr.push(value);
		}
	},
	/**
	 * Remove all instances of a value from an array
	 * @param {Array} arr The array to change
	 * @param {Object} value The value to remove
	 */
	remove : function(arr,value) {
		for (var i = arr.length - 1; i >= 0; i--){
			if (arr[i]==value) {
				arr.splice(i,1);
			}
		};
	},
	/**
	 * Find the first index of a value in an array, -1 if not found
	 * @param {Array} arr The array to inspect
	 * @param {Object} value The value to find
	 * @returns {Number} The index of the first occurrence, -1 if not found.
	 */
	indexOf : function(arr,value) {
		for (var i=0; i < arr.length; i++) {
			if (arr[i]===value) {
				return i;
			}
		};
		return -1;
	},
	/**
	 * Split a string, like "1,4,6" into an array of integers.
	 * @param {String} The string to split
	 * @returns {Array} An array of integers
	 */
	toIntegers : function(str) {
		var array = str.split(',');
		for (var i = array.length - 1; i >= 0; i--){
			array[i] = parseInt(array[i]);
		};
		return array;
	}
}










////////////////////// DOM ////////////////////

/** @namespace */
hui.dom = {
	isElement : function(node,name) {
		return node.nodeType==hui.ELEMENT_NODE && (name===undefined ? true : node.nodeName.toLowerCase()==name);
	},
	isDefinedText : function(node) {
		return node.nodeType==hui.TEXT_NODE && node.nodeValue.length>0;
	},
	addText : function(node,text) {
		node.appendChild(document.createTextNode(text));
	},
	// TODO: Move to hui.get
	firstChild : function(node) {
		var children = node.childNodes;
		for (var i=0; i < children.length; i++) {
			if (children[i].nodeType==hui.ELEMENT_NODE) {
				return children[i];
			}
		};
		return null;
	},
	clear : function(node) {
		var children = node.childNodes;
		for (var i = children.length - 1; i >= 0; i--) {
			children[i].parentNode.removeChild(children[i]);
		};
	},
	remove : function(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	},
	replaceNode : function(oldNode,newNode) {
		if (newNode.parentNode) {
			newNode.parentNode.removeChild(newNode);
		}
		oldNode.parentNode.insertBefore(newNode,oldNode);
		oldNode.parentNode.removeChild(oldNode);
	},
	insertBefore : function(target,newNode) {
		target.parentNode.insertBefore(newNode,target);
	},
	insertAfter : function(target,newNode) {
		var next = target.nextSibling;
		if (next) {
			next.parentNode.insertBefore(newNode,next);			
		} else {
			target.parentNode.appendChild(newNode);
		}
	},
	replaceHTML : function(node,html) {
		node = hui.get(node);
		node.innerHTML = html;
	},
	runScripts : function(node) {
		var scripts = node.getElementsByTagName('script');
		for (var i=0; i < scripts.length; i++) {
			eval(scripts[i].innerHTML);
		}
	},
	setText : function(node,text) {
		if (text==undefined || text==null) {
			text = '';
		}
		var c = node.childNodes;
		var updated = false;
		for (var i = c.length - 1; i >= 0; i--){
			if (!updated && c[i].nodeType==hui.TEXT_NODE) {
				c[i].nodeValue=text;
				updated = true;
			} else {
				node.removeChild(c[i]);
			}
		}
		if (!updated) {
			hui.dom.addText(node,text);
		}
	},
	getText : function(node) {
		var txt = '';
		var c = node.childNodes;
		for (var i=0; i < c.length; i++) {
			if (c[i].nodeType==hui.TEXT_NODE && c[i].nodeValue!=null) {
				txt+=c[i].nodeValue;
			} else if (c[i].nodeType==hui.ELEMENT_NODE) {
				txt+=hui.dom.getText(c[i]);
			}
		};
		return txt;
	},
	isVisible : function(node) {
		while (node) {
			if (node.style && (hui.style.get(node,'display')==='none' || hui.style.get(node,'visibility')==='hidden')) {
				return false;
			}
			node = node.parentNode;
		}
		return true;
	},
 	isDescendantOrSelf : function(element,parent) {
		while (element) {
			if (element==parent) {
				return true;
			}
			element = element.parentNode;
		}
		return false;
	}
}









///////////////////// Form //////////////////////

/** @namespace */
hui.form = {
	getValues : function(node) {
		var params = {};
		var inputs = node.getElementsByTagName('input');
		for (var i=0; i < inputs.length; i++) {
			if (hui.isDefined(inputs[i].name)) {
				params[inputs[i].name] = inputs[i].value;
			}
		};
		return params;
	}
}







///////////////////////////// Quering ////////////////////////

/**
 * @namespace
 * Functions for finding elements
 *
 * @function
 * Get an element by ID. If the ID is not a string it is returned.
 * @param {String | Element} id The ID to find
 * @returns {Element} The element with the ID or null
 */
hui.get = function(id) {
	if (typeof(id)=='string') {
		return document.getElementById(id);
	}
	return id;
}

/**
 * Get array of child elements of «node», not a NodeList
 */
hui.get.children = function(node) {
	var children = [];
	var x = node.childNodes;
	for (var i=0; i < x.length; i++) {
		if (hui.dom.isElement(x[i])) {
			children.push(x[i]);
		}
	};
	return children;
}

hui.get.ancestors = function(element) {
	var ancestors = [];
	var parent = element.parentNode;
	while (parent) {
		ancestors[ancestors.length] = parent;
		parent = parent.parentNode;
	}
	return ancestors;
}

/**
 * Find the first ancestor with a given class (including self)
 */
hui.get.firstAncestorByClass = function(element,className) {
	while (element) {
		if (hui.cls.has(element,className)) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

hui.get.next = function(element) {
	if (!element) {
		return null;
	}
	if (element.nextElementSibling) {
		return element.nextElementSibling;
	}
	if (!element.nextSibling) {
		return null;
	}
	var next = element.nextSibling;
	while (next && next.nodeType!=1) {
		next = next.nextSibling;
	}
	if (next && next.nodeType==1) { 
    	return next;
	}
	return null;
}

hui.get.before = function(element) {
	var elements = [];
	if (element) {
		var nodes = element.parentNode.childNodes;
		for (var i=0; i < nodes.length; i++) {
			if (nodes[i]==element) {
				break;
			} else if (nodes[i].nodeType===1) {
				elements.push(nodes[i]);
			}
		};
	}
	return elements;
}

/**
 * Find all sibling elements after «element»
 */ 
hui.get.after = function(element) {
	var elements = [];
	var next = hui.get.next(element);
	while (next) {
		elements.push(next);
		next = hui.get.next(next);
	}
	return elements;
}

hui.get.firstByClass = function(parentElement,className,tag) {
	parentElement = hui.get(parentElement) || document.body;
	if (document.querySelector) {
		return parentElement.querySelector((tag ? tag+'.' : '.')+className);
	} else {
		var children = parentElement.getElementsByTagName(tag || '*');
		for (var i=0;i<children.length;i++) {
			if (hui.cls.has(children[i],className)) {
				return children[i];
			}
		}
	}
	return null;
}

hui.get.byClass = function(parentElement,className,tag) {
	parentElement = hui.get(parentElement) || document.body;
	if (document.querySelectorAll) {
		var nl = parentElement.querySelectorAll((tag ? tag+'.' : '.')+className);
		// Important to convert into array...
		var l=[];
		for(var i=0, ll=nl.length; i!=ll; l.push(nl[i++]));
		return l;
	} else {
		var children = parentElement.getElementsByTagName(tag || '*'),
		out = [];
		for (var i=0;i<children.length;i++) {
			if (hui.cls.has(children[i],className)) {
				out[out.length]=children[i];
			}
		}
		return out;
	}
}

/**
 * Get array of descendants of «node» with the name «name»
 * @param node The node to start from
 * @param name The name of the nodes to find
 * @returns An array of nodes (not NodeList)
 */
hui.get.byTag = function(node,name) {
	var nl = node.getElementsByTagName(name),
		l=[];
	for(var i=0, ll=nl.length; i!=ll; l.push(nl[i++]));
	return l;
}

hui.get.byId = function(e,id) {
	var children = e.childNodes;
	for (var i = children.length - 1; i >= 0; i--) {
		if (children[i].nodeType===hui.ELEMENT_NODE && children[i].getAttribute('id')===id) {
			return children[i];
		} else {
			var found = hui.get.byId(children[i],id);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

hui.get.firstParentByTag = function(node,tag) {
	var parent = node;
	while (parent) {
		if (parent.tagName && parent.tagName.toLowerCase()==tag) {
			return parent;
		}
		parent = parent.parentNode;
	}
	return null;
}

hui.get.firstParentByClass = function(node,tag) {
	var parent = node;
	while (parent) {
		if (hui.cls.has(parent)) {
			return parent;
		}
		parent = parent.parentNode;
	}
	return null;
}

/**
 * Find first descendant by tag (excluding self)
 * @param {Element} node The node to start from, will start from body if null
 * @param {String} tag The name of the node to find
 * @returns {Element} The found element or null
 */
hui.get.firstByTag = function(node,tag) {
	node = hui.get(node) || document.body;
	if (document.querySelector && tag!=='*') {
		return node.querySelector(tag);
	}
	var children = node.getElementsByTagName(tag);
	return children[0];
}


hui.get.firstChild = hui.dom.firstChild;









//////////////////////// Elements ///////////////////////////


/**
 * Builds an element with the «name» and «options»
 * <pre><strong>options:</strong> {
 *  html : '<em>markup</em>', 
 *  text : 'child text', 
 *  parent : «Element», 
 *  parentFirst : «Element», 
 *  class : 'css_class', 
 *  className : 'css_class', 
 *  style : 'color: blue;' 
 *}
 *
 * Additional properties will be set as attributes
 * </pre>
 * @param {String} name The name of the new element
 * @param {Object} options The options
 * @returns {Element} The new element
 */
hui.build = function(name,options) {
	var e = document.createElement(name);
	if (options) {
		for (prop in options) {
			if (prop=='text') {
				e.appendChild(document.createTextNode(options.text));
			} else if (prop=='html') {
				e.innerHTML=options.html;
			} else if (prop=='parent') {
				options.parent.appendChild(e);
			} else if (prop=='parentFirst') {
				if (options.parentFirst.childNodes.length==0) {
					options.parentFirst.appendChild(e);
				} else {
					options.parentFirst.insertBefore(e,options.parentFirst.childNodes[0]);
				}
			} else if (prop=='className') {
				e.className=options.className;
			} else if (prop=='class') {
				e.className=options['class'];
			} else if (prop=='style' && (hui.browser.msie7 || hui.browser.msie6)) {
				e.style.setAttribute('cssText',options[prop]);
			} else if (hui.isDefined(options[prop])) {
				e.setAttribute(prop,options[prop]);
			}
		}
	}
	return e;
}








/////////////////////// Position ///////////////////////

/** @namespace
 * Functions for getting and changing the position of elements
 */
hui.position = {
	getTop : function(element) {
	    element = hui.get(element);
		if (element) {
			var yPos = element.offsetTop,
				tempEl = element.offsetParent;
			while (tempEl != null) {
				yPos += tempEl.offsetTop;
				tempEl = tempEl.offsetParent;
			}
			return yPos;
		}
		else return 0;
	},
	getLeft : function(element) {
	    element = hui.get(element);
		if (element) {
			var xPos = element.offsetLeft,
				tempEl = element.offsetParent;
			while (tempEl != null) {
				xPos += tempEl.offsetLeft;
				tempEl = tempEl.offsetParent;
			}
			return xPos;
		}
		else return 0;
	},
	get : function(element) {
		return {
			left : hui.position.getLeft(element),
			top : hui.position.getTop(element)
		}
	},
	getScrollOffset : function(element) {
	    element = hui.get(element);
		var top = 0, left = 0;
	    do {
	      top += element.scrollTop  || 0;
	      left += element.scrollLeft || 0;
	      element = element.parentNode;
	    } while (element);
		return {top:top,left:left};
	},
	/**
	 * Place on element relative to another
	 * Example hui.position.place({target : {element : «node», horizontal : «0-1»}, source : {element : «node», vertical : «0 - 1»}, insideViewPort:«boolean», viewPortMargin:«integer»})
	 */
	place : function(options) {
		var left = 0,
			top = 0,
			src = hui.get(options.source.element),
			trgt = hui.get(options.target.element),
			trgtPos = {left : hui.position.getLeft(trgt), top : hui.position.getTop(trgt) };

		left = trgtPos.left + trgt.clientWidth * (options.target.horizontal || 0);
		top = trgtPos.top + trgt.clientHeight * (options.target.vertical || 0);

		left -= src.clientWidth * (options.source.horizontal || 0);
		top -= src.clientHeight * (options.source.vertical || 0);

		if (options.insideViewPort) {
			var w = hui.window.getViewWidth();
			if (left + src.clientWidth > w) {
				left = w - src.clientWidth - (options.viewPartMargin || 0);
				hui.log(options.viewPartMargin)
			}
			if (left < 0) {left=0}
			if (top < 0) {top=0}
		}
		if (options.top) {
			top += options.top;
		}
		if (options.left) {
			left += options.left;
		}

		src.style.top = top+'px';
		src.style.left = left+'px';
	}
}







////////////////////// Window /////////////////////

/** @namespace */
hui.window = {
	getScrollTop : function() {
		if (window.pageYOffset) {
			return window.pageYOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			return document.documentElement.scrollTop;
		} else if (document.body) {
			return document.body.scrollTop;
		}
		return 0;
	},
	getScrollLeft : function() {
		if (window.pageYOffset) {
			return window.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			return document.documentElement.scrollLeft;
		} else if (document.body) {
			return document.body.scrollLeft;
		}
		return 0;
	},
	/**
	 * Scroll to an element, will try to show the element in the middle of the screen and only scroll if it makes sence
	 * @param {Object} options {element:«the element to scroll to»}
	 */
	scrollTo : function(options) {
		var node = options.element;
		var pos = hui.position.get(node);
		var viewTop = hui.window.getScrollTop();
		var viewHeight = hui.window.getViewHeight();
		var viewBottom = viewTop+viewHeight;
		if (viewTop < pos.top + node.clientHeight || (pos.top)<viewBottom) {
			var top = pos.top - Math.round((viewHeight - node.clientHeight) / 2);
			top = Math.max(0, top);
			window.scrollTo(0, top);
		}
	},
	/**
	 * Get the height of the viewport (the visible part of the page)
	 */
	getViewHeight : function() {
		if (window.innerHeight) {
			return window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			return document.documentElement.clientHeight;
		} else if (document.body) {
			return document.body.clientHeight;
		}
	},
	/**
	 * Get the width of the viewport (the visible part of the page)
	 */
	getViewWidth : function() {
		if (window.innerWidth) {
			return window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			return document.documentElement.clientWidth;
		} else if (document.body) {
			return document.body.clientWidth;
		}
	}
}













/////////////////////////// Class handling //////////////////////

/** @namespace */
hui.cls = {
	/**
	 * Check if an element has a class
	 * @param {Element} element The element
	 * @param {String} className The class
	 * @returns {boolean} true if the element has the class 
	 */
	has : function(element, className) {
		element = hui.get(element);
		if (!element || !element.className) {
			return false
		}
		if (element.hasClassName) {
			return element.hasClassName(className);
		}
		if (element.className==className) {
			return true;
		}
		var a = element.className.split(/\s+/);
		for (var i = 0; i < a.length; i++) {
			if (a[i] == className) {
				return true;
			}
		}
		return false;
	},
	/**
	 * Add a class to an element
	 * @param {Element} element The element to add the class to
	 * @param {String} className The class
	 */
	add : function(element, className) {
	    element = hui.get(element);
		if (!element) {
			return
		}
		if (element.addClassName) {
			element.addClassName(className);
		}
	    hui.cls.remove(element, className);
	    element.className += ' ' + className;
	},
	/**
	 * Remove a class from an element
	 * @param {Element} element The element to remove the class from
	 * @param {String} className The class
	 */
	remove : function(element, className) {
		element = hui.get(element);
		if (!element || !element.className) {return};
		if (element.removeClassName) {
			element.removeClassName(className);
		}
		if (element.className=='className') {
			element.className='';
			return;
		}
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
	},
	/**
	 * Add or remove a class from an element
	 * @param {Element} element The element
	 * @param {String} className The class
	 */
	toggle : function(element,className) {
		if (hui.cls.has(element,className)) {
			hui.cls.remove(element,className);
		} else {
			hui.cls.add(element,className);
		}
	},
	/**
	 * Add or remove a class from an element
	 * @param {Element} element The element
	 * @param {String} className The class
	 * @param {boolean} add If the class should be added or removed
	 */
	set : function(element,className,add) {
		if (add) {
			hui.cls.add(element,className);
		} else {
			hui.cls.remove(element,className);
		}
	}
}










///////////////////// Events //////////////////

/**
 * Add an event listener to an element
 * @param {Element} element The element to listen on
 * @param {String} type The event to listen for
 * @param {Function} listener The function to be called
 * @param {boolean} ?useCapture If the listener should "capture"
 */
hui.listen = function(element,type,listener,useCapture) {
	element = hui.get(element);
	if(document.addEventListener) {
		element.addEventListener(type,listener,useCapture ? true : false);
	} else {
		element.attachEvent('on'+type, listener);
	}
}

/**
 * Remove an event listener from an element
 * @param {Element} element The element to remove listener from
 * @param {String} type The event to remove
 * @param {Function} listener The function to remove
 * @param {boolean} useCapture If the listener should "capture"
 */
hui.unListen = function(el,type,listener,useCapture) {
	el = hui.get(el);
	if(document.removeEventListener) {
		el.removeEventListener(type,listener,useCapture ? true : false);
	} else {
		el.detachEvent('on'+type, listener);
	}
}

/** Creates an event wrapper for an event
 * @param event The DOM event
 * @returns {hui.Event} An event wrapper
 */
hui.event = function(event) {
	if (event!==undefined && event.huiEvent===true) {
		return event;
	}
	return new hui.Event(event);
}

/** @constructor
 * Wrapper for events
 * @param event The DOM event
 */
hui.Event = function(event) {
	this.huiEvent = true;
	/** The event */
	this.event = event = event || window.event;
	/** The target element */
	this.element = event.target ? event.target : event.srcElement;
	/** If the shift key was pressed */
	this.shiftKey = event.shiftKey;
	/** If the alt key was pressed */
	this.altKey = event.altKey;
	/** If the return key was pressed */
	this.returnKey = event.keyCode==13;
	/** If the escape key was pressed */
	this.escapeKey = event.keyCode==27;
	/** If the space key was pressed */
	this.spaceKey = event.keyCode==32;
	/** If the up key was pressed */
	this.upKey = event.keyCode==38;
	/** If the down key was pressed */
	this.downKey = event.keyCode==40;
	/** If the left key was pressed */
	this.leftKey = event.keyCode==37;
	/** If the right key was pressed */
	this.rightKey = event.keyCode==39;
	/** The key code */
	this.keyCode = event.keyCode;
}

hui.Event.prototype = {
	/**
	 * Get the left coordinate
	 * @returns {Number} The left coordinate
	 * @type {Number}
	 */
	getLeft : function() {
	    var left = 0;
		if (this.event) {
		    if (this.event.pageX) {
			    left = this.event.pageX;
		    } else if (this.event.clientX) {
			    left = this.event.clientX + hui.window.getScrollLeft();
		    }
		}
	    return left;
	},
	/**
	 * Get the top coordinate
	 * @returns {Number} The top coordinate
	 */
	getTop : function() {
	    var top = 0;
		if (this.event) {
		    if (this.event.pageY) {
			    top = this.event.pageY;
		    } else if (this.event.clientY) {
			    top = this.event.clientY + hui.window.getScrollTop();
		    }
		}
	    return top;
	},
	/** Get the node the event originates from
	 * @returns {ELement} The originating element
	 */
	getElement : function() {
		return this.element;
	},
	/** Finds the nearest ancester with a certain class name
	 * @param cls The css class name
	 * @returns {Element} The found element or null
	 */
	findByClass : function(cls) {
		return hui.get.firstAncestorByClass(this.element,cls)
	},
	/** Finds the nearest ancester with a certain tag name
	 * @param tag The tag name
	 * @returns {Element} The found element or null
	 */
	findByTag : function(tag) {
		var parent = this.element;
		while (parent) {
			if (parent.tagName && parent.tagName.toLowerCase()==tag) {
				return parent;
			}
			parent = parent.parentNode;
		}
		return null;
	},
	/** Stops the event from propagating */
	stop : function() {
		hui.stop(this.event);
	}
}

/** 
 * Stops an event from propagating
 * @param event A standard DOM event, NOT an hui.Event
 */
hui.stop = function(event) {
	if (!event) {event = window.event};
	if (event.stopPropagation) {event.stopPropagation()};
	if (event.preventDefault) {event.preventDefault()};
	event.cancelBubble = true;
    event.stopped = true;
}

/**
 * Execute a function when the DOM is ready
 * @param delegate The function to execute
 */
hui.onReady = function(delegate) {
	if(window.addEventListener) {
		window.addEventListener('DOMContentLoaded',delegate,false);
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








///////////////////////// Request /////////////////////////

/**
 * Send a HTTP request
 * <pre><strong>options:</strong> {
 *  method : «'<strong>POST</strong>' | 'get' | 'rEmOVe'»,
 *  async : <strong>true</strong>,
 *  headers : {<strong>Ajax : true</strong>, header : 'value'},
 *  file : «HTML5-file»,
 *  files : «HTML5-files»,
 *  parameters : {key : 'value'},
 *
 *  onSuccess : function(transport) {
 *    // when status is 200
 *  },
 *  onForbidden : function(transport) {
 *    // when status is 403
 *  },
 *  onAbort : function(transport) {
 *    // when request is aborted
 *  },
 *  onFailure : function(transport) {
 *    // when status is not 200 (if status is 403 and onForbidden is set then onFailure will not be called)
 *  },
 *  onException : function(exception,transport) {
 *    // When an exception has occurred while calling on«Something», If not set the exception will be thrown
 *  },
 *  onProgress : function(current,total) {
 *    // Progress for file uploads (maybe also other requests?)
 *  },
 *  onLoad : functon() {
 *    // When file upload is transfered?
 *  }
 *}
 * </pre>
 *
 * @param options The options
 * @returns {XMLHttpRequest} The transport
 */
hui.request = function(options) {
	options = hui.override({method:'POST',async:true,headers:{Ajax:true}},options);
	var transport = hui.request.createTransport();
	transport.onreadystatechange = function() {
		try {
			if (transport.readyState == 4) {
				if (transport.status == 200 && options.onSuccess) {
					options.onSuccess(transport);
				} else if (transport.status == 403 && options.onForbidden) {
					options.onForbidden(transport);
				} else if (transport.status !== 0 && options.onFailure) {
					options.onFailure(transport);
				} else if (transport.status == 0 && options.onAbort) {
					options.onAbort(transport);
				}
			}
		} catch (e) {
			if (options.onException) {
				options.onException(e,transport)
			} else {
				throw e;
			}
		}
	};
	var method = options.method.toUpperCase();
	transport.open(method, options.url, options.async);
	var body = null;
	if (method=='POST' && options.file) {
		if (false) {
			body = options.file;
        	transport.setRequestHeader("Content-type", options.file.type);  
        	transport.setRequestHeader("X_FILE_NAME", options.file.name);
		} else {
			body = new FormData();
			body.append('file', options.file);
			if (options.parameters) {
				for (param in options.parameters) {
					body.append(param, options.parameters[param]);
				}
			}
		}
		if (options.onProgress) {
			transport.upload.addEventListener("progress", function(e) {
				options.onProgress(e.loaded,e.total);
			}, false);
		}
		if (options.onLoad) {
	        transport.upload.addEventListener("load", function(e) {
				options.onLoad();
			}, false); 
		}
	} else if (method=='POST' && options.files) {
		body = new FormData();
		//form.append('path', '/');
		for (var i = 0; i < options.files.length; i++) {
			body.append('file'+i, options.files[i]);
		}
	} else if (method=='POST' && options.parameters) {
		body = hui.request._buildPostBody(options.parameters);
		transport.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
	} else {
		body = '';
	}
	if (options.headers) {
		for (name in options.headers) {
			transport.setRequestHeader(name, options.headers[name]);
		}
	}
	transport.send(body);
	return transport;
}

/**
 * Check if a http request has a valid XML response
 * @param {XMLHttpRequest} t The request
 * @return true if a valid XML request exists
 */
hui.request.isXMLResponse = function(t) {
	return t.responseXML && t.responseXML.documentElement && t.responseXML.documentElement.nodeName!='parsererror';
}

hui.request._buildPostBody = function(parameters) {
	if (!parameters) return null;
	var output = '';
	for (param in parameters) {
		if (output.length>0) output+='&';
		output+=encodeURIComponent(param)+'=';
		if (parameters[param]!==undefined && parameters[param]!==null) {
			output+=encodeURIComponent(parameters[param]);
		}
	}
	return output;
}

/**
 * Creates a new XMLHttpRequest
 * @returns The request
 */
hui.request.createTransport = function() {
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
			return hui.request._getActiveX();
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

hui.request._getActiveX = function() {
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







///////////////////// Style ///////////////////

/** @namespace */
hui.style = {
	/**
	 * Copy the style from one element to another
	 * @param source The element to copy from
	 * @param target The element to copy to
	 * @param styles An array of properties to copy
	 */
	copy : function(source,target,styles) {
		for (var i=0; i < styles.length; i++) {
			var s = styles[i];
			var r = hui.style.get(source,s);
			if (r) {
				target.style[s] = r;
			}
		};
	},
	set : function(element,styles) {
		for (style in styles) {
			if (style==='transform') {
				element.style['webkitTransform'] = styles[style];
			} else if (style==='opacity') {
				hui.style.setOpacity(element,styles[style]);
			} else {
				element.style[style] = styles[style];
			}
		}
	},
	/**
	 * Get the computed style of an element
	 * @param {Element} element The element
	 * @param {String} style The CSS property in the form font-size NOT fontSize; 
	 */
	get : function(element, style) {
		element = hui.get(element);
		var cameled = hui.string.camelize(style);
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
			if (hui.style.get(element, 'position') == 'static') {
				value = 'auto';
			}
		}
		return value == 'auto' ? '' : value;
	},
	/** Cross browser way of setting opacity */
	setOpacity : function(element,opacity) {
		if (!hui.browser.opacity) {
			if (opacity==1) {
				element.style['filter']=null;
			} else {
				element.style['filter']='alpha(opacity='+(opacity*100)+')';
			}
		} else {
			element.style['opacity']=opacity;
		}
	}
}






//////////////////// Frames ////////////////////

/** @namespace */
hui.frame = {
	/**
	 * Get the document object of a frame
	 * @param frame The frame to get the document from
	 */
	getDocument : function(frame) {
	    if (frame.contentDocument) {
	        return frame.contentDocument;
	    } else if (frame.contentWindow) {
	        return frame.contentWindow.document;
	    } else if (frame.document) {
	        return frame.document;
	    }
	},
	/**
	 * Get the window object of a frame
	 * @param frame The frame to get the window from
	 */
	getWindow : function(frame) {
	    if (frame.defaultView) {
	        return frame.defaultView;
	    } else if (frame.contentWindow) {
	        return frame.contentWindow;
	    }
	}
}






/////////////////// Selection /////////////////////

/** @namespace */
hui.selection = {
	/** Clear the text selection */
	clear : function() { 
		var sel ; 
		if(document.selection && document.selection.empty	){ 
			document.selection.empty() ; 
		} else if(window.getSelection) { 
			sel=window.getSelection();
			if(sel && sel.removeAllRanges) {
				sel.removeAllRanges() ; 
			}
		}
	},
	/** Get the selected text
	 * @param doc The document, defaults to current document
	 */
	getText : function(doc) {
		doc = doc || document;
		if (doc.getSelection) {
			return doc.getSelection()+'';
		} else if (doc.selection) {
			return doc.selection.createRange().text;
		}
		return '';
	},
	getNode : function(doc) {
		doc = doc || document;
		if (doc.getSelection) {
			var range = doc.getSelection().getRangeAt(0);
			return range.commonAncestorContainer();
		}
		return null;
	},
	get : function(doc) {
		return {
			node : hui.selection.getNode(doc),
			text : hui.selection.getText(doc)
		}
	}
}





/////////////////// Effects //////////////////////

/** @namespace */
hui.effect = {
	makeFlippable : function(options) {
		if (hui.browser.webkit) {
			hui.cls.add(options.container,'hui_flip_container');
			hui.cls.add(options.front,'hui_flip_front');
			hui.cls.add(options.back,'hui_flip_back');
		} else {
			hui.cls.add(options.front,'hui_flip_front_legacy');
			hui.cls.add(options.back,'hui_flip_back_legacy');
		}
	},
	flip : function(options) {
		if (!hui.browser.webkit) {
			hui.cls.toggle(options.element,'hui_flip_flipped_legacy');
		} else {
			var element = hui.get(options.element);
			var duration = options.duration || '1s';
			var front = hui.get.firstByClass(element,'hui_flip_front');
			var back = hui.get.firstByClass(element,'hui_flip_back');
			front.style.webkitTransitionDuration=duration;
			back.style.webkitTransitionDuration=duration;
			hui.cls.toggle(options.element,'hui_flip_flipped');
		}
	},
	/**
	 * Reveal an element using a bounce/zoom effect
	 * @param {Object} options {element:«Element»}
	 */
	bounceIn : function(options) {
		var node = options.element;
		if (hui.browser.msie) {
			hui.style.set(node,{'display':'block',visibility:'visible'});
		} else {
			hui.style.set(node,{'display':'block','opacity':0,visibility:'visible'});
			hui.animate(node,'transform','scale(0.1)',0);// rotate(10deg)
			window.setTimeout(function() {
				hui.animate(node,'opacity',1,300);
				hui.animate(node,'transform','scale(1)',400,{ease:hui.ease.backOut}); // rotate(0deg)
			});
		}
	},
	/**
	 * Fade an element in - making it visible
	 * @param {Object} options {element : «Element», duration : «milliseconds», delay : «milliseconds», onComplete : «Function» }
	 */
	fadeIn : function(options) {
		var node = options.element;
		if (hui.style.get(node,'display')=='none') {
			hui.style.set(node,{opacity : 0,display : 'inherit'});
		}
		hui.animate({
			node : node,
			css : { opacity : 1 },
			delay : options.delay || null,
			duration : options.duration || 500,
			onComplete : options.onComplete
		});
	},
	/**
	 * Fade an element out - making it invisible
	 * @param {Object} options {element : «Element», duration : «milliseconds», delay : «milliseconds», onComplete : «Function» }
	 */
	fadeOut : function(options) {
		hui.animate({
			node : options.element,
			css : { opacity : 0 },
			delay : options.delay || null,
			duration : options.duration || 500,
			hideOnComplete : true,
			onComplete : options.onComplete
		});
	},
	/**
	 * Make an element wiggle
	 * @param {Object} options {element : «Element», duration : «milliseconds» }
	 */
	wiggle : function(options) {
		var e = hui.ui.getElement(options.element);
		hui.cls.add(options.element,'hui_effect_wiggle');
		window.setTimeout(function() {
			hui.cls.remove(options.element,'hui_effect_wiggle');
		},options.duration || 1000);
	
	}
}





/////////////////// Document /////////////////////

/** @namespace */
hui.document = {
	/**
	 * Get the height of the document (including the invisble part)
	 */
	getWidth : function() {
		return Math.max(document.body.clientWidth,document.documentElement.clientWidth,document.documentElement.scrollWidth)
	},
	/**
	 * Get the width of the document (including the invisble part)
	 */
	getHeight : function() {
		if (hui.browser.msie6) {
			// In IE6 check the children too
			var max = Math.max(document.body.clientHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight);
			var children = document.body.childNodes;
			for (var i=0; i < children.length; i++) {
				if (hui.dom.isElement(children[i])) {
					max = Math.max(max,children[i].clientHeight);
				}
			}
			return max;
		}
		if (window.scrollMaxY && window.innerHeight) {
			return window.scrollMaxY+window.innerHeight;
		} else {
			return Math.max(document.body.clientHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight);
		}
	}
}








/////////////////////////////// Drag ///////////////////////////

/** @namespace */
hui.drag = {
	/** Register dragging on an element
	 * <pre><strong>options:</strong> {
	 *  element : «Element»
	 *  <em>see hui.drag.start for more options</em>
	 * }
	 * @param {Object} options The options
	 */
	register : function(options) {
		hui.listen(options.element,'mousedown',function(e) {
			hui.stop(e);
			hui.drag.start(options);
		})
	},
	/** Start dragging
	 * <pre><strong>options:</strong> {
	 *  onBeforeMove : function(event), // Called when the cursor moves for the first time
	 *  onMove : function(event), // Called when the cursor moves
	 *  onAfterMove : function(event), // Called if the cursor has moved
	 *  onEnd : function(event), // Called when the mouse is released, even if the cursor has not moved
	 * }
	 * @param {Object} options The options
	 */
	start : function(options) {
		var target = hui.browser.msie ? document : window;
		
		if (options.onStart) {
			options.onStart();
		}
		var mover,
			upper,
			moved = false;
		mover = function(e) {
			e = hui.event(e);
			e.stop(e);
			if (!moved && options.onBeforeMove) {
				options.onBeforeMove(e);
			}
			moved = true;
			options.onMove(e);
		}.bind(this);
		hui.listen(target,'mousemove',mover);
		upper = function() {
			hui.unListen(target,'mousemove',mover);
			hui.unListen(target,'mouseup',upper);
			if (options.onEnd) {
				options.onEnd();
			}
			if (moved && options.onAfterMove) {
				options.onAfterMove();
			}
			hui.drag._setSelect(true);
		}.bind(this)
		hui.listen(target,'mouseup',upper);
		hui.drag._setSelect(false);
	},
	_setSelect : function(on) {
		document.onselectstart = on ? null : function () { return false; };
		document.body.style.webkitUserSelect = on ? null : 'none';
	},
	_nativeListeners : [],
	_activeDrop : null,
	/** Listen for native drops
	 * <pre><strong>options:</strong> {
	 *  hoverClass : «String»,
	 *  onDrop : function(event),
	 *  onFiles : function(fileArray),
	 *  onURL : function(url)
	 * }
	 * @param {Object} options The options
	 */
	listen : function(options) {
		if (hui.browser.msie) {
			return;
		}
		hui.drag._nativeListeners.push(options);
		if (hui.drag._nativeListeners.length>1) {return};
		hui.listen(document.body,'dragenter',function(e) {
			var l = hui.drag._nativeListeners;
			var found = null;
			for (var i=0; i < l.length; i++) {
				var lmnt = l[i].element;
				if (hui.dom.isDescendantOrSelf(e.target,lmnt)) {
					found = l[i];
					if (hui.drag._activeDrop==null || hui.drag._activeDrop!=found) {
						hui.cls.add(lmnt,found.hoverClass);
					}
					break;
				}
			};
			if (hui.drag._activeDrop) {
				//var foundElement = found ? found.element : null;
				if (hui.drag._activeDrop!=found) {
					hui.cls.remove(hui.drag._activeDrop.element,hui.drag._activeDrop.hoverClass);
				}
			}
			hui.drag._activeDrop = found;
		});
		
		hui.listen(document.body,'dragover',function(e) {
			hui.stop(e);
		});
		hui.listen(document.body,'drop',function(e) {
			hui.stop(e);
			var options = hui.drag._activeDrop;
			hui.drag._activeDrop = null;
			if (options) {
				hui.cls.remove(options.element,options.hoverClass);
				if (options.onDrop) {
					options.onDrop(e);
				}
				//hui.log(e.dataTransfer.types)
				if (options.onFiles && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length>0) {
					options.onFiles(e.dataTransfer.files);
				}
				else if (options.onURL && hui.array.contains(e.dataTransfer.types,'public.url')) {
					var url = e.dataTransfer.getData('public.url');
					if (options.onURL && !hui.string.startsWith(url,'data:')) {
						options.onURL(url);
					}
				}
			}
		});
	}
}



//////////////////////////// Preloader /////////////////////////

/** @constructor
 * A preloader for images
 * Events: imageDidLoad(index), imageDidGiveError(index), imageDidAbort(index)
 * @param options {context:«prefix for urls»}
 */
hui.Preloader = function(options) {
	this.options = options || {};
	this.delegate = {};
	this.images = [];
	this.loaded = 0;
}

hui.Preloader.prototype = {
	/** Add images either as a single url or an array of urls */
	addImages : function(imageOrImages) {
		if (typeof(imageOrImages)=='object') {
			for (var i=0; i < imageOrImages.length; i++) {
				this.images.push(imageOrImages[i]);
			};
		} else {
			this.images.push(imageOrImages);
		}
	},
	/** Set the delegate (listener) */
	setDelegate : function(d) {
		this.delegate = d;
	},
	/**
	 * Start loading images beginning at startIndex
	 */
	load : function(startIndex) {
		startIndex = startIndex || 0;
		var self = this;
		this.obs = [];
		for (var i=startIndex; i < this.images.length+startIndex; i++) {
			var index=i;
			if (index>=this.images.length) {
				index = index-this.images.length;
			}
			var img = new Image();
			img.huiPreloaderIndex = index;
			img.onload = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidLoad')};
			img.onerror = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidGiveError')};
			img.onabort = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidAbort')};
			img.src = (this.options.context ? this.options.context : '')+this.images[index];
			this.obs.push(img);
		};
	},
	_imageChanged : function(index,method) {
		this.loaded++;
		if (this.delegate[method]) {
			this.delegate[method](this.loaded,this.images.length,index);
		}
		if (this.loaded==this.images.length && this.delegate.allImagesDidLoad) {
			this.delegate.allImagesDidLoad();
		}
	}
}




///////////////// Cookies //////////////////

/** @namespace */
hui.cookie = {
	/** Adds a cookie value by name */
	set : function(name,value,days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = name+"="+value+expires+"; path=/";
	},
	/** Gets a cookie value by name */
	get : function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return null;
	},
	/** Clears a cookie by name */
	clear : function(name) {
		this.set(name,"",-1);
	}
}






///////////////////////// Location /////////////////////

/** @namespace */
hui.location = {
	/** Get an URL parameter */
	getParameter : function(name) {
		var parms = hui.location.getParameters();
		for (var i=0; i < parms.length; i++) {
			if (parms[i].name==name) {
				return parms[i].value;
			}
		};
		return null;
	},
	/** Set an URL parameter - initiates a new request */
	setParameter : function(name,value) {
		var parms = hui.location.getParameters();
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
		hui.location.setParameters(parms);
	},
	/** Checks if the URL has a certain hash */
	hasHash : function(name) {
		var h = document.location.hash;
		if (h!=='') {
			return h=='#'+name;
		}
		return false;
	},
	/** Gets a hash parameter (#name=value&other=text) */
	getHashParameter : function(name) {
		var h = document.location.hash;
		if (h!=='') {
			var i = h.indexOf(name+'=');
			if (i!==-1) {
				var remaining = h.substring(i+name.length+1);
				if (remaining.indexOf('&')!==-1) {
					return remaining.substring(0,remaining.indexOf('&'));
				}
				return remaining;
			}
		}
		return null;
	},
	/** Clears the URL hash */
	clearHash : function() {
		document.location.hash='#';
	},
	/** Sets a number of parameters
	 * @param params Array of parameters [{name:'hep',value:'hey'}]
	 */
	setParameters : function(parms) {
		var query = '';
		for (var i=0; i < parms.length; i++) {
			query+= i==0 ? '?' : '&';
			query+=parms[i].name+'='+parms[i].value;
		};
		document.location.search=query;
	},
	/** Checks if a parameter exists with the value 'true' or 1 */
	getBoolean : function(name) {
		var value = hui.location.getParameter(name);
		return (value=='true' || value=='1');
	},
	/** Checks if a parameter exists with the value 'true' or 1 */
	getInt : function(name) {
		var value = parseInt(hui.location.getParameter(name));
		if (value!==NaN) {
			return value;
		}
		return null;
	},
	/** Gets all parameters as an array like : [{name:'hep',value:'hey'}] */
	getParameters : function() {
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
};



hui.xml = {
	transform : function(xml,xsl) {
		if (window.ActiveXObject) {
			return xml.transformNode(xsl);
		} else if (document.implementation && document.implementation.createDocument) {
			try {
			  	var pro = new XSLTProcessor();
			  	pro.importStylesheet(xsl);
			    return pro.transformToFragment(xml,document);				
			} catch (e) {
				hui.log(e);
			}
		}
	},
	parse : function(xml) {
		var doc;
		if (window.DOMParser) {
  			var parser=new DOMParser();
  			doc = parser.parseFromString(xml,"text/xml");
  		} else {
  			doc = new ActiveXObject("Microsoft.XMLDOM");
			doc.async = false;
  			doc.loadXML(xml); 
  		}
		return doc;
	}
}








if (!Function.prototype.bind) {
	Function.prototype.bind = function () {
	    if (arguments.length < 2 && arguments[0] === undefined) {
	        return this;
	    }
	    var thisObj = this,
	    args = Array.prototype.slice.call(arguments),
	    obj = args.shift();
	    return function () {
	        return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
	    };
	};

	Function.bind = function() {
	    var args = Array.prototype.slice.call(arguments);
	    return Function.prototype.bind.apply(args.shift(), args);
	}
}

if (!Function.prototype.argumentNames) {
	Function.prototype.argumentNames = function() {
		var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
			.replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
			.replace(/\s+/g, '').split(',');
		return names.length == 1 && !names[0] ? [] : names;
	}
}/////////////////////////// Animation ///////////////////////////

/**
 * Animate something
 * <pre><strong>options:</strong> {
 *  node : «Element», 
 *  css : { fontSize : '11px', color : '#f00', opacity : 0.5 }, 
 *  duration : 1000, // 1sec 
 *  ease : function(num) {},
 *  onComplete : function() {}
 *}
 * 
 * @param {Element | Object} options Options or an element
 * @param {String} style The css property
 * @param {String} value The css value
 * @param {Number} duration The duration in milisecons
 * @param {Object} deleagte The options if first param is an element
 * 
 */
hui.animate = function(options,property,value,duration,delegate) {
	if (typeof(options)=='string' || hui.dom.isElement(options)) {
		hui.animation.get(options).animate(null,value,property,duration,delegate);
	} else {
		var item = hui.animation.get(options.node);
		for (prop in options.css) {
			item.animate(null,options.css[prop],prop,options.duration,options);
		}
	}
}

/** @namespace */
hui.animation = {
	objects : {},
	running : false,
	latestId : 0,
	get : function(element) {
		element = hui.get(element);
		if (!element.huiAnimationId) {
			element.huiAnimationId = this.latestId++;
		}
		if (!this.objects[element.huiAnimationId]) {
			this.objects[element.huiAnimationId] = new hui.animation.Item(element);
		}
		return this.objects[element.huiAnimationId];
	},
	start : function() {
		if (!this.running) {
			hui.animation._render();
		}
	}
};

hui.animation._lengthUpater = function(element,v,work) {
	element.style[work.property] = (work.from+(work.to-work.from)*v)+(work.unit!=null ? work.unit : '');
}

hui.animation._transformUpater = function(element,v,work) {
	var t = work.transform;
	var str = '';
	if (t.rotate) {
		str+=' rotate('+(t.rotate.from+(t.rotate.to-t.rotate.from)*v)+t.rotate.unit+')';
	}
	if (t.scale) {
		str+=' scale('+(t.scale.from+(t.scale.to-t.scale.from)*v)+')';
	}
	element.style[hui.animation.TRANSFORM]=str;
}

hui.animation._colorUpater = function(element,v,work) {
	var red = Math.round(work.from.red+(work.to.red-work.from.red)*v);
	var green = Math.round(work.from.green+(work.to.green-work.from.green)*v);
	var blue = Math.round(work.from.blue+(work.to.blue-work.from.blue)*v);
	value = 'rgb('+red+','+green+','+blue+')';
	element.style[work.property]=value;
}

hui.animation._propertyUpater = function(element,v,work) {
	element[work.property] = Math.round(work.from+(work.to-work.from)*v);
}

hui.animation._ieOpacityUpdater = function(element,v,work) {
	var opacity = (work.from+(work.to-work.from)*v);
	if (opacity==1) {
		element.style.removeAttribute('filter');
	} else {
		element.style['filter']='alpha(opacity='+(opacity*100)+')';
	}
}

hui.animation._render = function() {
	hui.animation.running = true;
	var next = false,
		stamp = new Date().getTime();
	for (var id in hui.animation.objects) {
		var obj = hui.animation.objects[id];
		if (obj.work) {
			var element = obj.element;
			for (var i=0; i < obj.work.length; i++) {
				var work = obj.work[i];
				if (work.finished) {
					continue
				};
				var place = (stamp-work.start)/(work.end-work.start);
				if (place<0) {
					next=true;
					continue;
				}
				else if (isNaN(place) || place>1) {
					place = 1;
				}
				else if (place<1) {
					next=true;
				}
				var v = place,
					value = null;
				if (work.delegate && work.delegate.ease) {
					v = work.delegate.ease(v);
				}
				if (work.delegate && work.delegate.callback) {
					work.delegate.callback(element,v);
				} else if (work.updater) {
					work.updater(element,v,work);
				}
				if (place==1) {
					work.finished = true;
					if (work.delegate && work.delegate.onComplete) {
						window.setTimeout(work.delegate.onComplete);
					} else if (work.delegate && work.delegate.hideOnComplete) {
						element.style.display='none';
					}
				}
			};
		}
	}
	if (next) {
		window.setTimeout(hui.animation._render,0);
	} else {
		hui.animation.running = false;
	}
}

hui.animation._parseStyle = function(value) {
	var parsed = {type:null,value:null,unit:null};
	var match;
	if (!hui.isDefined(value)) {
		return parsed;
	} else if (!isNaN(value)) {
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
		var color = new hui.Color(value);
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

///////////////////////////// Item ///////////////////////////////

hui.animation.Item = function(element) {
	this.element = element;
	this.work = [];
}

hui.animation.Item.prototype.animate = function(from,to,property,duration,delegate) {
	var work = this.getWork(hui.string.camelize(property));
	work.delegate = delegate;
	work.finished = false;
	var css = !(property=='scrollLeft' || property=='scrollTop');
	if (from!==null) {
		work.from = from;
	} else if (property=='transform') {
		work.transform = hui.animation.Item.parseTransform(to,this.element);
	} else if (!hui.browser.opacity && property=='opacity') {
		work.from = this._getIEOpacity(this.element);
	} else if (css) {
		var style = hui.style.get(this.element,property);
		var parsedStyle = hui.animation._parseStyle(style);
		work.from = parsedStyle.value;
	} else {
		work.from = this.element[property];
	}
	if (css) {
		var parsed = hui.animation._parseStyle(to);
		work.to = parsed.value;
		work.unit = parsed.unit;
		if (!hui.browser.opacity && property=='opacity') {
			work.updater = hui.animation._ieOpacityUpdater;
		} else if (property=='transform') {
			work.updater = hui.browser.msie ? function() {} : hui.animation._transformUpater;
		} else if (parsed.value.red===undefined) {
			work.updater = hui.animation._lengthUpater;
		} else {
			work.updater = hui.animation._colorUpater;
		}
	} else {
		work.to = to;
		work.unit = null;
		work.updater = hui.animation._propertyUpater;
	}
	work.start = new Date().getTime();
	if (delegate && delegate.delay) {
		work.start+=delegate.delay;
	}
	work.end = work.start+duration;
	hui.animation.start();
}

hui.animation.TRANSFORM = hui.browser.gecko ? 'MozTransform' : 'WebkitTransform';

hui.animation.Item.parseTransform = function(value,element) {
	var result = {};
	var from,fromMatch;
	var rotateReg = /rotate\(([0-9\.]+)([a-z]+)\)/i;
	var rotate = value.match(rotateReg);
	if (rotate) {
		from = 0;
		if (element.style[hui.animation.TRANSFORM]) {
			fromMatch = element.style[hui.animation.TRANSFORM].match(rotateReg);
			if (fromMatch) {
				from = parseFloat(fromMatch[1]);
			}
		}
		result.rotate = {from:from,to:parseFloat(rotate[1]),unit:rotate[2]};
	}
	var scaleReg = /scale\(([0-9\.]+)\)/i;
	var scale = value.match(scaleReg);
	if (scale) {
		from = 1;
		if (element.style[hui.animation.TRANSFORM]) {
			fromMatch = element.style[hui.animation.TRANSFORM].match(scaleReg);
			if (fromMatch) {
				from = parseFloat(fromMatch[1]);
			}
		}
		result.scale = {from:from,to:parseFloat(scale[1])};
	}
	
	return result;
}

hui.animation.Item.prototype._getIEOpacity = function(element) {
	var filter = hui.style.get(element,'filter').toLowerCase();
	var match;
	if (match = filter.match(/opacity=([0-9]+)/)) {
		return parseFloat(match[1])/100;
	} else {
		return 1;
	}
}

hui.animation.Item.prototype.getWork = function(property) {
	for (var i = this.work.length - 1; i >= 0; i--) {
		if (this.work[i].property===property) {
			return this.work[i];
		}
	};
	var work = {property:property};
	this.work[this.work.length] = work;
	return work;
}

/////////////////////////////// Loop ///////////////////////////////////

/** @constructor */
hui.animation.Loop = function(recipe) {
	this.recipe = recipe;
	this.position = -1;
	this.running = false;
}

hui.animation.Loop.prototype.next = function() {
	this.position++;
	if (this.position>=this.recipe.length) {
		this.position = 0;
	}
	var item = this.recipe[this.position];
	if (typeof(item)=='function') {
		item();
	} else if (item.element) {
		hui.animate(item.element,item.property,item.value,item.duration,{ease:item.ease});
	}
	var self = this;
	var time = item.duration || 0;
	if (item.wait!==undefined) {
		time = item.wait;
	}
	window.setTimeout(function() {self.next()},time);
}

hui.animation.Loop.prototype.start = function() {
	this.running=true;
	this.next();
}

/** @namespace */
hui.ease = {
	slowFastSlow : function(val) {
		var a = 1.6;
		var b = 1.4;
		return -1*Math.pow(Math.cos((Math.PI/2)*Math.pow(val,a)),Math.pow(Math.PI,b))+1;
	},
	fastSlow : function(val) {
		var a = .5;
		var b = .7
		return -1*Math.pow(Math.cos((Math.PI/2)*Math.pow(val,a)),Math.pow(Math.PI,b))+1;
	},
	elastic : function(t) {
		return 1 - hui.ease.elastic2(1-t);
	},

	elastic2 : function (t, a, p) {
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
	},
	bounce : function(t) {
		if (t < (1/2.75)) {
			return 7.5625*t*t;
		} else if (t < (2/2.75)) {
			return (7.5625*(t-=(1.5/2.75))*t + .75);
		} else if (t < (2.5/2.75)) {
			return (7.5625*(t-=(2.25/2.75))*t + .9375);
		} else {
			return (7.5625*(t-=(2.625/2.75))*t + .984375);
		}
	},
	flicker : function(value) {
		if (value==1) return 1;
		return Math.random()*value;
	},
	
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
		return (1 - hui.ease.bounceOut(1-n)); // Decimal
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
		if(n<0.5){ return hui.ease.bounceIn(n*2) / 2; }
		return (hui.ease.bounceOut(n*2-1) / 2) + 0.5; // Decimal
	}
};



/** @constructor
 * @param str The color like red or rgb(255, 0, 0) or #ff0000 or rgb(100%, 0%, 0%)
 */
hui.Color = function(str) {
    this.ok = false;
	if (hui.isBlank(str)) {
		return;
	}
    // strip any leading #
    if (str.charAt(0) == '#') { // remove # if any
        str = str.substr(1,6);
    }

    str = str.replace(/ /g,'');
    str = str.toLowerCase();
		
    for (var key in hui.Color.table) {
        if (str == key) {
            str = hui.Color.table[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^rgb\((\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%\)$/	,
            process: function (bits){
                return [
                    Math.round(parseInt(bits[1])/100*255),
                    Math.round(parseInt(bits[2])/100*255),
                    Math.round(parseInt(bits[3])/100*255)
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
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
        var re = color_defs[i].re,
			processor = color_defs[i].process,
			bits = re.exec(str);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
			break;
        }
    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
}

hui.Color.prototype = {
	/** Get the color as rgb(255,0,0) */
	toRGB : function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    },
	/** Get the color as #ff0000 */
	toHex : function() {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) {
			r = '0' + r;
		}
        if (g.length == 1) {
			g = '0' + g;
		}
        if (b.length == 1) {
			b = '0' + b;
		}
        return '#' + r + g + b;
	}
}

hui.Color.table = {
	white : 'ffffff',
	black : '000000',
	red : 'ff0000',
	green : '00ff00',
	blue : '0000ff'
}

hui.Color.hex2rgb = function(hex) {
	if (hui.isBlank(hex)) {
		return null;
	}
	if (hex[0]=="#") {
		hex=hex.substr(1);
	}
	if (hex.length==3) {
		var temp=hex;
		hex='';
		temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
		for (var i=0;i<3;i++) {
			hex+=temp[i]+temp[i];
		}
	}
	var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
	return {
		r:   parseInt(triplets[0],16),
		g: parseInt(triplets[1],16),
		b:  parseInt(triplets[2],16)
	}
}

hui.Color.hsv2rgb = function (Hdeg,S,V) {
  	var H = Hdeg/360,R,G,B;     // convert from degrees to 0 to 1
  	if (S==0) {       // HSV values = From 0 to 1
		R = V*255;     // RGB results = From 0 to 255
		G = V*255;
		B = V*255;
	} else {
    	var h = H*6,
			var_r,var_g,var_b;
    	var i = Math.floor( h );
    	var var_1 = V*(1-S);
    	var var_2 = V*(1-S*(h-i));
    	var var_3 = V*(1-S*(1-(h-i)));
    	if (i==0) {
			var_r=V ;
			var_g=var_3;
			var_b=var_1
		}
    	else if (i==1) {
			var_r=var_2;
			var_g=V;
			var_b=var_1
		}
    	else if (i==2) {var_r=var_1; var_g=V;     var_b=var_3}
    	else if (i==3) {var_r=var_1; var_g=var_2; var_b=V}
    	else if (i==4) {var_r=var_3; var_g=var_1; var_b=V}
    	else {var_r=V;     var_g=var_1; var_b=var_2}
    	R = Math.round(var_r*255);   //RGB results = From 0 to 255
    	G = Math.round(var_g*255);
    	B = Math.round(var_b*255);
  	}
  	return new Array(R,G,B);
}

hui.Color.rgb2hsv = function(r, g, b) {

    r = (r / 255);
    g = (g / 255);
	b = (b / 255);	

    var min = Math.min(Math.min(r, g), b),
        max = Math.max(Math.max(r, g), b),
		value = max,
        saturation,
        hue;

    // Hue
    if (max == min) {
        hue = 0;
    } else if (max == r) {
        hue = (60 * ((g-b) / (max-min))) % 360;
    } else if (max == g) {
        hue = 60 * ((b-r) / (max-min)) + 120;
    } else if (max == b) {
        hue = 60 * ((r-g) / (max-min)) + 240;
    }

    if (hue < 0) {
        hue += 360;
    }

    // Saturation
    if (max == 0) {
        saturation = 0;
    } else {
        saturation = 1 - (min/max);
    }

    return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];
}

hui.Color.rgb2hex = function(rgbary) {
	var c = '#';
  	for (var i=0; i < 3; i++) {
		var str = parseInt(rgbary[i]).toString(16);
    	if (str.length < 2) {
			str = '0'+str;
		}
		c+=str;
  	}
  	return c;
}

/*!
  * $script.js v1.3
  * https://github.com/ded/script.js
  * Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
  * Follow our software http://twitter.com/dedfat
  * License: MIT
  */
!function(win, doc, timeout) {
  var head = doc.getElementsByTagName('head')[0],
      list = {}, ids = {}, delay = {},
      scripts = {}, s = 'string', f = false,
      push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState',
      addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange',
      every = function(ar, fn) {
        for (var i = 0, j = ar.length; i < j; ++i) {
          if (!fn(ar[i])) {
            return f;
          }
        }
        return 1;
      };
      function each(ar, fn) {
        every(ar, function(el) {
          return !fn(el);
        });
      }

  if (!doc[readyState] && doc[addEventListener]) {
    doc[addEventListener](domContentLoaded, function fn() {
      doc.removeEventListener(domContentLoaded, fn, f);
      doc[readyState] = "complete";
    }, f);
    doc[readyState] = "loading";
  }

  var $script = function(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths];
    var idOrDoneIsDone = idOrDone && idOrDone.call,
        done = idOrDoneIsDone ? idOrDone : optDone,
        id = idOrDoneIsDone ? paths.join('') : idOrDone,
        queue = paths.length;
        function loopFn(item) {
          return item.call ? item() : list[item];
        }
        function callback() {
          if (!--queue) {
            list[id] = 1;
            done && done();
            for (var dset in delay) {
              every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = []);
            }
          }
        }
    timeout(function() {
      each(paths, function(path) {
        if (scripts[path]) {
          id && (ids[id] = 1);
          callback();
          return;
        }
        scripts[path] = 1;
        id && (ids[id] = 1);
        create($script.path ?
          $script.path + path + '.js' :
          path, callback);
      });
    }, 0);
    return $script;
  };

  function create(path, fn) {
    var el = doc.createElement("script"),
        loaded = f;
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) {
        return;
      }
      el.onload = el[onreadystatechange] = null;
      loaded = 1;
      fn();
    };
    el.async = 1;
    el.src = path;
    head.insertBefore(el, head.firstChild);
  }

  $script.get = create;

  $script.ready = function(deps, ready, req) {
    deps = deps[push] ? deps : [deps];
    var missing = [];
    !each(deps, function(dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function(dep) {
      return list[dep];
    }) ? ready() : !function(key) {
      delay[key] = delay[key] || [];
      delay[key][push](ready);
      req && req(missing);
    }(deps.join('|'));
    return $script;
  };

  var old = win.$script;
  $script.noConflict = function () {
    win.$script = old;
    return this;
  };

  (typeof module !== 'undefined' && module.exports) ?
    (module.exports = $script) :
    (win.hui.require = $script);
}(this, document, setTimeout);
/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz�n and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */


/* ******************* */
/* Constructor & Init  */
/* ******************* */

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
SWFUpload.version = "2.2.0 Alpha";
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
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE  : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
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
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("prevent_swf_caching", true);
	
	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", null);
	
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
	
	this.ensureDefault("debug_handler", function(msg) {hui.log(msg)});

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	// Update the flash url if needed
	if (this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + "?swfuploadrnd=" + Math.floor(Math.random() * 999999999);
	}
	
	delete this.ensureDefault;
};

SWFUpload.prototype.loadFlash = function () {
	if (this.settings.button_placeholder_id !== "") {
		this.replaceWithFlash();
	} else {
		this.appendFlash();
	}
};

// Private: appendFlash gets the HTML tag for the Flash
// It then appends the flash to the body
SWFUpload.prototype.appendFlash = function () {
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
	container.style.width = "1px";
	container.style.height = "1px";
	container.style.overflow = "hidden";

	targetElement.appendChild(container);
	container.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
};

// Private: replaceWithFlash replaces the button_placeholder element with the flash movie.
SWFUpload.prototype.replaceWithFlash = function () {
	var targetElement, tempParent;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}
	// Get the element where we will be placing the flash movie
	targetElement = this.settings.button_placeholder || document.getElementById(this.settings.button_placeholder_id);

	if (targetElement == undefined) {
		throw "Could not find the placeholder element.";
	}

	// Append the container and load the flash
	tempParent = document.createElement("div");
	tempParent.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
	var transparent = this.settings.button_image_url === "" ? true : false;
	
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
				'<param name="wmode" value="', transparent ? "transparent" : "window", '" />',
				'<param name="movie" value="', this.settings.flash_url, '" />',
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
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			"&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
			"&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
			"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
			"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
			"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			"&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
			"&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
			"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
			"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
			"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled)
		].join("");
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

	return paramStringPairs.join("&amp;");
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
		
		if (movieElement != undefined && movieElement.parentNode != undefined && typeof movieElement.parentNode.removeChild === "function") {
			var container = movieElement.parentNode;
			if (container != undefined) {
				container.removeChild(movieElement);
				if (container.parentNode != undefined && typeof container.parentNode.removeChild === "function") {
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
		
		delete window[this.movieName];
		
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
			"\t", "upload_url:               ", this.settings.upload_url, "\n",
			"\t", "flash_url:                ", this.settings.flash_url, "\n",
			"\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
			"\t", "file_post_name:           ", this.settings.file_post_name, "\n",
			"\t", "post_params:              ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:               ", this.settings.file_types, "\n",
			"\t", "file_types_description:   ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
			"\t", "debug:                    ", this.settings.debug.toString(), "\n",

			"\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

			"\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
			"\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
			"\t", "button_width:             ", this.settings.button_width.toString(), "\n",
			"\t", "button_height:            ", this.settings.button_height.toString(), "\n",
			"\t", "button_text:              ", this.settings.button_text.toString(), "\n",
			"\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
			"\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
			"\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
			"\t", "button_action:            ", this.settings.button_action.toString(), "\n",
			"\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

			"\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"
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
	
	var movieElement = this.getMovieElement();
	var returnValue;

	if (typeof movieElement[functionName] === "function") {
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
		if (returnValue != undefined && typeof returnValue.post === "object") {
			returnValue = this.unescapeFilePostParams(returnValue);
		}
		
		return returnValue;
	} else {
		throw "Invalid function name: " + functionName;
	}
};


/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected. WARNING: this function does not work in Flash Player 10
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.  WARNING: this function does not work in Flash Player 10
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

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function (buttonImageURL) {
	if (buttonImageURL == undefined) {
		buttonImageURL = "";
	}
	
	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function (width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;
	
	var movie = this.getMovieElement();
	if (movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}
	
	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function (html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text overlay
SWFUpload.prototype.setButtonTextPadding = function (left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function (css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function (isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function (buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
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
	if (typeof this.settings[handlerName] === "function") {
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

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
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
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
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
	if (typeof movieElement.StartUpload !== "function") {
		throw "ExternalInterface methods failed to initialize.";
	}

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = movieElement;
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
	if (typeof this.settings.upload_start_handler === "function") {
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
	hui.log(message);
};
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
            code += "'" + Date.escape(ch) + "' + ";
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
        return "Date.leftPad(this.getDate(), 2, '0') + ";
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
        return "Date.leftPad(this.getMonth() + 1, 2, '0') + ";
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
        return "Date.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case "H":
        return "Date.leftPad(this.getHours(), 2, '0') + ";
    case "i":
        return "Date.leftPad(this.getMinutes(), 2, '0') + ";
    case "s":
        return "Date.leftPad(this.getSeconds(), 2, '0') + ";
    case "O":
        return "this.getGMTOffset() + ";
    case "T":
        return "this.getTimezone() + ";
    case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
    default:
        return "'" + Date.escape(character) + "' + ";
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
            regex += Date.escape(ch);
        }
        else {
            var obj = Date.formatCodeToRegex(ch, currentGroup);
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
            s:Date.escape(character)};
    }
}

Date.prototype.getTimezone = function() {
    return this.toString().replace(
        /^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(
        /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
}

Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
        + Date.leftPad(Math.floor(this.getTimezoneOffset() / 60), 2, "0")
        + Date.leftPad(this.getTimezoneOffset() % 60, 2, "0");
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
    return parseInt(Date.leftPad(((now - then) / 7) + 1, 2, "0"));
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

Date.escape = function(string) {
    return string.replace(/('|\\)/g, "\\$1");
}

Date.leftPad = function (val, size, ch) {
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
/**
  The namespace of the HUI framework
  @namespace
 */
hui.ui = {
	domReady : false,
	context : '',
	language : 'en',

	layoutWidgets : [],
	objects : [],
	delegates : [],

	state : 'default',

	latestObjectIndex : 0,
	latestIndex : 500,
	latestPanelIndex : 1000,
	latestAlertIndex : 1500,
	latestTopIndex : 2000,
	toolTips : {},
	confirmOverlays : {},
	
	delayedUntilReady : [],
	
	texts : {
		request_error : {en:'An error occurred on the server',da:'Der skete en fejl på serveren'},
		'continue' : {en:'Continue',da:'Fortsæt'},
		reload_page : {en:'Reload page',da:'Indæs siden igen'},
		access_denied : {en:'Access denied, maybe you are nolonger logged in',da:'Adgang nægtet, du er måske ikke længere logget ind'}
	}
}

hui.onReady(function() {
	if (window.dwr && window.dwr.engine && window.dwr.engine.setErrorHandler) {
		window.dwr.engine.setErrorHandler(function(msg,e) {
			hui.log(msg);
			hui.log(e);
		});
	}
	hui.ui.callSuperDelegates(this,'ready');
	hui.listen(window,'resize',hui.ui._resize);
	hui.ui._resize();
	hui.ui.domReady = true;
	if (window.parent && window.parent.hui && window.parent.hui.ui) {
		window.parent.hui.ui._frameLoaded(window);
	}
	for (var i=0; i < hui.ui.delayedUntilReady.length; i++) {
		hui.ui.delayedUntilReady[i]();
	};
});

/**
 * Get a widget by name
 * @param nameOrWidget {Widget | String} Get a widget by name, if the parameter is already a widget it is returned
 * @return {Widget} The widget with the name or null
 */
hui.ui.get = function(nameOrWidget) {
	if (nameOrWidget) {
		if (nameOrWidget.element) {
			return nameOrWidget;
		}
		return hui.ui.objects[nameOrWidget];
	}
	return null;
};

/**
 * Get a localized text, defaults to english or the key
 * @param {String} key The key of the text
 * @returns {String} The localized string
 */
hui.ui.getText = function(key) {
	var x = this.texts[key];
	if (!x) {return key}
	if (x[this.language]) {
		return x[this.language];
	} else {
		return x['en'];
	}
}

/**
 * Called when the DOM is ready and hui.ui is ready
 */
hui.ui.onReady = function(func) {
	if (hui.ui.domReady) {return func();}
	if (hui.browser.gecko && hui.string.endsWith(document.baseURI,'xml')) {
		window.setTimeout(func,1000);
		return;
	}
	hui.ui.delayedUntilReady.push(func);
};

hui.ui._frameLoaded = function(win) {
	hui.ui.callSuperDelegates(this,'frameLoaded',win);
}

/** @private */
hui.ui._resize = function() {
	for (var i = hui.ui.layoutWidgets.length - 1; i >= 0; i--) {
		hui.ui.layoutWidgets[i]['$$resize']();
	};
}

/**
 * Show a confirming overlay
 * <pre><strong>options:</strong> {
 *  element : «Element», // the element to show at
 *  widget : «Widget», // the widget to show at
 *  text : «String», // the text message
 *  okText : «String», // text of OK button
 *  cancelText «String», // text of cancel button
 *  onOk: «Function» // called when user clicks the OK button
 * }
 * </pre>
 * @param options {Object} The options
 */
hui.ui.confirmOverlay = function(options) {
	var node = options.element,
		overlay;
	if (!node) {
		node = document.body;
	}
	if (options.widget) {
		node = options.widget.getElement();
	}
	if (hui.ui.confirmOverlays[node]) {
		overlay = hui.ui.confirmOverlays[node];
		overlay.clear();
	} else {
		overlay = hui.ui.Overlay.create({modal:true});
		hui.ui.confirmOverlays[node] = overlay;
	}
	if (options.text) {
		overlay.addText(options.text);
	}
	var ok = hui.ui.Button.create({text:options.okText || 'OK',highlighted:'true'});
	ok.click(function() {
		if (options.onOk) {
			options.onOk();
		}
		overlay.hide();
	});
	overlay.add(ok);
	var cancel = hui.ui.Button.create({text:options.cancelText || 'Cancel'});
	cancel.onClick(function() {
		overlay.hide();
	});
	overlay.add(cancel);
	overlay.show({element:node});
}

/**
 * Unregisters a widget
 * @param widget {Widget} The widget to destroy 
 */
hui.ui.destroy = function(widget) {
	var objects = hui.ui.objects;
	delete(objects[widget.name]);
}

hui.ui.destroyDescendants = function(element) {
	var desc = hui.ui.getDescendants(element);
	var objects = hui.ui.objects;
	for (var i=0; i < desc.length; i++) {
		var obj  = delete(objects[desc[i].name]);
		if (!obj) {
			hui.log('not found: '+desc[i].name);
		}
	};
}

/** Gets all ancestors of a widget
	@param {Widget} widget A widget
	@returns {Array} An array of all ancestors
*/
hui.ui.getAncestors = function(widget) {
	var desc = [];
	var e = widget.element;
	if (e) {
		var a = hui.get.ancestors(e);
		var o = [];
		for (var key in hui.ui.objects) {
			o.push(hui.ui.objects[key]);
		}
		for (var i=0; i < a.length; i++) {
			for (var j=0; j < o.length; j++) {
				if (o[j].element==a[i]) {
					desc.push(o[j]);
				}
			}
		}
	}
	return desc;
}

hui.ui.getDescendants = function(widgetOrElement) {
	var desc = [],e = widgetOrElement.getElement ? widgetOrElement.getElement() : widgetOrElement;
	if (e) {
		var d = e.getElementsByTagName('*');
		var o = [];
		for (var key in hui.ui.objects) {
			o.push(hui.ui.objects[key]);
		}
		for (var i=0; i < d.length; i++) {
			for (var j=0; j < o.length; j++) {
				if (d[i]==o[j].element) {
					desc.push(o[j]);
				}
			};
			
		};
	}
	return desc;
}

hui.ui.getAncestor = function(widget,cls) {
	var a = hui.ui.getAncestors(widget);
	for (var i=0; i < a.length; i++) {
		if (hui.cls.has(a[i].getElement(),cls)) {
			return a[i];
		}
	};
	return null;
}



hui.ui.changeState = function(state) {
	if (hui.ui.state===state) {return;}
	var all = hui.ui.objects,
		key,obj;
	for (key in all) {
		obj = all[key];
		if (obj.options && obj.options.state) {
			if (obj.options.state==state) {
				obj.show();
			} else {
				obj.hide();
			}
		}
	}
	hui.ui.state=state;
	
	this.reLayout();
}

hui.ui.reLayout = function() {
	var all = hui.ui.objects,
		obj;
	for (key in all) {
		obj = all[key];
		if (obj['$$layout']) {
			obj['$$layout']();
		}
	}
}

//////////////////////////////// Widget //////////////////////////////

hui.ui.Widget = function() {
	
}

hui.ui.Widget.prototype = {
	_init : function(options) {
		this.options = options;
		this.name = options.name;
		this.element = hui.get(options.element);
	},
	hide : function() {
		this.element.style.display = 'none';
	},
	show : function() {
		this.element.style.display = '';
	}
}

///////////////////////////////// Indexes /////////////////////////////

hui.ui.nextIndex = function() {
	hui.ui.latestIndex++;
	return 	hui.ui.latestIndex;
};

hui.ui.nextPanelIndex = function() {
	hui.ui.latestPanelIndex++;
	return 	hui.ui.latestPanelIndex;
};

hui.ui.nextAlertIndex = function() {
	hui.ui.latestAlertIndex++;
	return 	hui.ui.latestAlertIndex;
};

hui.ui.nextTopIndex = function() {
	hui.ui.latestTopIndex++;
	return 	hui.ui.latestTopIndex;
};

///////////////////////////////// Curtain /////////////////////////////

/**
 * Shows a "curtain" behind an element
 * @param options { widget:«widget», color:«cssColor | 'auto'», zIndex:«cssZindex» }
 */
hui.ui.showCurtain = function(options) {
	var widget = options.widget;
	if (!widget.curtain) {
		widget.curtain = hui.build('div',{'class':'hui_curtain',style:'z-index:none'});
		
		var body = hui.get.firstByClass(document.body,'hui_body');
		if (!body) {
			body=document.body;
		}
		body.appendChild(widget.curtain);
		hui.listen(widget.curtain,'click',function() {
			if (widget['$curtainWasClicked']) {
				widget['$curtainWasClicked']();
			}
		});
	}
	if (options.color) {
		if (options.color=='auto') {
			var color = hui.style.get(document.body,'background-color');
			if (color=='transparent' || color=='rgba(0, 0, 0, 0)') {
				color='#fff';
			}
			widget.curtain.style.backgroundColor=color;
		} else {
			widget.curtain.style.backgroundColor=options.color;
		}
	}
	if (hui.browser.msie) {
		widget.curtain.style.height=hui.document.getHeight()+'px';
	} else {
		widget.curtain.style.position='fixed';
		widget.curtain.style.top='0';
		widget.curtain.style.left='0';
		widget.curtain.style.bottom='0';
		widget.curtain.style.right='0';
	}
	widget.curtain.style.zIndex=options.zIndex;
	hui.style.setOpacity(widget.curtain,0);
	widget.curtain.style.display='block';
	hui.animate(widget.curtain,'opacity',0.7,1000,{ease:hui.ease.slowFastSlow});
}

hui.ui.hideCurtain = function(widget) {
	if (widget.curtain) {
		hui.animate(widget.curtain,'opacity',0,200,{hideOnComplete:true});
	}
};

//////////////////////////////// Message //////////////////////////////

hui.ui.confirm = function(options) {
	if (!options.name) {
		options.name = 'huiConfirm';
	}
	var alert = hui.ui.get(options.name);
	var ok;
	if (!alert) {
		alert = hui.ui.Alert.create(options);
		var cancel = hui.ui.Button.create({name:name+'_cancel',text : options.cancel || 'Cancel',highlighted:options.highlighted==='cancel'});
		cancel.listen({$click:function(){
			alert.hide();
			if (options.onCancel) {
				options.onCancel();
			}
			hui.ui.callDelegates(alert,'cancel');
		}});
		alert.addButton(cancel);
	
		ok = hui.ui.Button.create({name:name+'_ok',text : options.ok || 'OK',highlighted:options.highlighted==='ok'});
		alert.addButton(ok);
	} else {
		alert.update(options);
		ok = hui.ui.get(name+'_ok');
		ok.setText(options.ok || 'OK');
		ok.setHighlighted(options.highlighted=='ok');
		ok.clearDelegates();
		hui.ui.get(name+'_cancel').setText(options.ok || 'Cancel');
		hui.ui.get(name+'_cancel').setHighlighted(options.highlighted=='cancel');
		if (options.cancel) {hui.ui.get(name+'_cancel').setText(options.cancel);}
	}
	ok.listen({$click:function(){
		alert.hide();
		if (options.onOK) {
			options.onOK();
		}
		hui.ui.callDelegates(alert,'ok');
	}});
	alert.show();
}

hui.ui.alert = function(options) {
	if (!this.alertBox) {
		this.alertBox = hui.ui.Alert.create(options);
		this.alertBoxButton = hui.ui.Button.create({name:'huiAlertBoxButton',text : 'OK'});
		this.alertBoxButton.listen({
			$click$huiAlertBoxButton : function() {
				hui.ui.alertBox.hide();
				if (hui.ui.alertBoxCallBack) {
					hui.ui.alertBoxCallBack();
					hui.ui.alertBoxCallBack = null;
				}
			}
		});
		this.alertBox.addButton(this.alertBoxButton);
	} else {
		this.alertBox.update(options);
	}
	this.alertBoxCallBack = options.onOK;
	this.alertBoxButton.setText(options.button ? options.button : 'OK');
	this.alertBox.show();
};

hui.ui.showMessage = function(options) {
	if (typeof(options)=='string') {
		// TODO: Backwards compatibility
		options={text:options};
	}
	if (options.delay) {
		hui.ui.messageDelayTimer = window.setTimeout(function() {
			options.delay=null;
			hui.ui.showMessage(options);
		},options.delay);
		return;
	}
	window.clearTimeout(hui.ui.messageDelayTimer);
	if (!hui.ui.message) {
		hui.ui.message = hui.build('div',{'class':'hui_message',html:'<div><div></div></div>'});
		if (!hui.browser.msie) {
			hui.style.setOpacity(hui.ui.message,0);
		}
		document.body.appendChild(hui.ui.message);
	}
	var inner = hui.ui.message.getElementsByTagName('div')[1];
	if (options.icon) {
		hui.dom.clear(inner);
		inner.appendChild(hui.ui.createIcon(options.icon,24));
		hui.dom.addText(inner,options.text);
	}
	else if (options.busy) {
		inner.innerHTML='<span class="hui_message_busy"></span>';
		hui.dom.addText(inner,options.text);
	} else {
		hui.dom.setText(inner,options.text);
	}
	hui.ui.message.style.display = 'block';
	hui.ui.message.style.zIndex = hui.ui.nextTopIndex();
	hui.ui.message.style.marginLeft = (hui.ui.message.clientWidth/-2)+'px';
	hui.ui.message.style.marginTop = hui.window.getScrollTop()+'px';
	if (hui.browser.opacity) {
		hui.animate(hui.ui.message,'opacity',1,300);
	}
	window.clearTimeout(hui.ui.messageTimer);
	if (options.duration) {
		hui.ui.messageTimer = window.setTimeout(hui.ui.hideMessage,options.duration);
	}
};

hui.ui.hideMessage = function() {
	window.clearTimeout(hui.ui.messageDelayTimer);
	if (hui.ui.message) {
		if (hui.browser.opacity) {
			hui.animate(hui.ui.message,'opacity',0,300,{hideOnComplete:true});
		} else {
			hui.ui.message.style.display='none';
		}
	}
};

hui.ui.showToolTip = function(options) {
	var key = options.key || 'common';
	var t = hui.ui.toolTips[key];
	if (!t) {
		t = hui.build('div',{'class':'hui_tooltip',style:'display:none;',html:'<div><div></div></div>',parent:document.body});
		hui.ui.toolTips[key] = t;
	}
	t.onclick = function() {hui.ui.hideToolTip(options);};
	var n = hui.get(options.element);
	var pos = hui.position.get(n);
	hui.dom.setText(t.getElementsByTagName('div')[1],options.text);
	if (t.style.display=='none' && hui.browser.opacity) {
		hui.style.setOpacity(t,0);
	}
	hui.style.set(t,{'display':'block',zIndex:hui.ui.nextTopIndex()});
	hui.style.set(t,{left:(pos.left-t.clientWidth+4)+'px',top:(pos.top+2-(t.clientHeight/2)+(n.clientHeight/2))+'px'});
	if (hui.browser.opacity) {
		hui.animate(t,'opacity',1,300);
	}
};

hui.ui.hideToolTip = function(options) {
	var key = options ? options.key || 'common' : 'common';
	var t = hui.ui.toolTips[key];
	if (t) {
		if (!hui.browser.msie) {
			hui.animate(t,'opacity',0,300,{hideOnComplete:true});
		} else {
			t.style.display = 'none';
		}
	}
};

/////////////////////////////// Utilities /////////////////////////////

/**
 * Get the element of a widget if not already an element
 * @param widgetOrElement {Widget | Element} The widget to get the element for
 * @returns {Element} The element or null
 */
hui.ui.getElement = function(widgetOrElement) {
	if (hui.dom.isElement(widgetOrElement)) {
		return widgetOrElement;
	} else if (widgetOrElement.getElement) {
		return widgetOrElement.getElement();
	}
	return null;
}

hui.ui.isWithin = function(e,element) {
	e = new hui.Event(e);
	var offset = {left:hui.position.getLeft(element),top:hui.position.getTop(element)};
	var dims = {width:element.clientWidth,height:element.clientHeight};
	return e.getLeft()>offset.left && e.getLeft()<offset.left+dims.width && e.getTop()>offset.top && e.getTop()<offset.top+dims.height;
};

hui.ui.getIconUrl = function(icon,size) {
	return hui.ui.context+'/hui/icons/'+icon+size+'.png';
};

hui.ui.createIcon = function(icon,size) {
	return hui.build('span',{'class':'hui_icon hui_icon_'+size,style:'background-image: url('+hui.ui.getIconUrl(icon,size)+')'});
};

hui.ui.wrapInField = function(element) {
	var w = hui.build('div',{'class':'hui_field',html:
		'<span class="hui_field_top"><span><span></span></span></span>'+
		'<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content"></span></span></span>'+
		'<span class="hui_field_bottom"><span><span></span></span></span>'
	});
	hui.get.firstByClass(w,'hui_field_content').appendChild(element);
	return w;
};

/**
 * Add focus class to an element
 * @param options {Object} {element : «Element», class : «String»}
 */
hui.ui.addFocusClass = function(o) {
	var ce = o.classElement || o.element, c = o['class'];
	hui.listen(o.element,'focus',function() {
		hui.cls.add(ce,c);
	});
	hui.listen(o.element,'blur',function() {
		hui.cls.remove(ce,c);
	});
};

/**
 * Make a widget draw attention to itself
 * @param widget {Widget} The widget to stress
 */
hui.ui.stress = function(widget) {
	var e = hui.ui.getElement(widget);
	hui.effect.wiggle({element:e,duration:1000});
}


/////////////////////////////// Validation /////////////////////////////

/** @constructor */
hui.ui.NumberValidator = function(options) {
	hui.override({allowNull:false,min:0,max:10},options)
	this.min = options.min;
	this.max = options.max;
	this.allowNull = options.allowNull;
	this.middle = Math.max(Math.min(this.max,0),this.min);
}

hui.ui.NumberValidator.prototype = {
	validate : function(value) {
		if (hui.isBlank(value) && this.allowNull) {
			return {valid:true,value:null};
		}
		var number = parseFloat(value);
		if (isNaN(number)) {
			return {valid:false,value:this.middle};
		} else if (number<this.min) {
			return {valid:false,value:this.min};
		} else if (number>this.max) {
			return {valid:false,value:this.max};
		}
		return {valid:true,value:number};
	}
}

//////////////////////////// Positioning /////////////////////////////

hui.ui.positionAtElement = function(element,target,options) {
	options = options || {};
	element = hui.get(element);
	target = hui.get(target);
	var origDisplay = hui.style.get(element,'display');
	if (origDisplay=='none') {
		hui.style.set(element,{'visibility':'hidden','display':'block'});
	}
	var left = hui.position.getLeft(target),
		top = hui.position.getTop(target);
	var vert=options.vertical || null;
	if (options.horizontal && options.horizontal=='right') {
		left = left+target.clientWidth-element.clientWidth;
	}
	if (vert=='topOutside') {
		top = top-element.clientHeight;
	} else if (vert=='bottomOutside') {
		top = top+target.clientHeight;
	}
	left+=(options.left || 0);
	top+=(options.top || 0);
	hui.style.set(element,{'left':left+'px','top':top+'px'});
	if (origDisplay=='none') {
		hui.style.set(element,{'visibility':'visible','display':'none'});
	}
};

hui.ui.getTextAreaHeight = function(input) {
	var t = this.textAreaDummy;
	if (!t) {
		t = this.textAreaDummy = document.createElement('div');
		t.className='hui_textarea_dummy';
		document.body.appendChild(t);
	}
	var html = input.value;
	if (html[html.length-1]==='\n') {
		html+='x';
	}
	html = hui.string.escape(html).replace(/\n/g,'<br/>');
	t.innerHTML = html;
	t.style.width=(input.clientWidth)+'px';
	return t.clientHeight;
}

//////////////////// Delegating ////////////////////

hui.ui.extend = function(obj,options) {
	if (!obj.name) {
		hui.ui.latestObjectIndex++;
		obj.name = 'unnamed'+hui.ui.latestObjectIndex;
	}
	if (options!==undefined) {
		if (obj.options) {
			obj.options = hui.override(obj.options,options);
		}
		obj.element = hui.get(options.element);
		obj.name = options.name;
	}
	hui.ui.objects[obj.name] = obj;
	obj.delegates = [];
	obj.listen = function(delegate) {
		hui.array.add(this.delegates,delegate);
		return this;
	}
	obj.removeDelegate = function(delegate) {
		hui.array.remove(this.delegates,delegate);
	}
	obj.clearDelegates = function() {
		this.delegates = [];
	}
	obj.fire = function(method,value,event) {
		return hui.ui.callDelegates(this,method,value,event);
	}
	obj.fireProperty = function(key,value) {
		hui.ui.firePropertyChange(this,key,value);
	}
	if (!obj.getElement) {
		obj.getElement = function() {
			return this.element;
		}
	}
	if (!obj.valueForProperty) {
		obj.valueForProperty = function(p) {return this[p]};
	}
	if (obj['$$resize']) {
		hui.ui.layoutWidgets.push(obj);
	}
};

hui.ui.callDelegatesDrop = function(dragged,dropped) {
	for (var i=0; i < hui.ui.delegates.length; i++) {
		if (hui.ui.delegates[i]['$drop$'+dragged.kind+'$'+dropped.kind]) {
			hui.ui.delegates[i]['$drop$'+dragged.kind+'$'+dropped.kind](dragged,dropped);
		}
	}
};

hui.ui.callAncestors = function(obj,method,value,event) {
	if (typeof(value)=='undefined') value=obj;
	var d = hui.ui.getAncestors(obj);
	for (var i=0; i < d.length; i++) {
		if (d[i][method]) {
			d[i][method](value,event);
		}
	};
};

hui.ui.callDescendants = function(obj,method,value,event) {
	if (typeof(value)=='undefined') {
		value=obj;
	}
	if (!method[0]=='$') {
		method = '$'+method;
	}
	var d = hui.ui.getDescendants(obj);
	for (var i=0; i < d.length; i++) {
		if (d[i][method]) {
			thisResult = d[i][method](value,event);
		}
	};
};

hui.ui.callVisible = function(widget) {
	hui.ui.callDescendants(widget,'$visibilityChanged');
}

hui.ui.listen = function(delegate) {
	hui.ui.delegates.push(delegate);
}

hui.ui.callDelegates = function(obj,method,value,event) {
	if (typeof(value)=='undefined') {
		value=obj;
	}
	var result = undefined;
	if (obj.delegates) {
		for (var i=0; i < obj.delegates.length; i++) {
			var delegate = obj.delegates[i],
				thisResult = undefined,
				x = '$'+method+'$'+obj.name;
			if (obj.name && delegate[x]) {
				thisResult = delegate[x](value,event);
			} else if (delegate['$'+method]) {
				thisResult = delegate['$'+method](value,event);
			}
			if (result===undefined && thisResult!==undefined && typeof(thisResult)!='undefined') {
				result = thisResult;
			}
		};
	}
	var superResult = hui.ui.callSuperDelegates(obj,method,value,event);
	if (result===undefined && superResult!==undefined) {
		result = superResult;
	}
	return result;
};

hui.ui.callSuperDelegates = function(obj,method,value,event) {
	if (typeof(value)=='undefined') value=obj;
	var result = undefined;
	for (var i=0; i < hui.ui.delegates.length; i++) {
		var delegate = hui.ui.delegates[i];
		var thisResult = undefined;
		if (obj.name && delegate['$'+method+'$'+obj.name]) {
			thisResult = delegate['$'+method+'$'+obj.name](value,event);
		} else if (delegate['$'+method]) {
			thisResult = delegate['$'+method](value,event);
		}
		if (result===undefined && thisResult!==undefined && typeof(thisResult)!='undefined') {
			result = thisResult;
		}
	};
	return result;
};

hui.ui.resolveImageUrl = function(widget,img,width,height) {
	for (var i=0; i < widget.delegates.length; i++) {
		if (widget.delegates[i].$resolveImageUrl) {
			return widget.delegates[i].$resolveImageUrl(img,width,height);
		}
	};
	for (var j=0; j < hui.ui.delegates.length; j++) {
		var delegate = hui.ui.delegates[j];
		if (delegate.$resolveImageUrl) {
			return delegate.$resolveImageUrl(img,width,height);
		}
	}
	return null;
};

////////////////////////////// Bindings ///////////////////////////

hui.ui.firePropertyChange = function(obj,name,value) {
	hui.ui.callDelegates(obj,'propertyChanged',{property:name,value:value});
};

hui.ui.bind = function(expression,delegate) {
	if (expression.charAt(0)=='@') {
		var pair = expression.substring(1).split('.');
		var obj = hui.ui.get(pair[0]);
		if (!obj) {
			hui.log('Unable to bind to '+expression);
			return;
		}
		var p = pair.slice(1).join('.');
		obj.listen({
			$propertyChanged : function(prop) {
				if (prop.property==p) {
					delegate(prop.value);
				}
			}
		});
		return obj.valueForProperty(p);
	}
	return expression;
};

//////////////////////////////// Data /////////////////////////////

hui.ui.handleRequestError = function(widget) {
	hui.log('General request error received');
	var result = hui.ui.callSuperDelegates(widget || this,'requestError');
	if (!result) {
		hui.ui.confirmOverlay({
			element : document.body,
			text : hui.ui.getText('request_error'),
			okText : hui.ui.getText('reload_page'),
			cancelText : hui.ui.getText('continue'),
			onOk : function() {
				document.location.reload();
			}
		});
	}
}

hui.ui.handleForbidden = function(widget) {
	hui.log('General access denied received');
	var result = hui.ui.callSuperDelegates(widget || this,'accessDenied');
	if (!result) {
		hui.ui.confirmOverlay({
			element : document.body,
			text : hui.ui.getText('access_denied'),
			okText : hui.ui.getText('reload_page'),
			cancelText : hui.ui.getText('continue'),
			onOk : function() {
				document.location.reload();
			}
		});
	}
}

hui.ui.request = function(options) {
	options = hui.override({method:'post',parameters:{}},options);
	if (options.json) {
		for (var key in options.json) {
			options.parameters[key]=hui.string.toJSON(options.json[key]);
		}
	}
	var onSuccess = options.onSuccess;
	var message = options.message;
	options.onSuccess=function(t) {
		if (message) {
			if (message.success) {
				hui.ui.showMessage({text:message.success,icon:'common/success',duration:message.duration || 2000});
			} else if (message.start) {
				hui.ui.hideMessage();
			}
		}
		var str,json;
		if (typeof(onSuccess)=='string') {
			if (!hui.request.isXMLResponse(t)) {
				str = t.responseText.replace(/^\s+|\s+$/g, '');
				if (str.length>0) {
					json = hui.string.fromJSON(t.responseText);
				} else {
					json = '';
				}
				hui.ui.callDelegates(json,'success$'+onSuccess);
			} else {
				hui.ui.callDelegates(t,'success$'+onSuccess);
			}
		} else if (hui.request.isXMLResponse(t) && options.onXML) {
			options.onXML(t.responseXML);
		} else if (options.onJSON) {
			str = t.responseText.replace(/^\s+|\s+$/g, '');
			if (str.length>0) {
				json = hui.string.fromJSON(t.responseText);
			} else {
				json = null;
			}
			options.onJSON(json);
		} else if (typeof(onSuccess)=='function') {
			onSuccess(t);
		} else if (options.onText) {
			options.onText(t.responseText);
		}
	};
	var onFailure = options.onFailure;
	options.onFailure = function(t) {
		if (typeof(onFailure)=='string') {
			hui.ui.callDelegates(t,'failure$'+onFailure)
		} else if (typeof(onFailure)=='function') {
			onFailure(t);
		} else {
			if (options.message && options.message.start) {
				hui.ui.hideMessage();
			}
			hui.ui.handleRequestError();
		}
	}
	options.onException = function(t,e) {
		hui.log(t);
		hui.log(e);
	};
	var onForbidden = options.onForbidden;
	options.onForbidden = function(t) {
		if (options.message && options.message.start) {
			hui.ui.hideMessage();
		}
		if (onForbidden) {
			onForbidden(t);
		} else {
			options.onFailure(t);
			hui.ui.handleForbidden();
		}
	}
	if (options.message && options.message.start) {
		hui.ui.showMessage({text:options.message.start,busy:true,delay:options.message.delay});
	}
	hui.request(options);
};

hui.ui.parseItems = function(doc) {
	var root = doc.documentElement;
	var out = [];
	hui.ui.parseSubItems(root,out);
	return out;
};

hui.ui.parseSubItems = function(parent,array) {
	var children = parent.childNodes;
	for (var i=0; i < children.length; i++) {
		var node = children[i];
		if (node.nodeType==1 && node.nodeName=='title') {
			array.push({title:node.getAttribute('title'),type:'title'})
		} else if (node.nodeType==1 && node.nodeName=='item') {
			var sub = [];
			hui.ui.parseSubItems(node,sub);
			array.push({
				title:node.getAttribute('title'),
				value:node.getAttribute('value'),
				icon:node.getAttribute('icon'),
				kind:node.getAttribute('kind'),
				badge:node.getAttribute('badge'),
				children:sub
			});
		}
	};
}

/** A bundle of strings
 * @constructor
 */
hui.ui.Bundle = function(strings) {
	this.strings = strings;
}

hui.ui.Bundle.prototype = {
	get : function(key) {
		var values = this.strings[key];
		if (values) {
			return values[hui.ui.language];
		}
		hui.log(key+' not found for language:'+hui.ui.language);
		return key;
	}
}

/**
 * Import some widgets by name
 * @param {Array} names Array of widgets to import
 * @param {Function} func The function to call when finished
 */
hui.ui.require = function(names,func) {
	for (var i = names.length - 1; i >= 0; i--){
		names[i] = hui.ui.context+'hui/js/'+names[i]+'.js';
	};
	hui.require(names,func);
}
/* EOF */
/** A data source
 * @constructor
 */
hui.ui.Source = function(options) {
	this.options = hui.override({url:null,dwr:null,parameters:[],lazy:false},options);
	this.name = options.name;
	this.data = null;
	this.parameters = this.options.parameters;
	hui.ui.extend(this);
	if (options.delegate) {
		this.listen(options.delegate);
	}
	this.initial = true;
	this.busy=false;
	hui.ui.onReady(this.init.bind(this));
};

hui.ui.Source.prototype = {
	/** @private */
	init : function() {
		var self = this;
		hui.each(this.parameters,function(parm) {
			var val = hui.ui.bind(parm.value,function(value) {
				self.changeParameter(parm.key,value);
			});
			parm.value = self.convertValue(val);
		});
		if (!this.options.lazy) {
			this.refresh();
		}
	},
	/** @private */
	convertValue : function(value) {		
		if (value && value.getTime) {
			return value.getTime();
		}
		return value;
	},
	refreshFirst : function() {
		if (this.initial) {
			this.refresh();
		}
	},
	/** Refreshes the data source */
	refresh : function() {
		if (this.delegates.length==0) {
			return;
		}
		var shouldRefresh = this.delegates.length==0;
		for (var i=0; i < this.delegates.length; i++) {
			var d = this.delegates[i];
			if (d['$sourceShouldRefresh']) {
				shouldRefresh = shouldRefresh || d['$sourceShouldRefresh']();
			} else {
				shouldRefresh = true;
			}
		};
		if (!shouldRefresh) {return}
		if (this.busy) {
			this.pendingRefresh = true;
			// It might be better to cue rather than abort
			//if (this.transport) {
			//	this.transport.abort();
			//}
			return;
		}
		this.initial = false;
		this.pendingRefresh = false;
		var self = this;
		if (this.options.url) {
			var prms = {};
			for (var j=0; j < this.parameters.length; j++) {
				var p = this.parameters[j];
				prms[p.key] = p.value;
			};
			this.busy=true;
			hui.ui.callDelegates(this,'sourceIsBusy');
			this.transport = hui.request({
				method : 'post',
				url : this.options.url,
				parameters : prms,
				onSuccess : this.parse.bind(this),
				onException : function(e,t) {
					hui.log('Exception while loading source...')
					hui.log(e)
					self.end();
				},
				onForbidden : function() {
					hui.ui.handleForbidden(self);
					hui.ui.callDelegates(self,'sourceFailed');
					self.end();
				},
				onFailure : function(t) {
					hui.log('sourceFailed');
					hui.ui.callDelegates(self,'sourceFailed');
					self.end();
				}
			});
		} else if (this.options.dwr) {
			var pair = this.options.dwr.split('.');
			var facade = eval(pair[0]);
			var method = pair[1];
			var args = facade[method].argumentNames();
			for (var k=0; k < args.length; k++) {
				if (this.parameters[k]) {
					args[k]=this.parameters[k].value===undefined ? null : this.parameters[k].value;
				}
			};
			args[args.length-1]=function(r) {self.parseDWR(r)};
			this.busy=true;
			hui.ui.callDelegates(this,'sourceIsBusy');
			facade[method].apply(facade,args);
		}
	},
	/** @private */
	end : function() {
		this.busy=false;
		hui.ui.callDelegates(this,'sourceIsNotBusy');
		if (this.pendingRefresh) {
			this.refresh();
		}
	},
	/** @private */
	parse : function(t) {
		if (hui.request.isXMLResponse(t)) {
			this.parseXML(t.responseXML);
		} else {
			var str = t.responseText.replace(/^\s+|\s+$/g, ''),
				json = null;
			if (str.length>0) {
				json = hui.string.fromJSON(t.responseText);
			}
			this.fire('objectsLoaded',json);
		}
		this.end();
	},
	/** @private */
	parseXML : function(doc) {
		if (doc.documentElement.tagName=='items') {
			this.data = hui.ui.parseItems(doc);
			this.fire('itemsLoaded',this.data);
		} else if (doc.documentElement.tagName=='list') {
			this.fire('listLoaded',doc);
		} else if (doc.documentElement.tagName=='articles') {
			this.fire('articlesLoaded',doc);
		}
	},
	/** @private */
	parseDWR : function(data) {
		this.data = data;
		this.fire('objectsLoaded',data);
		this.end();
	},
	addParameter : function(parm) {
		this.parameters.push(parm);
	},
	changeParameter : function(key,value) {
		value = this.convertValue(value);
		for (var i=0; i < this.parameters.length; i++) {
			var p = this.parameters[i]
			if (p.key==key) {
				p.value=value;
			}
		};
		window.clearTimeout(this.paramDelay);
		this.paramDelay = window.setTimeout(function() {
			this.refresh();
		}.bind(this),100)
	}
}

/* EOF *//** @private */
hui.ui.getDragProxy = function() {
	if (!hui.ui.dragProxy) {
		hui.ui.dragProxy = hui.build('div',{'class':'hui_dragproxy',style:'display:none'});
		document.body.appendChild(hui.ui.dragProxy);
	}
	return hui.ui.dragProxy;
};

/** @private */
hui.ui.startDrag = function(e,element,options) {
	e = new hui.Event(e);
	var info = element.dragDropInfo;
	hui.ui.dropTypes = hui.ui.findDropTypes(info);
	if (!hui.ui.dropTypes) return;
	var proxy = hui.ui.getDragProxy();
	hui.listen(document.body,'mousemove',hui.ui.dragListener);
	hui.listen(document.body,'mouseup',hui.ui.dragEndListener);
	hui.ui.dragInfo = info;
	if (info.icon) {
		proxy.style.backgroundImage = 'url('+hui.ui.getIconUrl(info.icon,16)+')';
	}
	hui.ui.startDragPos = {top:e.getTop(),left:e.getLeft()};
	proxy.innerHTML = info.title ? '<span>'+hui.string.escape(info.title)+'</span>' : '###';
	hui.ui.dragging = true;
	document.body.onselectstart = function () { return false; };
};

/** @private */
hui.ui.findDropTypes = function(drag) {
	var gui = hui.ui;
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
};

/** @private */
hui.ui.dragListener = function(e) {
	e = new hui.Event(e);
	hui.ui.dragProxy.style.left = (e.getLeft()+10)+'px';
	hui.ui.dragProxy.style.top = e.getTop()+'px';
	hui.ui.dragProxy.style.display='block';
	var target = hui.ui.findDropTarget(e.getElement());
	if (target && hui.ui.dropTypes[target.dragDropInfo['kind']]) {
		if (hui.ui.latestDropTarget) {
			hui.cls.remove(hui.ui.latestDropTarget,'hui_drop');
		}
		hui.cls.add(target,'hui_drop');
		hui.ui.latestDropTarget = target;
	} else if (hui.ui.latestDropTarget) {
		hui.cls.remove(hui.ui.latestDropTarget,'hui_drop');
		hui.ui.latestDropTarget = null;
	}
	return false;
};

/** @private */
hui.ui.findDropTarget = function(node) {
	while (node) {
		if (node.dragDropInfo) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
};

/** @private */
hui.ui.dragEndListener = function(event) {
	hui.unListen(document.body,'mousemove',hui.ui.dragListener);
	hui.unListen(document.body,'mouseup',hui.ui.dragEndListener);
	hui.ui.dragging = false;
	if (hui.ui.latestDropTarget) {
		hui.cls.remove(hui.ui.latestDropTarget,'hui_drop');
		hui.ui.callDelegatesDrop(hui.ui.dragInfo,hui.ui.latestDropTarget.dragDropInfo);
		hui.ui.dragProxy.style.display='none';
	} else {
		hui.animate(hui.ui.dragProxy,'left',(hui.ui.startDragPos.left+10)+'px',200,{ease:hui.ease.fastSlow});
		hui.animate(hui.ui.dragProxy,'top',(hui.ui.startDragPos.top-5)+'px',200,{ease:hui.ease.fastSlow,hideOnComplete:true});
	}
	hui.ui.latestDropTarget=null;
	document.body.onselectstart=null;
};

/** @private */
hui.ui.dropOverListener = function(event) {
	if (hui.ui.dragging) {
		//this.style.backgroundColor='#3875D7';
	}
};

/** @private */
hui.ui.dropOutListener = function(event) {
	if (hui.ui.dragging) {
		//this.style.backgroundColor='';
	}
};/**
 * @constructor
 */
hui.ui.Window = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	this.close = hui.get.firstByClass(this.element,'hui_window_close');
	this.titlebar = hui.get.firstByClass(this.element,'hui_window_titlebar');
	this.title = hui.get.firstByClass(this.titlebar,'hui_window_title');
	this.content = hui.get.firstByClass(this.element,'hui_window_body');
	this.front = hui.get.firstByClass(this.element,'hui_window_front');
	this.back = hui.get.firstByClass(this.element,'hui_window_back');
	if (this.back) {
		hui.effect.makeFlippable({container:this.element,front:this.front,back:this.back});
	}
	this.visible = false;
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.Window.create = function(options) {
	options = hui.override({title:'Window',close:true},options);
	var html = '<div class="hui_window_front">'+(options.close ? '<div class="hui_window_close"></div>' : '')+
		'<div class="hui_window_titlebar"><div><div>';
		if (options.icon) {
			html+='<span class="hui_window_icon" style="background-image: url('+hui.ui.getIconUrl(options.icon,16)+')"></span>';
		}
	html+='<span class="hui_window_title">'+options.title+'</span></div></div></div>'+
		'<div class="hui_window_content"><div class="hui_window_content"><div class="hui_window_body" style="'+
		(options.width ? 'width:'+options.width+'px;':'')+
		(options.padding ? 'padding:'+options.padding+'px;':'')+
		'">'+
		'</div></div></div>'+
		'<div class="hui_window_bottom"><div class="hui_window_bottom"><div class="hui_window_bottom"></div></div></div></div>';
	options.element = hui.build('div',{'class':'hui_window'+(options.variant ? ' hui_window_'+options.variant : ''),html:html,parent:document.body});
	return new hui.ui.Window(options);
}

hui.ui.Window.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		if (this.close) {
			hui.listen(this.close,'click',function(e) {
				this.hide();
				this.fire('userClosedWindow');
			}.bind(this)
			);
			hui.listen(this.close,'mousedown',function(e) {hui.stop(e)});
		}
		this.titlebar.onmousedown = function(e) {self.startDrag(e);return false;};
		hui.listen(this.element,'mousedown',function() {
			self.element.style.zIndex=hui.ui.nextPanelIndex();
		});
	},
	setTitle : function(title) {
		hui.dom.setText(this.title,title);
	},
	show : function(options) {
		if (this.visible) {
			var scrollTop = hui.window.getScrollTop();
			var winTop = hui.position.getTop(this.element);
			if (winTop < scrollTop || winTop+this.element.clientHeight > hui.window.getViewHeight()+scrollTop) {
				hui.animate({node:this.element,css:{top:(scrollTop+40)+'px'},duration:500,ease:hui.ease.slowFastSlow});
			}
			this.element.style.zIndex=hui.ui.nextPanelIndex();
			return;
		}
		options = options || {};
		hui.style.set(this.element,{
			zIndex : hui.ui.nextPanelIndex(), visibility : 'hidden', display : 'block'
		})
		var width = this.element.clientWidth;
		hui.style.set(this.element,{
			width : width+'px' , visibility : 'visible'
		});
		if (options.avoid) {
			hui.position.place({insideViewPort : true, target : {element : options.avoid, vertical : .5, horizontal : 1}, source : {element : this.element, vertical : .5, horizontal : 0} });
		} else {
			if (!this.element.style.top) {
				this.element.style.top = (hui.window.getScrollTop()+40)+'px';
			}
			if (!this.element.style.left) {
				this.element.style.left = Math.round((hui.window.getViewWidth()-width)/2)+'px';
			}			
		}
		if (hui.browser.opacity) {
			hui.animate(this.element,'opacity',1,0);
		}
		this.visible = true;
		hui.ui.callVisible(this);
	},
	toggle : function() {
		(this.visible ? this.hide() : this.show() );
	},
	hide : function() {
		if (!this.visible) return;
		if (hui.browser.opacity) {
			hui.animate(this.element,'opacity',0,200,{onComplete:function() {
				this.element.style.display='none';
				hui.ui.callVisible(this);
			}.bind(this)});
		} else {
			this.element.style.display='none';
			hui.ui.callVisible(this);
		}
		this.visible = false;
	},
	add : function(widgetOrNode) {
		if (widgetOrNode.getElement) {
			this.content.appendChild(widgetOrNode.getElement());
		} else {
			this.content.appendChild(widgetOrNode);
		}
	},
	addToBack : function(widgetOrNode) {
		if (!this.back) {
			this.back = hui.build('div',{className:'hui_window_back'});
			this.element.insertBefore(this.back,this.front);
			hui.effect.makeFlippable({container:this.element,front:this.front,back:this.back});
		}
		this.back.appendChild(hui.ui.getElement(widgetOrNode));
	},
	setVariant : function(variant) {
		hui.cls.remove(this.element,'hui_window_dark');
		hui.cls.remove(this.element,'hui_window_light');
		if (variant=='dark' || variant=='light') {
			hui.cls.add(this.element,'hui_window_'+variant);
		}
	},
	flip : function() {
		if (this.back) {
			this.back.style.minHeight = this.element.clientHeight+'px';
			hui.effect.flip({element:this.element});
		}
	},

////////////////////////////// Dragging ////////////////////////////////

	/** @private */
	startDrag : function(e) {
		var event = new hui.Event(e);
		this.element.style.zIndex=hui.ui.nextPanelIndex();
		var pos = { top : hui.position.getTop(this.element), left : hui.position.getLeft(this.element) };
		this.dragState = {left:event.getLeft()-pos.left,top:event.getTop()-pos.top};
		this.latestPosition = {left: this.dragState.left, top:this.dragState.top};
		this.latestTime = new Date().getMilliseconds();
		var self = this;
		this.moveListener = function(e) {self.drag(e)};
		this.upListener = function(e) {self.endDrag(e)};
		hui.listen(document,'mousemove',this.moveListener);
		hui.listen(document,'mouseup',this.upListener);
		hui.listen(document,'mousedown',this.upListener);
		event.stop();
		document.body.onselectstart = function () { return false; };
		return false;
	},
	/** @private */
	calc : function(top,left) {
		// TODO: No need to do this all the time
		this.a = this.latestPosition.left-left;
		this.b = this.latestPosition.top-top;
		this.dist = Math.sqrt(Math.pow((this.a),2),Math.pow((this.b),2));
		this.latestTime = new Date().getMilliseconds();
		this.latestPosition = {'top':top,'left':left};
	},
	/** @private */
	drag : function(e) {
		var event = new hui.Event(e);
		this.element.style.right = 'auto';
		var top = (event.getTop()-this.dragState.top);
		var left = (event.getLeft()-this.dragState.left);
		this.element.style.top = Math.max(top,0)+'px';
		this.element.style.left = Math.max(left,0)+'px';
		//this.calc(top,left);
		return false;
	},
	/** @private */
	endDrag : function(e) {
		hui.unListen(document,'mousemove',this.moveListener);
		hui.unListen(document,'mouseup',this.upListener);
		hui.unListen(document,'mousedown',this.upListener);
		document.body.onselectstart = null;
	}
}

/* EOF *//**
 * @class
 * This is a formula
 */
hui.ui.Formula = function(options) {
	this.options = options;
	hui.ui.extend(this,options);
	this.addBehavior();
}

/** @static Creates a new formula */
hui.ui.Formula.create = function(o) {
	o = o || {};
	var atts = {'class':'hui_formula hui_formula'};
	if (o.action) {
		atts.action=o.action;
	}
	if (o.method) {
		atts.method=o.method;
	}
	o.element = hui.build('form',atts);
	return new hui.ui.Formula(o);
}

hui.ui.Formula.prototype = {
	/** @private */
	addBehavior : function() {
		this.element.onsubmit=function() {return false;};
	},
	submit : function() {
		this.fire('submit');
	},
	/** Returns a map of all values of descendants */
	getValues : function() {
		var data = {};
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].options && d[i].options.key && d[i].getValue) {
				data[d[i].options.key] = d[i].getValue();
			} else if (d[i].name && d[i].getValue) {
				data[d[i].name] = d[i].getValue();
			}
		};
		return data;
	},
	/** Sets the values of the descendants */
	setValues : function(values) {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].options && d[i].options.key) {
				var key = d[i].options.key;
				if (key && values[key]!==undefined) {
					d[i].setValue(values[key]);
				}
			}
		}
	},
	/** Sets focus in the first found child */
	focus : function() {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].focus) {
				d[i].focus();
				return;
			}
		}
	},
	/** Resets all descendants */
	reset : function() {
		var d = hui.ui.getDescendants(this);
		for (var i=0; i < d.length; i++) {
			if (d[i].reset) {
				d[i].reset();
			}
		}
	},
	/** Adds a widget to the form */
	add : function(widget) {
		this.element.appendChild(widget.getElement());
	},
	/** Creates a new form group and adds it to the form
	 * @returns {'hui.ui.Formula.Group'} group
	 */
	createGroup : function(options) {
		var g = hui.ui.Formula.Group.create(options);
		this.add(g);
		return g;
	},
	/** Builds and adds a new group according to a recipe
	 * @returns {'hui.ui.Formula.Group'} group
	 */
	buildGroup : function(options,recipe) {
		var g = this.createGroup(options);
		hui.each(recipe,function(item) {
			if (hui.ui.Formula[item.type]) {
				var w = hui.ui.Formula[item.type].create(item.options);
				g.add(w);
			}
			else if (hui.ui[item.type]) {
				var w = hui.ui[item.type].create(item.options);
				g.add(w);
			} else {
				hui.log('buildGroup: Unable to find type: '+item.type);
			}
		});
		return g;
	},
	/** @private */
	childValueChanged : function(value) {
		this.fire('valuesChanged',this.getValues());
	},
	show : function() {
		this.element.style.display='';
	},
	hide : function() {
		this.element.style.display='none';
	}
}

///////////////////////// Group //////////////////////////


/**
 * A form group
 * @constructor
 */
hui.ui.Formula.Group = function(options) {
	this.name = options.name;
	this.element = hui.get(options.element);
	this.body = hui.get.firstByTag(this.element,'tbody');
	this.options = hui.override({above:true},options);
	hui.ui.extend(this);
}

/** Creates a new form group */
hui.ui.Formula.Group.create = function(options) {
	options = hui.override({above:true},options);
	var element = options.element = hui.build('table',
		{'class':'hui_formula_group'}
	);
	if (options.above) {
		hui.cls.add(element,'hui_formula_group_above');
	}
	element.appendChild(hui.build('tbody'));
	return new hui.ui.Formula.Group(options);
}

hui.ui.Formula.Group.prototype = {
	add : function(widget) {
		var tr = hui.build('tr');
		this.body.appendChild(tr);
		var td = hui.build('td',{'class':'hui_formula_group'});
		if (widget.getLabel) {
			var label = widget.getLabel();
			if (label) {
				if (this.options.above) {
					hui.build('label',{text:label,parent:td});
				} else {
					var th = hui.build('th',{parent:tr});
					hui.build('label',{text:label,parent:th});
				}
			}
		}
		var item = hui.build('div',{'class':'hui_formula_item'});
		item.appendChild(widget.getElement());
		td.appendChild(item);
		tr.appendChild(td);
	},
	createButtons : function(options) {
		var tr = hui.build('tr',{parent:this.body});
		var td = hui.build('td',{colspan:this.options.above ? 1 : 2, parent:tr});
		var b = hui.ui.Buttons.create(options);
		td.appendChild(b.getElement());
		return b;
	}
}/**
 * A list
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  url : «String»,
 *  source : «hui.ui.Source»,
 *  selectable : «<strong>true</strong> | false»,
 *  dropFiles : «true | <strong>false</strong>»,
 *  indent : «Integer»
 * }
 *
 * <strong>Events:</strong>
 * $listRowWasOpened(row) - When a row is double clicked (rename to open)
 * $selectionChanged() - When a row is selected (rename to select)
 * $selectionReset() - When a previous selection is removed (nothing is selected)
 * $clickButton({row:row,button:button}) - When a button is clicked
 * $clickIcon({row:row,data:data,node:node}) - When an icon is clicked
 *
 * <strong>Bindings:</strong>
 * <del>window</del>
 * window.page
 * sort.direction
 * sort.key
 * </pre>
 *
 * @constructor
 * @param {Object} options The options : {url:null,source:null,selectable:«boolean»}
 */
hui.ui.List = function(options) {
	this.options = hui.override({url:null,source:null,selectable:true,indent:null},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	if (this.options.source) {
		this.options.source.listen(this);
	}
	this.url = options.url;
	this.table = hui.get.firstByTag(this.element,'table');
	this.head = hui.get.firstByTag(this.element,'thead');
	this.body = hui.get.firstByTag(this.element,'tbody');
	this.columns = [];
	this.rows = [];
	this.selected = [];
	this.navigation = hui.get.firstByClass(this.element,'hui_list_navigation');
	this.count = hui.get.firstByClass(this.navigation,'hui_list_count');
	this.windowPage = hui.get.firstByClass(this.navigation,'window_page');
	this.windowPageBody = hui.get.firstByClass(this.navigation,'window_page_body');
	this.parameters = {};
	this.sortKey = null;
	this.sortDirection = null;
	
	this.window = {size:null,page:0,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	hui.ui.extend(this);
	if (options.dropFiles) {
		this._addDrop();
	}
	if (this.url)  {
		this.refresh();
	}
}

/**
 * Creates a new list widget
 * <pre><strong>options:</strong> {
 *  maxHeight : «Integer»,
 *
 *  name : «String»,
 *  url : «String»,
 *  source : «hui.ui.Source»,
 *  selectable : «<strong>true</strong> | false»,
 *  dropFiles : «true | <strong>false</strong>»,
 *  indent : «Integer»
 * }
 * @param {Object} options The options
 */
hui.ui.List.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{
		'class':'hui_list',
		html: '<div class="hui_list_progress"></div><div class="hui_list_navigation"><div class="hui_list_selection window_page"><div><div class="window_page_body"></div></div></div><span class="hui_list_count"></span></div><div class="hui_list_body"'+(options.maxHeight>0 ? ' style="max-height: '+options.maxHeight+'px; overflow: auto;"' : '')+'><table cellspacing="0" cellpadding="0"><thead><tr></tr></thead><tbody></tbody></table></div>'});
	return new hui.ui.List(options);
}

hui.ui.List.prototype = {
	_addDrop : function() {
		hui.drag.listen({
			element : this.element,
			hoverClass : 'hui_list_drop',
			onFiles : function(files) {
				this.fire('filesDropped',files);
			}.bind(this)
		})
	},
	/** Hides the list */
	hide : function() {
		this.element.style.display='none';
	},
	/** Shows the list */
	show : function() {
		this.element.style.display='block';
		this.refresh();
	},
	/** @private */
	registerColumn : function(column) {
		this.columns.push(column);
	},
	/** Gets an array of selections
	 * @returns {Array} The selected rows
	 */
	getSelection : function() {
		var items = [];
		for (var i=0; i < this.selected.length; i++) {
			items.push(this.rows[this.selected[i]]);
		};
		return items;
	},
	/** Gets all rows of the list
	 * @returns {Array} The all rows
	 */
	getRows : function() {
		return this.rows;
	},
	/** Gets the first selection or null
	 * @returns {Object} The first selected row
	 */
	getFirstSelection : function() {
		var items = this.getSelection();
		if (items.length>0) return items[0];
		else return null;
	},
	/** Add a parameter 
	 * @param {String} key The key
	 * @param {String} value The value
	 */
	setParameter : function(key,value) {
		this.parameters[key]=value;
	},
	/** @private */
	loadData : function(url) {
		this.setUrl(url);
	},
	/**
	 * Sets the lists data source and refreshes it if it is new
	 * @param {hui.ui.Source} source The source
	 */
	setSource : function(source) {
		if (this.options.source!=source) {
			if (this.options.source) {
				this.options.source.removeDelegate(this);
			}
			source.listen(this);
			this.options.source = source;
			source.refresh();
		}
	},
	/**
	 * Set an url to load data from, and load the data
	 * @param {String} url The url
	 */
	setUrl : function(url) {
		if (this.options.source) {
			this.options.source.removeDelegate(this);
			this.options.source=null;
		}
		this.url = url;
		this.selected = [];
		this.sortKey = null;
		this.sortDirection = null;
		this.resetState();
		this.refresh();
	},
	/** Clears the data of the list */
	clear : function() {
		this.selected = [];
		this.columns = [];
		this.rows = [];
		this.navigation.style.display='none';
		hui.dom.clear(this.body);
		hui.dom.clear(this.head);
		if (this.options.source) {
			this.options.source.removeDelegate(this);
		}
		this.options.source = null;
		this.url = null;
	},
	/** Resets the window state of the navigator */
	resetState : function() {
		this.window = {size:null,page:0,total:0};
		hui.ui.firePropertyChange(this,'window',this.window);
		hui.ui.firePropertyChange(this,'window.page',this.window.page);
	},
	/** @private */
	valueForProperty : function(p) {
		if (p=='window.page') return this.window.page;
		if (p=='window.page') return this.window.page;
		else if (p=='sort.key') return this.sortKey;
		else if (p=='sort.direction') return (this.sortDirection || 'ascending');
		else return this[p];
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return hui.dom.isVisible(this.element);
	},
	/** @private */
	$visibilityChanged : function() {
		if (this.options.source && hui.dom.isVisible(this.element)) {
			// If there is a source, make sure it is initially 
			this.options.source.refreshFirst();
		}
	},
	/** @private */
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
			return;
		}
		if (!this.url) return;
		var url = this.url;
		if (typeof(this.window.page)=='number') {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='windowPage='+this.window.page;
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
		for (var key in this.parameters) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+=key+'='+this.parameters[key];
		}
		this._setBusy(true);
		hui.ui.request({
			url:url,
			onJSON : function(obj) {this._setBusy(false);this.$objectsLoaded(obj)}.bind(this),
			onXML : function(obj) {this._setBusy(false);this.$listLoaded(obj)}.bind(this)
		});
	},
	/** @private */
	sort : function(index) {
		var key = this.columns[index].key;
		if (key==this.sortKey) {
			this.sortDirection = this.sortDirection=='ascending' ? 'descending' : 'ascending';
			hui.ui.firePropertyChange(this,'sort.direction',this.sortDirection);
		} else {
			hui.ui.firePropertyChange(this,'sort.key',key);
		}
		this.sortKey = key;
	},
	_debug : function(obj) {
		hui.log(obj);
	},

	/** @private */
	$listLoaded : function(doc) {
		this._debug('List loaded');
		this._setError(false);
		this.selected = [];
		this.parseWindow(doc);
		this.buildNavigation();
		hui.dom.clear(this.head);
		hui.dom.clear(this.body);
		this.rows = [];
		this.columns = [];
		var headTr = document.createElement('tr');
		var sort = doc.getElementsByTagName('sort');
		this.sortKey=null;
		this.sortDirection=null;
		if (sort.length>0) {
			this.sortKey=sort[0].getAttribute('key');
			this.sortDirection=sort[0].getAttribute('direction');
		}
		var headers = doc.getElementsByTagName('header');
		var i;
		for (i=0; i < headers.length; i++) {
			var className = '';
			var th = document.createElement('th');
			var width = headers[i].getAttribute('width');
			var key = headers[i].getAttribute('key');
			var sortable = headers[i].getAttribute('sortable')=='true';
			if (width && width!='') {
				th.style.width=width+'%';
			}
			if (sortable) {
				var self = this;
				th.huiIndex = i;
				th.onclick=function() {self.sort(this.huiIndex)};
				className+='sortable';
			}
			if (this.sortKey && key==this.sortKey) {
				className+=' sort_'+this.sortDirection;
			}
			th.className=className;
			var span = document.createElement('span');
			th.appendChild(span);
			span.appendChild(document.createTextNode(headers[i].getAttribute('title') || ''));
			headTr.appendChild(th);
			this.columns.push({'key':key,'sortable':sortable,'width':width});
		};
		this.head.appendChild(headTr);
		var frag = document.createDocumentFragment();
		var rows = doc.getElementsByTagName('row');
		for (i=0; i < rows.length; i++) {
			var cells = rows[i].getElementsByTagName('cell');
			var row = document.createElement('tr');
			row.setAttribute('data-index',i);
			var icon = rows[i].getAttribute('icon');
			var title = rows[i].getAttribute('title');
			var level = rows[i].getAttribute('level');
			for (var j=0; j < cells.length; j++) {
				var td = document.createElement('td');
				if (cells[j].getAttribute('wrap')=='false') {
					td.style.whiteSpace='nowrap';
				}
				if (cells[j].getAttribute('vertical-align')) {
					td.style.verticalAlign=cells[j].getAttribute('vertical-align');
				}
				if (cells[j].getAttribute('width')) {
					td.style.width=cells[j].getAttribute('width')+'%';
				}
				if (cells[j].getAttribute('align')) {
					td.style.textAlign=cells[j].getAttribute('align');
				}
				if (cells[j].getAttribute('dimmed')=='true') {
					td.className='hui_list_dimmed';
				}
				if (j==0 && level>1) {
					td.style.paddingLeft = ((parseInt(level)-1)*16+5)+'px';
				} else if (j==0 && this.options.indent!=null) {
					td.style.paddingLeft = this.options.indent+'px';
				}
				this.parseCell(cells[j],td);
				row.appendChild(td);
				if (!title) {
					title = hui.dom.getText(cells[j]);
				}
				if (!icon) {
					icon = cells[j].getAttribute('icon');
				}
			};
			var info = {id:rows[i].getAttribute('id'),kind:rows[i].getAttribute('kind'),icon:icon,title:title,index:i,data:this._getData(rows[i])};
			row.dragDropInfo = info;
			this.addRowBehavior(row,i);
			frag.appendChild(row);
			this.rows.push(info);
		};
		this.body.appendChild(frag);
		this._setEmpty(rows.length==0);
		this.fire('selectionReset');
	},
	
	/** @private */
	$objectsLoaded : function(data) {
		this._setError(false);
		if (data==null) {
			// NOOP
		} else if (data.constructor == Array) {
			this.setObjects(data);
		} else {
			this.setData(data);
		}
		this.fire('selectionReset');
	},
	/** @private */
	$sourceIsBusy : function() {
		this._debug('$sourceIsBusy');
		this._setBusy(true);
	},
	/** @private */
	$sourceIsNotBusy : function() {
		this._debug('$sourceIsNotBusy');
		this._setBusy(false);
	},
	/** @private */
	$sourceFailed : function() {
		hui.log('The source failed!');
		this._setError(true);
	},
	_setError : function(error) {
		hui.cls.set(this.element,'hui_list_error',error);
	},
	_setBusy : function(busy) {
		this.busy = busy;
		window.clearTimeout(this.busytimer);
		if (busy) {
			var e = this.element;
			this.busytimer = window.setTimeout(function() {
				hui.cls.add(e,'hui_list_busy');
				if (e.parentNode.className=='hui_overflow') {
					hui.cls.add(e,'hui_list_busy_large');
				}
			},300);
		} else {
			hui.cls.remove(this.element,'hui_list_busy');
			if (this.element.parentNode.className=='hui_overflow') {
				hui.cls.remove(this.element,'hui_list_busy_large');
			}
		}
	},
	_setEmpty : function(empty) {
		var lmnt = hui.get.firstByClass(this.element,'hui_list_empty');
		if (lmnt) {
			lmnt.style.display = empty ? 'block' : '';
		}
	},
	
	_wrap : function(str) {
		var out = '';
		var count = 0;
		for (var i=0; i < str.length; i++) {
			if (str[i]===' ' || str[i]==='-') {
				count=0;
			} else {
				count++;
			}
			out+=str[i];
			if (count>10) {
				out+='\u200B';
				count=0;
			}
		};
		return out;
	},
	
	/** @private */
	parseCell : function(node,cell) {
		var variant = node.getAttribute('variant');
		if (variant!=null && variant!='') {
			cell = hui.build('div',{parent:cell,className : 'hui_list_cell_'+variant});
		}
		var icon = node.getAttribute('icon');
		if (icon!=null && icon!='') {
			cell.appendChild(hui.ui.createIcon(icon,16));
			cell = hui.build('div',{parent:cell,style:'margin-left: 21px'});
		}
		for (var i=0; i < node.childNodes.length; i++) {
			var child = node.childNodes[i];
			if (hui.dom.isDefinedText(child)) {
				hui.dom.addText(cell,child.nodeValue);
			} else if (hui.dom.isElement(child,'break')) {
				cell.appendChild(document.createElement('br'));
			} else if (hui.dom.isElement(child,'icon')) {
				var icon = hui.ui.createIcon(child.getAttribute('icon'),16);
				if (child.getAttribute('hint')) {
					icon.setAttribute('title',child.getAttribute('hint'));
				}
				if (child.getAttribute('action')=='true') {
					hui.cls.add(icon,'hui_list_icon_action');
				}
				var data = child.getAttribute('data');
				if (data) {
					icon.setAttribute('data',data);
				}
				if (child.getAttribute('revealing')==='true') {
					hui.cls.add(icon,'hui_list_revealing');
				}
				cell.appendChild(icon);
			} else if (hui.dom.isElement(child,'line')) {
				var line = hui.build('p',{'class':'hui_list_line'});
				if (child.getAttribute('dimmed')=='true') {
					hui.cls.add(line,'hui_list_dimmed')
				}
				if (child.getAttribute('minor')=='true') {
					hui.cls.add(line,'hui_list_minor')
				}
				if (child.getAttribute('mini')=='true') {
					hui.cls.add(line,'hui_list_mini')
				}
				if (child.getAttribute('class')) {
					hui.cls.add(line,child.getAttribute('class'))
				}
				if (child.getAttribute('top')) {
					line.style.paddingTop=child.getAttribute('top')+'px';
				}
				cell.appendChild(line);
				this.parseCell(child,line);
			} else if (hui.dom.isElement(child,'object')) {
				var obj = hui.build('div',{'class':'hui_list_object'});
				if (child.getAttribute('icon')) {
					obj.appendChild(hui.ui.createIcon(child.getAttribute('icon'),16));
				}
				if (child.firstChild && child.firstChild.nodeType==hui.TEXT_NODE && child.firstChild.nodeValue.length>0) {
					hui.dom.addText(obj,child.firstChild.nodeValue);
				}
				cell.appendChild(obj);
			} else if (hui.dom.isElement(child,'icons')) {
				var icons = hui.build('span',{'class':'hui_list_icons'});
				this.parseCell(child,icons);
				cell.appendChild(icons);
			} else if (hui.dom.isElement(child,'button')) {
				var button = hui.ui.Button.create({text:child.getAttribute('text'),small:true,rounded:true,data:this._getData(child)});
				button.click(this._buttonClick.bind(this))
				cell.appendChild(button.getElement());
			} else if (hui.dom.isElement(child,'wrap')) {
				hui.dom.addText(cell,this._wrap(hui.dom.getText(child)));
			} else if (hui.dom.isElement(child,'delete')) {
				this.parseCell(child,hui.build('del',{parent:cell}));
			} else if (hui.dom.isElement(child,'strong')) {
				this.parseCell(child,hui.build('strong',{parent:cell}));
			} else if (hui.dom.isElement(child,'badge')) {
				this.parseCell(child,hui.build('span',{className:'hui_list_badge',parent:cell}));
			}
		};
	},
	_getData : function(node) {
		var data = node.getAttribute('data');
		if (data) {
			return hui.string.fromJSON(data);
		}
		return null;
	},
	_buttonClick : function(button) {
		var row = hui.get.firstParentByTag(button.getElement(),'tr');
		var obj = this.rows[parseInt(row.getAttribute('data-index'),10)];
		this.fire('clickButton',{row:obj,button:button});
	},
	/** @private */
	parseWindow : function(doc) {
		var wins = doc.getElementsByTagName('window');
		if (wins.length>0) {
			var win = wins[0];
			this.window.total = parseInt(win.getAttribute('total'));
			this.window.size = parseInt(win.getAttribute('size'));
			this.window.page = parseInt(win.getAttribute('page'));
		} else {
			this.window.total = 0;
			this.window.size = 0;
			this.window.page = 0;
		}
	},
	/** @private */
	buildNavigation : function() {
		var self = this;
		var pages = this.window.size>0 ? Math.ceil(this.window.total/this.window.size) : 0;
		if (pages<2) {
			this.navigation.style.display='none';
			return;
		}
		this.navigation.style.display='block';
		var from = ((this.window.page)*this.window.size+1);
		hui.dom.setText(this.count,(from+'-'+Math.min((this.window.page+1)*this.window.size,this.window.total)+' / '+this.window.total));
		var pageBody = this.windowPageBody;
		pageBody.innerHTML='';
		if (pages<2) {
			this.windowPage.style.display='none';	
		} else {
			var indices = this.buildPages(pages,this.window.page);
			for (var i=0; i < indices.length; i++) {
				var index = indices[i];
				if (index==='') {
					pageBody.appendChild(hui.build('span',{text:'·'}));
				} else {
					var a = document.createElement('a');
					a.appendChild(document.createTextNode(index+1));
					a.setAttribute('data-index',index);
					a.onmousedown = function() {
						self.windowPageWasClicked(this);
						return false;
					}
					if (index==self.window.page) {
						a.className='hui_list_selected';
					}
					pageBody.appendChild(a);
				}
			}
			this.windowPage.style.display='block';
		}
	},
	/** @private */
	buildPages : function(count,selected) {
		var pages = [];
		var x = false;
		for (var i=0;i<count;i++) {
			if (i<1 || i>count-2 || Math.abs(selected-i)<5) {
				pages.push(i);
				x=false;
			} else {
				if (!x) {
					pages.push('')
				};
				x=true;
			}
		}
		return pages;
	},
	/** @private */
	setData : function(data) {
		this.selected = [];
		var win = data.window || {};
		this.window.total = win.total || 0;
		this.window.size = win.size || 0;
		this.window.page = win.page || 0;
		this.buildNavigation();
		this._buildHeaders(data.headers);
		this._buildRows(data.rows);
	},
	/** @private */
	_buildHeaders : function(headers) {
		hui.dom.clear(this.head);
		this.columns = [];
		var tr = hui.build('tr',{parent:this.head});
		hui.each(headers,function(h,i) {
			var th = hui.build('th');
			if (h.width) {
				th.style.width = h.width+'%';
			}
			if (h.sortable) {
				hui.listen(th,'click',function() {this.sort(i)}.bind(this));
				hui.cls.add(th,'sortable');
			}
			th.appendChild(hui.build('span',{text:h.title}));
			tr.appendChild(th);
			this.columns.push(h);
		}.bind(this));
	},
	/** @private */
	_buildRows : function(rows) {
		var self = this;
		hui.dom.clear(this.body);
		this.rows = [];
		if (!rows) return;
		hui.each(rows,function(r,i) {
			var tr = hui.build('tr');
			var icon = r.icon;
			var title = r.title;
			hui.each(r.cells,function(c) {
				var td = hui.build('td');
				if (c.icon) {
					td.appendChild(hui.ui.createIcon(c.icon,16));
					icon = icon || c.icon;
				}
				if (c.text) {
					td.appendChild(document.createTextNode(c.text))
					title = title || c.text;
				}
				tr.appendChild(td);
			})
			self.body.appendChild(tr);
			// TODO: Memory leak!
			var info = {id:r.id,kind:r.kind,icon:icon,title:title,index:i};
			tr.dragDropInfo = info;
			hui.log(this._getData(tr))
			self.rows.push({id:r.id,kind:r.kind,icon:icon,title:title,index:i,data:r.data});
			this.addRowBehavior(tr,i);
		}.bind(this));
	},
	/** @private */
	setObjects : function(objects) {
		objects = objects || [];
		this.selected = [];
		hui.dom.clear(this.body);
		this.rows = [];
		for (var i=0; i < objects.length; i++) {
			var row = hui.build('tr');
			var obj = objects[i];
			var title = null;
			for (var j=0; j < this.columns.length; j++) {
				var cell = hui.build('td');
				if (this.builder) {
					cell.appendChild(this.builder.buildColumn(this.columns[j],obj));
				} else {
					var value = obj[this.columns[j].key] || '';
					if (hui.isArray(value)) {
						for (var k=0; k < value.length; k++) {
							if (value[k].constructor == Object) {
								cell.appendChild(this.createObject(value[k]));
							} else {
								cell.appendChild(hui.build('div',{text:value}));
							}
						};
					} else if (value.constructor == Object) {
						cell.appendChild(this.createObject(value[j]));
					} else {
						hui.dom.addText(cell,value);
						title = title==null ? value : title;
					}
				}
				row.appendChild(cell);
			};
			var info = {id:obj.id,kind:obj.kind,title:title};
			row.dragDropInfo = info;
			this.body.appendChild(row);
			this.addRowBehavior(row,i);
			this.rows.push(obj);
		};
	},
	/** @private */
	createObject : function(object) {
		var node = hui.build('div',{'class':'hui_list_object'});
		if (object.icon) {
			node.appendChild(hui.ui.createIcon(object.icon,16));
		}
		hui.dom.addText(node,object.text || object.name || '')
		return node;
	},
	/** @private */
	addRowBehavior : function(row,index) {
		var self = this;
		row.onmousedown = function(e) {
			if (self.busy) {return};
			var event = hui.event(e);
			var action = event.findByClass('hui_list_icon_action');
			if (!action) {
				self._rowDown(index);
				hui.ui.startDrag(e,row);
				return false;
			}
		}
		row.ondblclick = function(e) {
			if (self.busy) {return};
			self._rowDoubleClick(index,e);
			hui.selection.clear();
			return false;
		}
		row.onclick = function(e) {
			if (self.busy) {return};
			self._rowClick(index,e);
			return false;
		}
	},
	/** @private */
	changeSelection : function(indexes) {
		if (!this.options.selectable) {
			return;
		}
		var rows = this.body.getElementsByTagName('tr'),
			i;
		for (i=0;i<this.selected.length;i++) {
			hui.cls.remove(rows[this.selected[i]],'hui_list_selected');
		}
		for (i=0;i<indexes.length;i++) {
			hui.cls.add(rows[indexes[i]],'hui_list_selected');
		}
		this.selected = indexes;
		this.fire('selectionChanged',this.rows[indexes[0]]);
	},
	_rowClick : function(index,e) {
		e = hui.event(e);
		var a = e.findByClass('hui_list_icon_action');
		if (a) {
			var data = a.getAttribute('data');
			if (data) {
				this.fire('clickIcon',{row:this.rows[index],data:hui.string.fromJSON(data),node:a});
			}
		}
	},
	_rowDown : function(index) {
		this.changeSelection([index]);
	},
	_rowDoubleClick : function(index,e) {
		e = hui.event(e);
		if (!e.findByClass('hui_list_icon_action')) {
			var row = this.getFirstSelection();
			if (row) {
				this.fire('listRowWasOpened',row);
			}			
		}
	},
	/** @private */
	windowPageWasClicked : function(tag) {
		var index = parseInt(tag.getAttribute('data-index'));
		this.window.page = index;
		hui.ui.firePropertyChange(this,'window',this.window);
		hui.ui.firePropertyChange(this,'window.page',this.window.page);
		var as = this.windowPageBody.getElementsByTagName('a');
		for (var i = as.length - 1; i >= 0; i--){
			as[i].className = as[i]==tag ? 'hui_list_selected' : '';
		};
	}
};

/* EOF *//**
 * @constructor
 */
hui.ui.Tabs = function(o) {
	o = o || {};
	this.name = o.name;
	this.element = hui.get(o.element);
	this.activeTab = -1;
	var x = hui.get.firstByClass(this.element,'hui_tabs_bar');
	this.bar = hui.get.firstByTag(x,'ul');
	this.tabs = [];
	var nodes = this.bar.getElementsByTagName('li');
	for (var i=0; i < nodes.length; i++) {
		if (!hui.browser.msie) {
			hui.get.firstByTag(nodes[i],'a').removeAttribute('href');
		}
		this.tabs.push(nodes[i]);
	};
	this.contents = hui.get.byClass(this.element,'hui_tabs_tab');
	this.addBehavior();
	hui.ui.extend(this);
}

hui.ui.Tabs.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('div',{'class':'hui_tabs'});
	var cls = 'hui_tabs_bar';
	if (options.small) {
		cls+=' hui_tabs_bar_small';
	}
	if (options.centered) {
		cls+=' hui_tabs_bar_centered';
	}
	var bar = hui.build('div',{'class' : cls, parent : e});
	hui.build('ul',{parent:bar});
	return new hui.ui.Tabs(options);
}

hui.ui.Tabs.prototype = {
	/** @private */
	addBehavior : function() {
		for (var i=0; i < this.tabs.length; i++) {
			this.addTabBehavior(this.tabs[i],i);
		};
	},
	/** @private */
	addTabBehavior : function(tab,index) {	
		hui.listen(tab,'click',function() {
			this.tabWasClicked(index);
		}.bind(this))
	},
	/** @private */
	registerTab : function(obj) {
		obj.parent = this;
		this.tabs.push(obj);
	},
	/** @private */
	tabWasClicked : function(index) {
		this.activeTab = index;
		this.updateGUI();
		hui.ui.callVisible(this);
	},
	/** @private */
	updateGUI : function() {
		for (var i=0; i < this.tabs.length; i++) {
			hui.cls.set(this.tabs[i],'hui_tabs_selected',i==this.activeTab);
			this.contents[i].style.display = i==this.activeTab ? 'block' : 'none';
		};
	},
	createTab : function(options) {
		options = options || {};
		var tab = hui.build('li',{html:'<a><span><span>'+hui.string.escape(options.title)+'</span></span></a>',parent:this.bar});
		this.addTabBehavior(tab,this.tabs.length);
		this.tabs.push(tab);
		var e = options.element = hui.build('div',{'class':'hui_tabs_tab'});
		if (options.padding>0) {
			e.style.padding = options.padding+'px';
		}
		this.contents.push(e);
		this.element.appendChild(e);
		if (this.activeTab==-1) {
			this.activeTab=0;
			hui.cls.add(tab,'hui_tabs_selected');
		} else {
			e.style.display='none';
		}
		return new hui.ui.Tab(options);
	}
};

/**
 * @constructor
 */
hui.ui.Tab = function(o) {
	this.name = o.name;
	this.element = hui.get(o.element);
}

hui.ui.Tab.prototype = {
	add : function(widget) {
		this.element.appendChild(widget.element);
	}
}

/* EOF *//**
 * @constructor
 */
hui.ui.ObjectList = function(o) {
	this.options = hui.override({key:null},o);
	this.name = o.name;
	this.element = hui.get(o.element);
	this.body = hui.get.firstByTag(this.element,'tbody');
	this.template = [];
	this.objects = [];
	hui.ui.extend(this);
}

hui.ui.ObjectList.create = function(o) {
	o=o || {};
	var e = o.element = hui.build('table',{'class':'hui_objectlist',cellpadding:'0',cellspacing:'0'});
	if (o.template) {
		var head = '<thead><tr>';
		for (var i=0; i < o.template.length; i++) {
			head+='<th>'+(o.template[i].label || '')+'</th>';
		};
		head+='</tr></thead>';
		e.innerHTML=head;
	}
	hui.build('tbody',{parent:e});
	var list = new hui.ui.ObjectList(o);
	if (o.template) {
		hui.each(o.template,function(item) {
			list.registerTemplateItem(new hui.ui.ObjectList.Text(item.key));
		});
	}
	return list;
}

hui.ui.ObjectList.prototype = {
	ignite : function() {
		this.addObject({});
	},
	addObject : function(data,addToEnd) {
		var obj;
		if (this.objects.length==0 || addToEnd) {
			obj = new hui.ui.ObjectList.Object(this.objects.length,data,this);
			this.objects.push(obj);
			this.body.appendChild(obj.getElement());
		} else {
			var last = this.objects[this.objects.length-1];
			hui.array.remove(this.objects,last);
			obj = new hui.ui.ObjectList.Object(last.index,data,this);
			last.index++;
			this.objects.push(obj);
			this.objects.push(last);
			this.body.insertBefore(obj.getElement(),last.getElement())
		}
	},
	reset : function() {
		for (var i=0; i < this.objects.length; i++) {
			var element = this.objects[i].getElement();
			if (!element.parentNode) {
				hui.log('no parent for...');
				hui.log(element);
			} else {
				element.parentNode.removeChild(element);
			}
		};
		this.objects = [];
		this.addObject({});
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
	},
	getLabel : function() {
		return this.options.label;
	}
}

/********************** Object ********************/

/** @constructor */
hui.ui.ObjectList.Object = function(index,data,list) {
	this.data = data;
	this.index = index;
	this.list = list;
	this.fields = [];
}

hui.ui.ObjectList.Object.prototype = {
	getElement : function() {
		if (!this.element) {
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

hui.ui.ObjectList.Text = function(key) {
	this.key = key;
	this.value = null;
}

hui.ui.ObjectList.Text.prototype = {
	clone : function() {
		return new hui.ui.ObjectList.Text(this.key);
	},
	getElement : function() {
		var input = hui.build('input',{'class':'hui_formula_text'});
		var field = hui.ui.wrapInField(input);
		this.wrapper = new hui.ui.Input({element:input});
		this.wrapper.listen(this);
		return field;
	},
	$valueChanged : function(value) {
		this.value = value;
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

hui.ui.ObjectList.Select = function(key) {
	this.key = key;
	this.value = null;
	this.options = [];
}

hui.ui.ObjectList.Select.prototype = {
	clone : function() {
		var copy = new hui.ui.ObjectList.Select(this.key);
		copy.options = this.options;
		return copy;
	},
	getElement : function() {
		this.select = hui.build('select');
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

/* EOF */////////////////////////// DropDown ///////////////////////////

/**
 * A drop down selector
 * @constructor
 */
hui.ui.DropDown = function(o) {
	this.options = hui.override({label:null,placeholder:null,url:null,source:null},o);
	this.name = o.name;
	var e = this.element = hui.get(o.element);
	this.inner = e.getElementsByTagName('strong')[0];
	this.items = o.items || [];
	this.index = -1;
	this.value = this.options.value || null;
	this.dirty = true;
	this.busy = false;
	hui.ui.extend(this);
	this._addBehavior();
	this._updateIndex();
	this._updateUI();
	if (this.options.url) {
		this.options.source = new hui.ui.Source({url:this.options.url,delegate:this});
	} else if (this.options.source) {
		this.options.source.listen(this);
	}
}

hui.ui.DropDown.create = function(options) {
	options = options || {};
	options.element = hui.build('a',{
		'class':'hui_dropdown',href:'javascript://',
		html:'<span><span><strong></strong></span></span>'
	});
	return new hui.ui.DropDown(options);
}

hui.ui.DropDown.prototype = {
	/** @private */
	_addBehavior : function() {
		hui.ui.addFocusClass({element:this.element,'class':'hui_dropdown_focused'});
		hui.listen(this.element,'click',this._click.bind(this));
		hui.listen(this.element,'blur',this._hideSelector.bind(this));
		hui.listen(this.element,'keydown',this._keyDown.bind(this));
	},
	/** @private */
	_updateIndex : function() {
		this.index=-1;
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i].value==this.value) {
				this.index=i;
			}
		};
	},
	/** @private */
	_updateUI : function() {
		var selected = this.items[this.index];
		if (selected) {
			var text = selected.label || selected.title || selected.text || '';
			this.inner.innerHTML='';
			hui.dom.addText(this.inner,hui.string.wrap(text));
		} else if (this.options.placeholder) {
			this.inner.innerHTML='';
			this.inner.appendChild(hui.build('em',{text:hui.string.escape(this.options.placeholder)}));
		} else {
			this.inner.innerHTML='';
		}
		if (!this.selector) {
			return;
		}
		var as = this.selector.getElementsByTagName('a');
		for (var i=0; i < as.length; i++) {
			if (this.index==i) {
				hui.cls.add(as[i],'hui_selected');
			} else {
				as[i].className='';
			}
		};
	},
	/** @private */
	_click : function(e) {
		if (this.busy) {return}
		hui.stop(e);
		this._buildSelector();
		var el = this.element, s=this.selector;
		el.focus();
		if (!this.items) return;
		var docHeight = hui.document.getHeight();
		if (docHeight<200) {
			var left = hui.position.getLeft(this.element);
			hui.style.set(this.selector,{'left':left+'px',top:'5px'});
		} else {
			var windowScrollTop = hui.window.getScrollTop();
			var scrollOffsetTop = hui.position.getScrollOffset(this.element).top;
			var scrollTop = windowScrollTop-scrollOffsetTop;
			hui.position.place({
				target : {element:this.element,vertical:1,horizontal:0},
				source : {element:this.selector,vertical:0,horizontal:0},
				top : scrollTop
			});
		}
		hui.style.set(s,{visibility:'hidden',display:'block',width:''});
		var height = Math.min(docHeight-hui.position.getTop(s)-5,200);
		var width = Math.max(el.clientWidth-5,100,s.clientWidth+20);
		var space = hui.window.getViewWidth()-hui.position.getLeft(el)-20;
		width = Math.min(width,space);
		hui.style.set(s,{visibility:'visible',width:width+'px',zIndex:hui.ui.nextTopIndex(),maxHeight:height+'px'});
	},
	/** @private */
	_keyDown : function(e) {
		if (this.busy) {return}
		if (this.items.length==0) {
			return;
		}
		if (e.keyCode==40) {
			hui.stop(e);
			if (this.index>=this.items.length-1) {
				this.value=this.items[0].value;
			} else {
				this.value=this.items[this.index+1].value;
			}
			this._updateIndex();
			this._updateUI();
			this._fireChange();
		} else if (e.keyCode==38) {
			hui.stop(e);
			if (this.index>0) {
				this.index--;
			} else {
				this.index = this.items.length-1;
			}
			this.value = this.items[this.index].value;
			this._updateUI();
			this._fireChange();
		}
	},
	selectFirst : function() {
		if (this.items.length>0) {
			this.setValue(this.items[0].value);
		}
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		this.value = value;
		this._updateIndex();
		this._updateUI();
	},
	reset : function() {
		this.setValue(null);
	},
	getLabel : function() {
		return this.options.label;
	},
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	stress : function() {
		hui.ui.stress(this);
	},
	focus : function() {
		try {this.element.focus()} catch (ignore) {}
	},
	// TODO: Is this used?
	getItem : function() {
		if (this.index>=0) {
			return this.items[this.index];
		}
		return 0;
	},
	addItem : function(item) {
		this.items.push(item);
		this.dirty = true;
		this._updateIndex();
		this._updateUI();
	},
	setItems : function(items) {
		this.items = items;
		this.dirty = true;
		this.index = -1;
		this._updateIndex();
		this._updateUI();
	},
	/** @private */
	$itemsLoaded : function(items) {
		this.setItems(items);
	},
	/** @private */
	$sourceIsBusy : function() {
		this.busy = true;
		hui.style.setOpacity(this.element,.5);
	},
	$sourceIsNotBusy : function() {
		this.busy = false;
		hui.style.setOpacity(this.element,1);
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return hui.dom.isVisible(this.element);
	},
	/** @private */
	$visibilityChanged : function() {
		if (hui.dom.isVisible(this.element)) {
			if (this.options.source) {
				// If there is a source, make sure it is initially 
				this.options.source.refreshFirst();
			}			
		} else {
			this._hideSelector();
		}
	},
	/** @private */
	_hideSelector : function() {
		if (!this.selector) {return}
		this.selector.style.display='none';
	},
	/** @private */
	_buildSelector : function() {
		if (!this.dirty || !this.items) {return};
		if (!this.selector) {
			this.selector = hui.build('div',{'class':'hui_dropdown_selector'});
			document.body.appendChild(this.selector);
			hui.listen(this.selector,'mousedown',function(e) {hui.stop(e)});
		} else {
			this.selector.innerHTML='';
		}
		var self = this;
		hui.each(this.items,function(item,i) {
			var e = hui.build('a',{href:'javascript://',text : item.label || item.title || item.text || ''});
			hui.listen(e,'mousedown',function(e) {
				hui.stop(e);
				self._itemClicked(item,i);
			})
			if (i==self.index) {
				hui.cls.add(e,'hui_selected')
			};
			self.selector.appendChild(e);
		});
		this.dirty = false;
	},
	/** @private */
	_itemClicked : function(item,index) {
		this.index = index;
		var changed = this.value!=this.items[index].value;
		this.value = this.items[index].value;
		this._updateUI();
		this._hideSelector();
		if (changed) {
			this._fireChange();
		}
	},
	_fireChange : function() {
		hui.ui.callAncestors(this,'childValueChanged',this.value);
		this.fire('valueChanged',this.value);
		hui.ui.firePropertyChange(this,'value',this.value);
	}
}/**
 * An alert
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  modal : «true | <strong>false</strong>»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Alert = function(options) {
	this.options = hui.override({modal:false},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	this.body = hui.get.firstByClass(this.element,'hui_alert_body');
	this.content = hui.get.firstByClass(this.element,'hui_alert_content');
	this.emotion = this.options.emotion;
	this.title = hui.get.firstByTag(this.element,'h1');
	hui.ui.extend(this);
}

/**
 * Creates a new instance of an alert
 * <pre><strong>options:</strong> {
 *  title : «String»,
 *  text : «String»,
 *  emotion: «'smile' | 'gasp'»,
 *
 *  modal : «true | <strong>false</strong>»,
 *  name : «String»
 * }
 * </pre>
 * @static
 * @param {Object} options The options
 */
hui.ui.Alert.create = function(options) {
	options = hui.override({title:'',text:'',emotion:null,title:null},options);
	
	var element = options.element = hui.build('div',{'class':'hui_alert'});
	var body = hui.build('div',{'class':'hui_alert_body',parent:element});
	hui.build('div',{'class':'hui_alert_content',parent:body});
	document.body.appendChild(element);
	var obj = new hui.ui.Alert(options);
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

hui.ui.Alert.prototype = {
	/** Shows the alert */
	show : function() {
		var zIndex = hui.ui.nextAlertIndex();
		if (this.options.modal) {
			hui.ui.showCurtain({widget:this,zIndex:zIndex});
			zIndex++;
		}
		this.element.style.zIndex=zIndex;
		this.element.style.display='block';
		this.element.style.top=(hui.window.getScrollTop()+100)+'px';
		hui.animate(this.element,'opacity',1,200);
		hui.animate(this.element,'margin-top','40px',600,{ease:hui.ease.elastic});
	},
	/** Hides the alert */
	hide : function() {
		hui.animate(this.element,'opacity',0,200,{hideOnComplete:true});
		hui.animate(this.element,'margin-top','0px',200);
		hui.ui.hideCurtain(this);
	},
	/** Sets the alert title
	 * @param {String} text The new title
	 */
	setTitle : function(text) {
		if (!this.title) {
			this.title = hui.build('h1',{parent:this.content});
		}
		hui.dom.setText(this.title,text);
		
	},
	/** Sets the alert text
	 * @param {String} text The new text
	 */
	setText : function(text) {
		if (!this.text) {
			this.text = hui.build('p',{parent:this.content});
		}
		hui.dom.setText(this.text,text || '');
	},
	/** Sets the alert emotion
	 * @param {String} emotion Can be 'smile' or 'gasp'
	 */
	setEmotion : function(emotion) {
		if (this.emotion) {
			hui.cls.remove(this.body,this.emotion);
		}
		this.emotion = emotion;
		hui.cls.add(this.body,emotion);
	},
	/** Updates multiple properties
	 * @param {Object} options {title: «String», text: «String», emotion: «'smile' | 'gasp'»}
	 */
	update : function(options) {
		options = options || {};
		this.setTitle(options.title || null);
		this.setText(options.text || null);
		this.setEmotion(options.emotion || null);
	},
	/** Adds a Button to the alert
	 * @param {hui.ui.Button} button The button to add
	 */
	addButton : function(button) {
		if (!this.buttons) {
			this.buttons = hui.ui.Buttons.create({align:'right'});
			this.body.appendChild(this.buttons.element);
		}
		this.buttons.add(button);
	}
}

/* EOF *//**
 * A push button
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  data : «Object»,
 *  confirm : {text : «String», okText : «String», cancelText : «String»},
 *  submit : «Boolean»
 * }
 *
 * <strong>Events:</strong>
 * $click(button) - When the button is clicked (and possibly confirmed)
 * </pre>
 * @param options {Object} The options
 * @constructor
 */
hui.ui.Button = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	this.enabled = !hui.cls.has(this.element,'hui_button_disabled');
	hui.ui.extend(this);
	this.addBehavior();
}

/**
 * Creates a new button
 * <pre><strong>options:</strong> {
 *  text : «String»,
 *  title : «String», // deprecated
 *  highlighted : «true | <strong>false</strong>»,
 *  enabled : «<strong>true</strong> | false»,
 *  icon : «String»,
 *
 *  name : «String»,
 *  data : «Object»,
 *  confirm : {text : «String», okText : «String», cancelText : «String»},
 *  submit : «Boolean»
 * }
 * </pre>
 */
hui.ui.Button.create = function(options) {
	options = hui.override({text:'',highlighted:false,enabled:true},options);
	var className = 'hui_button'+(options.highlighted ? ' hui_button_highlighted' : '');
	if (options.small) {
		className+=' hui_button_small'+(options.highlighted ? ' hui_button_small_highlighted' : '');
	}
	if (!options.enabled) {
		className+=' hui_button_disabled';
	}
	var element = options.element = hui.build('a',{'class':className,href:'javascript://'});
	var element2 = document.createElement('span');
	element.appendChild(element2);
	var element3 = document.createElement('span');
	element2.appendChild(element3);
	if (options.icon) {
		var icon = hui.build('em',{'class':'hui_button_icon',style:'background-image:url('+hui.ui.getIconUrl(options.icon,16)+')'});
		if (!options.text || options.text.length==0) {
			hui.cls.add(icon,'hui_button_icon_notext');
		}
		element3.appendChild(icon);
	}
	if (options.text && options.text.length>0) {
		hui.dom.addText(element3,options.text);
	}
	if (options.title && options.title.length>0) {
		hui.dom.addText(element3,options.title);
	}
	return new hui.ui.Button(options);
}

hui.ui.Button.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		hui.listen(this.element,'mousedown',function(e) {
			hui.stop(e);
		});
		hui.listen(this.element,'click',function(e) {
			hui.stop(e);
			self._onClick();
		});
	},
	_onClick : function() {
		if (this.enabled) {
			if (this.options.confirm) {
				hui.ui.confirmOverlay({
					widget : this,
					text : this.options.confirm.text,
					okText : this.options.confirm.okText,
					cancelText : this.options.confirm.cancelText,
					onOk : this._fireClick.bind(this)
				});
			} else {
				this._fireClick();
			}
		} else {
			this.element.blur();
		}
	},
	_fireClick : function() {
		this.fire('click');
		if (this.options.submit) {
			var form = hui.ui.getAncestor(this,'hui_formula');
			if (form) {
				form.submit();
			} else {
				hui.log('No form found to submit');
			}
		}
	},
	/** Registers a function as a click listener or issues a click
	 * @param func? {Function} The function to run when clicked, leave out to issue a click
	 */
	click : function(func) {
		if (func) {
			this.listen({$click:func});
			return this;
		} else {
			this._onClick();
		}
	},
	/** Focus the button */
	focus : function() {
		this.element.focus();
	},
	/** Registers a function as a click handler
	 * @param func {Function} The fundtion to invoke when clicked click
	 */
	onClick : function(func) {
		this.listen({$click:func});
	},
	/** Enables or disables the button
	 * @param enabled {Boolean} If the button should be enabled
	 */
	setEnabled : function(enabled) {
		this.enabled = enabled;
		this._updateUI();
	},
	/** Enables the button */
	enable : function() {
		this.setEnabled(true);
	},
	/** Disables the button */
	disable : function() {
		this.setEnabled(false);
	},
	/** Sets whether the button is highlighted
	 * @param highlighted {Boolean} If the button should be highlighted
	 */
	setHighlighted : function(highlighted) {
		hui.cls.set(this.element,'hui_button_highlighted',highlighted);
	},
	_updateUI : function() {
		hui.cls.set(this.element,'hui_button_disabled',!this.enabled);
	},
	/** Sets the button text
	 * @param
	 */
	setText : function(text) {
		hui.dom.setText(this.element.getElementsByTagName('span')[1], text);
	},
	/**
	 * Get the data object for the button
	 * @returns {Object} The data object
	 */
	getData : function() {
		return this.options.data;
	}
}

////////////////////////////////// Buttons /////////////////////////////

/** @constructor */
hui.ui.Buttons = function(o) {
	this.name = o.name;
	this.element = hui.get(o.element);
	this.body = hui.get.firstByClass(this.element,'hui_buttons_body');
	hui.ui.extend(this);
}

hui.ui.Buttons.create = function(o) {
	o = hui.override({top:0},o);
	var e = o.element = hui.build('div',{'class':'hui_buttons'});
	if (o.align=='right') {
		hui.cls.add(e,'hui_buttons_right');
	}
	if (o.align=='center') {
		hui.cls.add(e,'hui_buttons_center');
	}
	if (o.top>0) {
		e.style.paddingTop=o.top+'px';
	}
	hui.build('div',{'class':'hui_buttons_body',parent:e});
	return new hui.ui.Buttons(o);
}

hui.ui.Buttons.prototype = {
	add : function(widget) {
		this.body.appendChild(widget.element);
		return this;
	}
}

/* EOF *//**
 * @constructor
 * @param {Object} options The options : {value:null}
 */
hui.ui.Selection = function(options) {
	this.options = hui.override({value:null},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	this.items = [];
	this.subItems = [];
	this.busy = 0;
	this.selection=null;
	if (options.items && options.items.length>0) {
		for (var i=0; i < options.items.length; i++) {
			var item = options.items[i];
			this.items.push(item);
			var element = hui.get(item.id);
			item.element = element;
			this.addItemBehavior(element,item);
		};
		this.selection = this.getSelectionWithValue(this.options.value);
		this.updateUI();
	} else if (this.options.value!=null) {
		this.selection = {value:this.options.value};
	}
	hui.ui.extend(this);
}

/**
 * Creates a new selection widget
 * @param {Object} options The options : {width:0}
 */
hui.ui.Selection.create = function(options) {
	options = hui.override({width:0},options);
	var e = options.element = hui.build('div',{'class':'hui_selection'});
	if (options.width>0) {
		e.style.width = options.width+'px';
	}
	return new hui.ui.Selection(options);
}

hui.ui.Selection.prototype = {
	/** Get the selected item
	 * @returns {Object} The selected item, null if no selection */
	getValue : function() {
		return this.selection;
	},
	valueForProperty : function(p) {
		if (p==='value') {
			return this.selection ? this.selection.value : null;
		} else if (p==='kind') {
			return this.selection ? this.selection.kind : null;
		}
		return undefined;
	},
	/** Set the selected item
	 * @param {Object} value The selected item */
	setValue : function(value) {
		var item = this.getSelectionWithValue(value);
		if (item===null) {
			this.selection = null;
		} else {
			this.selection = item;
			this.kind=item.kind;
		}
		this.updateUI();
		this.fireChange();
	},
	/** @private */
	getSelectionWithValue : function(value) {
		var i;
		for (i=0; i < this.items.length; i++) {
			if (this.items[i].value==value) {
				return this.items[i];
			}
		};
		for (i=0; i < this.subItems.length; i++) {
			var items = this.subItems[i].items;
			for (var j=0; j < items.length; j++) {
				if (items[j].value==value) {
					return items[j];
				}
			};
		};
		return null;
	},
	/** Changes selection to the first item */
	selectFirst : function() {
		hui.log('selecting first')
		var i;
		for (i=0; i < this.items.length; i++) {
			this.changeSelection(this.items[i]);
			return;
		};
		for (i=0; i < this.subItems.length; i++) {
			var items = this.subItems[i].items;
			for (var j=0; j < items.length; j++) {
				this.changeSelection(items[j]);
				return;
			};
		};
	},
	/** Set the value to null */
	reset : function() {
		this.setValue(null);
	},
	
	addItems : function(options) {
		options.element = hui.build('div',{parent:this.element});
		var items = new hui.ui.Selection.Items(options);
		items.parent = this;
		this.subItems.push(items);
	},
	
	
	/** @private */
	updateUI : function() {
		var i;
		for (i=0; i < this.items.length; i++) {
			hui.cls.set(this.items[i].element,'hui_selected',this.isSelection(this.items[i]));
		};
		for (i=0; i < this.subItems.length; i++) {
			this.subItems[i].updateUI();
		};
	},
	/** @private */
	changeSelection : function(item) {
		for (var i=0; i < this.subItems.length; i++) {
			this.subItems[i].selectionChanged(this.selection,item);
		};
		this.selection = item;
		this.updateUI();
		this.fireChange();
	},
	/** @private */
	fireChange : function() {
		this.fire('selectionChanged',this.selection);
		this.fireProperty('value',this.selection ? this.selection.value : null);
		this.fireProperty('kind',this.selection ? this.selection.kind : null);
		for (var i=0; i < this.subItems.length; i++) {
			this.subItems[i].parentValueChanged();
		};
	},
	/** @private */
	registerItems : function(items) {
		items.parent = this;
		this.subItems.push(items);
	},
	/** @private
	
	registerItem : function(id,title,icon,badge,value,kind) {
		var element = hui.get(id);
		var item = {id:id,title:title,icon:icon,badge:badge,element:element,value:value,kind:kind};
		this.items.push(item);
		this.addItemBehavior(element,item);
		this.selection = this.getSelectionWithValue(this.options.value);
	},
	*/
	/** @private */
	addItemBehavior : function(node,item) {
		hui.listen(node,'click',function() {
			this.itemWasClicked(item);
		}.bind(this));
		hui.listen(node,'dblclick',function(e) {
			hui.stop(e);
			this.itemWasDoubleClicked(item);
		}.bind(this));
		node.dragDropInfo = item;
	},
	/** Untested!! */
	setObjects : function(items) {
		this.items = [];
		hui.each(items,function(item) {
			this.items.push(item);
			var node = hui.build('div',{'class':'hui_selection_item'});
			item.element = node;
			this.element.appendChild(node);
			var inner = hui.build('span',{'class':'hui_selection_label',text:item.title});
			if (item.icon) {
				node.appendChild(hui.ui.createIcon(item.icon,16));
			}
			node.appendChild(inner);
			hui.listen(node,'click',function() {
				this.itemWasClicked(item);
			}.bind(this));
			hui.listen(node,'dblclick',function(e) {
				hui.stop(e);
				this.itemWasDoubleClicked(item);
			}.bind(this));
		}.bind(this));
	},
	/** @private */
	isSelection : function(item) {
		if (this.selection===null) {
			return false;
		}
		var selected = item.value==this.selection.value;
		if (this.selection.kind) {
			selected = selected && item.kind==this.selection.kind;
		}
		return selected;
	},
	
	/** @private */
	itemWasClicked : function(item) {
		if (this.busy>0) {return}
		this.changeSelection(item);
	},
	/** @private */
	itemWasDoubleClicked : function(item) {
		if (this.busy>0) {return}
		this.fire('selectionWasOpened',item);
	},
	_setBusy : function(busy) {
		this.busy+= busy ? 1 : -1;
		window.clearTimeout(this.busytimer);
		if (this.busy>0) {
			var e = this.element;
			this.busytimer = window.setTimeout(function() {
				hui.cls.add(e,'hui_selection_busy');
			},300);
		} else {
			hui.cls.remove(this.element,'hui_selection_busy');
		}
	},
	_checkValue : function() {
		if (!this.selection) {return}
		var item = this.getSelectionWithValue(this.selection.value);
		if (!item) {
			hui.log('Value not found: '+this.selection.value);
			if (!this.busy) {
				this.selectFirst();
			} else {
				hui.log('Will not select first since im still busy');
			}
		}
	},
	show : function() {
		this.element.style.display='';
	},
	hide : function() {
		this.element.style.display='none';
	}
}

/////////////////////////// Items ///////////////////////////

/**
 * @constructor
 * A group of items loaded from a source
 * @param {Object} options The options : {element,name,source}
 */
hui.ui.Selection.Items = function(options) {
	this.options = hui.override({source:null},options);
	this.element = hui.get(options.element);
	this.title = hui.get(this.element.id+'_title');
	this.name = options.name;
	this.disclosed = {};
	this.parent = null;
	this.items = [];
	hui.ui.extend(this);
	if (this.options.source) {
		this.options.source.listen(this);
	}
}

hui.ui.Selection.Items.prototype = {
	/**
	 * Refresh the underlying source
	 */
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	/** @private */
	$objectsLoaded : function(objects) {
		this.$itemsLoaded(objects);
	},
	/** @private */
	$itemsLoaded : function(items) {
		this.items = [];
		this.element.innerHTML='';
		this.buildLevel(this.element,items,0,true);
		if (this.title) {
			this.title.style.display=this.items.length>0 ? 'block' : 'none';
		}
		this.parent.updateUI();
		this.parent._checkValue();
	},
	$sourceIsBusy : function() {
		this.parent._setBusy(true);
	},
	/** @private */
	$sourceIsNotBusy : function() {
		this.parent._setBusy(false);
	},
	/** @private */
	buildLevel : function(parent,items,inc,open) {
		if (!items) return;
		var hierarchical = this.isHierarchy(items);
		var level = hui.build('div',{'class':'hui_selection_level',style:(open ? 'display:block' : 'display:none'),parent:parent});
		hui.each(items,function(item) {
			if (item.type=='title') {
				hui.build('div',{'class':'hui_selection_title',html:'<span>'+item.title+'</span>',parent:level});
				return;
			}
			var hasChildren = item.children && item.children.length>0;
			var left = inc*16+6;
			if (!hierarchical && inc>0 || hierarchical && !hasChildren) {
				left+=13;
			}
			var node = hui.build('div',{'class':'hui_selection_item'});
			node.style.paddingLeft = left+'px';
			if (item.badge) {
				node.appendChild(hui.build('strong',{'class':'hui_selection_badge',text:item.badge}));
			}
			var subOpen = false;
			if (hierarchical && hasChildren) {
				var self = this;
				subOpen = this.disclosed[item.value]
				var cls = this.disclosed[item.value] ? 'hui_disclosure hui_disclosure_open' : 'hui_disclosure';
				var disc = hui.build('span',{'class':cls,parent:node});
				hui.listen(disc,'click',function(e) {
					hui.stop(e);
					self.toggle(disc,item);
				});
			}
			var inner = hui.build('span',{'class':'hui_selection_label',text:item.title});
			if (item.icon) {
				node.appendChild(hui.build('span',{'class':'hui_icon_1',style:'background-image: url('+hui.ui.getIconUrl(item.icon,16)+')'}));
			}
			node.appendChild(inner);
			hui.listen(node,'click',function(e) {
				this.parent.itemWasClicked(item);
			}.bind(this));
			hui.listen(node,'dblclick',function(e) {
				hui.stop(e);
				this.parent.itemWasDoubleClicked(item);
			}.bind(this));
			level.appendChild(node);
			var info = {title:item.title,icon:item.icon,badge:item.badge,kind:item.kind,element:node,value:item.value};
			node.dragDropInfo = info;
			this.items.push(info);
			this.buildLevel(level,item.children,inc+1,subOpen);
		}.bind(this));
	},
	/** @private */
	toggle : function(node,item) {
		if (hui.cls.has(node,'hui_disclosure_open')) {
			this.disclosed[item.value] = false;
			hui.get.next(node.parentNode).style.display='none';
			hui.cls.remove(node,'hui_disclosure_open');
		} else {
			this.disclosed[item.value] = true;
			hui.get.next(node.parentNode).style.display='block';
			hui.cls.add(node,'hui_disclosure_open');
		}
	},
	/** @private */
	isHierarchy : function(items) {
		if (!items) {return false};
		for (var i=0; i < items.length; i++) {
			if (items[i]!==null && items[i].children && items[i].children.length>0) {
				return true;
			}
		};
		return false;
	},
	/** Get the selection of this items group
	 * @returns {Object} The selected item or null */
	getValue : function() {
		if (this.parent.selection==null) {
			return null;
		}
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i].value == this.parent.selection.value) {
				return this.items[i];
			}
		};
		return null;
	},
	/** @private */
	updateUI : function() {
		for (var i=0; i < this.items.length; i++) {
			hui.cls.set(this.items[i].element,'hui_selected',this.parent.isSelection(this.items[i]));
		};
	},
	/** @private */
	selectionChanged : function(oldSelection,newSelection) {
		for (var i=0; i < this.items.length; i++) {
			var value = this.items[i].value;
			if (value == newSelection.value) {
				this.fireProperty('value',newSelection.value);
				return;
			}
		};
		this.fireProperty('value',null);
	},
	/**
	 * Called when the parent changes value, must fire its new value
	 * @private
	 */
	parentValueChanged : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.parent.isSelection(this.items[i])) {
				this.fireProperty('value',this.items[i].value);
				return;
			}
		};
		this.fireProperty('value',null);
	}
}
/* EOF */
/** @constructor */
hui.ui.Toolbar = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.Toolbar.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{
		'class' : options.labels ? 'hui_toolbar hui_toolbar_nolabels' : 'hui_toolbar'
	});
	return new hui.ui.Toolbar(options);
}

hui.ui.Toolbar.prototype = {
	add : function(widget) {
		this.element.appendChild(widget.getElement());
	},
	addDivider : function() {
		this.element.appendChild(hui.build('span',{'class':'hui_divider'}));
	},
	setSelection : function(key) {
		var desc = hui.ui.getDescendants(this);
		for (var i=0; i < desc.length; i++) {
			var widget = desc[i];
			if (widget.setSelected) {
				widget.setSelected(widget.key==key);
			}
		};
	}
}



/////////////////////// Revealing toolbar ////////////////////////

/** @constructor */
hui.ui.RevealingToolbar = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.RevealingToolbar.create = function(options) {
	options = options || {};
	options.element = hui.build( 'div', {
		className : 'hui_revealing_toolbar',
		style : 'display:none',
		parent : document.body
	});
	var bar = new hui.ui.RevealingToolbar(options);
	bar.setToolbar(hui.ui.Toolbar.create());
	return bar;
}

hui.ui.RevealingToolbar.prototype = {
	setToolbar : function(widget) {
		this.toolbar = widget;
		this.element.appendChild(widget.getElement());
	},
	getToolbar : function() {
		return this.toolbar;
	},
	show : function(instantly) {
		this.element.style.display='';
		hui.animate(this.element,'height','58px',instantly ? 0 : 600,{ease:hui.ease.slowFastSlow});
	},
	hide : function() {
		hui.animate(this.element,'height','0px',500,{ease:hui.ease.slowFastSlow,hideOnComplete:true});
	}
}



/////////////////////// Icon ///////////////////

/** @constructor */
hui.ui.Toolbar.Icon = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.key = options.key;
	this.enabled = !hui.cls.has(this.element,'hui_toolbar_icon_disabled');
	this.element.tabIndex=this.enabled ? 0 : -1;
	this.icon = hui.get.firstByClass(this.element,'hui_icon');
	if (!hui.browser.msie) {
		this.element.removeAttribute('href');
	}
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.Toolbar.Icon.create = function(options) {
	var element = options.element = hui.build('a',{'class':'hui_toolbar_icon'});
	var icon = hui.build('span',{'class':'hui_icon',style:'background-image: url('+hui.ui.getIconUrl(options.icon,32)+')'});
	var inner = hui.build('span',{'class':'hui_toolbar_inner_icon',parent:element});
	var innerest = hui.build('span',{'class':'hui_toolbar_inner_icon',parent:inner});
	var title = hui.build('strong',{text:options.title});
	if (options.overlay) {
		hui.build('span',{'class':'hui_icon_overlay',parent:icon,style:'background-image: url('+hui.ui.getIconUrl('overlay/'+options.overlay,32)+')'});
	}
	innerest.appendChild(icon);
	innerest.appendChild(title);
	return new hui.ui.Toolbar.Icon(options);
}

hui.ui.Toolbar.Icon.prototype = {
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
		this.element.tabIndex=enabled ? 0 : -1;
		hui.cls.set(this.element,'hui_toolbar_icon_disabled',!this.enabled);
	},
	/** Disables the icon */
	disable : function() {
		this.setEnabled(false);
	},
	/** Enables the icon */
	enable : function() {
		this.setEnabled(true);
	},
	setOverlay : function(overlay) {
		var node = hui.get.firstByClass(this.element,'hui_icon_overlay');
		if (node && !overlay) {
			node.style.backgroundImage = '';
		} else if (node && overlay) {
			node.style.backgroundImage = "url('"+hui.ui.getIconUrl('overlay/'+overlay,32)+"')";
		} else if (overlay) {
			var parent = hui.get.firstByClass(this.element,'hui_icon');
			hui.build('span',{'class':'hui_icon_overlay',parent:parent,style:'background-image: url('+hui.ui.getIconUrl('overlay/'+overlay,32)+')'});
		}
	},
	/** Sets wether the icon should be selected */
	setSelected : function(selected) {
		if (selected) {
			this.element.blur();
		}
		hui.cls.set(this.element,'hui_toolbar_icon_selected',selected);
	},
	/** @private */
	wasClicked : function() {
		if (this.enabled) {
			if (this.options.confirm) {
				hui.ui.confirmOverlay({
					widget:this,
					text:this.options.confirm.text,
					okText:this.options.confirm.okText,
					cancelText:this.options.confirm.cancelText,
					onOk:this.fireClick.bind(this)
				});
			} else {
				this.fireClick();
			}
		}
	},
	/** @private */
	fireClick : function() {
		hui.ui.callDelegates(this,'toolbarIconWasClicked');
		hui.ui.callDelegates(this,'click');
	}
}


/////////////////////// Search field ///////////////////////

/** @constructor */
hui.ui.Toolbar.SearchField = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.field = hui.get.firstByTag(this.element,'input');
	this.value = this.field.value;
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.Toolbar.SearchField.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{
		'class' : options.adaptive ? 'hui_toolbar_search hui_toolbar_search_adaptive' : 'hui_toolbar_search',
		html : '<div class="hui_searchfield"><strong class="hui_searchfield_button"></strong><div><div><input type="text"/></div></div></div>'+
		'<span>'+hui.string.escape(options.title)+'</span>'
	});
	return new hui.ui.Toolbar.SearchField(options);
}

hui.ui.Toolbar.SearchField.prototype = {
	getValue : function() {
		return this.field.value;
	},
	addBehavior : function() {
		var self = this;
		this.field.onkeyup = function() {
			self.fieldChanged();
		}
		if (!this.options.adaptive) {
			this.field.onfocus = function() {
				hui.animate(this,'width','120px',500,{ease:hui.ease.slowFastSlow});
			}
			this.field.onblur = function() {
				hui.animate(this,'width','80px',500,{ease:hui.ease.slowFastSlow});
			}
		}
	},
	fieldChanged : function() {
		if (this.field.value!=this.value) {
			this.value=this.field.value;
			hui.ui.callDelegates(this,'valueChanged');
			hui.ui.firePropertyChange(this,'value',this.value);
		}
	}
}


//////////////////////// Badge ///////////////////////

/** @constructor */
hui.ui.Toolbar.Badge = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	this.label = hui.get.firstByTag(this.element,'strong');
	this.text = hui.get.firstByTag(this.element,'span');
	hui.ui.extend(this);
}

hui.ui.Toolbar.Badge.prototype = {
	setLabel : function(str) {
		hui.dom.setText(this.label,str);
	},
	setText : function(str) {
		hui.dom.setText(this.text,str);
	}
}

/* EOF *//**
	Used to choose an image
	@constructor
*/
hui.ui.ImagePicker = function(o) {
	this.name = o.name;
	this.options = o || {};
	this.element = hui.get(o.element);
	this.images = [];
	this.object = null;
	this.thumbnailsLoaded = false;
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.ImagePicker.prototype = {
	/** @private */
	addBehavior : function() {
		this.element.onclick = this.showPicker.bind(this);
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
	/** @private */
	updateUI : function() {
		if (this.object==null) {
			this.element.style.backgroundImage='';
		} else {
			var url = hui.ui.resolveImageUrl(this,this.object,48,48);
			this.element.style.backgroundImage='url('+url+')';
		}
	},
	/** @private */
	showPicker : function() {
		if (!this.picker) {
			var self = this;
			this.picker = hui.ui.BoundPanel.create();
			this.content = hui.build('div',{'class':'hui_imagepicker_thumbs'});
			var buttons = hui.ui.Buttons.create({align:'right'});
			var close = hui.ui.Button.create({text:'Luk',highlighted:true});
			close.listen({
				$click:function() {self.hidePicker()}
			});
			var remove = hui.ui.Button.create({text:'Fjern'});
			remove.listen({
				$click:function() {self.setObject(null);self.hidePicker()}
			});
			buttons.add(remove).add(close);
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
	/** @private */
	hidePicker : function() {
		this.picker.hide();
	},
	/** @private */
	updateImages : function() {
		var self = this;
		hui.request({
			onSuccess:function(t) {
				self.parse(t.responseXML);
			},
			url:this.options.source
		});
	},
	/** @private */
	parse : function(doc) {
		this.content.innerHTML='';
		var images = doc.getElementsByTagName('image');
		var self = this;
		for (var i=0; i < images.length; i++) {
			var id = images[i].getAttribute('id');
			var img = {id:images[i].getAttribute('id')};
			var url = hui.ui.resolveImageUrl(this,img,48,48);
			var thumb = hui.build('div',{'class':'hui_imagepicker_thumbnail',style:'background-image:url('+url+')'});
			thumb.huiObject = {'id':id};
			thumb.onclick = function() {
				self.setObject(this.huiObject);
				self.hidePicker();
			}
			this.content.appendChild(thumb);
		};
	}
}

/* EOF *//**
 * A bound panel is a panel that is shown at a certain place
 * @constructor
 * @param {Object} options { element: «Node | id», name: «String» }
 */
hui.ui.BoundPanel = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.visible = false;
	this.content = hui.get.firstByClass(this.element,'hui_boundpanel_content');
	this.arrow = hui.get.firstByClass(this.element,'hui_boundpanel_arrow');
	this.arrowWide = 32;
	this.arrowNarrow = 18;
	if (options.variant=='light') {
		this.arrowWide = 23;
		this.arrowNarrow = 12;
	}
	hui.ui.extend(this);
}

/**
 * Creates a new bound panel
 * <br/><strong>options:</strong> { name: «name», top: «pixels», left: «pixels», padding: «pixels», width: «pixels» }
 * @param {Object} options The options
 */
hui.ui.BoundPanel.create = function(options) {
	options = hui.override({name:null, top:0, left:0, width:null, padding: null, modal: false}, options);

	
	var html = 
		'<div class="hui_boundpanel_arrow"></div>'+
		'<div class="hui_boundpanel_top"><div><div></div></div></div>'+
		'<div class="hui_boundpanel_body"><div class="hui_boundpanel_body"><div class="hui_boundpanel_body"><div class="hui_boundpanel_content" style="';
	if (options.width) {
		html+='width:'+options.width+'px;';
	}
	if (options.padding) {
		html+='padding:'+options.padding+'px;';
	}
	html+='"></div></div></div></div>'+
		'<div class="hui_boundpanel_bottom"><div><div></div></div></div>';

	options.element = hui.build(
		'div',{
			'class' : options.variant ? 'hui_boundpanel hui_boundpanel_'+options.variant : 'hui_boundpanel',
			style:'display:none;zIndex:'+hui.ui.nextPanelIndex()+';top:'+options.top+'px;left:'+options.left+'px',
			html:html,
			parent:document.body
		}
	);
	return new hui.ui.BoundPanel(options);
}

/********************************* Public methods ***********************************/

hui.ui.BoundPanel.prototype = {
	/** Show or hide the panel */
	toggle : function() {
		if (!this.visible) {
			this.show();
		} else {
			this.hide();
		}
	},
	/** Shows the panel */
	show : function() {
		if (this.visible) {
			return;
		}
		if (this.options.target) {
			this.position(hui.ui.get(this.options.target));
		}
		if (hui.browser.opacity) {
			hui.style.setOpacity(this.element,0);
		}
		var vert;
		if (this.relativePosition=='left') {
			vert = false;
			this.element.style.marginLeft='30px';
		} else if (this.relativePosition=='right') {
			vert = false;
			this.element.style.marginLeft='-30px';
		} else if (this.relativePosition=='top') {
			vert = true;
			this.element.style.marginTop='30px';
		} else if (this.relativePosition=='bottom') {
			vert = true;
			this.element.style.marginTop='-30px';
		}
		hui.style.set(this.element,{
			visibility : 'hidden', display : 'block'
		})
		this.element.style.visibility = 'visible';
		this.element.style.display = 'block';
		var index = hui.ui.nextPanelIndex();
		this.element.style.zIndex = index;
		hui.ui.callVisible(this);
		if (hui.browser.opacity) {
			hui.animate(this.element,'opacity',1,400,{ease:hui.ease.fastSlow});
		}
		hui.animate(this.element,vert ? 'margin-top' : 'margin-left','0px',800,{ease:hui.ease.bounce});
		this.visible=true;
		if (this.options.modal) {
			hui.ui.showCurtain({widget:this,zIndex:index-1,color:'auto'});
		}
	},
	/** @private */
	$curtainWasClicked : function() {
		hui.ui.hideCurtain(this);
		this.hide();
	},
	/** Hides the panel */
	hide : function() {
		if (!this.visible) {
			return;
		}
		if (!hui.browser.opacity) {
			this.element.style.display='none';
		} else {
			hui.animate(this.element,'opacity',0,300,{ease:hui.ease.slowFast,hideOnComplete:true});
		}
		if (this.options.modal) {
			hui.ui.hideCurtain(this);
		}
		hui.ui.callVisible(this);
		this.visible=false;
	},
	/**
	 * Adds a widget or element to the panel
	 * @param {Node | Widget} child The object to add
	 */
	add : function(child) {
		if (child.getElement) {
			this.content.appendChild(child.getElement());
		} else {
			this.content.appendChild(child);
		}
	},
	/**
	 * Adds som vertical space to the panel
	 * @param {pixels} height The height of the space in pixels
	 */
	addSpace : function(height) {
		this.add(hui.build('div',{style:'font-size:0px;height:'+height+'px'}));
	},
	/** @private */
	getDimensions : function() {
		var width, height;
		if (this.element.style.display=='none') {
			this.element.style.visibility='hidden';
			this.element.style.display='block';
			width = this.element.clientWidth;
			height = this.element.clientHeight;
			this.element.style.display='none';
			this.element.style.visibility='';
		} else {
			width = this.element.clientWidth;
			height = this.element.clientHeight;
		}
		return {width:width,height:height};
	},
	/** Position the panel at a node
	 * @param {Node} node The node the panel should be positioned at 
	 */
	position : function(node) {
		if (node.getElement) {
			node = node.getElement();
		}
		node = hui.get(node);
		var nodeOffset = {left:hui.position.getLeft(node),top:hui.position.getTop(node)};
		var nodeScrollOffset = hui.position.getScrollOffset(node);
		var windowScrollOffset = {left:hui.window.getScrollLeft(),top:hui.window.getScrollTop()};
				
		var panelDimensions = this.getDimensions();
		var viewportWidth = hui.window.getViewWidth();
		var viewportHeight = hui.window.getViewHeight();
		var nodeLeft = nodeOffset.left-windowScrollOffset.left+hui.window.getScrollLeft();
		var nodeWidth = node.clientWidth || node.offsetWidth;
		var nodeHeight = node.clientHeight || node.offsetHeight;
		var arrowLeft, arrowTop, left, top;
		var positionOnScreen = {
			top : nodeOffset.top-windowScrollOffset.top-(nodeScrollOffset.top-windowScrollOffset.top)
		}
		var vertical = (nodeOffset.top-windowScrollOffset.top+nodeScrollOffset.top)/viewportHeight;
		vertical = positionOnScreen.top / viewportHeight;
		hui.log(vertical)
		hui.log(hui.string.toJSON({
			nodeOffset : nodeOffset
		}))
		hui.log(hui.string.toJSON({
			nodeScrollOffset : nodeScrollOffset,
			windowScrollOffset : windowScrollOffset
		}))
		
		if (vertical<.1) {
			this.relativePosition='top';
			this.arrow.className = 'hui_boundpanel_arrow hui_boundpanel_arrow_top';
			if (this.options.variant=='light') {
				arrowTop = this.arrowNarrow*-1+1;
			} else {
				arrowTop = this.arrowNarrow*-1+2;
			}
			left = Math.min(viewportWidth-panelDimensions.width-3,Math.max(3,nodeLeft+(nodeWidth/2)-((panelDimensions.width)/2)));
			arrowLeft = (nodeLeft+nodeWidth/2)-left-this.arrowNarrow;
			top = nodeOffset.top+nodeHeight+8 - (nodeScrollOffset.top-windowScrollOffset.top);
		}
		else if (vertical>.9) {
			this.relativePosition='bottom';
			this.arrow.className='hui_boundpanel_arrow hui_boundpanel_arrow_bottom';
			if (this.options.variant=='light') {
				arrowTop = panelDimensions.height-2;
			} else {
				arrowTop = panelDimensions.height-6;
			}
			left = Math.min(viewportWidth-panelDimensions.width-3,Math.max(3,nodeLeft+(nodeWidth/2)-((panelDimensions.width)/2)));
			arrowLeft = (nodeLeft+nodeWidth/2)-left-this.arrowNarrow;
			top = nodeOffset.top-panelDimensions.height-5 - (nodeScrollOffset.top-windowScrollOffset.top);
		}
		else if ((nodeLeft+nodeWidth/2)/viewportWidth<.5) {
			this.relativePosition='left';
			left = nodeLeft+nodeWidth+10;
			this.arrow.className='hui_boundpanel_arrow hui_boundpanel_arrow_left';
			top = nodeOffset.top+(nodeHeight-panelDimensions.height)/2;
			//top = Math.min(top,viewportHeight-panelDimensions.height+(windowScrollOffset.top+nodeScrollOffset.top));
			top-= (nodeScrollOffset.top-windowScrollOffset.top);
			var min = windowScrollOffset.top+3;
			var max = windowScrollOffset.top+(viewportHeight-panelDimensions.height)-3;
			top = Math.min(Math.max(top,min),max);
			arrowTop = nodeOffset.top-top;
			arrowTop-= (nodeScrollOffset.top-windowScrollOffset.top);
			if (this.options.variant=='light') {
				arrowLeft=-11;
				arrowTop+=2;
			} else {
				arrowLeft=-14;
			}
		} else {
			this.relativePosition='right';
			left = nodeLeft-panelDimensions.width-10;
			this.arrow.className='hui_boundpanel_arrow hui_boundpanel_arrow_right';
			top = nodeOffset.top+(nodeHeight-panelDimensions.height)/2;
			//top = Math.min(top,viewportHeight-panelDimensions.height+(windowScrollOffset.top+nodeScrollOffset.top));
			top-= (nodeScrollOffset.top-windowScrollOffset.top);
			var min = windowScrollOffset.top+3;
			var max = windowScrollOffset.top+(viewportHeight-panelDimensions.height)-3;
			top = Math.min(Math.max(top,min),max);
			arrowTop = nodeOffset.top-top;
			arrowTop-= (nodeScrollOffset.top-windowScrollOffset.top);
			if (this.options.variant=='light') {
				arrowLeft=panelDimensions.width-1;
				arrowTop+=2;
			} else {
				arrowLeft=panelDimensions.width-4;
			}
		}
		this.arrow.style.marginTop = arrowTop+'px';
		this.arrow.style.marginLeft = arrowLeft+'px';
		if (this.visible) {
			hui.animate(this.element,'top',top+'px',500,{ease:hui.ease.fastSlow});
			hui.animate(this.element,'left',left+'px',500,{ease:hui.ease.fastSlow});
		} else {
			this.element.style.top=top+'px';
			this.element.style.left=left+'px';
		}
	}
}

/* EOF *//**
 * An image slideshow viewer
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  perimeter : «Integer»,
 *  sizeSnap : «Integer»,
 *  margin : «Integer»,
 *  ease : «Function»,
 *  easeEnd : «Function»,
 *  easeAuto : «Function»,
 *  easeReturn : «Function»,
 *  transition : «Integer»,
 *  transitionEnd : «Integer»,
 *  transitionReturn : «Integer»
 * }
 * </pre>
 * @constructor
 */
hui.ui.ImageViewer = function(options) {
	
	this.options = hui.override({
		maxWidth : 800,
		maxHeight : 600,
		perimeter : 100,
		sizeSnap : 100,
		margin : 0,
		ease : hui.ease.slowFastSlow,
		easeEnd : hui.ease.bounce,
		easeAuto : hui.ease.slowFastSlow,
		easeReturn : hui.ease.cubicInOut,
		transition : 400,
		transitionEnd : 1000,
		transitionReturn : 300
	},options);
	
	// Collect elements ...
	this.element = hui.get(options.element);
	this.box = this.options.box;
	this.viewer = hui.get.firstByClass(this.element,'hui_imageviewer_viewer');
	this.innerViewer = hui.get.firstByClass(this.element,'hui_imageviewer_inner_viewer');
	
	this.status = hui.get.firstByClass(this.element,'hui_imageviewer_status');
	
	this.previousControl = hui.get.firstByClass(this.element,'hui_imageviewer_previous');
	this.controller = hui.get.firstByClass(this.element,'hui_imageviewer_controller');
	this.nextControl = hui.get.firstByClass(this.element,'hui_imageviewer_next');
	this.playControl = hui.get.firstByClass(this.element,'hui_imageviewer_play');
	this.closeControl = hui.get.firstByClass(this.element,'hui_imageviewer_close');
	
	this.text = hui.get.firstByClass(this.element,'hui_imageviewer_text');
	
	// State ...
	this.dirty = false;
	this.width = 600;
	this.height = 460;
	this.index = 0;
	this.playing = false;
	this.name = options.name;
	this.images = [];
	
	// Behavior ...
	this.box.listen(this);
	this._addBehavior();
	hui.ui.extend(this);
}

/**
 * Creates a new image viewer
 */
hui.ui.ImageViewer.create = function(options) {
	options = options || {};
	var element = options.element = hui.build('div',
		{'class':'hui_imageviewer',
		html:
		'<div class="hui_imageviewer_viewer"><div class="hui_imageviewer_inner_viewer"></div></div>'+
		'<div class="hui_imageviewer_text"></div>'+
		'<div class="hui_imageviewer_status"></div>'+
		'<div class="hui_imageviewer_controller"><div><div>'+
		'<a class="hui_imageviewer_previous"></a>'+
		'<a class="hui_imageviewer_play"></a>'+
		'<a class="hui_imageviewer_next"></a>'+
		'<a class="hui_imageviewer_close"></a>'+
		'</div></div></div>'});
	var box = options.box = hui.ui.Box.create({absolute:true,modal:true,closable:true});
	box.add(element);
	box.addToDocument();
	return new hui.ui.ImageViewer(options);
}

hui.ui.ImageViewer.prototype = {

	_addBehavior : function() {
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
		this.closeControl.onclick = this.hide.bind(this);
		hui.listen(this.viewer,'click',this._zoom.bind(this));
		this._timer = function() {
			self.next(false);
		}
		this._keyListener = function(e) {
			e = hui.event(e);
			if (e.rightKey) {
				self.next(true);
			} else if (e.leftKey) {
				self.previous(true);
			} else if (e.escapeKey) {
				self.hide();
			} else if (e.returnKey) {
				self.playOrPause();
			}
		},
		hui.listen(this.viewer,'mousemove',this._onMouseMove.bind(this));
		hui.listen(this.controller,'mouseover',function() {
			self.overController = true;
		});
		hui.listen(this.controller,'mouseout',function() {
			self.overController = false;
		});
		hui.listen(this.viewer,'mouseout',function(e) {
			if (!hui.ui.isWithin(e,this.viewer)) {
				self._hideController();
			}
		}.bind(this));
	},
	_onMouseMove : function() {
		window.clearTimeout(this.ctrlHider);
		if (this._shouldShowController()) {
			this.ctrlHider = window.setTimeout(this._hideController.bind(this),2000);
			if (hui.browser.msie) {
				this.controller.style.display='block';
			} else {
				hui.effect.fadeIn({element:this.controller,duration:200});
			}
		}
	},
	_hideController : function() {
		if (!this.overController) {
			if (hui.browser.msie) {
				this.controller.style.display='none';
			} else {
				hui.effect.fadeOut({element:this.controller,duration:500});
			}
		}
	},
	_getLargestSize : function(canvas,image) {
		if (image.width<=canvas.width && image.height<=canvas.height) {
			return {width:image.width,height:image.height};
		} else if (canvas.width/canvas.height>image.width/image.height) {
			return {width:Math.round(canvas.height/image.height*image.width),height:canvas.height};
		} else if (canvas.width/canvas.height<image.width/image.height) {
			return {width:canvas.width,height:Math.round(canvas.width/image.width*image.height)};
		} else {
			return {width:canvas.width,height:canvas.height};
		}
	},
	_calculateSize : function() {
		var snap = this.options.sizeSnap;
		var newWidth = hui.window.getViewWidth() - this.options.perimeter;
		newWidth = Math.floor(newWidth / snap) * snap;
		newWidth = Math.min(newWidth , this.options.maxWidth);
		var newHeight = hui.window.getViewHeight() - this.options.perimeter;
		newHeight = Math.floor(newHeight / snap) * snap;
		newHeight = Math.min(newHeight , this.options.maxHeight);
		var maxWidth = 0;
		var maxHeight = 0;
		for (var i=0; i < this.images.length; i++) {
			var dims = this._getLargestSize({ width : newWidth, height : newHeight}, this.images[i] );
			maxWidth = Math.max(maxWidth , dims.width);
			maxHeight = Math.max(maxHeight , dims.height);
		};
		newHeight = Math.floor( Math.min(newHeight , maxHeight) );
		newWidth = Math.floor( Math.min(newWidth , maxWidth) );
		
		if (newWidth != this.width || newHeight != this.height) {
			this.width = newWidth;
			this.height = newHeight;
			this.dirty = true;
		}
	},
	_updateUI : function() {
		if (this.dirty) {
			this.innerViewer.innerHTML='';
			for (var i=0; i < this.images.length; i++) {
				var element = hui.build('div',{'class':'hui_imageviewer_image'});
				hui.style.set(element,{width: (this.width + this.options.margin) + 'px',height : (this.height-1)+'px' });
				this.innerViewer.appendChild(element);
			};
			if (this._shouldShowController()) {
				this.controller.style.display='block';
			} else {
				this.controller.style.display='none';
			}
			this.dirty = false;
			this._preload();
		}
	},
	_shouldShowController : function() {
		return this.images.length>1;
	},
	_goToImage : function(animate,num,user) {	
		if (animate) {
			if (num>1) {
				hui.animate(this.viewer,'scrollLeft',this.index*(this.width+this.options.margin),Math.min(num*this.options.transitionReturn,2000),{ease:this.options.easeReturn});				
			} else {
				var end = this.index==0 || this.index==this.images.length-1;
				var ease = (end ? this.options.easeEnd : this.options.ease);
				if (!user) {
					ease = this.options.easeAuto;
				}
				hui.animate(this.viewer,'scrollLeft',this.index*(this.width+this.options.margin),(end ? this.options.transitionEnd : this.options.transition),{ease:ease});
			}
		} else {
			this.viewer.scrollLeft = this.index*(this.width+this.options.margin);
		}
		var text = this.images[this.index].text;
		if (text) {
			this.text.innerHTML = text;
			this.text.style.display = 'block';
		} else {
			this.text.innerHTML = '';
			this.text.style.display = 'none';
		}
	},
	
	// Show / hide ...

	/** Show the image viewer starting at the image with a certain id. Will not show if image is not found
	 * @param {Integer} id The id if the image to start with
	 */
	showById: function(id) {
		for (var i=0; i < this.images.length; i++) {
			if (this.images[i].id==id) {
				this.show(i);
				break;
			}
		};
	},
	/** Show the image viewer
	 * @param {Integer} index? Optional index to start from (zero-based)
	 */
	show: function(index) {
		this.index = index || 0;
		this._calculateSize();
		this._updateUI();
		var margin = this.options.margin;
		hui.style.set(this.element, {width:(this.width+margin)+'px',height:(this.height+margin*2-1)+'px'});
		hui.style.set(this.viewer, {width:(this.width+margin)+'px',height:(this.height-1)+'px'});
		hui.style.set(this.innerViewer, {width:((this.width+margin)*this.images.length)+'px',height:(this.height-1)+'px'});
		hui.style.set(this.controller, {marginLeft:((this.width-180)/2+margin*0.5)+'px',display:'none'});
		this.box.show();
		this._goToImage(false,0,false);
		hui.listen(document,'keydown',this._keyListener);
	},
	/** Hide the image viewer */
	hide: function() {
		this.pause();
		this.box.hide();
		hui.unListen(document,'keydown',this._keyListener);
	},


	// Listeners ...

	/** @private */
	$boxCurtainWasClicked : function() {
		this.hide();
	},
	/** @private */
	$boxWasClosed : function() {
		this.hide();
	},
	
	
	// Data handling ...
	
	/** Clear all images in the stack */
	clearImages : function() {
		this.images = [];
		this.dirty = true;
	},
	/**
	 * Add multiple images to the stack
	 * @param {Array} images An array of image objects
	 */
	addImages : function(images) {
		for (var i=0; i < images.length; i++) {
			this.addImage(images[i]);
		};
	},
	/**
	 * Add an image to the stack
	 * @param {Object} img An image object representing an image
	 */
	addImage : function(img) {
		this.images.push(img);
		this.dirty = true;
	},
	
	
	// Playback...
	
	/** Start playing slideshow */
	play : function() {
		if (!this.interval) {
			this.interval = window.setInterval(this._timer,6000);
		}
		this.next(false);
		this.playing=true;
		this.playControl.className='hui_imageviewer_pause';
	},
	/** Pauseslideshow */
	pause : function() {
		window.clearInterval(this.interval);
		this.interval = null;
		this.playControl.className='hui_imageviewer_play';
		this.playing = false;
	},
	/** Start or pause slideshow */
	playOrPause : function() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	},
	_resetPlay : function() {
		if (this.playing) {
			window.clearInterval(this.interval);
			this.interval = window.setInterval(this._timer,6000);
		}
	},
	/** Go to the previous image
	 * @param {Boolean} user If it is initiated by the user
	 */
	previous : function(user) {
		var num = 1;
		this.index--;
		if (this.index<0) {
			this.index=this.images.length-1;
			num = this.images.length-1;
		}
		this._goToImage(true,num,user);
		this._resetPlay();
	},
	/** Go to the next image
	 * @param {Boolean} user If it is initiated by the user
 	 */
	next : function(user) {
		var num = 1;
		this.index++;
		if (this.index==this.images.length) {
			this.index=0;
			num = this.images.length-1;
		}
		this._goToImage(true,num,user);
		this._resetPlay();
	},
	
	
	
	
	
	
	// Preloading ...
	
	_preload : function() {
		var guiLoader = new hui.Preloader();
		guiLoader.addImages(hui.ui.context+'hui/gfx/imageviewer_controls.png');
		var self = this;
		guiLoader.setDelegate({allImagesDidLoad:function() {self._preloadImages()}});
		guiLoader.load();
	},
	_preloadImages : function() {
		var loader = new hui.Preloader();
		loader.setDelegate(this);
		for (var i=0; i < this.images.length; i++) {
			var url = hui.ui.resolveImageUrl(this,this.images[i],this.width,this.height);
			if (url!==null) {
				loader.addImages(url);
			}
		};
		this.status.innerHTML = '0%';
		this.status.style.display = '';
		loader.load(this.index);
	},
	/** @private */
	allImagesDidLoad : function() {
		this.status.style.display = 'none';
	},
	/** @private */
	imageDidLoad : function(loaded,total,index) {
		this.status.innerHTML = Math.round(loaded/total*100)+'%';
		var url = hui.ui.resolveImageUrl(this,this.images[index],this.width,this.height);
		url = url.replace(/&amp;/g,'&');
		this.innerViewer.childNodes[index].style.backgroundImage="url('"+url+"')";
		hui.cls.set(this.innerViewer.childNodes[index],'hui_imageviewer_image_abort',false);
		hui.cls.set(this.innerViewer.childNodes[index],'hui_imageviewer_image_error',false);
	},
	/** @private */
	imageDidGiveError : function(loaded,total,index) {
		hui.cls.set(this.innerViewer.childNodes[index],'hui_imageviewer_image_error',true);
	},
	/** @private */
	imageDidAbort : function(loaded,total,index) {
		hui.cls.set(this.innerViewer.childNodes[index],'hui_imageviewer_image_abort',true);
	},
	
	
	
	
	// Zooming ...

	_zoom : function(e) {
		var img = this.images[this.index];
		if (img.width<=this.width && img.height<=this.height) {
			return; // Don't zoom if small
		}
		if (!this.zoomer) {
			this.zoomer = hui.build('div',{
				'class' : 'hui_imageviewer_zoomer',
				style : 'width:'+this.viewer.clientWidth+'px;height:'+this.viewer.clientHeight+'px'
			});
			this.element.insertBefore(this.zoomer,hui.dom.firstChild(this.element));
			hui.listen(this.zoomer,'mousemove',this._onZoomMove.bind(this));
			hui.listen(this.zoomer,'click',function() {
				this.zoomer.style.display='none';
			}.bind(this));
		}
		this.pause();
		var size = this._getLargestSize({width:2000,height:2000},img);
		var url = hui.ui.resolveImageUrl(this,img,size.width,size.height);
		this.zoomer.innerHTML = '<div style="width:'+size.width+'px;height:'+size.height+'px; margin: 0 auto;"><img src="'+url+'"/></div>';
		this.zoomer.style.display = 'block';
		this.zoomInfo = {width:size.width,height:size.height};
		this._onZoomMove(e);
	},
	_onZoomMove : function(e) {
		e = new hui.Event(e);
		if (!this.zoomInfo) {
			return;
		}
		var offset = {left:hui.position.getLeft(this.zoomer),top:hui.position.getTop(this.zoomer)};
		var x = (e.getLeft()-offset.left)/this.zoomer.clientWidth*(this.zoomInfo.width-this.zoomer.clientWidth);
		var y = (e.getTop()-offset.top)/this.zoomer.clientHeight*(this.zoomInfo.height-this.zoomer.clientHeight);
		this.zoomer.scrollLeft = x;
		this.zoomer.scrollTop = y;
	}
	
}

/* EOF *//** @constructor */
hui.ui.Picker = function(o) {
	o = this.options = hui.override({itemWidth:100,itemHeight:150,itemsVisible:null,shadow:true,valueProperty:'value'},o);
	this.element = hui.get(o.element);
	this.name = o.name;
	this.container = hui.get.firstByClass(this.element,'hui_picker_container');
	this.content = hui.get.firstByClass(this.element,'hui_picker_content');
	this.title = hui.get.firstByClass(this.element,'hui_picker_title');
	this.objects = [];
	this.selected = null;
	this.value = null;
	this.addBehavior();
	hui.ui.extend(this);
}

hui.ui.Picker.create = function(o) {
	o = hui.override({shadow:true},o);
	o.element = hui.build('div',{'class':'hui_picker',
		html:'<div class="hui_picker_top"><div><div></div></div></div>'+
		'<div class="hui_picker_middle"><div class="hui_picker_middle">'+
		(o.title ? '<div class="hui_picker_title">'+o.title+'</div>' : '')+
		'<div class="hui_picker_container"><div class="hui_picker_content"></div></div>'+
		'</div></div>'+
		'<div class="hui_picker_bottom"><div><div></div></div></div>'});
	if (o.shadow==true) {
		hui.cls.add(o.element,'hui_picker_shadow')
	}
	return new hui.ui.Picker(o);
}

hui.ui.Picker.prototype = {
	addBehavior : function() {
		var self = this;
		hui.listen(this.content,'mousedown',function(e) {
			self.startDrag(e);
			return false;
		});
	},
	setObjects : function(objects) {
		this.selected = null;
		this.objects = objects || [];
		this.updateUI();
	},
	setValue : function(value) {
		this.value = value;
		this.updateSelection();
	},
	getValue : function() {
		return this.value;
	},
	reset : function() {
		this.value = null;
		this.updateSelection();
	},
	updateUI : function() {
		var self = this,
			width;
		this.content.innerHTML='';
		this.container.scrollLeft=0;
		if (this.options.itemsVisible) {
			width = this.options.itemsVisible*(this.options.itemWidth+14);
		} else {
			width = this.container.clientWidth;
		}
		hui.style.set(this.container,{width:width+'px',height:(this.options.itemHeight+10)+'px'});
		this.content.style.width=(this.objects.length*(this.options.itemWidth+14))+'px';
		this.content.style.height=(this.options.itemHeight+10)+'px';
		hui.each(this.objects,function(object,i) {
			var item = hui.build('div',{'class':'hui_picker_item',title:object.title});
			if (self.value!=null && object[self.options.valueProperty]==self.value) {
				 hui.cls.add(item,'hui_picker_item_selected');
			}
			item.innerHTML = '<div class="hui_picker_item_middle"><div class="hui_picker_item_middle">'+
				'<div style="width:'+self.options.itemWidth+'px;height:'+self.options.itemHeight+'px; overflow: hidden; background-image:url(\''+object.image+'\')"><strong>'+hui.string.escape(object.title)+'</strong></div>'+
				'</div></div>'+
				'<div class="hui_picker_item_bottom"><div><div></div></div></div>';
			hui.listen(item,'mouseup',function() {
				self.selectionChanged(object[self.options.valueProperty])
			});
			self.content.appendChild(item);
		});
	},
	updateSelection : function() {
		var children = this.content.childNodes;
		for (var i=0; i < children.length; i++) {
			hui.cls.set(children[i],'hui_picker_item_selected',this.value!=null && this.objects[i][this.options.valueProperty]==this.value);
		};
	},
	selectionChanged : function(value) {
		if (this.dragging) return;
		if (this.value==value) return;
		this.value = value;
		this.updateSelection();
		this.fire('selectionChanged',value);
	},
	
	// Dragging
	startDrag : function(e) {
		e = new hui.Event(e);
		e.stop();
		var self = this;
		this.dragX = e.getLeft();
		this.dragScroll = this.container.scrollLeft;
		hui.ui.Picker.mousemove = function(e) {self.drag(e);return false;}
		hui.ui.Picker.mouseup = hui.ui.Picker.mousedown = function(e) {self.endDrag(e);return false;}
		hui.listen(window.document,'mousemove',hui.ui.Picker.mousemove);
		hui.listen(window.document,'mouseup',hui.ui.Picker.mouseup);
		hui.listen(window.document,'mousedown',hui.ui.Picker.mouseup);
	},
	drag : function(e) {
		e = new hui.Event(e);
		e.stop();
		this.dragging = true;
		this.container.scrollLeft=this.dragX-e.getLeft()+this.dragScroll;
	},
	endDrag : function(e) {
		this.dragging = false;
		hui.stop(e);
		hui.unListen(window.document,'mousemove',hui.ui.Picker.mousemove);
		hui.unListen(window.document,'mouseup',hui.ui.Picker.mouseup);
		hui.unListen(window.document,'mousedown',hui.ui.Picker.mouseup);
		var size = this.options.itemWidth+14;
		hui.animate(this.container,'scrollLeft',Math.round(this.container.scrollLeft/size)*size,500,{ease:hui.ease.bounceOut});
	},
	$visibilityChanged : function() {
		if (!hui.dom.isVisible(this.container)) {return}
		this.container.style.display='none';
		var width;
		if (this.options.itemsVisible) {
			width = this.options.itemsVisible*(this.options.itemWidth+14);
		} else {
			width = this.container.parentNode.clientWidth-12;
		}
		width = Math.max(width,0);
		hui.style.set(this.container,{width:width+'px',display:'block'});
	}
}

/* EOF *//**
 * Editing of documents composed of different parts
 *
 * <pre>
 * <strong>Events</strong>
 * $partWasMoved : function(info)
 * $addPart
 * </pre>
 * @constructor
 */
hui.ui.Editor = function() {
	this.name = 'huiEditor';
	this.options = {rowClass:'row',columnClass:'column',partClass:'part'};
	this.parts = [];
	this.rows = [];
	this.partControllers = [];
	this.activePart = null;
	this.active = false;
	this.live = true;
	hui.ui.extend(this);
}

hui.ui.Editor.get = function() {
	if (!hui.ui.Editor.instance) {
		hui.ui.Editor.instance = new hui.ui.Editor();
	}
	return hui.ui.Editor.instance;
}

hui.ui.Editor.prototype = {
	/** Start the editor */
	ignite : function() {
		hui.listen(window,'keydown',this._onKeyDown.bind(this));
		hui.listen(window,'keyup',this._onKeyUp.bind(this));
		this.reload();
	},
	_onKeyDown : function(e) {
		e = hui.event(e);
		//this.live = e.altKey;
	},
	_onKeyUp : function(e) {
		//this.live = false;
	},
	
	addPartController : function(key,title,controller) {
		this.partControllers.push({key:key,'title':title,'controller':controller});
	},
	setOptions : function(options) {
		hui.override(this.options,options);
	},
	_getPartController : function(key) {
		var ctrl = null;
		hui.each(this.partControllers,function(item) {
			if (item.key==key) {ctrl=item};
		});
		return ctrl;
	},
	reload : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
		var self = this;
		this.parts = [];
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		hui.each(rows,function(row,i) {
			var columns = hui.get.byClass(row,self.options.columnClass);
			self._reloadColumns(columns,i);
			hui.each(columns,function(column,j) {
				var parts = hui.get.byClass(column,self.options.partClass);
				self._reloadParts(parts,i,j);
			});
		});
		/*
		var parts = hui.get.byClass(document.body,this.options.partClass);
		hui.each(this.parts,function(part) {
			var i = parts.indexOf(part.element);
			if (i!=-1) {
				delete(parts[i]);
			}
		});
		this._reloadParts(parts,-1,-1);
		*/
	},
	_reloadColumns : function(columns,rowIndex) {
		var self = this;
		hui.each(columns,function(column,columnIndex) {
			hui.listen(column,'mouseover',function() {
				self._onHoverColumn(column);
			});
			hui.listen(column,'mouseout',function() {
				self._onBlurColumn();
			});
			hui.listen(column,'contextmenu',function(e) {
				self.contextColumn(column,rowIndex,columnIndex,e);
			});
		});
	},
	_reloadParts : function(parts,row,column) {
		var self = this;
		var reg = new RegExp(this.options.partClass+"_([\\w]+)","i");
		hui.each(parts,function(element,partIndex) {
			if (!element) return;
			var match = element.className.match(reg);
			if (match && match[1]) {
				var handler = self._getPartController(match[1]);
				if (handler) {
					var part = new handler.controller({element:element});
					part.type = match[1];
					hui.listen(element,'click',function(e) {
						e = hui.event(e);
						if (!e.findByTag('a') && e.altKey) {
							self._editPart(part);
						}
					});
					hui.listen(element,'mouseover',function(e) {
						self.hoverPart(part);
					});
					hui.listen(element,'mouseout',function(e) {
						self.blurPart(e);
					});
					self.parts.push(part);
				}
				hui.listen(element,'mousedown',function(e) {
					self._startPartDrag({
						element : element,
						event : e
					});
				});
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
	
	_onHoverColumn : function(column) {
		this.hoveredColumn = column;
		if (!this.active || this.activePart) {
			return;
		}
		hui.cls.add(column,'hui_editor_column_hover');
	},
	
	_onBlurColumn : function() {
		if (!this.active || !this.hoveredColumn) return;
		hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
	},
	
	contextColumn : function(column,rowIndex,columnIndex,e) {
		if (!this.active || this.activePart) return;
		if (!this.columnMenu) {
			var menu = hui.ui.Menu.create({name:'huiEditorColumnMenu'});
			menu.addItem({title:'Rediger kolonne',value:'editColumn'});
			menu.addItem({title:'Slet kolonne',value:'removeColumn'});
			menu.addItem({title:'Tilføj kolonne',value:'addColumn'});
			menu.addDivider();
			for (var i=0; i < this.partControllers.length; i++) {
				var ctrl = this.partControllers[i];
				menu.addItem({title:ctrl.title,value:ctrl.key});
			};
			this.columnMenu = menu;
			menu.listen(this);
		}
		this.hoveredRow=rowIndex;
		this.hoveredColumnIndex=columnIndex;
		this.columnMenu.showAtPointer(e);
	},
	/** @private */
	$itemWasClicked$huiEditorColumnMenu : function(value) {
		if (value=='removeColumn') {
			this.fire('removeColumn',{'row':this.hoveredRow,'column':this.hoveredColumnIndex});
		} else if (value=='editColumn') {
			this.editColumn(this.hoveredRow,this.hoveredColumnIndex);
		} else if (value=='addColumn') {
			this.fire('addColumn',{'row':this.hoveredRow,'position':this.hoveredColumnIndex+1});
		} else {
			this.fire('addPart',{'row':this.hoveredRow,'column':this.hoveredColumnIndex,'position':0,type:value});
		}
	},
	
	///////////////////// Column editor //////////////////////
	
	editColumn : function(rowIndex,columnIndex) {
		this.closeColumn();
		var row = hui.get.byClass(document.body,'row')[rowIndex];
		var c = this.activeColumn = hui.get.byClass(row,'column')[columnIndex];
		hui.cls.add(c,'hui_editor_column_edit');
		this.showColumnWindow();
		this.columnEditorForm.setValues({width:hui.style.get(c,'width'),paddingLeft:hui.style.get(c,'padding-left')});
	},
	closeColumn : function() {
		if (this.activeColumn) {
			hui.cls.remove(this.activeColumn,'hui_editor_column_edit');
		}
	},
	showColumnWindow : function() {
		if (!this.columnEditor) {
			var w = this.columnEditor = hui.ui.Window.create({name:'columnEditor',title:'Rediger kolonne',width:200});
			var f = this.columnEditorForm = hui.ui.Formula.create();
			var g = f.createGroup();
			var width = hui.ui.TextField.create({label:'Bredde',key:'width'});
			width.listen({$valueChanged:function(v) {this.changeColumnWidth(v)}.bind(this)})
			g.add(width);
			var marginLeft = hui.ui.TextField.create({label:'Venstremargen',key:'left'});
			marginLeft.listen({$valueChanged:function(v) {this.changeColumnLeftMargin(v)}.bind(this)})
			g.add(marginLeft);
			var marginRight = hui.ui.TextField.create({label:'Højremargen',key:'right'});
			marginRight.listen({$valueChanged:this.changeColumnRightMargin.bind(this)})
			g.add(marginRight);
			w.add(f);
			w.listen(this);
		}
		this.columnEditor.show();
	},
	/** @private */
	$userClosedWindow$columnEditor : function() {
		this.closeColumn();
		var values = this.columnEditorForm.getValues();
		values.row=this.hoveredRow;
		values.column=this.hoveredColumnIndex;
		this.fire('updateColumn',values);
	},
	changeColumnWidth : function(width) {
		this.activeColumn.style.width=width;
	},
	changeColumnLeftMargin : function(margin) {
		this.activeColumn.setStyle({'paddingLeft':margin});
	},
	changeColumnRightMargin : function(margin) {
		this.activeColumn.setStyle({'paddingRight':margin});
	},
	///////////////////////// Parts //////////////////////////
	
	hoverPart : function(part,event) {
		if (!this.active || this.activePart || !this.live || this.dragging) {
			return;
		}
		this.hoveredPart = part;
		hui.cls.add(part.element,'hui_editor_part_hover');
		var self = this;
		this.partControlTimer = window.setTimeout(function() {self.showPartControls()},200);
	},
	blurPart : function(e) {
		window.clearTimeout(this.partControlTimer);
		if (!this.active) return;
		if (this.partControls && !hui.ui.isWithin(e,this.partControls.element)) {
			this._hidePartControls();
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		}
		if (!this.partControls && this.hoveredPart) {
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');			
		}
	},
	showPartEditControls : function() {
		if (!this.partEditControls) {
			this.partEditControls = hui.ui.Overlay.create({name:'huiEditorPartEditActions'});
			this.partEditControls.addIcon('save','common/save');
			this.partEditControls.addIcon('cancel','common/close');
			this.partEditControls.listen(this);
		}
		this.partEditControls.showAtElement(this.activePart.element,{'horizontal':'right','vertical':'topOutside'});
	},
	showPartControls : function() {
		if (!this.partControls) {
			this.partControls = hui.ui.Overlay.create({name:'huiEditorPartActions'});
			this.partControls.addIcon('edit','common/edit');
			this.partControls.addIcon('new','common/new');
			this.partControls.addIcon('delete','common/delete');
			var self = this;
			hui.listen(this.partControls.getElement(),'mouseout',this._blurControls.bind(this));
			hui.listen(this.partControls.getElement(),'mouseover',this._hoverControls.bind(this));
			this.partControls.listen(this);
		}
		if (this.hoveredPart.column==-1 || true) {
			this.partControls.hideIcons(['new','delete']);
		} else {
			this.partControls.showIcons(['new','delete']);
		}
		this.partControls.showAtElement(this.hoveredPart.element,{'horizontal':'right'});
	},
	_hoverControls : function(e) {
		hui.cls.add(this.hoveredPart.element,'hui_editor_part_hover');
	},
	_blurControls : function(e) {
		hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		if (!hui.ui.isWithin(e,this.hoveredPart.element)) {
			this._hidePartControls();
		}
	},
	/** @private */
	$iconWasClicked$huiEditorPartActions : function(key,event) {
		if (key=='delete') {
			this.deletePart(this.hoveredPart);
		} else if (key=='new') {
			this.newPart(event);
		} else if (key=='edit') {
			this._editPart(this.hoveredPart);
		}
	},
	/** @private */
	$iconWasClicked$huiEditorPartEditActions : function(key,event) {
		if (key=='cancel') {
			this.cancelPart(this.activePart);
		} else if (key=='save') {
			this.savePart(this.activePart);
		}
	},
	_hidePartControls : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
	},
	_hidePartEditControls : function() {
		if (this.partEditControls) {
			this.partEditControls.hide();
		}
	},
	_editPart : function(part) {
		if (!this.active || this.activePart) return;
		if (this.activePart) this.activePart.deactivate();
		if (this.hoveredPart) {
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		}
		this.activePart = part;
		this.showPartEditControls();
		hui.cls.add(part.element,'hui_editor_part_active');
		part.activate(function() {
			//hui.ui.showMessage({text:'Loaded',duration:2000});
		});
		window.clearTimeout(this.partControlTimer);
		this._hidePartControls();
		this._onBlurColumn();
		this._showPartEditor();
	},
	_showPartEditor : function() {
		 // TODO: Disabled!
		/*if (!this.partEditor) {
			var w = this.partEditor = hui.ui.Window.create({padding:5,title:'Afstande',close:false,variant:'dark',width: 200});
			var f = this.partEditorForm = hui.ui.Formula.create();
			f.buildGroup({above:false},[
				{type:'TextField',options:{label:'Top',key:'top'}},
				{type:'TextField',options:{label:'Bottom',key:'bottom'}},
				{type:'TextField',options:{label:'Left',key:'left'}},
				{type:'TextField',options:{label:'Right',key:'right'}}
			]);
			w.add(f);
			f.listen({valuesChanged:this.updatePartProperties.bind(this)});
		}
		var e = this.activePart.element;
		this.partEditorForm.setValues({
			top: e.getStyle('marginTop'),
			bottom: e.getStyle('marginBottom'),
			left: e.getStyle('marginLeft'),
			right: e.getStyle('marginRight')
		});
		this.partEditor.show();*/
	},
	updatePartProperties : function(values) {
		hui.style.set(this.activePart.element,{
			marginTop:values.top,
			marginBottom:values.bottom,
			marginLeft:values.left,
			marginRight:values.right
		});
		this.activePart.properties = values;
	},
	hidePartEditor : function() {
		if (this.partEditor) this.partEditor.hide();
	},
	cancelPart : function(part) {
		part.cancel();
		this.hidePartEditor();
		this.activePart = null;
	},
	savePart : function(part) {
		hui.log('savePart')
		part.save();
		this.hidePartEditor();
		this.activePart = null;
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
		hui.cls.remove(part.element,'hui_editor_part_active');
		this.activePart = null;
		this._hidePartEditControls();
	},
	partChanged : function(part) {
		hui.ui.callDelegates(part,'partChanged');
	},
	deletePart : function(part) {
		hui.ui.callDelegates(part,'deletePart');
		this.partControls.hide();
	},
	newPart : function(e) {
		if (!this.newPartMenu) {
			var menu = hui.ui.Menu.create({name:'huiEditorNewPartMenu'});
			hui.each(this.partControllers,function(item) {
				menu.addItem({title:item.title,value:item.key});
			});
			menu.listen(this);
			this.newPartMenu=menu;
		}
		this.newPartMenu.showAtPointer(e);
	},
	$itemWasClicked$huiEditorNewPartMenu : function(value) {
		var info = {row:this.hoveredPart.row,column:this.hoveredPart.column,position:this.hoveredPart.position+1,type:value};
		hui.ui.callDelegates(this,'addPart',info);
	},
	
	
	
	
	
	
	/**** Dragging ****/
	
	_dragInfo : null,
	
	_dropInfo : null,
	
	dragProxy : null,
	
	_startPartDrag : function(info) {
		if (!this.active || this.activePart || !this.live) {
			return true;
		}
		var e = hui.event(info.event),
			element = info.element;
		if (!e.altKey) {
			return;
		}
		e.stop();
		
		if (!this.dragProxy) {
			this.dragProxy = hui.build('div',{'class':'hui_editor_dragproxy',parent:document.body,style:'display:none;'});
		}
		var proxy = this.dragProxy;
		proxy.innerHTML = element.innerHTML;
		
		var pos = this._getPartPosition(element);
		if (!pos) {
			return;
		}
		
		this._dragInfo = {
			diffLeft : e.getLeft() - hui.position.getLeft(element),
			diffTop : e.getTop() - hui.position.getTop(element),
			draggedElement : element,
			partIndex : pos.partIndex,
			rowIndex : pos.rowIndex,
			columnIndex : pos.columnIndex,
			initialHeight : element.clientHeight
		}
		hui.log('startDrag')
		hui.drag.start({
			element : proxy,
			onBeforeMove : this._onBeforeDrag.bind(this),
			onMove : this._onDrag.bind(this),
			onAfterMove : this._onAfterDrag.bind(this),
			onEnd : function() {
				
			}
		})
	},
	_onBeforeDrag : function() {
		var dragged = this._dragInfo.draggedElement,
			proxy = this.dragProxy;
		
		
		this._insertDropPlaceholders();
		
		hui.style.set(proxy,{
			display : 'block',
			visibility : 'visible',
			height  : dragged.clientHeight+'px',
			width  : dragged.clientWidth+'px',
			transform : 'scale(1)',
			background : 'rgba(255,255,255,.5)',
			padding : '1px',
			opacity: 1
		});
		
		//hui.animate({node:this.dragProxy,css:{transform:'scale(1.1)'},duration:1000,ease:hui.ease.slowFastSlow});
		
		hui.style.setOpacity(dragged,0.5);
		
		this._dragging = true;
		
		if (!this._dropMarker) {
			this._dropMarker = hui.build('div',{'class':'hui_editor_dropmarker',parent:document.body});
		}
	},
	_onDrag : function(e) {
		var left = e.getLeft();
		var top = e.getTop();
		this.dragProxy.style.left = (left - this._dragInfo.diffLeft) + 'px';
		this.dragProxy.style.top = (top - this._dragInfo.diffTop) + 'px';
		for (var i=0; i < this.dropTargets.length; i++) {
			var info = this.dropTargets[i];
			if (info.left<left && info.right>left && info.top<top && info.bottom>top) {
				//if (info.placeholder!=this._activeDragPlaceholder) {
					var h = this._dragColumnHeights[info.rowIndex+'-'+info.columnIndex];
					//hui.log(info.columnIndex+': '+h)
					//info.debug.style.borderColor='blue'
					//hui.animate({node:info.placeholder,css:{height : h+'px'},duration:500,ease:hui.ease.slowFastSlow});
					if (this._latestProxyColumn!=info.columnIndex || this._latestProxyRow!=info.rowIndex) {
						hui.animate({node:this.dragProxy,css:{width:(info.right-info.left)+'px'},duration:300,ease:hui.ease.fastSlow});
						this._latestProxyColumn = info.columnIndex;
						this._latestProxyrow = info.rowIndex;
					}
					//this._activeDragPlaceholder = info.placeholder;
					this._dropInfo = info;
					hui.style.set(this._dropMarker,{width:(info.right-info.left)+'px',left:info.left+'px',top:info.position+'px',display:'block'});
				//}	
				break;
			}
		};
	},
	_onAfterDrag : function(e) {
		var proxy = this.dragProxy,
			dragInfo = this._dragInfo,
			dragged = this._dragInfo.draggedElement,
			dropInfo = this._dropInfo;
		
		if (dropInfo) {
			var newHeight = this._dragColumnHeights[dropInfo.rowIndex+'-'+dropInfo.columnIndex];
			
			var top = dropInfo.position,
				left = dropInfo.left;
				
			if ((dragInfo.columnIndex == dropInfo.columnIndex && dragInfo.partIndex < dropInfo.partIndex) || dragInfo.rowIndex < dropInfo.rowIndex) {
				top = top - dragInfo.initialHeight;
			}
			//top+=3;
			left++;
			// Move the proxy to new position
			hui.animate({
				node : proxy,
				css : {
					left : left+'px',
					top : top+'px',
					opacity : 0.5
					},
				duration : 500,
				ease : hui.ease.slowFastSlow
			});
			
			var column = this._getColumn(dropInfo.rowIndex,dropInfo.columnIndex);
			
			var parts = hui.get.byClass(column,this.options.partClass);
			
			if (parts[dropInfo.partIndex] != dragged) {
				this.fire('partWasMoved',{dragged:dragged,rowIndex : dropInfo.rowIndex,columnIndex : dropInfo.columnIndex,partIndex : dropInfo.partIndex, 
					onSuccess : function() {
						dragged.style.webkitTransformOrigin='0 0';
						var dummy = hui.build('div');
						if (dropInfo.partIndex>=parts.length) {
							hui.animate({node:dragged,css:{height:'0px'},duration:500,ease:hui.ease.slowFastSlow,onComplete:function() {
								hui.dom.remove(dragged);
								column.appendChild(dragged);
								hui.animate({node:dragged,css:{transform:'scale(1)',height:newHeight+'px'},duration:500,ease:hui.ease.slowFastSlow,onComplete:function() {
									dragged.style.height='';
								}});
							}});
						} else {
							hui.dom.insertBefore(parts[dropInfo.partIndex],dummy);
							hui.animate({node:dummy,css:{height:newHeight+'px'},duration:600,ease:hui.ease.slowFastSlow,onComplete:function() {
								hui.dom.remove(dragged);
								hui.dom.replaceNode(dummy,dragged);
								hui.style.set(dragged,{transform:'scale(1)',opacity:0,height:''})
								hui.animate({node:dragged,css:{opacity:1},duration:500,ease:hui.ease.slowFastSlow});
							}});
							hui.animate({node:dragged,css:{transform:'scale(0)',height:'0px'},duration:500,ease:hui.ease.slowFastSlow});
						}
						this._cleanDrag();
					}.bind(this),
					onFailure : function() {
						this._cleanDrag();
					}.bind(this)
				});
			} else {	
				this._cleanDrag();
			}
		}
	},
	_cleanDrag : function() {
		var proxy = this.dragProxy;
		hui.animate({node:proxy,css:{opacity:0},duration:500,delay:500,ease:hui.ease.slowFastSlow,onComplete:function() {
				proxy.style.display='none';
			}
		});
		hui.style.setOpacity(this._dragInfo.draggedElement,1);
		var p = hui.get.byClass(document.body,'hui_editor_drop_placeholder');
		for (var i=0; i < p.length; i++) {
			hui.dom.remove(p[i]);
		};
		this.dropTargets = [];
		this._dragging = false;
		if (this._dropMarker) {
			this._dropMarker.style.display='none'
		}
	},
	_getColumn : function(rowIndex,columnIndex) {
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		var row = rows[rowIndex];
		var columns = hui.get.byClass(row,this.options.columnClass);
		return columns[columnIndex];
	},
	_getPartPosition : function(element) {
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		for (var i=0; i < rows.length; i++) {
			
			var columns = hui.get.byClass(rows[i],this.options.columnClass);
			for (var j=0; j < columns.length; j++) {
				var parts = hui.get.byClass(columns[j],this.options.partClass);
				for (var k=0; k < parts.length; k++) {
					if (element===parts[k]) {
						return {rowIndex:i,columnIndex:j,partIndex:k};
					}
				};
			};
		};
		return null;
	},
	
	
	_activeDragPlaceholder : null,
	
	_dragInfo : null,
	
	_dragColumnHeights : null,
	
	_insertDropPlaceholders : function() {
		var infos = this.dropTargets = [];
		var colHeights = this._dragColumnHeights = {}
		var proxy = this.dragProxy;
		var draggedPart = this._dragInfo.draggedElement;
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		for (var i=0; i < rows.length; i++) {
			var row = rows[i]
			var columns = hui.get.byClass(row,this.options.columnClass);
			for (var j=0; j < columns.length; j++) {
				var column = columns[j];
				hui.style.set(proxy,{
					width : column.clientWidth+'px',
					height : '',
					visibility : 'hidden',
					display : 'block'
				});
				var height = colHeights[i+'-'+j] = proxy.clientHeight;
				var parts = hui.get.byClass(column,this.options.partClass);
				var min = hui.position.getTop(column);
				var max = min+column.clientHeight;
				var current = min;
				var k=0;
				var previous = null;
				for (; k < parts.length; k++) {
					var part = parts[k],
						next = parts[k+1],
						previous = parts[k-1]
					var left = hui.position.getLeft(part);
					var right = left + part.clientWidth;
					var top = previous ? hui.position.getTop(previous)+previous.clientHeight/2 : min;
					var bottom = hui.position.getTop(part)+part.clientHeight/2;
					
					var info = {
						rowIndex : i,
						columnIndex : j,
						partIndex : k,
						part : part,
						left : left,
						right : right,
						top : top,
						bottom : bottom,
						position : hui.position.getTop(part)
					}
					current += part.clientHeight;
					infos.push(info);
					previous = part;
				};
				var last = parts.length>0 ? parts[parts.length-1] : null;
				if (last) {
					var top = hui.position.getTop(last)+last.clientHeight/2;
					var position = hui.position.getTop(last)+last.clientHeight;
				} else {
					var top = min;
					var position = min;
					var left = hui.position.getLeft(column);
					var right = left + column.clientWidth;
				}
				var info = {
					rowIndex : i,
					columnIndex : j,
					partIndex : k+1,
					part : part,
					left : left,
					right : right,
					top : top,
					position : position,
					bottom : max-top > 20 ? max : top+20
				}
				if (part) {
					current += part.clientHeight;
				}
				infos.push(info);
			}
		}
		for (var i=0; i < infos.length; i++) {
			var info = infos[i]
			//info.debug = hui.build('div',{style:'border: 1px solid red; position: absolute; top:'+info.top+'px;left:'+(info.left)+'px; height: '+(info.bottom-info.top)+'px; width:'+(info.right-info.left)+'px',parent:document.body})
		};
	}
}

hui.ui.Editor.getPartId = function(element) {
	var m = element.id.match(/part\-([\d]+)/i);
	if (m && m.length>0) return m[1];
}

////////////////////////////////// Header editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Header = function(element,row,column,position) {
	this.element = hui.get(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = hui.ui.Editor.getPartId(this.element);
	this.header = hui.get.firstByTag(this.element,'*');
	this.field = null;
}

hui.ui.Editor.Header.prototype = {
	activate : function() {
		this.value = this.header.innerHTML;
		this.field = hui.build('textarea',{className:'hui_editor_header'});
		this.field.value = this.value;
		this.header.style.visibility='hidden';
		this.updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		hui.listen(this.field,'keydown',function(e) {
			if (e.keyCode==Event.KEY_RETURN) {
				this.save();
			}
		}.bind(this));
	},
	save : function() {
		var value = this.field.value;
		this.header.innerHTML = value;
		this.deactivate();
		if (value!=this.value) {
			this.value = value;
			hui.ui.Editor.get().partChanged(this);
		}
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
		hui.ui.Editor.get().partDidDeacivate(this);
	},
	updateFieldStyle : function() {
		hui.style.set(this.field,{width:this.header.clientWidth+'px',height:this.header.clientHeight+'px'});
		hui.style.copy(this.header,this.field,['fontSize','lineHeight','marginTop','fontWeight','fontFamily','textAlign','color','fontStyle']);
	},
	getValue : function() {
		return this.value;
	}
}

////////////////////////////////// Html editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Html = function(element,row,column,position) {
	this.element = hui.get(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = hui.ui.Editor.getPartId(this.element);
	this.field = null;
}

hui.ui.Editor.Html.prototype = {
	activate : function() {
		this.value = this.element.innerHTML;
		this.element.innerHTML='';
		var style = this.buildStyle();
		this.editor = hui.ui.MarkupEditor.create({autoHideToolbar:false,style:style});
		this.element.appendChild(this.editor.getElement());
		this.editor.listen(this);
		this.editor.setValue(this.value);
		this.editor.focus();
	},
	buildStyle : function() {
		return {
			'textAlign':hui.style.get(this.element,'text-align')
			,'fontFamily':hui.style.get(this.element,'font-family')
			,'fontSize':hui.style.get(this.element,'font-size')
			,'fontWeight':hui.style.get(this.element,'font-weight')
			,'color':hui.style.get(this.element,'color')
		}
	},
	cancel : function() {
		this.deactivate();
		this.element.innerHTML = this.value;
	},
	save : function() {
		this.deactivate();
		var value = this.editor.getValue();
		if (value!=this.value) {
			this.value = value;
			hui.ui.Editor.get().partChanged(this);
		}
		this.element.innerHTML = this.value;
	},
	deactivate : function() {
		if (this.editor) {
			this.editor.destroy();
			this.element.innerHTML = this.value;
		}
		hui.ui.Editor.get().partDidDeacivate(this);
	},
	richTextDidChange : function() {
		//this.deactivate();
	},
	getValue : function() {
		return this.value;
	}
}

/* EOF *//**
 * @constructor
 */
hui.ui.Menu = function(options) {
	this.options = hui.override({autoHide:false,parentElement:null},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	this.value = null;
	this.subMenus = [];
	this.visible = false;
	hui.ui.extend(this);
	this._addBehavior();
}

hui.ui.Menu.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{'class':'hui_menu'});
	var obj = new hui.ui.Menu(options);
	document.body.appendChild(options.element);
	return obj;
}

hui.ui.Menu.prototype = {
	/** @private */
	_addBehavior : function() {
		this.hider = function() {
			this.hide();
		}.bind(this)
		if (this.options.autoHide) {
			var x = function(e) {
				if (!hui.ui.isWithin(e,this.element) && (!this.options.parentElement || !hui.ui.isWithin(e,this.options.parentElement))) {
					if (!this.isSubMenuVisible()) {
						this.hide();
					}
				}
			}.bind(this);
			hui.listen(this.element,'mouseout',x);
			if (this.options.parentElement) {
				hui.listen(this.options.parentElement,'mouseout',x);
			}
		}
	},
	addDivider : function() {
		hui.build('div',{'class':'hui_menu_divider',parent:this.element});
	},
	addItem : function(item) {
		var self = this;
		var element = hui.build('div',{'class':'hui_menu_item',text:item.title});
		hui.listen(element,'click',function(e) {
			hui.stop(e);
			self.itemWasClicked(item.value);
		});
		if (item.children) {
			var sub = hui.ui.Menu.create({autoHide:true,parentElement:element});
			sub.addItems(item.children);
			hui.listen(element,'mouseover',function(e) {
				sub.showAtElement(element,e,'horizontal');
			});
			self.subMenus.push(sub);
			hui.cls.add(element,'hui_menu_item_children');
		}
		this.element.appendChild(element);
	},
	addItems : function(items) {
		for (var i=0; i < items.length; i++) {
			if (items[i]==null) {
				this.addDivider();
			} else {
				this.addItem(items[i]);
			}
		};
	},
	getValue : function() {
		return this.value;
	},
	itemWasClicked : function(value) {
		this.value = value;
		this.fire('itemWasClicked',value);
		this.fire('select',value);
		this.hide();
	},
	showAtPointer : function(e) {
		e = hui.event(e);
		e.stop();
		this.showAtPoint({'top' : e.getTop(),'left' : e.getLeft()});
	},
	showAtElement : function(element,event,position) {
		event = hui.event(event);
		event.stop();
		element = hui.get(element);
		var point = hui.position.get(element);
		if (position=='horizontal') {
			point.left += element.clientWidth;
		} else if (position=='vertical') {
			point.top += element.clientHeight;
		}
		this.showAtPoint(point);
	},
	showAtPoint : function(pos) {
		var innerWidth = hui.window.getViewWidth();
		var innerHeight = hui.window.getViewHeight();
		var scrollTop = hui.window.getScrollTop();
		var scrollLeft = hui.window.getScrollLeft();
		if (!this.visible) {
			hui.style.set(this.element,{'display':'block','visibility':'hidden',opacity:0});
		}
		var width = this.element.clientWidth;
		var height = this.element.clientHeight;
		var left = Math.min(pos.left,innerWidth-width-26+scrollLeft);
		var top = Math.max(0,Math.min(pos.top,innerHeight-height-20+scrollTop));
		hui.style.set(this.element,{'top':top+'px','left':left+'px','visibility':'visible',zIndex:hui.ui.nextTopIndex()});
		if (!this.element.style.width) {
			this.element.style.width=(width+6)+'px';
		}
		if (!this.visible) {
			hui.style.set(this.element,{opacity:1});
			this.addHider();
			this.visible = true;
		}
	},
	hide : function() {
		if (!this.visible) return;
		var self = this;
		hui.animate(this.element,'opacity',0,200,{onComplete:function() {
			self.element.style.display='none';
		}});
		this.removeHider();
		for (var i=0; i < this.subMenus.length; i++) {
			this.subMenus[i].hide();
		};
		this.visible = false;
	},
	isSubMenuVisible : function() {
		for (var i=0; i < this.subMenus.length; i++) {
			if (this.subMenus[i].visible) return true;
		};
		return false;
	},
	addHider : function() {
		hui.listen(document.body,'click',this.hider);
	},
	removeHider : function() {
		hui.unListen(document.body,'click',this.hider);
	}
}



/* EOF *//**
 * @constructor
 */
hui.ui.Overlay = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.content = hui.get.byClass(this.element,'hui_inner_overlay')[1];
	this.name = options.name;
	this.icons = {};
	this.visible = false;
	hui.ui.extend(this);
	this.addBehavior();
}

/**
 * Creates a new overlay
 */
hui.ui.Overlay.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('div',{className:'hui_overlay',style:'display:none',html:'<div class="hui_inner_overlay"><div class="hui_inner_overlay"></div></div>'});
	document.body.appendChild(e);
	return new hui.ui.Overlay(options);
}

hui.ui.Overlay.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		this.hider = function(e) {
			if (self.boundElement) {
				if (hui.ui.isWithin(e,self.boundElement) || hui.ui.isWithin(e,self.element)) return;
				// TODO: should be unreg'ed but it fails
				//self.boundElement.stopObserving(self.hider);
				hui.cls.remove(self.boundElement,'hui_overlay_bound');
				self.boundElement = null;
				self.hide();
			}
		}
		hui.listen(this.element,'mouseout',this.hider);
	},
	addIcon : function(key,icon) {
		var self = this;
		var element = hui.build('div',{className:'hui_overlay_icon'});
		element.style.backgroundImage='url('+hui.ui.getIconUrl(icon,32)+')';
		hui.listen(element,'click',function(e) {
			self.iconWasClicked(key,e);
		});
		this.icons[key]=element;
		this.content.appendChild(element);
	},
	addText : function(text) {
		this.content.appendChild(hui.build('span',{'class':'hui_overlay_text',text:text}));
	},
	add : function(widget) {
		this.content.appendChild(widget.getElement());
	},
	hideIcons : function(keys) {
		for (var i=0; i < keys.length; i++) {
			this.icons[keys[i]].style.display='none';
		};
	},
	showIcons : function(keys) {
		for (var i=0; i < keys.length; i++) {
			this.icons[keys[i]].style.display='';
		};
	},
	iconWasClicked : function(key,e) {
		hui.ui.callDelegates(this,'iconWasClicked',key,e);
	},
	showAtElement : function(element,options) {
		options = options || {};
		hui.ui.positionAtElement(this.element,element,options);
		if (this.visible) return;
		if (hui.browser.msie) {
			this.element.style.display='block';
		} else {
			hui.style.set(this.element,{'display':'block','opacity':0});
			hui.animate(this.element,'opacity',1,150);
		}
		this.visible = true;
		if (options.autoHide) {
			this.boundElement = element;
			hui.listen(element,'mouseout',this.hider);
			hui.cls.add(element,'hui_overlay_bound');
		}
		if (this.options.modal) {
			var zIndex = hui.ui.nextAlertIndex();
			this.element.style.zIndex=zIndex+1;
			hui.ui.showCurtain({widget:this,zIndex:zIndex});
		}
		return;
	},
	show : function(options) {
		options = options || {};
		if (!this.visible) {
			hui.style.set(this.element,{'display':'block',visibility:'hidden'});
		}
		if (options.element) {
			hui.position.place({
				source : {element:this.element,vertical:0,horizontal:.5},
				target : {element:options.element,vertical:.5,horizontal:.5},
				insideViewPort : true,
				viewPartMargin : 9
			});
		}
		if (this.visible) return;
		hui.effect.bounceIn({element:this.element});
		this.visible = true;
		if (options.autoHide && options.element) {
			this.boundElement = options.element;
			hui.listen(options.element,'mouseout',this.hider);
			hui.cls.add(options.element,'hui_overlay_bound');
		}
		if (this.options.modal) {
			var zIndex = hui.ui.nextAlertIndex();
			this.element.style.zIndex=zIndex+1;
			hui.ui.showCurtain({widget:this,zIndex:zIndex,color:'auto'});
		}
	},
	/** private */
	$curtainWasClicked : function() {
		this.hide();
	},
	hide : function() {
		hui.ui.hideCurtain(this);
		this.element.style.display='none';
		this.visible = false;
	},
	clear : function() {
		hui.ui.destroyDescendants(this.content);
		this.content.innerHTML='';
	}
}

/* EOF */
/**
 * @class
 * @constructor
 *
 * Options
 * {url:'',parameters:{}}
 *
 * Events:
 * uploadDidCompleteQueue - when all files are done
 * uploadDidStartQueue - when the upload starts
 * uploadDidComplete(file) - when a single file is successfull
 * uploadDidFail(file) - when a single file fails
 */
hui.ui.Upload = function(options) {
	this.options = hui.override({
		url : '',
		parameters : {},
		multiple : false,
		maxSize : "20480",
		types : "*.*",
		fieldName : 'file',
		chooseButton : 'Choose files...'
	},options);
	this.element = hui.get(options.element);
	this.itemContainer = hui.get.firstByClass(this.element,'hui_upload_items');
	this.status = hui.get.firstByClass(this.element,'hui_upload_status');
	this.placeholder = hui.get.firstByClass(this.element,'hui_upload_placeholder');
	this.name = options.name;
	this.items = [];
	this.busy = false;
	this._chooseImplementation();
	hui.ui.extend(this);
	this._addBehavior();
}

hui.ui.Upload.implementations = ['Frame','HTML5','Flash'];

hui.ui.Upload.nameIndex = 0;

/** Creates a new upload widget */
hui.ui.Upload.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{
		'class':'hui_upload',
		html : '<div class="hui_upload_items"></div>'+
		'<div class="hui_upload_status"></div>'+
		(options.placeholder ? '<div class="hui_upload_placeholder"><span class="hui_upload_icon"></span>'+
			(options.placeholder.title ? '<h2>'+hui.string.escape(options.placeholder.title)+'</h2>' : '')+
			(options.placeholder.text ? '<p>'+hui.string.escape(options.placeholder.text)+'</p>' : '')+
		'</div>' : '')
	});
	return new hui.ui.Upload(options);
}

hui.ui.Upload.prototype = {
	
	/////////////// Public parts /////////////

	/**
	 * Change a parameter
	 */
	setParameter : function(name,value) {
		this.options.parameters[name] = value;
		this.impl.setParameter(name,value);
	},
	
	clear : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i]) {
				this.items[i].destroy();
			}
		};
		this.items = [];
		this.itemContainer.style.display='none';
		this.status.style.display='none';
		if (this.placeholder) {
			this.placeholder.style.display='block';
		}
	},
	addDropTarget : function(options) {
		if (options.element) {
			hui.drag.listen({
				element : options.element,
				hoverClass : options.hoverClass,
				onFiles : this._transferFiles.bind(this)
			});
		}
	},
	uploadFiles : function(files) {
		this._transferFiles(files);
	},

	//////////////// Private parts ////////////////
	
	_chooseImplementation : function() {
		var impls = hui.ui.Upload.implementations;
		if (this.options.implementation) {
			impls.splice(0,0,this.options.implementation);
		}
		
		for (var i=0; i < impls.length; i++) {
			var impl = hui.ui.Upload[impls[i]];
			var support = impl.support();
			if (support.supported) {
				if (!this.options.multiple && !support.multiple) {
					this.impl = new impl(this);
					hui.log('Selected impl (single): '+impls[i]);
					break;
				} else if (this.options.multiple && support.multiple) {
					this.impl = new impl(this);
					hui.log('Selected impl (multiple): '+impls[i]);
					break;
				}
			}
		};
		if (!this.impl) {
			hui.log('No implementation found, using frame');
			this.impl = new hui.ui.Upload.Frame(this);
		}
	},
	_addBehavior : function() {
		if (!this.impl.initialize) {
			alert(this.impl)
			return;
		}
		hui.ui.onReady(function() {
			this.impl.initialize();
			hui.drag.listen({
				element : this.element,
				hoverClass : 'hui_upload_drop',
				onFiles : this._transferFiles.bind(this)
			});
		}.bind(this));
	},
	
	//////////////////////////// Dropping ///////////////////////

/*	_onDrop : function(e) {
		hui.log('Drop!')
		hui.stop(e);
			hui.log(e)
		if (e.dataTransfer) {
			var files = e.dataTransfer.files;
			if (files && files.length>0) {
				this._transferFiles(files);
			} else {
				hui.log('No files...');
				hui.log(e.dataTransfer.types)
				if (hui.array.contains(e.dataTransfer.types,'image/tiff')) {
					hui.log(e.dataTransfer.getData('image/tiff'))
				}
				hui.log(e.dataTransfer.getData('text/plain'))
				hui.log(e.dataTransfer.getData('text/html'))
				hui.log(e.dataTransfer.getData('url'))
			}
		} else {
			hui.log(e)
		}
	},*/
	_transferFiles : function(files) {
		if (files.length>0) {
			if (!this.options.multiple) {
				this._transferFile(files[0]);
			} else {
				for (var i=0; i < files.length; i++) {
					var file = files[i];
					this._transferFile(file);
				};
			}
		}
	},
	_transferFile : function(file) {
		hui.log(file)
		var item = this.$_addItem({name:file.name,size:file.size});
		hui.request({
			method : 'post',
			file : file,
			url : this.options.url,
			parameters : this.options.parameters,
			onProgress : function(current,total) {
				item.updateProgress(current,total);
			},
			onLoad : function() {
				hui.log('transferFile: load');
			},
			onAbort : function() {
				this.$_itemFail(item);
				item.setError('Afbrudt')
			}.bind(this),
			onSuccess : function() {
				hui.log('transferFile: success');
				this.$_itemSuccess(item);
			}.bind(this),
			onFailure : function() {
				hui.log('transferFile: fail');
				this.$_itemFail(item);
			}.bind(this)
		})
	},

	/////////////////////// Implementation ///////////////////////////
	
	/** @private */
	$_addItem : function(info) {
		if (!this.busy) {
			this.fire('uploadDidStartQueue');
			this.status.style.display='block';
			this._setWidgetEnabled(false);
			this.busy = true;
		}
		return this._addItem(info);
	},
	/** @private */
	$_itemSuccess : function(item) {
		var first = hui.get.firstByClass(this.itemContainer,'hui_upload_item_success');
		item.setProgress(1);
		item.setSuccess();
		this.fire('uploadDidComplete',item.getInfo());
		this._checkQueue();
		var move = first!=null || this.items.length>1;
		move = move && item.element.nextSibling!=null;
		
		if (move && (first==null || first!=item.element.nextSibling)) {
			var parent = item.element.parentNode;
			var height = item.element.clientHeight;
			hui.animate({node:item.element,css:{height:'0px'},ease:hui.ease.slowFastSlow,duration:500,onComplete:function() {
				parent.removeChild(item.element);
				if (first) { 
					parent.insertBefore(item.element,first);
				} else {
					parent.appendChild(item.element);
				}
				hui.animate({node:item.element,css:{height:height+'px'},ease:hui.ease.slowFastSlow,duration:200});
			}});
		}

		
	},
	/** @private */
	$_itemFail : function(item) {
		item.setError('Upload af filen fejlede!');
		this.fire('uploadDidFail',item.getInfo());
		this._checkQueue();
	},
	
	/*
	_updateStatus : function() {
		
		if (this.items.length==0) {
			this.status.style.display='none';
		} else {
			hui.dom.setText(this.status,'Status: '+Math.round(s.successful_uploads/this.items.length*100)+'%');
			this.status.style.display='block';
		}
	},*/
	
	/** @private */
	$_getButtonContainer : function() {
		var buttonContainer = hui.build('span',{'class':'hui_upload_button'});
		if (this.options.widget) {
			var w = hui.ui.get(this.options.widget);
			w.element.parentNode.insertBefore(buttonContainer,w.element);
			w.element.parentNode.removeChild(w.element);
			buttonContainer.appendChild(w.element);
		} else {
			buttonContainer.innerHTML='<a href="javascript:void(0);" class="hui_button"><span><span>'+this.options.chooseButton+'</span></span></a>';
			this.element.appendChild(buttonContainer);
		}
		return buttonContainer;
	},
	
	_setWidgetEnabled : function(enabled) {
		if (this.options.widget) {
			var w = hui.ui.get(this.options.widget);
			if (w && w.setEnabled) {
				w.setEnabled(enabled);
			}
		}
	},
	
	_checkQueue : function() {
		for (var i=0; i < this.items.length; i++) {
			if (!this.items[i].isFinished()) {
				return;
			}
		};
		this.busy = false;
		this._setWidgetEnabled(true);
		this.fire('uploadDidCompleteQueue');
	},
	
		
	//////////////////// Events //////////////
		
	/** @private */
	_addItem : function(file) {
		var index = file.index;
		if (index===undefined) {
			index = this.items.length;
			file.index = index;
		}
		var rearrange = index>4;
		var item = new hui.ui.Upload.Item(file,rearrange);
		this.items[index] = item;
		var first = hui.get.firstByClass(this.itemContainer,'hui_upload_item_success');
		if (first) {
			this.itemContainer.insertBefore(item.element,first);
		} else {
			this.itemContainer.appendChild(item.element);
		}
		this.itemContainer.style.display='block';
		if (this.placeholder) {
			this.placeholder.style.display='none';
		}
		return item;
	}
}




/////////////////// Item ///////////////////

/**
 * @class
 * @constructor
 */
hui.ui.Upload.Item = function(info,rearrange) {
	this.data = info;
	this.rearrange = rearrange;
	this.element = hui.build('div',{className:'hui_upload_item'});
	this.element.appendChild(hui.ui.createIcon('file/generic',32));
	this.content = hui.build('div',{className:'hui_upload_item_content',parent:this.element});
	this.progress = hui.ui.ProgressBar.create({small:true});
	this.content.appendChild(this.progress.getElement());
	var text = hui.build('p',{parent:this.content});
	this.info = hui.build('strong',{parent:text});
	this.status = hui.build('em',{parent:text});
	if (info.name) {
		hui.dom.setText(this.info,info.name);
	}
	this.finished = false;
	this.error = false;
}

hui.ui.Upload.Item.prototype = {
	getInfo : function() {
		return this.data;
	},
	isFinished : function() {
		return this.finished;
	},
	setError : function(error) {
		this._setStatus(error || 'Fejl');
		hui.cls.add(this.element,'hui_upload_item_error');
		this.progress.hide();
		this.progress.setValue(0);
		this.finished = true;
	},
	setSuccess : function(status) {
		this._setStatus('Færdig');
		this.progress.setValue(1);
		this.finished = true;
		hui.cls.add(this.element,'hui_upload_item_success');
	},
	updateProgress : function(complete,total) {
		this.setProgress(complete/total);
		return this;
	},
	setProgress : function(value) {
		this._setStatus('Overfører');
		this.progress.setValue(Math.min(0.9999,value));
		return this;
	},
	setWaiting : function() {
		this._setStatus('Venter');
		this.progress.setWaiting();
		return this;
	},
	hide : function() {
		this.element.hide();
	},
	destroy : function() {
		hui.dom.remove(this.element);
	},
	_setStatus : function(text) {
		if (this._status!==text) {
			hui.dom.setText(this.status,text);
			this._status = text;
		}
	}
}

//// Util ////

hui.ui.Upload._nameIndex = 0;

hui.ui.Upload._buildForm = function(widget) {
	var options = widget.options;

	hui.ui.Upload._nameIndex++;
	var frameName = 'hui_upload_'+hui.ui.Upload.Frame.nameIndex;

	var form = hui.build('form');
	form.setAttribute('action',options.url || '');
	form.setAttribute('method','post');
	form.setAttribute('enctype','multipart/form-data');
	form.setAttribute('encoding','multipart/form-data');
	form.setAttribute('target',frameName);
	if (options.parameters) {
		for (var key in options.parameters) {
			var hidden = hui.build('input',{'type':'hidden','name':key});
			hidden.value = options.parameters[key];
			form.appendChild(hidden);
		}
	}
	return form;
}











/////////////////////// Frame //////////////////////////

/**
 * @class
 * @constructor
 */
hui.ui.Upload.Frame = function(parent) {
	this.parent = parent;
}

hui.ui.Upload.Frame.support = function() {
	return {supported:true,multiple:false};
}

hui.ui.Upload.Frame.prototype = {
	
	initialize : function() {
		var options = this.parent.options;
		
		var form = this.form = hui.ui.Upload._buildForm(this.parent);
		var frameName = form.getAttribute('target');
		
		var iframe = this.iframe = hui.build('iframe',{name : frameName, id : frameName, src : hui.ui.context+'/hui/html/blank.html', style : 'display:none'});
		this.parent.element.appendChild(iframe);
		hui.listen(this.iframe,'load',function() {this._uploadComplete()}.bind(this));
		
		this.fileInput = hui.build('input',{'type':'file','name':options.fieldName});
		hui.listen(this.fileInput,'change',this._onSubmit.bind(this));
		
		form.appendChild(this.fileInput);
		var span = hui.build('span',{'class':'hui_upload_button_input'});
		span.appendChild(form);
		var c = this.parent.$_getButtonContainer();		
		c.insertBefore(span,c.firstChild);
	},
	setParameter : function(name,value) {
		var existing = this.form.getElementsByTagName('input');
		for (var i=0; i < existing.length; i++) {
			if (existing[i].name==name) {
				existing[i].value = value;
				return;
			}
		};
		hui.build('input',{'type':'hidden','name':name,'value':value,parent:this.form});
	},
	
	_rebuildParameters : function() {
		// IE: set value of parms again since they disappear
		if (hui.browser.msie) {
			hui.each(this.parent.options.parameters,function(key,value) {
				this.form[key].value = value;
			}.bind(this));
		}
	},
	_rebuildFileInput : function() {
		var options = this.parent.options;
		var old = this.fileInput;
		this.fileInput = hui.build('input',{'type':'file','name':options.fieldName});
		hui.listen(this.fileInput,'change',this._onSubmit.bind(this));
		hui.dom.replaceNode(old,this.fileInput);
		hui.log('Frame: input replaced');
	},
	_getFileName : function() {
		return this.fileInput.value.split('\\').pop();
	},
	_onSubmit : function() {
		this.form.style.display='none';
		this.uploading = true;
		this._rebuildParameters();
		this.form.submit();
		this.item = this.parent.$_addItem({name:this._getFileName()});
		this.item.setWaiting();
		this._rebuildFileInput();
		hui.log('Frame: Upload started');
	},
	
	_uploadComplete : function() {
		if (!this.uploading) {
			return;
		}
		this.uploading = false;
		var success = this._isSuccessResponse();
		hui.log('Frame: Upload complete: success='+success);
		var item = this.item;
		if (item) {
			if (success) {
				this.parent.$_itemSuccess(item);
				hui.log('Frame: Upload succeeded');
			} else {
				this.parent.$_itemFail(item);
				hui.log('Frame: Upload failed!');
			}
		}
		this.iframe.src = hui.ui.context+'/hui/html/blank.html';
		this.form.style.display = 'block';
		this.form.reset();
	},
	_isSuccessResponse : function() {
		var doc = hui.frame.getDocument(this.iframe);
		return doc.body.innerHTML.indexOf('SUCCESS')!==-1;
	}
}












/////////////////////// Flash //////////////////////////

/**
 * @class
 * @constructor
 */
hui.ui.Upload.Flash = function(parent) {
	this.parent = parent;
	
	this.items = [];
}

hui.ui.Upload.Flash.support = function() {
	if (hui.browser.chrome) {
		//return {supported:false,multiple:true};
	}
	return {supported:hui.ui.Flash.getMajorVersion()>=10 && window.SWFUpload!==undefined,multiple:true};
}

hui.ui.Upload.Flash.prototype = {
	initialize : function() {
		var options = this.parent.options;
		
		hui.log('Creating flash verison');
		var url = this._getAbsoluteUrl(options.url);
		var javaSession = hui.cookie.get('JSESSIONID');
		if (javaSession) {
			url+=';jsessionid='+javaSession;
		}
		var phpSession = hui.cookie.get('PHPSESSID');
		if (phpSession) {
			url+='?PHPSESSID='+phpSession;
		}
		var buttonContainer = hui.build('span',{'class':'hui_upload_button'});
		var placeholder = hui.build('span',{'class':'hui_upload_button_object',parent:buttonContainer});
		if (options.widget) {
			var w = hui.ui.get(options.widget);
			w.element.parentNode.insertBefore(buttonContainer,w.element);
			w.element.parentNode.removeChild(w.element);
			buttonContainer.appendChild(w.element);
		} else {
			buttonContainer.innerHTL='<a href="javascript:void(0);" class="hui_button"><span><span>'+options.chooseButton+'</span></span></a>';
			this.parent.element.appendChild(buttonContainer);
		}
		
		this.loader = new SWFUpload({
			upload_url : url,
			flash_url : hui.ui.context+"/hui/lib/swfupload/swfupload.swf",
			file_size_limit : options.maxSize,
			file_queue_limit : options.maxItems,
			file_post_name : options.fieldName,
			file_upload_limit : options.maxItems,
			file_types : options.types,
			debug : !true,
			post_params : options.parameters,
			button_placeholder_id : 'x',
			button_placeholder : placeholder,
			button_width : '100%',
			button_height : 30,

			swfupload_loaded_handler : this._onFlashLoaded.bind(this),
			file_queued_handler : this._onFileQueued.bind(this),
			file_queue_error_handler : this._onFileQueueError.bind(this),
			file_dialog_complete_handler : this._onFileDialogComplete.bind(this),
			upload_start_handler : this._onUploadStart.bind(this),
			upload_progress_handler : this._onUploadProgress.bind(this),
			upload_error_handler : this._onUploadError.bind(this),
			upload_success_handler : this._onUploadSuccess.bind(this),
			upload_complete_handler : this._onUploadComplete.bind(this)
		});
	},
	setParameter : function(key,value) {
		hui.log('Flash: Warning: cannot change parameters');
	},
	_getAbsoluteUrl : function(relative) {
		var loc = new String(document.location);
		var url = loc.slice(0,loc.lastIndexOf('/'));
		while (relative.indexOf('../')===0) {
			relative=relative.substring(3);
			url = url.slice(0,url.lastIndexOf('/'));
		}
		url += '/'+relative;
		return url;
	},
	
	////// Flash listeners /////
	
	_onFlashLoaded : function() {
		hui.log('Flash loaded');
	},
	_onFileQueued : function(file) {
		var item = this.parent.$_addItem({name:file.name,size:file.size});
		item.setWaiting();
		this.items.push(item);
	},
	_onFileQueueError : function(file, error, message) {
		hui.log('Flash: fileQueueError file:'+hui.string.toJSON(file)+', error:'+error+', message:'+message);
		if (file!==null) {
			var item = this.parent.$_addItem({name:file.name,size:file.size});
			this.items.push(item);
			this.parent.$_itemFail(item);
			item.setError(hui.ui.Upload.Flash.errors[error]);
		} else {
			hui.ui.showMessage({text:hui.ui.Upload.Flash.errors[error],duration:4000});
		}
	},
	_onFileDialogComplete : function() {
		hui.log('Flash: fileDialogComplete');
		this.loader.startUpload();
	},
	_onUploadStart : function() {

	},
	_onUploadProgress : function(file,complete,total) {
		var item = this.items[file.index];
		item.updateProgress(complete,total);
	},
	_onUploadError : function(file, error, message) {
		hui.log('Flash: uploadError file:'+file+', error:'+error+', message:'+message);
		if (file) {
			var item = this.items[file.index];
			this.parent.$_itemFail(item);
			item.setError(hui.ui.Upload.Flash.errors[error]);
		}
	},
	/** @private */
	_onUploadSuccess : function(file,data) {
		var item = this.items[file.index];
		item.updateProgress(file.size,file.size);
		this.parent.$_itemSuccess(item);
	},
	/** @private */
	_onUploadComplete : function(file) {
		this.loader.startUpload();		
	}
}

!(function() {
	var e = hui.ui.Upload.Flash.errors = {};
	var s = hui.ui.Upload.Flash.status = {};
	if (window.SWFUpload) {
		e[SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED]			= 'Der er valgt for mange filer';
		e[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]		= 'Filen er for stor';
		e[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]					= 'Filen er tom';
		e[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]				= 'Filens type er ikke understøttet';
		e[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]					= 'Der skete en netværksfejl';
		e[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]			= 'Upload-adressen findes ikke';
		e[SWFUpload.UPLOAD_ERROR.IO_ERROR]						= 'Der skete en IO-fejl';
		e[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]				= 'Der skete en sikkerhedsfejl';
		e[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]			= 'Upload-størrelsen er overskredet';
		e[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]					= 'Upload af filen fejlede';
		e[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]	= 'Filens id kunne ikke findes';
		e[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]		= 'Validering af filen fejlede';
		e[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]				= 'Filen blev afbrudt';
		e[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]				= 'Upload af filen blev stoppet';
		s[SWFUpload.FILE_STATUS.QUEUED] 		= 'I kø';
		s[SWFUpload.FILE_STATUS.IN_PROGRESS] 	= 'I gang';
		s[SWFUpload.FILE_STATUS.ERROR] 			= 'Filen gav fejl';
		s[SWFUpload.FILE_STATUS.COMPLETE] 		= 'Færdig';
		s[SWFUpload.FILE_STATUS.CANCELLED] 		= 'Afbrudt';
	}
})()








//////////////////// HTML5 //////////////////////


/**
 * @class
 * @constructor
 */
hui.ui.Upload.HTML5 = function(parent) {
	this.parent = parent;
}

hui.ui.Upload.HTML5.support = function() {
	var supported = window.File!==undefined && (hui.browser.webkit || hui.browser.gecko);//(window.File!==undefined && window.FileReader!==undefined && window.FileList!==undefined && window.Blob!==undefined);
	hui.log('HTML5: supported='+supported);
	//supported = !true;
	return {
		supported : supported,
		multiple : true
	};
}

hui.ui.Upload.HTML5.prototype = {
	initialize : function() {
		var options = this.parent.options;
		var span = hui.build('span',{'class':'hui_upload_button_input'});
		this.fileInput = hui.build('input',{'type':'file','name':options.fieldName,'multiple':'multiple',parent:span});
		var c = this.parent.$_getButtonContainer();		
		c.insertBefore(span,c.firstChild);
		hui.listen(this.fileInput,'change',this._submit.bind(this));
	},
	_submit : function(e) {
		var files = this.fileInput.files;
		this.parent._transferFiles(files);
	}
}

/* EOF *//** A progress bar is a widget that shows progress from 0% to 100%
	@constructor
*/
hui.ui.ProgressBar = function(o) {
	this.element = hui.get(o.element);
	this.name = o.name;
	/** @private */
	this.WAITING = o.small ? 'hui_progressbar_small_waiting' : 'hui_progressbar_waiting';
	/** @private */
	this.COMPLETE = o.small ? 'hui_progressbar_small_complete' : 'hui_progressbar_complete';
	/** @private */
	this.options = o || {};
	/** @private */
	this.indicator = hui.get.firstByTag(this.element,'div');
	hui.ui.extend(this);
}

/** Creates a new progress bar:
	@param o {Object} Options : {small:false}
*/
hui.ui.ProgressBar.create = function(o) {
	o = o || {};
	var e = o.element = hui.build('div',{'class':o.small ? 'hui_progressbar hui_progressbar_small' : 'hui_progressbar'});
	e.appendChild(document.createElement('div'));
	return new hui.ui.ProgressBar(o);
}
	
hui.ui.ProgressBar.prototype = {
	/** Set the progress value
	@param value {Number} A number between 0 and 1
	*/
	setValue : function(value) {
		var el = this.element;
		if (this.waiting) {
			hui.cls.remove(el,this.WAITING);
		}
		hui.cls.set(el,this.COMPLETE,value==1);
		hui.animate(this.indicator,'width',(value*100)+'%',200);
	},
	/** Mark progress as waiting */
	setWaiting : function() {
		this.waiting = true;
		this.indicator.style.width=0;
		hui.cls.add(this.element,this.WAITING);
	},
	/** Reset the progress bar */
	reset : function() {
		var el = this.element;
		if (this.waiting) {
			hui.cls.remove(el,this.WAITING);
		}
		hui.cls.remove(el,this.COMPLETE);
		this.indicator.style.width='0%';
	},
	/** Hide the progress bar */
	hide : function() {
		this.element.style.display = 'none';
	},
	/** Show the progress bar */
	show : function() {
		this.element.style.display = 'block';
	}
}

/* EOF *//** @constructor */
hui.ui.Gallery = function(options) {
	this.options = options || {};
	this.name = options.name;
	this.element = hui.get(options.element);
	this.body = hui.get.firstByClass(this.element,'hui_gallery_body');
	this.objects = [];
	this.nodes = [];
	this.selected = [];
	this.width = 100;
	this.height = 100;
	this.revealing = false;
	hui.ui.extend(this);
	if (options.dropFiles) {
		this._addDrop();
	}
	if (this.options.source) {
		this.options.source.listen(this);
	}
	if (this.element.parentNode && hui.cls.has(this.element.parentNode,'hui_overflow')) {
		this.revealing = true;
		hui.listen(this.element.parentNode,'scroll',this._reveal.bind(this));
	}
}

hui.ui.Gallery.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{'class':'hui_gallery',html:'<div class="hui_gallery_progress"></div><div class="hui_gallery_body"></div>'});
	return new hui.ui.Gallery(options);
}

hui.ui.Gallery.prototype = {
	_addDrop : function() {
		hui.drag.listen({
			element : this.element,
			hoverClass : 'hui_gallery_drop',
			onFiles : function(files) {
				this.fire('filesDropped',files);
			}.bind(this),
			onURL : function(url) {
				this.fire('urlDropped',url);
			}.bind(this)
		})
	},
	hide : function() {
		this.element.style.display='none';
	},
	show : function() {
		this.element.style.display='';
	},
	setObjects : function(objects) {
		this.objects = objects;
		this.render();
		this.fire('selectionReset');
	},
	getObjects : function() {
		return this.objects;
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return this.element.style.display!='none';
	},
	/** @private */
	$objectsLoaded : function(objects) {
		this.setObjects(objects);
	},
	/** @private */
	$itemsLoaded : function(objects) {
		this.setObjects(objects);
	},
	/** @private */
	render : function() {
		this.nodes = [];
		this.maxRevealed=0;
		this.body.innerHTML='';
		var self = this;
		hui.each(this.objects,function(object,i) {
			var url = self._resolveImageUrl(object),
				top = 0;
			if (url!==null) {
				url = url.replace(/&amp;/,'&');
			}
			if (!self.revealing && object.height<object.width) {
				top = (self.height-(self.height*object.height/object.width))/2;
			}
			var img = hui.build('img',{style:'margin:'+top+'px auto 0px'});
			img.setAttribute(self.revealing ? 'data-src' : 'src', url );
			var item = hui.build('div',{'class' : 'hui_gallery_item',style:'width:'+self.width+'px; height:'+self.height+'px'});
			item.appendChild(img);
			hui.listen(item,'click',function() {
				self._itemClicked(i);
			});
			item.dragDropInfo = {kind:'image',icon:'common/image',id:object.id,title:object.name || object.title};
			item.onmousedown=function(e) {
				hui.ui.startDrag(e,item);
				return false;
			};
			hui.listen(item,'dblclick',function() {
				self.itemDoubleClicked(i);
			});
			self.body.appendChild(item);
			self.nodes.push(item);
		});
		this._reveal();
	},
	/** @private */
	$$resize : function() {
		if (this.nodes.length>0) {
			this._reveal();
		}
	},
	_reveal : function() {
		if (!this.revealing) {return}
		var container = this.element.parentNode;
		var limit = container.scrollTop+container.clientHeight;
		if (limit<=this.maxRevealed) {
			return;
		}
		this.maxRevealed = limit;
		for (var i=0,l=this.nodes.length; i < l; i++) {
			var item = this.nodes[i];
			if (item.revealed) {continue}
			if (item.offsetTop<limit) {
				var img = item.getElementsByTagName('img')[0];
				item.className = 'hui_gallery_item hui_gallery_item_busy';
				var self = this;
				img.onload = function() {
					this.parentNode.className = 'hui_gallery_item';
					if (this.height<this.width) {
						var top = (self.height-(self.height*this.height/this.width))/2;
						this.style.marginTop = top+'px';
					}
				}
				img.onerror = function() {
					this.parentNode.className = 'hui_gallery_item hui_gallery_item_error';
				}
				img.src = img.getAttribute('data-src');
				item.revealed = true;
			}
		};
	},
	_updateUI : function() {
		var s = this.selected;
		for (var i=0; i < this.nodes.length; i++) {
			hui.cls.set(this.nodes[i],'hui_gallery_item_selected',hui.array.contains(s,i));
		};
	},
	_resolveImageUrl : function(img) {
		return hui.ui.resolveImageUrl(this,img,this.width,this.height);
		for (var i=0; i < this.delegates.length; i++) {
			if (this.delegates[i]['$resolveImageUrl']) {
				return this.delegates[i]['$resolveImageUrl'](img,this.width,this.height);
			}
		};
		return '';
	},
	_itemClicked : function(index) {
		if (this.busy) {
			return;
		}
		this.selected = [index];
		this.fire('selectionChanged');
		this._updateUI();
	},
	getFirstSelection : function() {
		if (this.selected.length>0) {
			return this.objects[this.selected[0]];
		}
		return null;
	},
	/** @private */
	itemDoubleClicked : function(index) {
		if (this.busy) {
			return;
		}
		this.fire('itemOpened',this.objects[index]);
	},
	/**
	 * Sets the lists data source and refreshes it if it is new
	 * @param {hui.ui.Source} source The source
	 */
	setSource : function(source) {
		if (this.options.source!=source) {
			if (this.options.source) {
				this.options.source.removeDelegate(this);
			}
			source.listen(this);
			this.options.source = source;
			source.refresh();
		}
	},
	/** @private */
	$sourceIsBusy : function() {
		this._setBusy(true);
	},
	/** @private */
	$sourceIsNotBusy : function() {
		this._setBusy(false);
	},
	/** @private */
	$visibilityChanged : function() {
		if (hui.dom.isVisible(this.element)) {
			this._reveal();
		}
	},
	_setBusy : function(busy) {
		this.busy = busy;
		window.clearTimeout(this.busytimer);
		if (busy) {
			var e = this.element;
			this.busytimer = window.setTimeout(function() {
				hui.cls.add(e,'hui_gallery_busy');
			},300);
		} else {
			hui.cls.remove(this.element,'hui_gallery_busy');
		}
	}
}

/* EOF *//**
 * @constructor
 */
hui.ui.Calendar = function(o) {
	this.name = o.name;
	this.options = hui.override({startHour:7,endHour:24},o);
	this.element = hui.get(o.element);
	this.head = hui.get.firstByTag(this.element,'thead');
	this.body = hui.get.firstByTag(this.element,'tbody');
	this.date = new Date();
	hui.ui.extend(this);
	this.buildUI();
	this.updateUI();
	if (this.options.source) {
		this.options.source.listen(this);
	}
}

hui.ui.Calendar.prototype = {
	show : function() {
		this.element.style.display='block';
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	hide : function() {
		this.element.style.display='none';
	},
	/** @private */
	getFirstDay : function() {
		var date = new Date(this.date.getTime());
		date.setDate(date.getDate()-date.getDay()+1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return date;
	},
	/** @private */
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
		var nodes = hui.get.byClass(this.element,'hui_calendar_event');
		for (var i=0; i < nodes.length; i++) {
			hui.dom.remove(nodes[i]);
		};
		this.hideEventViewer();
	},
	/** @private */
	$objectsLoaded : function(data) {
		try {
			this.setEvents(data);
		} catch (e) {
			hui.log(e);
		}
	},
	/** @private */
	$sourceIsBusy : function() {
		this.setBusy(true);
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return this.element.style.display!='none';
	},
	setEvents : function(events) {
		events = events || [];
		for (var i=0; i < events.length; i++) {
			var e = events[i];
			if (typeof(e.startTime)!='object') {
				e.startTime = new Date(parseInt(e.startTime)*1000);
			}
			if (typeof(e.endTime)!='object') {
				e.endTime = new Date(parseInt(e.endTime)*1000);
			}
		};
		this.setBusy(false);
		this.clearEvents();
		this.events = events;
		var self = this;
		var pixels = (this.options.endHour-this.options.startHour)*40;
		var week = this.getFirstDay().getWeekOfYear();
		var year = this.getFirstDay().getYear();
		hui.each(this.events,function(event) {
			var day = hui.get.byClass(self.body,'hui_calendar_day')[event.startTime.getDay()-1];
			if (!day) {
				return;
			}
			if (event.startTime.getWeekOfYear()!=week || event.startTime.getYear()!=year) {
				return;
			}
			var node = hui.build('div',{'class':'hui_calendar_event',parent:day});
			var top = ((event.startTime.getHours()*60+event.startTime.getMinutes())/60-self.options.startHour)*40-1;
			var height = (event.endTime.getTime()-event.startTime.getTime())/1000/60/60*40+1;
			height = Math.min(pixels-top,height);
			hui.style.set(node,{'marginTop':top+'px','height':height+'px',visibility:'hidden'});
			var content = hui.build('div',{parent:node});
			hui.build('p',{'class':'hui_calendar_event_time',text:event.startTime.dateFormat('H:i'),parent:content});
			hui.build('p',{'class':'hui_calendar_event_text',text:event.text,parent:content});
			if (event.location) {
				hui.build('p',{'class':'hui_calendar_event_location',text:event.location,parent:content});
			}
			
			window.setTimeout(function() {
				hui.effect.bounceIn({element:node});
			},Math.random()*200)
			hui.listen(node,'click',function() {
				self.eventWasClicked(node);
			});
		});
	},
	/** @private */
	eventWasClicked : function(node) {
		this.showEvent(node);
	},
	/** @private */
	setBusy : function(busy) {
		hui.cls.set(this.element,'hui_calendar_busy',busy);
	},
	/** @private */
	updateUI : function() {
		var first = this.getFirstDay();		
		var days = hui.get.byClass(this.head,'day');
		for (var i=0; i < days.length; i++) {
			var date = new Date(first.getTime());
			date.setDate(date.getDate()+i);
			hui.dom.setText(days[i],date.dateFormat('l \\d. d M'));
		};
	},
	/** @private */
	buildUI : function() {
		var bar = hui.get.firstByClass(this.element,'hui_calendar_bar');
		this.toolbar = hui.ui.Toolbar.create({labels:false});
		bar.appendChild(this.toolbar.getElement());
		var previous = hui.ui.Button.create({name:'huiCalendarPrevious',text:'',icon:'monochrome/previous'});
		previous.listen(this);
		this.toolbar.add(previous);
		var today = hui.ui.Button.create({name:'huiCalendarToday',text:'Idag'});
		today.click(function() {this.setDate(new Date())}.bind(this));
		this.toolbar.add(today);
		var next = hui.ui.Button.create({name:'huiCalendarNext',text:'',icon:'monochrome/next'});
		next.listen(this);
		this.toolbar.add(next);
		this.datePickerButton = hui.ui.Button.create({name:'huiCalendarDatePicker',text:'Vælg dato...'});
		this.datePickerButton.listen(this);
		this.toolbar.add(this.datePickerButton);
		
		var time = hui.get.firstByClass(this.body,'hui_calendar_day');
		for (var i=this.options.startHour; i <= this.options.endHour; i++) {
			var node = hui.build('div',{'class':'hui_calendar_time',html:'<span><em>'+i+':00</em></span>'});
			if (i==this.options.startHour) {
				hui.cls.add(node,'hui_calendar_time_first');
			}
			if (i==this.options.endHour) {
				hui.cls.add(node,'hui_calendar_time_last');
			}
			time.appendChild(node);
		};
	},
	/** @private */
	$click$huiCalendarPrevious : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()-7);
		this.setDate(date);
	},
	/** @private */
	$click$huiCalendarNext : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()+7);
		this.setDate(date);
	},
	setDate: function(date) {
		this.date = new Date(date.getTime());
		this.updateUI();
		this.refresh();
		if (this.datePicker) {
			this.datePicker.setValue(this.date);
		}
	},
	/** @private */
	$click$huiCalendarDatePicker : function() {
		this.showDatePicker();
	},
	refresh : function() {
		this.clearEvents();
		this.setBusy(true);
		var info = {'startTime':this.getFirstDay(),'endTime':this.getLastDay()};
		this.fire('calendarSpanChanged',info);
		hui.ui.firePropertyChange(this,'startTime',this.getFirstDay());
		hui.ui.firePropertyChange(this,'endTime',this.getLastDay());
	},
	/** @private */
	valueForProperty : function(p) {
		if (p=='startTime') {
			return this.getFirstDay();
		}
		if (p=='endTime') {
			return this.getLastDay();
		}
		return this[p];
	},
	
	////////////////////////////////// Date picker ///////////////////////////
	/** @private */
	showDatePicker : function() {
		if (!this.datePickerPanel) {
			this.datePickerPanel = hui.ui.BoundPanel.create();
			this.datePicker = hui.ui.DatePicker.create({name:'huiCalendarDatePicker',value:this.date});
			this.datePicker.listen(this);
			this.datePickerPanel.add(this.datePicker);
			this.datePickerPanel.addSpace(3);
			var button = hui.ui.Button.create({name:'huiCalendarDatePickerClose',text:'Luk',small:true,rounded:true});
			button.listen(this);
			this.datePickerPanel.add(button);
		}
		this.datePickerPanel.position(this.datePickerButton.getElement());
		this.datePickerPanel.show();
	},
	/** @private */
	$click$huiCalendarDatePickerClose : function() {
		this.datePickerPanel.hide();
	},
	/** @private */
	$dateChanged$huiCalendarDatePicker : function(date) {
		this.setDate(date);
	},
	
	//////////////////////////////// Event viewer //////////////////////////////
	
	/** @private */
	showEvent : function(node) {
		if (!this.eventViewerPanel) {
			this.eventViewerPanel = hui.ui.BoundPanel.create({width:270,padding: 3});
			this.eventInfo = hui.ui.InfoView.create(null,{height:240,clickObjects:true});
			this.eventViewerPanel.add(this.eventInfo);
			this.eventViewerPanel.addSpace(5);
			var button = hui.ui.Button.create({name:'huiCalendarEventClose',text:'Luk'});
			button.listen(this);
			this.eventViewerPanel.add(button);
		}
		this.eventInfo.clear();
		this.eventInfo.setBusy(true);
		this.eventViewerPanel.position(node);
		this.eventViewerPanel.show();
		hui.ui.callDelegates(this,'requestEventInfo');
		return;
	},
	/** @private */
	updateEventInfo : function(event,data) {
		this.eventInfo.setBusy(false);
		this.eventInfo.update(data);
	},
	/** @private */
	$click$huiCalendarEventClose : function() {
		this.hideEventViewer();
	},
	/** @private */
	hideEventViewer : function() {
		if (this.eventViewerPanel) {
			this.eventViewerPanel.hide();
		}
	}
}

/* EOF *//**
	Fires dateChanged(date) when the user changes the date
	@constructor
	@param options The options (non)
*/
hui.ui.DatePicker = function(options) {
	this.name = options.name;
	this.element = hui.get(options.element);
	this.options = {};
	hui.override(this.options,options);
	this.cells = [];
	this.title = hui.get.firstByTag(this.element,'strong');
	this.today = new Date();
	this.value = this.options.value ? new Date(this.options.value.getTime()) : new Date();
	this.viewDate = new Date(this.value.getTime());
	this.viewDate.setDate(1);
	hui.ui.extend(this);
	this._addBehavior();
	this._updateUI();
}

hui.ui.DatePicker.create = function(options) {
	var element = options.element = hui.build('div',{
		'class' : 'hui_datepicker',
		html : '<div class="hui_datepicker_header"><a class="hui_datepicker_next"></a><a class="hui_datepicker_previous"></a><strong></strong></div>'
		}),
		table = hui.build('table',{parent:element}),
		thead = hui.build('thead',{parent:table}),
		head = hui.build('tr',{parent:thead});
	for (var i=0;i<7;i++) {
		head.appendChild(hui.build('th',{text:Date.dayNames[i].substring(0,3)}));
	}
	var body = hui.build('tbody',{parent:table});
	for (var j=0;j<6;j++) {
		var row = hui.build('tr',{parent:body});
		for (var k=0;k<7;k++) {
			hui.build('td',{parent:row});
		}
	}
	return new hui.ui.DatePicker(options);
}

hui.ui.DatePicker.prototype = {
	_addBehavior : function() {
		var self = this;
		this.cells = hui.get.byTag(this.element,'td');
		hui.each(this.cells,function(cell,index) {
			hui.listen(cell,'mousedown',function() {self._selectCell(index)});
		})
		var next = hui.get.firstByClass(this.element,'hui_datepicker_next');
		var previous = hui.get.firstByClass(this.element,'hui_datepicker_previous');
		hui.listen(next,'mousedown',function() {self.next()});
		hui.listen(previous,'mousedown',function() {self.previous()});
	},
	/** Set the date
	  * @param date The js Date to set
	  */
	setValue : function(date) {
		this.value = new Date(date.getTime());
		this.viewDate = new Date(date.getTime());
		this.viewDate.setDate(1);
		this._updateUI();
	},
	_updateUI : function() {
		hui.dom.setText(this.title,this.viewDate.dateFormat('F Y'));
		var isSelectedYear =  this.value.getFullYear()==this.viewDate.getFullYear();
		var month = this.viewDate.getMonth();
		for (var i=0; i < this.cells.length; i++) {
			var date = this._indexToDate(i);
			var cell = this.cells[i];
			if (date.getMonth()<month) {
				cell.className = 'hui_datepicker_dimmed';
			} else if (date.getMonth()>month) {
				cell.className = 'hui_datepicker_dimmed';
			} else {
				cell.className = '';
			}
			if (date.getDate()==this.value.getDate() && date.getMonth()==this.value.getMonth() && isSelectedYear) {
				hui.cls.add(cell,'hui_datepicker_selected');
			}
			if (date.getDate()==this.today.getDate() && date.getMonth()==this.today.getMonth() && date.getFullYear()==this.today.getFullYear()) {
				hui.cls.add(cell,'hui_datepicker_today');
			}
			hui.dom.setText(cell,date.getDate());
		};
	},
	_getPreviousMonth : function() {
		var previous = new Date(this.viewDate.getTime());
		previous.setMonth(previous.getMonth()-1);
		return previous;
	},
	_getNextMonth : function() {
		var previous = new Date(this.viewDate.getTime());
		previous.setMonth(previous.getMonth()+1);
		return previous;
	},

	////////////////// Events ///////////////
	/** Change to previous month */
	previous : function() {
		this.viewDate = this._getPreviousMonth();
		this._updateUI();
	},
	/** Change to next month */
	next : function() {
		this.viewDate = this._getNextMonth();
		this._updateUI();
	},
	_selectCell : function(index) {
		this.value = this._indexToDate(index);
		this.viewDate = new Date(this.value.getTime());
		this.viewDate.setDate(1);
		this._updateUI();
		hui.ui.callDelegates(this,'dateChanged',this.value);
	},
	_indexToDate : function(index) {
		var first = this.viewDate.getDay(),
			days = this.viewDate.getDaysInMonth(),
			previousDays = this._getPreviousMonth().getDaysInMonth(),
			date;
		if (index<first) {
			date = this._getPreviousMonth();
			date.setDate(previousDays-first+index+1);
		} else if (index>first+days-1) {
			date = this._getPreviousMonth();
			date.setDate(index-first-days+1);
		} else {
			date = new Date(this.viewDate.getTime());
			date.setDate(index+1-first);
		}
		return date;
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

/* EOF *//**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.Layout = function(options) {
	this.name = options.name;
	this.options = options || {};
	this.element = hui.get(options.element);
	hui.ui.extend(this);
}

hui.ui.Layout.create = function(options) {
	options = hui.override({text:'',highlighted:false,enabled:true},options);
	options.element = hui.build('table',{'class' : 'hui_layout'});
	options.element.innerHTML = '<tbody class="hui_layout"><tr class="hui_layout_middle"><td class="hui_layout_middle">'+
			'<table class="hui_layout_middle"><tr>'+
			'<td class="hui_layout_left hui_context_sidebar"><div class="hui_layout_left"></div></td>'+
			'<td class="hui_layout_center"></td>'+
			'</tr></table>'+
			'</td></tr></tbody>';
	return new hui.ui.Layout(options);
}

hui.ui.Layout.prototype = {
	
	addToLeft : function(widget) {
		var tbody = hui.get.firstByClass(this.element,'hui_layout_left');
		tbody.appendChild(widget.element);
	},
	
	addToCenter : function(widget) {
		var tbody = hui.get.firstByClass(this.element,'hui_layout_center');
		tbody.appendChild(widget.element);
	},
	
	/** @private */
	$$resize : function() {
		if (hui.browser.gecko) {
			var center = hui.get.firstByClass(this.element,'hui_layout_center');
			if (center) {
				center.style.height='100%';
			}
		}
		if (!window.navigator.userAgent.indexOf('AppleWebKit/536')) {
			if (!hui.browser.msie7 && !hui.browser.msie8 && !hui.browser.msie9) {
				return;
			}			
		}
		if (!hui.dom.isVisible(this.element)) {
			return;
		}
		if (this.diff===undefined) {
			var head = hui.get.firstByClass(this.element,'hui_layout_top');
			var top = hui.get.firstByTag(head,'*').clientHeight;
			var foot = hui.get.firstByTag(hui.get.firstByTag(this.element,'tfoot'),'td');
			var bottom = 0;
			if (foot) {
				bottom = hui.get.firstByTag(foot,'*').clientHeight;
			}
			top += hui.position.getTop(this.element);
			this.diff = bottom+top;
			if (this.element.parentNode!==document.body) {
				this.diff+=15;
			} else {
			}
		}
		var tbody = hui.get.firstByTag(this.element,'tbody');
		var cell = hui.get.firstByTag(tbody,'td');
		var height = (hui.window.getViewHeight()-this.diff+5);
		cell.style.height = height+'px';
	}
};

/* EOF *//**
 * A dock
 * @param {Object} The options
 * @constructor
 */
hui.ui.Dock = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.iframe = hui.get.firstByTag(this.element,'iframe');
	this.progress = hui.get.firstByClass(this.element,'hui_dock_progress');
	this.resizer = hui.get.firstByClass(this.element,'hui_dock_sidebar_line');
	hui.listen(this.iframe,'load',this._load.bind(this));
	//if (this.iframe.contentWindow) {
	//	this.iframe.contentWindow.addEventListener('DOMContentLoaded',function() {this._load();hui.log('Fast path!')}.bind(this));
	//}
	this.name = options.name;
	hui.ui.extend(this);
	this.diff = -69;
	if (this.options.tabs) {
		this.diff-=15;
	}
	this.busy = true;
	hui.ui.listen(this);
	this._addBehavior();
}

hui.ui.Dock.prototype = {
	_addBehavior : function() {
		if (this.resizer) {
			this.sidebar = hui.get.firstByClass(this.element,'hui_dock_sidebar');
			this.main = hui.get.firstByClass(this.element,'hui_dock_sidebar_main');
			hui.drag.register({
				element : this.resizer,
				onStart : function() {
					this.hasDragged = false;
					hui.cls.add(this.element,'hui_dock_sidebar_resizing');
					this._setBusy(true);
				}.bind(this),
				onMove : function(e) {
					var left = e.getLeft();
					if (left<10) {
						left=10;
					}
					this._updateSidebarWidth(left);
					if (!this.hasDragged) {
						hui.cls.remove(this.element,'hui_dock_sidebar_collapsed');
					}
					this.hasDragged = true;
				}.bind(this),
				onEnd : function() {
					this._setBusy(false);
					if (!this.hasDragged) {
						this.toggle();
					} else if (this.latestWidth==10) {
						this.collapse();
					} else {
						this.latestExpandedWidth = this.latestWidth;
					}
					hui.cls.remove(this.element,'hui_dock_sidebar_resizing');
					hui.ui.callVisible(this);
					hui.ui.reLayout();
				}.bind(this)
			})
		}
	},
	_updateSidebarWidth : function(width) {
		this.latestWidth = width;
		this.sidebar.style.width = (width-1)+'px';
		this.main.style.left = width+'px';
		this.resizer.style.left = (width-5)+'px';
	},
	/** Change the url of the iframe
	 * @param {String} url The url to change the iframe to
	 */
	setUrl : function(url) {
		this._setBusy(true);
		hui.frame.getDocument(this.iframe).location.href='about:blank';
		hui.frame.getDocument(this.iframe).location.href=url;
	},
	collapse : function() {
		hui.cls.add(this.element,'hui_dock_sidebar_collapsed');
		this._updateSidebarWidth(10);
		hui.ui.callVisible(this);
	},
	expand : function() {
		hui.cls.remove(this.element,'hui_dock_sidebar_collapsed');
		this._updateSidebarWidth(this.latestExpandedWidth || 200);
		hui.ui.callVisible(this);
	},
	toggle : function() {
		if (hui.cls.has(this.element,'hui_dock_sidebar_collapsed')) {
			this.expand();
		} else {
			this.collapse();
		}
	},
	_load : function() {
		this._setBusy(false);
	},
	_setBusy : function(busy) {
		if (busy) {
			hui.style.set(this.progress,{display:'block',height:this.iframe.clientHeight+'px',width:this.iframe.clientWidth+'px'});
		} else {
			this.progress.style.display = 'none';
		}
	},
	/** @private */
	$frameLoaded : function(win) {
		if (win==hui.frame.getWindow(this.iframe)) {
			this._setBusy(false);
		}
	},
	/** @private */
	$$resize : function() {
		var height = hui.window.getViewHeight();
		this.iframe.style.height=(height+this.diff)+'px';
		this.progress.style.width=(this.iframe.clientWidth)+'px';
		this.progress.style.height=(height+this.diff)+'px';
	}
}

/* EOF *//**
 * @constructor
 * @param {Object} options The options : {modal:false}
 */
hui.ui.Box = function(options) {
	this.options = hui.override({},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.body = hui.get.firstByClass(this.element,'hui_box_body');
	this.close = hui.get.firstByClass(this.element,'hui_box_close');
	this.visible = !this.options.absolute;
	if (this.close) {
		hui.listen(this.close,'click',function(e) {
			hui.stop(e);
			this.hide();
			this.fire('boxWasClosed');
		}.bind(this));
	}
	hui.ui.extend(this);
};

/**
 * Creates a new box widget
 * @param {Object} options The options : {width:0,padding:0,absolute:false,closable:false}
 */
hui.ui.Box.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{
		'class' : options.absolute ? 'hui_box hui_box_absolute' : 'hui_box',
		html : (options.closable ? '<a class="hui_box_close" href="#"></a>' : '')+
			'<div class="hui_box_top"><div><div></div></div></div>'+
			'<div class="hui_box_middle"><div class="hui_box_middle">'+
			(options.title ? '<div class="hui_box_header"><strong class="hui_box_title">'+hui.string.escape(options.title)+'</strong></div>' : '')+
			'<div class="hui_box_body" style="'+
			(options.padding ? 'padding: '+options.padding+'px;' : '')+
			(options.width ? 'width: '+options.width+'px;' : '')+
			'"></div>'+
			'</div></div>'+
			'<div class="hui_box_bottom"><div><div></div></div></div>',
		style : options.width ? options.width+'px' : null
	});
	return new hui.ui.Box(options);
};

hui.ui.Box.prototype = {
	/**
	 * Adds the box to the end of the body
	 */
	addToDocument : function() {
		document.body.appendChild(this.element);
	},
	/**
	 * Adds a child widget or node
	 */
	add : function(widget) {
		if (widget.getElement) {
			this.body.appendChild(widget.getElement());
		} else {
			this.body.appendChild(widget);
		}
	},
	/**
	 * Shows the box
	 */
	show : function() {
		var e = this.element;
		if (this.options.modal) {
			var index = hui.ui.nextPanelIndex();
			e.style.zIndex=index+1;
			hui.ui.showCurtain({widget:this,zIndex:index});
		}
		if (this.options.absolute) {
			hui.style.set(e,{display:'block',visibility:'hidden'});
			var w = e.clientWidth;
			var top = (hui.window.getViewHeight()-e.clientHeight)/2+hui.window.getScrollTop();
			hui.style.set(e,{'marginLeft':(w/-2)+'px',top:top+'px'});
			hui.style.set(e,{display:'block',visibility:'visible'});
		} else {
			e.style.display='block';
		}
		this.visible = true;
		hui.ui.callVisible(this);
	},
	/** @private */
	$$resize : function() {
		if (this.options.absolute && this.visible) {
			var e = this.element;
			var w = e.clientWidth;
			var top = (hui.window.getViewHeight()-e.clientHeight)/2+hui.window.getScrollTop();
			hui.style.set(e,{'marginLeft':(w/-2)+'px',top:top+'px'});
		}
	},
	/**
	 * Hides the box
	 */
	hide : function() {
		hui.ui.hideCurtain(this);
		this.element.style.display='none';
		this.visible = false;
		hui.ui.callVisible(this);
	},
	/** @private */
	curtainWasClicked : function() {
		this.fire('boxCurtainWasClicked');
	}
};/**
 * @constructor
 * A wizard with a number of steps
 */
hui.ui.Wizard = function(o) {
	/** @private */
	this.options = o || {};
	/** @private */
	this.element = hui.get(o.element);
	/** @private */
	this.name = o.name;
	/** @private */
	this.container = hui.get.firstByClass(this.element,'hui_wizard_steps');
	/** @private */
	this.steps = hui.get.byClass(this.element,'hui_wizard_step');
	/** @private */
	this.anchors = hui.get.byClass(this.element,'hui_wizard_selection');
	/** @private */
	this.selected = 0;
	hui.ui.extend(this);
	this._addBehavior();
}
	
hui.ui.Wizard.prototype = {
	_addBehavior : function() {
		var self = this;
		hui.each(this.anchors,function(node,i) {
			hui.listen(node,'mousedown',function(e) {
				hui.stop(e);
				self.goToStep(i)
			});
			hui.listen(node,'click',function(e) {
				hui.stop(e);
			});
		});
	},
	/** Get the currently selected step (0-based)*/
	getStep : function() {
		return this.selected;
	},
	/** Goes to the step with the index (0-based) */
	goToStep : function(index) {
		var c = this.container;
		c.style.height = c.clientHeight+'px';
		hui.cls.remove(this.anchors[this.selected],'hui_selected');
		this.steps[this.selected].style.display = 'none';
		hui.cls.add(this.anchors[index],'hui_selected');
		this.steps[index].style.display = 'block';
		this.selected = index;
		hui.animate(c,'height',this.steps[index].clientHeight+'px',500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			c.style.height='';
		}});
		hui.ui.callVisible(this);
		this.fire('stepChanged',this.selected);
	},
	isFirst : function() {
		return this.selected==0;
	},
	isLast : function() {
		return this.selected==this.steps.length-1;
	},
	/** Goes to the next step */
	next : function() {
		if (this.selected<this.steps.length-1) {
			this.goToStep(this.selected+1);
		}
	},
	/** Goes to the previous step */
	previous : function() {
		if (this.selected>0) {
			this.goToStep(this.selected-1);
		}
	}
}

/* EOF *//** @constructor */
hui.ui.Input = function(options) {
	this.options = hui.override({placeholderElement:null,validator:null},options);
	var e = this.element = hui.get(options.element);
	this.element.setAttribute('autocomplete','off');
	this.value = this._validate(this.element.value);
	this.isPassword = this.element.type=='password';
	this.name = options.name;
	hui.ui.extend(this);
	this._addBehavior();
	if (this.options.placeholderElement && this.value!='') {
		hui.style.set(this.options.placeholderElement,{opacity:0,display:'none'});
	}
	this._checkPlaceholder();
	try { // IE hack
		if (e==document.activeElement) {
			this._focused();
		}
	} catch (e) {}
}

hui.ui.Input.prototype = {
	_addBehavior : function() {
		var e = this.element,
			p = this.options.placeholderElement;
		hui.listen(e,'keyup',this.keyDidStrike.bind(this));
		hui.listen(e,'blur',this.onBlur.bind(this));
		if (p) {
			hui.listen(e,'focus',this._focused.bind(this));
			hui.listen(e,'blur',this._checkPlaceholder.bind(this));
			if (p) {
				p.style.cursor='text';
				hui.listen(p,'mousedown',this.focus.bind(this));
				hui.listen(p,'click',this.focus.bind(this));
			}
		}
		if (e.type=='submit') {
			hui.listen(e,'click',function(event) {
				this.fire('click',event);
			}.bind(this));
		}
	},
	_focused : function() {
		var e = this.element,p = this.options.placeholderElement;
		if (p && e.value=='') {
			hui.style.set(p,{opacity:0,display:'none'});
		}
	},
	/** @private */
	_validate : function(value) {
		var validator = this.options.validator;
		var result;
		if (validator) {
			result = validator.validate(value);
			hui.cls.set(this.element,'hui_invalid',!result.valid);
			return result.value;
		}
		return value;
	},
	_checkPlaceholder : function() {
		if (this.options.placeholderElement && this.value=='') {
			hui.effect.fadeIn({element:this.options.placeholderElement,duration:200});
		}
		if (this.isPassword && !hui.browser.msie) {
			this.element.type='password';
		}
	},
	/** @private */
	keyDidStrike : function() {
		if (this.value!==this.element.value) {
			var newValue = this._validate(this.element.value);
			var changed = newValue!==this.value;
			this.value = newValue;
			if (changed) {
				this.fire('valueChanged',this.value);
			}
		}
	},
	/** @private */
	onBlur : function() {
		hui.cls.remove(this.element,'hui_invalid');
		this.element.value = this.value || '';
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		if (value===undefined || value===null) {
			value='';
		}
		this.element.value = value;
		this.value = this._validate(value);
	},
	isEmpty : function() {
		return this.value=='';
	},
	isBlank : function() {
		return hui.isBlank(this.value);
	},
	focus : function() {
		this.element.focus();
	},
	setError : function(error) {
		var isError = error ? true : false;
		hui.cls.set(this.element,'hui_field_error',isError);
		if (typeof(error) == 'string') {
			hui.ui.showToolTip({text:error,element:this.element,key:this.name});
		}
		if (!isError) {
			hui.ui.hideToolTip({key:this.name});
		}
	}
};

/* EOF *//** @constructor */
hui.ui.InfoView = function(options) {
	this.options = hui.override({clickObjects:false},options);
	this.element = hui.get(options.element);
	this.body = hui.get.firstByTag(this.element,'tbody');
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.InfoView.create = function(options) {
	options = options || {};
	var element = options.element = hui.build('div',{'class':'hui_infoview',html:'<table><tbody></tbody></table>'});
	if (options.height) {
		hui.style.set(element,{height:options.height+'px','overflow':'auto','overflowX':'hidden'});
	}
	if (options.margin) {
		element.style.margin = options.margin+'px';
	}
	return new hui.ui.InfoView(options);
}

hui.ui.InfoView.prototype = {
	addHeader : function(text) {
		var row = hui.build('tr',{parent:this.body});
		hui.build('th',{'class' : 'hui_infoview_header',colspan:'2',text:text,parent:row});
	},
	addProperty : function(label,text) {
		var row = hui.build('tr',{parent:this.body});
		hui.build('th',{parent:row,text:label});
		hui.build('td',{parent:row,text:text});
	},
	addObjects : function(label,objects) {
		if (!objects || objects.length==0) return;
		var row = hui.build('tr',{parent:this.body});
		row.appendChild(hui.build('th',{text:label}));
		var cell = hui.build('td',{parent:row});
		var click = this.options.clickObjects;
		hui.each(objects,function(obj) {
			var node = hui.build('div',{text:obj.title,parent:cell});
			if (click) {
				hui.cls.add(node,'hui_infoview_click')
				hui.listen(node,'click',function() {
					hui.ui.callDelegates(this,'objectWasClicked',obj);
				});
			}
		});
	},
	setBusy : function(busy) {
		hui.cls.set(this,element,'hui_infoview_busy',busy);
	},
	clear : function() {
		hui.dom.clear(this.body);
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

/* EOF *//**
 * Overflow with scroll bars
 * @param {Object} The options
 * @constructor
 */
hui.ui.Overflow = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.Overflow.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('div',{'class':'hui_overflow'});
	if (options.height) {
		e.style.height=options.height+'px';
	}
	return new hui.ui.Overflow(options);
}

hui.ui.Overflow.prototype = {
	_calculate : function() {
		var viewport = hui.window.getViewHeight(),
			parent = this.element.parentNode,
			top = hui.position.getTop(this.element),
			bottom = hui.position.getTop(parent)+parent.clientHeight,
			sibs = hui.get.after(this.element);
		for (var i=0; i < sibs.length; i++) {
			if (hui.style.get(sibs[i],'position')!='absolute') {
				bottom-=sibs[i].clientHeight;
			}
		}
		this.diff = -1 * (top + (viewport - bottom));
		if (hui.browser.webkit && this.element.parentNode.className=='hui_layout_center') {
			this.diff++;
		}
	},
	show : function() {
		this.element.style.display='';
		hui.ui.callVisible(this);
	},
	hide : function() {
		this.element.style.display='none';
		hui.ui.callVisible(this);
	},
	add : function(widgetOrNode) {
		if (widgetOrNode.getElement) {
			this.element.appendChild(widgetOrNode.getElement());
		} else {
			this.element.appendChild(widgetOrNode);
		}
		return this;
	},
	/** @private */
	$$layout : function() {
		if (!this.options.dynamic) {return}
		/*
		var hasSiblings = false;
		var sibs = this.element.parentNode.childNodes;
		for (var i=0; i < sibs.length; i++) {
			if (sibs[i]!==this.element && hui.dom.isElement(sibs[i]) && sibs[i].nodeName!='script' && hui.style.get(sibs[i],'position')!='absolute') {
				hasSiblings = true;
				hui.log(sibs[i])
				break;
			}
		};
		if (!hasSiblings) {
			hui.log('Fast path!');
			this.$$resize();
			return;
		}*/
		this.element.style.height='0px';
		window.setTimeout(function() {
			this._calculate();
			this.$$resize();
		}.bind(this))
	},
	/** @private */
	$$resize : function() {
		var height;
		if (!this.options.dynamic) {
			if (this.options.vertical) {
				height = hui.window.getViewHeight();
				this.element.style.height = Math.max(0,height-this.options.vertical)+'px';
			}
			return;
		}
		if (this.diff===undefined) {
			this._calculate();
		}
		height = hui.window.getViewHeight();
		this.element.style.height = Math.max(0,height+this.diff)+'px';
	}
}

/* EOF *//** @constructor */
hui.ui.SearchField = function(options) {
	this.options = hui.override({expandedWidth:null},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	this.field = hui.get.firstByTag(this.element,'input');
	this.value = this.field.value;
	this.adaptive = hui.cls.has(this.element,'hui_searchfield_adaptive');
	hui.ui.onReady(function() {
		this.initialWidth = parseInt(hui.style.get(this.element,'width'))
	}.bind(this));
	hui.ui.extend(this);
	this.addBehavior();
	this.updateClass()
}

hui.ui.SearchField.create = function(options) {
	options = options || {};
	
	options.element = hui.build('span',{
		'class' : options.adaptive ? 'hui_searchfield hui_searchfield_adaptive' : 'hui_searchfield',
		html : '<em class="hui_searchfield_placeholder"></em><a href="javascript:void(0);" class="hui_searchfield_reset"></a><span><span><input type="text"/></span></span>'
	});
	return new hui.ui.SearchField(options);
}

hui.ui.SearchField.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		hui.listen(this.field,'keyup',this.onKeyUp.bind(this));
		var reset = hui.get.firstByTag(this.element,'a');
		reset.tabIndex=-1;
		if (!hui.browser.ipad) {
			var focus = function() {self.field.focus();self.field.select()};
			hui.listen(this.element,'mousedown',focus);
			hui.listen(this.element,'mouseup',focus);
			hui.listen(hui.get.firstByTag(this.element,'em'),'mousedown',focus);
		} else {
			var focus = function() {self.field.focus();};
			hui.listen(hui.get.firstByTag(this.element,'em'),'click',focus);
		}
		hui.listen(reset,'mousedown',function(e) {
			hui.stop(e);
			self.reset();
			focus()
		});
		hui.listen(this.field,'focus',function() {
			self.focused=true;
			self.updateClass();
		});
		hui.listen(this.field,'blur',function() {
			self.focused=false;
			self.updateClass();
		});
		if (this.options.expandedWidth>0) {
			this.field.onfocus = function() {
				hui.animate(self.element,'width',self.options.expandedWidth+'px',500,{ease:hui.ease.slowFastSlow});
			}
			this.field.onblur = function() {
				hui.animate(self.element,'width',self.initialWidth+'px',500,{ease:hui.ease.slowFastSlow,delay:100});
			}
		}
	},
	onKeyUp : function(e) {
		this.fieldChanged();
		if (e.keyCode===hui.KEY_RETURN) {
			this.fire('submit');
		}
	},
	setValue : function(value) {
		this.field.value=value===undefined || value===null ? '' : value;
		this.fieldChanged();
	},
	getValue : function() {
		return this.field.value;
	},
	isEmpty : function() {
		return this.field.value=='';
	},
	isBlank : function() {
		return hui.isBlank(this.field.value);
	},
	reset : function() {
		this.field.value='';
		this.fieldChanged();
	},
	/** @private */
	updateClass : function() {
		var className = 'hui_searchfield';
		if (this.adaptive) {
			className+=' hui_searchfield_adaptive';
		}
		if (this.focused && this.value!='') {
			className+=' hui_searchfield_focus_dirty';
		} else if (this.focused) {
			className+=' hui_searchfield_focus';
		} else if (this.value!='') {
			className+=' hui_searchfield_dirty';
		}
		this.element.className=className;
	},
	/** @private */
	fieldChanged : function() {
		if (this.field.value!=this.value) {
			this.value=this.field.value;
			this.updateClass();
			this.fire('valueChanged',this.value);
			hui.ui.firePropertyChange(this,'value',this.value);
		}
	}
}

/* EOF *//**
 * Simple container
 * @param {Object} The options
 * @constructor
 */
hui.ui.Fragment = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.Fragment.prototype = {
	show : function() {
		this.element.style.display='block';
		hui.ui.callVisible(this);
	},
	hide : function() {
		this.element.style.display='none';
		hui.ui.callVisible(this);
	}
}

/* EOF *//**
	Used to get a geografical location
	@constructor
*/
hui.ui.LocationPicker = function(options) {
	options = options || {};
	this.name = options.name;
	this.options = options.options || {};
	this.element = hui.get(options.element);
	this.backendLoaded = false;
	this.defered = [];
	hui.ui.extend(this);
}

hui.ui.LocationPicker.prototype = {
	show : function(options) {
		if (!this.panel) {
			var panel = this.panel = hui.ui.BoundPanel.create({width:302});
			var mapContainer = hui.build('div',{style:'width:300px;height:300px;border:1px solid #bbb;'});
			panel.add(mapContainer);
			var buttons = hui.ui.Buttons.create({align:'right',top:5});
			var button = hui.ui.Button.create({text:'Luk',small:true});
			button.listen({$click:function() {panel.hide()}});
			panel.add(buttons.add(button));
			hui.style.set(panel.element,{left:'-10000px',top:'-10000px',display:''});
			this._whenReady(function() {
		   	 	var mapOptions = {
			      zoom: 15,
			      mapTypeId: google.maps.MapTypeId.TERRAIN
			    }
				this.defaultCenter = new google.maps.LatLng(57.0465, 9.9185);
			    this.map = new google.maps.Map(mapContainer, mapOptions);
				google.maps.event.addListener(this.map, 'click', function(obj) {
					var loc = {latitude:obj.latLng.lat(),longitude:obj.latLng.lng()};
	    			this.setLocation(loc);
					this.fire('locationChanged',loc);
	  			}.bind(this));
				this.setLocation(options.location);
			}.bind(this))
		}
		if (options.node) {
			this.panel.position(options.node);
		}
		this.panel.show();
	},
	_whenReady : function(func) {
		if (this.backendLoaded) {
			func();
			return;
		}
		this.defered.push(func);
		if (this.loadingBackend) {return};
		this.loadingBackend = true;
		window.huiLocationPickerReady = function() {
			this.loadingBackend = false;
			this.backendLoaded = true;
			hui.log('Google maps loaded!')
			for (var i=0; i < this.defered.length; i++) {
				this.defered[i]();
			};
			window.huiLocationPickerReady = null;
		}.bind(this);
		hui.log('Loading google maps...')
		hui.require('http://maps.google.com/maps/api/js?sensor=false&callback=huiLocationPickerReady');
	},
	setLocation : function(loc) {
		this._whenReady(function() {
			hui.log('Setting location...')
			if (!loc && this.marker) {
				this.marker.setMap(null);
				this.map.setCenter(this.defaultCenter);
				return;
			}
			loc = this._buildLatLng(loc);
			if (!this.marker) {
			    this.marker = new google.maps.Marker({
			        position: loc, 
			        map: this.map
			    });
			} else {
	    		this.marker.setPosition(loc);
				this.marker.setMap(this.map);
			}
			this.map.setCenter(loc);
		}.bind(this))
	},
	_buildLatLng : function(loc) {
		if (!loc) {
			loc = {latitude:57.0465, longitude:9.9185};
		}
		return new google.maps.LatLng(loc.latitude, loc.longitude);
	}
}

/* EOF *//**
 * A bar
 * <pre><strong>options:</strong> {
 *  element : «Element»,
 *  name : «String»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Bar = function(options) {
	this.options = hui.override({},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.visible = this.element.style.display=='none' ? false : null;
	this.body = hui.get.firstByClass(this.element,'hui_bar_body');
	hui.ui.extend(this);
};


/**
 * Creates a new bar
 * <pre><strong>options:</strong> {
 *  variant : «null | 'window' | 'mini' | 'layout' | 'layout_mini' | 'window_mini'»,
 *  absolute : «true | <strong>false</strong>»,
 *
 *  name : «String»
 * }
 * </pre>
 * @static
 * @param {Object} options The options
 */
hui.ui.Bar.create = function(options) {
	options = options || {};
	var cls = 'hui_bar';
	if (options.variant) {
		cls+=' hui_bar_'+options.variant;
	}
	if (options.absolute) {
		cls+=' hui_bar_absolute';
	}
	options.element = hui.build('div',{
		'class' : cls
	});
	hui.build('div',{'class':'hui_bar_body',parent:options.element});
	return new hui.ui.Bar(options);
}

hui.ui.Bar.prototype = {
	/** Add the bar to the page */
	addToDocument : function() {
		document.body.appendChild(this.element);
	},
	/**
	 * Add a widget to the bar
	 * @param {Widget} widget The widget to add
	 */
	add : function(widget) {
		this.body.appendChild(widget.getElement());
	},
	/** Add a divider to the bar */
	addDivider : function() {
		hui.build('span',{'class':'hui_bar_divider',parent:this.body})
	},
	placeAbove : function(widgetOrElement) {
		if (widgetOrElement.getElement) {
			widgetOrElement = widgetOrElement.getElement();
		}
		hui.position.place({
			source:{element:this.element,vertical:1,horizontal:0},
			target:{element:widgetOrElement,vertical:0,horizontal:0}
		});
		this.element.style.zIndex = hui.ui.nextTopIndex();
	},
	/** Change the visibility of the bar
	 * @param {Boolean} visible If the bar should be visible
	 */
	setVisible : function(visible) {
		if (this.visible===visible) {return}
		if (visible) {
			this.show();
		} else {
			this.hide();
		}
	},
	/** Show the bar */
	show : function() {
		if (this.options.absolute) {
			this.element.style.visibility='visible';
		} else {
			this.element.style.display='';
			hui.ui.reLayout();
		}
		this.visible = true;
	},
	/** Hide the bar */
	hide : function() {
		if (this.options.absolute) {
			this.element.style.visibility='hidden';
		} else {
			this.element.style.display='none';
			hui.ui.reLayout();
		}
		this.visible = false;
	}
}

/**
 * A bar button
 * <pre><strong>options:</strong> {
 *  element : «Element»,
 *  name : «String»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Bar.Button = function(options) {
	this.options = hui.override({},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	hui.listen(this.element,'click',this._click.bind(this));
	hui.listen(this.element,'mousedown',this._mousedown.bind(this));
	hui.listen(this.element,'mouseup',hui.stop);
	hui.ui.extend(this);
};



/**
 * Creates a new bar button
 * <pre><strong>options:</strong> {
 *  icon : «String»,
 *
 *  name : «String»
 * }
 * </pre>
 * @static
 * @param {Object} options The options
 */
hui.ui.Bar.Button.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('a',{'class':'hui_bar_button'});
	if (options.icon) {
		e.appendChild(hui.ui.createIcon(options.icon,16));
	}
	return new hui.ui.Bar.Button(options);
}

hui.ui.Bar.Button.prototype = {
	_mousedown : function(e) {
		this.fire('mousedown');
		if (this.options.stopEvents) {
			hui.stop(e);
		}
	},
	_click : function(e) {
		this.fire('click');
		if (this.options.stopEvents) {
			hui.stop(e);
		}
	},
	/** Mark the button as selected
	 * @param {Boolean} selected If it should be marked selected
	 */
	setSelected : function(selected) {
		hui.cls.set(this.element,'hui_bar_button_selected',selected);
	}
}

/**
 * A bar text
 * <pre><strong>options:</strong> {
 *  element : «Element»,
 *  name : «String»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Bar.Text = function(options) {
	this.options = hui.override({},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
};

hui.ui.Bar.Text.prototype = {
	/** Change the text
	 * @param {String} str The text
	 */
	setText : function(str) {
		hui.dom.setText(this.element,str);
	}
}/**
 * A dock
 * @param {Object} The options
 * @constructor
 */
hui.ui.IFrame = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.IFrame.prototype = {
	/** Change the url of the iframe
	 * @param {String} url The url to change the iframe to
	 */
	setUrl : function(url) {
		this.element.setAttribute('src',url);
		//hui.frame.getDocument(this.element).location.href=url;
	},
	clear : function() {
		this.setUrl('about:blank');
	},
	getDocument : function() {
		return hui.frame.getDocument(this.element);
	},
	getWindow : function() {
		return hui.frame.getWindow(this.element);
	},
	reload : function() {
		this.getWindow().location.reload();
	},
	show : function() {
		this.element.style.display='';
	},
	hide : function() {
		this.element.style.display='none';
	}
}

/* EOF *//** A video player
 * @constructor
 */
hui.ui.VideoPlayer = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.placeholder = hui.get.firstByTag(this.element,'div');
	this.name = options.name;
	this.state = {duration:0,time:0,loaded:0};
	this.handlers = [hui.ui.VideoPlayer.HTML5,hui.ui.VideoPlayer.QuickTime,hui.ui.VideoPlayer.Embedded];
	this.handler = null;
	hui.ui.extend(this);
	if (this.options.video) {
		if (this.placeholder) {
			hui.listen(this.placeholder,'click',function() {
				this.setVideo(this.options.video);
			}.bind(this))
		} else {
			hui.ui.onReady(function() {
				this.setVideo(this.options.video);
			}.bind(this));			
		}
	}
}

hui.ui.VideoPlayer.prototype = {
	setVideo : function(video) {
		if (this.placeholder) {
			this.placeholder.style.display='none';
		}
		this.handler = this.getHandler(video);
		this.element.appendChild(this.handler.element);
		if (this.handler.showController()) {
			this.buildController();
		}
	},
	getHandler : function(video) {
		for (var i=0; i < this.handlers.length; i++) {
			var handler = this.handlers[i];
			if (handler.isSupported(video)) {
				return new handler(video,this);
			}
		};
	},
	buildController : function() {
		var e = hui.build('div',{'class':'hui_videoplayer_controller',parent:this.element});
		this.playButton = hui.build('a',{href:'javascript:void(0);','class':'hui_videoplayer_playpause',text:'wait!',parent:e});
		hui.listen(this.playButton,'click',this.playPause.bind(this));
		this.status = hui.build('span',{'class':'hui_videoplayer_status',parent:e});
	},
	onCanPlay : function() {
		this.playButton.update('Play');
	},
	onLoad : function() {
		this.state.loaded = this.state.duration;
		this.updateStatus();
	},
	onDurationChange : function(duration) {
		this.state.duration = duration;
		this.updateStatus();
	},
	onTimeChange : function(time) {
		this.state.time = time;
		this.updateStatus();
	},
	onLoadProgressChange : function(progress) {
		this.state.loaded = progress;
		this.updateStatus();
	},
	playPause : function() {
		if (this.handler.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	},
	play : function() {
		this.handler.play();
	},
	pause : function() {
		this.handler.pause();
	},
	updateStatus : function() {
		this.status.innerHTML = this.state.time+' / '+this.state.duration+' / '+this.state.loaded;
	}
}

///////// HTML5 //////////

hui.ui.VideoPlayer.HTML5 = function(video,player) {
	var e = this.element = hui.build('video',{width:video.width,height:video.height,src:video.src});
	hui.listen(e,'load',player.onLoad.bind(player));
	hui.listen(e,'canplay',player.onCanPlay.bind(player));
	hui.listen(e,'durationchange',function(x) {
		player.onDurationChange(e.duration);
	});
	hui.listen(e,'timeupdate',function() {
		player.onTimeChange(this.element.currentTime);
	}.bind(this));
}

hui.ui.VideoPlayer.HTML5.isSupported = function(video) {
	if (hui.browser.webkitVersion>528 && (video.type==='video/quicktime' || video.type==='video/mp4')) {
		return true;
	}
	return false;
}

hui.ui.VideoPlayer.HTML5.prototype = {
	showController : function() {
		return true;
	},
	pause : function() {
		this.element.pause();
	},
	play : function() {
		this.element.play();
	},
	getTime : function() {
		return this.element.currentTime;
	},
	isPlaying : function() {
		return !this.element.paused;
	}
}

///////// QuickTime //////////

hui.ui.VideoPlayer.QuickTime = function(video,player) {
	this.player = player;
	var e = this.element = hui.build('object',{width:video.width,height:video.height,data:video.src,type:'video/quicktime'});
	e.innerHTML = '<param value="false" name="controller"/>'
		+'<param value="true" name="enablejavascript"/>'
		+'<param value="undefined" name="posterframe"/>'
		+'<param value="false" name="showlogo"/>'
		+'<param value="false" name="autostart"/>'
		+'<param value="true" name="cache"/>'
		+'<param value="white" name="bgcolor"/>'
		+'<param value="false" name="aggressivecleanup"/>'
		+'<param value="true" name="saveembedtags"/>'
		+'<param value="true" name="postdomevents"/>';
		
	hui.listen(e,'qt_canplay',player.onCanPlay.bind(player));
	hui.listen(e,'qt_load',player.onLoad.bind(player));
	hui.listen(e,'qt_progress',function() {
		player.onLoadProgressChange(e.GetMaxTimeLoaded()/3000);
	});
	hui.listen(e,'qt_durationchange',function(x) {
		player.onDurationChange(e.GetDuration()/3000);
	});
	hui.listen(e,'qt_timechanged',function() {
		player.onTimeChange(e.GetTime());
	})
}

hui.ui.VideoPlayer.QuickTime.isSupported = function(video) {
	return video.html==undefined;
}

hui.ui.VideoPlayer.QuickTime.prototype = {
	showController : function() {
		return true;
	},
	pause : function() {
		window.clearInterval(this.observer);
		this.element.Stop();
	},
	play : function() {
		this.element.Play();
		this.observer = window.setInterval(this.observeVideo.bind(this),100);
	},
	observeVideo : function() {
		this.player.onTimeChange(this.element.GetTime()/3000);
	},
	getTime : function() {
		return this.element.GetTime();
	},
	isPlaying : function() {
		return this.element.GetRate()!==0;
	}
}

///////// Embedded //////////

hui.ui.VideoPlayer.Embedded = function(video,player) {
	this.element = hui.build('div',{width:video.width,height:video.height,html:video.html});
}

hui.ui.VideoPlayer.Embedded.isSupported = function(video) {
	return video.html!==undefined;
}

hui.ui.VideoPlayer.Embedded.prototype = {
	showController : function() {
		return false;
	},
	pause : function() {
		
	},
	play : function() {
		
	},
	getTime : function() {
		
	},
	isPlaying : function() {
		
	}
}

/* EOF *//**
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Segmented = function(options) {
	this.options = hui.override({value:null,allowNull:false},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	this.value = this.options.value;
	hui.ui.extend(this);
	hui.listen(this.element,'mousedown',this.onClick.bind(this));
}

hui.ui.Segmented.prototype = {
	/** @private */
	onClick : function(e) {
		e = new hui.Event(e);
		var a = e.findByTag('a');
		if (a) {
			var changed = false;
			var value = a.getAttribute('rel');
			var x = hui.get.byClass(this.element,'hui_segmented_selected');
			for (var i=0; i < x.length; i++) {
				hui.cls.remove(x[i],'hui_segmented_selected');
			};
			if (value===this.value && this.options.allowNull) {
				changed=true;
				this.value = null;
			} else {
				hui.cls.add(a,'hui_segmented_selected');
				changed=this.value!== value;
				this.value = value;
			}
			if (changed) {
				this.fire('valueChanged',this.value);
				hui.ui.firePropertyChange(this,'value',this.value);
			}
		}
	},
	setValue : function(value) {
		if (value===undefined) {
			value=null;
		}
		var as = this.element.getElementsByTagName('a');
		this.value = null;
		for (var i=0; i < as.length; i++) {
			if (as[i].getAttribute('rel')===value) {
				hui.cls.add(as[i],'hui_segmented_selected');
				this.value=value;
			} else {
				hui.cls.remove(as[i],'hui_segmented_selected');
			}
		};
	},
	getValue : function() {
		return this.value;
	}
}

/* EOF *//** @namespace */
hui.ui.Flash = {
	
	fullVersion:undefined,
	
	/** Gets the major version of flash */
	getMajorVersion : function() {
		var full = this.getFullVersion();
		if (full===null || full===undefined) {
			return null;
		}
		var matched = (full+'').match(/[0-9]+/gi);
		return matched.length>0 ? parseInt(matched[0]) : null;
	},
	
	getFullVersion : function() {
		if (this.fullVersion!==undefined) {
			return this.fullVersion;
		}
		// NS/Opera version >= 3 check for Flash plugin in plugin array
		var flashVer = null;
	
		if (navigator.plugins != null && navigator.plugins.length > 0) {
			if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
				var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
				var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
				var descArray = flashDescription.split(" ");
				var tempArrayMajor = descArray[2].split(".");			
				var versionMajor = tempArrayMajor[0];
				var versionMinor = tempArrayMajor[1];
				var versionRevision = descArray[3];
				if (versionRevision == "") {
					versionRevision = descArray[4];
				}
				if (versionRevision[0] == "d") {
					versionRevision = versionRevision.substring(1);
				} else if (versionRevision[0] == "r") {
					versionRevision = versionRevision.substring(1);
					if (versionRevision.indexOf("d") > 0) {
						versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
					}
				}
				flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
			}
		}
		// MSN/WebTV 2.6 supports Flash 4
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
		// WebTV 2.5 supports Flash 3
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
		// older WebTV supports Flash 2
		else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
		else if ( hui.browser.msie ) {
			flashVer = this.getActiveXVersion();
		}
		this.fullVersion = flashVer;
		return flashVer;
	},
	/** @private */
	getActiveXVersion : function() {
		var version;
		var axo;
		var e;

		// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

		try {
			// version will be set for 7.X or greater players
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			version = axo.GetVariable("$version");
		} catch (e) {
		}

		if (!version)
		{
			try {
				// version will be set for 6.X players only
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
				// installed player is some revision of 6.0
				// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
				// so we have to be careful. 
			
				// default to the first public version
				version = "WIN 6,0,21,0";

				// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
				axo.AllowScriptAccess = "always";

				// safe to call for 6.0r47 or greater
				version = axo.GetVariable("$version");

			} catch (e) {
			}
		}

		if (!version)
		{
			try {
				// version will be set for 4.X or 5.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
				version = axo.GetVariable("$version");
			} catch (e) {
			}
		}

		if (!version)
		{
			try {
				// version will be set for 3.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
				version = "WIN 3,0,18,0";
			} catch (e) {
			}
		}

		if (!version)
		{
			try {
				// version will be set for 2.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				version = "WIN 2,0,0,11";
			} catch (e) {
				version = -1;
			}
		}
	
		return version;
	}
}

/* EOF *//**
 * @constructor
 * A link
 */
hui.ui.Link = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.Link.prototype = {
	/** @private */
	addBehavior : function() {
		var self = this;
		hui.listen(this.element,'click',function(e) {
			hui.stop(e);
			window.setTimeout(function() {
				self.fire('click');
			});
		});
	}
}

/* EOF *//**
 * Simple container
 * @param {Object} The options
 * @constructor
 */
hui.ui.Links = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this.items = [];
	this.addBehavior();
	this.selectedIndex = null;
	this.inputs = {};
}

hui.ui.Links.prototype = {
	addBehavior : function() {
		hui.listen(this.element,'click',this.onClick.bind(this));
		hui.listen(this.element,'dblclick',this.onDblClick.bind(this));
	},
	reset : function() {
		this.setValue([]);
	},
	setValue : function(items) {
		this.items = items;
		this.selectedIndex = null;
		this.build();
	},
	getValue : function() {
		return this.items;
	},
	onDblClick : function(e) {
		e = new hui.Event(e);
		hui.selection.clear();
		e.stop(e);
		var link = this.selectAndGetRow(e);
		var values = {text:link.text};
		values[link.kind]=link.value;
		this.editedLink = link;
		var win = this.getEditWindow();
		this.editForm.reset();
		this.editForm.setValues(values);
		win.show();
	},
	onClick : function(e) {
		e = new hui.Event(e);
		e.stop();
		var element = e.getElement();
		if (hui.cls.has(element,'hui_links_remove')) {
			var row = e.findByClass('hui_links_row');
			hui.ui.confirmOverlay({element:element,text:'Vil du fjerne linket?',okText:'Ja, fjern',cancelText:'Annuller',onOk:function() {
				this.items.splice(row.hui_index,1);
				if (this.selectedIndex===row.hui_index) {
					this.selectedIndex=null;
				}
				this.build();				
			}.bind(this)});
		} else {
			this.selectAndGetRow(e);
		}
	},
	selectAndGetRow : function(event) {
		var row = event.findByClass('hui_links_row');
		if (row) {
			var idx = row.hui_index;
			if (this.selectedIndex!==null) {
				var x = hui.get.byClass(this.element,'hui_links_row')[this.selectedIndex];
				hui.cls.remove(x,'hui_links_row_selected')
			}
			this.selectedIndex = idx;
			hui.cls.add(row,'hui_links_row_selected');
			return this.items[idx];
		}
	},
	build : function() {
		var list = this.list || hui.get.firstByClass(this.element,'hui_links_list'),
			i,item,row,infoNode,text,remove;
		list.innerHTML='';
		for (i=0; i < this.items.length; i++) {
			item = this.items[i];
			row = hui.build('div',{'class':'hui_links_row'});
			row.hui_index = i;
			
			row.appendChild(hui.ui.createIcon(item.icon,16));
			text = hui.build('div',{'class':'hui_links_text',text:item.text});
			row.appendChild(text);

			infoNode = hui.build('div',{'class':'hui_links_info',text:hui.string.wrap(item.info)});
			row.appendChild(infoNode);
			remove = hui.ui.createIcon('monochrome/delete',16);
			hui.cls.add(remove,'hui_links_remove');
			row.appendChild(remove);

			list.appendChild(row);
		};
	},
	addLink : function() {
		this.editedLink = null;
		this.getEditWindow().show();
		this.editForm.reset();
		this.editForm.focus();
	},
	getEditWindow : function() {
		if (!this.editWindow) {
			var win = this.editWindow = hui.ui.Window.create({title:'Link',width:300,padding:5});
			var form = this.editForm = hui.ui.Formula.create();
			var g = form.buildGroup({above:false},[
				{type:'TextField',options:{label:'Tekst',key:'text'}}
			]);
			
			var url = hui.ui.TextField.create({label:'URL',key:'url'});
			g.add(url);
			this.inputs['url']=url;
			
			var email = hui.ui.TextField.create({label:'E-mail',key:'email'});
			g.add(email);
			this.inputs['email']=email;
			
			page = hui.ui.DropDown.create({label:'Side',key:'page',source:this.options.pageSource});
			g.add(page);
			this.inputs['page']=page;
			
			file = hui.ui.DropDown.create({label:'Fil',key:'file',source:this.options.fileSource});
			g.add(file);
			this.inputs['file']=file;
			
			var self = this;
			hui.each(this.inputs,function(key,value) {
				value.listen({$valueChanged:function(){self.changeType(key)}});
			});
			
			g.createButtons().add(hui.ui.Button.create({text:'Gem',submit:true,highlighted:true}));
			this.editForm.listen({$submit:this.saveLink.bind(this)});
			win.add(form);
			if (this.options.pageSource) {
				this.options.pageSource.refresh();
			}
			if (this.options.fileSource) {
				this.options.fileSource.refresh();
			}
		}
		return this.editWindow;
	},
	saveLink : function() {
		var v = this.editForm.getValues();
		var link = this.valuesToLink(v);
		var edited = this.editedLink;
		if (edited) {
			hui.override(edited,link);
		} else {
			this.items.push(link);
		}
		this.build();
		this.editForm.reset();
		this.editWindow.hide();
		this.editedLink = null;
	},
	valuesToLink : function(values) {
		var link = {};
		link.text = values.text;
		if (values.email!='') {
			link.kind='email';
			link.value=values.email;
			link.info=values.email;
			link.icon='monochrome/email';
		} else if (values.url!='') {
			link.kind='url';
			link.value=values.url;
			link.info=values.url;
			link.icon='monochrome/globe';
		} else if (hui.isDefined(values.page)) {
			link.kind='page';
			link.value=values.page;
			link.info=this.inputs['page'].getItem().title;
			link.icon='common/page';
		} else if (hui.isDefined(values.file)) {
			link.kind='file';
			link.value=values.file;
			link.info=this.inputs['file'].getItem().title;
			link.icon='monochrome/file';
		}
		return link;
	},
	changeType : function(type) {
		hui.each(this.inputs,function(key,value) {
			if (key!=type) {
				value.setValue();
			}
		});
	}
}

/* EOF *//**
 * @constructor
 * @param options The options { debug : «boolean», value : '«html»', autoHideToolbar : «boolean», style : '«css»', replace : «node-or-id»}
 */
hui.ui.MarkupEditor = function(options) {
	this.name = options.name;
	this.options = hui.override({debug:false,value:'',autoHideToolbar:true,style:'font-family: sans-serif; font-size: 11px;'},options);
	if (this.options.replace) {
		this.options.replace = hui.get(options.replace);
		this.options.element = hui.build('div',{className:'hui_markupeditor '+this.options.replace.className});
		this.options.replace.parentNode.insertBefore(this.options.element,this.options.replace);
		this.options.replace.style.display='none';
		this.options.value = this.options.replace.innerHTML;
	}
	this.ready = false;
	this.pending = [];
	this.element = hui.get(this.options.element);
	if (hui.browser.msie) {
		this.impl = hui.ui.MarkupEditor.MSIE;
	} else {
		this.impl = hui.ui.MarkupEditor.webkit;
	}
	this.impl.initialize({element:this.element,controller:this});
	if (this.options.value) {
		this.setValue(this.options.value);
	}
	hui.ui.extend(this);
}

hui.ui.MarkupEditor.create = function(options) {
	options = options || {};
	options.element = hui.build('div',{className:'hui_markupeditor'});
	return new hui.ui.MarkupEditor(options);
}

hui.ui.MarkupEditor.prototype = {
	/** @private */
	implIsReady : function() {
		this.ready = true;
		for (var i=0; i < this.pending.length; i++) {
			this.pending[i]();
		};
	},
	/** @private */
	implFocused : function() {
		this._showBar();
	},
	/** @private */
	implBlurred : function() {
		this.bar.hide();
		this.fire('blur');
	},
	/** @private */
	implValueChanged : function() {
		this._valueChanged();
	},
	/** Remove the widget from the DOM */
	destroy : function() {
		hui.dom.remove(this.element);
		hui.ui.destroy(this);
	},
	/** Get the HTML value */
	getValue : function() {
		return this.impl.getHTML();
	},
	/** Set the HTML value */
	setValue : function(value) {
		this._whenReady(function() {
			this.impl.setHTML(value);
		}.bind(this));
	},
	/** Focus the editor */
	focus : function() {
		this._whenReady(this.impl.focus.bind(this.impl));
	},

	_whenReady : function(func) {
		if (this.ready) {
			func();
		} else {
			this.pending.push(func);
		}
	},
	_showBar : function() {
		if (!this.bar) {
			var things = [
				{key:'bold',icon:'edit/text_bold'},
				{key:'italic',icon:'edit/text_italic'},
				{divider:true},
				{key:'color',icon:'common/color'},
				/*{key:'image',icon:'common/image'},*/
				{key:'addLink',icon:'monochrome/link'},
				{divider:true},
				{key:'align',value:'left',icon:'edit/text_align_left'},
				{key:'align',value:'center',icon:'edit/text_align_center'},
				{key:'align',value:'right',icon:'edit/text_align_right'},
				{key:'align',value:'justify',icon:'edit/text_align_justify'},
				{divider:true},
				{key:'clear',icon:'edit/clear'}/*,
				{key:'strong',icon:'edit/text_bold'}*/
				
				
				/*,
				{key:'insert-table',icon:'edit/text_italic'}*/
			]
			
			this.bar = hui.ui.Bar.create({absolute:true,variant:'mini',small:true});
			hui.each(things,function(info) {
				if (info.divider) {
					this.bar.addDivider();
					return
				}
				var button = new hui.ui.Bar.Button.create({icon:info.icon,stopEvents:true});
				button.listen({
					$mousedown : function() { this._buttonClicked(info) }.bind(this)
				});
				this.bar.add(button);
			}.bind(this));
			this.bar.addToDocument();
		}
		hui.log('Showing bar');
		this.bar.placeAbove(this);
		this.bar.show();
	},
	_buttonClicked : function(info) {
		this.impl.saveSelection();
		if (info.key=='color') {
			this._showColorPicker();
		} else if (info.key=='addLink') {
			this._showLinkEditor();
		} else if (info.key=='align') {
			this.impl.align(info.value);
		} else if (info.key=='clear') {
			this.impl.removeFormat();
		} else {
			this.impl.format(info);
		}
		this._valueChanged();
		this.impl.restoreSelection();
	},
	_showColorPicker : function() {
		if (!this.colorPicker) {
			this.colorPicker = hui.ui.Window.create();
			var picker = hui.ui.ColorPicker.create();
			picker.listen(this);
			this.colorPicker.add(picker);
			this.colorPicker.listen({
				$userClosedWindow : function() {
						this.impl.restoreSelection();
				}.bind(this)
			})
		}
		this.colorPicker.show({avoid:this.element});
	},
	_highlightNode : function(node) {
		if (this._highlightedNode) {
			hui.cls.remove(this._highlightedNode,'hui_markupeditor_highlighted');
		}
		this._highlightedNode = node;
		if (node) {
			hui.cls.add(node,'hui_markupeditor_highlighted');
		}
	},
	_showLinkEditor : function() {
		this.temporaryLink = this.impl.getOrCreateLink();
		this._highlightNode(this.temporaryLink);
		if (this.options.linkDelegate ) {
			var delegate = this.options.linkDelegate;
			delegate.editLink({
				node:this.temporaryLink,
				onSuccess : function() {
					this._highlightNode(null)
					this.temporaryLink = null;
					hui.log('success');
					this._valueChanged();
				}.bind(this),
				onCancel : function() {
					this._highlightNode(null)
					hui.log('cancelled');
					this.temporaryLink = null;
					this._valueChanged();
				}.bind(this)
			});
		} else if (!this.linkEditor) {
			this.linkEditor = hui.ui.Window.create({padding:5,width:300});
			this.linkForm = hui.ui.Formula.create();
			this.linkEditor.add(this.linkForm);
			var group = this.linkForm.buildGroup({},[
				{type : 'TextField', options:{key:'url',label:'Address:'}}
			]);
			var buttons = group.createButtons();
			var ok = hui.ui.Button.create({text:'OK',submit:true});
			this.linkForm.listen({$submit:this._updateLink.bind(this)});
			buttons.add(ok);
		}
		if (this.linkEditor) {
			this.linkForm.setValues({url:this.temporaryLink.href});
			this.linkEditor.show({avoid:this.element});
			this.linkForm.focus();
		}
	},
	_updateLink : function() {
		var values = this.linkForm.getValues();
		this.temporaryLink.href = values.url;
		this.linkForm.reset();
		this.temporaryLink = null;
		this.linkEditor.hide();
		this._valueChanged();
	},
	_valueChanged : function() {
		this.fire('valueChanged',this.impl.getHTML());		
	},
	
	/** @private */
	$colorWasSelected : function(color) {
		this.impl.restoreSelection(function() {
			this.impl.colorize(color);
			this._valueChanged();
		}.bind(this));
	}
}

/** @namespace */
hui.ui.MarkupEditor.webkit = {
	initialize : function(options) {
		this.element = options.element;
		this.element.style.overflow='auto';
		this.element.contentEditable = true;
		var ctrl = this.controller = options.controller;
		hui.listen(this.element,'focus',function() {
			hui.log('Webkit focus');
			ctrl.implFocused();
		});
		hui.listen(this.element,'blur',function() {
			ctrl.implBlurred();
		});
		hui.listen(this.element,'keyup',this._keyUp.bind(this));
		ctrl.implIsReady();
	},
	saveSelection : function() {
		
	},
	restoreSelection : function(callback) {
		if (callback) {callback()}
	},
	focus : function() {
		this.element.focus();
	},
	format : function(info) {
		if (info.key=='strong' || info.key=='em') {
			this._wrapInTag(info.key);
		} else if (info.key=='insert-table') {
			this._insertHTML('<table><tbody><tr><td>Lorem ipsum dolor</td><td>Lorem ipsum dolor</td></tr></tbody></table>');
		} else {
			document.execCommand(info.key,null,info.value);
		}
	},
	getOrCreateLink : function() {
		var node = this._getSelectedNode();
		if (node && node.tagName.toLowerCase()=='a') {
			return node;
		}
		document.execCommand('createLink',null,'#');
		return this._getSelectedNode();
	},
	_getSelectedNode : function() {
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		var ancestor = range.commonAncestorContainer;
		if (!hui.dom.isElement(ancestor)) {
			ancestor = ancestor.parentNode;
		}
		return ancestor;
	},
	colorize : function(color) {
		document.execCommand('forecolor',null,color);
	},
	align : function(value) {
		var x = {center:'justifycenter',justify:'justifyfull',left:'justifyleft',right:'justifyright'};
		document.execCommand(x[value],null,null);
	},
	_keyUp : function() {
		this.controller.implValueChanged();
		this._selectionChanged();
	},
	_wrapInTag : function(tag) {
		var selection = window.getSelection();
		if (selection.rangeCount<1) {return}
		var range = selection.getRangeAt(0);
		var ancestor = range.commonAncestorContainer;
		if (!hui.dom.isElement(ancestor)) {
			ancestor = ancestor.parentNode;
		}
		if (ancestor.tagName.toLowerCase()==tag) {
			this._unWrap(ancestor);
		} else {
			var node = document.createElement(tag);
			range.surroundContents(node);
			selection.selectAllChildren(node);
		}
		//document.execCommand('inserthtml',null,'<'+tag+'>'+hui.string.escape(hui.selection.getText())+'</'+tag+'>');
	},
	_getInlineTag : function() {
		var selection = window.getSelection();
		if (selection.rangeCount<1) {return}
		
	},
	_unWrap : function(node) {
		var c = node.childNodes;
		for (var i=0; i < c.length; i++) {
			node.parentNode.insertBefore(c[i],node);
		};
		node.parentNode.removeChild(node);
	},
	_insertHTML : function(html) {
		document.execCommand('inserthtml',null,html);
	},
	_selectionChanged : function() {
		hui.log({
			bold : document.queryCommandState('bold'),
			italic : document.queryCommandState('italic')
		});
	},
	removeFormat : function() {
		document.execCommand('removeFormat',null,null);
	},
	setHTML : function(html) {
			hui.log('Setting html');
		this.element.innerHTML = html;
	},
	getHTML : function() {
		var cleaned = hui.ui.MarkupEditor.util.clean(this.element);
		return cleaned.innerHTML;
	}
}

/** @namespace */
hui.ui.MarkupEditor.MSIE = {
	initialize : function(options) {
		this.element = options.element;
		this.iframe = hui.build('iframe',{style:'display:block; width: 100%; border: 0;',parent:this.element})
		hui.listen(this.iframe,'load',this._load.bind(this));
		this.controller = options.controller;
	},
	saveSelection : function() {
		this.savedRange = this.document.selection.createRange();
		//this.savedSelection = this.document.selection.createRange().getBookmark();
	},
	restoreSelection : function(callback) {
		window.setTimeout(function() {
			this.body.focus();
			this.savedRange.select();
			if (callback) {callback()};
		}.bind(this));
	},
	_load : function() {
		this.document = hui.frame.getDocument(this.iframe);
		this.body = this.document.body;
		this.body.contentEditable = true;
		hui.listen(this.body,'keyup',this._keyUp.bind(this));
		hui.listen(this.body,'mouseup',this._mouseUp.bind(this));
		this.controller.implIsReady();
	},
	_keyUp : function() {
		this.controller.implValueChanged();	
		this.saveSelection();	
	},
	_mouseUp : function() {
		this.saveSelection();
	},
	focus : function() {
		this.body.focus();
		this.controller.implFocused();
	},
	align : function(value) {
		var x = {center:'justifycenter',justify:'justifyfull',left:'justifyleft',right:'justifyright'};
		this.document.execCommand(x[value],null,null);
	},
	format : function(info) {
		if (info.key=='strong' || info.key=='em') {
			this._wrapInTag(info.key);
		} else if (info.key=='insert-table') {
			this._insertHTML('<table><tbody><tr><td>Lorem ipsum dolor</td><td>Lorem ipsum dolor</td></tr></tbody></table>');
		} else {
			this.document.execCommand(info.key,null,null);
		}
	},
	removeFormat : function() {
		this.document.execCommand('removeFormat',null,null);
	},
	colorize : function(color) {
		this.document.execCommand('forecolor',null,color);
		this.restoreSelection();
	},
	_wrapInTag : function(tag) {
		document.execCommand('inserthtml',null,'<'+tag+'>'+hui.string.escape(hui.selection.getText())+'</'+tag+'>');
	},
	_insertHTML : function(html) {
		document.execCommand('inserthtml',null,html);
	},
	setHTML : function(html) {
		this.body.innerHTML = html;
	},
	getHTML : function() {
		var cleaned = hui.ui.MarkupEditor.util.clean(this.body);
		return cleaned.innerHTML;
	}
}

/** @namespace */
hui.ui.MarkupEditor.util = {
	clean : function(node) {
		var copy = node.cloneNode(true);
		this.replaceNodes(copy,{b:'strong',i:'em',font:'span'});

		var apples = hui.get.byClass(copy,'Apple-style-span');
		for (var i = apples.length - 1; i >= 0; i--){
			apples[i].removeAttribute('class');
		};
		this.convertAttributesToStyle(copy);
		return copy;
	},
	replaceNodes : function(node,recipe) {
		for (var key in recipe) {
			var bs = node.getElementsByTagName(key);
			for (var i = bs.length - 1; i >= 0; i--) {
				var x = bs[i];
				var replacement = document.createElement(recipe[key]);
				var color = bs[i].getAttribute('color');
				if (color) {
					replacement.style.color=color;
				}
				hui.dom.replaceNode(x,replacement);
				var children = x.childNodes;
				for (var j=0; j < children.length; j++) {
					var removed = x.removeChild(children[j]);
					replacement.appendChild(removed);
				};
			};
		}
	},
	convertAttributesToStyle : function(node) {
		var all = node.getElementsByTagName('*');
		for (var i=0; i < all.length; i++) {
			var n = all[i];
			var align = n.getAttribute('align');
			if (align) {
				n.style.textAlign = align;
				n.removeAttribute('align');
			}
		};
	}
}

/* EOF *//**
 * @constructor
 */
hui.ui.ColorPicker = function(options) {
	this.options = options || {};
	this.name = options.name;
	this.element = hui.get(options.element);
	this.color = null;
	this.buttons = [];
	this.preview = hui.get.firstByClass(this.element,'hui_colorpicker_preview');
	this.pages = hui.get.byClass(this.element,'hui_colorpicker_page');
	this.input = hui.get.firstByTag(this.element,'input');
	this.wheel1 = this.pages[0];
	this.wheel2 = this.pages[1];
	this.wheel3 = this.pages[2];
	this.swatches = this.pages[3];
	hui.ui.extend(this);
	this.addBehavior();
	this.buildData();
}

hui.ui.ColorPicker.create = function(options) {
	var swatches = '',
		c, hex, j;
	for (var i=0; i < 360; i+=30) {
		for (j=0.05; j <= 1; j+=.15) {
			c = hui.Color.hsv2rgb(i,j,1);
			hex = hui.Color.rgb2hex(c);
			swatches+='<a style="background: rgb('+c[0]+','+c[1]+','+c[2]+')" rel="'+hex+'"></a>';
		}
		for (j=1; j >= .20; j-=.15) {
			c = hui.Color.hsv2rgb(i,1,j);
			hex = hui.Color.rgb2hex(c);
			swatches+='<a style="background: rgb('+c[0]+','+c[1]+','+c[2]+')" rel="'+hex+'"></a>';
		}
	}
	for (j=255; j >=0; j-=255/12) {
		hex = hui.Color.rgb2hex([j,j,j]);
		swatches+='<a style="background: rgb('+Math.round(j)+','+Math.round(j)+','+Math.round(j)+')" rel="'+hex+'"></a>';
	}
	options = options || {};
	options.element = hui.build('div',{
		'class':'hui_colorpicker',
		html : 
			'<div class="hui_bar hui_bar_window_mini">'+
				'<div class="hui_bar_body">'+
					'<a class="hui_bar_button hui_bar_button_selected" href="javascript:void(0)" rel="0">'+
						'<span class="hui_icon_16" style="background: url('+hui.ui.getIconUrl('colorpicker/wheel_pastels',16)+')"></span>'+
					'</a>'+
					'<a class="hui_bar_button" href="javascript:void(0)" rel="1">'+
						'<span class="hui_icon_16" style="background: url('+hui.ui.getIconUrl('colorpicker/wheel_brightness',16)+')"></span>'+
					'</a>'+
					'<a class="hui_bar_button" href="javascript:void(0)" rel="2">'+
						'<span class="hui_icon_16" style="background: url('+hui.ui.getIconUrl('colorpicker/wheel_saturated',16)+')"></span>'+
					'</a>'+
					'<a class="hui_bar_button" href="javascript:void(0)" rel="3">'+
						'<span class="hui_icon_16" style="background: url('+hui.ui.getIconUrl('colorpicker/swatches',16)+')"></span>'+
					'</a>'+
					'<input class="hui_colorpicker"/>'+
				'</div>'+
			'</div>'+
			'<div class="hui_colorpicker_pages">'+
				'<div class="hui_colorpicker_page hui_colorpicker_wheel1"></div>'+
				'<div class="hui_colorpicker_page hui_colorpicker_wheel2"></div>'+
				'<div class="hui_colorpicker_page hui_colorpicker_wheel3"></div>'+
				'<div class="hui_colorpicker_page hui_colorpicker_swatches">'+swatches+'</div>'+
			'</div>'+
			'<div class="hui_colorpicker_preview"></div>'
	});
	return new hui.ui.ColorPicker(options);
}

hui.ui.ColorPicker.prototype = {
	/** @private */
	addBehavior : function() {
		var bs = hui.get.byClass(this.element,'hui_bar_button');
		for (var i=0; i < bs.length; i++) {
			var button = new hui.ui.Bar.Button({element:bs[i]});
			button.listen(this);
			this.buttons.push(button);
		};
		
		hui.listen(this.element,'click',this._click.bind(this));
		hui.listen(this.wheel1,'mousemove',this._hoverWheel1.bind(this));
		hui.listen(this.wheel1,'click',this._pickColor.bind(this));
		hui.listen(this.wheel2,'mousemove',this._hoverWheel2.bind(this));
		hui.listen(this.wheel2,'click',this._pickColor.bind(this));
		hui.listen(this.wheel3,'mousemove',this._hoverWheel3.bind(this));
		hui.listen(this.wheel3,'click',this._pickColor.bind(this));
		hui.listen(this.element,'mousedown',function(e) {
			hui.stop(e);
		})
		hui.listen(this.swatches,'mousemove',function(e) {
			e = hui.event(e);
			this._hoverColor(e.element.getAttribute('rel'));
		}.bind(this));
		hui.listen(this.swatches,'click',this._pickColor.bind(this));
	},
	/** @private */
	$click : function(button) {
		var page = parseInt(button.element.getAttribute('rel')),
			i;
		for (i = this.pages.length - 1; i >= 0; i--){
			this.pages[i].style.display = i==page ? 'block' : 'none';
		};
		for (i=0; i < this.buttons.length; i++) {
			this.buttons[i].setSelected(this.buttons[i]==button);
		};
	},
	_click : function(e) {
		e = hui.event(e);
		e.stop();
	//	return;
		var input = e.findByTag('input');
		if (input) {input.focus()}
	},
	/** @private */
	_pickColor : function(e) {
		hui.stop(e);
		this.fire('colorWasSelected',this.color);
	},
	_hoverColor : function(color) {
		this.preview.style.background = color;
		this.color = color;
		this.fire('colorWasHovered',this.color);
		this.input.value = color;
	},
	/** @private */
	buildData : function() {
		var addary = new Array();           //red
		addary[0] = new Array(0,1,0);   //red green
		addary[1] = new Array(-1,0,0);  //green
		addary[2] = new Array(0,0,1);   //green blue
		addary[3] = new Array(0,-1,0);  //blue
		addary[4] = new Array(1,0,0);   //red blue
		addary[5] = new Array(0,0,-1);  //red
		addary[6] = new Array(255,1,1);
		var clrary = new Array(360);
		for(var i = 0; i < 6; i++) {
			for(var j = 0; j < 60; j++) {
				clrary[60 * i + j] = new Array(3);
				for(var k = 0; k < 3; k++) {
					clrary[60 * i + j][k] = addary[6][k];
					addary[6][k] += (addary[i][k] * 4);
				}
			}
		}
		this.colorArray = clrary;
	},
	_hoverWheel1 : function(e) {
		e = hui.event(e);
		var pos = hui.position.get(this.wheel1);
		var x = 4 * (e.getLeft() - pos.left);
		var y = 4 * (e.getTop() - pos.top);

		var sx = x - 512;
		var sy = y - 512;
		var qx = (sx < 0)?0:1;
		var qy = (sy < 0)?0:1;
		var q = 2 * qy + qx;
		var quad = new Array(-180,360,180,0);
		var xa = Math.abs(sx);
		var ya = Math.abs(sy);
		var d = ya * 45 / xa;
		if(ya > xa) {
			 d = 90 - (xa * 45 / ya);
		}
		var deg = Math.floor(Math.abs(quad[q] - d));
		sx = Math.abs(x - 512);
		sy = Math.abs(y - 512);
		var r = Math.sqrt((sx * sx) + (sy * sy));
		if(x == 512 & y == 512) {
			var c = "000000";
		} else {
			var n = 0;
			for(var i = 0; i < 3; i++) {
				var r2 = this.colorArray[deg][i] * r / 256;
				if(r > 256) r2 += Math.floor(r - 256);
				if(r2 > 255) r2 = 255;
				n = 256 * n + Math.floor(r2);
			}
			c = n.toString(16);
		}
		while(c.length < 6) c = "0" + c;
		this._hoverColor('#'+c);
	},
	_hoverWheel2 : function(e) {
		var rgb,sat,val;
		e = hui.event(e);
		var pos = hui.position.get(this.wheel2);
		var x = (e.getLeft() - pos.left);
		var y = (e.getTop() - pos.top);

		if (y > 256) {return}

	    var cartx = x - 128;
	    var carty = 128 - y;
	    var cartx2 = cartx * cartx;
	    var carty2 = carty * carty;
	    var rraw = Math.sqrt(cartx2 + carty2);       //raw radius
	    var rnorm = rraw/128;                        //normalized radius
	    if (rraw == 0) {
			sat = 0;
			val = 0;
			rgb = new Array(0,0,0);
		} else {
			var arad = Math.acos(cartx/rraw);            //angle in radians 
			var aradc = (carty>=0)?arad:2*Math.PI - arad;  //correct below axis
			var adeg = 360 * aradc/(2*Math.PI);  //convert to degrees
			if (rnorm > 1) {    // outside circle
				rgb = new Array(255,255,255);
				sat = 1;
				val = 1;            
			} else if (rnorm >= .5) {
				sat = 1 - ((rnorm - .5) *2);
				val = 1;
				rgb = hui.Color.hsv2rgb(adeg,sat,val);
			} else {
				sat = 1;
				val = rnorm * 2;
				rgb = hui.Color.hsv2rgb(adeg,sat,val);
			}
		}
		this._hoverColor(hui.Color.rgb2hex(rgb));
	},
	_hoverWheel3 : function(e) {
		var rgb,sat,val;
		e = hui.event(e);
		var pos = hui.position.get(this.wheel3);
		var x = (e.getLeft() - pos.left);
		var y = (e.getTop() - pos.top);

		if (y > 256) {return}

	    var cartx = x - 128;
	    var carty = 128 - y;
	    var cartx2 = cartx * cartx;
	    var carty2 = carty * carty;
	    var rraw = Math.sqrt(cartx2 + carty2);       //raw radius
	    var rnorm = rraw/128;                        //normalized radius
	    if (rraw == 0) {
			sat = 0;
			val = 0;
			rgb = new Array(0,0,0);
		} else {
			var arad = Math.acos(cartx/rraw);            //angle in radians 
			var aradc = (carty>=0) ? arad : 2*Math.PI - arad;  //correct below axis
			var adeg = 360 * aradc/(2*Math.PI);  //convert to degrees
			if (rnorm > 1) {    // outside circle
				rgb = new Array(255,255,255);
				sat = 1;
				val = 1;            
			} else {
				sat = rnorm;// - ((rnorm - .5) *2);
				val = 1;
				rgb = hui.Color.hsv2rgb(adeg,sat,val);
			}
		}
		this._hoverColor(hui.Color.rgb2hex(rgb));
	}
}

/* EOF *//////////////////////////// Style length /////////////////////////

/**
 * A component for geo-location
 * @constructor
 */
hui.ui.LocationField = function(options) {
	this.options = hui.override({value:null},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.chooser = hui.get.firstByTag(this.element,'a');
	this.latField = new hui.ui.Input({element:hui.get.firstByTag(this.element,'input'),validator:new hui.ui.NumberValidator({min:-90,max:90,allowNull:true})});
	this.latField.listen(this);
	this.lngField = new hui.ui.Input({element:this.element.getElementsByTagName('input')[1],validator:new hui.ui.NumberValidator({min:-180,max:180,allowNull:true})});
	this.lngField.listen(this);
	this.value = this.options.value;
	hui.ui.extend(this);
	this.setValue(this.value);
	this.addBehavior();
}

hui.ui.LocationField.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('span',{'class':'hui_locationfield'});
	var b = hui.build('span',{html:'<span class="hui_locationfield_latitude"><span><input/></span></span><span class="hui_locationfield_longitude"><span><input/></span></span>'});
	e.appendChild(hui.ui.wrapInField(b));
	e.appendChild(hui.build('a',{'class':'hui_locationfield_picker',href:'javascript:void(0);'}));
	return new hui.ui.LocationField(options);
}

hui.ui.LocationField.prototype = {
	/** @private */
	addBehavior : function() {
		hui.listen(this.chooser,'click',this.showPicker.bind(this));
		hui.ui.addFocusClass({element:this.latField.element,classElement:this.element,'class':'hui_field_focused'});
		hui.ui.addFocusClass({element:this.lngField.element,classElement:this.element,'class':'hui_field_focused'});
	},
	getLabel : function() {
		return this.options.label;
	},
	reset : function() {
		this.setValue();
	},
	getValue : function() {
		return this.value;
	},
	setValue : function(loc) {
		if (loc) {
			this.latField.setValue(loc.latitude);
			this.lngField.setValue(loc.longitude);
			this.value = loc;
		} else {
			this.latField.setValue();
			this.lngField.setValue();
			this.value = null;
		}
		this.updatePicker();
	},
	updatePicker : function() {
		if (this.picker) {
			this.picker.setLocation(this.value);
		}
	},
	/** @private */
	showPicker : function() {
		if (!this.picker) {
			this.picker = new hui.ui.LocationPicker();
			this.picker.listen(this);
		}
		this.picker.show({node:this.chooser,location:this.value});
	},
	$locationChanged : function(loc) {
		this.setValue(loc);
	},
	$valueChanged : function() {
		var lat = this.latField.getValue();
		var lng = this.lngField.getValue();
		if (lat===null || lng===null) {
			this.value = null;
		} else {
			this.value = {latitude:lat,longitude:lng};
		}
		this.updatePicker();
	}
}/////////////////////////// Style length /////////////////////////

/**
 * A date and time field
 * @constructor
 */
hui.ui.StyleLength = function(o) {
	this.options = hui.override({value:null,min:0,max:1000,units:['px','pt','em','%'],defaultUnit:'px',allowNull:false},o);	
	this.name = o.name;
	var e = this.element = hui.get(o.element);
	this.input = hui.get.firstByTag(e,'input');
	var as = e.getElementsByTagName('a');
	this.up = as[0];
	this.down = as[1];
	this.value = this.parseValue(this.options.value);
	hui.ui.extend(this);
	this.addBehavior();
}

hui.ui.StyleLength.prototype = {
	/** @private */
	addBehavior : function() {
		var e = this.element;
		hui.listen(this.input,'focus',function() {hui.cls.add(e,'hui_numberfield_focused')});
		hui.listen(this.input,'blur',this.blurEvent.bind(this));
		hui.listen(this.input,'keyup',this.keyEvent.bind(this));
		hui.listen(this.up,'mousedown',this.upEvent.bind(this));
		hui.listen(this.down,'mousedown',this.downEvent.bind(this));
	},
	/** @private */
	parseValue : function(value) {
		if (value===null || value===undefined) {
			return null;
		}
		var num = parseFloat(value,10);
		if (isNaN(num)) {
			return null;
		}
		var parsed = {number: num, unit:this.options.defaultUnit};
		for (var i=0; i < this.options.units.length; i++) {
			var unit = this.options.units[i];
			if (value.indexOf(unit)!=-1) {
				parsed.unit = unit;
				break;
			}
		};
		parsed.number = Math.max(this.options.min,Math.min(this.options.max,parsed.number));
		return parsed;
	},
	/** @private */
	blurEvent : function() {
		hui.cls.remove(this.element,'hui_numberfield_focused');
		this.updateInput();
	},
	/** @private */
	keyEvent : function(e) {
		e = e || window.event;
		if (e.keyCode==hui.KEY_UP) {
			hui.stop(e);
			this.upEvent();
		} else if (e.keyCode==hui.KEY_DOWN) {
			this.downEvent();
		} else {
			this.checkAndSetValue(this.parseValue(this.input.value));
		}
	},
	/** @private */
	updateInput : function() {
		this.input.value = this.getValue();
	},
	/** @private */
	checkAndSetValue : function(value) {
		var old = this.value;
		var changed = false;
		if (old===null && value===null) {
			// nothing
		} else if (old!=null && value!=null && old.number===value.number && old.unit===value.unit) {
			// nothing
		} else {
			changed = true;
		}
		this.value = value;
		if (changed) {
			hui.ui.callAncestors(this,'childValueChanged',this.input.value);
			this.fire('valueChanged',this.getValue());
		}
	},
	/** @private */
	downEvent : function() {
		if (this.value) {
			this.checkAndSetValue({number:Math.max(this.options.min,this.value.number-1),unit:this.value.unit});
		} else {
			this.checkAndSetValue({number:this.options.min,unit:this.options.defaultUnit});
		}
		this.updateInput();
	},
	/** @private */
	upEvent : function() {
		if (this.value) {
			this.checkAndSetValue({number:Math.min(this.options.max,this.value.number+1),unit:this.value.unit});
		} else {
			this.checkAndSetValue({number:this.options.min+1,unit:this.options.defaultUnit});
		}
		this.updateInput();
	},
	
	// Public
	
	getValue : function() {
		return this.value ? this.value.number+this.value.unit : '';
	},
	setValue : function(value) {
		this.value = this.parseValue(value);
		this.updateInput();
	},
	focus : function() {
		try {
			this.input.focus();
		} catch (e) {}		
	},
	reset : function() {
		this.setValue('');
	}
}/////////////////////////// Date time /////////////////////////

/**
 * A date and time field
 * @constructor
 */
hui.ui.DateTimeField = function(o) {
	this.inputFormats = ['d-m-Y','d/m-Y','d/m/Y','d-m-Y H:i:s','d/m-Y H:i:s','d/m/Y H:i:s','d-m-Y H:i','d/m-Y H:i','d/m/Y H:i','d-m-Y H','d/m-Y H','d/m/Y H','d-m','d/m','d','Y','m-d-Y','m-d','m/d'];
	this.outputFormat = 'd-m-Y H:i:s';
	this.name = o.name;
	this.element = hui.get(o.element);
	this.input = hui.get.firstByTag(this.element,'input');
	this.options = hui.override({returnType:null,label:null,allowNull:true,value:null},o);
	this.value = this.options.value;
	hui.ui.extend(this);
	this.addBehavior();
	this.updateUI();
}

hui.ui.DateTimeField.create = function(options) {
	var node = hui.build('span',{'class':'hui_field_singleline'});
	hui.build('input',{'class':'hui_formula_text',parent:node});
	options.element = hui.ui.wrapInField(node);
	return new hui.ui.DateTimeField(options);
}

hui.ui.DateTimeField.prototype = {
	addBehavior : function() {
		hui.ui.addFocusClass({element:this.input,classElement:this.element,'class':'hui_field_focused'});
		hui.listen(this.input,'blur',this.check.bind(this));
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
		try {this.input.focus();} catch (ignore) {}
	},
	reset : function() {
		this.setValue('');
	},
	setValue : function(value) {
		if (!value) {
			this.value = null;
		} else if (value.constructor==Date) {
			this.value = value;
		} else {
			this.value = new Date();
			this.value.setTime(parseInt(value)*1000);
		}
		this.updateUI();
	},
	check : function() {
		var str = this.input.value;
		var parsed = null;
		for (var i=0; i < this.inputFormats.length && parsed==null; i++) {
			parsed = Date.parseDate(str,this.inputFormats[i]);
		};
		if (this.options.allowNull || parsed!=null) {
			this.value = parsed;
		}
		this.updateUI();
	},
	getValue : function() {
		if (this.value!=null && this.options.returnType=='seconds') {
			return Math.round(this.value.getTime()/1000);
		}
		return this.value;
	},
	getElement : function() {
		return this.element;
	},
	getLabel : function() {
		return this.options.label;
	},
	updateUI : function() {
		if (this.value) {
			this.input.value = this.value.dateFormat(this.outputFormat);
		} else {
			this.input.value = ''
		}
	}
}/**
 * A tokens component
 * @constructor
 */
hui.ui.TokenField = function(o) {
	this.options = hui.override({label:null,key:null},o);
	this.element = hui.get(o.element);
	this.name = o.name;
	this.value = [''];
	hui.ui.extend(this);
	this.updateUI();
}

hui.ui.TokenField.create = function(o) {
	o = o || {};
	o.element = hui.build('div',{'class':'hui_tokenfield'});
	return new hui.ui.TokenField(o);
}

hui.ui.TokenField.prototype = {
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
		hui.each(this.value,function(value) {
			value = hui.string.trim(value);
			if (value.length>0) {
				out.push(value);
			}
		})
		return out;
	},
	getLabel : function() {
		return this.options.label;
	},
	updateUI : function() {
		this.element.innerHTML='';
		hui.each(this.value,function(value,i) {
			var input = hui.build('input',{'class':'hui_tokenfield_token',parent:this.element});
			if (this.options.width) {
				input.style.width=this.options.width+'px';
			}
			input.value = value;
			hui.listen(input,'keyup',function() {
				this.inputChanged(input,i)
			}.bind(this));
		}.bind(this));
	},
	/** @private */
	inputChanged : function(input,index) {
		if (index==this.value.length-1 && input.value!=this.value[index]) {
			this.addField();
		}
		this.value[index] = input.value;
		hui.animate({node:input,css:{width:Math.min(Math.max(input.value.length*7+3,50),150)+'px'},duration:200});
	},
	/** @private */
	addField : function() {
		var input = hui.build('input',{'class':'hui_tokenfield_token'});
		if (this.options.width) {
			input.style.width = this.options.width+'px';
		}
		var i = this.value.length;
		this.value.push('');
		this.element.appendChild(input);
		var self = this;
		hui.listen(input,'keyup',function() {self.inputChanged(input,i)});
	}
}

/* EOF *//**
 * A check box
 * @constructor
 */
hui.ui.Checkbox = function(o) {
	this.element = hui.get(o.element);
	this.control = hui.get.firstByTag(this.element,'span');
	this.options = o;
	this.name = o.name;
	this.value = o.value==='true' || o.value===true;
	hui.ui.extend(this);
	this.addBehavior();
}

/**
 * Creates a new checkbox
 */
hui.ui.Checkbox.create = function(o) {
	var e = o.element = hui.build('a',{'class':'hui_checkbox',href:'javascript://',html:'<span><span></span></span>'});
	if (o.value) {
		hui.cls.add(e,'hui_checkbox_selected');
	}
	return new hui.ui.Checkbox(o);
}

hui.ui.Checkbox.prototype = {
	/** @private */
	addBehavior : function() {
		hui.ui.addFocusClass({element:this.element,'class':'hui_checkbox_focused'});
		hui.listen(this.element,'click',this.click.bind(this));
	},
	/** @private */
	click : function(e) {
		hui.stop(e);
		this.element.focus();
		this.value = !this.value;
		this.updateUI();
		hui.ui.callAncestors(this,'childValueChanged',this.value);
		this.fire('valueChanged',this.value);
	},
	/** @private */
	updateUI : function() {
		hui.cls.set(this.element,'hui_checkbox_selected',this.value);
	},
	/** Sets the value
	 * @param {Boolean} value Whether the checkbox is checked
	 */
	setValue : function(value) {
		this.value = value===true || value==='true';
		this.updateUI();
	},
	/** Gets the value
	 * @return {Boolean} Whether the checkbox is checked
	 */
	getValue : function() {
		return this.value;
	},
	/** Resets the checkbox */
	reset : function() {
		this.setValue(false);
	},
	/** Gets the label
	 * @return {String} The checkbox label
	 */
	getLabel : function() {
		return this.options.label;
	}
}/////////////////////////// Checkboxes ////////////////////////////////

/**
 * Multiple checkboxes
 * @constructor
 */
hui.ui.Checkboxes = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.items = options.items || [];
	this.subItems = [];
	this.values = options.values || options.value || []; // values is deprecated
	hui.ui.extend(this);
	this.addBehavior();
	this._updateUI();
	if (options.url) {
		new hui.ui.Source({url:options.url,delegate:this});
	}
}

hui.ui.Checkboxes.create = function(o) {
	o.element = hui.build('div',{'class':o.vertical ? 'hui_checkboxes hui_checkboxes_vertical' : 'hui_checkboxes'});
	if (o.items) {
		hui.each(o.items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'javascript:void(0);',html:'<span><span></span></span>'+item.title});
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			o.element.appendChild(node);
		});
	}
	return new hui.ui.Checkboxes(o);
}

hui.ui.Checkboxes.prototype = {
	/** @private */
	addBehavior : function() {
		var checks = hui.get.byClass(this.element,'hui_checkbox');
		hui.each(checks,function(check,i) {
			hui.listen(check,'click',function(e) {
				hui.stop(e);
				this.flipValue(this.items[i].value);
			}.bind(this))
		}.bind(this))
	},
	getValue : function() {
		return this.values;
	},
	_checkValues : function() {
		var newValues = [];
		for (var i=0; i < this.values.length; i++) {
			var value = this.values[i],
				found = false,
				j;
			for (j=0; j < this.items.length; j++) {
				found = found || this.items[j].value===value;
			}
			for (j=0; j < this.subItems.length; j++) {
				found = found || this.subItems[j]._hasValue(value);
			};
			if (found) {
				newValues.push(value);
			}
		};
		this.values=newValues;
	},
	setValue : function(values) {
		this.values = values;
		this._checkValues();
		this._updateUI();
	},
	flipValue : function(value) {
		hui.array.flip(this.values,value);
		this._checkValues();
		this._updateUI();
		this.fire('valueChanged',this.values);
		hui.ui.callAncestors(this,'childValueChanged',this.values);
	},
	_updateUI : function() {
		var i,item,found;
		for (i=0; i < this.subItems.length; i++) {
			this.subItems[i]._updateUI();
		};
		var nodes = hui.get.byClass(this.element,'hui_checkbox');
		for (i=0; i < this.items.length; i++) {
			item = this.items[i];
			found = hui.array.contains(this.values,item.value);
			hui.cls.set(nodes[i],'hui_checkbox_selected',found);
		};
	},
	refresh : function() {
		for (var i=0; i < this.subItems.length; i++) {
			this.subItems[i].refresh();
		};
	},
	reset : function() {
		this.setValues([]);
	},
	getLabel : function() {
		return this.options.label;
	},
	/** @private @deprecated */
	setValues : function(values) {
		this.setValue(values);
	},
	/** @private @deprecated */
	getValues : function() {
		return this.values;
	},
	/** @private */
	registerItem : function(item) {
		// If it is a number, treat it as such
		if (parseInt(item.value)==item.value) {
			item.value = parseInt(item.value);
		}
		this.items.push(item);
	},
	/** @private */
	registerItems : function(items) {
		items.parent = this;
		this.subItems.push(items);
	},
	/** @private */
	$itemsLoaded : function(items) {
		hui.each(items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'javascript:void(0);',html:'<span><span></span></span>'+hui.string.escape(item.title)});
			hui.listen(node,'click',function(e) {
				hui.stop(e);
				this.flipValue(item.value);
			}.bind(this))
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			this.element.appendChild(node);
			this.items.push(item);
		}.bind(this));
		this._checkValues();
		this._updateUI();
	}
}

/////////////////////// Checkbox items ///////////////////

/**
 * Check box items
 * @constructor
 */
hui.ui.Checkboxes.Items = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	this.parent = null;
	this.options = options;
	this.checkboxes = [];
	hui.ui.extend(this);
	if (this.options.source) {
		this.options.source.listen(this);
	}
	hui.log('itms')
}

hui.ui.Checkboxes.Items.prototype = {
	refresh : function() {
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	/** @private */
	$itemsLoaded : function(items) {
		this.checkboxes = [];
		this.element.innerHTML='';
		var self = this;
		hui.each(items,function(item) {
			var node = hui.build('a',{'class':'hui_checkbox',href:'javascript://',html:'<span><span></span></span>'+item.title});
			hui.listen(node,'click',function(e) {
				hui.stop(e);
				node.focus();
				self._onItemClick(item)
			});
			hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
			self.element.appendChild(node);
			self.checkboxes.push({title:item.title,element:node,value:item.value});
		});
		this.parent._checkValues();
		this._updateUI();
	},
	_onItemClick : function(item) {
		this.parent.flipValue(item.value);
	},
	_updateUI : function() {
		try {
		for (var i=0; i < this.checkboxes.length; i++) {
			var item = this.checkboxes[i];
			var index = hui.array.indexOf(this.parent.values,item.value);
			hui.cls.set(item.element,'hui_checkbox_selected',index!=-1);
		};
		} catch (e) {
			alert(typeof(this.parent.values));
			alert(e);
		}
	},
	_hasValue : function(value) {
		for (var i=0; i < this.checkboxes.length; i++) {
			if (this.checkboxes[i].value==value) {
				return true;
			}
		};
		return false;
	}
}/**
 * @constructor
 */
hui.ui.Radiobuttons = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	this.radios = [];
	this.value = options.value;
	this.defaultValue = this.value;
	this.enabled = true;
	hui.ui.extend(this);
}

hui.ui.Radiobuttons.prototype = {
/*	click : function() {
		this.value = !this.value;
		this.updateUI();
	},*/
	/** @private */
	updateUI : function() {
		for (var i=0; i < this.radios.length; i++) {
			var radio = this.radios[i];
			hui.cls.set(hui.get(radio.id),'hui_radiobutton_selected',radio.value==this.value);
		};
	},
	setValue : function(value) {
		this.value = value;
		this.updateUI();
	},
	getValue : function() {
		if (!this.enabled) {
			return null;
		}
		return this.value;
	},
	reset : function() {
		this.setValue(this.defaultValue);
	},
	setEnabled : function(enabled) {
		this.enabled = enabled == true;
		hui.cls.set(this.element,'hui_radiobuttons_disabled',!this.enabled);
	},
	registerRadiobutton : function(radio) {
		this.radios.push(radio);
		var element = hui.get(radio.id);
		var self = this;
		element.onclick = function() {
			if (!self.enabled) {
				return;
			}
			self.setValue(radio.value);
			self.fire('valueChanged',radio.value);
			hui.ui.callAncestors(self,'childValueChanged',radio.value);
		}
	}
}/////////////////////////// Number /////////////////////////

/**
 * A number field
 * @constructor
 */
hui.ui.NumberField = function(o) {
	this.options = hui.override({min:0,max:10000,value:null,decimals:0,allowNull:false},o);	
	this.name = o.name;
	var e = this.element = hui.get(o.element);
	this.input = hui.get.firstByTag(e,'input');
	this.up = hui.get.firstByClass(e,'hui_numberfield_up');
	this.down = hui.get.firstByClass(e,'hui_numberfield_down');
	this.value = parseInt(this.options.value,10);
	if (isNaN(this.value)) {
		this.value = null;
	}
	hui.ui.extend(this);
	this.addBehavior();
}

/** Creates a new number field */
hui.ui.NumberField.create = function(o) {
	o.element = hui.build('span',{
		'class':'hui_numberfield',
		html:'<span><span><input type="text" value="'+(o.value!==undefined ? o.value : '0')+'"/><a class="hui_numberfield_up"></a><a class="hui_numberfield_down"></a></span></span>'
	});
	return new hui.ui.NumberField(o);
}

hui.ui.NumberField.prototype = {
	/** @private */
	addBehavior : function() {
		var e = this.element;
		hui.listen(this.input,'focus',function() {hui.cls.add(e,'hui_numberfield_focused')});
		hui.listen(this.input,'blur',this.blurEvent.bind(this));
		hui.listen(this.input,'keyup',this.keyEvent.bind(this));
		hui.listen(this.up,'mousedown',this.upEvent.bind(this));
		hui.listen(this.up,'dblclick',this.upEvent.bind(this));
		hui.listen(this.down,'mousedown',this.downEvent.bind(this));
		hui.listen(this.down,'dblclick',this.upEvent.bind(this));
	},
	/** @private */
	blurEvent : function() {
		hui.cls.remove(this.element,'hui_numberfield_focused');
		this.updateField();
	},
	/** @private */
	keyEvent : function(e) {
		e = e || window.event;
		if (e.keyCode==hui.KEY_UP) {
			hui.stop(e);
			this.upEvent();
		} else if (e.keyCode==hui.KEY_DOWN) {
			this.downEvent();
		} else {
			var parsed = parseInt(this.input.value,10);
			if (!isNaN(parsed)) {
				this.setLocalValue(parsed,true);
			} else {
				this.setLocalValue(null,true);
			}
		}
	},
	/** @private */
	downEvent : function(e) {
		hui.stop(e);
		if (this.value===null) {
			this.setLocalValue(this.options.min,true);
		} else {
			this.setLocalValue(this.value-1,true);
		}
		this.updateField();
	},
	/** @private */
	upEvent : function(e) {
		hui.stop(e);
		this.setLocalValue(this.value+1,true);
		this.updateField();
	},
	/** Sets focus */
	focus : function() {
		try {
			this.input.focus();
		} catch (e) {}
	},
	/** Gets the value */
	getValue : function() {
		return this.value;
	},
	/** Gets the label */
	getLabel : function() {
		return this.options.label;
	},
	/** Sets the value */
	setValue : function(value) {
		value = parseInt(value,10);
		if (!isNaN(value)) {
			this.setLocalValue(value,false);
		}
		this.updateField();
	},
	/** @private */
	updateField : function() {
		this.input.value = this.value===null || this.value===undefined ? '' : this.value;
	},
	/** @private */
	setLocalValue : function(value,fire) {
		var orig = this.value;
		if (value===null || value===undefined && this.options.allowNull) {
			this.value = null;
		} else {
			this.value = Math.min(Math.max(value,this.options.min),this.options.max);
		}
		if (fire && orig!==this.value) {
			hui.ui.callAncestors(this,'childValueChanged',this.value);
			this.fire('valueChanged',this.value);
		}
	},
	/** Resets the field */
	reset : function() {
		if (this.options.allowNull) {
			this.value = null;
		} else {
			this.value = Math.min(Math.max(0,this.options.min),this.options.max);
		}
		this.updateField();
	}
}///////////////////////// Text /////////////////////////

/**
 * A text field
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  key : «String»,
 *  label : «String»,
 *  maxHeight : «<strong>100</strong> | integer»,
 *  animateUserChange : «<strong>true</strong> | false»
 * }
 *
 * <strong>Events:</strong>
 * $valueChanged(value) - When the value of the field is changed by the user
 * @constructor
 */
hui.ui.TextField = function(options) {
	this.options = hui.override({label:null,key:null,lines:1,maxHeight:100,animateUserChange:true},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this.input = hui.get.firstByClass(this.element,'hui_formula_text');
	this.multiline = this.input.tagName.toLowerCase() == 'textarea';
	this.placeholder = hui.get.firstByClass(this.element,'hui_field_placeholder');
	this.value = this.input.value;
	this._addBehavior();
}


/**
 * Creates a new text field
 * <pre><strong>options:</strong> {
 *  value : «String»,
 *  label : «String»,
 *  multiline : «true | <strong>false</strong>»,
 *  lines : «<strong>1</strong> | integer»,
 *
 *  name : «String»,
 *  key : «String»,
 *  maxHeight : «<strong>100</strong> | integer»,
 *  animateUserChange : «<strong>true</strong> | false»
 * }
 * </pre>
 */
hui.ui.TextField.create = function(options) {
	options = hui.override({lines:1},options);
	var node,input;
	if (options.lines>1 || options.multiline) {
		input = hui.build('textarea',
			{'class':'hui_formula_text','rows':options.lines,style:'height: 32px;'}
		);
		node = hui.build('span',{'class':'hui_formula_text_multiline'});
		node.appendChild(input);
	} else {
		input = hui.build('input',{'class':'hui_formula_text'});
		if (options.secret) {
			input.setAttribute('type','password');
		}
		node = hui.build('span',{'class':'hui_field_singleline'});
		node.appendChild(input);
	}
	if (options.value!==undefined) {
		input.value=options.value;
	}
	options.element = hui.ui.wrapInField(node);
	return new hui.ui.TextField(options);
}

hui.ui.TextField.prototype = {
	_addBehavior : function() {
		if (this.placeholder) {
			var self = this;
			hui.ui.onReady(function() {
				window.setTimeout(function() {
					self.value = self.input.value;
					self._updateClass();
				},500);
			});
		}
		hui.ui.addFocusClass({element:this.input,classElement:this.element,'class':'hui_field_focused'});
		hui.listen(this.input,'keyup',this._onKeyUp.bind(this));
		var p = this.element.getElementsByTagName('em')[0];
		if (p) {
			this._updateClass();
			hui.listen(p,'mousedown',function() {
				window.setTimeout(function() {
					this.input.focus();
					this.input.select();
				}.bind(this)
			)}.bind(this));
			hui.listen(p,'mouseup',function() {
				this.input.focus();
				this.input.select();
			}.bind(this));
		}
	},
	_updateClass : function() {
		hui.cls.set(this.element,'hui_field_dirty',this.value.length>0);
	},
	_onKeyUp : function(e) {
		if (!this.multiline && e.keyCode===hui.KEY_RETURN) {
			this.fire('submit');
			var form = hui.ui.getAncestor(this,'hui_formula');
			if (form) {form.submit();}
			return;
		}
		if (this.input.value==this.value) {return;}
		this.value=this.input.value;
		this._updateClass();
		this._expand(this.options.animateUserChange);
		hui.ui.callAncestors(this,'childValueChanged',this.input.value);
		this.fire('valueChanged',this.input.value);
	},
	/** ??? */
	updateFromNode : function(node) {
		if (node.firstChild) {
			this.setValue(node.firstChild.nodeValue);
		} else {
			this.setValue(null);
		}
	},
	/** ??? */
	updateFromObject : function(data) {
		this.setValue(data.value);
	},
	/** Focus the text field */
	focus : function() {
		try {
			this.input.focus();
		} catch (e) {}
	},
	/** Select the text in the text field */
	select : function() {
		try {
			this.input.focus();
			this.input.select();
		} catch (e) {}
	},
	/** Clear the value of the text field */
	reset : function() {
		this.setValue('');
	},
	/** Draw attention to the field */
	stress : function() {
		hui.ui.stress(this);
	},
	/** Set the value of the field
	 * @value {String} The value 
	 */
	setValue : function(value) {
		if (value===undefined || value===null) {
			value='';
		}
		this.value = value;
		this.input.value = value;
		this._expand(this.options.animateValueChange);
	},
	/** Get the value
	 * @returns {String} The value
	 */
	getValue : function() {
		return this.input.value;
	},
	getLabel : function() {
		return this.options.label;
	},
	/** Check if the value is empty ('' / the empty string)
	 * @returns {Boolean} True if the value the empty string 
	 */
	isEmpty : function() {
		return this.input.value=='';
	},
	/** Check if the value has any non-white-space characters
	 * @returns {Boolean} True if the value is blank
	 */
	isBlank : function() {
		return hui.isBlank(this.input.value);
	},
	/** Mark the field with error
	 * @value {String | Boolean} The error message or true to mark the field
	 */
	setError : function(error) {
		var isError = error ? true : false;
		hui.cls.set(this.element,'hui_field_error',isError);
		if (typeof(error) == 'string') {
			hui.ui.showToolTip({text:error,element:this.element,key:this.name});
		}
		if (!isError) {
			hui.ui.hideToolTip({key:this.name});
		}
	},
	
	
	// Expanding...
	
	/** @private */
	$visibilityChanged : function() {
		if (hui.dom.isVisible(this.element)) {
			window.setTimeout(this._expand.bind(this));
		}
	},
	_expand : function(animate) {
		if (!this.multiline || !hui.dom.isVisible(this.element)) {
			return
		};
		var textHeight = hui.ui.getTextAreaHeight(this.input);
		textHeight = Math.max(32,textHeight);
		textHeight = Math.min(textHeight,this.options.maxHeight);
		if (animate) {
			this._updateOverflow();
			hui.animate(this.input,'height',textHeight+'px',300,{ease:hui.ease.slowFastSlow,onComplete:function() {
				this._updateOverflow();
				}.bind(this)
			});
		} else {
			this.input.style.height = textHeight+'px';
			this._updateOverflow();
		}
	},
	_updateOverflow : function() {
		if (!this.multiline) {
			return;
		}
		this.input.style.overflowY = this.input.clientHeight >= this.options.maxHeight ? 'auto' : 'hidden';
	}
}/** @constructor */
hui.ui.Rendering = function(options) {
	this.options = hui.override({clickObjects:false},options);
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	//hui.listen(this.element,'click',this._click.bind(this));
}

hui.ui.Rendering.prototype = {
	_click : function(e) {
		e = hui.event(e);
		
	},
	setContent : function(html) {
		this.element.innerHTML = html;
	}
}/**
 * A push button
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»
 * }
 *
 * <strong>Events:</strong>
 * $click(button) - When the icon is clicked
 * </pre>
 *
 * @param options {Object} The options
 * @constructor
 */
hui.ui.Icon = function(options) {
	this.options = options;
	this.name = options.name;
	this.icon = this.options.icon;
	this.size = this.options.size;
	this.element = hui.get(options.element);
	hui.ui.extend(this);
	this._addBehavior();
}

hui.ui.Icon.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',function() {
			this.fire('click');
		}.bind(this));
	},
	setSize : function(size) {
		this.size = size;
		this.element.className = 'hui_icon_labeled hui_icon_labeled_'+this.size;
		var inner = hui.get.firstByTag(this.element,'span');
		inner.className = 'hui_icon_'+this.size;
		inner.style.backgroundImage = 'url('+hui.ui.getIconUrl(this.options.icon,this.size)+')';
	}
}/////////////////////////// Color input /////////////////////////

/**
 * A component for color input
 * @constructor
 */
hui.ui.ColorInput = function(options) {
	this.options = hui.override({value:null},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.button = hui.get.firstByTag('a',this.element);
	this.value = this.options.value;
	hui.ui.extend(this);
	this.setValue(this.value);
	this._addBehavior();
}

hui.ui.ColorInput.prototype = {
	_addBehavior : function() {
		alert(this.button)
	},
	
	getValue : function() {
		return this.value;
	},
	setValue : function(value) {
		this.value = value;
	},
	focus : function() {
		try {
			this.input.focus();
		} catch (e) {}		
	},
	reset : function() {
		this.setValue('');
	}
	
}

/* EOF *//**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.Columns = function(options) {
	this.name = options.name;
	this.options = options || {};
	this.element = hui.get(options.element);
	this.body = hui.get.firstByTag(this.element,'tr');
	hui.ui.extend(this);
}

/**
 * Creates a new Columns opject
 */
hui.ui.Columns.create = function(options) {
	options = options || {};
	options.element = hui.build('table',{'class' : 'hui_columns',html : '<tbody><tr></tr></tbody>'});
	return new hui.ui.Columns(options);
}

hui.ui.Columns.prototype = {
	addToColumn : function(index,widget) {
		var c = this._ensureColumn(index);
		c.appendChild(widget.getElement());
	},
	setColumnStyle : function(index,style) {
		var c = this._ensureColumn(index);
		hui.style.set(c,style);
	},
	setColumnWidth : function(index,width) {
		var c = this._ensureColumn(index);
		c.style.width=width+'px';
	},
	_ensureColumn : function(index) {
		var children = hui.get.children(this.body);
		for (var i=children.length-1;i<index;i++) {
			this.body.appendChild(hui.build('td',{'class':'hui_columns_column'}));
		}
		return hui.get.children(this.body)[index];
	}
}

/* EOF *//** A graph
 * @constructor
 */
hui.ui.Graph = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	this.ready = false;
	this.defered = [];
	
	var impls = {force:hui.ui.Graph.Protoviz,graffle:hui.ui.Graph.Raphael,d3:hui.ui.Graph.D3};
	
	this.impl = impls[this.options.layout];
	
	hui.ui.extend(this);
	hui.log('Initializing implementation...');
	this.impl.init(this);
	if (options.source) {
		options.source.listen(this);
	}
}

hui.ui.Graph.prototype = {
	setData : function(data) {
		this._defer(function() {
			this.impl.setData(data);
		}.bind(this));
	},
	_defer : function(func) {
		if (this.ready) {
			func();
		} else {
			hui.log('Defering function')
			this.defered.push(func);
		}
	},
	/** @private */
	$objectsLoaded : function(data) {
		hui.log('Data loaded');
		this.setData(data);
	},
	/** @private */
	implIsReady : function() {
		hui.log('Implementation is ready!');
		this.ready = true;
		for (var i=0; i < this.defered.length; i++) {
			this.defered[i]();
		};
	},
	/** @private */
	implNodeWasClicked : function(node) {
		this.fire('clickNode',node);
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return hui.dom.isVisible(this.element);
	},
	refresh : function() {	
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	show : function() {
		this.element.style.display='block';
		this.refresh();
	},
	hide : function() {
		this.element.style.display='none';
	},
	/** @private */
	$visibilityChanged : function() {
		if (this.options.source && hui.dom.isVisible(this.element)) {
			// If there is a source, make sure it is initially 
			this.options.source.refreshFirst();
		}
	},
	$$resize : function() {
		hui.log('graph.layout');
		this.impl.resize(this.element.parentNode.clientWidth,this.element.parentNode.clientHeight);
	},
	$$layout : function() {
		hui.log('graph.layoutChanged');
		window.setTimeout(this.$$resize.bind(this),100);
	}
}

/** @namespace */
hui.ui.Graph.Protoviz = {
	init : function(parent) {
		this.parent = parent;
		hui.require(hui.ui.context+'/hui/lib/protovis-3.2/protovis-r3.2.js',function() {
			var w = document.body.clientWidth,
  			h = document.body.clientHeight;

			this.vis = new pv.Panel()
				.canvas(this.parent.element)
			    .width(this.parent.element.clientWidth)
			    .height(this.parent.element.clientHeight)
			    .fillStyle("white")
			    .event("mousedown", pv.Behavior.pan())
			    .event("mousewheel", pv.Behavior.zoom());
			hui.log('Protoviz initialized')
			parent.implIsReady();
		}.bind(this))		
	},
	_convert : function(data) {
		var result = {nodes:[],links:[]};
		for (var i=0; i < data.nodes.length; i++) {
			var node = data.nodes[i];
			result.nodes.push(node)
		};
		for (var i=0; i < data.edges.length; i++) {
			var edge = data.edges[i];
			result.links.push({source:this.getIndex(edge.from,data.nodes),target:this.getIndex(edge.to,data.nodes),label:edge.label});
		};
		return result;
	},
	getIndex : function(id,nodes) {
		for (var i=0; i < nodes.length; i++) {
			if (id===nodes[i].id) {
				return i;
			}
		};
	},
	setData : function(data) {
		var colors = pv.Colors.category19();
		data = this._convert(data);
		
		var force = this.vis.add(pv.Layout.Force)
		    .nodes(data.nodes)
		    .links(data.links);
		
		
		force.link.add(pv.Line).lineWidth(2).anchor("center").add(pv.Label).text(function() {this.anchorTarget.label});

		force.node.add(pv.Dot)
		    .size(function(d) {return 40;return (d.linkDegree + 4) * Math.pow(this.scale, -1.5)})
		    .fillStyle(function(d) {return d.fix ? "brown" : colors(d.group)})
		    .strokeStyle(function() {return this.fillStyle().darker()})
		    .lineWidth(1)
		    .title(function(d) {return d.label || ''})
		    .event("mousedown", pv.Behavior.drag())
		    .event("click", function(x) {console.log(data.nodes[x.index])})
		    .event("drag", force);

		force.node.add(pv.Label).text(function(d) {return d.label}).textAlign('center').textBaseline('middle');
		
		//force.link.add(pv.Label).text(function(d) {return d.label}).textAlign('left').textBaseline('middle');

		this.vis.render();
	}
	
}

/** @namespace */
hui.ui.Graph.D3 = {
	init : function(parent) {
		this.parent = parent;
		var self = this;
		hui.require(hui.ui.context+'/hui/lib/d3/d3.js',function() {
			hui.log('d3 loaded');
			hui.require(hui.ui.context+'/hui/lib/d3/d3.geom.js',function() {
				hui.log('d3.geom loaded');
				hui.require(hui.ui.context+'/hui/lib/d3/d3.layout.js',function() {
					hui.log('d3.layout loaded');
					self._init();
					parent.implIsReady();
				})
			})
		});
	},
	resize : function(width,height) {
		if (this.vis) {
			this.vis.attr('width',width);
			this.vis.attr('height',height);
		}
		if (this.layout) {
			this.layout.size([width,height]);
			this.layout.start();
		}
	},
	_init : function() {
		hui.log('Creating visualization...');
		var w = this.parent.element.clientWidth,
	    h = this.parent.element.clientHeight,
	    fill = d3.scale.category20();
	
		this.vis = d3.select(this.parent.element)
			.append("svg:svg")
			.attr("width", w)
			.attr("height", h);
		
	},
	_onClickNode : function(node) {
		this.parent.implNodeWasClicked(node);
	},
	_findById : function(nodes,id) {
		for (var i = nodes.length - 1; i >= 0; i--){
			if (nodes[i].id===id) {
				return i;
			}
		};
		return null;
	},
	_convert : function(data) {
		var nodes = data.nodes;
		data.links = data.edges;
		for (var i = data.links.length - 1; i >= 0; i--){
			var link = data.links[i];
			link.source = this._findById(nodes,link.from);
			link.target = this._findById(nodes,link.to);
		};
		hui.log(data);
		return data;
		
		return {"nodes":[{"name":"Person","group":1,"icon":"monochrome/person"},{"name":"Email","group":1},{"name":"Group","group":1}],"links":[{"source":1,"target":0,"value":1},{"source":0,"target":0,"value":2},{"source":1,"target":2,"value":2}]};
	},
	
	clear : function() {
		if (this.layout) {
			this.layout.stop();
			this.vis.remove();
			this._init();
		}
	},
	
	setData : function(data) {
		this.clear();
		var w = this.parent.element.clientWidth,
	    h = this.parent.element.clientHeight;
		var json = this._convert(data);
		
		var force = this.layout = d3.layout.force()
			.charge(-200)
			.gravity(0.10)
			.distance(100)
			.nodes(json.nodes)
			.links(json.links)
			.size([w, h]);
		var link = this.vis.selectAll("line.link")
			.data(json.links)
			.enter().append("svg:line")
			.attr("class", "hui_graph_link")
			.style("stroke-width", function(d) { return d.label=='Friends' ? 3 : 1 })
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
	
		var node = this.vis.selectAll("circle.node")
			.data(json.nodes)
			.enter()
			.append("svg:g")
			.attr('class','hui_node')
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill",'none')
			.call(force.drag);
			node.on('click',this._onClickNode.bind(this));
		var self = this;	
		node.each(function(individual) {
			var x = d3.select(this);
			var icon = self.buildIcon(individual.icon,x);
		})
//			node.attr("transform", "translate("+(w*Math.random())+","+(h*Math.random())+")")
		
			/*var circle = node
				.append('svg:circle').attr('r',10)
				.attr("class", "node")
				//.attr("cx", function(d) { return d.x; })
	      		//.attr("cy", function(d) { return d.y; })
	     		.style("fill", function(d) { return fill(d.group); })
	      		;*/
		var text = node
			.append('svg:text')
			.attr('class','hui_graph_label')
			.attr("dx", "13")
			.attr("dy", "5")
			.text(function(d) { return d.label; })
	
		node.append("svg:title").text(function(d) { return d.name; });
	
	  	this.vis.style("opacity", 1e-6)
	    	.transition()
			.duration(2000)
			.style("opacity", 1);
	
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
	
	    	node.attr("transform", function(d) { return "translate("+d.x+","+d.y+")" })
		});
		force.start()
		hui.log('Starting...');
	},
	buildIcon : function(icon,parent) {
		if (icon=='monochrome/person') {
			var node = parent.append('svg:path').attr('class','hui_graph_icon');
			node.attr('d','M-9.315,10c0,0-0.575-2.838,1.863-3.951c1.763-0.799,2.174-0.949,2.512-1.2 c0.138-0.087,0.263-0.198,0.438-0.351c0.661-0.561,0.562-1.324,1.038-1.562c0.474-0.225,0.424,0.238,0.524,0 c0.101-0.225-0.075-1.799,0-1.551c0.062,0.252-0.863-1.636-0.901-2.611C-3.888-2.439-4.702-2.99-4.613-3.651 c0.212-1.513,1.472-2.322,1.472-2.322s-2.423-0.454-1.36-1.478c1.062-1.012,1.474-1.4,2.6-2.076c1.138-0.663,2.674-0.599,4.163,0 C3.749-8.914,4.124-8.489,4.61-7.602c0.425,0.762,0.45,1.326,0.413,1.813C4.986-5.314,5.049-4.926,5.049-4.926 s0.499,0.112,0.513,0.837c0.013,0.687-0.175,1.699-0.551,2.162C4.861-1.752,4.599-1.114,4.197-0.264 C3.812,0.574,3.3,1.898,3.3,1.898s0.012,0.725,0,0.926c-0.039,0.45,0.649,0.012,0.962,0.512c0.312,0.501,0.1,0.85,0.799,1.162 c0.688,0.312,2.639,1.562,3.588,2.151C9.762,7.337,9.262,10,9.262,10H-9.315z').attr('fill-rule','evenodd');
		} else if (icon=='monochrome/folder') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','9.464,-3.309 9.464,-6.384 -0.354,-6.384 -3.433,-9.462 -9.462,-9.462 -9.462,-3.309 -11.153,-3.309 -9.329,9.462 9.331,9.462 11.153,-3.309');
			node.append('svg:polygon').attr('points','-9.999,-2.309 -8.461,8.462 8.464,8.462 10.001,-2.309');
			node.append('svg:polygon').attr('points','8.464,-5.384 -0.769,-5.384 -3.846,-8.462 -8.461,-8.462 -8.461,-5.384 -8.461,-3.846 8.464,-3.846');
			//node.append('svg:rect').attr('cx','0').attr('cy','0').attr('r','12').attr('fill','#fff');
			//node.append('svg:polygon').attr('points','-10,-2 -8.461,8 8.461,8 10,-2');
			//node.append('svg:polygon').attr('points','8,-5 -0.77,-5 -3.846,-8 -8,-8 -8,-5.384 -8,-4 8,-4');
		} else if (icon=='monochrome/image') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:rect').attr('x','-11').attr('y','-9').attr('width','22').attr('height','18').attr('fill','#fff');
			node.append('svg:path').attr('d','M8-6V6H-8V-6H8 M10-8h-20V8h20V-8L10-8z');
			node.append('svg:circle').attr('cx','-2.818').attr('cy','-2.693').attr('r','1.875');
			node.append('svg:path').attr('d','M-7,5H7v-5.033L4.271-3.625L1.585,2.18L0,0.561c0,0-2.193,0.814-2.917,2.064c-1.151-0.625-1.776,0-1.776,0L-7,5z');
		} else if (icon=='monochrome/news') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('d','M10.523-9.273l-1.25-1.25C8.967-10.831,8.559-11,8.125-11s-0.842,0.169-1.148,0.477L5.625-9.173 l-1.352-1.351C3.968-10.83,3.56-11,3.125-11c-0.367,0-0.727,0.126-1.014,0.354L0-8.956l-2.109-1.688 C-2.396-10.873-2.757-11-3.124-11c-0.435,0-0.843,0.169-1.149,0.477l-1.352,1.351l-1.352-1.351C-7.283-10.831-7.691-11-8.125-11 s-0.842,0.169-1.148,0.477l-1.25,1.25C-10.831-8.967-11-8.559-11-8.125v16.25c0,0.434,0.169,0.841,0.477,1.148l1.25,1.25 c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.352-1.351l1.352,1.351c0.309,0.308,0.716,0.476,1.149,0.476 c0.366,0,0.726-0.125,1.012-0.354L0,8.956l2.109,1.688C2.394,10.873,2.755,11,3.125,11c0.44,0,0.852-0.172,1.157-0.485l1.343-1.342 l1.352,1.351c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.25-1.25C10.831,8.966,11,8.559,11,8.125v-16.25 C11-8.559,10.831-8.967,10.523-9.273z').attr('fill','#fff');
			node.append('svg:path').attr('d','M9.816-8.566l-1.25-1.25c-0.244-0.244-0.639-0.244-0.883,0L5.625-7.759L3.566-9.816c-0.225-0.226-0.583-0.245-0.832-0.047 L0-7.675l-2.734-2.188c-0.248-0.198-0.606-0.179-0.832,0.047l-2.059,2.058l-2.059-2.058c-0.244-0.244-0.639-0.244-0.883,0 l-1.25,1.25C-9.934-8.449-10-8.291-10-8.125v16.25c0,0.166,0.066,0.324,0.184,0.441l1.25,1.25c0.244,0.244,0.639,0.244,0.883,0 l2.059-2.058l2.059,2.058c0.226,0.225,0.584,0.244,0.832,0.047L0,7.676l2.734,2.188C2.85,9.956,2.987,10,3.125,10 c0.161,0,0.321-0.061,0.441-0.184l2.059-2.058l2.059,2.058c0.244,0.244,0.639,0.244,0.883,0l1.25-1.25 C9.934,8.449,10,8.291,10,8.125v-16.25C10-8.291,9.934-8.449,9.816-8.566z M-1.25,3.75H-7.5V-2.5h6.25V3.75z M7.5,3.75H0V2.5h7.5 V3.75z M7.5,1.25H0V0h7.5V1.25z M7.5-1.25H0V-2.5h7.5V-1.25z M7.5-3.75h-15V-5h15V-3.75z');
		} else if (icon=='monochrome/warning') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('d','M10.672,7.15L2.321-9.432C1.913-10.386,0.984-11-0.057-11c-0.882,0-1.693,0.445-2.173,1.19 c-0.099,0.156-0.176,0.309-0.234,0.459l-8.152,16.403C-10.867,7.46-11,7.929-11,8.411C-11,9.839-9.841,11-8.416,11H8.416 C9.841,11,11,9.839,11,8.411C11,7.969,10.887,7.533,10.672,7.15z').attr('fill','#fff');
			node.append('svg:path').attr('d','M9.8,7.639L1.411-9.013C1.175-9.592,0.607-10-0.057-10c-0.558,0-1.049,0.291-1.333,0.731 c-0.062,0.1-0.116,0.206-0.156,0.316L-9.744,7.543C-9.908,7.795-10,8.091-10,8.411C-10,9.286-9.294,10-8.416,10H8.416 C9.291,10,10,9.286,10,8.411C10,8.13,9.928,7.867,9.8,7.639 M1.613-5.456L1.166,3.906H-1.15l-0.444-9.362H1.613z M0.009,8.869 h-0.02c-1.077,0-1.808-0.792-1.808-1.855c0-1.1,0.751-1.855,1.827-1.855c1.077,0,1.788,0.756,1.81,1.855 C1.818,8.077,1.107,8.869,0.009,8.869');
		} else if (icon=='monochrome/globe') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
			node.append('svg:path').attr('d','M0.048-9.91c-5.496,0-9.955,4.456-9.955,9.954S-5.448,10,0.048,10 S10,5.542,10,0.044S5.544-9.91,0.048-9.91 M6.974-5.686C7.083-5.721,7.47-5.287,7.556-5.406c0.113-0.149-0.407-0.515-0.407-0.668 c0-0.21,0.978,0.964,1.032,1.057c0.013,0.021-0.27-0.136-0.276-0.108C7.883-4.966,7.852-4.809,7.813-4.65 C7.402-4.612,6.57-5.55,6.974-5.686 M2.82,4.227c-0.755,0.929-0.313,1.975-1.71,2.39C0.392,6.831,0.7,8.332-0.506,7.959 c0.069,0.07,0.069,0.171,0.239,0.28c-0.266,0.19-0.57,0.228-0.885,0.322c0.077,0.088,0.285,0.672,0.468,0.605 C-2.344,10-2.666,6.858-3.027,6c-0.271-0.653-1.199-0.954-1.596-1.555C-4.869,4.069-5.025,3.651-5.262,3.27 c-0.565-0.908,0.843-1.993,0.208-2.791C-5.307,0.159-5.762,0.667-6.25,0.026c-0.127-0.167-0.172-0.534-0.226-0.732 C-6.811-0.622-7.312-1.351-7.42-1.242c-0.375,0.375-0.934-0.514-0.891-0.845c0.128-0.971-0.375-1.522,0.148-2.444 c0.793-1.392,1.738-2.674,3.156-3.475c0.827-0.467,2.369-1.355,3.358-1.085C-1.83-9.02-3.658-8.137-3.457-8.079 c0.175,0.052,0.582-0.202,0.69,0.064c0.003,0.118-0.025,0.225-0.089,0.323c0.203,0.299,1.448-0.978,1.707-1.078 c0.506-0.2,0.744,0.327,1.312,0.132c0.396-0.135,0.213,0.623,0.172,0.623c0.066,0,0.53-0.203,0.503,0.042 C0.77-7.379-1.377-8.058-1.604-7.367c-0.061,0.188,0.697-0.175,0.82-0.063c-0.051,0.083-0.109,0.16-0.173,0.236 c0.059,0.117,0.523,0.265,0.573,0.158C-0.434-6.93-1.781-6.76-2.012-6.664c-0.393,0.162-1.07,0.585-1.436,0.911 c-0.217,0.197-0.126,0.482-0.376,0.659c-0.274,0.194-0.561,0.381-0.811,0.608C-4.96-4.19-4.667-3.286-5.028-3.119 c0.102-0.047-0.356-1.584-0.97-0.84C-6.243-3.661-6.733-3.787-7.11-3.42c-0.335,0.327-0.454,0.969-0.391,1.412 c0.149,1.05,0.815-0.293,1.221-0.293c0.271,0-0.46,0.972-0.247,1.128C-6.086-0.85-5.801-1.399-5.96-0.417 c-0.236,1.433,2.149,0.1,2.071-0.053c0.112,0.226-0.282,0.441-0.009,0.629c0.11,0.075,0.096-0.386,0.17-0.464 c0.24-0.251,0.339,0.118,0.551,0.202c0.269,0.11,1.516,0.09,1.595,0.495c0.206,1.011,2.215,0.385,1.633,1.951 c0.065-0.041,0.134-0.066,0.208-0.078c0.485,0.127,0.933,0.55,1.366,0.498C2.539,2.651,3.563,3.32,2.82,4.227 M7.309,0.806 c-1.176-1.099-1.178-3.391-0.12-4.486c-0.12-0.761,0.75-0.87,1.163-0.548c0.3,0.23,0.628,0.978,0.741,1.332 c0.683,2.116,0.578,4.827-0.563,6.78C8.935,3.006,8.911,2.22,9.108,1.319C9.436-0.147,7.744,1.213,7.309,0.806');
		} else if (icon=='monochrome/dot') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','10');
		} else if (icon=='monochrome/page') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','-9,11 -9,-11 3,-11 9,-5 9,11');
			node.append('svg:polygon').attr('points','3,-9.5 3,-5 7.5,-5');
			node.append('svg:polygon').attr('points','-8,-10 2,-10 2,-4 8,-4 8,10 -8,10');

			node.append('svg:rect').attr('x','-6').attr('y','-8').attr('width','6').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','-5').attr('width','6').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','-2').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','7').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','4').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','1').attr('width','12').attr('height','1').attr('fill','#fff');
		} else if (icon=='monochrome/hierarchy') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('fill','#fff').attr('d','M8.574,4L3.527,0.971V-11h-7V0.939L-8.575,4H-11v7h22V4H8.574z');
			node.append('svg:polygon').attr('points','8.297,5 2.526,1.537 2.526,-2.5 0.651,-2.5 0.651,-5 2.526,-5 2.526,-10 -2.474,-10 -2.474,-5 -0.599,-5 -0.599,-2.5 -2.474,-2.5 -2.474,1.505 -8.298,5 -10,5 -10,10 -5,10 -5,5 -5.868,5 -1.702,2.5 -0.599,2.5 -0.599,5 -2.474,5 -2.474,10 2.526,10 2.526,5 0.651,5 0.651,2.5 1.702,2.5 5.869,5 5,5 5,10 10,10 10,5');
		} else if (icon=='monochrome/email') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('fill','#fff').attr('d','M10.727-1.695C10.727-7.086,6.645-11,1.02-11c-6.696,0-11.746,5.137-11.746,11.949 C-10.727,7.549-5.713,11-0.76,11c2.283,0,3.872-0.314,5.668-1.121L5.707,9.52L4.701,6.158C8.271,5.922,10.727,2.76,10.727-1.695z');
			node.append('svg:path').attr('d','M4.498,8.967C2.773,9.742,1.281,10-0.76,10c-4.771,0-8.967-3.418-8.967-9.051C-9.727-4.912-5.445-10,1.02-10 c5.086,0,8.707,3.479,8.707,8.305c0,4.225-2.355,6.869-5.459,6.869c-1.35,0-2.328-0.719-2.471-2.211H1.74 C0.82,4.398-0.445,5.174-1.996,5.174c-1.84,0-3.219-1.408-3.219-3.764c0-3.535,2.613-6.695,6.754-6.695 c1.262,0,2.699,0.314,3.391,0.688L4.066,0.748c-0.258,1.695-0.059,2.473,0.748,2.5c1.234,0.057,2.787-1.523,2.787-4.855 c0-3.766-2.414-6.639-6.867-6.639c-4.426,0-8.248,3.42-8.248,8.938c0,4.828,3.045,7.529,7.328,7.529 c1.467,0,3.045-0.318,4.193-0.893L4.498,8.967z M1.969-2.9C1.74-2.957,1.422-3.016,1.078-3.016c-1.898,0-3.391,1.867-3.391,4.08 c0,1.092,0.488,1.781,1.408,1.781c1.092,0,2.213-1.35,2.443-3.018L1.969-2.9z');
		} else {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','0.09,-11 -9.182,-11 -9.182,11 9.182,11 9.182,-1.909');
			node.append('svg:polygon').attr('points','0.91,-8.182 0.91,-2.727 6.365,-2.727');
			node.append('svg:polygon').attr('points','-8.182,-10 -0.91,-10 -0.91,-0.909 8.182,-0.909 8.182,10 -8.182,10');
		}
		
	}
}

/** @namespace */
hui.ui.Graph.Raphael = {
	init : function(parent) {
		this.parent = parent;
		hui.require(hui.ui.context+'/hui/lib/raphael-min.js',function() {
			hui.log('Raphael is loadd');
			this._extend();
			parent.implIsReady()
		}.bind(this));
	},
	_extend : function() {
		hui.log('Extending Raphael...')
		Raphael.fn.connection = function (obj1, obj2, line, bg, text) {
			if (obj1.line && obj1.from && obj1.to) {
				line = obj1;
				obj1 = line.from;
				obj2 = line.to;
			}
			var bb1 = obj1.getBBox(),
				bb2 = obj2.getBBox(),
				p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
				{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
				{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
				{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
				{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
				{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
				{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
				{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
				d = {}, dis = [];
			for (var i = 0; i < 4; i++) {
				for (var j = 4; j < 8; j++) {
					var dx = Math.abs(p[i].x - p[j].x),
						dy = Math.abs(p[i].y - p[j].y);
					if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
						dis.push(dx + dy);
						d[dis[dis.length - 1]] = [i, j];
					}
				}
			}
			if (dis.length == 0) {
				var res = [0, 4];
			} else {
				res = d[Math.min.apply(Math, dis)];
			}
			var x1 = p[res[0]].x,
				y1 = p[res[0]].y,
				x4 = p[res[1]].x,
				y4 = p[res[1]].y;
			dx = Math.max(Math.abs(x1 - x4) / 2, 10);
			dy = Math.max(Math.abs(y1 - y4) / 2, 10);
			var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
				y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
				x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
				y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
			var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
			if (line && line.line) {
				line.bg && line.bg.attr({path: path});
				line.line.attr({path: path});
				line.text.attr({x:x1+(x4-x1)/2,y:y4+(y1-y4)/2});
			} else {
				var color = typeof line == "string" ? line : "#000";
				return {
					line: this.path(path).attr({stroke: color, fill: "none", "stroke-width": 2, "stroke-opacity": .5}),
					from: obj1,
					to: obj2,
					text : this.text(x1+(x4-x1)/2, y4+(y1-y4)/2,text).attr({fill:'#fff'})
				};
			}
		}
	},

 	setData : function (data) {
		hui.log(data);
	    var dragger = function () {
	        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	        this.animate({"fill-opacity": .8}, 500);
	    },
        move = function (dx, dy) {
			var x = this.ox + dx,
				y = this.oy + dy;
            var att = this.type == "rect" ? {x: x, y: y} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
			this.text.attr({x:x+(this.getBBox().width/2),y:y+15});
            r.safari();
        },
        up = function () {
            this.animate({"fill-opacity": .1}, 500);
        },
		el = this.parent.element,
		width = el.clientWidth,
		height = el.clientHeight,
        r = Raphael(el, width, height),
        connections = [],
		shapes = [],
		idsToShape = {};
		for (var i=0; i < data.nodes.length; i++) {
			var node = data.nodes[i],
				left = Math.random()*(width-100)+50,
				top = Math.random()*(height-100)+50,
				shape = r.rect(left, top, 20, 30, 5),
				text = r.text(left,top+15,node.label),
				box = text.getBBox();
			text.attr({x:left+(box.width+20)/2,fill:'#fff'});
			shape.attr({width:box.width+20});
			shape.text = text;
			shapes.push(shape);
			idsToShape[node.id] = shape;
		};
	    for (var i = 0, ii = shapes.length; i < ii; i++) {
	        var color = "#fff";//Raphael.getColor();
	        shapes[i].attr({fill: "#559DFF", stroke: color, "fill-opacity": .1, "stroke-width": 2, cursor: "move"});
	        shapes[i].drag(move, dragger, up);
	    }
		
		for (var i=0; i < data.edges.length; i++) {
			var edge = data.edges[i];
			connections.push(r.connection(idsToShape[edge.from], idsToShape[edge.to], "#fff",null,edge.label));
		};
	}
}/** Grphviz viewer
 * @constructor
 */
hui.ui.Graphviz = function(element,name,options) {
		this.maxXdotVersion = 1.2;
		this.systemScale = 4/3;
		this.scale = 1;
		this.padding = 8;
		this.element = hui.get(element);
		this.texts = hui.get.firstByClass(this.element,'hui_graphviz_texts');
		this.canvas = hui.get.firstByTag(this.element,'canvas');
		this.ctx = this.canvas.getContext('2d');

		this.images = {};
		this.numImages = 0;
		this.numImagesFinished = 0;
		hui.ui.extend(this);
}

hui.ui.Graphviz.create = function(name,options) {
	var element = hui.build('div',{'class':'hui_graphviz'});
	var texts = hui.build('div',{'class':'hui_graphviz_texts',style:'position:relative;'});
	element.appendChild(texts);
	element.appendChild(hui.build('canvas'));
	return new hui.ui.Graphviz(element,name,options);
}

hui.ui.Graphviz.prototype = {
	setImagePath: function(imagePath) {
		this.imagePath = imagePath;
	},
	load: function(url) {
		var self = this;
		new hui.request({url:url,onSuccess:function(t) {self.parse(t)}});
	},
	zoom : function(zoom) {
		this.scale=this.scale*zoom;
		this.draw();
	},
	parse: function(request) {
		this.xdotversion = false;
		this.commands = new Array();
		this.width = 0;
		this.height = 0;
		this.maxWidth = false;
		this.maxHeight = false;
		this.bbEnlarge = false;
		this.bbScale = 1;
		this.orientation = 'portrait';
		this.bgcolor = '#ffffff';
		this.dashLength = 6;
		this.dotSpacing = 4;
		this.fontName = 'Times New Roman';
		this.fontSize = 14;
		var graph_src = request.responseText;
		var lines = graph_src.split('\n');
		var i = 0;
		var line, lastchar, matches, is_graph, entity, params, param_name, param_value;
		var container_stack = new Array();
		while (i < lines.length) {
			line = lines[i++].replace(/^\s+/, '');
			if ('' != line && '#' != line.substr(0, 1)) {
				while (i < lines.length && ';' != (lastchar = line.substr(line.length - 1, line.length)) && '{' != lastchar && '}' != lastchar) {
					if ('\\' == lastchar) {
						line = line.substr(0, line.length - 1);
					}
					line += lines[i++];
				}
				// hui.ui.Graphviz.debug(line);
				matches = line.match(/^(.*?)\s*{$/);
				if (matches) {
					container_stack.push(matches[1]);
					// hui.ui.Graphviz.debug('begin container ' + container_stack.last());
				} else if ('}' == line) {
					// hui.ui.Graphviz.debug('end container ' + container_stack.last());
					container_stack.pop();
				} else {
					// matches = line.match(/^(".*?[^\\]"|\S+?)\s+\[(.+)\];$/);
					matches = line.match(/^(.*?)\s+\[(.+)\];$/);
					if (matches) {
						is_graph = ('graph' == matches[1]);
						// entity = this.unescape(matches[1]);
						entity = matches[1];
						params = matches[2];
						do {
							matches = params.match(/^(\S+?)=(""|".*?[^\\]"|<(<[^>]+>|[^<>]+?)+>|\S+?)(?:,\s*|$)/);
							if (matches) {
								params = params.substr(matches[0].length);
								param_name = matches[1];
								param_value = this.unescape(matches[2]);
// hui.ui.Graphviz.debug(param_name + ' ' + param_value);
								if (is_graph && 1 == container_stack.length) {
									switch (param_name) {
										case 'bb':
											var bb = param_value.split(/,/);
											this.width  = Number(bb[2]);
											this.height = Number(bb[3]);
											break;
										case 'bgcolor':
											this.bgcolor = this.parseColor(param_value);
											break;
										case 'size':
											var size = param_value.match(/^(\d+|\d*(?:\.\d+)),\s*(\d+|\d*(?:\.\d+))(!?)$/);
											if (size) {
												this.maxWidth  = 72 * Number(size[1]);
												this.maxHeight = 72 * Number(size[2]);
												this.bbEnlarge = ('!' == size[3]);
											} else {
												hui.ui.Graphviz.debug('can\'t parse size');
											}
											break;
										case 'orientation':
											if (param_value.match(/^l/i)) {
												this.orientation = 'landscape';
											}
											break;
										case 'rotate':
											if (90 == param_value) {
												this.orientation = 'landscape';
											}
											break;
										case 'xdotversion':
											this.xdotversion = parseFloat(param_value);
											if (this.maxXdotVersion < this.xdotversion) {
												hui.ui.Graphviz.debug('unsupported xdotversion ' + this.xdotversion + '; this script currently supports up to xdotversion ' + this.maxXdotVersion);
											}
											break;
									}
								}
								switch (param_name) {
									case '_draw_':
									case '_ldraw_':
									case '_hdraw_':
									case '_tdraw_':
									case '_hldraw_':
									case '_tldraw_':
//										hui.ui.Graphviz.debug(entity + ': ' + param_value);
										this.commands.push(param_value);
										break;
								}
							}
						} while (matches);
					}
				}
			}
		}
		if (!this.xdotversion) {
			this.xdotversion = 1.0;
		}
/*
		if (this.maxWidth && this.maxHeight) {
			if (this.width > this.maxWidth || this.height > this.maxHeight || this.bbEnlarge) {
				this.bbScale = Math.min(this.maxWidth / this.width, this.maxHeight / this.height);
				this.width  = Math.round(this.width  * this.bbScale);
				this.height = Math.round(this.height * this.bbScale);
			}
			if ('landscape' == this.orientation) {
				var temp    = this.width;
				this.width  = this.height;
				this.height = temp;
			}
		}
*/
//		hui.ui.Graphviz.debug('done');
		this.draw();
	},
	draw: function(redraw_canvas) {
		if (!redraw_canvas) redraw_canvas = false;
		var width  = Math.round(this.scale * this.systemScale * this.width  + 2 * this.padding);
		var height = Math.round(this.scale * this.systemScale * this.height + 2 * this.padding);
		if (!redraw_canvas) {
			this.canvas.width  = width;
			this.canvas.height = height;
			this.canvas.style.width=width+'px';
			this.canvas.style.height=height+'px';
			this.element.style.width=width+'px';
			this.texts.innerHTML = '';
		}
		this.ctx.save();
		this.ctx.lineCap = 'round';
		this.ctx.fillStyle = this.bgcolor;
		this.ctx.fillRect(0, 0, width, height);
		this.ctx.translate(this.padding, this.padding);
		this.ctx.scale(this.scale * this.systemScale, this.scale * this.systemScale);
		this.ctx.lineWidth = 1 / this.systemScale;
		var i, tokens;
		var entity_id = 0;
		var text_divs = '';
		for (var command_index = 0; command_index < this.commands.length; command_index++) {
			var command = this.commands[command_index];
//			hui.ui.Graphviz.debug(command);
			var tokenizer = new hui.ui.Graphviz.Tokenizer(command);
			var token = tokenizer.takeChars();
			if (token) {
				++entity_id;
				var entity_text_divs = '';
				this.dashStyle = 'solid';
				this.ctx.save();
				while (token) {
//					hui.ui.Graphviz.debug('processing token ' + token);
					switch (token) {
						case 'E': // filled ellipse
						case 'e': // unfilled ellipse
							var filled = ('E' == token);
							var cx = tokenizer.takeNumber();
							var cy = this.height - tokenizer.takeNumber();
							var rx = tokenizer.takeNumber();
							var ry = tokenizer.takeNumber();
							this.render(new Ellipse(cx, cy, rx, ry), filled);
							break;
						case 'P': // filled polygon
						case 'p': // unfilled polygon
						case 'L': // polyline
							var filled = ('P' == token);
							var closed = ('L' != token);
							var num_points = tokenizer.takeNumber();
							tokens = tokenizer.takeNumber(2 * num_points); // points
							var path = new Path();
							for (i = 2; i < 2 * num_points; i += 2) {
								path.addBezier([
									new Point(tokens[i - 2], this.height - tokens[i - 1]),
									new Point(tokens[i],     this.height - tokens[i + 1])
								]);
							}
							if (closed) {
								path.addBezier([
									new Point(tokens[2 * num_points - 2], this.height - tokens[2 * num_points - 1]),
									new Point(tokens[0],                  this.height - tokens[1])
								]);
							}
							this.render(path, filled);
							break;
						case 'B': // unfilled b-spline
						case 'b': // filled b-spline
							var filled = ('b' == token);
							var num_points = tokenizer.takeNumber();
							tokens = tokenizer.takeNumber(2 * num_points); // points
							var path = new Path();
							for (i = 2; i < 2 * num_points; i += 6) {
								path.addBezier([
									new Point(tokens[i - 2], this.height - tokens[i - 1]),
									new Point(tokens[i],     this.height - tokens[i + 1]),
									new Point(tokens[i + 2], this.height - tokens[i + 3]),
									new Point(tokens[i + 4], this.height - tokens[i + 5])
								]);
							}
							this.render(path, filled);
							break;
						case 'I': // image
							var x = tokenizer.takeNumber();
							var y = this.height - tokenizer.takeNumber();
							var w = tokenizer.takeNumber();
							var h = tokenizer.takeNumber();
							var src = tokenizer.takeString();
							if (!this.images[src]) {
								y -= h;
								this.images[src] = new hui.ui.Graphviz.Image(this, src, x, y, w, h);
							}
							this.images[src].draw();
							break;
						case 'T': // text
							var x = Math.round(this.scale * this.systemScale * tokenizer.takeNumber() + this.padding);
							var y = Math.round(height - (this.scale * this.systemScale * (tokenizer.takeNumber() + this.bbScale * this.fontSize) + this.padding));
							var text_align = tokenizer.takeNumber();
							var text_width = Math.round(this.scale * this.systemScale * tokenizer.takeNumber());
							var str = tokenizer.takeString();
							if (!redraw_canvas && !str.match(/^\s*$/)) {
//								hui.ui.Graphviz.debug('draw text ' + str + ' ' + x + ' ' + y + ' ' + text_align + ' ' + text_width);
								str = hui.string.escapeHTML(str);
								do {
									matches = str.match(/ ( +)/);
									if (matches) {
										var spaces = ' ';
										matches[1].length.times(function() {
											spaces += '&nbsp;';
										});
										str = str.replace(/  +/, spaces);
									}
								} while (matches);
								entity_text_divs += '<div style="position: absolute; font:' + Math.round(this.fontSize * this.scale * this.systemScale * this.bbScale) + 'px \'' + this.fontName +'\';color:' + this.ctx.strokeStyle + ';';
								switch (text_align) {
									case -1: //left
										entity_text_divs += 'left:' + x + 'px;';
										break;
									case 1: // right
										entity_text_divs += 'text-align:right;right:' + x + 'px;';
										break;
									case 0: // center
									default:
										entity_text_divs += 'text-align:center;left:' + (x - text_width) + 'px;';
										break;
								}
								entity_text_divs += 'top:' + y + 'px;width:' + (2 * text_width) + 'px">' + str + '</div>';
							}
							break;
						case 'C': // set fill color
						case 'c': // set pen color
							var fill = ('C' == token);
							var color = this.parseColor(tokenizer.takeString());
							if (fill) {
								this.ctx.fillStyle = color;
							} else {
								this.ctx.strokeStyle = color;
							}
							break;
						case 'F': // set font
							this.fontSize = tokenizer.takeNumber();
							this.fontName = tokenizer.takeString();
							switch (this.fontName) {
								case 'Times-Roman':
									this.fontName = 'Times New Roman';
									break;
								case 'Courier':
									this.fontName = 'Courier New';
									break;
								case 'Helvetica':
									this.fontName = 'Arial';
									break;
								default:
									// nothing
							}
//							hui.ui.Graphviz.debug('set font ' + this.fontSize + 'pt ' + this.fontName);
							break;
						case 'S': // set style
							var style = tokenizer.takeString();
							switch (style) {
								case 'solid':
								case 'filled':
									// nothing
									break;
								case 'dashed':
								case 'dotted':
									this.dashStyle = style;
									break;
								case 'bold':
									this.ctx.lineWidth = 2 / this.systemScale;
									break;
								default:
									matches = style.match(/^setlinewidth\((.*)\)$/);
									if (matches) {
										this.ctx.lineWidth = Number(matches[1]) / this.systemScale;
									} else {
										hui.ui.Graphviz.debug('unknown style ' + style);
									}
							}
							break;
						default:
							hui.ui.Graphviz.debug('unknown token ' + token);
							return;
					}
					token = tokenizer.takeChars();
				}
				this.ctx.restore();
				if (entity_text_divs) {
					text_divs += '<div id="entity' + entity_id + '">' + entity_text_divs + '</div>';
				}
			}
		};
		this.ctx.restore();
		if (!redraw_canvas) this.texts.innerHTML = text_divs;
	},
	render: function(path, filled) {
		if (filled) {
			this.ctx.beginPath();
			path.draw(this.ctx);
			this.ctx.fill();
		}
		if (this.ctx.fillStyle != this.ctx.strokeStyle || !filled) {
			switch (this.dashStyle) {
				case 'dashed':
					this.ctx.beginPath();
					path.drawDashed(this.ctx, this.dashLength);
					break;
				case 'dotted':
					var oldLineWidth = this.ctx.lineWidth;
					this.ctx.lineWidth *= 2;
					this.ctx.beginPath();
					path.drawDotted(this.ctx, this.dotSpacing);
					break;
				case 'solid':
				default:
					if (!filled) {
						this.ctx.beginPath();
						path.draw(this.ctx);
					}
			}
			this.ctx.stroke();
			if (oldLineWidth) this.ctx.lineWidth = oldLineWidth;
		}
	},
	unescape: function(str) {
		var matches = str.match(/^"(.*)"$/);
		if (matches) {
			return matches[1].replace(/\\"/g, '"');
		} else {
			return str;
		}
	},
	parseColor: function(color) {
		if (hui.ui.Graphviz.colors[color]) { // named color
			return 'rgb(' + hui.ui.Graphviz.colors[color][0] + ',' + hui.ui.Graphviz.colors[color][1] + ',' + hui.ui.Graphviz.colors[color][2] + ')';
		} else {
			var matches = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
			if (matches) { // rgba
				return 'rgba(' + parseInt(matches[1], 16) + ',' + parseInt(matches[2], 16) + ',' + parseInt(matches[3], 16) + ',' + (parseInt(matches[4], 16) / 255) + ')';
			} else {
				matches = color.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/);
				if (matches) { // hsv
					return this.hsvToRgbColor(matches[1], matches[2], matches[3]);
				} else if (color.match(/^#[0-9a-f]{6}$/i)) {
					return color;
				}
			}
		}
		hui.ui.Graphviz.debug('unknown color ' + color);
		return '#000000';
	},
	hsvToRgbColor: function(h, s, v) {
		var i, f, p, q, t, r, g, b;
		h *= 360;
		i = Math.floor(h / 60) % 6;
		f = h / 60 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s)
		switch (i) {
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}
		return 'rgb(' + Math.round(255 * r) + ',' + Math.round(255 * g) + ',' + Math.round(255 * b) + ')';
	}
}


hui.ui.Graphviz.Image = function(graph, src, x, y, w, h) {
		this.graph = graph;
		++this.graph.numImages;
		this.src = this.graph.imagePath + '/' + src;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.loaded = false;
		this.img = new Image();
		this.img.onload = this.succeeded.bind(this);
		this.img.onerror = this.finished.bind(this);
		this.img.onabort = this.finished.bind(this);
		this.img.src = this.src;
	}
	
hui.ui.Graphviz.Image.prototype = {
	succeeded: function() {
		this.loaded = true;
		this.finished();
	},
	finished: function() {
		++this.graph.numImagesFinished;
		if (this.graph.numImages == this.graph.numImagesFinished) {
			this.graph.draw(true);
		}
	},
	draw: function() {
		if (this.loaded) {
			this.graph.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		}
	}
}

hui.ui.Graphviz.debug = function(str) {
	hui.log(str);
}


hui.ui.Graphviz.Tokenizer = function(str) {
		this.str = str;
}

hui.ui.Graphviz.Tokenizer.prototype = {
	takeChars: function(num) {
		if (!num) {
			num = 1;
		}
		var tokens = new Array();
		while (num--) {
			var matches = this.str.match(/^(\S+)\s*/);
			if (matches) {
				this.str = this.str.substr(matches[0].length);
				tokens.push(matches[1]);
			} else {
				tokens.push(false);
			}
		}
		if (1 == tokens.length) {
			return tokens[0];
		} else {
			return tokens;
		}
	},
	takeNumber: function(num) {
		if (!num) {
			num = 1;
		}
		if (1 == num) {
			return Number(this.takeChars())
		} else {
			var tokens = this.takeChars(num);
			while (num--) {
				tokens[num] = Number(tokens[num]);
			}
			return tokens;
		}
	},
	takeString: function() {
		var chars = Number(this.takeChars());
		if ('-' != this.str.charAt(0)) {
			return false;
		}
		var str = this.str.substr(1, chars);
		this.str = this.str.substr(1 + chars).replace(/^\s+/, '');
		return str;
	}
}

function Point(x, y) {
		this.x = x;
		this.y = y;
	}

Point.prototype = {
	offset: function(dx, dy) {
		this.x += dx;
		this.y += dy;
	},
	distanceFrom: function(point) {
		var dx = this.x - point.x;
		var dy = this.y - point.y;
		return Math.sqrt(dx * dx + dy * dy);
	},
	draw: function(ctx) {
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + 0.001, this.y);
	}
}

function Bezier(points) {
		this.points = points;
		this.order = points.length;
}
Bezier.prototype = {
	reset: function() {
		with (Bezier.prototype) {
			this.controlPolygonLength = controlPolygonLength;
			this.chordLength = chordLength;
			this.triangle = triangle;
			this.chordPoints = chordPoints;
			this.coefficients = coefficients;
		}
	},
	offset: function(dx, dy) {
		this.points.each(function(point) {
			point.offset(dx, dy);
		});
		this.reset();
	},
	// Based on Oliver Steele's bezier.js library.
	controlPolygonLength: function() {
		var len = 0;
		for (var i = 1; i < this.order; ++i) {
			len += this.points[i - 1].distanceFrom(this.points[i]);
		}
		return (this.controlPolygonLength = function() {return len;})();
	},
	// Based on Oliver Steele's bezier.js library.
	chordLength: function() {
		var len = this.points[0].distanceFrom(this.points[this.order - 1]);
		return (this.chordLength = function() {return len;})();
	},
	// From Oliver Steele's bezier.js library.
	triangle: function() {
		var upper = this.points;
		var m = [upper]
		for (var i = 1; i < this.order; ++i) {
			var lower = [];
			for (var j = 0; j < this.order - i; ++j) {
				var c0 = upper[j];
				var c1 = upper[j + 1];
				lower[j] = new Point((c0.x + c1.x) / 2, (c0.y + c1.y) / 2);
			}
			m.push(lower);
			upper = lower;
		}
		return (this.triangle = function() {return m;})();
	},
	// Based on Oliver Steele's bezier.js library.
	triangleAtT: function(t) {
		var s = 1 - t;
		var upper = this.points;
		var m = [upper]
		for (var i = 1; i < this.order; ++i) {
			var lower = [];
			for (var j = 0; j < this.order - i; ++j) {
				var c0 = upper[j];
				var c1 = upper[j + 1];
				lower[j] = new Point(c0.x * s + c1.x * t, c0.y * s + c1.y * t);
			}
			m.push(lower);
			upper = lower;
		}
		return m;
	},
	// Returns two beziers resulting from splitting this bezier at t=0.5.
	// Based on Oliver Steele's bezier.js library.
	split: function(t) {
		if ('undefined' == typeof t) t = 0.5;
		var m = (0.5 == t) ? this.triangle() : this.triangleAtT(t);
		var leftPoints  = new Array(this.order);
		var rightPoints = new Array(this.order);
		for (var i = 0; i < this.order; ++i) {
			leftPoints[i]  = m[i][0];
			rightPoints[i] = m[this.order - 1 - i][i];
		}
		return {left: new Bezier(leftPoints), right: new Bezier(rightPoints)};
	},
	// Returns a bezier which is the portion of this bezier from t1 to t2.
	// Thanks to Peter Zin on comp.graphics.algorithms.
	mid: function(t1, t2) {
		return this.split(t2).left.split(t1 / t2).right;
	},
	// Returns points (and their corresponding times in the bezier) that form
	// an approximate polygonal representation of the bezier.
	// Based on the algorithm described in Jeremy Gibbons' dashed.ps.gz
	chordPoints: function() {
		var p = [{tStart: 0, tEnd: 0, dt: 0, p: this.points[0]}].concat(this._chordPoints(0, 1));
		return (this.chordPoints = function() {return p;})();
	},
	_chordPoints: function(tStart, tEnd) {
		var tolerance = 0.001;
		var dt = tEnd - tStart;
		if (this.controlPolygonLength() <= (1 + tolerance) * this.chordLength()) {
			return [{tStart: tStart, tEnd: tEnd, dt: dt, p: this.points[this.order - 1]}];
		} else {
			var tMid = tStart + dt / 2;
			var halves = this.split();
			return halves.left._chordPoints(tStart, tMid).concat(halves.right._chordPoints(tMid, tEnd));
		}
	},
	// Returns an array of times between 0 and 1 that mark the bezier evenly
	// in space.
	// Based in part on the algorithm described in Jeremy Gibbons' dashed.ps.gz
	markedEvery: function(distance, firstDistance) {
		var nextDistance = firstDistance || distance;
		var segments = this.chordPoints();
		var times = [];
		var t = 0; // time
		var dt; // delta t
		var segment;
		var remainingDistance;
		for (var i = 1; i < segments.length; ++i) {
			segment = segments[i];
			segment.length = segment.p.distanceFrom(segments[i - 1].p);
			if (0 == segment.length) {
				t += segment.dt;
			} else {
				dt = nextDistance / segment.length * segment.dt;
				segment.remainingLength = segment.length;
				while (segment.remainingLength >= nextDistance) {
					segment.remainingLength -= nextDistance;
					t += dt;
					times.push(t);
					if (distance != nextDistance) {
						nextDistance = distance;
						dt = nextDistance / segment.length * segment.dt;
					}
				}
				nextDistance -= segment.remainingLength;
				t = segment.tEnd;
			}
		}
		return {times: times, nextDistance: nextDistance};
	},
	// Return the coefficients of the polynomials for x and y in t.
	// From Oliver Steele's bezier.js library.
	coefficients: function() {
		// This function deals with polynomials, represented as
		// arrays of coefficients.  p[i] is the coefficient of n^i.
		
		// p0, p1 => p0 + (p1 - p0) * n
		// side-effects (denormalizes) p0, for convienence
		function interpolate(p0, p1) {
			p0.push(0);
			var p = new Array(p0.length);
			p[0] = p0[0];
			for (var i = 0; i < p1.length; ++i) {
				p[i + 1] = p0[i + 1] + p1[i] - p0[i];
			}
			return p;
		}
		// folds +interpolate+ across a graph whose fringe is
		// the polynomial elements of +ns+, and returns its TOP
		function collapse(ns) {
			while (ns.length > 1) {
				var ps = new Array(ns.length-1);
				for (var i = 0; i < ns.length - 1; ++i) {
					ps[i] = interpolate(ns[i], ns[i + 1]);
				}
				ns = ps;
			}
			return ns[0];
		}
		// xps and yps are arrays of polynomials --- concretely realized
		// as arrays of arrays
		var xps = [];
		var yps = [];
		for (var i = 0, pt; pt = this.points[i++]; ) {
			xps.push([pt.x]);
			yps.push([pt.y]);
		}
		var result = {xs: collapse(xps), ys: collapse(yps)};
		return (this.coefficients = function() {return result;})();
	},
	// Return the point at time t.
	// From Oliver Steele's bezier.js library.
	pointAtT: function(t) {
		var c = this.coefficients();
		var cx = c.xs, cy = c.ys;
		// evaluate cx[0] + cx[1]t +cx[2]t^2 ....
		
		// optimization: start from the end, to save one
		// muliplicate per order (we never need an explicit t^n)
		
		// optimization: special-case the last element
		// to save a multiply-add
		var x = cx[cx.length - 1], y = cy[cy.length - 1];
		
		for (var i = cx.length - 1; --i >= 0; ) {
			x = x * t + cx[i];
			y = y * t + cy[i];
		}
		return new Point(x, y);
	},
	// Render the Bezier to a WHATWG 2D canvas context.
	// Based on Oliver Steele's bezier.js library.
	draw: function (ctx, moveTo) {
		if ('undefined' == typeof moveTo) moveTo = true;
		if (moveTo) ctx.moveTo(this.points[0].x, this.points[0].y);
		var fn = this.drawCommands[this.order];
		if (fn) {
			var coords = [];
			for (var i = 1 == this.order ? 0 : 1; i < this.points.length; ++i) {
				coords.push(this.points[i].x);
				coords.push(this.points[i].y);
			}
			fn.apply(ctx, coords);
		}
	},
	// Wrapper functions to work around Safari, in which, up to at least 2.0.3,
	// fn.apply isn't defined on the context primitives.
	// Based on Oliver Steele's bezier.js library.
	drawCommands: [
		null,
		// This will have an effect if there's a line thickness or end cap.
		function(x, y) {
			this.lineTo(x + 0.001, y);
		},
		function(x, y) {
			this.lineTo(x, y);
		},
		function(x1, y1, x2, y2) {
			this.quadraticCurveTo(x1, y1, x2, y2);
		},
		function(x1, y1, x2, y2, x3, y3) {
			this.bezierCurveTo(x1, y1, x2, y2, x3, y3);
		}
	],
	drawDashed: function(ctx, dashLength, firstDistance, drawFirst) {
		if (!firstDistance) firstDistance = dashLength;
		if ('undefined' == typeof drawFirst) drawFirst = true;
		var markedEvery = this.markedEvery(dashLength, firstDistance);
		if (drawFirst) markedEvery.times.unshift(0);
		var drawLast = (markedEvery.times.length % 2);
		if (drawLast) markedEvery.times.push(1);
		for (var i = 1; i < markedEvery.times.length; i += 2) {
			this.mid(markedEvery.times[i - 1], markedEvery.times[i]).draw(ctx);
		}
		return {firstDistance: markedEvery.nextDistance, drawFirst: drawLast};
	},
	drawDotted: function(ctx, dotSpacing, firstDistance) {
		if (!firstDistance) firstDistance = dotSpacing;
		var markedEvery = this.markedEvery(dotSpacing, firstDistance);
		if (dotSpacing == firstDistance) markedEvery.times.unshift(0);
		markedEvery.times.each(function(t) {
			this.pointAtT(t).draw(ctx);
		}.bind(this));
		return markedEvery.nextDistance;
	}
}

function Path(segments) {
	this.segments = segments || [];
}

Path.prototype = {
	// Based on Oliver Steele's bezier.js library.
	addBezier: function(pointsOrBezier) {
		this.segments.push(pointsOrBezier instanceof Array ? new Bezier(pointsOrBezier) : pointsOrBezier);
	},
	offset: function(dx, dy) {
		this.segments.each(function(segment) {
			segment.offset(dx, dy);
		});
	},
	// Based on Oliver Steele's bezier.js library.
	draw: function(ctx) {
		var moveTo = true;
		for (var i=0; i < this.segments.length; i++) {
			this.segments[i].draw(ctx, moveTo);
			moveTo = false;
		};
		/*
		this.segments.each(function(segment) {
			segment.draw(ctx, moveTo);
			moveTo = false;
		});*/
	},
	drawDashed: function(ctx, dashLength, firstDistance, drawFirst) {
		var info = {
			drawFirst: ('undefined' == typeof drawFirst) ? true : drawFirst,
			firstDistance: firstDistance || dashLength
		};
		this.segments.each(function(segment) {
			info = segment.drawDashed(ctx, dashLength, info.firstDistance, info.drawFirst);
		});
	},
	drawDotted: function(ctx, dotSpacing, firstDistance) {
		if (!firstDistance) firstDistance = dotSpacing;
		for (var i=0; i < this.segments.length; i++) {
			this.segments[i].drawDotted(ctx, dotSpacing, firstDistance);
		};
		/**
		this.segments.each(function(segment) {
			firstDistance = segment.drawDotted(ctx, dotSpacing, firstDistance);
		});*/
	}
}

//var Ellipse = Class.create();
function Ellipse(cx, cy, rx, ry) {
		this.cx = cx; // center x
		this.cy = cy; // center y
		this.rx = rx; // radius x
		this.ry = ry; // radius y
		this.segments = [
			new Bezier([
				new Point(cx, cy - ry),
				new Point(cx + this.KAPPA * rx, cy - ry),
				new Point(cx + rx, cy - this.KAPPA * ry),
				new Point(cx + rx, cy)
			]),
			new Bezier([
				new Point(cx + rx, cy),
				new Point(cx + rx, cy + this.KAPPA * ry),
				new Point(cx + this.KAPPA * rx, cy + ry),
				new Point(cx, cy + ry)
			]),
			new Bezier([
				new Point(cx, cy + ry),
				new Point(cx - this.KAPPA * rx, cy + ry),
				new Point(cx - rx, cy + this.KAPPA * ry),
				new Point(cx - rx, cy)
			]),
			new Bezier([
				new Point(cx - rx, cy),
				new Point(cx - rx, cy - this.KAPPA * ry),
				new Point(cx - this.KAPPA * rx, cy - ry),
				new Point(cx, cy - ry)
			])
		];
}

Ellipse.prototype = new Path();
Ellipse.prototype.KAPPA=0.5522847498;

hui.ui.Graphviz.colors={
	aliceblue:[240,248,255],
	antiquewhite:[250,235,215],
	antiquewhite1:[255,239,219],
	antiquewhite2:[238,223,204],
	antiquewhite3:[205,192,176],
	antiquewhite4:[139,131,120],
	aquamarine:[127,255,212],
	aquamarine1:[127,255,212],
	aquamarine2:[118,238,198],
	aquamarine3:[102,205,170],
	aquamarine4:[69,139,116],
	azure:[240,255,255],
	azure1:[240,255,255],
	azure2:[224,238,238],
	azure3:[193,205,205],
	azure4:[131,139,139],
	beige:[245,245,220],
	bisque:[255,228,196],
	bisque1:[255,228,196],
	bisque2:[238,213,183],
	bisque3:[205,183,158],
	bisque4:[139,125,107],
	black:[0,0,0],
	blanchedalmond:[255,235,205],
	blue:[0,0,255],
	blue1:[0,0,255],
	blue2:[0,0,238],
	blue3:[0,0,205],
	blue4:[0,0,139],
	blueviolet:[138,43,226],
	brown:[165,42,42],
	brown1:[255,64,64],
	brown2:[238,59,59],
	brown3:[205,51,51],
	brown4:[139,35,35],
	burlywood:[222,184,135],
	burlywood1:[255,211,155],
	burlywood2:[238,197,145],
	burlywood3:[205,170,125],
	burlywood4:[139,115,85],
	cadetblue:[95,158,160],
	cadetblue1:[152,245,255],
	cadetblue2:[142,229,238],
	cadetblue3:[122,197,205],
	cadetblue4:[83,134,139],
	chartreuse:[127,255,0],
	chartreuse1:[127,255,0],
	chartreuse2:[118,238,0],
	chartreuse3:[102,205,0],
	chartreuse4:[69,139,0],
	chocolate:[210,105,30],
	chocolate1:[255,127,36],
	chocolate2:[238,118,33],
	chocolate3:[205,102,29],
	chocolate4:[139,69,19],
	coral:[255,127,80],
	coral1:[255,114,86],
	coral2:[238,106,80],
	coral3:[205,91,69],
	coral4:[139,62,47],
	cornflowerblue:[100,149,237],
	cornsilk:[255,248,220],
	cornsilk1:[255,248,220],
	cornsilk2:[238,232,205],
	cornsilk3:[205,200,177],
	cornsilk4:[139,136,120],
	crimson:[220,20,60],
	cyan:[0,255,255],
	cyan1:[0,255,255],
	cyan2:[0,238,238],
	cyan3:[0,205,205],
	cyan4:[0,139,139],
	darkgoldenrod:[184,134,11],
	darkgoldenrod1:[255,185,15],
	darkgoldenrod2:[238,173,14],
	darkgoldenrod3:[205,149,12],
	darkgoldenrod4:[139,101,8],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkolivegreen:[85,107,47],
	darkolivegreen1:[202,255,112],
	darkolivegreen2:[188,238,104],
	darkolivegreen3:[162,205,90],
	darkolivegreen4:[110,139,61],
	darkorange:[255,140,0],
	darkorange1:[255,127,0],
	darkorange2:[238,118,0],
	darkorange3:[205,102,0],
	darkorange4:[139,69,0],
	darkorchid:[153,50,204],
	darkorchid1:[191,62,255],
	darkorchid2:[178,58,238],
	darkorchid3:[154,50,205],
	darkorchid4:[104,34,139],
	darksalmon:[233,150,122],
	darkseagreen:[143,188,143],
	darkseagreen1:[193,255,193],
	darkseagreen2:[180,238,180],
	darkseagreen3:[155,205,155],
	darkseagreen4:[105,139,105],
	darkslateblue:[72,61,139],
	darkslategray:[47,79,79],
	darkslategray1:[151,255,255],
	darkslategray2:[141,238,238],
	darkslategray3:[121,205,205],
	darkslategray4:[82,139,139],
	darkslategrey:[47,79,79],
	darkturquoise:[0,206,209],
	darkviolet:[148,0,211],
	deeppink:[255,20,147],
	deeppink1:[255,20,147],
	deeppink2:[238,18,137],
	deeppink3:[205,16,118],
	deeppink4:[139,10,80],
	deepskyblue:[0,191,255],
	deepskyblue1:[0,191,255],
	deepskyblue2:[0,178,238],
	deepskyblue3:[0,154,205],
	deepskyblue4:[0,104,139],
	dimgray:[105,105,105],
	dimgrey:[105,105,105],
	dodgerblue:[30,144,255],
	dodgerblue1:[30,144,255],
	dodgerblue2:[28,134,238],
	dodgerblue3:[24,116,205],
	dodgerblue4:[16,78,139],
	firebrick:[178,34,34],
	firebrick1:[255,48,48],
	firebrick2:[238,44,44],
	firebrick3:[205,38,38],
	firebrick4:[139,26,26],
	floralwhite:[255,250,240],
	forestgreen:[34,139,34],
	gainsboro:[220,220,220],
	ghostwhite:[248,248,255],
	gold:[255,215,0],
	gold1:[255,215,0],
	gold2:[238,201,0],
	gold3:[205,173,0],
	gold4:[139,117,0],
	goldenrod:[218,165,32],
	goldenrod1:[255,193,37],
	goldenrod2:[238,180,34],
	goldenrod3:[205,155,29],
	goldenrod4:[139,105,20],
	gray:[192,192,192],
	gray0:[0,0,0],
	gray1:[3,3,3],
	gray10:[26,26,26],
	gray100:[255,255,255],
	gray11:[28,28,28],
	gray12:[31,31,31],
	gray13:[33,33,33],
	gray14:[36,36,36],
	gray15:[38,38,38],
	gray16:[41,41,41],
	gray17:[43,43,43],
	gray18:[46,46,46],
	gray19:[48,48,48],
	gray2:[5,5,5],
	gray20:[51,51,51],
	gray21:[54,54,54],
	gray22:[56,56,56],
	gray23:[59,59,59],
	gray24:[61,61,61],
	gray25:[64,64,64],
	gray26:[66,66,66],
	gray27:[69,69,69],
	gray28:[71,71,71],
	gray29:[74,74,74],
	gray3:[8,8,8],
	gray30:[77,77,77],
	gray31:[79,79,79],
	gray32:[82,82,82],
	gray33:[84,84,84],
	gray34:[87,87,87],
	gray35:[89,89,89],
	gray36:[92,92,92],
	gray37:[94,94,94],
	gray38:[97,97,97],
	gray39:[99,99,99],
	gray4:[10,10,10],
	gray40:[102,102,102],
	gray41:[105,105,105],
	gray42:[107,107,107],
	gray43:[110,110,110],
	gray44:[112,112,112],
	gray45:[115,115,115],
	gray46:[117,117,117],
	gray47:[120,120,120],
	gray48:[122,122,122],
	gray49:[125,125,125],
	gray5:[13,13,13],
	gray50:[127,127,127],
	gray51:[130,130,130],
	gray52:[133,133,133],
	gray53:[135,135,135],
	gray54:[138,138,138],
	gray55:[140,140,140],
	gray56:[143,143,143],
	gray57:[145,145,145],
	gray58:[148,148,148],
	gray59:[150,150,150],
	gray6:[15,15,15],
	gray60:[153,153,153],
	gray61:[156,156,156],
	gray62:[158,158,158],
	gray63:[161,161,161],
	gray64:[163,163,163],
	gray65:[166,166,166],
	gray66:[168,168,168],
	gray67:[171,171,171],
	gray68:[173,173,173],
	gray69:[176,176,176],
	gray7:[18,18,18],
	gray70:[179,179,179],
	gray71:[181,181,181],
	gray72:[184,184,184],
	gray73:[186,186,186],
	gray74:[189,189,189],
	gray75:[191,191,191],
	gray76:[194,194,194],
	gray77:[196,196,196],
	gray78:[199,199,199],
	gray79:[201,201,201],
	gray8:[20,20,20],
	gray80:[204,204,204],
	gray81:[207,207,207],
	gray82:[209,209,209],
	gray83:[212,212,212],
	gray84:[214,214,214],
	gray85:[217,217,217],
	gray86:[219,219,219],
	gray87:[222,222,222],
	gray88:[224,224,224],
	gray89:[227,227,227],
	gray9:[23,23,23],
	gray90:[229,229,229],
	gray91:[232,232,232],
	gray92:[235,235,235],
	gray93:[237,237,237],
	gray94:[240,240,240],
	gray95:[242,242,242],
	gray96:[245,245,245],
	gray97:[247,247,247],
	gray98:[250,250,250],
	gray99:[252,252,252],
	green:[0,255,0],
	green1:[0,255,0],
	green2:[0,238,0],
	green3:[0,205,0],
	green4:[0,139,0],
	greenyellow:[173,255,47],
	grey:[192,192,192],
	grey0:[0,0,0],
	grey1:[3,3,3],
	grey10:[26,26,26],
	grey100:[255,255,255],
	grey11:[28,28,28],
	grey12:[31,31,31],
	grey13:[33,33,33],
	grey14:[36,36,36],
	grey15:[38,38,38],
	grey16:[41,41,41],
	grey17:[43,43,43],
	grey18:[46,46,46],
	grey19:[48,48,48],
	grey2:[5,5,5],
	grey20:[51,51,51],
	grey21:[54,54,54],
	grey22:[56,56,56],
	grey23:[59,59,59],
	grey24:[61,61,61],
	grey25:[64,64,64],
	grey26:[66,66,66],
	grey27:[69,69,69],
	grey28:[71,71,71],
	grey29:[74,74,74],
	grey3:[8,8,8],
	grey30:[77,77,77],
	grey31:[79,79,79],
	grey32:[82,82,82],
	grey33:[84,84,84],
	grey34:[87,87,87],
	grey35:[89,89,89],
	grey36:[92,92,92],
	grey37:[94,94,94],
	grey38:[97,97,97],
	grey39:[99,99,99],
	grey4:[10,10,10],
	grey40:[102,102,102],
	grey41:[105,105,105],
	grey42:[107,107,107],
	grey43:[110,110,110],
	grey44:[112,112,112],
	grey45:[115,115,115],
	grey46:[117,117,117],
	grey47:[120,120,120],
	grey48:[122,122,122],
	grey49:[125,125,125],
	grey5:[13,13,13],
	grey50:[127,127,127],
	grey51:[130,130,130],
	grey52:[133,133,133],
	grey53:[135,135,135],
	grey54:[138,138,138],
	grey55:[140,140,140],
	grey56:[143,143,143],
	grey57:[145,145,145],
	grey58:[148,148,148],
	grey59:[150,150,150],
	grey6:[15,15,15],
	grey60:[153,153,153],
	grey61:[156,156,156],
	grey62:[158,158,158],
	grey63:[161,161,161],
	grey64:[163,163,163],
	grey65:[166,166,166],
	grey66:[168,168,168],
	grey67:[171,171,171],
	grey68:[173,173,173],
	grey69:[176,176,176],
	grey7:[18,18,18],
	grey70:[179,179,179],
	grey71:[181,181,181],
	grey72:[184,184,184],
	grey73:[186,186,186],
	grey74:[189,189,189],
	grey75:[191,191,191],
	grey76:[194,194,194],
	grey77:[196,196,196],
	grey78:[199,199,199],
	grey79:[201,201,201],
	grey8:[20,20,20],
	grey80:[204,204,204],
	grey81:[207,207,207],
	grey82:[209,209,209],
	grey83:[212,212,212],
	grey84:[214,214,214],
	grey85:[217,217,217],
	grey86:[219,219,219],
	grey87:[222,222,222],
	grey88:[224,224,224],
	grey89:[227,227,227],
	grey9:[23,23,23],
	grey90:[229,229,229],
	grey91:[232,232,232],
	grey92:[235,235,235],
	grey93:[237,237,237],
	grey94:[240,240,240],
	grey95:[242,242,242],
	grey96:[245,245,245],
	grey97:[247,247,247],
	grey98:[250,250,250],
	grey99:[252,252,252],
	honeydew:[240,255,240],
	honeydew1:[240,255,240],
	honeydew2:[224,238,224],
	honeydew3:[193,205,193],
	honeydew4:[131,139,131],
	hotpink:[255,105,180],
	hotpink1:[255,110,180],
	hotpink2:[238,106,167],
	hotpink3:[205,96,144],
	hotpink4:[139,58,98],
	indianred:[205,92,92],
	indianred1:[255,106,106],
	indianred2:[238,99,99],
	indianred3:[205,85,85],
	indianred4:[139,58,58],
	indigo:[75,0,130],
	ivory:[255,255,240],
	ivory1:[255,255,240],
	ivory2:[238,238,224],
	ivory3:[205,205,193],
	ivory4:[139,139,131],
	khaki:[240,230,140],
	khaki1:[255,246,143],
	khaki2:[238,230,133],
	khaki3:[205,198,115],
	khaki4:[139,134,78],
	lavender:[230,230,250],
	lavenderblush:[255,240,245],
	lavenderblush1:[255,240,245],
	lavenderblush2:[238,224,229],
	lavenderblush3:[205,193,197],
	lavenderblush4:[139,131,134],
	lawngreen:[124,252,0],
	lemonchiffon:[255,250,205],
	lemonchiffon1:[255,250,205],
	lemonchiffon2:[238,233,191],
	lemonchiffon3:[205,201,165],
	lemonchiffon4:[139,137,112],
	lightblue:[173,216,230],
	lightblue1:[191,239,255],
	lightblue2:[178,223,238],
	lightblue3:[154,192,205],
	lightblue4:[104,131,139],
	lightcoral:[240,128,128],
	lightcyan:[224,255,255],
	lightcyan1:[224,255,255],
	lightcyan2:[209,238,238],
	lightcyan3:[180,205,205],
	lightcyan4:[122,139,139],
	lightgoldenrod:[238,221,130],
	lightgoldenrod1:[255,236,139],
	lightgoldenrod2:[238,220,130],
	lightgoldenrod3:[205,190,112],
	lightgoldenrod4:[139,129,76],
	lightgoldenrodyellow:[250,250,210],
	lightgray:[211,211,211],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightpink1:[255,174,185],
	lightpink2:[238,162,173],
	lightpink3:[205,140,149],
	lightpink4:[139,95,101],
	lightsalmon:[255,160,122],
	lightsalmon1:[255,160,122],
	lightsalmon2:[238,149,114],
	lightsalmon3:[205,129,98],
	lightsalmon4:[139,87,66],
	lightseagreen:[32,178,170],
	lightskyblue:[135,206,250],
	lightskyblue1:[176,226,255],
	lightskyblue2:[164,211,238],
	lightskyblue3:[141,182,205],
	lightskyblue4:[96,123,139],
	lightslateblue:[132,112,255],
	lightslategray:[119,136,153],
	lightslategrey:[119,136,153],
	lightsteelblue:[176,196,222],
	lightsteelblue1:[202,225,255],
	lightsteelblue2:[188,210,238],
	lightsteelblue3:[162,181,205],
	lightsteelblue4:[110,123,139],
	lightyellow:[255,255,224],
	lightyellow1:[255,255,224],
	lightyellow2:[238,238,209],
	lightyellow3:[205,205,180],
	lightyellow4:[139,139,122],
	limegreen:[50,205,50],
	linen:[250,240,230],
	magenta:[255,0,255],
	magenta1:[255,0,255],
	magenta2:[238,0,238],
	magenta3:[205,0,205],
	magenta4:[139,0,139],
	maroon:[176,48,96],
	maroon1:[255,52,179],
	maroon2:[238,48,167],
	maroon3:[205,41,144],
	maroon4:[139,28,98],
	mediumaquamarine:[102,205,170],
	mediumblue:[0,0,205],
	mediumorchid:[186,85,211],
	mediumorchid1:[224,102,255],
	mediumorchid2:[209,95,238],
	mediumorchid3:[180,82,205],
	mediumorchid4:[122,55,139],
	mediumpurple:[147,112,219],
	mediumpurple1:[171,130,255],
	mediumpurple2:[159,121,238],
	mediumpurple3:[137,104,205],
	mediumpurple4:[93,71,139],
	mediumseagreen:[60,179,113],
	mediumslateblue:[123,104,238],
	mediumspringgreen:[0,250,154],
	mediumturquoise:[72,209,204],
	mediumvioletred:[199,21,133],
	midnightblue:[25,25,112],
	mintcream:[245,255,250],
	mistyrose:[255,228,225],
	mistyrose1:[255,228,225],
	mistyrose2:[238,213,210],
	mistyrose3:[205,183,181],
	mistyrose4:[139,125,123],
	moccasin:[255,228,181],
	navajowhite:[255,222,173],
	navajowhite1:[255,222,173],
	navajowhite2:[238,207,161],
	navajowhite3:[205,179,139],
	navajowhite4:[139,121,94],
	navy:[0,0,128],
	navyblue:[0,0,128],
	oldlace:[253,245,230],
	olivedrab:[107,142,35],
	olivedrab1:[192,255,62],
	olivedrab2:[179,238,58],
	olivedrab3:[154,205,50],
	olivedrab4:[105,139,34],
	orange:[255,165,0],
	orange1:[255,165,0],
	orange2:[238,154,0],
	orange3:[205,133,0],
	orange4:[139,90,0],
	orangered:[255,69,0],
	orangered1:[255,69,0],
	orangered2:[238,64,0],
	orangered3:[205,55,0],
	orangered4:[139,37,0],
	orchid:[218,112,214],
	orchid1:[255,131,250],
	orchid2:[238,122,233],
	orchid3:[205,105,201],
	orchid4:[139,71,137],
	palegoldenrod:[238,232,170],
	palegreen:[152,251,152],
	palegreen1:[154,255,154],
	palegreen2:[144,238,144],
	palegreen3:[124,205,124],
	palegreen4:[84,139,84],
	paleturquoise:[175,238,238],
	paleturquoise1:[187,255,255],
	paleturquoise2:[174,238,238],
	paleturquoise3:[150,205,205],
	paleturquoise4:[102,139,139],
	palevioletred:[219,112,147],
	palevioletred1:[255,130,171],
	palevioletred2:[238,121,159],
	palevioletred3:[205,104,137],
	palevioletred4:[139,71,93],
	papayawhip:[255,239,213],
	peachpuff:[255,218,185],
	peachpuff1:[255,218,185],
	peachpuff2:[238,203,173],
	peachpuff3:[205,175,149],
	peachpuff4:[139,119,101],
	peru:[205,133,63],
	pink:[255,192,203],
	pink1:[255,181,197],
	pink2:[238,169,184],
	pink3:[205,145,158],
	pink4:[139,99,108],
	plum:[221,160,221],
	plum1:[255,187,255],
	plum2:[238,174,238],
	plum3:[205,150,205],
	plum4:[139,102,139],
	powderblue:[176,224,230],
	purple:[160,32,240],
	purple1:[155,48,255],
	purple2:[145,44,238],
	purple3:[125,38,205],
	purple4:[85,26,139],
	red:[255,0,0],
	red1:[255,0,0],
	red2:[238,0,0],
	red3:[205,0,0],
	red4:[139,0,0],
	rosybrown:[188,143,143],
	rosybrown1:[255,193,193],
	rosybrown2:[238,180,180],
	rosybrown3:[205,155,155],
	rosybrown4:[139,105,105],
	royalblue:[65,105,225],
	royalblue1:[72,118,255],
	royalblue2:[67,110,238],
	royalblue3:[58,95,205],
	royalblue4:[39,64,139],
	saddlebrown:[139,69,19],
	salmon:[250,128,114],
	salmon1:[255,140,105],
	salmon2:[238,130,98],
	salmon3:[205,112,84],
	salmon4:[139,76,57],
	sandybrown:[244,164,96],
	seagreen:[46,139,87],
	seagreen1:[84,255,159],
	seagreen2:[78,238,148],
	seagreen3:[67,205,128],
	seagreen4:[46,139,87],
	seashell:[255,245,238],
	seashell1:[255,245,238],
	seashell2:[238,229,222],
	seashell3:[205,197,191],
	seashell4:[139,134,130],
	sienna:[160,82,45],
	sienna1:[255,130,71],
	sienna2:[238,121,66],
	sienna3:[205,104,57],
	sienna4:[139,71,38],
	skyblue:[135,206,235],
	skyblue1:[135,206,255],
	skyblue2:[126,192,238],
	skyblue3:[108,166,205],
	skyblue4:[74,112,139],
	slateblue:[106,90,205],
	slateblue1:[131,111,255],
	slateblue2:[122,103,238],
	slateblue3:[105,89,205],
	slateblue4:[71,60,139],
	slategray:[112,128,144],
	slategray1:[198,226,255],
	slategray2:[185,211,238],
	slategray3:[159,182,205],
	slategray4:[108,123,139],
	slategrey:[112,128,144],
	snow:[255,250,250],
	snow1:[255,250,250],
	snow2:[238,233,233],
	snow3:[205,201,201],
	snow4:[139,137,137],
	springgreen:[0,255,127],
	springgreen1:[0,255,127],
	springgreen2:[0,238,118],
	springgreen3:[0,205,102],
	springgreen4:[0,139,69],
	steelblue:[70,130,180],
	steelblue1:[99,184,255],
	steelblue2:[92,172,238],
	steelblue3:[79,148,205],
	steelblue4:[54,100,139],
	tan:[210,180,140],
	tan1:[255,165,79],
	tan2:[238,154,73],
	tan3:[205,133,63],
	tan4:[139,90,43],
	thistle:[216,191,216],
	thistle1:[255,225,255],
	thistle2:[238,210,238],
	thistle3:[205,181,205],
	thistle4:[139,123,139],
	tomato:[255,99,71],
	tomato1:[255,99,71],
	tomato2:[238,92,66],
	tomato3:[205,79,57],
	tomato4:[139,54,38],
	transparent:[255,255,254],
	turquoise:[64,224,208],
	turquoise1:[0,245,255],
	turquoise2:[0,229,238],
	turquoise3:[0,197,205],
	turquoise4:[0,134,139],
	violet:[238,130,238],
	violetred:[208,32,144],
	violetred1:[255,62,150],
	violetred2:[238,58,140],
	violetred3:[205,50,120],
	violetred4:[139,34,82],
	wheat:[245,222,179],
	wheat1:[255,231,186],
	wheat2:[238,216,174],
	wheat3:[205,186,150],
	wheat4:[139,126,102],
	white:[255,255,255],
	whitesmoke:[245,245,245],
	yellow:[255,255,0],
	yellow1:[255,255,0],
	yellow2:[238,238,0],
	yellow3:[205,205,0],
	yellow4:[139,139,0],
	yellowgreen:[154,205,50]
};/** @namespace */
hui.ui.test = {
	status : null,
	busy : 0,
	run : function(recipe) {
		this.status = {failures:0,successes:0};
		this.busy = 0;
		hui.ui.showMessage({text:'Running test',busy:true});
		this._next(0,recipe);
	},
	_next : function(num,recipe) {
		if (recipe[num]===undefined) {
			this._stop();
			return;
		}
		hui.ui.showMessage({text:'Running test ('+num+')',busy:true});
		if(typeof(recipe[num])=='function') {
			recipe[num]();
			this._next(num+1,recipe);
		} else {
			window.setTimeout(function(){this._next(num+1,recipe)}.bind(this),recipe[num]);
		}
	},
	_stop : function() {
		if (this.busy>0) {
			window.setTimeout(this._stop.bind(this),100);
			return;
		}
		if (this.status.failures>0) {
			hui.ui.showMessage({text:'Failure',icon:'common/warning',duration:2000});
		} else {
			hui.ui.showMessage({text:'Success',icon:'common/success',duration:2000});
		}
	},
	click : function(node,func) {
		this.busy++;
		Syn.click(node,function() {
			if (func) {func()};
			this.busy--;
		}.bind(this));
	},
	type : function(node,text,func) {
		this.busy++;
		Syn.type(node,text,function() {
			if (func) {func()};
			this.busy--;
		}.bind(this));
	},
	_succeed : function(msg) {
		if (window.console) {
			console.info(msg);
		}	
		this._log(msg);
		this.status.successes++;
	},
	_fail : function(msg,obj1,obj2) {
		if (window.console) {
			console.error(msg);
			console.info('Object 1:');
			console.info(obj1);
		}
			console.info('Object 2:');
			console.info(obj2);
		this._log(msg,true);
		this.status.failures++;
	},
	_log : function(msg,fail) {
		if (!this.log) {
			var log = this.log = hui.build('div',{parent:document.body,style:'border: 1px solid #eee; padding: 5px; position: fixed; bottom:20px;right:20px; width: 200px; max-height: 200px; overflow: auto; white-space: nowrap; font-family: Monaco, monospace; font-size: 9px; color: #00ff00; background: #000'});
			hui.listen(this.log,'click',function() {
				if (log.style.left=='20px') {
					log.style.left='';
					log.style.top='';
					log.style.width='200px';
					log.style.maxHeight='200px';
				} else {
					log.style.left='20px';
					log.style.top='20px';
					log.style.width='';
					log.style.maxHeight='';
				}
			});
		}
		hui.build('div',{parent:this.log,text:msg,style:fail?'color:red;':''});
	},
	
	// Assertion...
	
	assertTrue : function(value,msg) {
		if (value!==true) {
			this._fail('Failure ('+msg+'), not true...',value);
		} else {
			this._succeed('Success, true'+(msg ? ': '+msg : ''));
		}
	},
	assertFalse : function(value,msg) {
		if (value!==false) {
			this._fail('Failure ('+msg+'), not false...',value);
		} else {
			this._succeed('Success, false'+(msg ? ': '+msg : ''));
		}
	},
	assertDefined : function(value,msg) {
		if (value===null || value==undefined) {
			this._fail('Failure ('+msg+'), not false...',value);
		} else {
			this._succeed('Success, false'+(msg ? ': '+msg : ''));
		}
	},
	assertDefined : function(value,msg) {
		if (value===null || value===undefined) {
			this._fail('Failure ('+msg+'), defined...',value);
		} else {
			this._succeed('Success, defined: '+msg);
		}
	},
	assertEquals : function(obj1,obj2,msg) {
		if (obj1!==obj2) {
			this._fail('Failure ('+msg+') - '+obj1+'!=='+obj2+', not equal...',obj1,obj2);
		} else {
			this._succeed('Success, equal: '+obj1+'==='+obj2+(msg ? ', '+msg : ''));
		}
	},
	assertNotEquals : function(obj1,obj2,msg) {
		if (obj1===obj2) {
			this._fail('Failure ('+msg+'), not not equal...',obj1,obj2);
		} else {
			this._succeed('Success, not equal: '+obj1+'!=='+obj2+', '+msg);
		}
	},
	assertVisible : function(node,msg) {
		if (node.style.display==='none') {
			this._fail('Failure ('+msg+'), not visible...',node);
		} else {
			this._succeed('Success, visible: '+msg);
		}
	},
	assertNotVisible : function(node,msg) {
		if (node.style.display!=='none') {
			this._fail('Failure ('+msg+'), visible...',node);
		} else {
			this._succeed('Success, not visible: '+msg);
		}
	}
}/**
 * A dock
 * @constructor
 */
hui.ui.FlashChart = function(element,name,options) {
	this.options = N2i.override({},options);
	this.element = $(element);
	this.name = name;
	hui.ui.extend(this);
}

hui.ui.FlashChart.prototype = {
	load : function(url) {
		var self = this;
		var flash = this.findSWF(this.element.id+'_chart');
		new Ajax.Request(url,{onSuccess:function(t) {
			flash.load(t.responseText);
		}});
	},
	findSWF : function(movieName) {
		if (window[movieName]) {
			return window[movieName];
		} else {
			return document[movieName];
		}
	}
}

/* EOF *//**
 * @constructor
 */
hui.ui.Drawing = function(options) {
	this.options = hui.override({width:200,height:200},options);
	this.element = hui.get(options.element);
	this.svg = this._build({tag:'svg',parent:this.element,attributes:{width:options.width,height:options.height}});
	this.element.appendChild(this.svg);
	this.name = options.name;
	hui.ui.extend(this);
}

hui.ui.Drawing.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('div',{'class':'hui_drawing',style:'position: relative; overflow: hidden;'});
	if (options.height) {
		e.style.height = options.height+'px';
	}
	if (options.width) {
		e.style.width = options.width+'px';
	}
	if (options.parent) {
		options.parent.appendChild(e);
	}
	return new hui.ui.Drawing(options);
}

hui.ui.Drawing.prototype = {
	addLine : function(options) {
		var node = this._build({
			tag:'line',
			parent:this.svg,
			attributes:{
				x1 : options.x1,
				y1 : options.y1,
				x2 : options.x2,
				y2 : options.y2,
				style:'stroke:'+(options.color || '#000')+';stroke-width:'+(options.width || 1)
			}
		});
		return new hui.ui.Drawing.Line(node);
	},
	addCircle : function(options) {
		var node = this._build({
			tag:'circle',
			parent:this.svg,
			attributes : {
				cx : options.cx,
				cy : options.cy,
				r : options.r,
				style : 'stroke:'+(options.color || '#000')+'; fill:'+(options.fill || '#fff')+'; stroke-width:'+(options.width==undefined ? 1 : options.width)}
		});
		return new hui.ui.Drawing.Circle(node);
	},
	addElement : function(options) {
		var node = hui.build('div',{style:'position:absolute;left:0;top:0;',parent:this.element,html:options.html}),
			element = new hui.ui.Drawing.Element(node);
		if (options.movable) {
			hui.drag.register({
				element : node,
				onBeforeMove : function(e) {
					this.fire('shapeWillMove',{shape:element,event:e});
				}.bind(this),
				onMove : function(e) {
					node.style.left = e.getLeft()+'px';
					node.style.top = e.getTop()+'px';
					this.fire('shapeMoved',{shape:element,event:e});
				}.bind(this),
				onAfterMove : function(e) {
					this.fire('shapeWasMoved',{shape:element,event:e});
				}.bind(this)
			})
		}
		return element;
	},
	_build : function(options) {
		if (false && (hui.browser.msie8 || hui.browser.msie7 || hui.browser.msie6)) {
			var line = document.createElement("v:line");
			line.setAttribute('from','0 0');
			line.setAttribute('to','100 100');
			line.setAttribute("fillcolor","#FF0000");
			line.setAttribute("strokeweight","2pt");
			return line;
			
			var frag = document.createDocumentFragment();
			frag.insertAdjacentHTML('beforeEnd',
				'<v:rect id="myRect" fillcolor="blue" style="top:10px;left:15px;width:50px;height:30px;position:absolute;"></biv:rect>'
			);
			document.body.appendChild(frag);
			return document.getElementById('myRect');
		} else {
			var node = document.createElementNS('http://www.w3.org/2000/svg',options.tag);
		}
		if (options.attributes) {
			for (att in options.attributes) {
				node.setAttribute(att,options.attributes[att]);
			}
		}
		if (options.parent) {
			options.parent.appendChild(node);
		}
		return node;
	}
}

if (hui.browser.msie8) {
	document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
}

hui.ui.Drawing.Line = function(node) {
	this.node = node;
}

hui.ui.Drawing.Line.prototype = {
	setFrom : function(point) {
		this.node.setAttribute('x1',point.x);
		this.node.setAttribute('y1',point.y);
	},
	setTo : function(point) {
		this.node.setAttribute('x2',point.x);
		this.node.setAttribute('y2',point.y);
	}
}

hui.ui.Drawing.Circle = function(node) {
	this.node = node;
}

hui.ui.Drawing.Circle.prototype = {
}


hui.ui.Drawing.Element = function(node) {
	this.node = node;
}

hui.ui.Drawing.Element.prototype = {
	setPosition : function(point) {
		this.node.style.left = point.x+'px';
		this.node.style.top = point.y+'px';
	},
	setCenter : function(point) {
		this.node.style.left = (point.x - this.node.clientWidth/2)+'px';
		this.node.style.top = (point.y - this.node.clientHeight/2)+'px';
	}
}/**
 * Image pasting madness
 * @constructor
 */
hui.ui.ImagePaster = function(options) {
	hui.log('New paster')
	this.options = options || {};
	this.element = hui.get(options.element);
	this.name = options.name;
	this.data = null;
	hui.ui.extend(this);
}

hui.ui.ImagePaster.create = function(options) {
	options = options || {};
	var e = options.element = hui.build('div',{className:'hui_imagepaster'});
	return new hui.ui.ImagePaster(options);
}

hui.ui.ImagePaster.isSupported = function() {
	if (!navigator) {
		return false;
	}
	return navigator.platform=='MacIntel';
	/*
	var result = { 
		javaEnabled: false,
		version: ''
	};
	if (typeof navigator != 'undefined' && typeof navigator.javaEnabled != 'undefined') {
		result.javaEnabled = navigator.javaEnabled();
	} else {
		result.javaEnabled = 'unknown';
		if (navigator.javaEnabled() && typeof java != 'undefined') {
			result.version = java.lang.System.getProperty("java.version");
		}
	}
	return result;*/
}

hui.ui.ImagePaster.prototype = {
	_initialize : function() {
		hui.log('Initializing...');
		if (hui.browser.msie) {
			this.element.innerHTML = '<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="0" height="0" style="border-width:0;"  id="rup" name="rup" codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_5_0-windows-i586.cab#Version=1,5,0,0"><param name="archive" value="'+hui.ui.context+'/hui/lib/supa/Supa.jar"><param name="code" value="de.christophlinder.supa.SupaApplet"><param name="mayscript" value="yes"><param name="scriptable" value="true"><param name="name" value="jsapplet"><param name="encoding" value="base64"><param name="previewscaler" value="original size"></object>';
			this.applet = hui.get.firstByTag(this.element,'object');
		} else {
			this.applet = hui.build('applet',{
				archive : hui.ui.context+"/hui/lib/supa/Supa.jar",
				code : 'de.christophlinder.supa.SupaApplet',
				width : 0,
				height : 0,
				html : '<param name="imagecodec" value="png"><param name="encoding" value="base64"><param name="previewscaler" value="original size">',
				parent : this.element
			});
		}
		if (this.options.invisible) {
			hui.log('Adding to body...');
			document.body.appendChild(this.element);
		}
		this.initialized = true;
		hui.defer(this._checkReady,this);
	},
	_checkReady : function() {
		if (this._isReady()) {
			hui.log('Ready...');
			if (this.pendingPaste) {
				hui.log('Running pedning paste...');
				this.paste();
			}
			this.fire('readyToPaste',this);
		} else {
			hui.log('Not ready yet...');
			window.setTimeout(this._checkReady.bind(this),500);
		}
	},
	_isReady : function() {
		try {
			if (this.applet.ping) {
				return this.applet.ping()
			}
		} catch (e) {
			hui.log(e)
		}
		return false;
	},
	paste : function() {
		if (!this.initialized) {
			hui.log('Pasting, not intitialized, so pending...');
			this.pendingPaste = true;
			hui.defer(this._initialize,this);
			return;
		}
		hui.log('Pasting...');
		var error = this.applet.pasteFromClipboard(); 
		if (error!==0) {
			this._error(error);
			return;
		}
		this.data = this.applet.getEncodedString();
		this._updatePreview();
		hui.log('Sending: imageWasPasted');
		this.fire('imageWasPasted',this.data);
	},
	_error : function(code) {
		var key = 'unknown';
		if (code==2) {
			key = 'empty';
		} else if (code==3) {
			key = 'invalid';
		} else if (code==4) {
			key = 'busy';
		}
		hui.log('Error: '+key);
		this.fire('imagePasteFailed',key);
	},
	_updatePreview : function() {
		if (this.options.invisible) {return}
		if (this.preview) {
			this.preview.src = 'data:image/png;base64,'+this.data;
		} else {
			var container = hui.build('div',{className:'hui_imagepaster_preview',parent:this.element});
			this.preview = hui.build('img',{src:'data:image/png;base64,'+this.data,parent:container});
		}
	}
}/**
 * Tiles
 * @constructor
 */
hui.ui.Tiles = function(options) {
	this.options = options || {};
	this.element = hui.get(options.element);
	this.name = options.name;
	this.tiles = hui.get.children(this.element);
	hui.ui.extend(this);
	this._addBehavior();
	if (this.options.reveal) {
		hui.onReady(this._reveal.bind(this));
	}
}

hui.ui.Tiles.prototype = {
	_addBehavior : function() {
	},
	_reveal : function() {
		for (var i=0; i < this.tiles.length; i++) {
			var tile = this.tiles[i];
			this._bounce(tile);
		};
	},
	_bounce : function(tile) {
		hui.effect.fadeIn({element:tile,delay:Math.random()*500});		
	}
}

hui.ui.Tile = function(options) {
	this.options = options || {};
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this.fullScreen = false;
	this.initial = {
		width : this.element.style.width,
		height : this.element.style.height,
		top : this.element.style.top,
		left : this.element.style.left
	}
	this._addBehavior();
}

hui.ui.Tile._zIndex = 0;

hui.ui.Tile.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',function(e) {
			e = hui.event(e);
			if (hui.cls.has(e.element,'hui_tile_icon')) {
				var key = e.element.getAttribute('data-hui-key');
				this.fire('clickIcon',{key:key,tile:this});
			}
		}.bind(this))
	},
	isFullScreen : function() {
		return this.fullScreen;
	},
	toggleFullScreen : function() {
		if (this.fullScreen) {
			hui.animate({
				node : this.element,
				css : this.initial,
				duration : 1000,
				ease : hui.ease.elastic,
				onComplete : function() {
					hui.ui.reLayout()
				}
			});			
		} else {
			hui.ui.Tile._zIndex++;
			this.element.style.zIndex = hui.ui.Tile._zIndex;
			hui.animate({
				node : this.element,
				css : {top:'0%',left:'0%',width:'100%',height:'100%'},
				duration : 1000,
				ease : hui.ease.elastic,
				onComplete : function() {
					hui.ui.reLayout()
				}
			});			
		}
		this.fullScreen = !this.fullScreen;
	}
}/**
 * Pages
 * @constructor
 */
hui.ui.Pages = function(options) {
	this.options = options || {};
	this.element = hui.get(options.element);
	this.name = options.name;
	this.pages = hui.get.children(this.element);
	this.index = 0;
	this.expanded = false;
	hui.ui.extend(this);
	//hui.listen(this.element,'click',this.next.bind(this));
}

hui.ui.Pages.prototype = {
	next : function() {
		if (this.expanded) {return}
		var current = this.pages[this.index];
		this.index = this.pages.length <= this.index+1 ? 0 : this.index+1;
		this._transition({hide:current,show:this.pages[this.index]});
	},
	previous : function() {
		if (this.expanded) {return}
		var current = this.pages[this.index];
		this.index = this.index == 0 ? this.pages.length-1 : this.index-1;
		this._transition({hide:current,show:this.pages[this.index]});
	},
	expand : function() {
		var l = this.pages.length;
		for (var i=0; i < l; i++) {
			if (!this.expanded) {
				hui.style.set(this.pages[i],{
					width : (100 / l)+'%',
					display : 'block',
					float : 'left',
					opacity: 1
				});
			} else {
				hui.style.set(this.pages[i],{
					width : '',
					display : i==this.index ? 'block' : 'none',
					float : ''
				});
			}
		};
		hui.ui.callVisible(this);
		this.expanded = !this.expanded;
	},
	_transition : function(options) {
		var hide = options.hide,
			show = options.show;
		hui.style.set(hide,{position:'absolute',width:this.element.clientWidth+'px'});
		hui.style.set(show,{position:'absolute',width:this.element.clientWidth+'px',display:'block',opacity:0});
		hui.effect.fadeOut({element:hide,onComplete:function() {
			hui.style.set(hide,{width : '',position:'',display:'none'});
		}});
		hui.effect.fadeIn({element:show,onComplete:function() {
			hui.style.set(show,{width : '',position:''});
			hui.ui.reLayout();
			hui.ui.callVisible(this);
		}.bind(this)});
	}
}