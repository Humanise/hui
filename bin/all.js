/**
 * The root namespace of Humanise User Interface
 * @namespace
 */
hui = window.hui || {};

(function(hui,agent,window) {

  /**
   * @namespace
   */
  hui.browser = {};
  var browser = hui.browser;

  /** If the browser is any version of InternetExplorer */
  browser.msie = !/opera/i.test(agent) && /MSIE/.test(agent) || /Trident/.test(agent);
  /** If the browser is InternetExplorer 6 */
  browser.msie6 = agent.indexOf('MSIE 6') !== -1;
  /** If the browser is InternetExplorer 7 */
  browser.msie7 = agent.indexOf('MSIE 7') !== -1;
  /** If the browser is InternetExplorer 8 */
  browser.msie8 = agent.indexOf('MSIE 8') !== -1;
  /** If the browser is InternetExplorer 9 */
  browser.msie9 = agent.indexOf('MSIE 9') !== -1;
  /** If the browser is InternetExplorer 9 in compatibility mode */
  browser.msie9compat = browser.msie7 && agent.indexOf('Trident/5.0') !== -1;
  /** If the browser is InternetExplorer 10 */
  browser.msie10 = agent.indexOf('MSIE 10') !== -1;
  /** If the browser is InternetExplorer 11 */
  browser.msie11 = agent.indexOf('Trident/7.0') !== -1;
  /** If the browser is WebKit based */
  browser.webkit = agent.indexOf('WebKit') !== -1;
  /** If the browser is any version of Safari */
  browser.safari = agent.indexOf('Safari') !== -1;
  /** If the browser is any version of Chrome */
  //browser.chrome = agent.indexOf('Chrome') !== -1;
  /** The version of WebKit (null if not WebKit) */
  browser.webkitVersion = null;
  /** If the browser is Gecko based */
  browser.gecko = !browser.webkit && !browser.msie && agent.indexOf('Gecko') !== -1;
  /** If the browser is Gecko based */
  //browser.chrome = agent.indexOf('Chrome') !== -1;
  /** If the browser is safari on iPad */
  browser.ipad = browser.webkit && agent.indexOf('iPad') !== -1;
  /** If the browser is on Windows */
  browser.windows = agent.indexOf('Windows') !== -1;

  /** If the browser supports CSS opacity */
  browser.opacity = !browser.msie6 && !browser.msie7 && !browser.msie8;
  /** If the browser supports CSS Media Queries */
  browser.mediaQueries = browser.opacity;
  /** If the browser supports CSS animations */
  browser.animation = !browser.msie6 && !browser.msie7 && !browser.msie8 && !browser.msie9;

  browser.wordbreak = !browser.msie6 && !browser.msie7 && !browser.msie8;

  browser.touch = (!!('ontouchstart' in window) || (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints)) ? true : false;

  var result = /Safari\/([\d.]+)/.exec(agent);
  if (result) {
    browser.webkitVersion = parseFloat(result[1]);
  }
})(hui,navigator.userAgent,window);



/**
 * Log something
 * @param {Object} obj The object to log
 */
hui.log = function(obj) {
  if (window.console && console.log) {
    try { // Somehow it fails in IE if dev tools are not open
      console.log.apply(null,arguments);
    } catch (e) {}
  }
};

// Postponed listeners
hui._postponed = [];

/**
 * Register code as ready
 * @param name The name of the module
 * @param obj The object, function, namespace
 */
hui.define = function(name, obj) {
  var postponed = hui._postponed;
  for (var i = postponed.length - 1; i >= 0; i--) {
    var item = postponed[i];
    if (!item) continue;
    var deps = [];
    for (var j = 0; j < item.requirements.length; j++) {
      var path = item.requirements[j];
      var found = hui.evaluate(path); // TODO Handle objects defined by name but not evaluated by that name
      if (found) {
        deps.push(found);
      } else {
        break;
      }
    }
    if (item.requirements.length == deps.length) {
      hui.array.remove(postponed, item);
      item.callback.apply(null, deps);
    }
  }
};

hui._runOrPostpone = function() {
  var dependencies = [];
  var callback = null;
  var i;
  for (i = 0; i < arguments.length; i++) {
    if (typeof(arguments[i])=='function') {
      callback = arguments[i];
    } else if (hui.isArray(arguments[i])) {
      dependencies = arguments[i];
    }
  }
  var found = [];
  for (i = 0; i < dependencies.length; i++) {
    var vld = hui.evaluate(dependencies[i]);
    if (!vld) {
      found = false;
      break;
    }
    found[i] = vld;
  }
  if (found) {
    callback.apply(null, found);
  } else {
    hui.log('Postponing: ' + dependencies);
    hui._postponed.push({requirements:dependencies,callback:callback});
  }
};

/**
 * Evaluate an expression
 */
hui.evaluate = function(expression, context) {
  var path = expression.split('.');
  var cur = context || window;
  for (var i = 0; i < path.length && cur!==undefined; i++) {
    cur = cur[path[i]];
  }
  return cur;
};

/**
 * Defer a function so it will fire when the current "thread" is done
 * @param {Function} func The function to defer
 * @param {Object} ?bind Optional, the object to bind "this" to
 */
hui.defer = function(func,bind) {
  if (bind) {
    func = func.bind(bind);
  }
  window.setTimeout(func);
};

hui.extend = function(subClass, superClass) {
  var methods = subClass.prototype;
  for (var p in superClass) {
    if (superClass.hasOwnProperty(p)) {
      subClass[p] = superClass[p];
    }
  }
  function __() { this.constructor = subClass; }
  __.prototype = superClass.prototype;
  subClass.prototype = new __();
  if (methods) {
    for (var pr in methods) {
      subClass.prototype[pr] = methods[pr];
    }
  }
};

/**
 * Override the properties on the first argument with properties from the last object
 * @param {Object} original The object to override
 * @param {Object} subject The object to copy the properties from
 * @return {Object} The original
 */
hui.override = function(original,subject) {
  if (subject) {
    for (var prop in subject) {
      original[prop] = subject[prop];
    }
  }
  return original;
};

/**
 * Loop through items in array or properties in an object.
 * If «items» is an array «func» is called with each item.
 * If «items» is an object «func» is called with each (key,value)
 * @param {Object | Array} items The object or array to loop through
 * @param {Function} func The callback to handle each item
 */
hui.each = function(items, func) {
  var i;
  if (hui.isArray(items)) {
    for (i = 0; i < items.length; i++) {
      func(items[i], i);
    }
  } else if (items instanceof NodeList) {
    for (i = 0; i < items.length; i++) {
      func(items.item(i), i);
    }
  } else if (hui.isDefined(items)) {
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        func(key, items[key]);
      }
    }
  }
};

/**
 * Return text if condition is met
 * @param {Object} condition The condition to test
 * @param {String} text The text to return when condition evaluates to true
 */
hui.when = function(condition,text) {
  return condition ? text : '';
};

/**
 * Converts a string to an int if it is only digits, otherwise remains a string
 * @param {String} str The string to convert
 * @returns {Object} An int of the string or the same string
 */
hui.intOrString = function(str) {
  if (hui.isDefined(str)) {
    var result = /[0-9]+/.exec(str);
    if (result !== null && result[0] == str) {
      if (parseInt(str,10) == str) {
        return parseInt(str, 10);
      }
    }
  }
  return str;
};

/**
 * Make sure a number is between a min / max
 */
hui.between = function(min, value, max) {
  var result = Math.min(max, Math.max(min, value));
  return isNaN(result) ? min : result;
};

/**
 * Fit a box inside a container while preserving aspect ratio (note: expects sane input)
 * @param {Object} box The box to scale {width : 200, height : 100}
 * @param {Object} container The container to fit the box inside {width : 20, height : 40}
 * @returns {Object} An object of the new box {width : 20, height : 10}
 */
hui.fit = function(box,container,options) {
  options = options || {};
  var boxRatio = box.width / box.height;
  var containerRatio = container.width / container.height;
  var width, height;
  if (options.upscale===false && box.width<=container.width && box.height<=container.height) {
    width = box.width;
    height = box.height;
  }
  else if (boxRatio > containerRatio) {
    width = container.width;
    height = Math.round(container.width/box.width * box.height);
  } else {
    width = Math.round(container.height/box.height * box.width);
    height = container.height;
  }
  return {width : width, height : height};
};

/**
 * Checks if a string has non-whitespace characters
 * @param {String} str The string
 */
hui.isBlank = function(str) {
  if (str===null || typeof(str)==='undefined' || str==='') {
    return true;
  }
  return typeof(str)=='string' && hui.string.trim(str).length === 0;
};

/**
 * Checks that an object is not null and not undefined
 * @param {Object} obj The object to check
 */
hui.isDefined = function(obj) {
  return obj!==null && typeof(obj)!=='undefined';
};



/**
 * Checks if an object is a string
 * @param {Object} obj The object to check
 */
hui.isString = function(obj) {
  return typeof(obj)==='string';
};

/**
 * Checks if an object is a number
 * @param {Object} obj The object to check
 */
hui.isNumber = function(obj) {
  return typeof(obj)==='number';
};

/**
 * Checks if an object is an array
 * @param {Object} obj The object to check
 */
hui.isArray = function(obj) {
  if (obj === null || obj === undefined) {
    return false;
  }
  if (obj.constructor == Array) {
    return true;
  } else {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

///////////////////////// Strings ///////////////////////

/** @namespace */
hui.string = {

  /**
   * Test that a string start with another string
   * @param {String} str The string to test
   * @param {String} start The string to look for at the start
   * @returns {Boolean} True if «str» starts with «start»
   */
  startsWith : function(str, start) {
    if (!hui.isString(str) || !hui.isString(start)) {
      return false;
    }
    return str.match("^"+start) == start;
  },
  /**
   * Test that a string ends with another string
   * @param {String} str The string to test
   * @param {String} end The string to look for at the end
   * @returns {Boolean} True if «str» ends with «end»
   */
  endsWith : function(str, end) {
    if (!hui.isString(str) || !hui.isString(end)) {
      return false;
    }
    return str.match(end+"$") == end;
  },

  /**
   * Make a string camelized
   * @param {String} str The string to camelize
   * @returns {String} The camelized string
   */
  camelize : function(str) {
    if (str.indexOf('-')==-1) {
      return str;
    }
    var oStringList = str.split('-');

    var camelizedString = str.indexOf('-') === 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];

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
    if (!hui.isDefined(str)) {
      return '';
    }
    if (!hui.isString(str)) {
      str = String(str);
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
   * Shorten a string to a maximum length
   * @param {String} str The text to shorten
   * @param {int} length The maximum length
   * @returns {String} The shortened text, '' if undefined or null string
   */
  shorten : function(str,length) {
    if (hui.isNumber(str)) {
      str = str+'';
    }
    else if (!hui.isString(str)) {return '';}
    if (str.length > length) {
      return str.substring(0,length-3) + '...';
    }
    return str;
  },
  /**
   * Escape the html in a string (robust)
   * @param {String} str The text to escape
   * @returns {String} The escaped text
   */
  escapeHTML : function(str) {
    if (!hui.isDefined(str)) {return '';}
    return hui.build('div',{text:str}).innerHTML;
  },
  /**
   * Escape the html in a string (fast)
   * @param {String} str The text to escape
   * @returns {String} The escaped text
   */
  escape : function(str) {
    if (!hui.isString(str)) {
      return str;
    }
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    return str.replace(/[&<>'`"]/g, function(tag) {
      return tagsToReplace[tag] || tag;
    });
  },
  /**
   * Converts a JSON string into an object
   * @param json {String} The JSON string to parse
   * @returns {Object} The object
   */
  fromJSON : function(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      hui.log(e);
      return null;
    }
  },

  /**
   * Converts an object into a JSON string
   * @param obj {Object} the object to convert
   * @returns {String} A JSON representation
   */
  toJSON : function(obj) {
    return JSON.stringify(obj);
  }
};







//////////////////////// Array //////////////////////////

/** @namespace */
hui.array = {
  /**
   * Add an object to an array if it not already exists
   * @param {Array} arr The array
   * @param {Object} value The object to add
   */
  add : function(arr, value) {
    if (value.constructor == Array) {
      for (var i=0; i < value.length; i++) {
        if (!hui.array.contains(arr,value[i])) {
          arr.push(value);
        }
      }
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
    return hui.array.indexOf(arr,value) !== -1;
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
    }
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
    }
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
      array[i] = parseInt(array[i],10);
    }
    return array;
  }
};










////////////////////// DOM ////////////////////

/** @namespace */
hui.dom = {
  isElement : function(node,name) {
    return node.nodeType==1 && (name===undefined ? true : node.nodeName.toLowerCase()==name);
  },
  isDefinedText : function(node) {
    return node.nodeType==3 && node.nodeValue.length>0;
  },
  addText : function(node,text) {
    node.appendChild(document.createTextNode(text));
  },
  // TODO: Move to hui.get
  firstChild : function(node) {
    var children = node.childNodes;
    for (var i=0; i < children.length; i++) {
      if (children[i].nodeType==1) {
        return children[i];
      }
    }
    return null;
  },
  parse : function(html) {
    var dummy = hui.build('div',{html:html});
    return hui.get.firstChild(dummy);
  },
  clear : function(node) {
    var children = node.childNodes;
    for (var i = children.length - 1; i >= 0; i--) {
      children[i].parentNode.removeChild(children[i]);
    }
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
  changeTag : function(node,tagName) {
    var replacement = hui.build(tagName);

    // Copy the children
    while (node.firstChild) {
        replacement.appendChild(node.firstChild); // *Moves* the child
    }

    // Copy the attributes
    for (var i = node.attributes.length - 1; i >= 0; --i) {
        replacement.attributes.setNamedItem(node.attributes[i].cloneNode());
    }

    // Insert it
    node.parentNode.insertBefore(replacement, node);

    // Remove the wns
    node.parentNode.removeChild(node);
    return replacement;
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
    if (hui.dom.isElement(node)) {
      if (hui.dom.isElement(node,'script')) {
        /*jshint evil:true */
        eval(node.innerHTML);
      } else {
        var scripts = node.getElementsByTagName('script');
        for (var i=0; i < scripts.length; i++) {
          /*jshint evil:true */
          eval(scripts[i].innerHTML);
        }
      }
    }
  },
  setText : function(node,text) {
    if (text===undefined || text===null) {
      text = '';
    }
    var c = node.childNodes;
    var updated = false;
    for (var i = c.length - 1; i >= 0; i--){
      if (!updated && c[i].nodeType === 3) {
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
      if (c[i].nodeType === 3 && c[i].nodeValue !== null) {
        txt+= c[i].nodeValue;
      } else if (c[i].nodeType == 1) {
        txt+= hui.dom.getText(c[i]);
      }
    }
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
};









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
    }
    return params;
  }
};







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
};

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
  }
  return children;
};

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
};

hui.get.previous = function(element) {
  if (!element) {
    return null;
  }
  if (element.previousElementSibling) {
    return element.previousElementSibling;
  }
  if (!element.previousSibling) {
    return null;
  }
  var previous = element.previousSibling;
  while (previous && previous.nodeType!=1) {
    previous = previous.previousSibling;
  }
  if (previous && previous.nodeType==1) {
      return previous;
  }
  return null;
};

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
    }
  }
  return elements;
};

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
};

hui.get.firstByClass = function(parentElement,className,tag) {
  parentElement = hui.get(parentElement) || document.body;
  if (parentElement.querySelector) {
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
};

hui.get.byClass = function(parentElement,className,tag) {
  parentElement = hui.get(parentElement) || document.body;
    var i;
  if (parentElement.querySelectorAll) {
    var nl = parentElement.querySelectorAll((tag ? tag+'.' : '.')+className);
    // Important to convert into array...
    var l=[];
    for(i=0, ll=nl.length; i!=ll; l.push(nl[i++]));
    return l;
  } else {
    var children = parentElement.getElementsByTagName(tag || '*'),
    out = [];
    for (i=0;i<children.length;i++) {
      if (hui.cls.has(children[i],className)) {
        out[out.length] = children[i];
      }
    }
    return out;
  }
};

hui.get.byId = function(e,id) {
  var children = e.childNodes;
  for (var i = children.length - 1; i >= 0; i--) {
    if (children[i].nodeType===1 && children[i].getAttribute('id')===id) {
      return children[i];
    } else {
      var found = hui.get.byId(children[i],id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * Find first descendant by tag (excluding self)
 * @param {Element} node The node to start from, will start from body if null
 * @param {String} tag The name of the node to find
 * @returns {Element} The found element or null
 */
hui.get.firstByTag = function(node,tag) {
  node = hui.get(node) || document.body;
  if (node.querySelector && tag!=='*') {
    return node.querySelector(tag);
  }
  var children = node.getElementsByTagName(tag);
  return children[0];
};


hui.get.firstChild = hui.dom.firstChild;

hui.find = function(selector,context) {
  return (context || document).querySelector(selector);
};

hui.findAll = function(selector,context) {
  var nl = (context || document).querySelectorAll(selector);
  return Array.prototype.slice.call(nl);
};

hui.closest = function(selector, context) {
  var parent = context;
  while (parent && parent.nodeType === 1) {
    if (hui.matches(parent, selector)) {
      return parent;
    }
    parent = parent.parentNode;
  }
};

hui.matches = function(node, selector) {
  var docEl = document.documentElement,
    matches = docEl.matches || docEl.webkitMatchesSelector || docEl.mozMatchesSelector || docEl.msMatchesSelector || docEl.oMatchesSelector;
  return matches.call(node, selector);
};

if (!document.querySelector) {
  hui.find = function(selector,context) {
    context = context || document.documentElement;
    if (selector[0] == '.') {
      return hui.get.firstByClass(context,selector.substr(1));
    } else {
      return hui.get.firstByTag(context,selector);
    }
  };
}

hui.collect = function(selectors,context) {
  var copy = {};
  for (var key in selectors) {
    copy[key] = hui.find(selectors[key],context);
  }
  return copy;
};







//////////////////////// Elements ///////////////////////////


/**
 * Builds an element with the «name» and «options»
 *
 * @param {String} name The name of the new element (. adds class)
 * @param {Object} options The options
 * @param {String} options.html Inner HTML
 * @param {String} options.text Inner text
 * @param {String} options.className
 * @param {String} options.class
 * @param {Object} options.style Map of styles (see: hui.style.set)
 * @param {Element} options.parent
 * @param {Element} options.parentFirst
 * @param {Element} options.before
 * @param {Document} doc (Optional) The document to create the element for
 * @returns {Element} The new element
 */
hui.build = function(name,options,doc) {
  doc = doc || document;
  var cls = '';
  if (name.indexOf('.') !== -1) {
    var split = name.split('.');
    name = split[0];
    for (var i = 1; i < split.length; i++) {
      if (i>1) {cls+=' ';}
      cls+=split[i];
    }
  }
  var e = doc.createElement(name);
  if (cls) {
    e.className = cls;
  }
  if (options) {
    for (var prop in options) {
      if (prop=='text') {
        e.appendChild(doc.createTextNode(options.text));
      } else if (prop=='html') {
        e.innerHTML=options.html;
      } else if (prop=='parent' && hui.isDefined(options.parent)) {
        options.parent.appendChild(e);
      } else if (prop=='parentFirst') {
        if (options.parentFirst.childNodes.length === 0) {
          options.parentFirst.appendChild(e);
        } else {
          options.parentFirst.insertBefore(e,options.parentFirst.childNodes[0]);
        }
      } else if (prop=='children') {
        for (var i = 0; i < options.children.length; i++) {
          e.appendChild(options.children[i]);
        }
      } else if (prop=='before') {
        options.before.parentNode.insertBefore(e,options.before);
      } else if (prop=='className') {
        hui.cls.add(e,options.className);
      } else if (prop=='class') {
        hui.cls.add(e,options['class']);
      } else if (prop=='style' && typeof(options[prop])=='object') {
        hui.style.set(e,options[prop]);
      } else if (prop=='style' && (hui.browser.msie7 || hui.browser.msie6)) {
        e.style.setAttribute('cssText',options[prop]);
      } else if (hui.isDefined(options[prop])) {
        e.setAttribute(prop,options[prop]);
      }
    }
  }
  return e;
};








/////////////////////// Position ///////////////////////

/**
 * Functions for getting and changing the position of elements
 * @namespace
 */
hui.position = {
  getTop : function(element) {
    element = hui.get(element);
    if (element) {
      var top = element.offsetTop,
        tempEl = element.offsetParent;
      while (tempEl !== null) {
        top += tempEl.offsetTop;
        tempEl = tempEl.offsetParent;
      }
      return top;
    }
    else return 0;
  },
  getLeft : function(element) {
    element = hui.get(element);
    if (element) {
      var left = element.offsetLeft,
        tempEl = element.offsetParent;
      while (tempEl !== null) {
        left += tempEl.offsetLeft;
        tempEl = tempEl.offsetParent;
      }
      return left;
    }
    else return 0;
  },
  get : function(element) {
    return {
      left : hui.position.getLeft(element),
      top : hui.position.getTop(element)
    };
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

    if (options.top) {
      top += options.top;
    }
    if (options.left) {
      left += options.left;
    }

    if (options.insideViewPort) {
      var w = hui.window.getViewWidth();
      if (left + src.clientWidth > w) {
        left = w - src.clientWidth - (options.viewPortMargin || 0);
      }
      if (left < 0) {left=0;}
      if (top < 0) {top=0;}

      var height = hui.window.getViewHeight();
      var vertMax = hui.window.getScrollTop()+hui.window.getViewHeight()-src.clientHeight,
        vertMin = hui.window.getScrollTop();
      top = Math.max(Math.min(top,vertMax),vertMin);
    }
    src.style.top = Math.round(top)+'px';
    src.style.left = Math.round(left)+'px';
  },
  /** Get the remaining height within parent when all siblings has used their height */
  getRemainingHeight : function(element) {
    var height = element.parentNode.clientHeight;
    var siblings = element.parentNode.childNodes;
    for (var i=0; i < siblings.length; i++) {
      var sib = siblings[i];
      if (sib!==element && hui.dom.isElement(siblings[i])) {
        if (hui.style.get(sib,'position')!='absolute') {
          height-=sib.offsetHeight;
        }
      }
    }
    return height;
  }
};







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
   * @param {Object} options {element:«the element to scroll to»,duration:«milliseconds»,top:«disregarded pixels at top»}
   */
  scrollTo : function(options) {
    options = hui.override({duration:0,top:0},options);
    var node = options.element;
    var pos = hui.position.get(node);
    var viewTop = hui.window.getScrollTop();
    var viewHeight = hui.window.getViewHeight();
    var viewBottom = viewTop+viewHeight;
    if (viewTop < pos.top + node.clientHeight || (pos.top)<viewBottom) {
      var top = pos.top - Math.round((viewHeight - node.clientHeight) / 2);
      top-= options.top/2;
      top = Math.max(0, top);

      var startTime = new Date().getTime();
      var func;

      func = function() {
        var pos = (new Date().getTime()-startTime)/options.duration;
        if (pos>1 || isNaN(pos)) {
          pos = 1;
        }
        var scrl = viewTop+Math.round((top-viewTop)*hui.ease.fastSlow(pos));
        window.scrollTo(0, scrl);
        if (pos<1) {
          window.setTimeout(func);
        }
      };
      func();
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
    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    } else if (document.body) {
      return document.body.clientWidth;
    }
    return window.innerWidth;
  }
};













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
      return false;
    }
    if (element.hasClassName) {
      return element.hasClassName(className);
    }
    if (element.className==className) {
      return true;
    }
    if (element.className.animVal!==undefined) {
      return false; // TODO (handle SVG stuff)
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
    if (!element || !className) {
      return;
    }
    if (element.classList && className.indexOf(' ') === -1) {
      element.classList.add(className);
    } else if (element.addClassName) {
      element.addClassName(className);
    } else {
      hui.cls.remove(element, className);
      element.className += ' ' + className;
    }
  },
  /**
   * Remove a class from an element
   * @param {Element} element The element to remove the class from
   * @param {String} className The class
   */
  remove : function(element, className) {
    element = hui.get(element);
    if (!element || !element.className) {return;}
    if (element.removeClassName) {
      element.removeClassName(className);
    }
    if (element.className==className) {
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
};




///////////////////// Events //////////////////

hui.on = function(node,event,func,bind) {
  if (arguments.length == 1 && typeof(node) == 'function') {
    return hui.onReady(node);
  }
  if (arguments.length == 2 && typeof(event) == 'function' && hui.isArray(node)) {
    return hui._runOrPostpone.apply(hui, arguments);
  }
  if (event=='tap') {
    if (bind) {
      func = func.bind(bind);
    }
    var moved = false;
    var touched = false;
    hui.listen(node,'touchstart',function() {
      touched = true;
      moved = false;
    },bind);
    hui.listen(node,'touchmove',function() {
      moved = true;
    },bind);
    /*hui.listen(node,'touchcancel',function() {
      hui.log('cancel')
    },bind);*/
    hui.listen(node,'touchend',function(ev) {
      touched = false;
      if (!moved) {
        touched = true;
        hui._callListener(func, ev);
      }
    },bind);
    hui.listen(node,'click',function(ev) {
      if (!moved && !touched) {
        hui._callListener(func, ev);
      }
    },bind);
  } else {
    hui.listen(node,event,func,bind);
  }
};

hui._callListener = function(listener, ev) {
  if (typeof(listener)=='function') {
    listener(ev);
  } else {
    for (var key in listener) {
      if (listener.hasOwnProperty(key)) {
        var found = hui.closest(key, ev.target);
        if (found) {
          listener[key](found, ev);
          return;
        }
      }
    }
  }
};

/**
 * Add an event listener to an element
 * @param {Element} element The element to listen on
 * @param {String} type The event to listen for
 * @param {Function} listener The function to be called
 * @param {object} ?bindTo Bind the listener to it
 */
hui.listen = function(element, type, listener, bindTo) {
  element = hui.get(element);
  if (!element) {
    return;
  }
  var l = listener;
  if (typeof(listener)!=='function') {
    l = function(e) {
      hui._callListener(listener, e);
    }
  }
  else if (bindTo) {
    l = listener.bind(bindTo);
  }
  if(document.addEventListener) {
    element.addEventListener(type, l);
  } else {
    element.attachEvent('on'+type, l);
  }
};

/**
 * Add an event listener to an element, it will only fire once
 * @param {Element} element The element to listen on
 * @param {String} type The event to listen for
 * @param {Function} listener The function to be called
 */
hui.listenOnce = function(element,type,listener) {
  var func = null;
  func = function(e) {
    hui.unListen(element,type,func);
    listener(e);
  };
  hui.listen(element,type,func);
};

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
};

/** Creates an event wrapper for an event
 * @param event The DOM event
 * @returns {hui.Event} An event wrapper
 */
hui.event = function(event) {
  if (event!==undefined && event.huiEvent===true) {
    return event;
  }
  return new hui.Event(event);
};

/**
 * Wrapper for events
 * @class
 * @param event {Event} The DOM event
 */
hui.Event = function(event) {
  this.huiEvent = true;
  /** The event */
  this.event = event = event || window.event;

  if (!event) {
    hui.log('No event');
  }

  /** The target element */
  this.element = event.target ? event.target : event.srcElement;
  /** If the shift key was pressed */
  this.shiftKey = event.shiftKey;
  /** If the alt key was pressed */
  this.altKey = event.altKey;
  /** If the command key was pressed */
  this.metaKey = event.metaKey;
  /** If the return key was pressed */
  this.returnKey = event.keyCode==13;
  /** If the escape key was pressed */
  this.escapeKey = event.keyCode==27;
  /** If the space key was pressed */
  this.spaceKey = event.keyCode==32;
  /** If the backspace was pressed */
  this.backspaceKey = event.keyCode==8;
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
};

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
    return hui.closest('.' + cls, this.element);
  },
  /** Finds the nearest ancester with a certain tag name
   * @param tag The tag name
   * @returns {Element} The found element or null
   */
  findByTag : function(tag) {
    return hui.closest(tag, this.element);
  },
  /* @Deprecated */
  find : function(func) {
    return this.closest(func);
  },
  closest : function(func) {
    if (hui.isString(func)) {
      return hui.closest(func, this.element);
    }
    var parent = this.element;
    while (parent) {
      if (func(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return null;
  },
  isDescendantOf : function(node) {
    var parent = this.element;
    while (parent) {
      if (parent===node) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  },
  /** Stops the event from propagating */
  stop : function() {
    hui.stop(this.event);
  },
  prevent : function() {
    if (this.event.preventDefault) {
      this.event.preventDefault();
    }
  }
};

/**
 * Stops an event from propagating
 * @param event A standard DOM event, NOT an hui.Event
 */
hui.stop = function(event) {
  if (!event) {event = window.event;}
  if (event.stopPropagation) {event.stopPropagation();}
  if (event.preventDefault) {event.preventDefault();}
  event.cancelBubble = true;
  event.stopped = true;
};

hui._ = hui._ || [];

hui._ready = document.readyState == 'complete';// || document.readyState;
// TODO Maybe interactive is too soon???

hui.onReady = function() {
  if (hui._ready) {
    hui._runOrPostpone.apply(hui, arguments);
  } else {
    hui._.push(arguments);
  }
};

hui.onDraw = function(func) {
  window.setTimeout(func,13);
};

hui.onDraw = (function(vendors,window) {
  var found = window.requestAnimationFrame;
  for(var x = 0; x < vendors.length && !found; ++x) {
      found = window[vendors[x]+'RequestAnimationFrame'];
  }
  return found ? found.bind(window) : hui.onDraw;
})(['ms', 'moz', 'webkit', 'o'],window);

/**
 * Execute a function when the DOM is ready
 * @param delegate The function to execute
 */
hui._onReady = function(delegate) {
  if (document.readyState == 'interactive') {
    window.setTimeout(delegate);
  }
  else if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded',delegate,false);
  }
  else if (window.attachEvent) {
    document.attachEvent("onreadystatechange", function(){
      if(document.readyState === "complete"){
        document.detachEvent("onreadystatechange", arguments.callee);
        delegate();
      }
    });
  }
};







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
 *  $success : function(transport) {
 *    // when status is 200
 *  },
 *  $forbidden : function(transport) {
 *    // when status is 403
 *  },
 *  $abort : function(transport) {
 *    // when request is aborted
 *  },
 *  $failure : function(transport) {
 *    // when status is not 200 (if status is 403 and $forbidden is set then $failure will not be called)
 *  },
 *  $exception : function(exception,transport) {
 *    // When an exception has occurred while calling on«Something», If not set the exception will be thrown
 *  },
 *  $progress : function(current,total) {
 *    // Progress for file uploads (maybe also other requests?)
 *  },
 *  $load : functon() {
 *    // When file upload is transfered?
 *  }
 *}
 * </pre>
 *
 * @param options The options
 * @returns {XMLHttpRequest} The transport
 */
hui.request = function(options) {
  options = hui.override({
    method : 'POST',
    async : true,
    headers : {Accept : 'application/json'}
  },options);
  var transport = new XMLHttpRequest();
  if (options.credentials) {
    transport.withCredentials = true;
  }
  if (!transport) {return;}
  transport.onreadystatechange = function() {
    if (transport.readyState == 4) {
      if (transport.status == 200 && options.$success) {
        options.$success(transport);
      } else if (transport.status == 403 && options.$forbidden) {
        options.$forbidden(transport);
      } else if (transport.status !== 0 && options.$failure) {
        options.$failure(transport);
      } else if (transport.status === 0 && options.$abort) {
        options.$abort(transport);
      }
      if (options.$finally) {
        options.$finally();
      }
    }
  };
  var method = options.method.toUpperCase();
  var url = options.url;
  if (method == 'DELETE' && options.parameters) {
    url += '?' + hui.request._buildPostBody(options.parameters)
  }
  else if (method == 'GET' && options.parameters) {
    url += '?' + hui.request._buildPostBody(options.parameters)
  }
  transport.open(method, url, options.async);
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
        for (var param in options.parameters) {
          var value = options.parameters[param];
          if (hui.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              body.append(param, value[i]);
            }
          } else {
            body.append(param, value);
          }
        }
      }
    }
    if (options.$progress) {
      transport.upload.addEventListener("progress", function(e) {
        options.$progress(e.loaded,e.total);
      }, false);
    }
    if (options.$load) {
      transport.upload.addEventListener("load", function(e) {
        options.$load();
      }, false);
    }
  } else if (method == 'POST' && options.files) {
    body = new FormData();
    //form.append('path', '/');
    for (var j = 0; j < options.files.length; j++) {
      body.append('file'+j, options.files[j]);
    }
  } else if (options.parameters && method !== 'DELETE') {
    body = hui.request._buildPostBody(options.parameters);
    transport.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
  } else if (options.data) {
    transport.setRequestHeader("Content-type", "application/json; charset=utf-8");
    body = JSON.stringify(options.data);
  } else {
    body = '';
  }
  if (options.headers) {
    for (var name in options.headers) {
      transport.setRequestHeader(name, options.headers[name]);
    }
  }
  transport.send(body);
  //hui.request._transports.push(transport);
  //hui.log('Add: '+hui.request._transports.length);
  return transport;
};

/*
hui.request._transports = [];

hui.request._forget = function(t) {
  hui.log('Forget: '+hui.request._transports.length);
  hui.array.remove(hui.request._transports, t);
}

hui.request.abort = function() {
  window.stop();
  for (var i = hui.request._transports.length - 1; i >= 0; i--){
    hui.log('aborting: '+hui.request._transports[i].readyState)
    hui.request._transports[i].abort();
  };
}*/

/**
 * Check if a http request has a valid XML response
 * @param {XMLHttpRequest} t The request
 * @return true if a valid XML request exists
 */
hui.request.isXMLResponse = function(t) {
  return t.responseXML && t.responseXML.documentElement && t.responseXML.documentElement.nodeName!='parsererror';
};

hui.request._buildPostBody = function(parameters) {
  if (!parameters) return null;
  var output = '',
    param, i;
    if (hui.isArray(parameters)) {
      for (i = 0; i < parameters.length; i++) {
        param = parameters[i];
        if (i > 0) {output += '&';}
        output+=encodeURIComponent(param.name)+'=';
        if (param.value!==undefined && param.value!==null) {
          output+=encodeURIComponent(param.value);
        }
      }
    } else {
      for (param in parameters) {
        var value = parameters[param];
        if (hui.isArray(value)) {
          for (i = 0; i < value.length; i++) {
            if (output.length > 0) {output += '&';}
            output += encodeURIComponent(param)+'=';
            if (value[i]!==undefined && value[i]!==null) {
              output += encodeURIComponent(value[i]);
            }
          }
        } else {
          if (output.length > 0) {output += '&';}
          output += encodeURIComponent(param)+'=';
          if (value!==undefined && value!==null) {
            output += encodeURIComponent(value);
          }
        }
      }
    }
  return output;
};

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
      var property = styles[i];
      var value = hui.style.get(source,property);
      if (value) {
        target.style[hui.string.camelize(property)] = value;
      }
    }
  },
  set : function(element,styles) {
    for (var style in styles) {
      if (style==='transform') {
        element.style.webkitTransform = styles[style];
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
    return value == 'auto' ? '' : value;
  },
  /** Cross browser way of setting opacity */
  setOpacity : function(element,opacity) {
    if (!hui.browser.opacity) {
      if (opacity==1) {
        element.style.filter = null;
      } else {
        element.style.filter = 'alpha(opacity='+(opacity*100)+')';
      }
    } else {
      element.style.opacity = opacity;
    }
  },
  length : function(value) {
    if (typeof(value) === 'number') {
      return value + 'px';
    }
    return value;
  }
};






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
};






/////////////////// Selection /////////////////////

/** @namespace */
hui.selection = {
  /** Clear the text selection */
  clear : function() {
    var sel ;
    if(document.selection && document.selection.empty ){
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
      if (typeof(range.commonAncestorContainer) == 'function') {
        return range.commonAncestorContainer(); // TODO Not sure why?
      }
      return range.commonAncestorContainer;
    }
    return null;
  },
  get : function(doc) {
    return {
      node : hui.selection.getNode(doc),
      text : hui.selection.getText(doc)
    };
  },
  enable : function(on) {
    document.onselectstart = on ? null : function () { return false; };
    document.body.style.webkitUserSelect = on ? null : 'none';
  }
};





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
   * @param {Object} options {element : «Element», duration : «milliseconds», delay : «milliseconds», $complete : «Function» }
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
      $complete : options.onComplete || options.$complete
    });
  },
  /**
   * Fade an element out - making it invisible
   * @param {Object} options {element : «Element», duration : «milliseconds», delay : «milliseconds», $complete : «Function» }
   */
  fadeOut : function(options) {
    hui.animate({
      node : options.element,
      css : { opacity : 0 },
      delay : options.delay || null,
      duration : options.duration || 500,
      hideOnComplete : true,
      complete : options.onComplete || options.$complete
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

  },
  /**
   * Make an element shake
   * @param {Object} options {element : «Element», duration : «milliseconds» }
   */
  shake : function(options) {
    this._do(options.element,'hui_effect_shake',options.duration || 1000);
  },
  /**
   * Make an element shake
   * @param {Object} options {element : «Element», duration : «milliseconds» }
   */
  tada : function(options) {
    this._do(options.element,'hui_effect_tada',1000);
  },
  _do : function(e,cls,time) {
    e = hui.ui.getElement(e);
    hui.cls.add(e,cls);
    window.setTimeout(function() {
      hui.cls.remove(e,cls);
    },time);
  }
};








/////////////////////////////// Drag ///////////////////////////

/** @namespace */
hui.drag = {
  /** Register dragging on an element
   * <pre><strong>options:</strong> {
   *  element : «Element»
   *  <em>see hui.drag.start for more options</em>
   * }
   * @param {Object} options The options
   * @param {Element} options.element The element to attach to
   */
  attach : function(options) {
    var touch = options.touch && hui.browser.touch;
    hui.listen(options.element,touch ? 'touchstart' : 'mousedown',function(e) {
      e = hui.event(e);
      // TODO This shuould be a hui.Event
      if (options.$check && options.$check(e)===false) {
        return;
      }
      e.stop();
      hui.drag.start(options,e);
    });
  },
  register : function(options) {
    this.attach(options);
  },
  /** Start dragging
   * <pre><strong>options:</strong> {
   *  onBeforeMove ($firstMove) : function(event), // Called when the cursor moves for the first time
   *  onMove ($move): function(event), // Called when the cursor moves
   *  onAfterMove ($didMove): function(event), // Called if the cursor has moved
   *  onNotMoved ($notMoved): function(event), // Called if the cursor has not moved
   *  onEnd ($finally) : function(event), // Called when the mouse is released, even if the cursor has not moved
   * }
   * @param {Object} options The options
   * @param {function} options.$before When the user starts interacting (mousedown/touchstart)
   * @param {function} options.$startMove When the user starts moving (before first move - called once)
   * @param {function} options.$move When the user moves
   * @param {function} options.$endMove After a move has finished
   * @param {function} options.$notMoved If the user started interacting but did not move (maybe treat as click/tap)
   * @param {function} options.$finally After everything - moved or not
   */
  start : function(options,e) {
    var win = options.window || window;
    var root = window.document.body.parentNode;
    var target = hui.browser.msie ? win.document : win;
    var touch = options.touch && hui.browser.touch;
    if (options.$before) options.$before();
    if (options.onStart) options.onStart();
    var latest = {
      x: e.getLeft(),
      y: e.getTop(),
      time: Date.now()
    };
    var initial = latest;
    var mover,
      upper,
      moved = false;
    mover = function(e) {
      e = hui.event(e);
      e.stop(e);
      if (!moved) {
        if (options.onBeforeMove) options.onBeforeMove(e); // TODO: deprecated
        if (options.$startMove) options.$startMove(e);
      }
      moved = true;
      if (options.onMove) options.onMove(e);
      if (options.$move) options.$move(e);
    }.bind(this);
    hui.listen(root,touch ? 'touchmove' : 'mousemove',mover);
    upper = function(e) {
      hui.unListen(root,touch ? 'touchmove' : 'mousemove',mover);
      hui.unListen(target,touch ? 'touchend' : 'mouseup',upper);
      if (options.onEnd) options.onEnd(); // TODO: deprecated
      if (moved) {
        if (options.onAfterMove) options.onAfterMove(e); // TODO: deprecated
        if (options.$endMove) options.$endMove(e);
      } else {
        if (options.onNotMoved) options.onNotMoved(e); // TODO: deprecated
        if (options.$notMoved) options.$notMoved(e);
      }
      if (options.$finally) options.$finally();
      hui.selection.enable(true);
    }.bind(this);
    hui.listen(target,touch ? 'touchend' : 'mouseup',upper);
    hui.selection.enable(false);
  },

  _nativeListeners : [],

  _activeDrop : null,

  /** Listen for native drops
   * <pre><strong>options:</strong> {
   *  elements : «Element»,
   *  hoverClass : «String»,
   *  $drop : function(event),
   *  $dropFiles : function(fileArray),
   *  $dropURL : function(url),
   *  $dropText : function(url)
   * }
   * @param {Object} options The options
   */
  listen : function(options) {
    if (hui.browser.msie) {
      return;
    }
    hui.drag._nativeListeners.push(options);
    if (hui.drag._nativeListeners.length>1) {
            return;
        }
    hui.listen(document.body,'dragenter',function(e) {
      var l = hui.drag._nativeListeners;
      var found = null;
      for (var i=0; i < l.length; i++) {
        var lmnt = l[i].element;
        if (hui.dom.isDescendantOrSelf(e.target,lmnt)) {
          found = l[i];
          if (hui.drag._activeDrop === null || hui.drag._activeDrop != found) {
            hui.cls.add(lmnt,found.hoverClass);
          }
          break;
        }
      }
      if (hui.drag._activeDrop) {
        //var foundElement = found ? found.element : null;
        if (hui.drag._activeDrop!=found) {
          hui.cls.remove(hui.drag._activeDrop.element,hui.drag._activeDrop.hoverClass);
          if (hui.drag._activeDrop.$leave) {
            hui.drag._activeDrop.$leave(e);
          }
        } else if (hui.drag._activeDrop.$hover) {
          hui.drag._activeDrop.$hover(e);
        }

      }
      hui.drag._activeDrop = found;
    });

    hui.listen(document.body,'dragover',function(e) {
      hui.stop(e);
      if (hui.drag._activeDrop) {
        if (hui.drag._activeDrop.$hover) {
          hui.drag._activeDrop.$hover(e);
        }
      }
    });

    hui.listen(document.body,'dragend',function(e) {
      hui.log('drag end');
    });

    hui.listen(document.body,'dragstart',function(e) {
      hui.log('drag start');
    });

    hui.listen(document.body,'drop',function(e) {
      var event = hui.event(e);
      event.stop();
      var options = hui.drag._activeDrop;
      hui.drag._activeDrop = null;
      if (options) {
        hui.cls.remove(options.element,options.hoverClass);
        if (options.$drop) {
          options.$drop(e,{event:event});
        }
        if (e.dataTransfer) {
          hui.log(e.dataTransfer.types);
          if (options.$dropFiles && e.dataTransfer.files && e.dataTransfer.files.length>0) {
            options.$dropFiles(e.dataTransfer.files,{event:event});
          } else if (options.$dropURL && e.dataTransfer.types !== null && (hui.array.contains(e.dataTransfer.types,'public.url') || hui.array.contains(e.dataTransfer.types,'text/uri-list'))) {
            var url = e.dataTransfer.getData('public.url');
            var uriList = e.dataTransfer.getData('text/uri-list');
            if (url && !hui.string.startsWith(url,'data:')) {
              options.$dropURL(url,{event:event});
            } else if (uriList && !hui.string.startsWith(url,'data:')) {
              options.$dropURL(uriList,{event:event});
            }
          } else if (options.$dropText && e.dataTransfer.types !== null && hui.array.contains(e.dataTransfer.types,'text/plain')) {
            options.$dropText(e.dataTransfer.getData('text/plain'),{event:event});
          }
        }
      }
    });
  }
};


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
    }
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
    }
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
  getHash : function() {
    var h = document.location.hash;
    if (h!=='') {
      return h.substring(1);
    }
    return null;
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
   * @param params {Array} Parameters [{name:'hep',value:'hey'}]
   */
  setParameters : function(parms) {
    var query = '';
    for (var i=0; i < parms.length; i++) {
      query+= i === 0 ? '?' : '&';
      query+=parms[i].name+'='+parms[i].value;
    }
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
    if (!isNaN(value)) {
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
    }
    return parsed;
  }
};

/**
 * Run through all postponed actions in "_" and remove it afterwards
 */
hui._onReady(function() {
  hui._ready = true;
  for (var i = 0; i < hui._.length; i++) {
    var item = hui._[i];
    if (typeof(item) === 'function') {
      item = [item];
    }
    hui._runOrPostpone.apply(hui, item);
  }
  delete hui._;
});

hui = window.hui || {};

/////////////////////////// Animation ///////////////////////////

/**
 * Animate something
 * <pre><strong>options:</strong> {
 *  node : «Element»,
 *  css : { fontSize : '11px', color : '#f00', opacity : 0.5 },
 *  duration : 1000, // 1sec
 *  ease : function(num) {},
 *  $complete : function() {}
 *}
 * TODO Document options.property, options.value
 * @memberof hui
 *
 * @param {Element | Object} options Options or an element
 * @param {String} style The css property
 * @param {String} value The css value
 * @param {Number} duration The duration in milisecons
 * @param {Object} delegate The options if first param is an element
 */
hui.animate = function(options, property, value, duration, delegate) {
  if (typeof(options) == 'string' || hui.dom.isElement(options)) {
    hui.animation.get(options).animate(null, value, property, duration, delegate);
  } else {
    var item = hui.animation.get(options.node);
    if (options.property) {
      item.animate(null, options.value, options.property, options.duration, options);
    } else if (!options.css) {
      item.animate(null, '', '', options.duration, options);
    } else {
      var o = options;
      for (var prop in options.css) {
        item.animate(null, options.css[prop], prop, options.duration, o);
        o = hui.override({}, options);
        o.$complete = undefined;
      }
    }
  }
};


/** @namespace */
hui.animation = {
  objects: {},
  running: false,
  latestId: 0,

  /**
   * Get an animation item for a node
   * @return hui.animation.Item
   */
  get: function(element) {
    element = hui.get(element);
    if (!element.huiAnimationId) {
      element.huiAnimationId = this.latestId++;
    }
    if (!this.objects[element.huiAnimationId]) {
      this.objects[element.huiAnimationId] = new hui.animation.Item(element);
    }
    return this.objects[element.huiAnimationId];
  },

  /**
   * Start animating any pending tasks
   */
  start: function() {
    if (!this.running) {
      hui.animation._render();
    }
  }
};


hui.animation._lengthUpater = function(element,v,work) {
  element.style[work.property] = (work.from + (work.to - work.from) * v) + (work.unit ? work.unit : '');
};

hui.animation._transformUpater = function(element, v, work) {
  var t = work.transform;
  var str = '';
  if (t.rotate) {
    str += ' rotate(' + (t.rotate.from + (t.rotate.to - t.rotate.from) * v) + t.rotate.unit + ')';
  }
  if (t.scale) {
    str += ' scale(' + (t.scale.from + (t.scale.to - t.scale.from) * v) + ')';
  }
  element.style[hui.animation.TRANSFORM] = str;
};

hui.animation._colorUpater = function(element, v, work) {
  var red = Math.round(work.from.red + (work.to.red - work.from.red) * v);
  var green = Math.round(work.from.green + (work.to.green - work.from.green) * v);
  var blue = Math.round(work.from.blue + (work.to.blue - work.from.blue) * v);
  if (work.to.alpha < 255 || work.from.alpha < 255) {
    var alpha = Math.max(0,Math.min(1,work.from.alpha + (work.to.alpha - work.from.alpha) * v));
    element.style[work.property] = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
  } else {
    element.style[work.property] = 'rgb(' + red + ',' + green + ',' + blue + ')';
  }
};

hui.animation._propertyUpater = function(element, v, work) {
  element[work.property] = Math.round(work.from+(work.to-work.from)*v);
};

hui.animation._ieOpacityUpdater = function(element, v, work) {
  var opacity = (work.from + (work.to - work.from) * v);
  if (opacity == 1) {
    element.style.removeAttribute('filter');
  } else {
    element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
  }
};

hui.animation._render = function() {
  hui.animation.running = true;
  var next = false,
  stamp = Date.now();
  for (var id in hui.animation.objects) {
    var obj = hui.animation.objects[id];
    if (obj.work) {
      var element = obj.element;
      for (var i=0; i < obj.work.length; i++) {
        var work = obj.work[i];
        if (work.finished) {
          continue;
        }
        var place = (stamp-work.start)/(work.end-work.start);
        if (place < 0) {
          next = true;
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
        if (work.delegate && work.delegate.$render) {
          work.delegate.$render(element,v);
        } else if (work.delegate && work.delegate.callback) {
          work.delegate.callback(element,v);
        } else if (work.updater) {
          work.updater(element,v,work);
        }
        if (place==1) {
          work.finished = true;
          if (work.delegate && work.delegate.$complete) {
            window.setTimeout(work.delegate.$complete);
          } else if (work.delegate && work.delegate.onComplete) {
            window.setTimeout(work.delegate.onComplete);
          } else if (work.delegate && work.delegate.hideOnComplete) {
            element.style.display='none';
          }
        }
      }
    }
  }
  if (next) {
    hui.onDraw(hui.animation._render);
  } else {
    hui.animation.running = false;
  }
};

hui.animation._parseStyle = function(value) {
  var parsed = {type:null,value:null,unit:null};
  var match;
  if (!hui.isDefined(value)) {
    return parsed;
  }
  if (!isNaN(value)) {
    parsed.value=parseFloat(value);
    return parsed;
  }
  match = value.match(/([\-]?[0-9\.]+)(px|pt|%)/);
  if (match) {
    parsed.type = 'length';
    parsed.value = parseFloat(match[1]);
    parsed.unit = match[2];
    return parsed;
  }
  match = match=value.match(/rgb\(([0-9]+),[ ]?([0-9]+),[ ]?([0-9]+)\)/);
  if (match) {
    parsed.type = 'color';
    parsed.value = {
      red:parseInt(match[1]),
      green:parseInt(match[2]),
      blue:parseInt(match[3]),
      alpha:1
    };
    return parsed;
  }
  match=value.match(/rgba\(([0-9]+),[ ]?([0-9]+),[ ]?([0-9]+),[ ]?([\.0-9]+)\)/);
  if (match) {
    parsed.type = 'color';
    parsed.value = {
      red:parseInt(match[1]),
      green:parseInt(match[2]),
      blue:parseInt(match[3]),
      alpha:parseFloat(match[4]),
    };
    return parsed;
  }
  var color = new hui.Color(value);
  if (color.ok) {
    parsed.type = 'color';
    parsed.value = {
      red:color.r,
      green:color.g,
      blue:color.b,
      alpha:1
    };
  }
  return parsed;
};

///////////////////////////// Item ///////////////////////////////

/**
 * An animation item describing what to animate on an element
 * @constructor
 */
hui.animation.Item = function(element) {
  this.element = element;
  this.work = [];
};

hui.animation.Item.prototype.animate = function(from,to,property,duration,delegate) {
  var work = this.getWork(hui.string.camelize(property));
  work.delegate = delegate;
  work.finished = false;
  var css = !(property=='scrollLeft' || property=='scrollTop' || property==='');
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
    } else if (parsed.type=='color') {
      work.updater = hui.animation._colorUpater;
    } else {
      work.updater = hui.animation._lengthUpater;
    }
  } else {
    work.to = to;
    work.unit = null;
    work.updater = hui.animation._propertyUpater;
  }
  work.start = Date.now();
  if (delegate && delegate.delay) {
    work.start+=delegate.delay;
  }
  work.end = work.start+duration;
  hui.animation.start();
};

hui.animation.TRANSFORM = (function() {
  var agent = navigator.userAgent;
  var gecko = agent.indexOf('Gecko') !== -1 && agent.indexOf('WebKit') === -1;
  return gecko ? 'MozTransform' : 'WebkitTransform';
})();

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
};

hui.animation.Item.prototype._getIEOpacity = function(element) {
  var filter = hui.style.get(element,'filter').toLowerCase();
  var match = filter.match(/opacity=([0-9]+)/);
  if (match) {
    return parseFloat(match[1])/100;
  } else {
    return 1;
  }
};

hui.animation.Item.prototype.getWork = function(property) {
  for (var i = this.work.length - 1; i >= 0; i--) {
    if (this.work[i].property===property) {
      return this.work[i];
    }
  }
  var work = {property:property};
  this.work[this.work.length] = work;
  return work;
};

/////////////////////////////// Loop ///////////////////////////////////

/** @constructor */
hui.animation.Loop = function(recipe) {
  this.recipe = recipe;
  this.position = -1;
  this.running = false;
};

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
  window.setTimeout(function() {self.next();},time);
};

hui.animation.Loop.prototype.start = function() {
  this.running=true;
  this.next();
};

/** @namespace */
hui.ease = {
  slowFastSlow : function(val) {
    var a = 1.6;
    var b = 1.4;
    return -1*Math.pow(Math.cos((Math.PI/2)*Math.pow(val,a)),Math.pow(Math.PI,b))+1;
  },
  fastSlow : function(val) {
    var a = 0.5;
    var b = 0.7;
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
      return (7.5625*(t-=(1.5/2.75))*t + 0.75);
    } else if (t < (2.5/2.75)) {
      return (7.5625*(t-=(2.25/2.75))*t + 0.9375);
    } else {
      return (7.5625*(t-=(2.625/2.75))*t + 0.984375);
    }
  },
  flicker : function(value) {
    if (value==1) return 1;
    return Math.random()*value;
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
    if(n<1){ return Math.pow(n, 5) / 2; }
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
    return (n===0) ? 0 : Math.pow(2, 10 * (n - 1));
  },

  expoOut: function(/* Decimal? */n){
    return (n==1) ? 1 : (-1 * Math.pow(2, -10 * n) + 1);
  },

  expoInOut: function(/* Decimal? */n){
    if (n===0) { return 0; }
    if (n===1) { return 1; }
    n = n*2;
    if (n<1) { return Math.pow(2, 10 * (n-1)) / 2; }
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
    //  slowly comes back.
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
    if(n===0){ return 0; }
    if(n==1){ return 1; }
    var p = 0.3;
    var s = p/4;
    n = n - 1;
    return -1 * Math.pow(2,10*n) * Math.sin((n-s)*(2*Math.PI)/p);
  },

  elasticOut: function(/* Decimal? */n){
    // summary: An easing function that elasticly snaps around the target value, near the end of the Animation
    if(n===0) return 0;
    if(n==1) return 1;
    var p = 0.3;
    var s = p/4;
    return Math.pow(2,-10*n) * Math.sin((n-s)*(2*Math.PI)/p) + 1;
  },

  elasticInOut: function(/* Decimal? */n){
    // summary: An easing function that elasticly snaps around the value, near the beginning and end of the Animation
    if(n===0) return 0;
    n = n*2;
    if(n==2) return 1;
    var p = 0.3*1.5;
    var s = p/4;
    if(n<1){
      n-=1;
      return -0.5*(Math.pow(2,10*n) * Math.sin((n-s)*(2*Math.PI)/p));
    }
    n-=1;
    return 0.5 * (Math.pow(2, -10 * n) * Math.sin((n - s) * ( 2 * Math.PI) / p)) + 1;
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
      l = s * Math.pow(n, 2) + 0.75;
    }else if(n < (2.5 / p)){
      n -= (2.25 / p);
      l = s * Math.pow(n, 2) + 0.9375;
    }else{
      n -= (2.625 / p);
      l = s * Math.pow(n, 2) + 0.984375;
    }
    return l;
  },

  bounceInOut: function(/* Decimal? */n){
    if(n<0.5){ return hui.ease.bounceIn(n*2) / 2; }
    return (hui.ease.bounceOut(n*2-1) / 2) + 0.5; // Decimal
  }
};

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

hui.on(function() {
  hui.define('hui.animation',hui.animation);
});

hui = window.hui || {};

/** @constructor
 * @param str The color like red or rgb(255, 0, 0) or #ff0000 or rgb(100%, 0%, 0%)
 */
hui.Color = function(str) {
  this.ok = false;
  if (hui.isArray(str) && str.length==3) {
    this.r = str[0];
    this.g = str[1];
    this.b = str[2];
  }
  if (hui.isBlank(str) || !hui.isString(str)) {
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
      re: /^rgb\((\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
      process: function (bits) {
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
      var channels = processor(bits);
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
};

hui.Color.prototype = {
  r : 0, g: 0, b: 0,

  /** Get the color as rgb(255,0,0) */
  toRGB : function () {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  },
  isDefined : function() {
    return !(this.r===undefined || this.g===undefined || this.b===undefined);
  },
  /** Get the color as #ff0000 */
  toHex : function() {
    if (!this.isDefined()) {return null;}
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
};

hui.Color.table = {
  white : 'ffffff',
  black : '000000',
  red : 'ff0000',
  green : '00ff00',
  blue : '0000ff'
};

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
  };
};

hui.Color.hsv2rgb = function (Hdeg,S,V) {
  var H = Hdeg/360,R,G,B;     // convert from degrees to 0 to 1
  if (S===0) {       // HSV values = From 0 to 1
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
    if (i===0) {
      var_r=V ;
      var_g=var_3;
      var_b=var_1;
    }
    else if (i===1) {
      var_r=var_2;
      var_g=V;
      var_b=var_1;
    }
    else if (i==2) {
      var_r=var_1;
      var_g=V;
      var_b=var_3;
    }
    else if (i==3) {
      var_r=var_1;
      var_g=var_2;
      var_b=V;
    }
    else if (i==4) {
      var_r=var_3;
      var_g=var_1;
      var_b=V;
    }
    else {
      var_r=V;
      var_g=var_1;
      var_b=var_2;
    }
    R = Math.round(var_r*255);   //RGB results = From 0 to 255
    G = Math.round(var_g*255);
    B = Math.round(var_b*255);
  }
  return new Array(R,G,B);
};

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
  if (max === 0) {
    saturation = 0;
  } else {
    saturation = 1 - (min/max);
  }

  return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];
};

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
};

hui.on(function() {
  hui.define('hui.Color',hui.Color);
});

/*
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
            if (done) {done();}
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

  win.hui.require = $script

}(this, document, setTimeout);


hui.parallax = {

  _listeners : [],

  _init : function() {
    if (this._listening) {
      return;
    }
    this._listening = true;
    hui.listen(window,'scroll',this._scroll.bind(this));
    hui.listen(window,'resize',this._resize.bind(this));
    hui.onReady(this._resize.bind(this));
  },
  _resize : function() {
    for (var i = this._listeners.length - 1; i >= 0; i--) {
      var l = this._listeners[i];
      if (l.$resize) {
        l.$resize(hui.window.getViewWidth(),hui.window.getViewHeight());
      }
    }
    this._scroll();
  },
  _scroll : function() {
    var pos = hui.window.getScrollTop(),
      viewHeight = hui.window.getViewHeight();
    for (var i = this._listeners.length - 1; i >= 0; i--) {
      var l = this._listeners[i];
      if (!l.$scroll) {
        continue;
      }
      if (l.debug && !l.debugElement) {
        l.debugElement = hui.build('div',{style:'position: absolute; border-top: 1px solid red; left: 0; right: 0;',parent:document.body});
      }

      if (l.element) {
        var top = hui.position.getTop(l.element);
        top+= l.element.clientHeight/2;
        var diff = top-pos;
        var scroll = ( diff / viewHeight);
        if (l.debugElement) {
          l.debugElement.style.top = top+'px';
          l.debugElement.innerHTML = '<span>'+scroll+'</span>';
        }
        l.$scroll( scroll );
        continue;
      }

      var x = (pos-l.min)/(l.max-l.min);
      var y = hui.between(0,x,1);

      if (l._latest!==y) {
        l.$scroll(y);
        l._latest=y;
      }
    }
  },

  listen : function(info) {
    this._listeners.push(info);
    this._init();
  }
};

hui.on(function() {
  hui.define('hui.parallax', hui.parallax);
});

hui.store = {

  isSupported: function() {
    try {
      return hui.isDefined(window.localStorage);
    } catch (e) {
      return false;
    }
  },

  set : function(key, value) {
    if (this.isSupported()) {
      localStorage.setItem(key, value);
    }
  },
  get : function(key) {
    if (this.isSupported()) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setObject : function(key, value) {
    this.set(key,hui.string.toJSON(value));
  },
  getObject : function(key) {
    return hui.string.fromJSON(this.get(key));
  }
};

hui = window.hui || {};

hui.query = function(q, ctx) {
  return new hui.Query(hui.findAll(q, ctx));
};

hui.Query = function(context) {
  this._context = context;
};

hui.Query.prototype = {
  addClass : function(cls) {
    return this.each(function(node) {
      hui.cls.add(node, cls);
    });
  },
  add : function(something) {
    if (typeof(something) == 'string') {
      if (something[0] == '.') {
        this.addClass(something.substring(1))
      }
    }
    return this;
  },
  style : function(css) {
    return this.each(function(node) {
      hui.style.set(node,css);
    });    
  },
  each : function(fn) {
    this._context.forEach(fn);
    return this;
  },
  count: function() {
    return this._context.length;
  }
};

hui = window.hui || {};

/** @namespace */
hui.cookie = {
  /**
   * Adds a cookie value by name
   */
  set : function(name, value, days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },
  /**
   * Gets a cookie value by name
   */
  get : function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },
  /**
   * Clears a cookie by name
   */
  clear : function(name) {
    this.set(name, "", -1);
  }
};

hui.xml = {
/*  transform : function(xml,xsl) {
    if (window.ActiveXObject) {
      return xml.transformNode(xsl);
    } else if (document.implementation && document.implementation.createDocument) {
      try {
          var pro = new XSLTProcessor();
                pro.setParameter(null,'dev','true');
                pro.setParameter(null,'profile','true');
                pro.setParameter(null,'version','true');
                pro.setParameter(null,'pathVersion','true');
                pro.setParameter(null,'context','true');
                pro.setParameter(null,'language','true');
          pro.importStylesheet(xsl);
//    '<xsl:variable name="profile">'.$profile.'</xsl:variable>'.
//    '<xsl:variable name="version">'.SystemInfo::getDate().'</xsl:variable>'.
//    '<xsl:variable name="pathVersion">'.$pathVersion.'</xsl:variable>'.
//    '<xsl:variable name="context">'.$context.'</xsl:variable>'.
//    '<xsl:variable name="language">'.InternalSession::getLanguage().'</xsl:variable>';)
        var ownerDocument = document;//.implementation.createDocument("", "test", null);
          return pro.transformToFragment(xml,ownerDocument);
      } catch (e) {
        hui.log('Transform exception...');
        hui.log(e);
        throw e;
      }
    } else {
      hui.log('No XSLT!');
    }
  },*/
  parse : function(xml) {
    var doc;
    try {
      if (window.DOMParser) {
        var parser = new DOMParser();
        doc = parser.parseFromString(xml,"text/xml");
        var errors = doc.getElementsByTagName('parsererror');
        if (errors.length > 0 && errors[0].textContent) {
          hui.log(errors[0].textContent);
          return null;
        }
      } else {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = false;
        doc.loadXML(xml);
      }
    } catch (e) {
      return null;
    }
    return doc;
  },
  serialize : function(node) {
    try {
      return (new XMLSerializer()).serializeToString(node);
    } catch (e) {
      try {
        return node.xml;
      }
      catch (ex) {}
    }
    return null;
  }
};

/**
 * A preloader for images
 * @constructor
 * @param options {Object}
 * @param options.context {String} Prefix for all URLs
 */
hui.Preloader = function(options) {
  this.options = options || {};
  this.delegate = {};
  this.images = [];
  this.loaded = 0;
};

hui.Preloader.prototype = {
  /** Add images either as a single url or an array of urls */
  addImages : function(imageOrImages) {
    if (typeof(imageOrImages)=='object') {
      for (var i=0; i < imageOrImages.length; i++) {
        this.images.push(imageOrImages[i]);
      }
    } else {
      this.images.push(imageOrImages);
    }
  },
  /**
   * Set the delegate (listener)
   * @param {Object} listener
   */
  setDelegate : function(listener) {
    this.delegate = listener;
  },
  /**
   * Start loading images beginning at startIndex
   */
  load : function(startIndex) {
    startIndex = startIndex || 0;
    var self = this;
    this.obs = [];
    var onLoad = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidLoad');};
    var onError = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidGiveError');};
    var onAbort = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidAbort');};
    for (var i=startIndex; i < this.images.length+startIndex; i++) {
      var index=i;
      if (index>=this.images.length) {
        index = index-this.images.length;
      }
      var img = new Image();
      img.huiPreloaderIndex = index;
      img.onload = onLoad;
      img.onerror = onError;
      img.onabort = onAbort;
      img.src = (this.options.context ? this.options.context : '')+this.images[index];
      this.obs.push(img);
    }
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
};

hui._controllers = [];

hui.control = function(recipe) {
  for (variable in recipe) {
    if (recipe.hasOwnProperty(variable)) {
      var found = variable.match(/^([a-z]+)!\s*([a-zA-Z]+)$/);
      if (found) {
        recipe['$' + found[1] + '$' + found[2]] = recipe[variable];
      }
      found = variable.match(/^([a-zA-Z]+)\.([a-zA-Z]+)!$/);
      if (found) {
        recipe['$' + found[2] + '$' + found[1]] = recipe[variable];
      }
    }
  }
  if (recipe['#name']) {
    hui._controllers[recipe['#name']] = recipe;
  }
  if (recipe.nodes) {
    recipe.nodes = hui.collect(recipe.nodes, document.body);
  }
  hui.on(function() {
    if (recipe.components) {
      for (name in recipe.components) {
        if (recipe.components.hasOwnProperty(name)) {
          recipe.components[name] = hui.ui.get(recipe.components[name]);
        }
      }
    }
  });
  hui.ui.listen(recipe);
}

hui.controller = function(name) {
  return this._controllers[name];
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


hui = window.hui || {};

/**
  The namespace of the HUI framework
  @namespace
 */
hui.ui = hui.ui || {};

hui.ui.domReady = false;
hui.ui.context = undefined;
hui.ui.language = undefined;

hui.ui.objects = {};
hui.ui.delegates = [];

hui.ui.state = 'default';

hui.ui.latestObjectIndex = 0;
hui.ui.latestIndex = 500;
hui.ui.latestPanelIndex = 1000;
hui.ui.latestAlertIndex = 1500;
hui.ui.latestTopIndex = 2000;
hui.ui.toolTips = {};
hui.ui.confirmOverlays = {};

hui.ui.delayedUntilReady = [];

hui.ui.texts = {
  request_error : {en:'An error occurred on the server',da:'Der skete en fejl på serveren'},
  'continue' : {en:'Continue',da:'Fortsæt'},
  reload_page : {en:'Reload page',da:'Indæs siden igen'},
  access_denied : {en:'Access denied, maybe you are nolonger logged in',da:'Adgang nægtet, du er måske ikke længere logget ind'}
};

hui.ui.getContext = function() {
  if (this.context===undefined) {
    var node = hui.find('*[data-hui-context]');
    if (node) {
      this.context = node.getAttribute('data-hui-context');
    } else {
      var scrp = hui.find("script[src$=\"js/hui.js\"]")
      if (scrp) {
        this.context = scrp.getAttribute('src').replaceAll(/js\/hui.js$/g,'');
      } else {
        this.context = '/';
      }
    }
  }
  return this.context;
};

hui.ui.getURL = function(path) {
  var ctx = hui.ui.getContext();
  if (path.substring(0,1) === '/') {
    path = path.substring(1);
  }
  if (ctx.substring(ctx.length - 1) === '/') {
    ctx = ctx.substring(0, ctx.length - 1);
  }
  return ctx + '/' + path;
};

/**
 * Get a component by name
 * @param nameOrComponent {hui.ui.Component | String} Get a component by name, if the parameter is already a component it is returned
 * @return {hui.ui.Component} The component with the name or undefined
 */
hui.ui.get = function(nameOrComponent) {
  if (nameOrComponent) {
    if (nameOrComponent.element) {
      return nameOrComponent;
    }
    return hui.ui.objects[nameOrComponent];
  }
};

hui.ui.is = function(component, constructor) {
  return constructor.prototype.isPrototypeOf(component);
};

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
  hui.ui.tellGlobalListeners(this,'frameLoaded',win);
};

/** @private */
hui.ui._resize = function() {
  hui.ui.reLayout();
  window.clearTimeout(this._delayedResize);
  if (!hui.ui._resizeFirst) {
    this._delayedResize = window.setTimeout(hui.ui._afterResize,500);
  }
};

hui.ui._afterResize = function() {
  hui.onDraw(function() {
    hui.ui.tellGlobalListeners(hui.ui,'$afterResize');
    for (var key in hui.ui.objects) {
      var component = hui.ui.objects[key];
      if (component.$$draw) {
        component.$$draw();
      }
    }
  });
};

/**
 * Show a confirming overlay
 * <pre><strong>options:</strong> {
 *  element : Element, // the element to show at (use target)
 *  widget : Widget, // the widget to show at (use target)
 *  target : Component or element, // the widget to show at
 *  text : String, // the text message
 *  okText : String, // text of OK button
 *  cancelText String, // text of cancel button
 *  $ok: Function, // called when user clicks the OK button
 *  $cancel: Function // called when user clicks the Cancel button
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
  if (options.target) {
    node = hui.ui.getElement(options.target);
  }
  if (hui.ui.confirmOverlays[node]) {
    overlay = hui.ui.confirmOverlays[node];
    overlay.clear();
  } else {
    overlay = hui.ui.Overlay.create({modal:true});
    hui.ui.confirmOverlays[node] = overlay;
  }
  if (options.text) {
    overlay.addText(hui.ui.getTranslated(options.text));
  }
  var ok = hui.ui.Button.create({text:hui.ui.getTranslated(options.okText) || 'OK',highlighted:'true'});
  ok.click(function() {
    if (options.onOk) {
      options.onOk();
    }
    else if (options.$ok) {
      options.$ok();
    }
    overlay.hide();
  });
  overlay.add(ok);
  var cancel = hui.ui.Button.create({text:hui.ui.getTranslated(options.cancelText) || 'Cancel'});
  cancel.onClick(function() {
    if (options.onCancel) {
      options.onCancel();
    }
    else if (options.$cancel) {
      options.$cancel();
    }
    overlay.hide();
  });
  overlay.add(cancel);
  overlay.show({element:node});
};

/**
 * Unregisters a widget
 * @param widget {Widget} The widget to destroy
 */
hui.ui.destroy = function(widget) {
  if (widget.getAccessories) {
    var accessories = widget.getAccessories();
    for (var i = 0; i < accessories.length; i++) {
      hui.ui.destroy(accessories[i]);
    }
  }
  delete(hui.ui.objects[widget.name]);
  widget.detach();
  var element = widget.getElement();
  if (element) {
    hui.dom.remove(element);
    hui.ui.destroyDescendants(element);
  }
};

hui.ui.destroyDescendants = function(widgetOrElement) {
  var desc = hui.ui.getDescendants(widgetOrElement);
  for (var i=0; i < desc.length; i++) {
    hui.ui.destroy(desc[i]);
  }
};

hui.ui.remove = function(widget) {
  hui.ui.destroy(widget);
  hui.ui.destroyDescendants(widget);
  if (widget.element) {
    hui.dom.remove(widget.element);
  }
};

/** Gets all ancestors of a widget
  @param {Widget} widget A widget
  @returns {Array} An array of all ancestors
*/
hui.ui.getAncestors = function(widget) {
  var ancestors = [];
  var element = widget.element;
  if (element) {
    var parent = element.parentNode;
    while (parent) {
      for (var key in hui.ui.objects) {
        widget = hui.ui.objects[key];
        if (widget.element === parent) {
          ancestors.push(widget);
        }
      }
      parent = parent.parentNode;
    }
  }
  return ancestors;
};

hui.ui.getDescendants = function(widgetOrElement) {
  var desc = [];
  if (widgetOrElement) {
    var e = widgetOrElement.getElement ? widgetOrElement.getElement() : widgetOrElement;
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
        }
      }
    }
  }
  return desc;
};

hui.ui.getAncestor = function(widget,cls) {
  var a = hui.ui.getAncestors(widget);
  for (var i=0; i < a.length; i++) {
    if (hui.cls.has(a[i].getElement(),cls)) {
      return a[i];
    }
  }
  return null;
};

hui.ui.getComponents = function(predicate) {
  var comps = [];
  var o = hui.ui.objects;
  for (var key in o) {
    if (predicate(o[key])) {
      comps.push(o[key]);
    }
  }
  return comps;
};


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
};

hui.ui.reLayout = function() {
  var widgets = hui.ui.getDescendants(document.body);
  for (var i=0; i < widgets.length; i++) {
    var obj = widgets[i];
    if (obj.$$layout) {
      obj.$$layout();
    }
  }
};



///////////////////////////////// Indexes /////////////////////////////

hui.ui.nextPanelIndex = function() {
  hui.ui.latestPanelIndex++;
  return hui.ui.latestPanelIndex;
};

hui.ui.nextAlertIndex = function() {
  hui.ui.latestAlertIndex++;
  return hui.ui.latestAlertIndex;
};

hui.ui.nextTopIndex = function() {
  hui.ui.latestTopIndex++;
  return hui.ui.latestTopIndex;
};



///////////////////////////////// Curtain /////////////////////////////

/**
 * Shows a "curtain" behind an element
 * #param options { widget: Widget, color: String, zIndex: Number }
 */
hui.ui.showCurtain = function(options) {
  var widget = options.widget;
  if (!widget.curtain) {
    widget.curtain = hui.build('div',{style:'position:fixed;top:0;left:0;bottom:0;right:0'});
    var body = hui.find('.hui_body', document.body) || document.body;

    body.appendChild(widget.curtain);
    hui.listen(widget.curtain,'click',function() {
      if (widget.$curtainWasClicked) {
        widget.$curtainWasClicked();
      }
    });
  }
  var curtain = widget.curtain;
  var color = options.color || '#000';
  if (options.transparent) {
    color = 'none';
  }
  else if (options.color == 'auto') {
    color = hui.style.get(document.body,'background-color');
    if (color=='transparent' || color=='rgba(0, 0, 0, 0)') {
      color='#fff';
    }
  }
  curtain.style.backgroundColor = color;
  curtain.style.zIndex = options.zIndex;
  if (options.transparent) {
    curtain.style.display = 'block';
  } else {
    hui.style.setOpacity(curtain,0);
    curtain.style.display = 'block';
    hui.animate(curtain,'opacity',0.7,1000,{ease:hui.ease.slowFastSlow});
  }
};

hui.ui.hideCurtain = function(widget) {
  if (widget.curtain) {
    hui.animate(widget.curtain,'opacity',0,200,{hideOnComplete:true});
  }
};



///////////////////////////// Localization ////////////////////////////

/**
 * Get a localized text, defaults to english or the key
 * @param {String} key The key of the text
 * @returns {String} The localized string
 */
hui.ui.getText = function(key) {
  var parts = this.texts[key];
  if (!parts) {return key;}
  if (parts[this.language]) {
    return parts[this.language];
  } else {
    return parts.en;
  }
};

hui.ui.getTranslated = function(value) {
  if (!hui.isDefined(value) || hui.isString(value) || typeof(value) == 'number') {
    return value;
  }
  var lang = hui.ui.getLanguage();
  if (value[lang]) {
    return value[lang];
  }
  if (value[null]) {
    return value[null];
  }
  for (var key in value) {
    return value[key];
  }
};

hui.ui.getLanguage = function() {
  if (hui.ui.language) {
    return hui.ui.language;
  }
  return (document.documentElement && document.documentElement.lang) || 'en';
};


//////////////////////////////// Message //////////////////////////////

hui.ui.confirm = function(options) {
  hui.ui.Alert.confirm(options);
};

hui.ui.alert = function(options) {
  hui.ui.Alert.alert(options);
};

hui.ui.showMessage = function(options) {
  if (typeof(options)=='string') {
    // TODO: Backwards compatibility
    options={text:options};
  }
  window.clearTimeout(hui.ui.messageDelayTimer);
  if (options.delay) {
    hui.ui.messageDelayTimer = window.setTimeout(function() {
      options.delay = null;
      hui.ui.showMessage(options);
    },options.delay);
    return;
  }
  if (!hui.ui.message) {
    hui.ui.message = hui.build('div.hui_message', {parent: document.body, style: {opacity: 0}});
  }
  var text = hui.ui.getTranslated(options.text) || '';
  hui.cls.set(hui.ui.message, 'hui-is-busy', options.busy);
  hui.cls.set(hui.ui.message, 'hui-is-success', options.success);
  hui.cls.set(hui.ui.message, 'hui-is-failure', options.failure);
  hui.dom.setText(hui.ui.message, text);
  hui.ui.message.style.width = '';
  hui.ui.message.style.left = '0';
  hui.ui.message.style.display = 'block';
  var w = hui.ui.message.offsetWidth;
  hui.ui.message.style.left = '50%';
  if (w > hui.window.getViewWidth()) {
    hui.ui.message.style.width = '80%';
    hui.ui.message.style.marginLeft = '-40%';
  } else {
    hui.ui.message.style.marginLeft = (hui.ui.message.offsetWidth / -2) + 'px';
  }
  hui.ui.message.style.marginTop = (hui.ui.message.offsetHeight / -2) + 'px';
  hui.ui.message.style.zIndex = hui.ui.nextTopIndex();
  if (hui.browser.opacity) {
    hui.animate(hui.ui.message, 'opacity', 1, 300);
  }
  window.clearTimeout(hui.ui.messageTimer);
  if (options.duration) {
    hui.ui.messageTimer = window.setTimeout(hui.ui.hideMessage,options.duration);
  }
};

hui.ui.msg = hui.ui.showMessage;

hui.ui.msg.success = function(options) {
  options = hui.override({success: true,duration:2000},options);
  hui.ui.msg(options);
};

hui.ui.msg.fail = function(options) {
  options = hui.override({failure:true,duration:3000},options);
  hui.ui.msg(options);
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
};

hui.ui.isWithin = function(e,element) {
  e = hui.event(e);
  var offset = hui.position.get(element),
    dims = { width : element.offsetWidth, height : element.offsetHeight },
    left = e.getLeft(),
    top = e.getTop();
  return left > offset.left && left < offset.left+dims.width && top > offset.top && top < offset.top+dims.height;
};

hui.ui.getIconUrl = function(icon,size) {
  return hui.ui.getURL('icons/'+icon+size+'.png');
};

hui.ui.createIcon = function(icon,size,tag) {
  var node = hui.build(tag || 'span',{
    'class' : 'hui_icon hui_icon_' + size
  });
  hui.ui.setIconImage(node,icon,size);
  return node;
};

hui.ui.setIconImage = function(node, icon, size) {
  if (size==32 || size==16 || size==64) {
    node.setAttribute('style', hui.ui.getIconStyle(icon, size));
  } else {
    node.setAttribute('style', 'background-image: url(' + hui.ui.getIconUrl(icon,size) + ');');
  }
};

hui.ui.getIconStyle = function(icon, size) {
  return 'background-image: url(' + hui.ui.getIconUrl(icon,size) + '); background-image: -webkit-image-set(url('+hui.ui.getIconUrl(icon,size)+') 1x,url('+hui.ui.getIconUrl(icon,size+'x2')+') 2x); background-size: '+size+'px;';
}

/**
 * Add focus class to an element
 * @param options {Object} {element : Element, class : String}
 */
hui.ui.addFocusClass = function(options) {
  var ce = options.classElement || options.element, c = options['class'];
  hui.listen(options.element,'focus',function() {
    hui.cls.add(ce,c);
  });
  hui.listen(options.element,'blur',function() {
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
};


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

//////////////////// Delegating ////////////////////

hui.ui.extend = function(obj,options) {
  if (options!==undefined) {
    if (obj.options) {
      obj.options = hui.override(obj.options,options);
    }
    obj.element = hui.get(options.element);
    obj.name = options.name;
  }
  if (!obj.name) {
    hui.ui.latestObjectIndex++;
    obj.name = 'unnamed'+hui.ui.latestObjectIndex;
  }
  hui.ui.registerComponent(obj);
  obj.delegates = [];
  obj.listen = function(delegate) {
    hui.array.add(this.delegates,delegate);
    return this;
  };
  obj.unListen = function(delegate) {
    hui.array.remove(this.delegates,delegate);
  };
  obj.clearListeners = function() {
    this.delegates = [];
  };
  obj.fire = function(method,value,event) {
    return hui.ui.callDelegates(this,method,value,event);
  };
  obj.fireValueChange = function() {
    obj.fire('valueChanged',obj.value);
    hui.ui.firePropertyChange(obj,'value',obj.value);
    hui.ui.callAncestors(obj,'childValueChanged',obj.value);
  };
  obj.fireProperty = function(key,value) {
    hui.ui.firePropertyChange(this,key,value);
  };
  obj.fireSizeChange = function() {
    hui.ui.callAncestors(obj,'$$childSizeChanged');
  };
  obj.addTo = function(other) {
    other.add(this);
    return this;
  };
  if (!obj.getElement) {
    obj.getElement = function() {
      return this.element;
    };
  }
  if (!obj.detach) {
    obj.detach = function() {};
  }
  if (!obj.destroy) {
    obj.destroy = function() {hui.ui.destroy(this)};
  }
  if (!obj.valueForProperty) {
    obj.valueForProperty = function(p) {return this[p];};
  }
  if (obj.nodes && obj.element) {
    obj.nodes = hui.collect(obj.nodes,obj.element);
  }
};

hui.ui.make = function(def) {
  var component = function(options) {
    if (!options.element) {
      options.element = def.$build(options);
    }
    hui.ui.Component.call(this, options);
    var self = this;
    hui.each(def.$events, function(comp, listener) {
      var node = self.nodes[comp];
      hui.each(listener, function(eventName, action) {
        if (hui.isString(action)) {
          hui.on(node, eventName, function(e) {
            hui.stop(e);
            self.fire(action.substring(0,action.length - 1))
          })
        } else {
          hui.on(node, eventName, action.bind(self))
        }
      });
    });
    if (this.$init) { this.$init(options) };
    if (this.$attach) { this.$attach() };
  }
  var exc = ['create'];
  var proto = {}
  for (p in def) {
    if (def.hasOwnProperty(p) && exc.indexOf(p) == -1) {
      proto[p] = def[p]
    }
  }
  component.prototype = proto
  hui.extend(component, hui.ui.Component);
  hui.ui[def.name] = component;
  hui.define('hui.ui.' + def.name, component);
}

hui.ui.registerComponent = function(component) {
  if (hui.ui.objects[component.name]) {
    hui.log('Widget replaced: '+component.name,hui.ui.objects[component.name]);
  }
  hui.ui.objects[component.name] = component;
};

/** Send a message to all ancestors of a widget */
hui.ui.callAncestors = function(obj,method,value,event) {
  if (typeof(value)=='undefined') value=obj;
  var d = hui.ui.getAncestors(obj);
  for (var i=0; i < d.length; i++) {
    if (d[i][method]) {
      d[i][method](value,event);
    }
  }
};

/** Send a message to all descendants of a widget */
hui.ui.callDescendants = function(obj,method,value,event) {
  if (typeof(value)=='undefined') {
    value=obj;
  }
  if (method[0] !== '$') {
    method = '$'+method;
  }
  var d = hui.ui.getDescendants(obj);
  for (var i=0; i < d.length; i++) {
    if (d[i][method]) {
      d[i][method](value,event);
    }
  }
};

/** Signal that a widget has changed visibility */
hui.ui.callVisible = function(widget) {
  hui.ui.callDescendants(widget,'$visibilityChanged');
};

/** Listen for global events */
hui.ui.listen = function(delegate) {
  if (hui.ui.domReady && delegate.$ready) {
    delegate.$ready();
  }
  hui.ui.delegates.push(delegate);
};

hui.ui.unListen = function(listener) {
  hui.array.remove(hui.ui.delegates,listener);
};

hui.ui.tell = function(event) {
  if (hui.isString(event)) {
    event = {name:event};
  }
  if (!event.target) {
    hui.ui.tellGlobalListeners(window, event.name);
  }
}

hui.ui.callDelegates = function(obj,method,value,event) {
  if (typeof(value)=='undefined') {
    value=obj;
  }
  var result;
  if (obj.delegates) {
    for (var i=0; i < obj.delegates.length; i++) {
      var delegate = obj.delegates[i],
        thisResult,
        specific = '$'+method+'$'+obj.name;
      if (obj.name && delegate[specific]) {
        thisResult = delegate[specific](value,event);
      } else if (delegate['$'+method]) {
        thisResult = delegate['$'+method](value,event);
      }
      if (result===undefined && thisResult!==undefined) {
        result = thisResult;
      }
    }
  }
  var superResult = hui.ui.tellGlobalListeners(obj,method,value,event);
  if (result===undefined && superResult!==undefined) {
    result = superResult;
  }
  return result;
};

/**
 * Sends a message to ancestor frames (will call all the way up)
 * @param {String} event
 * @param {Object} value
 */
hui.ui.tellContainers = function(event,value) {
  if (window.parent!=window) {
    try {
      return window.parent.hui.ui._tellContainers(event,value);
    } catch (e) {
      if (window.console) console.error(e);
    }
  }
};

hui.ui._tellContainers = function(event,value) {
  var result = hui.ui.tellGlobalListeners({},event,value);
  if (window.parent!=window) {
    try {
      result = window.parent.hui.ui._tellContainers(event,value) || result;
    } catch (e) {
      if (window.console) console.error(e);
    }
  }
  return result;
};

hui.ui.tellGlobalListeners = function(obj,method,value,event) {
  if (typeof(value)=='undefined') value=obj;
  var result;
  for (var i=0; i < hui.ui.delegates.length; i++) {
    var delegate = hui.ui.delegates[i],
            thisResult;
    if (obj.name && delegate['$'+method+'$'+obj.name]) {
      thisResult = delegate['$'+method+'$'+obj.name](value,event);
    } else if (delegate['$'+method]) {
      thisResult = delegate['$'+method](value,event);
    }
    if (result===undefined && thisResult!==undefined && typeof(thisResult)!='undefined') {
      result = thisResult;
    }
  }
  return result;
};

hui.ui.resolveImageUrl = function(widget,img,width,height) {
  for (var i=0; i < widget.delegates.length; i++) {
    if (widget.delegates[i].$resolveImageUrl) {
      return widget.delegates[i].$resolveImageUrl(img,width,height);
    }
  }
  for (var j=0; j < hui.ui.delegates.length; j++) {
    var delegate = hui.ui.delegates[j];
    if (delegate.$resolveImageUrl) {
      return delegate.$resolveImageUrl(img,width,height);
    }
  }
  return null;
};

/** Load som UI from an URL */
hui.ui.include = function(options) {
  hui.ui.request({
    url : options.url,
    $text : function(html) {
      var container = hui.build('div',{html:html,parent:document.body});
      hui.dom.runScripts(container);
      options.$success();
    }
  });
};



////////////////////////////// Bindings ///////////////////////////

hui.ui.firePropertyChange = function(obj,name,value) {
  hui.ui.callDelegates(obj,'propertyChanged',{property:name,value:value});
};

hui.ui.bind = function(expression,delegate) {
  if (hui.isString(expression) && expression.charAt(0)=='@') {
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
  var result = hui.ui.tellGlobalListeners(widget || this,'requestError');
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
};

hui.ui.handleForbidden = function(widget) {
  hui.log('General access denied received');
  var result = hui.ui.tellGlobalListeners(widget || this,'accessDenied');
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
};
/**
 * @param {Object} options
 * @param {Object} options.message
 * @param {String} options.message.start
 * @param {String} options.message.success
 */
hui.ui.request = function(options) {
  options = hui.override({method:'post'}, options);
  if (options.json) {
    if (!options.parameters) {
      options.parameters = {}
    }
    for (var key in options.json) {
      options.parameters[key]=hui.string.toJSON(options.json[key]);
    }
  }
  var success = options.$success,
    obj = options.$object,
    text = options.$text,
    xml = options.$xml,
    failure = options.$failure,
    forbidden = options.$forbidden,
    message = options.message;
  options.$success = function(t) {
    if (message) {
      if (message.success) {
        hui.ui.msg({text:message.success,success:true,duration:message.duration || 2000});
      } else if (message.start) {
        hui.ui.hideMessage();
      }
    }
    var str,json;
    if (typeof(success)=='string') {
      if (!hui.request.isXMLResponse(t)) {
        str = t.responseText.replace(/^\s+|\s+$/g, '');
        if (str.length>0) {
          json = hui.string.fromJSON(t.responseText);
        } else {
          json = '';
        }
        hui.ui.callDelegates(json,'success$'+success);
      } else {
        hui.ui.callDelegates(t,'success$'+success);
      }
    } else if (xml && hui.request.isXMLResponse(t)) {
      xml(t.responseXML);
    } else if (obj) {
      str = t.responseText.replace(/^\s+|\s+$/g, '');
      if (str.length>0) {
        json = hui.string.fromJSON(t.responseText);
      } else {
        json = null;
      }
      obj(json);
    } else if (typeof(success)=='function') {
      success(t);
    } else if (text) {
      text(t.responseText);
    }
  };
  options.$failure = function(t) {
    if (typeof(failure)=='string') {
      hui.ui.callDelegates(t,'failure$'+failure);
    } else if (typeof(failure)=='function') {
      var obj;
      var contentType = t.getResponseHeader('Content-Type');
      if (contentType) {
        contentType = contentType.split(";")[0].trim();
      }
      if (contentType == 'application/json') {
        obj = hui.string.fromJSON(t.responseText);
      }
      failure(t, obj);
    } else {
      if (options.message && options.message.start) {
        hui.ui.hideMessage();
      }
      hui.ui.handleRequestError();
    }
  };
  options.$exception = options.$exception || function(e,t) {
    hui.log(e);
    hui.log(t);
    throw e;
  };
  options.$forbidden = function(t) {
    if (options.message && options.message.start) {
      hui.ui.hideMessage();
    }
    if (forbidden) {
      forbidden(t);
    } else {
      options.$failure(t);
      hui.ui.handleForbidden();
    }
  };
  if (options.message && options.message.start) {
    hui.ui.msg({text:options.message.start,busy:true,delay:options.message.delay});
  }
  hui.request(options);
};

/**
 * Import some widgets by name
 * @param {Array} names Array of widgets to import
 * @param {Function} func The function to call when finished
 */
hui.ui.require = function(names,func) {
  for (var i = names.length - 1; i >= 0; i--){
    names[i] = hui.ui.getURL('js/'+names[i]+'.js');
  }
  hui.require(names,func);
};

hui.on(function() {
  hui.listen(window,'resize',hui.ui._resize);
  hui.ui.reLayout();
  hui.ui.domReady = true;
  if (window.parent && window.parent.hui && window.parent.hui.ui) {
    window.parent.hui.ui._frameLoaded(window);
  }
  for (var i=0; i < hui.ui.delayedUntilReady.length; i++) {
    hui.ui.delayedUntilReady[i]();
  }
  // Call super delegates after delayedUntilReady...
  hui.ui.tellGlobalListeners(this,'ready');
  hui.define('hui.ui', hui.ui);
});



/**
 * A component
 * @constructor
 * @param {Object} options
 * @param {Element} options.element
 * @param {String} options.name
 * @param {Object} options.listen A listener
 */
hui.ui.Component = function(options) {
  options = options || {};
  this.name = options.name;
  this.state = hui.override({}, this.state);
  if (!this.name) {
    hui.ui.latestObjectIndex++;
    this.name = 'unnamed'+hui.ui.latestObjectIndex;
  }
  this.element = hui.get(options.element);
  this.delegates = [];
  if (this.nodes) {
    this.nodes = hui.collect(this.nodes,this.element);
  } else {
    this.nodes = [];
  }
  this.nodes.root = this.element
  if (options.listen) {
    this.listen(options.listen);
  }
  hui.ui.registerComponent(this);
};

hui.ui.Component.prototype = {
  /**
   * Add event listener
   * @param {Object} listener An object with methods for different events
   */
  listen : function(listener) {
    this.delegates.push(listener);
  },
  on : function(listener) {
    this.delegates.push(listener);
  },
  /**
   * Fire an event with this component as the sender
   */
  fire : function(name,value,event) {
    return hui.ui.callDelegates(this,name,value,event);
  },
  /**
   * Get the components root element
   * @returns Element
   */
  getElement : function() {
    return this.element;
  },
  /**
   * Removes the component from the DOM
   * @see hui.ui.destroy
   */
  destroy : function() {
    hui.ui.destroy(this)
  },
  detach : function() {
    // TODO: Can we auto-remove all listeners
    // Override this
  },
  valueForProperty : function(property) {
    return this[property];
  },
  /**
   * Notify others of a value change
   */
  fireValueChange : function() {
    this.fire('valueChanged',this.value);
    hui.ui.firePropertyChange(this,'value',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  },
  /**
   * Notify others of a layout change
   */
  fireSizeChange : function() {
    hui.ui.callAncestors(this,'$$childSizeChanged');
  },
  change : function(newState) {
    var changed = {};
    for (key in newState) {
      if (newState.hasOwnProperty(key) && this.state.hasOwnProperty(key) ) {
        if (this.state[key] !== newState[key]) {
          this.state[key] = newState[key];
          changed[key] = newState[key];
        }
      }
    }
    if (changed!={} && this.draw) {
      this.draw(changed);
    }
  }
};

hui.component = function(name, spec) {
  hui.ui[name] = function(options) {
    options = options || {};
    hui.ui.Component.call(this, options);
    this.init && this.init(options);
    this.change(options);
    this.attach && this.attach();

    for (key in this) {
      if (key[0] == '!' && typeof(this[key]) == 'function') {
        (function(self, key) {
          hui.listen(self.element, key.substr(1), function(e) {
            e = hui.event(e);
            self[key](e);
          });
        })(this, key)
      }
    }
  }
  var component = hui.ui[name]
  component.create = function(state) {
    var cp = {element: spec.create()};
    hui.extend(cp, state);
    if (state.testName) {
      cp.element.setAttribute('data-test', state.testName);
    }
    var obj = new component(cp);
    obj.change(state);
    return obj;
  };
  component.prototype = spec;
  hui.extend(component.prototype, hui.ui.Component.prototype);
  if (spec['with']) {
    for (var i = 0; i < spec['with'].length; i++) {
      var mixin = hui.component[spec['with'][i]];
      for (prop in mixin) {
        if (typeof(mixin[prop]) == 'function') {
          component.prototype[prop] = mixin[prop]
        }
      }
      if (mixin.state) {
        for (prop in mixin.state) {
          if (component.prototype.state[prop] === undefined) {
            component.prototype.state[prop] = mixin.state[prop]
          }
        }
      }
    }
  }
};

hui.component.value = {
  state: {value: undefined},
  setValue : function(v) {
    this.change({value: v});
  },
  getValue : function() {
    return this.state.value;
  },
  /* TODO: Already a fireValueChange */
  tellValueChange : function(){
    var v = this.state.value;
    hui.ui.callAncestors(this, 'childValueChanged', v);
    this.fire('valueChanged', v);
    hui.ui.firePropertyChange(this, 'value', v);
  }
};

hui.component.enabled = {
  state: {enabled: true},
  setEnabled : function(v) {
    this.change({enabled: !!v});
  },
  isEnabled : function() {
    return !!this.state.enabled;
  }
};

hui.component.key = {
  state: {key: undefined},
  getKey: function() {
    return this.state.key;
  }
};

hui.component.size = {
  state: {size: 'regular'},
  getSize: function() {
    return this.state.size;
  },
  setSize : function(v) {
    this.change({size: v});
  }
};

/** A data source
 * @constructor
 */
hui.ui.Source = function(options) {
  this.options = hui.override({url:null,parameters:[],lazy:false},options);
  this.name = options.name;
  this.data = null;
  this.parameters = [];
    // Clone parameters so they can be reused
    for (var i = 0; i < this.options.parameters.length; i++) {
      var p = this.options.parameters[i];
      this.parameters.push({key:p.key,value:p.value,separate:p.separate});
    }
  hui.ui.extend(this);
  if (options.delegate) {
    this.listen(options.delegate);
  }
  this.initial = true;
  this.busy = false;
  hui.ui.onReady(this._init.bind(this));
};

hui.ui.Source.prototype = {
  _init : function() {
    var self = this;
    hui.each(this.parameters,function(parm) {
      var val = hui.ui.bind(parm.value,function(value) {
        self.changeParameter(parm.key,value);
      });
      parm.value = self._convertValue(val);
    });
    if (!this.options.lazy) {
      this.refresh();
    }
  },
  _convertValue : function(value) {
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
  /** Will refresh, but wait a little to let others contribute */
  refreshLater : function() {
    window.clearTimeout(this.paramDelay);
    this.paramDelay = window.setTimeout(function() {
      this.refresh();
    }.bind(this),100);
  },

  /** Refreshes the data source */
  refresh : function() {
    if (this.options.delay<1) {
      this._refresh();
    } else {
      window.clearTimeout(this._refreshDelay);
      this._refreshDelay = window.setTimeout(this._refresh.bind(this),this.options.delay);
    }
  },
  _refresh : function() {
    if (this.delegates.length===0) {
      return;
    }
    var shouldRefresh = this.delegates.length === 0;
    for (var i=0; i < this.delegates.length; i++) {
      var d = this.delegates[i];
      if (d.$sourceShouldRefresh) {
        shouldRefresh = shouldRefresh || d.$sourceShouldRefresh();
      } else {
        shouldRefresh = true;
      }
    }
    if (!shouldRefresh) {return;}
    if (this.busy) {
      this.pendingRefresh = true;
      // It might be better to cue rather than abort
      //if (this.transport) {
      //  this.transport.abort();
      //}
      return;
    }
    this.initial = false;
    this.pendingRefresh = false;
    var self = this;
    if (this.options.url) {
      var prms = [];
      for (var j=0; j < this.parameters.length; j++) {
        var p = this.parameters[j];
        if (hui.isArray(p.value) && p.separate) {
          for (var k = 0; k < p.value.length; k++) {
            prms.push({
              name : p.key,
              value : p.value[k]
            });
          }
        } else {
          prms.push({name : p.key, value : p.value});
        }
      }
      this.busy = true;
      hui.ui.callDelegates(this,'sourceIsBusy');
      this.transport = hui.request({
        method : 'POST',
        url : this.options.url,
        parameters : prms,
        $success : this._parse.bind(this),
        $exception : function(e,t) {
          hui.log('Exception while loading source...');
          hui.log(e);
          self._end();
        },
        $forbidden : function() {
          hui.ui.handleForbidden(self);
          hui.ui.callDelegates(self,'sourceFailed');
          self._end();
        },
        $failure : function(t) {
          hui.log('sourceFailed');
          hui.ui.callDelegates(self,'sourceFailed');
          self._end();
        }
      });
    }
  },
  _end : function() {
    this.busy = false;
    hui.ui.callDelegates(this,'sourceIsNotBusy');
    if (this.pendingRefresh) {
      this.refresh();
    }
  },
  _parse : function(t) {
    if (hui.request.isXMLResponse(t)) {
      this._parseXML(t.responseXML);
    } else {
      var str = t.responseText.replace(/^\s+|\s+$/g, ''),
        json = null;
      if (str.length>0) {
        json = hui.string.fromJSON(t.responseText);
      }
      this.fire('objectsLoaded',json);
    }
    this._end();
  },
  _parseXML : function(doc) {
    var root = doc.documentElement.tagName;
    if (root=='items' || root=='options') {
      this.data = this._parseItems(doc);
      this.fire('optionsLoaded',this.data);
    } else if (root=='list') {
      this.fire('listLoaded',doc);
    } else if (root=='articles') {
      this.fire('articlesLoaded',doc);
    }
  },
  _parseItems : function(doc) {
    var root = doc.documentElement;
    var out = [];
    this._parseSubItems(root,out);
    return out;
  },
  _parseSubItems : function(parent,array) {
    var children = parent.childNodes;
    for (var i=0; i < children.length; i++) {
      var node = children[i];
      if (node.nodeType==1 && node.nodeName=='title') {
        array.push({title:node.getAttribute('title'),type:'title'});
      } else if (node.nodeType==1 && (node.nodeName=='item' || node.nodeName=='option')) {
        var sub = [];
        this._parseSubItems(node,sub);
        array.push({
          text : node.getAttribute('text'),
          title : node.getAttribute('title'),
          value : node.getAttribute('value'),
          icon : node.getAttribute('icon'),
          kind : node.getAttribute('kind'),
          badge : node.getAttribute('badge'),
          children : sub
        });
      }
    }
  },
  addParameter : function(parm) {
    this.parameters.push(parm);
    var val = hui.ui.bind(parm.value,function(value) {
      this.changeParameter(parm.key,value);
    }.bind(this));
    parm.value = this._convertValue(val);
  },
  setParameter : function(key,value) {
    value = this._convertValue(value);
    for (var i=0; i < this.parameters.length; i++) {
      var p = this.parameters[i];
      if (p.key==key) {
        p.value=value;
        return;
      }
    }
    this.parameters.push({key:key,value:value});
  },
  changeParameter : function(key,value) {
    value = this._convertValue(value);
    for (var i=0; i < this.parameters.length; i++) {
      var p = this.parameters[i];
      if (p.key==key) {
        p.value=value;
      }
    }
    this.refreshLater();
  }
};

/** Send a global drag and drop message */
hui.ui.callDelegatesDrop = function(dragged,dropped) {
  for (var i=0; i < hui.ui.delegates.length; i++) {
    if (hui.ui.delegates[i]['$drop$'+dragged.kind+'$'+dropped.kind]) {
      hui.ui.delegates[i]['$drop$'+dragged.kind+'$'+dropped.kind](dragged,dropped);
    }
  }
};

/** @private */
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
  hui.selection.enable(false);
};

/** @private */
hui.ui.findDropTypes = function(drag) {
  var gui = hui.ui;
  var drops = null;
  for (var i = 0; i < gui.delegates.length; i++) {
    if (gui.delegates[i].dragDrop) {
      for (var j = 0; j < gui.delegates[i].dragDrop.length; j++) {
        var rule = gui.delegates[i].dragDrop[j];
        if (rule.drag == drag.kind) {
          if (drops === null) drops={};
          drops[rule.drop] = {};
        }
      }
    }
  }
  return drops;
};

/** @private */
hui.ui.dragListener = function(e) {
  e = new hui.Event(e);
  hui.ui.dragProxy.style.left = (e.getLeft() + 10) + 'px';
  hui.ui.dragProxy.style.top = e.getTop() + 'px';
  hui.ui.dragProxy.style.display = 'block';
  var target = hui.ui.findDropTarget(e.getElement());
  if (target && hui.ui.dropTypes[target.dragDropInfo.kind]) {
    if (hui.ui.latestDropTarget) {
      hui.cls.remove(hui.ui.latestDropTarget, 'hui_drop');
    }
    hui.cls.add(target, 'hui_drop');
    hui.ui.latestDropTarget = target;
  } else if (hui.ui.latestDropTarget) {
    hui.cls.remove(hui.ui.latestDropTarget, 'hui_drop');
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
  hui.unListen(document.body, 'mousemove', hui.ui.dragListener);
  hui.unListen(document.body, 'mouseup', hui.ui.dragEndListener);
  hui.ui.dragging = false;
  if (hui.ui.latestDropTarget) {
    hui.cls.remove(hui.ui.latestDropTarget, 'hui_drop');
    hui.ui.callDelegatesDrop(hui.ui.dragInfo, hui.ui.latestDropTarget.dragDropInfo);
    hui.ui.dragProxy.style.display = 'none';
  } else {
    hui.animate(hui.ui.dragProxy,'left', (hui.ui.startDragPos.left + 10) + 'px', 200, {ease: hui.ease.fastSlow});
    hui.animate(hui.ui.dragProxy,'top', (hui.ui.startDragPos.top - 5) + 'px', 200, {ease: hui.ease.fastSlow, hideOnComplete: true});
  }
  hui.ui.latestDropTarget = null;
  hui.selection.enable(false);
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
};

/**
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
  this._addBehavior();
  if (options.listener) {
    this.listen(options.listener);
  }
};

hui.ui.Window.create = function(options) {
  options = hui.override({title:'Window',close:true},options);
  var html = '<div class="hui_window_front">'+(options.close ? '<div class="hui_window_close"></div>' : '')+
    '<div class="hui_window_titlebar">';
    if (options.icon) {
      html+='<span class="hui_window_icon" style="background-image: url('+hui.ui.getIconUrl(options.icon,16)+')"></span>';
    }
  html+='<span class="hui_window_title">'+hui.ui.getTranslated(options.title)+'</span></div>'+
    '<div class="hui_window_body" style="'+
    (options.width ? 'width:'+options.width+'px;':'')+
    (options.height ? 'height:'+options.height+'px;':'')+
    (options.padding ? 'padding:'+options.padding+'px;':'')+
    '">'+
    '</div>'+
    '</div>';
  var cls = 'hui_window'+(options.variant ? ' hui_window_'+options.variant : '');
  if (options.variant=='dark') {
    cls+=' hui_context_dark';
  }
  options.element = hui.build('div',{'class':cls,html:html,parent: options.parent || document.body});
  if (options.variant=='dark') {
    hui.cls.add(options.element,'hui_context_dark');
  }
  return new hui.ui.Window(options);
};

hui.ui.Window.prototype = {
  _addBehavior : function() {
    var self = this;
    if (this.close) {
      hui.listen(this.close,'click',function(e) {
        this.hide();
        this.fire('userClosedWindow'); // TODO: remove
        this.fire('close');
      }.bind(this));
      hui.listen(this.close,'mousedown',hui.stop);
    }
    hui.drag.register({
      touch: true,
      window: this.element.ownerDocument.defaultView,
      element : this.titlebar,
      $before : this._onDragStart.bind(this) ,
      $startMove : this._onBeforeMove.bind(this) ,
      $move : this._onMove.bind(this),
      $endMove : this._onAfterMove.bind(this)
    });
    hui.listen(this.element,'mousedown',function() {
      self.element.style.zIndex = hui.ui.nextPanelIndex();
    });
  },
  setTitle : function(title) {
    hui.dom.setText(this.title,hui.ui.getTranslated(title));
  },
  _positionInView : function() {
    var scrollTop = hui.window.getScrollTop();
    var winTop = hui.position.getTop(this.element);
    if (winTop < scrollTop || winTop+this.element.clientHeight > hui.window.getViewHeight()+scrollTop) {
      hui.animate({node:this.element,css:{top:(scrollTop+40)+'px'},duration:500,ease:hui.ease.slowFastSlow});
    }
  },
  show : function(options) {
    if (this.visible) {
      this._positionInView();
      this.element.style.zIndex=hui.ui.nextPanelIndex();
      return;
    }
    options = options || {};
    hui.style.set(this.element,{
      zIndex : hui.ui.nextPanelIndex(), visibility : 'hidden', display : 'block'
    });
    var width = this.element.clientWidth;
    hui.style.set(this.element,{
      width : width+'px' , visibility : 'visible'
    });
    if (options.avoid) {
      hui.position.place({insideViewPort : true, target : {element : options.avoid, vertical : 0.5, horizontal : 1}, source : {element : this.element, vertical : 0.5, horizontal : 0} });
    } else {
      if (!this.element.style.top) {
        this.element.style.top = (hui.window.getScrollTop()+40)+'px';
      } else {
        this._positionInView();
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
  toggle : function(options) {
    if (this.visible) {
      this.hide();
    } else {
      this.show(options);
    }
  },
  hide : function() {
    if (!this.visible) return;
    if (hui.browser.opacity) {
      hui.animate(this.element,'opacity',0,100,{$complete:function() {
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
    hui.cls.remove(this.element,'hui_window_news');
    if (variant=='dark' || variant=='light' || variant=='news') {
      hui.cls.add(this.element,'hui_window_'+variant);
    }
    hui.cls.set(this.element,'hui_context_dark',variant=='dark');
  },
  flip : function() {
    if (this.back) {
      this.back.style.minHeight = this.element.clientHeight+'px';
      hui.effect.flip({element:this.element});
    }
  },
  setBusy : function(stringOrBoolean) {
    window.clearTimeout(this._busyTimer);
    if (stringOrBoolean===false) {
      if (this._busyCurtain) {
        this._busyCurtain.style.display = 'none';
      }
      return;
    }
    this._busyTimer = window.setTimeout(function() {
      var curtain = this._busyCurtain;
      if (!curtain) {
        curtain = this._busyCurtain = hui.build('div',{'class':'hui_window_busy',parentFirst:this.content});
        if (hui.browser.msie) {
          hui.cls.add(curtain,'hui_window_busy-legacy');
        }
      }
      var text = hui.isString(stringOrBoolean) ? hui.string.escape(stringOrBoolean) : '';
      curtain.innerHTML = '<span class="hui_window_busy_text">' + text + '</span>';
      curtain.style.display = '';
    }.bind(this),300);
  },

  move : function(point) {
    hui.style.set(this.element,{top:point.top+'px',left:point.left+'px'});
  },

  _onDragStart : function(e) {
    this.element.style.zIndex = hui.ui.nextPanelIndex();
  },
  _onBeforeMove : function(e) {
    e = hui.event(e);
    var pos = hui.position.get(this.element);
    this.dragState = {left: e.getLeft() - pos.left,top:e.getTop()-pos.top};
    this.element.style.right = 'auto';
    hui.cls.add(this.element,'hui_window_dragging');
  },
  _onMove : function(e) {
    var top = (e.getTop()-this.dragState.top);
    var left = (e.getLeft()-this.dragState.left);
    this.element.style.top = Math.max(top,0)+'px';
    this.element.style.left = Math.max(left,0)+'px';
  },
  _onAfterMove : function() {
    hui.ui.callDescendants(this,'$$parentMoved');
    hui.cls.remove(this.element,'hui_window_dragging');
  }
};

if (hui.define) hui.define('hui.Window',hui.Window);

/**
 * @class
 * This is a form
 */
hui.ui.Form = function(options) {
  this.options = options;
  hui.ui.extend(this,options);
  this.addBehavior();
  // TODO Deprecated
  if (options.listener) {
    this.listen(options.listener);
  }
  if (options.listen) {
    this.listen(options.listen);
  }
};

/** @static Creates a new form */
hui.ui.Form.create = function(o) {
  o = o || {};
  var atts = {'class':'hui_form'};
  if (o.action) {
    atts.action=o.action;
  }
  if (o.method) {
    atts.method=o.method;
  }
  o.element = hui.build('form',atts);
  return new hui.ui.Form(o);
};

hui.ui.Form.prototype = {
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
      var widget = d[i];
      if (widget.options && widget.options.key && widget.getValue) {
        data[widget.options.key] = widget.getValue();
      } else if (widget.getKey && widget.getKey() && widget.getValue) {
        data[widget.getKey()] = widget.getValue();
      } else if (widget.name && widget.getValue) {
        data[widget.name] = widget.getValue();
      }
    }
    return data;
  },
  /** Sets the values of the descendants */
  setValues : function(values) {
    if (!hui.isDefined(values)) {
      return;
    }
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      var key = (function(obj) {
        if (obj.getKey && obj.getKey()) {
          return obj.getKey();
        }
        if (obj.options) {
          return obj.options.key || obj.options.name;
        }
      })(d[i]);
      if (key && values[key]!==undefined) {
        d[i].setValue(values[key]);
      }
    }
  },
  /** Sets focus in the first found child */
  focus : function(key) {
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      if (d[i].focus && (!key || (d[i].options && d[i].options.key==key) || d[i].name==key)) {
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
   * @returns {'hui.ui.Form.Group'} group
   */
  createGroup : function(options) {
    var g = hui.ui.Form.Group.create(options);
    this.add(g);
    return g;
  },
  /** Builds and adds a new group according to a recipe
   * @returns {'hui.ui.Form.Group'} group
   */
  buildGroup : function(options,recipe) {
    var g = this.createGroup(options);
    hui.each(recipe, function(item) {
      var w, field;
      if (hui.ui.Form[item.type]) {
        w = hui.ui.Form[item.type].create(item.options);
        field = g.add(w, item.label);
      }
      else if (hui.ui[item.type]) {
        w = hui.ui[item.type].create(item.options);
        field = g.add(w, item.label);
      }
      else {
        hui.log('buildGroup: Unable to find type: '+item.type);
      }
      if (item.extra) {
        hui.each(item.extra, function(other) {
          field.add(other);
        });
      }
    });
    return g;
  },
  createButtons : function(options) {
    var buttons = hui.ui.Buttons.create(options);
    this.add(buttons);
    return buttons;
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
};

///////////////////////// Group //////////////////////////


/**
 * A form group
 * @constructor
 */
hui.ui.Form.Group = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  this.tableMode = this.element.nodeName.toLowerCase() == 'table'
  this.options = hui.override({above:true, large:false},options);
  hui.ui.extend(this);
};

/** Creates a new form group */
hui.ui.Form.Group.create = function(options) {
  options = hui.override({above:true},options);
  var element;
  if (options.above) {
    element = hui.build('div', {'class':'hui_form_fields hui_form_fields_above'});
  } else {
    element = hui.build('table.hui_form_fields');
    element.appendChild(hui.build('tbody'));
  }
  options.element = element;
  return new hui.ui.Form.Group(options);
};

hui.ui.Form.Group.prototype = {
  add : function(widget,label) {
    if (this.tableMode) {
      var tr = hui.build('tr',{'class':'hui_form_field'});
      hui.find('tbody', this.element).appendChild(tr);
      var td = hui.build('td');
      if (label) {
        label = hui.ui.getTranslated(label);
        var th = hui.build('th',{parent:tr});
        hui.build('label',{className:'hui_form_field_label',text:label,parent:th});
      }
      td.appendChild(widget.getElement());
      tr.appendChild(td);
      return new hui.ui.Form.Field({element: tr});
    } else {
      var field = hui.build('div.hui_form_field');
      if (this.options.large) {
        hui.cls.add(field, 'hui-large');
      }
      if (label) {
        label = hui.ui.getTranslated(label);
        hui.build('label',{className:'hui_form_field_label',text:label,parent:field});
      }
      field.appendChild(widget.getElement());
      this.element.appendChild(field);
      return new hui.ui.Form.Field({element: field});
    }
  }
};

// TODO: Should be hui.ui.Form.Fields
hui.ui.Form.Fields = hui.ui.Form.Group;

///////////////////////// Field //////////////////////////


/**
 * A form field
 * @constructor
 */
hui.ui.Form.Field = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Form.Field.prototype = {
  setVisible : function(visible) {
    this.element.style.display = visible ? '' : 'none';
  },
  add : function(w) {
    this.element.appendChild(w.element);
  }
};

/**
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
 * $open(row) - When a row is double clicked (rename to open)
 * $select(firstRow) - When a row is (un)selected/(un)checked
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
  this.options = hui.override({url:null,source:null,selectable:true,indent:null,selectMany:false,rememberSelection:false},options);
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
  this.checked = [];
  this.navigation = hui.get.firstByClass(this.element,'hui_list_navigation');
  this.count = hui.get.firstByClass(this.navigation,'hui_list_count');
  this.windowPage = hui.get.firstByClass(this.navigation,'window_page');
  this.windowPageBody = hui.get.firstByClass(this.navigation,'window_page_body');
  this.parameters = {};
  this.sortKey = null;
  this.sortDirection = null;

  this.window = {size:null,page:0,total:0};
  if (options.windowSize) {
    this.window.size = options.windowSize;
  }
  hui.ui.extend(this);
  if (options.dropFiles) {
    this._addDrop();
  }
  this._attach();
  if (this.url)  {
    this.refresh();
  }
};

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
  var cls = 'hui_list';
  if (options.variant) {
    cls+=' hui_list_'+options.variant;
  }
  options.element = hui.build('div',{
    'class' : cls,
    html: '<div class="hui_list_spinner"></div><div class="hui_list_navigation"><div class="hui_list_selection window_page"><div><div class="window_page_body"></div></div></div><span class="hui_list_count"></span></div><div class="hui_list_body"'+(options.maxHeight>0 ? ' style="max-height: '+options.maxHeight+'px; overflow: auto;"' : '')+'><table class="hui_list_table"><thead><tr></tr></thead><tbody></tbody></table></div>'});
  return new hui.ui.List(options);
};

hui.ui.List.prototype = {
  _attach : function() {
    hui.on(this.element,'click', this._onClick.bind(this));
    hui.on(this.element,'dblclick', this._onDblClick.bind(this));
  },
  _onClick : function(e) {
    if (this.busy) {return;}
    e = hui.event(e);
    var a = e.findByClass('hui_is_action');
    if (a) {
      var data = a.getAttribute('data');
      if (data) {
        data = hui.string.fromJSON(data);
      }
      var tr = hui.closest('tr',a);
      var row = null;
      if (tr) {
        var i = parseInt(tr.getAttribute('data-index'), 10);
        row = this.rows[i];
      }
      this.fire('clickIcon', {row: row, data: data, node: a});
    }
  },
  _onDblClick : function(e) {
    if (this.busy) {return;}
    e = hui.event(e);
    if (e.closest('.hui_list_row') && !e.closest('.hui_is_action')) {
      var row = this.getFirstSelection();
      if (row) {
        this.fire('open',row);
      }
    }
    hui.selection.clear();
  },
  _addDrop : function() {
    hui.drag.listen({
      element : this.element,
      hoverClass : 'hui_list_drop',
      $dropFiles : function(files) {
        this.fire('filesDropped',files);
      }.bind(this),
      $dropURL : function(url) {
        this.fire('urlDropped',url);
      }.bind(this)
    });
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
    if (this.selected.length>0) {
      return this._getRowsByIndexes(this.selected);
    }
    return this._getRowsByIndexes(this.checked);
  },
  /** Gets the first selection or null
   * @returns {Object} The first selected row
   */
  getFirstSelection : function() {
    var items = this.getSelection();
    if (items.length>0) {
      return items[0];
    }
    return null;
  },
  getSelectionSize : function() {
    return this.selected.length+this.checked.length;
  },
  getSelectionIds : function() {
    var selection = this.getSelection(),
      ids = [];
    for (var i=0; i < selection.length; i++) {
      ids.push(selection[i].id);
    }
    return ids;
  },
  _getRowsByIndexes : function(indexes) {
    var items = [];
    for (var i=0; i < indexes.length; i++) {
      items.push(this.rows[indexes[i]]);
    }
    return items;
  },

  /** Gets all rows of the list
   * @returns {Array} The all rows
   */
  getRows : function() {
    return this.rows;
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
        this.options.source.unListen(this);
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
      this.options.source.unListen(this);
      this.options.source=null;
    }
    this.url = url;
    this.selected = [];
    this.checked = [];
    this.sortKey = null;
    this.sortDirection = null;
    this.resetState();
    this.refresh();
  },
  /** Clears the data of the list and removes its data source */
  clear : function() {
    this._empty();
    if (this.options.source) {
      this.options.source.unListen(this);
    }
    this.options.source = null;
    this.url = null;
  },
  clearSelection : function() {
    this._changeSelection([]);
  },
  _empty : function() {
    this.selected = [];
    this.checked = [];
    this.columns = [];
    this.rows = [];
    this.navigation.style.display='none';
    hui.dom.clear(this.body);
    hui.dom.clear(this.head);
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
    else if (p=='sort.key') return this.sortKey;
    else if (p=='sort.direction') return (this.sortDirection || 'ascending');
    else if (p=='selection.id') {
      var s = this.getFirstSelection();
      if (s) {
        return s.id;
      }
      return null;
    }
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
      this.options.source.refreshLater();
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
      $object : function(obj) {this._setBusy(false);this.$objectsLoaded(obj);}.bind(this),
      $xml : function(obj) {this._setBusy(false);this.$listLoaded(obj);}.bind(this)
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
  _clickHeader : function(e) {
    e = hui.event(e);
    var th = e.findByTag('th');
    this.sort(th.huiIndex);
  },
  /** @private */
  $listLoaded : function(doc) {
    this._setError(false);
    var hadSelection = this.selected.length>0 || this.checked.length>0;
    var previousSelection;
    if (this.options.rememberSelection) {
      previousSelection = this.getSelectionIds();
    }
    this.selected = [];
    this.checked = [];
    this._parseWindow(doc);
    this._buildNavigation();
    hui.dom.clear(this.head);
    hui.dom.clear(this.body);
    this.rows = [];
    this.columns = [];
    this.checkboxMode = doc.documentElement.getAttribute('checkboxes')==='true';
    var movable = doc.documentElement.getAttribute('ordering')==='true';
    var headTr = document.createElement('tr');
    var sort = doc.getElementsByTagName('sort');
    this.sortKey=null;
    this.sortDirection=null;
    if (sort.length>0) {
      this.sortKey = sort[0].getAttribute('key');
      this.sortDirection = sort[0].getAttribute('direction');
    }
    if (this.checkboxMode) {
      var checkTh = hui.build('th',{className:'list_check',parent:headTr});
      hui.build('a',{className:'list_check_all',parent:checkTh});
      hui.listen(checkTh,'click',this._checkAll.bind(this));
    }
    if (movable) {
      hui.build('th',{'class':'hui_list_order_header',parent:headTr});
    }
    var headers = doc.getElementsByTagName('header');
    var i;
    for (i=0; i < headers.length; i++) {
      var className = '';
      var th = document.createElement('th');
      var width = headers[i].getAttribute('width');
      var key = headers[i].getAttribute('key');
      var sortable = headers[i].getAttribute('sortable')=='true';
      if (width && width !== '') {
        th.style.width = width+'%';
      }
      if (headers[i].getAttribute('align')) {
        th.style.textAlign=headers[i].getAttribute('align');
      }
      if (sortable) {
        var self = this;
        th.huiIndex = i;
        hui.on(th, 'click', this._clickHeader, this);
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
    }
    this.head.appendChild(headTr);
    var frag = document.createDocumentFragment();
    var rows = doc.getElementsByTagName('row');
    for (i=0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName('cell');
      var row = document.createElement('tr');
      row.className = 'hui_list_row';
      row.setAttribute('data-index',i);
      var td;
      if (this.checkboxMode) {
        td = hui.build('td',{parent:row,className:'hui_list_checkbox'});
        hui.build('a',{className:'hui_list_checkbox',parent:td});
      }
      if (movable) {
        td = hui.build('td',{parent:row,className:'hui_list_order'});
        hui.build('a',{className:'hui_list_order_handler',parent:td});
      }

      var icon = rows[i].getAttribute('icon');
      var title = rows[i].getAttribute('title');
      var level = rows[i].getAttribute('level');
      for (var j=0; j < cells.length; j++) {
        td = document.createElement('td');
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
        if (cells[j].getAttribute('class')) {
          hui.cls.add(td,cells[j].getAttribute('class'));
        }
        if (cells[j].getAttribute('dimmed')=='true') {
          td.className='hui_list_dimmed';
        }
        if (j===0 && level > 1) {
          td.style.paddingLeft = ((parseInt(level)-1)*16+5)+'px';
        } else if (j===0 && this.options.indent) {
          td.style.paddingLeft = this.options.indent + 'px';
        }
        this._parseCell(cells[j],td);
        row.appendChild(td);
        if (!title) {
          title = hui.dom.getText(cells[j]);
        }
        if (!icon) {
          icon = cells[j].getAttribute('icon');
        }
      }
      var info = {id:rows[i].getAttribute('id'),kind:rows[i].getAttribute('kind'),icon:icon,title:title,index:i,data:this._getData(rows[i])};
      row.dragDropInfo = info;
      this._addRowBehavior(row,i);
      frag.appendChild(row);
      this.rows.push(info);
    }
    this.body.appendChild(frag);
    this._setEmpty(rows.length===0);
    if (this.options.rememberSelection) {
      this._applyPreviousSelection(previousSelection);
    } else {
      this.fire('selectionReset');
      if (hadSelection) {
        this.fire('select',null);
      }
    }
    this.fireSizeChange();
  },
  _applyPreviousSelection : function(previousSelection) {
    var s = [];
    for (var i=0; i < previousSelection.length; i++) {
      for (var j=0; j < this.rows.length; j++) {
        if (this.rows[j].id === previousSelection[i]) {
          s.push(j);
        }
      }
    }
    this._changeSelection(s);
  },
  _parseCell : function(node,cell) {
    var variant = node.getAttribute('variant');
    if (variant) {
      cell = hui.build('div',{parent:cell,className : 'hui_list_cell_'+variant});
    }
    var iconName = node.getAttribute('icon');
    if (iconName) {
      cell.appendChild(hui.ui.createIcon(iconName, 16));
      cell = hui.build('div',{parent:cell,style:'margin-left: 21px; padding-top: 1px;'});
    }
    for (var i=0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (hui.dom.isDefinedText(child)) {
        hui.dom.addText(cell,child.nodeValue);
      } else if (hui.dom.isElement(child,'break')) {
        cell.appendChild(document.createElement('br'));
      } else if (hui.dom.isElement(child,'icon')) {
        var size = child.getAttribute('size') || 16;
        var icon = hui.ui.createIcon(child.getAttribute('icon'),size);
        hui.cls.add(icon, 'hui_list_icon')
        if (child.getAttribute('hint')) {
          icon.setAttribute('title',child.getAttribute('hint'));
        }
        if (child.getAttribute('action')=='true') {
          hui.cls.add(icon,'hui_is_action');
        }
        var data = child.getAttribute('data');
        if (data) {
          icon.setAttribute('data',data);
        }
        if (child.getAttribute('revealing')==='true') {
          hui.cls.add(icon,'hui_list_revealing');
        }
        cell.appendChild(icon);
      } else if (hui.dom.isElement(child,'symbol')) {
        var symbol = hui.build('span',{'class':'hui_symbol hui_list_symbol hui_symbol-'+child.getAttribute('name'), parent: cell});
        if (child.getAttribute('action')=='true') {
          hui.cls.add(symbol,'hui_is_action');
        }
      } else if (hui.dom.isElement(child,'line')) {
        var line = hui.build('p',{'class':'hui_list_line'});
        if (child.getAttribute('dimmed')=='true') {
          hui.cls.add(line,'hui_list_dimmed');
        }
        if (child.getAttribute('minor')=='true') {
          hui.cls.add(line,'hui_list_minor');
        }
        if (child.getAttribute('mini')=='true') {
          hui.cls.add(line,'hui_list_mini');
        }
        if (child.getAttribute('class')) {
          hui.cls.add(line,child.getAttribute('class'));
        }
        if (child.getAttribute('top')) {
          line.style.paddingTop=child.getAttribute('top')+'px';
        }
        cell.appendChild(line);
        this._parseCell(child,line);
      } else if (hui.dom.isElement(child,'object')) {
        var obj = hui.build('div',{'class':'hui_list_object'});
        if (child.getAttribute('icon')) {
          obj.appendChild(hui.ui.createIcon(child.getAttribute('icon'),16));
        }
        if (child.firstChild && child.firstChild.nodeType===3 && child.firstChild.nodeValue.length>0) {
          hui.dom.addText(obj,child.firstChild.nodeValue);
        }
        cell.appendChild(obj);
      } else if (hui.dom.isElement(child,'icons')) {
        var icons = hui.build('span',{'class':'hui_list_icons'});
        if (child.getAttribute('left')) {
          icons.style.marginLeft=child.getAttribute('left')+'px';
        }
        this._parseCell(child,icons);
        cell.appendChild(icons);
      } else if (hui.dom.isElement(child,'button')) {
        var button = hui.ui.Button.create({text:child.getAttribute('text'),small:true,rounded:true,data:this._getData(child)});
        button.click(this._buttonClick.bind(this));
        cell.appendChild(button.getElement());
      } else if (hui.dom.isElement(child,'wrap')) {
        if (hui.browser.wordbreak) {
          hui.cls.add(cell,'hui_list_wrap');
          hui.dom.addText(cell,hui.dom.getText(child));
        } else {
          hui.dom.addText(cell,this._wrap(hui.dom.getText(child)));
        }
      } else if (hui.dom.isElement(child,'delete')) {
        this._parseCell(child,hui.build('del',{parent:cell}));
      } else if (hui.dom.isElement(child,'strong')) {
        this._parseCell(child,hui.build('strong',{parent:cell}));
      } else if (hui.dom.isElement(child,'badge')) {
        this._parseCell(child,hui.build('span',{className:'hui_list_badge',parent:cell}));
      } else if (hui.dom.isElement(child,'progress')) {
        var progress = hui.build('span',{className:'hui_list_progress',parent:cell});
        var percent = Math.round(parseFloat(child.getAttribute('value'))*100);
        hui.build('span',{style:{width:percent+'%'},parent:progress});
        this._parseCell(child,progress);
      } else if (hui.dom.isElement(child,'html')) {
        for (var j = 0; j < child.childNodes.length; j++) {
          var clone = child.childNodes[j].cloneNode(true);
          clone.namespaceURI = child.namespaceURI;
          cell.appendChild(clone);
        }
      }
    }
  },

  /** @private */
  $objectsLoaded : function(data) {
    var hadSelection = this.selected.length>0 || this.checked.length>0;
    this._setError(false);
    if (data === null || data === undefined) {
      // NOOP
    } else if (data.constructor == Array) {
      this.setObjects(data);
    } else {
      this.setData(data);
    }
    this.fire('selectionReset');
    if (hadSelection) {
      this.fire('select');
    }
    this.fireSizeChange();
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
    }
    return out;
  },
  _getData : function(node) {
    var data = node.getAttribute('data');
    if (data) {
      return hui.string.fromJSON(data);
    }
    return null;
  },
  _buttonClick : function(button) {
    var row = hui.closest('tr', button.getElement());
    var obj = this.rows[parseInt(row.getAttribute('data-index'),10)];
    this.fire('clickButton',{row:obj,button:button});
  },
  _parseWindow : function(doc) {
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
  _buildNavigation : function() {
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
      var indices = this._buildPages(pages,this.window.page);
      for (var i=0; i < indices.length; i++) {
        var index = indices[i];
        if (index==='') {
          pageBody.appendChild(hui.build('span',{text:'·'}));
        } else {
          var a = document.createElement('a');
          a.appendChild(document.createTextNode(index+1));
          a.setAttribute('data-index',index);
          hui.on(a, 'mousedown', this._onPageClick, this);
          if (index == self.window.page) {
            a.className='hui_list_selected';
          }
          pageBody.appendChild(a);
        }
      }
      this.windowPage.style.display='block';
    }
  },
  _buildPages : function(count,selected) {
    var pages = [];
    var x = false;
    for (var i=0;i<count;i++) {
      if (i<1 || i>count-2 || Math.abs(selected-i)<5) {
        pages.push(i);
        x=false;
      } else {
        if (!x) {
          pages.push('');
        }
        x = true;
      }
    }
    return pages;
  },
  /** @private */
  setData : function(data) {
    this.selected = [];
    this.checked = [];
    var win = data.window || {};
    this.window.total = win.total || 0;
    this.window.size = win.size || 0;
    this.window.page = win.page || 0;
    this._buildNavigation();
    this._buildHeaders(data.headers);
    this._buildRows(data.rows);
    this._setEmpty(!data.rows || data.rows.length === 0);
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
        hui.listen(th,'click',function() {this.sort(i);}.bind(this));
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
      var tr = hui.build('tr.hui_list_row');
      var icon = r.icon;
      var title = r.title;
      hui.each(r.cells,function(c) {
        var td = hui.build('td');
        if (c.icon) {
          td.appendChild(hui.ui.createIcon(c.icon,16));
          icon = icon || c.icon;
        }
        if (c.text) {
          td.appendChild(document.createTextNode(c.text));
          title = title || c.text;
        }
        tr.appendChild(td);
      });
      self.body.appendChild(tr);
      // TODO: Memory leak!
      var info = {id:r.id,kind:r.kind,icon:icon,title:title,index:i};
      tr.dragDropInfo = info;
      self.rows.push({id:r.id,kind:r.kind,icon:icon,title:title,index:i,data:r.data});
      this._addRowBehavior(tr,i);
    }.bind(this));
  },
  /** @private */
  setObjects : function(objects) {
    objects = objects || [];
    this.selected = [];
    this.checked = [];
    hui.dom.clear(this.body);
    this.rows = [];
    for (var i=0; i < objects.length; i++) {
      var row = hui.build('tr.hui_list_row');
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
                cell.appendChild(this._createObject(value[k]));
              } else {
                cell.appendChild(hui.build('div',{text:value}));
              }
            }
          } else if (value.constructor == Object) {
            cell.appendChild(this._createObject(value[j]));
          } else {
            hui.dom.addText(cell,value);
            title = title === null ? value : title;
          }
        }
        row.appendChild(cell);
      }
      var info = {id:obj.id,kind:obj.kind,title:title};
      row.dragDropInfo = info;
      this.body.appendChild(row);
      this._addRowBehavior(row,i);
      this.rows.push(obj);
    }
  },
  /** @private */
  _createObject : function(object) {
    var node = hui.build('div',{'class':'hui_list_object'});
    if (object.icon) {
      node.appendChild(hui.ui.createIcon(object.icon,16));
    }
    hui.dom.addText(node,object.text || object.name || '');
    return node;
  },
  /** @private */
  _addRowBehavior : function(row,index) {
    var self = this;
    row.onmousedown = function(e) {
      if (self.busy) {return;}
      var event = hui.event(e);
      var action = event.findByClass('hui_list_icon_action');
      if (!action) {
        var check = event.findByClass('hui_list_checkbox');
        if (check) {
          self._toggleChecked(index);
        } else {
          self._onRowDown(index,event);
          if (hui.ui.startDrag) {
            // Only if available
            hui.ui.startDrag(e,row);
          }
          return false;
        }
      }
    };
  },
  _checkAll : function() {
    for (var i=0; i < this.rows.length; i++) {
      hui.array.flip(this.checked,i);
    }
    this._drawChecks();
    this._changeSelection([]);
  },
  _toggleChecked : function(index) {
    hui.array.flip(this.checked,index);
    this._drawChecks();
    this._changeSelection([]);
  },
  _drawChecks : function() {
    var rows = this.body.getElementsByTagName('tr');
    for (var i=0; i < rows.length; i++) {
      hui.cls.set(rows[i],'hui_list_checked',hui.array.contains(this.checked,i));
    }
  },
  _clearChecked : function() {
    this.checked = [];
    this._drawChecks();
    this.fire('checkedReset');
  },
  _changeSelection : function(indexes) {
    var rows = this.body.getElementsByTagName('tr'),
      i;
    for (i = 0 ; i < this.selected.length; i++) {
      hui.cls.remove(rows[this.selected[i]],'hui_list_selected');
    }
    for (i = 0; i < indexes.length; i++) {
      hui.cls.add(rows[indexes[i]],'hui_list_selected');
    }
    this.selected = indexes;
    if (indexes.length > 0) {
      this.fire('select',this.rows[indexes[0]]);
      hui.ui.firePropertyChange(this,'selection.id',this.rows[indexes[0]].id);
      this._clearChecked();
    } else {
      this.fire('select');
    }
  },
  _onRowDown : function(index,event) {
    if (!this.options.selectable) {
      return;
    }
    this.checked = [];
    if (event.metaKey && this.options.selectMany) {
      var newSelection = this.selected.slice(0);
      hui.array.flip(newSelection,index);
      this._changeSelection(newSelection);
    } else {
      this._changeSelection([index]);
    }
  },
  /** @private */
  _onPageClick : function(e) {
    var tag = hui.event(e).getElement();
    var index = parseInt(tag.getAttribute('data-index'));
    this.window.page = index;
    hui.ui.firePropertyChange(this,'window',this.window);
    hui.ui.firePropertyChange(this,'window.page',this.window.page);
    var as = this.windowPageBody.getElementsByTagName('a');
    for (var i = as.length - 1; i >= 0; i--){
      as[i].className = as[i]==tag ? 'hui_list_selected' : '';
    }
  }
};

/**
 * @constructor
 */
hui.ui.Tabs = function(o) {
  o = o || {};
  this.name = o.name;
  this.element = hui.get(o.element);
  this.activeTab = -1;
  var x = hui.get.firstByClass(this.element,'hui_tabs_bar');
  this.bar = hui.find('.hui_tabs_bar', this.element);
  this.tabs = hui.findAll('.hui_tabs_tab', this.element);
  this.contents = hui.findAll('.hui_tabs_body', this.element);
  this._attach();
  hui.ui.extend(this);
};

hui.ui.Tabs.create = function(options) {
  options = options || {};
  var e = options.element = hui.build('div',{'class':'hui_tabs'});
  if (options.small) {
    hui.cls.add(e, 'hui_tabs-small');
  }
  var bar = hui.build('div',{'class' : 'hui_tabs_bar', parent : e});
  if (options.centered) {
    hui.cls.add(bar, 'hui_tabs_bar-centered');
  }
  return new hui.ui.Tabs(options);
};

hui.ui.Tabs.prototype = {
  _attach : function() {
    for (var i=0; i < this.tabs.length; i++) {
      this._attachTab(this.tabs[i],i);
    }
  },
  _attachTab : function(tab, index) {
    hui.listen(tab,'click',function() {
      this._clickTab(index);
    }.bind(this));
  },
  _clickTab : function(index) {
    this.activeTab = index;
    this._update();
    hui.ui.callVisible(this);
  },
  _update : function() {
    for (var i=0; i < this.tabs.length; i++) {
      hui.cls.set(this.tabs[i], 'hui-is-selected', i == this.activeTab);
      hui.cls.set(this.contents[i], 'hui-is-selected', i == this.activeTab);
    }
  },
  createTab : function(options) {
    options = options || {};
    var tab = hui.build('a.hui_tabs_tab',{text: options.title,parent: this.bar});
    this._attachTab(tab, this.tabs.length);
    this.tabs.push(tab);
    var e = options.element = hui.build('div',{'class':'hui_tabs_body'});
    if (options.padding>0) {
      e.style.padding = options.padding+'px';
    }
    this.contents.push(e);
    this.element.appendChild(e);
    if (this.activeTab==-1) {
      this.activeTab=0;
      hui.cls.add(tab,'hui-is-selected');
      hui.cls.add(e,'hui-is-selected');
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
};

hui.ui.Tab.prototype = {
  add : function(widgetOrNode) {
    if (widgetOrNode.getElement) {
      this.element.appendChild(widgetOrNode.getElement());
    } else {
      this.element.appendChild(widgetOrNode);
    }
  }
};

/**
 * @constructor
 */
hui.ui.ObjectList = function(options) {
  this.options = hui.override({key:null},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.body = hui.get.firstByTag(this.element,'tbody');
  this.template = [];
  this.objects = [];
  hui.ui.extend(this);
};

hui.ui.ObjectList.create = function(o) {
  o=o || {};
  var e = o.element = hui.build('table',{'class':'hui_objectlist',cellpadding:'0',cellspacing:'0'});
  if (o.template) {
    var head = '<thead><tr>';
    for (var i=0; i < o.template.length; i++) {
      head+='<th>'+(o.template[i].label || '')+'</th>';
    }
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
};

hui.ui.ObjectList.prototype = {
  ignite : function() {
    this.addObject({});
  },
  addObject : function(data,addToEnd) {
    var obj;
    if (this.objects.length===0 || addToEnd) {
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
      this.body.insertBefore(obj.getElement(),last.getElement());
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
    }
    this.objects = [];
    this.addObject({});
  },
  addObjects : function(data) {
    for (var i=0; i < data.length; i++) {
      this.addObject(data[i]);
    }
  },
  setObjects : function(data) {
    this.reset();
    this.addObjects(data);
  },
  getObjects : function(data) {
    var list = [];
    for (var i=0; i < this.objects.length-1; i++) {
      list.push(this.objects[i].getData());
    }
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
};

/********************** Object ********************/

/** @constructor */
hui.ui.ObjectList.Object = function(index,data,list) {
  this.data = data;
  this.index = index;
  this.list = list;
  this.fields = [];
};

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
        if (i===0) cell.className='first';
        cell.appendChild(field.getElement());
        field.setValue(this.data[template.key]);
        this.element.appendChild(cell);
      }
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
    }
    return data;
  }
};

/*************************** Text **************************/

hui.ui.ObjectList.Text = function(key) {
  this.key = key;
  this.value = null;
};

hui.ui.ObjectList.Text.prototype = {
  clone : function() {
    return new hui.ui.ObjectList.Text(this.key);
  },
  getElement : function() {
    var input = hui.build('input',{'class':'hui_textinput'});
    this.wrapper = new hui.ui.Input({element:input});
    this.wrapper.listen(this);
    return input;
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
};

/*************************** Select **************************/

hui.ui.ObjectList.Select = function(key) {
  this.key = key;
  this.value = null;
  this.options = [];
};

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
    }
    var self = this;
    this.select.onchange = function() {
      self.object.valueDidChange();
    };
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
};

////////////////////////// DropDown ///////////////////////////

/**
 * A drop down selector
 * @constructor
 */
hui.ui.DropDown = function(options) {
  this.options = hui.override({
    placeholder: null,
    url: null,
    source: null,
    focus: false
  }, options);
  this.name = options.name;
  var e = this.element = hui.get(options.element);
  this.items = options.items || [];
  this.index = -1;
  this.value = hui.isDefined(this.options.value) ? this.options.value : null;
  this.dirty = true;
  this.busy = false;
  hui.ui.extend(this);
  if (options.listener) {
    this.listen(options.listener);
  }
  this._attach();
  this._updateIndex();
  this._updateUI();
  if (this.options.url) {
    this.options.source = new hui.ui.Source({
      url: this.options.url,
      delegate: this
    });
  } else if (this.options.source) {
    this.options.source.listen(this);
  }
};

hui.ui.DropDown.create = function(options) {
  options = options || {};
  var cls = 'hui_dropdown';
  if (options.variant) {
    cls += ' hui_dropdown-' + options.variant;
  }
  options.element = hui.build('a', {
    'class': cls,
    href: '#',
    html: '<span class="hui_dropdown_text"></span>'
  });
  var drop = new hui.ui.DropDown(options);
  if (options.items) {
    drop.setItems(options.items);
  }
  return drop;
};

hui.ui.DropDown.prototype = {
  nodes: {
    text: '.hui_dropdown_text'
  },
  _attach: function() {
    hui.listen(this.element, 'click', this._click.bind(this));
    hui.listen(this.element, 'blur', this._hideSelector.bind(this));
    hui.listen(this.element, 'keydown', this._keyDown.bind(this));
    if (!this.options.focus) {
      hui.listen(this.element, 'mousedown', function(e) {
        hui.stop(e);
      });
    }
  },
  _updateIndex: function() {
    this.index = -1;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].value == this.value) {
        this.index = i;
      }
    }
  },
  _updateUI: function() {
    var selected = this.items[this.index];
    this.nodes.text.innerHTML = '';
    if (selected) {
      var text = selected.label || selected.title || selected.text || '';
      hui.dom.addText(this.nodes.text, text);
    } else if (this.options.placeholder) {
      this.nodes.text.appendChild(hui.build('span', {
        'class': 'hui_dropdown_placeholder',
        text: hui.string.escape(this.options.placeholder)
      }));
    }
    if (!this.selector) {
      return;
    }
    var as = hui.findAll('.hui_dropdown_option', this.selector);
    for (var i = 0; i < as.length; i++) {
      hui.cls.set(as[i], 'hui_selected', this.index == i);
    }
  },
  _click: function(e) {
    if (this.busy) {
      return;
    }
    hui.stop(e);
    if (this._selectorVisible) {
      this._hideSelector();
      //this.element.blur();
    } else {
      this._showSelector();
      this._hider = function(e) {
        e = hui.event(e);
        if (!e.isDescendantOf(this.element)) {
          this._hideSelector();
        }
      }.bind(this);
      hui.listen(document.body, 'mousedown', this._hider);
    }
  },
  _showSelector: function() {
    this._buildSelector();
    var el = this.element,
      s = this.selector;
    if (this.options.focus) {
      el.focus();
    }
    if (!this.items) return;
    var docHeight = hui.window.getViewHeight();
    if (docHeight < 200) {
      var left = hui.position.getLeft(this.element);
      hui.style.set(this.selector, {
        'left': left + 'px',
        top: '5px'
      });
    } else {
      var windowScrollTop = hui.window.getScrollTop();
      var scrollOffsetTop = hui.position.getScrollOffset(this.element).top;
      var scrollTop = windowScrollTop - scrollOffsetTop;
      hui.position.place({
        target: {
          element: this.element,
          vertical: 1,
          horizontal: 0
        },
        source: {
          element: this.selector,
          vertical: 0,
          horizontal: 0
        },
        top: scrollTop
      });
    }
    hui.style.set(s, {
      visibility: 'hidden',
      display: 'block',
      width: ''
    });
    var height = Math.min(docHeight - hui.position.getTop(s) - 5, 200);
    var width = Math.max(el.clientWidth - 5, 100, s.clientWidth + 20);
    var space = hui.window.getViewWidth() - hui.position.getLeft(el) - 20;
    width = Math.min(width, space);
    hui.style.set(s, {
      visibility: 'visible',
      width: width + 'px',
      zIndex: hui.ui.nextTopIndex(),
      maxHeight: height + 'px'
    });
    this._selectorVisible = true;
  },
  _hideSelector: function() {
    hui.unListen(document.body, 'mousedown', this._hider);
    if (!this.selector) {
      return;
    }
    this.selector.style.display = 'none';
    this._selectorVisible = false;
  },
  _keyDown: function(e) {
    if (this.busy) {
      return;
    }
    if (this.items.length === 0) {
      return;
    }
    if (e.keyCode == 40) {
      hui.stop(e);
      if (this.index >= this.items.length - 1) {
        this.value = this.items[0].value;
      } else {
        this.value = this.items[this.index + 1].value;
      }
      this._updateIndex();
      this._updateUI();
      this._fireChange();
    } else if (e.keyCode == 38) {
      hui.stop(e);
      if (this.index > 0) {
        this.index--;
      } else {
        this.index = this.items.length - 1;
      }
      this.value = this.items[this.index].value;
      this._updateUI();
      this._fireChange();
    }
  },
  selectFirst: function() {
    if (this.items.length > 0) {
      this.setValue(this.items[0].value);
    }
  },
  /** Get the value of the selected item */
  getValue: function() {
    return this.value;
  },
  setValue: function(value) {
    this.value = value;
    this._updateIndex();
    this._updateUI();
  },
  /** Set the value to null */
  reset: function() {
    this.setValue(null);
  },
  /** Refresh the associated source */
  refresh: function() {
    if (this.options.source) {
      this.options.source.refresh();
    }
  },
  stress: function() {
    hui.ui.stress(this);
  },
  focus: function() {
    try {
      this.element.focus();
    } catch (ignore) {}
  },
  // TODO: Is this used?
  getItem: function() {
    if (this.index >= 0) {
      return this.items[this.index];
    }
    return 0;
  },
  addItem: function(item) {
    this.items.push(item);
    this.dirty = true;
    this._updateIndex();
    this._updateUI();
  },
  setItems: function(items) {
    this.items = items;
    this.dirty = true;
    this.index = -1;
    this._updateIndex();
    this._updateUI();
  },
  /** @private */
  $optionsLoaded: function(items) {
    this.setItems(items);
  },
  /** @private */
  $sourceIsBusy: function() {
    this.busy = true;
    hui.style.setOpacity(this.element, 0.5);
  },
  /** @private */
  $sourceIsNotBusy: function() {
    this.busy = false;
    hui.style.setOpacity(this.element, 1);
  },
  /** @private */
  $sourceShouldRefresh: function() {
    return hui.dom.isVisible(this.element);
  },
  /** @private */
  $visibilityChanged: function() {
    if (hui.dom.isVisible(this.element)) {
      if (this.options.source) {
        // If there is a source, make sure it is initially
        this.options.source.refreshFirst();
      }
    } else {
      this._hideSelector();
    }
  },
  _buildSelector: function() {
    if (!this.dirty || !this.items) {
      return;
    }
    if (!this.selector) {
      this.selector = hui.build('div', {
        'class': 'hui_dropdown_options'
      });
      document.body.appendChild(this.selector);
      hui.listen(this.selector, 'mousedown', function(e) {
        hui.stop(e);
      });
    } else {
      this.selector.innerHTML = '';
    }
    var self = this;
    hui.each(this.items, function(item, i) {
      var e = hui.build('span', {
        'class': 'hui_dropdown_option',
        text: item.label || item.title || item.text || ''
      });
      hui.listen(e, 'mousedown', function(e) {
        hui.stop(e);
        self._itemClicked(item, i);
        hui.listenOnce(document.body, 'mouseup', function(e) {
          hui.stop(e);
        });
      });
      if (i == self.index) {
        hui.cls.add(e, 'hui_selected');
      }
      self.selector.appendChild(e);
    });
    this.dirty = false;
  },
  _itemClicked: function(item, index) {
    this.index = index;
    var changed = this.value != this.items[index].value;
    this.value = this.items[index].value;
    this._updateUI();
    this._hideSelector();
    if (changed) {
      this._fireChange();
    }
  },
  _fireChange: function() {
    hui.ui.callAncestors(this, 'childValueChanged', this.value);
    this.fire('valueChanged', this.value);
    hui.ui.firePropertyChange(this, 'value', this.value);
  },
  detach: function() {
    if (this.selector) {
      hui.dom.remove(this.selector);
    }
  }
};


/**
 * An alert
 * @constructor
 * @param {Object} options The options
 * @param {Element} options.element The DOM node
 * @param {String} options.name The component name
 * @param {Boolean} options.modal If the alert i modal (false)
 */
hui.ui.Alert = function(options) {
  this.options = hui.override({
    modal: false
  }, options);
  this.element = hui.get(options.element);
  this.name = options.name;
  this.body = hui.get.firstByClass(this.element, 'hui_alert_body');
  this.content = hui.get.firstByClass(this.element, 'hui_alert_content');
  this.emotion = this.options.emotion;
  this.title = hui.get.firstByTag(this.element, 'h1');
  hui.ui.extend(this);
};

/**
 * Creates a new instance of an alert
 * @static
 * @param {Object} options The options
 * @param {String} options.name The component name
 * @param {Boolean} options.modal If the alert i modal (false)
 * @param {String} options.emotion The component name
 * @param {String} options.title The component name
 * @param {String} options.text The component name
 */
hui.ui.Alert.create = function(options) {
  options = hui.override({
    text: '',
    emotion: null,
    title: null
  }, options);

  var element = options.element = hui.build('div', {
    'class': 'hui_alert'
  });
  var body = hui.build('div', {
    'class': 'hui_alert_body',
    parent: element
  });
  hui.build('div', {
    'class': 'hui_alert_content',
    parent: body
  });
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
};

hui.ui.Alert.prototype = {
  /**
   * Shows the alert
   */
  show: function() {
    var zIndex = hui.ui.nextAlertIndex();
    if (this.options.modal) {
      hui.ui.showCurtain({
        widget: this,
        zIndex: zIndex
      });
      zIndex++;
    }
    this.element.style.zIndex = zIndex;
    this.element.style.transform = 'scale(0.5)';
    this.element.style.display = 'block';
    this.element.style.top = (hui.window.getScrollTop() + 100) + 'px';
    hui.animate(this.element, 'opacity', 1, 200);
    hui.animate(this.element, 'transform', 'scale(1)', 600, {
      ease: hui.ease.elastic
    });
  },
  /**
   * Hides the alert
   */
  hide: function() {
    hui.animate(this.element, 'opacity', 0, 100, {
      hideOnComplete: true
    });
    hui.animate(this.element, 'margin-top', '0px', 100);
    hui.ui.hideCurtain(this);
  },
  /**
   * Sets the alert title
   * @param {String} text The new title
   */
  setTitle: function(text) {
    if (!this.title) {
      this.title = hui.build('h1', {
        parent: this.content
      });
    }
    hui.dom.setText(this.title, hui.ui.getTranslated(text));

  },
  /**
   * Sets the alert text
   * @param {String} text The new text
   */
  setText: function(text) {
    if (!this.text) {
      this.text = hui.build('p', {
        parent: this.content
      });
    }
    hui.dom.setText(this.text, hui.ui.getTranslated(text));
  },
  /**
   * Sets the alert emotion
   * @param {String} emotion Can be 'smile' or 'gasp'
   */
  setEmotion: function(emotion) {
    if (this.emotion) {
      hui.cls.remove(this.body, this.emotion);
    }
    this.emotion = emotion;
    hui.cls.add(this.body, emotion);
  },
  /**
   * Updates multiple properties
   * @param {Object} options
   * @param {String} options.title
   * @param {String} options.text
   * @param {String} options.emotion
   */
  update: function(options) {
    options = options || {};
    this.setTitle(options.title || null);
    this.setText(options.text || null);
    this.setEmotion(options.emotion || null);
  },
  /**
   * Adds a Button to the alert
   * @param {hui.ui.Button} button The button to add
   */
  addButton: function(button) {
    if (!this.buttons) {
      this.buttons = hui.ui.Buttons.create({
        align: 'right'
      });
      this.body.appendChild(this.buttons.element);
    }
    this.buttons.add(button);
  }
};

hui.ui.Alert.confirm = function(options) {
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
    ok.clearListeners();
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
};

hui.ui.Alert.alert = function(options) {
  if (!this.alertBox) {
    this.alertBox = hui.ui.Alert.create(options);
    this.alertBoxButton = hui.ui.Button.create({name:'huiAlertBoxButton',text : 'OK'});
    this.alertBoxButton.listen({
      $click$huiAlertBoxButton : function() {
        hui.ui.Alert.alertBox.hide();
        if (options.onOK) {
          options.onOK();
        }
      }
    });
    this.alertBox.addButton(this.alertBoxButton);
  } else {
    this.alertBox.update(options);
  }
  this.alertBoxButton.setText(options.button ? options.button : 'OK');
  this.alertBox.show();
};

hui = window.hui || {}; hui.ui = hui.ui || {};

/**
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
 * $click(button) - When the button is clicked (and confirmed)
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
  this._attach();
  // TODO: Deprecated!
  if (options.listener) {
    this.listen(options.listener);
  }
  if (options.listen) {
    this.listen(options.listen);
  }
};

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
 *  submit : «Boolean»,
 *
 *  listener : «Object»
 * }
 * </pre>
 */
hui.ui.Button.create = function(options) {
  options = hui.override({text:'',highlighted:false,enabled:true},options);
  var className = 'hui_button';
  if (options.variant) {
    className+=' hui-'+options.variant;
  }
  if (options.small) {
    className+=' hui-small';
  }
  if (options.mini) {
    className+=' hui-mini';
  }
  if (options.tiny) {
    className+=' hui-tiny';
  }
  if (options.large) {
    className+=' hui-large';
  }
  if (options.highlighted) {
    className+=' hui-highlighted';
  }
  if (!options.enabled) {
    className+=' hui-disabled';
  }
  var text = options.text ? hui.ui.getTranslated(options.text) : null;
  if (options.title) { // Deprecated
    text = hui.ui.getTranslated(options.title);
  }
  var element = options.element = hui.build('a',{'class':className, href:'#'});
  if (options.testName) {
    element.setAttribute('data-test', options.testName);
  }
  if (options.icon) {
    var icon = hui.build('span',{parent:element,'class':'hui_button_icon',style:'background-image:url('+hui.ui.getIconUrl(options.icon,16)+')'});
    if (!text) {
      hui.cls.add(icon,'hui_button_icon_notext');
    }
  }
  if (text) {
    hui.dom.addText(element,text);
  }
  return new hui.ui.Button(options);
};

hui.ui.Button.prototype = {
  _attach : function() {
    var self = this;
    hui.listen(this.element,'mousedown',function(e) {
      hui.stop(e);
    });
    hui.listen(this.element,'click',function(e) {
      hui.stop(e);
      self._onClick(e);
    });
  },
  _onClick : function(e) {
    if (this.enabled) {
      var alt = false;
      if (e) {
        alt = hui.event(e).altKey;
      }
      if (this.options.confirm && !alt) {
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
    this.fire('click',this);
    if (this.options.submit) {
      var form = hui.ui.getAncestor(this, 'hui_form');
      if (form) {
        form.submit();
      } else {
        form = hui.closest('form', this.element)
        if (form) {
          form.submit();
        } else {
          hui.log('No form found to submit');
        }
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
    hui.cls.set(this.element,'hui-highlighted',highlighted);
  },
  _updateUI : function() {
    hui.cls.set(this.element,'hui-disabled',!this.enabled);
  },
  /** Sets the button text
   * @param
   */
  setText : function(text) {
    hui.dom.setText(this.element, hui.ui.getTranslated(text));
  },
  /**
   * Get the data object for the button
   * @returns {Object} The data object
   */
  getData : function() {
    return this.options.data;
  },
  /**
   * Get the role of the button
   * @returns {String} The role
   */
  getRole : function() {
    return this.options.role;
  }
};

////////////////////////////////// Buttons /////////////////////////////

/** @constructor */
hui.ui.Buttons = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Buttons.create = function(options) {
  options = hui.override({top:0},options);
  var e = options.element = hui.build('div',{'class':'hui_buttons'});
  if (options.align==='right') {
    hui.cls.add(e,'hui_buttons-right');
  }
  if (options.align==='center') {
    hui.cls.add(e,'hui_buttons-center');
  }
  if (options.top > 0) {
    e.style.paddingTop=options.top+'px';
  }
  return new hui.ui.Buttons(options);
};

hui.ui.Buttons.prototype = {
  add : function(widget) {
    this.element.appendChild(widget.element);
    return this;
  }
};

hui.on(['hui.ui'],function() {
  hui.define('hui.ui.Button',hui.ui.Button);
});

/**
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
  this.selection = null;
  if (options.items && options.items.length>0) {
    for (var i=0; i < options.items.length; i++) {
      var item = options.items[i];
      this.items.push(item);
      var element = hui.get(item.id);
      item.element = element;
      this.addItemBehavior(element,item);
    }
    this.selection = this._getSelectionWithValue(this.options.value);
    this._updateUI();
  } else if (this.options.value !== null) {
    this.selection = {value:this.options.value};
  }
  hui.ui.extend(this);
};

/**
 * Creates a new selection widget
 * @param {Object} options The options : {width:0}
 */
hui.ui.Selection.create = function(options) {
  options = hui.override({width:0},options);
  var e = options.element = hui.build('div', {'class':'hui_selection'});
  if (options.width>0) {
    e.style.width = options.width+'px';
  }
  return new hui.ui.Selection(options);
};

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
    var item = this._getSelectionWithValue(value);
    if (item===null) {
      this.selection = null;
    } else {
      this.selection = item;
      this.kind=item.kind;
    }
    this._updateUI();
    this.fireChange();
  },
  _getSelectionWithValue : function(value) {
    var i;
    for (i=0; i < this.items.length; i++) {
      if (this.items[i].value==value) {
        return this.items[i];
      }
    }
    for (i=0; i < this.subItems.length; i++) {
      var items = this.subItems[i].items;
      for (var j=0; j < items.length; j++) {
        if (items[j].value==value) {
          return items[j];
        }
      }
    }
    return null;
  },
  /** Changes selection to the first item */
  selectFirst : function() {
    var i;
    for (i=0; i < this.items.length; i++) {
      this.changeSelection(this.items[i]);
      return;
    }
    for (i=0; i < this.subItems.length; i++) {
      var items = this.subItems[i].items;
      for (var j=0; j < items.length; j++) {
        this.changeSelection(items[j]);
        return;
      }
    }
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
    if (options.items) {
      items.setOptions(options.items);
    }
  },

  _updateUI : function() {
    var i;
    for (i=0; i < this.items.length; i++) {
      hui.cls.set(this.items[i].element,'hui_selected',this.isSelection(this.items[i]));
    }
    for (i=0; i < this.subItems.length; i++) {
      this.subItems[i]._updateUI();
    }
  },
  /** @private */
  changeSelection : function(item) {
    for (var i=0; i < this.subItems.length; i++) {
      this.subItems[i].selectionChanged(this.selection,item);
    }
    this.selection = item;
    this._updateUI();
    this.fireChange();
  },
  /** @private */
  fireChange : function() {
    this.fire('select',this.selection);
    this.fireProperty('value',this.selection ? this.selection.value : null);
    this.fireProperty('kind',this.selection ? this.selection.kind : null);
    for (var i=0; i < this.subItems.length; i++) {
      this.subItems[i].parentValueChanged();
    }
  },
  /** @private */
  registerItems : function(items) {
    items.parent = this;
    this.subItems.push(items);
  },
  /** @private */
  addItemBehavior : function(node,item) {
    hui.listen(node,'click',function() {
      this.itemWasClicked(item);
    }.bind(this));
    hui.listen(node,'dblclick',function(e) {
      hui.stop(e);
      hui.selection.clear();
      this._onDoubleClick(item);
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
      var inner = hui.build('span',{'class':'hui_selection_label',text:item.title || item.text || ''});
      if (item.icon) {
        node.appendChild(hui.ui.createIcon(item.icon,16));
      }
      node.appendChild(inner);
      hui.listen(node,'click',function() {
        this.itemWasClicked(item);
      }.bind(this));
      hui.listen(node,'dblclick',function(e) {
        hui.stop(e);
        this._onDoubleClick(item);
      }.bind(this));
    }.bind(this));
    this.fireSizeChange();
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
    if (this.busy>0) {return;}
    this.changeSelection(item);
  },
  _onDoubleClick : function(item) {
    if (this.busy>0) {return;}
    this.fire('open',item);
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
      this.fire('loaded');
    }
  },
  _checkValue : function() {
    if (!this.selection) {return;}
    var item = this._getSelectionWithValue(this.selection.value);
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
};

/////////////////////////// Items ///////////////////////////

/**
 * A group of items loaded from a source
 * @constructor
 * @param {Object} options The options : {element,name,source}
 */
hui.ui.Selection.Items = function(options) {
  this.options = hui.override({source:null},options);
  this.element = hui.get(options.element);
  this.title = hui.get(this.element.id+'_title');
  this.name = options.name;
  this.disclosed = {};
  this.parent = this.options;
  this.items = [];
  hui.ui.extend(this);
  if (this.options.source) {
    this.options.source.listen(this);
  }
};

hui.ui.Selection.Items.prototype = {
  /**
   * Refresh the underlying source
   */
  refresh : function() {
    if (this.options.source) {
      this.options.source.refresh();
    }
  },
  setOptions : function(options) {
    this.$optionsLoaded(options);
  },
  /** @private */
  $objectsLoaded : function(objects) {
    this.$optionsLoaded(objects);
  },
  /** @private */
  $optionsLoaded : function(items) {
    this.items = [];
    this.element.innerHTML='';
    this.buildLevel(this.element,items,0,true);
    if (this.title) {
      this.title.style.display=this.items.length>0 ? 'block' : 'none';
    }
    this.parent._updateUI();
    this.parent._checkValue();
    this.fireSizeChange();
  },
  $sourceIsBusy : function() {
    this.parent._setBusy(true);
  },
  /** @private */
  $sourceIsNotBusy : function() {
    this.parent._setBusy(false);
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
    }
  },
  /** @private */
  buildLevel : function(parent,items,inc,open) {
    if (!items) return;
    var hierarchical = this.isHierarchy(items);
    var level = hui.build('div',{'class':'hui_selection_level',style:(open ? 'display:block' : 'display:none'),parent:parent});
    hui.each(items,function(item) {
      var text = item.text || item.title || '';
      if (item.type=='title') {
        hui.build('div',{'class':'hui_selection_title',html:'<span>'+text+'</span>',parent:level});
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
        subOpen = this.disclosed[item.value];
        var cls = this.disclosed[item.value] ? 'hui_disclosure hui_disclosure_open' : 'hui_disclosure';
        var disc = hui.build('span', {'class': cls, parent: node});
        hui.listen(disc,'click',function(e) {
          hui.stop(e);
          self.toggle(disc,item);
        });
      }
      var rendition = hui.ui.callDelegates(this.parent, 'render', item);
      if (rendition) {
        node.appendChild(rendition);
      } else {
        var inner = hui.build('span', {'class':'hui_selection_label', text: text});
        if (item.icon) {
          node.appendChild(hui.ui.createIcon(item.icon, 16));
        }
        node.appendChild(inner);        
      }
      hui.listen(node,'click',function(e) {
        this.parent.itemWasClicked(item);
      }.bind(this));
      hui.listen(node,'dblclick',function(e) {
        hui.stop(e);
        hui.selection.clear();
        this.parent._onDoubleClick(item);
      }.bind(this));
      level.appendChild(node);
      var info = {title:text,icon:item.icon,badge:item.badge,kind:item.kind,element:node,value:item.value};
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
    this.parent.fireSizeChange();
  },
  /** @private */
  isHierarchy : function(items) {
    if (!items) {return false;}
    for (var i=0; i < items.length; i++) {
      if (items[i]!==null && items[i].children && items[i].children.length>0) {
        return true;
      }
    }
    return false;
  },
  /** Get the selection of this items group
   * @returns {Object} The selected item or null */
  getValue : function() {
    if (this.parent.selection === null) {
      return null;
    }
    for (var i=0; i < this.items.length; i++) {
      if (this.items[i].value == this.parent.selection.value) {
        return this.items[i];
      }
    }
    return null;
  },
  _updateUI : function() {
    for (var i=0; i < this.items.length; i++) {
      hui.cls.set(this.items[i].element,'hui_selected',this.parent.isSelection(this.items[i]));
    }
  },
  /** @private */
  selectionChanged : function(oldSelection,newSelection) {
    for (var i=0; i < this.items.length; i++) {
      var value = this.items[i].value;
      if (value == newSelection.value) {
        this.fireProperty('value',newSelection.value);
        return;
      }
    }
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
    }
    this.fireProperty('value',null);
  }
};


/** @constructor */
hui.ui.Toolbar = function(options) {
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
};

hui.ui.Toolbar.create = function(options) {
  options = options || {};
  var element = options.element = hui.build('div.hui_toolbar');
  if (options.labels===false) {
    hui.cls.add(element,'hui_toolbar-nolabels');
  }
  if (options.variant) {
    hui.cls.add(element,'hui_toolbar-'+options.variant);
  }
  return new hui.ui.Toolbar(options);
};

hui.ui.Toolbar.prototype = {
  add : function(widget) {
    this.element.appendChild(widget.getElement());
  },
  addDivider : function() {
    this.element.appendChild(hui.build('span.hui_toolbar_divider'));
  },
  setSelection : function(key) {
    var desc = hui.ui.getDescendants(this);
    for (var i=0; i < desc.length; i++) {
      var widget = desc[i];
      if (widget.setSelected) {
        widget.setSelected(widget.key==key);
      }
    }
  },
  getByKey : function(key) {
    var desc = hui.ui.getDescendants(this);
    for (var i=0; i < desc.length; i++) {
      var widget = desc[i];
      if (widget.key==key) {
        return widget;
      }
    }
  }
};



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
  hui.ui.extend(this);
  if (options.listener) {
    this.listen(options.listener);
  }
  this._attach();
};

hui.ui.Toolbar.Icon.create = function(options) {
  var element = options.element = hui.build('a.hui_toolbar_icon');
  var icon = hui.build('span.hui_icon',{parent: element});
  hui.ui.setIconImage(icon, options.icon, 32);
  if (options.overlay) {
    hui.build('span.hui_icon_overlay',{parent:icon,style:'background-image: url('+hui.ui.getIconUrl('overlay/'+options.overlay,32)+')'});
  }
  hui.build('span.hui_toolbar_icon_text',{text:options.title || options.text, parent:element});
  return new hui.ui.Toolbar.Icon(options);
};

hui.ui.Toolbar.Icon.prototype = {
  _attach : function() {
    var self = this;
    this.element.onclick = function() {
      self._click();
    };
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
  setBadge : function(value) {
    var node = hui.get.firstByClass(this.element,'hui_icon_badge');
    if (!node && !hui.isBlank(value)) {
      node = hui.build('span',{'class':'hui_icon_badge',parent:hui.get.firstByClass(this.element,'hui_icon'),text:value});
    } else if (hui.isBlank(value) && node) {
      hui.dom.remove(node);
    } else if (node) {
      hui.dom.setText(node,value);
    }
  },
  setLabel : function(label) {
    var e = hui.get.firstByClass(this.element,'hui_toolbar_icon_text');
    hui.dom.setText(e,label);
  },
  setIcon : function(icon) {
    var e = hui.get.firstByClass(this.element,'hui_icon');
    hui.ui.setIconImage(e, icon, 32);
  },
  /** Sets wether the icon should be selected */
  setSelected : function(selected) {
    if (selected) {
      this.element.blur();
    }
    hui.cls.set(this.element,'hui_toolbar_icon_selected',selected);
  },
  /** @private */
  _click : function() {
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
    }
  },
  _fireClick : function() {
    this.fire('toolbarIconWasClicked'); // TODO deprecated
    this.fire('click');
  }
};


//////////////////////// More ///////////////////////

/** @constructor */
hui.ui.Toolbar.More = function(options) {
  this.element = hui.get(options.element);
  this.name = options.name;
  this.button = hui.get.firstByClass(this.element,'hui_toolbar_more_toggle');
  hui.listen(this.button,'click',this.toggle.bind(this));
  hui.ui.extend(this);
};

hui.ui.Toolbar.More.prototype = {
  toggle : function() {
    hui.cls.toggle(this.element,'hui_is_expanded');
  }
};

/**
  Used to choose an image
  @constructor
*/
hui.ui.ImageInput = function(options) {
  this.name = options.name;
  this.options = hui.override({width:48,height:48},options);
  this.element = hui.get(options.element);
  this.value = null;
  hui.ui.extend(this);
  this._attach();
};

hui.ui.ImageInput.prototype = {
  _attach : function() {
    hui.listen(this.element,'click',this._showPicker.bind(this));
    hui.listen(hui.get.firstByTag(this.element,'a'),'click',this._clear.bind(this));
  },
    /** @Deprecated */
  setObject : function(obj) {
    this.value = obj;
    this._updateUI();
  },
    /** @Deprecated */
  getObject : function() {
    return this.value;
  },
  getValue : function() {
    return this.value;
  },
  setValue : function(obj) {
    this.setObject(obj);
  },
  _clear : function(e) {
    hui.stop(e);
    this.reset();
    this._fireChange();
  },
  reset : function() {
    this.value = null;
    this._updateUI();
  },
  _updateUI : function() {
    hui.cls.set(this.element,'hui_imageinput_full',this.value !== null);
    if (this.value === null) {
      this.element.style.backgroundImage = '';
    } else {
      var url = hui.ui.resolveImageUrl(this,this.value,this.options.width,this.options.height);
      this.element.style.backgroundImage = 'url('+url+')';
    }
  },
  _showFinder : function() {
    if (!this.finder) {
      this.finder = hui.ui.Finder.create(
        this.options.finder
      );
      this.finder.listen({
        $select : function(object) {
          this.setObject(object);
          this._fireChange();
          this.finder.hide();
        }.bind(this)
      });
    }
    this.finder.show();
  },
  _showPicker : function() {
    if (this.options.finder) {
      this._showFinder();
    }
  },
  /** @private */
  $visibilityChanged : function() {
    if (this.finder && !hui.dom.isVisible(this.element)) {
      this.finder.hide();
    }
  },
  _fireChange : function() {
    this.fireValueChange();
  }
};

/**
 * A bound panel is a panel that is shown at a certain place
 * @constructor
 * @param {Object} options The options
 * @param {Node} options.element The root element
 * @param {string} options.name The component name
 */
hui.ui.BoundPanel = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.name = options.name;
  this.visible = false;
  this.content = hui.get.firstByClass(this.element, 'hui_boundpanel_content');
  this.arrow = hui.get.firstByClass(this.element, 'hui_boundpanel_arrow');
  this.arrowWide = 37;
  this.arrowNarrow = 18;
  if (options.variant == 'light') {
    this.arrowWide = 23;
    this.arrowNarrow = 12;
  }
  hui.ui.extend(this);
};

/**
 * Creates a new bound panel
 *
 * @param {Object} options The options
 * @param {String} options.name The component name
 * @param {String} options.variant A visual variation
 * @param {Number} options.left Pixels from left
 * @param {Number} options.top Pixels from top
 * @param {Number} options.width Width in pixels
 * @param {Number} options.padding Padding in pixels
 */
hui.ui.BoundPanel.create = function(options) {
  options = hui.override({
    name: null,
    top: 0,
    left: 0,
    width: null,
    padding: null,
    modal: false,
    hideOnClick: false
  }, options);


  var html =
    '<div class="hui_boundpanel_arrow"></div>' +
  '<div class="hui_boundpanel_content" style="';
  if (options.width) {
    html += 'width:' + options.width + 'px;';
  }
  if (options.padding) {
    html += 'padding:' + options.padding + 'px;';
  }
  html += '"></div>';

  options.element = hui.build(
    'div', {
      'class': options.variant ? 'hui_boundpanel hui_boundpanel-' + options.variant : 'hui_boundpanel',
      style: 'display:none;zIndex:' + hui.ui.nextPanelIndex() + ';top:' + options.top + 'px;left:' + options.left + 'px',
      html: html,
      parent: document.body
    }
  );
  return new hui.ui.BoundPanel(options);
};


hui.ui.BoundPanel.prototype = {
  /**
   * Show or hide the panel
   */
  toggle: function() {
    if (!this.visible) {
      this.show();
    } else {
      this.hide();
    }
  },
  /** Shows the panel */
  show: function(options) {
    options = options || {};
    var target = options.target || this.options.target;

    if (target) {
      if (target.nodeName) {
        this.position(target);
      } else {
        this.position(hui.ui.get(target));
      }
    }
    if (this.visible) {
      this.element.style.zIndex = hui.ui.nextPanelIndex();
      return;
    }
    if (hui.browser.opacity) {
      hui.style.setOpacity(this.element, 0);
    }
    var vert;
    if (this.relativePosition == 'left') {
      vert = false;
      this.element.style.marginLeft = '20px';
    } else if (this.relativePosition == 'right') {
      vert = false;
      this.element.style.marginLeft = '-20px';
    } else if (this.relativePosition == 'top') {
      vert = true;
      this.element.style.marginTop = '20px';
    } else if (this.relativePosition == 'bottom') {
      vert = true;
      this.element.style.marginTop = '-20px';
    }
    this.element.style.visibility = 'visible';
    this.element.style.display = 'block';
    var index = hui.ui.nextPanelIndex();
    this.element.style.zIndex = index;
    hui.ui.callVisible(this);
    if (hui.browser.opacity) {
      hui.animate(this.element, 'opacity', 1, 300, {
        ease: hui.ease.fastSlow
      });
    }
    hui.animate(this.element, vert ? 'margin-top' : 'margin-left', '0px', 300, {
      ease: hui.ease.fastSlow
    });
    this.visible = true;
    if (this.options.modal) {
      hui.ui.showCurtain({
        widget: this,
        zIndex: index - 1,
        transparent: this.options.modal == 'transparent',
        color: 'auto'
      });
    }
    if (this.options.hideOnClick) {
      this.hideListener = hui.listen(document.body, 'click', function(e) {
        if (!hui.ui.isWithin(e, this.element)) {
          this.hide();
        }
      }.bind(this));
    }
  },
  /** @private */
  $curtainWasClicked: function() {
    hui.ui.hideCurtain(this);
    this.hide();
  },
  /** Hides the panel */
  hide: function() {
    if (!this.visible) {
      return;
    }
    if (!hui.browser.opacity) {
      this.element.style.display = 'none';
      hui.ui.callVisible(this);
    } else {
      hui.animate(this.element, 'opacity', 0, 100, {
        ease: hui.ease.slowFast,
        $complete: function() {
          this.element.style.display = 'none';
          hui.ui.callVisible(this);
        }.bind(this)
      });
    }
    if (this.options.modal) {
      hui.ui.hideCurtain(this);
    }
    this.visible = false;
    hui.unListen(document.body, 'click', this.hideListener);
  },
  /**
   * If the panel is currently visible
   */
  isVisible: function() {
    return this.visible;
  },
  /**
   * Adds a widget or element to the panel
   * @param {Node | Widget} child The object to add
   */
  add: function(child) {
    if (child.getElement) {
      this.content.appendChild(child.getElement());
    } else {
      this.content.appendChild(child);
    }
  },
  clear: function() {
    hui.ui.destroyDescendants(this.content);
    this.content.innerHTML = '';
  },
  /**
   * Adds som vertical space to the panel
   * @param {pixels} height The height of the space in pixels
   */
  addSpace: function(height) {
    this.add(hui.build('div', {
      style: 'font-size:0px;height:' + height + 'px'
    }));
  },
  _getDimensions: function() {
    var width, height;
    if (this.element.style.display == 'none') {
      this.element.style.visibility = 'hidden';
      this.element.style.display = 'block';
      width = this.element.clientWidth;
      height = this.element.clientHeight;
      this.element.style.display = 'none';
      this.element.style.visibility = '';
    } else {
      width = this.element.clientWidth;
      height = this.element.clientHeight;
    }
    return {
      width: width,
      height: height
    };
  },
  $$childSizeChanged: function() {
    this._rePosition();
  },
  $$layout: function() {
    this._rePosition();
  },
  _rePosition: function() {
    if (this._latest) {
      this.position(this._latest);
    }
  },
  /** Position the panel at a node
   * @param {Node} node The node the panel should be positioned at
   */
  position: function(options) {
    this._latest = options;
    var node,
      position,
      nodeOffset,
      nodeScrollOffset;
    if (options.getElement) {
      node = options.getElement();
    } else if (options.element) {
      node = options.element;
      position = options.position;
    } else if (options.rect) {
      position = options.position;
      node = {
        offsetWidth: options.rect.width,
        offsetHeight: options.rect.height
      };
      nodeOffset = {
        left: options.rect.left,
        top: options.rect.top
      };
      nodeScrollOffset = {
        left: 0,
        top: 0
      };
    } else {
      node = hui.get(options);
    }

    if (!nodeOffset) {
      nodeOffset = {
        left: hui.position.getLeft(node),
        top: hui.position.getTop(node)
      };
    }
    if (!nodeScrollOffset) {
      nodeScrollOffset = hui.position.getScrollOffset(node);
    }

    var windowScrollOffset = {
      left: hui.window.getScrollLeft(),
      top: hui.window.getScrollTop()
    };
    var nodeLeft = nodeOffset.left - windowScrollOffset.left + hui.window.getScrollLeft();
    var nodeWidth = node.clientWidth || node.offsetWidth;
    var nodeHeight = node.clientHeight || node.offsetHeight;

    var panelDimensions = this._getDimensions();
    var viewportWidth = document.body.clientWidth;
    var viewportHeight = hui.window.getViewHeight();

    var arrowLeft, arrowTop, left, top;
    var positionOnScreen = {
      top: nodeOffset.top - windowScrollOffset.top - (nodeScrollOffset.top - windowScrollOffset.top)
    };
    var vertical = positionOnScreen.top / viewportHeight;

    if (position == 'vertical') {
      vertical = vertical > 0.5 ? 0.9 : 0.1;
    }
    var min, max;
    if (vertical <= 0.1) {
      this.relativePosition = 'top';
      this.arrow.className = 'hui_boundpanel_arrow hui_boundpanel_arrow_top';
      if (this.options.variant == 'light') {
        arrowTop = this.arrowNarrow * -1;
      } else {
        arrowTop = this.arrowNarrow * -1;
      }
      left = Math.min(viewportWidth - panelDimensions.width - 2, Math.max(3, nodeLeft + (nodeWidth / 2) - ((panelDimensions.width) / 2)));
      arrowLeft = (nodeLeft + nodeWidth / 2) - left - this.arrowNarrow;
      top = nodeOffset.top + nodeHeight + 8 - (nodeScrollOffset.top - windowScrollOffset.top);
    } else if (vertical >= 0.9) {
      this.relativePosition = 'bottom';
      this.arrow.className = 'hui_boundpanel_arrow hui_boundpanel_arrow_bottom';
      if (this.options.variant == 'light') {
        arrowTop = panelDimensions.height - 1;
      } else {
        arrowTop = panelDimensions.height;
      }
      left = Math.min(viewportWidth - panelDimensions.width - 3, Math.max(3, nodeLeft + (nodeWidth / 2) - ((panelDimensions.width) / 2)));
      arrowLeft = (nodeLeft + nodeWidth / 2) - left - this.arrowNarrow;
      top = nodeOffset.top - panelDimensions.height - 5 - (nodeScrollOffset.top - windowScrollOffset.top);
    } else if ((nodeLeft + nodeWidth / 2) / viewportWidth < 0.5) {
      this.relativePosition = 'left';
      left = nodeLeft + nodeWidth + 10;
      this.arrow.className = 'hui_boundpanel_arrow hui_boundpanel_arrow_left';
      top = nodeOffset.top + (nodeHeight - panelDimensions.height) / 2;
      //top = Math.min(top,viewportHeight-panelDimensions.height+(windowScrollOffset.top+nodeScrollOffset.top));
      top -= (nodeScrollOffset.top - windowScrollOffset.top);
      min = windowScrollOffset.top + 3;
      max = windowScrollOffset.top + (viewportHeight - panelDimensions.height) - 3;
      top = Math.min(Math.max(top, min), max);
      arrowTop = nodeOffset.top - top;
      arrowTop -= (nodeScrollOffset.top - windowScrollOffset.top);
      arrowTop -= this.arrowWide / 2;
      arrowTop += nodeHeight / 2;
      if (this.options.variant == 'light') {
        arrowLeft = -12;
        arrowTop += 2;
      } else {
        arrowLeft = -18;
      }
    } else {
      this.relativePosition = 'right';
      left = nodeLeft - panelDimensions.width - 10;
      this.arrow.className = 'hui_boundpanel_arrow hui_boundpanel_arrow_right';
      top = nodeOffset.top + (nodeHeight - panelDimensions.height) / 2;
      //top = Math.min(top,viewportHeight-panelDimensions.height+(windowScrollOffset.top+nodeScrollOffset.top));
      top -= (nodeScrollOffset.top - windowScrollOffset.top);
      min = windowScrollOffset.top + 3;
      max = windowScrollOffset.top + (viewportHeight - panelDimensions.height) - 3;
      top = Math.min(Math.max(top, min), max);
      arrowTop = nodeOffset.top - top;
      arrowTop -= (nodeScrollOffset.top - windowScrollOffset.top);
      arrowTop -= this.arrowWide / 2;
      arrowTop += nodeHeight / 2;
      if (this.options.variant == 'light') {
        arrowLeft = panelDimensions.width;
        arrowTop += 2;
      } else {
        arrowLeft = panelDimensions.width;
      }
    }
    this.arrow.style.marginTop = arrowTop + 'px';
    this.arrow.style.marginLeft = arrowLeft + 'px';
    if (this.visible) {
      hui.animate(this.element, 'top', top + 'px', 500, {
        ease: hui.ease.fastSlow
      });
      hui.animate(this.element, 'left', left + 'px', 500, {
        ease: hui.ease.fastSlow
      });
    } else {
      this.element.style.top = top + 'px';
      this.element.style.left = left + 'px';
    }
  },
  detach: function() {
    hui.ui.hideCurtain(this);
  }
};


/**
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
 *  transitionReturn : «Integer»,
 *  images : «Array»,
 *  listener : «Object»
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
    transitionReturn : 300,
    images : []
  },options);

  // Collect elements ...
  this.element = hui.get(options.element);

  this.box = this.options.box;

  // State ...
  this.dirty = false;
  this.width = 600;
  this.height = 460;
  this.index = 0;
  this.position = 0; // pixels
  this.playing = false;
  this.name = options.name;
  this.images = options.images || [];

  hui.ui.extend(this);

  // Behavior ...
  this.box.listen(this);
  this._attach();
  this._attachDrag();

  if (options.listener) {
    this.listen(options.listener);
  }
};

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
  var box = options.box = hui.ui.Box.create({variant:'plain',absolute:true,modal:true,closable:true});
  box.add(element);
  box.addToDocument();
  return new hui.ui.ImageViewer(options);
};

hui.ui.ImageViewer.prototype = {

  nodes : {
    viewer : '.hui_imageviewer_viewer',
    innerViewer : '.hui_imageviewer_inner_viewer',

    status : '.hui_imageviewer_status',
    text : '.hui_imageviewer_text',

    previous : '.hui_imageviewer_previous',
    controller : '.hui_imageviewer_controller',
    next : '.hui_imageviewer_next',
    play : '.hui_imageviewer_play',
    close : '.hui_imageviewer_close'
  },

  _attach : function() {
    var self = this;
    this.nodes.next.onclick = function() {
      self.next(true);
    };
    this.nodes.previous.onclick = function() {
      self.previous(true);
    };
    this.nodes.play.onclick = function() {
      self.playOrPause();
    };
    this.nodes.close.onclick = this.hide.bind(this);

    this._timer = function() {
      self.next(false);
    };
    this._keyListener = function(e) {
      e = hui.event(e);
      if (e.escapeKey) {
        self.hide();
      } else if (!self.zoomed) {
        if (e.rightKey) {
          self.next(true);
        } else if (e.leftKey) {
          self.previous(true);
        } else if (e.returnKey) {
          self.playOrPause();
        }
      }
    };
    hui.listen(this.nodes.viewer,'mousemove',this._onMouseMove.bind(this));
    hui.listen(this.nodes.controller,'mouseover',function() {
      self.overController = true;
    });
    hui.listen(this.nodes.controller,'mouseout',function() {
      self.overController = false;
    });
    hui.listen(this.nodes.viewer,'mouseout',function(e) {
      if (!hui.ui.isWithin(e,this.nodes.viewer)) {
        self._hideController();
      }
    }.bind(this));
  },
  _draw : function(pos) {
    if (hui.browser.webkit) {
      this.nodes.innerViewer.style.webkitTransform = 'translate3d(' + this.position + 'px,0,0)';
    } else {
      this.nodes.innerViewer.style.marginLeft = this.position + 'px';
    }
  },
  _attachDrag : function() {
    var initial = 0;
    var left = 0;
    var scrl = 0;
    var viewer = this.nodes.viewer;
    var inner = this.nodes.innerViewer;
    var max = 0;
    hui.drag.register({
      touch : true,
      element : this.nodes.innerViewer,
      onBeforeMove : function(e) {
        initial = e.getLeft();
        scrl = this.position;
        max = (this.images.length-1) * this.width * -1;
      }.bind(this),
      onMove : function(e) {
        left = e.getLeft();
        var pos = (scrl - (initial - left));
        if (pos > 0) {
          pos = (Math.exp(pos * -0.013) -1) * -80;
        }
        if (pos < max) {
          pos = (Math.exp((pos - max) * 0.013) -1) * 80 + max;
        }
        this.position = pos;
        this._draw();
      }.bind(this),
      onAfterMove : function() {
        var func = (initial - left) < 0 ? Math.floor : Math.ceil;
        this.index = func(this.position * -1 / this.width);
        var num = this.images.length - 1;
        if (this.index==this.images.length) {
          this.index = 0;
        } else if (this.index < 0) {
          this.index = this.images.length - 1;
        } else {
          num = 1;
        }

        this._goToImage(true,num,false,true);
      }.bind(this),
      onNotMoved : this._zoom.bind(this)
    });
  },
  _onMouseMove : function() {
    window.clearTimeout(this.ctrlHider);
    if (this._shouldShowController()) {
      this.ctrlHider = window.setTimeout(this._hideController.bind(this),2000);
      if (!hui.browser.opacity) {
        this.nodes.controller.style.display='block';
      } else {
        hui.effect.fadeIn({element:this.nodes.controller,duration:200});
      }
    }
  },
  _hideController : function() {
    if (!this.overController) {
      if (!hui.browser.opacity) {
        this.nodes.controller.style.display='none';
      } else {
        hui.effect.fadeOut({element:this.nodes.controller,duration:500});
      }
    }
  },
  _getLargestSize : function(canvas,image) {
    return hui.fit(image,canvas,{upscale:false});
  },
  _calculateSize : function() {
    var snap = this.options.sizeSnap;
    var newWidth = hui.window.getViewWidth() - this.options.perimeter;
    newWidth = Math.floor(newWidth / snap) * snap;
    newWidth = Math.min(newWidth, this.options.maxWidth);
    var newHeight = hui.window.getViewHeight() - this.options.perimeter;
    newHeight = Math.floor(newHeight / snap) * snap;
    newHeight = Math.min(newHeight, this.options.maxHeight);
    var maxWidth = 0;
    var maxHeight = 0;
    for (var i = 0; i < this.images.length; i++) {
      var dims = this._getLargestSize({
        width: newWidth,
        height: newHeight
      }, this.images[i]);
      maxWidth = Math.max(maxWidth, dims.width);
      maxHeight = Math.max(maxHeight, dims.height);
    }
    newHeight = Math.floor(Math.min(newHeight, maxHeight));
    newWidth = Math.floor(Math.min(newWidth, maxWidth));

    if (newWidth != this.width || newHeight != this.height) {
      this.width = newWidth;
      this.height = newHeight;
      this.dirty = true;
    }

  },
  _updateUI : function() {
    if (this.dirty) {
      this.nodes.innerViewer.innerHTML='';
      for (var i=0; i < this.images.length; i++) {
        var element = hui.build('div',{'class':'hui_imageviewer_image'});
        hui.style.set(element,{width: (this.width + this.options.margin) + 'px',height : (this.height-1)+'px' });
        this.nodes.innerViewer.appendChild(element);
      }
      this.nodes.controller.style.display = this._shouldShowController() ? 'block' : 'none';
      this.dirty = false;
      this._preload();
    }
  },
  _shouldShowController : function() {
    return this.images.length > 1;
  },
  _goToImage : function(animate,num,user,drag) {
    var initial = this.position;
    var target = this.position = this.index * (this.width + this.options.margin) * -1;
    if (animate) {
      var duration, ease;
      if (drag) {
        duration = 200 * num;
        ease = hui.ease.fastSlow;
        ease = hui.ease.quadOut;
      }
      else if (num > 1) {
        duration = Math.min(num * this.options.transitionReturn, 2000);
        ease = this.options.easeReturn;
      } else {
        var end = this.index === 0 || this.index == this.images.length - 1;
        ease = (end ? this.options.easeEnd : this.options.ease);
        if (!user) {
          ease = this.options.easeAuto;
        }
        duration = (end ? this.options.transitionEnd : this.options.transition);
      }
      hui.animate({
        node : this.nodes.innerViewer,
        css : {marginLeft : target + 'px'},
        duration : duration,
        ease : ease,
        $render : function(node,v) {
          this.position = initial + (target - initial) * v;
          this._draw();
        }.bind(this)
      });
    } else {
      this._draw();
    }
    this._drawText();
  },

  _drawText : function() {
    var text = this.images[this.index].text;
    if (text) {
      this.nodes.text.innerHTML = text;
      this.nodes.text.style.display = 'block';
    } else {
      this.nodes.text.innerHTML = '';
      this.nodes.text.style.display = 'none';
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
    }
  },
  /** Show the image viewer
   * @param {Integer} index? Optional index to start from (zero-based)
   */
  show: function(index) {
    this.index = index || 0;
    this._calculateSize();
    this._updateUI();
    var margin = this.options.margin;
    hui.style.set(this.element, {
      width: (this.width + margin) + 'px',
      height: (this.height + margin * 2 - 1) + 'px'
    });
    hui.style.set(this.nodes.viewer, {
      width: (this.width + margin) + 'px',
      height: (this.height - 1) + 'px'
    });
    hui.style.set(this.nodes.innerViewer, {
      width: ((this.width + margin) * this.images.length) + 'px',
      height: (this.height - 1) + 'px'
    });
    hui.style.set(this.nodes.controller, {
      marginLeft: ((this.width - 160) / 2 + margin * 0.5) + 'px',
      display: 'none'
    });
    this.box.show();
    this._goToImage(false,0,false);
    hui.listen(document,'keydown',this._keyListener);
    this.visible = true;
    this._setHash(true);
  },
  _setHash : function(visible) {
    return; // Disabled
    /*
    if (!this._listening) {
      this._listening = true;
      if (!hui.browser.msie6 && !hui.browser.msie7) {
        hui.listen(window,'hashchange',this._onHashChange.bind(this));
      }
    }
    if (visible) {
      document.location='#imageviewer';
    } else {
      hui.location.clearHash();
    }*/
  },
  _onHashChange : function() {
    if (this._changing) return;
    this._changing = true;
    if (hui.location.hasHash('imageviewer') && !this.visible) {
      this.show();
    } else if (!hui.location.hasHash('imageviewer') && this.visible) {
      this.hide();
    }
    this._changing = false;
  },
  /** Hide the image viewer */
  hide: function() {
    this._hide();
  },
  _hide : function() {
    this.pause();
    this.box.hide();
    this._endZoom();
    hui.unListen(document,'keydown',this._keyListener);
    this.visible = false;
    this._setHash(false);
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
    }
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
    this.nodes.play.className='hui_imageviewer_pause';
  },
  /** Pauseslideshow */
  pause : function() {
    window.clearInterval(this.interval);
    this.interval = null;
    this.nodes.play.className='hui_imageviewer_play';
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
    if (this.index < 0) {
      this.index = this.images.length - 1;
      num = this.images.length - 1;
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
      this.index = 0;
      num = this.images.length - 1;
    }
    this._goToImage(true,num,user);
    this._resetPlay();
  },






  // Preloading ...

  _preload : function() {
    var guiLoader = new hui.Preloader();
    guiLoader.addImages(hui.ui.getURL('gfx/imageviewer_controls.png'));
    var self = this;
    guiLoader.setDelegate({
      allImagesDidLoad: function() {
        self._preloadImages();
      }
    });
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
    }
    this.nodes.status.innerHTML = '0%';
    this.nodes.status.style.display = '';
    loader.load(this.index);
  },
  /** @private */
  allImagesDidLoad : function() {
    this.nodes.status.style.display = 'none';
  },
  /** @private */
  imageDidLoad : function(loaded,total,index) {
    this.nodes.status.innerHTML = Math.round(loaded/total*100)+'%';
    var url = hui.ui.resolveImageUrl(this,this.images[index],this.width,this.height);
    url = url.replace(/&amp;/g,'&');
    this.nodes.innerViewer.childNodes[index].style.backgroundImage="url('"+url+"')";
    hui.cls.set(this.nodes.innerViewer.childNodes[index],'hui_imageviewer_image_abort',false);
    hui.cls.set(this.nodes.innerViewer.childNodes[index],'hui_imageviewer_image_error',false);
  },
  /** @private */
  imageDidGiveError : function(loaded,total,index) {
    hui.cls.set(this.nodes.innerViewer.childNodes[index],'hui_imageviewer_image_error',true);
  },
  /** @private */
  imageDidAbort : function(loaded,total,index) {
    hui.cls.set(this.nodes.innerViewer.childNodes[index],'hui_imageviewer_image_abort',true);
  },




  // Zooming ...

  zoomed : false,

  _zoom : function(e) {
    var img = this.images[this.index];
    if (img.width <= this.width && img.height <= this.height) {
      return; // Don't zoom if small
    }
    if (!this.zoomer) {
      this.zoomer = hui.build('div',{
        'class' : 'hui_imageviewer_zoomer',
        'style' : 'width:'+this.nodes.viewer.clientWidth+'px;height:'+this.nodes.viewer.clientHeight+'px'
      });
      this.element.insertBefore(this.zoomer,hui.dom.firstChild(this.element));
      hui.listen(this.zoomer,'mousemove',this._onZoomMove.bind(this));
      hui.listen(this.zoomer,'click',this._endZoom.bind(this));
    }
    this._hideController();
    this.pause();
    var size = this._getLargestSize({width:2000,height:2000},img);
    var url = hui.ui.resolveImageUrl(this,img,size.width,size.height);
    var top = Math.max(0, Math.round((this.nodes.viewer.clientHeight - size.height) / 2));
    this.zoomer.innerHTML = '<div style="width:'+size.width+'px;height:'+size.height+'px; margin: 0 auto;"><img src="'+url+'" style="margin-top: '+ top + 'px" /></div>';
    this.zoomer.style.display = 'block';
    this.zoomInfo = {width:size.width,height:size.height};
    this._onZoomMove(e);
    this.zoomed = true;
  },
  _onZoomMove : function(e) {
    if (!this.zoomInfo) {
      return;
    }
    var offset = hui.position.get(this.zoomer);
    e = new hui.Event(e);
    var x = (e.getLeft() - offset.left) / this.zoomer.clientWidth * (this.zoomInfo.width - this.zoomer.clientWidth);
    var y = (e.getTop() - offset.top) / this.zoomer.clientHeight * (this.zoomInfo.height - this.zoomer.clientHeight);

    this.zoomer.scrollLeft = x;
    this.zoomer.scrollTop = y;
  },
  _endZoom : function() {
    if (this.zoomer) {
      this.zoomer.style.display='none';
      this.zoomed = false;
    }
  }

};

hui.define('hui.ui.ImageViewer',hui.ui.ImageViewer);

/** @constructor */
hui.ui.Picker = function(options) {
  options = this.options = hui.override({itemWidth:100,itemHeight:150,itemsVisible:null,shadow:true,valueProperty:'value'},options);
  this.element = hui.get(options.element);
  this.name = options.name;
  this.container = hui.get.firstByClass(this.element,'hui_picker_container');
  this.content = hui.get.firstByClass(this.element,'hui_picker_content');
  this.title = hui.get.firstByClass(this.element,'hui_picker_title');
  this.pages = [];
  this.objects = [];
  this.selected = null;
  this.value = null;
  this._addBehavior();
  hui.ui.extend(this);
};

hui.ui.Picker.create = function(options) {
  options = hui.override({shadow:true},options);
  options.element = hui.build('div',{
    'class' : 'hui_picker',
    html : hui.when(options.title,'<div class="hui_picker_title">'+options.title+'</div>')+
    '<div class="hui_picker_container"><div class="hui_picker_content"></div></div>'+
    '<div class="hui_picker_pages"></div>'
  });
  if (options.shadow) {
    hui.cls.add(options.element,'hui_picker_shadow');
  }
  return new hui.ui.Picker(options);
};

hui.ui.Picker.prototype = {
  _addBehavior : function() {
    hui.drag.register({
      element : this.element,
      onBeforeMove : this._onBeforeMove.bind(this),
      onMove : this._onMove.bind(this),
      onAfterMove : this._onAfterMove.bind(this)
    });
    hui.listen(this.element,'click',this._onClick.bind(this));
  },
  _onClick : function(e) {
    if (this.dragging) {
      return;
    }
    e = hui.event(e);
    var page = e.findByClass('hui_picker_page');
    if (page) {
      this.goToPage(parseInt(page.getAttribute('data-index')));
    }
  },
  goToPage : function(index) {
    var pos = Math.round(this.container.clientWidth*index);
    pos = Math.min(pos,this.content.clientWidth-this.container.clientWidth);
    this._scrollTo(pos,hui.ease.fastSlow);
  },
  setObjects : function(objects) {
    this.selected = null;
    this.objects = objects || [];
    this._updateUI();
  },
  setValue : function(value) {
    this.value = value;
    this._updateSelection();
  },
  getValue : function() {
    return this.value;
  },
  reset : function() {
    this.value = null;
    this._updateSelection();
  },
  _updateUI : function() {
    var self = this,
      width;
    this.content.innerHTML = '';
    this.container.scrollLeft = 0;
    if (this.options.itemsVisible) {
      width = this.options.itemsVisible*(this.options.itemWidth+14);
    } else {
      width = this.container.clientWidth;
    }
    hui.style.set(this.container,{
      width : width+'px',
      height : (this.options.itemHeight+14)+'px'
    });
    hui.style.set(this.content,{
      width : (this.objects.length*(this.options.itemWidth+14))+'px',
      height : (this.options.itemHeight+14)+'px'
    });
    hui.each(this.objects,function(object,i) {
      var item = hui.build('div',{
        'class' : 'hui_picker_item',
        title : object.title,
        html : '<div style="width:'+self.options.itemWidth+'px;height:'+self.options.itemHeight+'px; overflow: hidden; background-image:url(\''+object.image+'\')"><strong>'+hui.string.escape(object.title)+'</strong></div>',
        parent : self.content
      });
      if (self.value !== null && object[self.options.valueProperty]==self.value) {
         hui.cls.add(item,'hui_picker_item_selected');
      }
      hui.listen(item,'mouseup',function() {
        self._onItemClick(object[self.options.valueProperty]);
      });
    });
    this._updatePages();
  },
  _updatePages : function() {
    var cw = this.container.clientWidth;
    if (!cw) {
      return;
    }
    var pageCount = Math.ceil(this.content.clientWidth / cw);
    var pages = hui.get.firstByClass(this.element,'hui_picker_pages');
    hui.dom.clear(pages);
    if (pageCount<2) {return;}
    for (var i=1; i <= pageCount; i++) {
      hui.build('a',{
        parent : pages,
        text : i,
        className : 'hui_picker_page'+hui.when(i==1,' hui_picker_page_selected'),
        'data-index' : i-1
      });
    }
  },
  _updateSelection : function() {
    var children = this.content.childNodes;
    for (var i=0; i < children.length; i++) {
      hui.cls.set(children[i],'hui_picker_item_selected',this.value!==null && this.objects[i][this.options.valueProperty]==this.value);
    }
  },
  _onItemClick : function(value) {
    if (this.dragging) return;
    if (this.value==value) return;
    this.value = value;
    this._updateSelection();
    this.fire('select',value);
  },

  _onBeforeMove : function(e) {
    this.dragX = e.getLeft();
    this.dragScroll = this.container.scrollLeft;
    this.dragging = true;
  },
  _onMove : function(e) {
    this.container.scrollLeft = this.dragX-e.getLeft()+this.dragScroll;
  },
  _onAfterMove : function(e) {
    var size = this.options.itemWidth+14;
    var pos = Math.round(this.container.scrollLeft/size)*size;
    this._scrollTo(pos);
    this.dragging = false;
  },
  _scrollTo : function(pos,ease) {
    ease = ease || hui.ease.bounceOut;
    hui.animate(this.container,'scrollLeft',pos,500,{ease : ease,onComplete : this._updatePager.bind(this)});
  },
  _updatePager : function() {
    var page = Math.ceil(this.container.scrollLeft / this.container.clientWidth);
    var pages = hui.get.byClass(this.element,'hui_picker_page');
    for (var i=0; i < pages.length; i++) {
      hui.cls.set(pages[i],'hui_picker_page_selected',page==i);
    }
  },

  $visibilityChanged : function() {
    if (!hui.dom.isVisible(this.element)) {return;}
    this.container.style.display='none';
    var width;
    if (this.options.itemsVisible) {
      width = this.options.itemsVisible*(this.options.itemWidth+14);
    } else {
      width = this.container.parentNode.clientWidth;
    }
    width = Math.max(width,0);
    hui.style.set(this.container,{width:width+'px',display:'block'});
    this._updatePages();
  }
};

/**
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
};

hui.ui.Menu.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_menu'});
  var obj = new hui.ui.Menu(options);
  document.body.appendChild(options.element);
  return obj;
};

hui.ui.Menu.prototype = {
  _addBehavior : function() {
    this.hider = function() {
      this.hide();
      this.fire('cancel');
    }.bind(this);
    if (this.options.autoHide) {
      var x = function(e) {
        if (!hui.ui.isWithin(e,this.element) && (!this.options.parentElement || !hui.ui.isWithin(e,this.options.parentElement))) {
          if (!this._isSubMenuVisible()) {
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
    var element = hui.build('div',{'class':'hui_menu_item',text:item.title || item.text});
    hui.listen(element,'click',function(e) {
      hui.stop(e);
      self._onItemClick(item.value);
    });
    if (item.children && item.children.length>0) {
      var sub = hui.ui.Menu.create({autoHide:true,parentElement:element});
      sub.addItems(item.children);
      hui.listen(element,'mouseover',function(e) {
        sub.showAtElement(element,e,'horizontal');
      });
      self.subMenus.push(sub);
      hui.cls.add(element,'hui_menu_item_children');
      sub.listen({
        $select : function(value) {
          self.hide();
          self.fire('select',value);
        }
      });
    }
    this.element.appendChild(element);
  },
  addItems : function(items) {
    for (var i=0; i < items.length; i++) {
      if (items[i] === null) {
        this.addDivider();
      } else {
        this.addItem(items[i]);
      }
    }
  },
  getValue : function() {
    return this.value;
  },
  _onItemClick : function(value) {
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
      this._addHider();
      this.visible = true;
    }
  },
  hide : function(options) {
    if (!this.visible) {return;}
    if (true || options && options.immediate) {
      this.element.style.display='none';
    } else {
      hui.animate(this.element, 'opacity', 0, 200, {
        onComplete : function() {
          this.element.style.display='none';
        }.bind(this)
      });
    }
    this._removeHider();
    for (var i=0; i < this.subMenus.length; i++) {
      this.subMenus[i].hide();
    }
    this.visible = false;
    this.fire('hide');
  },
  isVisible : function() {
    return this.visible;
  },
  _isSubMenuVisible : function() {
    for (var i=0; i < this.subMenus.length; i++) {
      if (this.subMenus[i].visible) return true;
    }
    return false;
  },
  _addHider : function() {
    hui.listen(document.body,'click',this.hider);
  },
  _removeHider : function() {
    hui.unListen(document.body,'click',this.hider);
  }
};

/**
 * @constructor
 */
hui.ui.Overlay = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.name = options.name;
  this.icons = {};
  this.visible = false;
  hui.ui.extend(this);
  this._addBehavior();
};

/**
 * Creates a new overlay
 */
hui.ui.Overlay.create = function(options) {
  options = options || {};
  var cls = 'hui_overlay'+(options.variant ? ' hui_overlay_'+options.variant : '');
  if (!options.variant) {
    cls += ' hui_context_dark';
  }
  var e = options.element = hui.build('div',{className:cls,style:'display:none'});
  document.body.appendChild(e);
  return new hui.ui.Overlay(options);
};

hui.ui.Overlay.prototype = {
  _addBehavior : function() {
    var self = this;
/*    this.hider = function(e) {
      if (self.boundElement) {
        if (hui.ui.isWithin(e,self.boundElement) || hui.ui.isWithin(e,self.element)) return;
        // TODO: should be unreg'ed but it fails
        //self.boundElement.stopObserving(self.hider);
        hui.cls.remove(self.boundElement,'hui_overlay_bound');
        self.boundElement = null;
        self.hide();
      }
    }
    hui.listen(this.element,'mouseout',this.hider);*/
  },
  addIcon : function(key,icon) {
    var self = this;
    var element = hui.build('div',{className:'hui_overlay_icon'});
    hui.ui.setIconImage(element, icon, 32);
    hui.listen(element,'click',function(e) {
      self._iconWasClicked(key,e);
    });
    this.icons[key]=element;
    this.element.appendChild(element);
  },
  addText : function(text) {
    this.element.appendChild(hui.build('span',{'class':'hui_overlay_text',text:text}));
  },
  add : function(widget) {
    this.element.appendChild(widget.getElement());
  },
  hideIcons : function(keys) {
    for (var i=0; i < keys.length; i++) {
      this.icons[keys[i]].style.display='none';
    }
  },
  showIcons : function(keys) {
    for (var i=0; i < keys.length; i++) {
      this.icons[keys[i]].style.display='';
    }
  },
  _iconWasClicked : function(key,e) {
    hui.ui.callDelegates(this,'iconWasClicked',key,e);
  },
  showAtElement : function(element,options) {
    options = options || {};
    hui.ui.positionAtElement(this.element,element,options);
    if (options.autoHide) {
      // important to do even if visible, sine element may have changed
      this._autoHide(element);
    }
    if (this.visible) {
      return;
    }
    if (hui.browser.msie) {
      this.element.style.display = 'block';
    } else {
      hui.style.set(this.element,{display : 'block',opacity : 0});
      hui.animate(this.element,'opacity',1,150);
    }
    var zIndex = options.zIndex === undefined ? options.zIndex : hui.ui.nextAlertIndex();
    if (this.options.modal) {
      this.element.style.zIndex = hui.ui.nextAlertIndex();
      hui.ui.showCurtain({ widget : this, zIndex : zIndex });
    } else {
      this.element.style.zIndex = zIndex;
    }
    this.visible = true;
  },
  _autoHide : function(element) {
    hui.cls.add(element,'hui_overlay_bound');
    hui.unListen(document.body,'mousemove',this._hider);
    this._hider = function(e) {
      if (!hui.ui.isWithin(e,element) && !hui.ui.isWithin(e,this.element)) {
        try {
          hui.unListen(document.body,'mousemove',this._hider);
          hui.cls.remove(element,'hui_overlay_bound');
          this.hide();
        } catch (ignore) {
          hui.log('unable to stop listening: document='+document);
        }
      }
    }.bind(this);
    hui.listen(document.body,'mousemove',this._hider);
  },
  show : function(options) {
    options = options || {};
    if (!this.visible) {
      hui.style.set(this.element,{'display':'block',visibility:'hidden'});
    }
    if (options.element) {
      hui.position.place({
        source : {element:this.element,vertical:0,horizontal:0.5},
        target : {element:options.element,vertical:0.5,horizontal:0.5},
        insideViewPort : true,
        viewPortMargin : 9
      });
    }
    if (options.autoHide && options.element) {
      this._autoHide(options.element);
    }
    if (this.visible) return;
    hui.effect.bounceIn({element:this.element});
    this.visible = true;
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
    hui.ui.destroyDescendants(this.element);
    this.element.innerHTML='';
  }
};

/**
 * A component for uploading files
 * <pre><strong>options:</strong> {
 * url:'',
 * parameters:{}}
 *
 * Events:
 * uploadDidCompleteQueue - when all files are done
 * uploadDidStartQueue - when the upload starts
 * uploadDidComplete(file) - when a single file is successfull
 * uploadDidFail(file) - when a single file fails
 * </pre>
 * @constructor
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
};

hui.ui.Upload.implementations = ['HTML5','Frame','Flash'];

hui.ui.Upload.nameIndex = 0;

/** Creates a new upload widget */
hui.ui.Upload.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{
    'class':'hui_upload',
    html : '<div class="hui_upload_items"></div>'+
    '<div class="hui_upload_status"></div>'+
    (options.placeholder ? '<div class="hui_upload_placeholder"><span class="hui_upload_icon"></span>'+
      (options.placeholder.title ? '<h2>'+hui.string.escape(hui.ui.getTranslated(options.placeholder.title))+'</h2>' : '')+
      (options.placeholder.text ? '<p>'+hui.string.escape(hui.ui.getTranslated(options.placeholder.text))+'</p>' : '')+
    '</div>' : '')
  });
  return new hui.ui.Upload(options);
};

hui.ui.Upload.prototype = {

  /////////////// Public parts /////////////

  /**
   * Change a parameter
   */
  setParameter : function(name,value) {
    this.options.parameters[name] = value;
    if (this.impl.setParameter) {
      this.impl.setParameter(name,value);
    }
  },

  clear : function() {
    for (var i=0; i < this.items.length; i++) {
      if (this.items[i]) {
        this.items[i].remove();
      }
    }
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
        $dropFiles : function(files) {
          if (options.$drop) {
            options.$drop();
          }
          this._transferFiles(files);
        }.bind(this)
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
        if (!this.options.multiple) {
          this.impl = new impl(this);
          hui.log('Selected impl (single): '+impls[i]);
          break;
        } else if (this.options.multiple && support.multiple) {
          this.impl = new impl(this);
          hui.log('Selected impl (multiple): '+impls[i]);
          break;
        }
      }
    }
    if (!this.impl) {
      hui.log('No implementation found, using frame');
      this.impl = new hui.ui.Upload.Frame(this);
    }
  },
  _addBehavior : function() {
    if (!this.impl.initialize) {
      alert(this.impl);
      return;
    }
    hui.ui.onReady(function() {
      this.impl.initialize();
      hui.drag.listen({
        element : this.element,
        hoverClass : 'hui_upload_drop',
        $dropFiles : this._transferFiles.bind(this)
      });
    }.bind(this));
  },

  //////////////////////////// Dropping ///////////////////////

/*  _onDrop : function(e) {
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
        }
      }
    }
  },
  _transferFile : function(file) {
    hui.log(file);
    var item = this.$_addItem({name:file.name,size:file.size});
    hui.request({
      method : 'post',
      file : file,
      url : this.options.url,
      parameters : this.options.parameters,
      $progress : function(current,total) {
        item.updateProgress(current,total);
      },
      $load : function() {
        hui.log('transferFile: load');
      },
      $abort : function() {
        this.$_itemFail(item);
        item.setError('Afbrudt');
      }.bind(this),
      $success : function(t) {
        hui.log('transferFile: success');
        item.data.request = t;
        this.$_itemSuccess(item);
      }.bind(this),
      $failure : function() {
        hui.log('transferFile: fail');
        this.$_itemFail(item);
      }.bind(this)
    });
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
    var move = first !== null || this.items.length>1;
    move = move && !!item.element.nextSibling;

    if (move && (first === null || first != item.element.nextSibling)) {
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
      buttonContainer.innerHTML='<a href="javascript:void(0);" class="hui_button"><span><span>'+hui.string.escape(hui.ui.getTranslated(this.options.chooseButton))+'</span></span></a>';
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
    }
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
};




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
};

hui.ui.Upload.Item.prototype = {
  getInfo : function() {
    return this.data;
  },
  isFinished : function() {
    return this.finished;
  },
  setError : function(error) {
    this._setStatus(error || hui.ui.getTranslated({en:'Error',da:'Fejl'}));
    hui.cls.add(this.element,'hui_upload_item_error');
    this.progress.hide();
    this.progress.setValue(0);
    this.finished = true;
  },
  setSuccess : function(status) {
    this._setStatus(hui.ui.getTranslated({en:'Complete',da:'Færdig'}));
    this.progress.setValue(1);
    this.finished = true;
    hui.cls.add(this.element,'hui_upload_item_success');
  },
  updateProgress : function(complete,total) {
    this.setProgress(complete/total);
    return this;
  },
  setProgress : function(value) {
    this._setStatus(hui.ui.getTranslated({en:'Transfering',da:'Overfører'}));
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
  remove : function() {
    hui.dom.remove(this.element);
  },
  _setStatus : function(text) {
    if (this._status!==text) {
      hui.dom.setText(this.status,text);
      this._status = text;
    }
  }
};

//// Util ////

hui.ui.Upload._nameIndex = 0;

hui.ui.Upload._buildForm = function(widget) {
  var options = widget.options;

  hui.ui.Upload._nameIndex++;
  var frameName = 'hui_upload_'+hui.ui.Upload._nameIndex;
    hui.log('Frame: name='+frameName);

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
};











/////////////////////// Frame //////////////////////////

/**
 * @class
 * @constructor
 */
hui.ui.Upload.Frame = function(parent) {
  this.parent = parent;
};

hui.ui.Upload.Frame.support = function() {
  return {supported:true,multiple:false};
};

hui.ui.Upload.Frame.prototype = {

  initialize : function() {
    var options = this.parent.options;

    var form = this.form = hui.ui.Upload._buildForm(this.parent);
    var frameName = form.getAttribute('target');

    var iframe = this.iframe = hui.build('iframe', {
      name : frameName,
      id : frameName,
      src : hui.ui.getURL('html/blank.html'),
      style : 'display:none'
    });
    this.parent.element.appendChild(iframe);
    var self = this;
    hui.listen(iframe,'load',function() {
      self._uploadComplete();
    });

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
    }
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
    hui.log('Frame: Upload started:'+this.uploading);
  },

  _uploadComplete : function() {
        hui.log('complete:'+this.uploading+' / '+this.parent.name);
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
    this.iframe.src = hui.ui.getURL('html/blank.html');
    this.form.style.display = 'block';
    this.form.reset();
  },
  _isSuccessResponse : function() {
    var doc = hui.frame.getDocument(this.iframe);
    return doc.body.innerHTML.indexOf('SUCCESS')!==-1;
  }
};

//////////////////// HTML5 //////////////////////


/**
 * @class
 * @constructor
 */
hui.ui.Upload.HTML5 = function(parent) {
  this.parent = parent;
};

hui.ui.Upload.HTML5.support = function() {
  var supported = window.File!==undefined && (hui.browser.webkit || hui.browser.gecko || hui.browser.msie10 || hui.browser.msie11);//(window.File!==undefined && window.FileReader!==undefined && window.FileList!==undefined && window.Blob!==undefined);
  hui.log('HTML5: supported='+supported);
  //supported = !true;
  return {
    supported : supported,
    multiple : true
  };
};

hui.ui.Upload.HTML5.prototype = {
  initialize : function() {
    var options = this.parent.options;
    var span = hui.build('span',{'class':'hui_upload_button_input'});
        this.form = hui.build('form',{'style':'display: inline-block; margin:0;',parent:span});
    var ps = {'type':'file','name':options.fieldName,parent:this.form};
    if (options.multiple) {
      ps.multiple = 'multiple';
    }
    this.fileInput = hui.build('input',ps);
    var c = this.parent.$_getButtonContainer();
    c.insertBefore(span,c.firstChild);
    hui.listen(this.fileInput,'change',this._submit.bind(this));
  },
  _submit : function(e) {
    var files = this.fileInput.files;
    this.parent._transferFiles(files);
        // TODO: reset/replace input field in IE
        this._resetInput();
  },
  _resetInput : function() {
    this.form.reset();
  }
};

/** A progress bar is a widget that shows progress from 0% to 100%
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
};

/** Creates a new progress bar:
  @param o {Object} Options : {small:false}
*/
hui.ui.ProgressBar.create = function(o) {
  o = o || {};
  var e = o.element = hui.build('div',{'class':o.small ? 'hui_progressbar hui_progressbar_small' : 'hui_progressbar'});
  e.appendChild(document.createElement('div'));
  return new hui.ui.ProgressBar(o);
};

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
};

/** @constructor */
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
};

hui.ui.Gallery.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_gallery',html:'<div class="hui_gallery_progress"></div><div class="hui_gallery_body"></div>'});
  return new hui.ui.Gallery(options);
};

hui.ui.Gallery.prototype = {
  _addDrop : function() {
    hui.drag.listen({
      element : this.element,
      hoverClass : 'hui_gallery_drop',
      $dropFiles : function(files) {
        this.fire('filesDropped',files);
      }.bind(this),
      $dropURL : function(url) {
        this.fire('urlDropped',url);
      }.bind(this)
    });
  },
  hide : function() {
    this.element.style.display='none';
  },
  show : function() {
    this.element.style.display='';
    if (this.options.source) {
      this.options.source.refresh();
    }
  },
  setSize : function(size) {
    this.width = size;
    this.height = size;
    for (var i=0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      node.style.width = size+'px';
      node.style.height = size+'px';
    }
    this.maxRevealed = 0;
    clearTimeout(this._timer);
    this._timer = setTimeout(function() {
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].revealed = false;
      }
      this._reveal();
    }.bind(this),500);
  },
  reRender : function() {
    this._render();
  },
  setObjects : function(objects) {
    this.selected = [];
    this.objects = objects;
    this._render();
    this.fire('selectionReset');
  },
  getObjects : function() {
    return this.objects;
  },
  /** @private */
  $sourceShouldRefresh : function() {
    return hui.dom.isVisible(this.element);
  },
  /** @private */
  $objectsLoaded : function(objects) {
    this.setObjects(objects);
  },
  /** @private */
  $optionsLoaded : function(objects) {
    this.setObjects(objects);
  },
  /** @private */
  _render : function() {
    this.nodes = [];
    this.maxRevealed = 0;
    this.body.innerHTML = '';
    hui.each(this.objects,function(object,i) {
      var top = 0;
      if (!this.revealing && object.height < object.width) {
        top = (this.height-(this.height*object.height/object.width))/2;
      }
      var img = hui.build('img',{style:'margin:'+top+'px auto 0px'});
      var item = hui.build('div',{'class' : 'hui_gallery_item',style:'width:'+this.width+'px; height:'+this.height+'px'});
      if (!this.revealing) {
        item.style.backgroundImage = 'url(' + this._resolveImageUrl(object) + ')';
      }
      //item.appendChild(img);
      hui.listen(item,'click',function(e) {
        this._itemClicked(i,e);
      }.bind(this));
      item.dragDropInfo = {kind:'image',icon:'common/image',id:object.id,title:object.name || object.title};
      item.onmousedown = function(e) {
        hui.ui.startDrag(e,item);
        return false;
      };
      hui.listen(item,'dblclick',function() {
        this._onItemDoubleClick(i);
      }.bind(this));
      this.body.appendChild(item);
      this.nodes.push(item);
    }.bind(this));
    this._reveal();
    this.fireSizeChange();
  },
  _reveal : function() {
    if (!this.revealing) {
      return;
    }
    var container = this.element.parentNode;
    var limit = container.scrollTop + container.clientHeight;
    if (limit <= this.maxRevealed) {
      return;
    }
    this.maxRevealed = limit;
    var self = this;
    for (var i=0,l=this.nodes.length; i < l; i++) {
      var item = this.nodes[i];
      if (item.revealed) {
        continue;
      }
      if (item.offsetTop < limit) {
        this._load(item, this.objects[i]);
      } else {
        hui.cls.add(item,'hui_is_pending');
      }
    }
  },
  _load : function(item, object) {
    hui.cls.add(item,'hui_is_loading');
    var url = this._resolveImageUrl(object);
    var img = new Image();
    img.onload = function() {
      item.className = 'hui_gallery_item';
      hui.cls.remove(item,'hui_is_pending');
      hui.cls.remove(item,'hui_is_loading');
      item.style.backgroundImage = 'url(' + url + ')';
    };
    img.onerror = function() {
      hui.cls.remove(item,'hui_is_loading');
      hui.cls.add(item,'hui_is_error');
    };
    img.src = url;
    item.revealed = true;
  },
  _updateUI : function() {
    var s = this.selected;
    for (var i=0; i < this.nodes.length; i++) {
      hui.cls.set(this.nodes[i],'hui_gallery_item_selected',hui.array.contains(s,i));
    }
  },
  _resolveImageUrl : function(img) {
    var url = hui.ui.callDelegates(this,'buildImageUrl',{item: img, width: this.width, height: this.height});
    return url || hui.ui.resolveImageUrl(this,img,this.width,this.height);
  },
  _itemClicked : function(index,e) {
    if (this.busy) {
      return;
    }
    e = hui.event(e);
    if (e.metaKey) {
      hui.array.flip(this.selected,index);
    } else {
      this.selected = [index];
    }
    this.fire('select',this.selected);
    this._updateUI();
  },
  isOneSelection : function() {
    return this.selected.length==1;
  },
  getSelectionSize : function() {
    return this.selected.length;
  },
  getSelection : function() {
    var selection = [];
    for (var i=0; i < this.selected.length; i++) {
      var obj = this.objects[this.selected[i]];
      if (obj) {
        selection.push(obj);
      }
    }
    return selection;
  },
  getSelectionIds : function() {
    var selection = [];
    for (var i=0; i < this.selected.length; i++) {
      var obj = this.objects[this.selected[i]];
      if (obj) {
        selection.push(obj.id);
      }
    }
    return selection;
  },
  getFirstSelection : function() {
    if (this.selected.length>0) {
      return this.objects[this.selected[0]];
    }
    return null;
  },
  _onItemDoubleClick : function(index) {
    if (this.busy) {
      return;
    }
    this.fire('itemOpened',this.objects[index]);
    this.fire('open',this.objects[index]);
  },
  /**
   * Sets the lists data source and refreshes it if it is new
   * @param {hui.ui.Source} source The source
   */
  setSource : function(source) {
    if (this.options.source!=source) {
      if (this.options.source) {
        this.options.source.unListen(this);
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
      if (this.options.source) {
        this.options.source.refreshFirst();
      }
      this._reveal();
    }
  },
  /** @private */
  $$layout : function() {
    if (this.nodes.length > 0) {
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
};

/**
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
};

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
    }
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
    }
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
      },Math.random()*200);
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
    }
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
    today.click(function() {
      this.setDate(new Date());
    }.bind(this));
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
    }
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
};

/**
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
};

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
};

hui.ui.DatePicker.prototype = {
  _addBehavior : function() {
    var self = this;
    this.cells = hui.findAll('td',this.element);
    hui.each(this.cells,function(cell,index) {
      hui.listen(cell,'mousedown',function(e) {
        hui.stop(e);
        self._selectCell(index);
      });
    });
    var next = hui.get.firstByClass(this.element,'hui_datepicker_next');
    var previous = hui.get.firstByClass(this.element,'hui_datepicker_previous');
    hui.listen(next,'mousedown',function(e) {hui.stop(e);self.next();});
    hui.listen(previous,'mousedown',function(e) {hui.stop(e);self.previous();});
  },
  /** Set the date
    * @param date The js Date to set
    */
  setValue : function(date) {
    if (!date) {
      date = new Date();
    }
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
    }
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
};

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
   ["S",
    "M",
    "T",
    "O",
    "T",
    "F",
    "L"];

/**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.Layout = function(options) {
  this.name = options.name;
  this.options = options || {};
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Layout.create = function(options) {
  options = hui.override({text:'',highlighted:false,enabled:true},options);

  options.element = hui.dom.parse('<table class="hui_layout"><tbody class="hui_layout"><tr class="hui_layout_middle"><td class="hui_layout_middle">'+
      '<table class="hui_layout_middle"><tr>'+
      '<td class="hui_layout_left hui_context_sidebar"><div class="hui_layout_left"></div></td>'+
      '<td class="hui_layout_center"></td>'+
      '</tr></table>'+
      '</td></tr></tbody></table>');
  return new hui.ui.Layout(options);
};

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
  $$layout : function() {
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
        var inner = hui.get.firstByTag(foot,'*');
        if (inner) {
          bottom = inner.clientHeight;
        }
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

(function (_super) {

  /**
   * A dock
   * @param {Object} The options
   * @constructor
   */
  hui.ui.Dock = function(options) {
    this.options = options;
    this.element = hui.get(options.element);
    this.name = options.name;
    _super.call(this, options);
    this._attach();
  };

  hui.ui.Dock.prototype = {
    nodes : {
      iframe: '.hui_dock_frame',
      resizer: '.hui_dock_sidebar_line',
      sidebar: '.hui_dock_sidebar',
      main: '.hui_dock_main'
    },
    _attach : function() {
      if (hui.browser.msie) {
        hui.cls.add(this.element,'hui-is-legacy');
      }
      hui.ui.listen({
        $frameLoaded : function(win) {
          if (win == hui.frame.getWindow(this.nodes.iframe)) {
            this._setBusy(false);
          }
        }.bind(this)
      });
      hui.listen(this.nodes.iframe,'load',this._load.bind(this));
      if (this.nodes.resizer) {
        hui.drag.register({
          element : this.nodes.resizer,
          onStart : function() {
            this.hasDragged = false;
            hui.cls.add(this.element,'hui-is-resizing');
          }.bind(this),
          onMove : function(e) {
            var left = e.getLeft();
            if (left<10) {
              left=10;
            }
            this._updateSidebarWidth(left);
            if (!this.hasDragged) {
              hui.cls.remove(this.element,'hui-is-collapsed');
            }
            this.hasDragged = true;
          }.bind(this),
          onEnd : function() {
            if (!this.hasDragged) {
              this.toggle();
            } else if (this.latestWidth==10) {
              this.collapse();
            } else {
              this.latestExpandedWidth = this.latestWidth;
            }
            hui.cls.remove(this.element,'hui-is-resizing');
            hui.ui.callVisible(this);
            hui.ui.reLayout();
          }.bind(this)
        });
      }
    },
    _updateSidebarWidth : function(width) {
      this.latestWidth = width;
      this.nodes.sidebar.style.width = (width-1)+'px';
      this.nodes.main.style.left = width+'px';
      this.nodes.resizer.style.left = (width-5)+'px';
    },
    /** Change the url of the iframe
     * @param {String} url The url to change the iframe to
     */
    setUrl : function(url) {
      this._setBusy(true);
      hui.frame.getDocument(this.nodes.iframe).location.href=url;
    },
    collapse : function() {
      hui.cls.add(this.element,'hui-is-collapsed');
      this._updateSidebarWidth(10);
      hui.ui.callVisible(this);
    },
    expand : function() {
      hui.cls.remove(this.element,'hui-is-collapsed');
      this._updateSidebarWidth(this.latestExpandedWidth || 200);
      hui.ui.callVisible(this);
    },
    toggle : function() {
      if (hui.cls.has(this.element,'hui-is-collapsed')) {
        this.expand();
      } else {
        this.collapse();
      }
    },
    _load : function() {
      this._setBusy(false);
    },
    _setBusy : function(busy) {
      hui.cls.set(this.element, 'hui-is-busy', busy);
    }
  };
  hui.extend(hui.ui.Dock, _super);

  hui.define('hui.ui.Dock', hui.ui.Dock);

})(hui.ui.Component);

/**
 * @constructor
 * @param {Object} options The options : {modal:false}
 */
hui.ui.Box = function(options) {
  this.options = hui.override({},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.visible = !this.options.absolute;
  hui.ui.extend(this);
  if (this.nodes.close) {
    hui.listen(this.nodes.close,'click',this._close.bind(this));
  }
};

/**
 * Creates a new box widget
 * @param {Object} options The options : {width:0,padding:0,absolute:false,closable:false}
 */
hui.ui.Box.create = function(options) {
  options = options || {};
  var variant = options.variant || 'standard';
  var html = (options.closable ? '<a class="hui_box_close hui_box_close_' + variant + '" href="#"></a>' : '');
  if (options.title) {
    html+='<div class="hui_box_header"><strong class="hui_box_title">'+hui.string.escape(hui.ui.getTranslated(options.title))+'</strong></div>';
  }
  html += '<div class="hui_box_body" style="'+
      (options.padding ? 'padding: '+options.padding+'px;' : '')+
      (options.width ? 'width: '+options.width+'px;' : '')+
  '"></div>';

  options.element = hui.build('div',{
    'class' : 'hui_box hui_box_' + variant,
    html : html,
    style : options.width ? options.width+'px' : null
  });
  if (options.absolute) {
    hui.cls.add(options.element,'hui_box_absolute');
  }
  return new hui.ui.Box(options);
};

hui.ui.Box.prototype = {
  nodes : {
      body : '.hui_box_body',
      close : '.hui_box_close'
  },
  _close : function(e) {
    hui.stop(e);
    this.hide();
    this.fire('boxWasClosed'); // Deprecated
    this.fire('close');
  },
  shake : function() {
    hui.effect.shake({element:this.element});
  },

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
    var body = this.nodes.body;
    if (widget.getElement) {
      body.appendChild(widget.getElement());
    } else {
      body.appendChild(widget);
    }
  },
  /**
   * Shows the box
   */
  show : function() {
    var e = this.element;
    if (this.options.modal) {
      var index = hui.ui.nextPanelIndex();
      e.style.zIndex = index+1;
      hui.ui.showCurtain({widget:this,zIndex:index});
    }
    if (this.options.absolute) {
      hui.style.set(e,{ display : 'block', visibility : 'hidden' });
      var w = e.clientWidth;
      var top = (hui.window.getViewHeight() - e.clientHeight) / 2 + hui.window.getScrollTop();
      hui.style.set(e,{
        marginLeft : (w/-2)+'px',
        top : top+'px',
        display : 'block',
        visibility : 'visible'
      });
    } else {
      e.style.display = 'block';
    }
    this.visible = true;
    hui.ui.callVisible(this);
  },
  /** If the box is visible */
  isVisible : function() {
    return this.visible;
  },
  /** @private */
  $$layout : function() {
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
  $curtainWasClicked : function() {
    this.fire('boxCurtainWasClicked');
    if (this.options.curtainCloses) {
      this._close();
    }
  }
};

/**
 * A wizard with a number of steps
 * @constructor
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
};

hui.ui.Wizard.prototype = {
  _addBehavior : function() {
    var self = this;
    hui.each(this.anchors,function(node,i) {
      hui.listen(node,'mousedown',function(e) {
        hui.stop(e);
        self.goToStep(i);
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
    return this.selected === 0;
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
};

/** @constructor */
hui.ui.Input = function(options) {
  this.options = hui.override({placeholderElement:null,validator:null},options);
  var e = this.element = hui.get(options.element);
  this.element.setAttribute('autocomplete','off');
  this.value = this._validate(this.element.value);
  this.isPassword = this.element.type=='password';
  this.name = options.name;
  hui.ui.extend(this);
  this._addBehavior();
  if (this.options.placeholderElement && this.value !== '') {
    hui.style.set(this.options.placeholderElement,{opacity:0,display:'none'});
  }
  this._checkPlaceholder();
  try { // IE hack
    if (e==document.activeElement) {
      this._onFocus();
    }
  } catch (ignore) {}
};

hui.ui.Input.prototype = {
  _addBehavior : function() {
    var e = this.element,
      p = this.options.placeholderElement;
    hui.listen(e,'keyup',this._onKeyUp.bind(this));
    hui.listen(e,'blur',this._onBlur.bind(this));
    if (p) {
      hui.listen(e,'focus',this._onFocus.bind(this));
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
  _onFocus : function() {
    var e = this.element,p = this.options.placeholderElement;
    if (p && e.value === '') {
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
    if (this.options.placeholderElement && this.value === '') {
      hui.effect.fadeIn({element:this.options.placeholderElement,duration:200});
    }
    if (this.isPassword && !hui.browser.msie) {
      this.element.type='password';
    }
  },
  /** @private */
  _onKeyUp : function() {
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
  _onBlur : function() {
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
    return this.value === '';
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

/** @constructor */
hui.ui.InfoView = function(options) {
  this.options = hui.override({clickObjects:false},options);
  this.element = hui.get(options.element);
  this.body = hui.get.firstByTag(this.element,'tbody');
  this.name = options.name;
  hui.ui.extend(this);
};

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
};

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
    if (!objects || objects.length === 0) return;
    var row = hui.build('tr',{parent:this.body});
    row.appendChild(hui.build('th',{text:label}));
    var cell = hui.build('td',{parent:row});
    var click = this.options.clickObjects;
    hui.each(objects,function(obj) {
      var node = hui.build('div',{text:obj.title,parent:cell});
      if (click) {
        hui.cls.add(node,'hui_infoview_click');
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
    }
  }
};

/**
 * Overflow with scroll bars
 * @param options {Object} The options
 * @param options.dynamic {boolean} If the overflow show adjust its height
 * @constructor
 */
hui.ui.Overflow = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.body = hui.find('.hui_overflow_body', this.element);
  this.name = options.name;
  hui.ui.extend(this);
  this._attach();
};

hui.ui.Overflow.create = function(options) {
  options = options || {};
  var attributes = {
    html : '<div class="hui_overflow_body"></div>'
  };
  if (options.height) {
    attributes.style = {height: options.height + 'px'};
  }
  options.element = hui.build('div.hui_overflow', attributes);
  return new hui.ui.Overflow(options);
};

hui.ui.Overflow.prototype = {
  _attach : function() {
    hui.listen(this.body, 'scroll', function() {
      hui.onDraw(this._checkShadows.bind(this));
    }.bind(this));
  },
  _checkShadows : function() {
    if (hui.browser.msie) {return;}
    hui.cls.set(this.element, 'hui-is-top', this.body.scrollTop > 0);
    hui.cls.set(this.element, 'hui-is-bottom', this.body.scrollHeight - this.body.scrollTop - this.body.clientHeight > 0);
    clearTimeout(this._timer);
    this._timer = setTimeout(this._fireScrolled.bind(this), 200);
  },
  _fireScrolled : function() {
    this.fire('scrolled');
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
    this.body.appendChild(widgetOrNode.getElement ? widgetOrNode.getElement() : widgetOrNode);
    return this;
  },
  $$childSizeChanged : function() {
    this._checkShadows();
  },
  $$layout : function() {
    if (!this.options.dynamic) {
      this._checkShadows();
      return;
    }
    this.element.style.height = hui.position.getRemainingHeight(this.element) + 'px';
    this._checkShadows();
  },
  /** @private */
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      this.$$layout();
    }
  }
};

hui.on(['hui.ui'],function() {

  /** @constructor */
  hui.ui.SearchField = function(options) {
    this.options = hui.override({expandedWidth:null},options);
    this.element = hui.get(options.element);
    this.name = options.name;
    this.field = hui.get.firstByTag(this.element,'input');
    this.value = this.field.value;
    this.adaptive = hui.cls.has(this.element,'hui_searchfield-adaptive');
    this.initialWidth = null;
    hui.ui.extend(this);
    this._addBehavior();

    if (this.value!=='') {
      this._updateClass();
    }
  };

  hui.ui.SearchField.create = function(options) {
    options = options || {};
    options.element = hui.build('span',{
      'class' : options.adaptive ? 'hui_searchfield hui_searchfield-adaptive' : 'hui_searchfield',
      html : '<span class="hui_searchfield_placeholder"></span><a href="javascript:void(0);" class="hui_searchfield_reset"></a><input class="hui_searchfield_input" type="text"/>'
    });
    return new hui.ui.SearchField(options);
  };

  hui.ui.SearchField.prototype = {
    _addBehavior : function() {
      var self = this;
      hui.listen(this.field,'keyup',this._onKeyUp.bind(this));
      var reset = hui.get.firstByTag(this.element,'a');
      reset.tabIndex=-1;
      var focus;
      if (!hui.browser.ipad) {
        focus = function() {
          self.field.focus();
          self.field.select();
        };
        hui.listen(this.element,'mousedown',focus);
        hui.listen(this.element,'mouseup',focus);
        hui.listen(hui.get.firstByTag(this.element,'em'),'mousedown',focus);
      } else {
        focus = function() {self.field.focus();};
        hui.listen(hui.get.firstByTag(this.element,'em'),'click',focus);
      }
      hui.listen(reset,'mousedown',function(e) {
        hui.stop(e);
        self.reset();
        focus();
      });
      hui.listen(this.field,'focus',this._onFocus.bind(this));
      hui.listen(this.field,'blur',this._onBlur.bind(this));
    },
    _onFocus : function() {
      this.focused = true;
      this._updateClass();
      if (this.options.expandedWidth > 0) {
        if (this.initialWidth === null) {
          this.initialWidth = parseInt(hui.style.get(this.element,'width'));
        }
        hui.animate(this.element,'width',this.options.expandedWidth+'px',500,{ease:hui.ease.slowFastSlow});
      }
    },
    _onBlur : function() {
      this.focused = false;
      this._updateClass();
      if (this.initialWidth!==null) {
        hui.animate(this.element,'width',this.initialWidth+'px',500,{ease:hui.ease.slowFastSlow,delay:100});
      }
    },
    _onKeyUp : function(e) {
      this._fieldChanged();
      if (e.keyCode === 13) {
        this.fire('submit');
      }
    },
    focus : function() {
      this.field.focus();
    },
    setValue : function(value) {
      this.field.value = value===undefined || value===null ? '' : value;
      this._fieldChanged();
    },
    getValue : function() {
      return this.field.value;
    },
    isEmpty : function() {
      return this.field.value === '';
    },
    isBlank : function() {
      return hui.isBlank(this.field.value);
    },
    reset : function() {
      this.field.value='';
      this._fieldChanged();
    },
    /** @private */
    _updateClass : function() {
      var className = 'hui_searchfield';
      if (this.adaptive) {
        className+=' hui_searchfield-adaptive';
      }
      if (this.focused) {
        className+=' hui_searchfield-focus';
      }
      if (this.value !== '') {
        className += ' hui_searchfield-dirty';
      }
      this.element.className=className;
    },
    _fieldChanged : function() {
      if (this.field.value!=this.value) {
        this.value = this.field.value;
        this._updateClass();
        this.fireValueChange();
      }
    }
  };

  hui.define('hui.ui.SearchField',hui.ui.SearchField);
});

/**
 * Simple container
 * @param {Object} The options
 * @constructor
 */
hui.ui.Fragment = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
};

hui.ui.Fragment.prototype = {
  show : function() {
    this.setVisible(true);
  },
  hide : function() {
    this.setVisible(false);
  },
  setVisible : function(visible) {
    this.element.style.display = visible ? 'block' : 'none';
    hui.ui.callVisible(this);
  },
  setHTML : function(html) {
    this.clear();
    this.element.innerHTML = html;
    hui.dom.runScripts(this.element);
    this.fireSizeChange();
  },
  setContent : function(widgetOrNode) {
    this.clear();
    this.add(widgetOrNode);
  },
  clear : function() {
    hui.ui.destroyDescendants(this.element);
    this.element.innerHTML = '';
  },
  add : function(widgetOrNode) {
    this.element.appendChild(widgetOrNode.element ? widgetOrNode.element : widgetOrNode);
    this.fireSizeChange();
  }
};

/**
  Used to get a geografical location
  @constructor
*/
hui.ui.LocationPicker = function(options) {
  options = options || {};
  this.name = options.name;
  this.options = options.options || {};
  this.element = hui.get(options.element);
  this.backendLoaded = window.google!==undefined && window.google.maps!==undefined;
  this.defered = [];
  hui.ui.extend(this);
};

hui.ui.LocationPicker.prototype = {
  show : function(options) {
    if (!this.panel) {
      var panel = this.panel = hui.ui.BoundPanel.create({width:302,modal:true});
      var mapContainer = hui.build('div',{style:'width:300px;height:300px;border:1px solid #bbb;'});
      panel.add(mapContainer);
      var buttons = hui.ui.Buttons.create({align:'right',top:5});
      var button = hui.ui.Button.create({text:{en:'Close',da:'Luk'},small:true});
      button.listen({$click:function() {panel.hide();}});
      panel.add(buttons.add(button));
      hui.style.set(panel.element,{left:'-10000px',top:'-10000px',display:''});
      this._whenReady(function() {
        var mapOptions = {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.defaultCenter = new google.maps.LatLng(57.0465, 9.9185);
        this.map = new google.maps.Map(mapContainer, mapOptions);
        google.maps.event.addListener(this.map, 'click', function(obj) {
          var loc = {latitude:obj.latLng.lat(),longitude:obj.latLng.lng()};
          this.setLocation(loc);
          this.fire('locationChanged',loc);
        }.bind(this));
        this.setLocation(options.location);
      }.bind(this));
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
    if (this.loadingBackend) {return;}
    this.loadingBackend = true;
    window.huiLocationPickerReady = function() {
      this.loadingBackend = false;
      this.backendLoaded = true;
      hui.log('Google maps loaded!');
      for (var i=0; i < this.defered.length; i++) {
        this.defered[i]();
      }
      window.huiLocationPickerReady = null;
    }.bind(this);
    hui.log('Loading google maps...');
    hui.require(document.location.protocol+'//maps.google.com/maps/api/js?callback=huiLocationPickerReady&key=AIzaSyD-kxdnmiDp7Vs9U4oK_iL9UfaRJgbWF8w');
  },
  setLocation : function(loc) {
    this._whenReady(function() {
      hui.log('Setting location...');
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
    }.bind(this));
  },
  _buildLatLng : function(loc) {
    if (!loc) {
      loc = {latitude:57.0465, longitude:9.9185};
    }
    return new google.maps.LatLng(loc.latitude, loc.longitude);
  }
};

/**
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
  this.options = hui.override({}, options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.visible = hui.cls.has(this.element, 'hui_bar-absolute') || this.element.style.display == 'none' ? false : true;
  this.body = hui.get.firstByClass(this.element, 'hui_bar_left');
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
    cls += ' hui_bar-' + options.variant;
  }
  if (options.absolute) {
    cls += ' hui_bar-absolute';
  }
  options.element = hui.build('div', {
    'class': cls
  });
  hui.build('div', {
    'class': 'hui_bar_left',
    parent: options.element
  });
  return new hui.ui.Bar(options);
};

hui.ui.Bar.prototype = {
  /** Add the bar to the page */
  addToDocument: function() {
    document.body.appendChild(this.element);
  },
  /**
   * Add a widget to the bar
   * @param {Widget} widget The widget to add
   */
  add: function(widget) {
    this.body.appendChild(widget.getElement());
  },
  /** Add a divider to the bar */
  addDivider: function() {
    hui.build('span', {
      'class': 'hui_bar_divider',
      parent: this.body
    });
  },
  addToRight: function(widget) {
    var right = this._getRight();
    right.appendChild(widget.getElement());
  },
  placeAbove: function(widgetOrElement) {
    if (widgetOrElement.getElement) {
      widgetOrElement = widgetOrElement.getElement();
    }
    hui.position.place({
      source: {
        element: this.element,
        vertical: 1,
        horizontal: 0
      },
      target: {
        element: widgetOrElement,
        vertical: 0,
        horizontal: 0
      }
    });
    this.element.style.zIndex = hui.ui.nextTopIndex();
  },
  /** Change the visibility of the bar
   * @param {Boolean} visible If the bar should be visible
   */
  setVisible: function(visible) {
    if (this.visible === visible) {
      return;
    }
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  },
  /** Show the bar */
  show: function() {
    // TODO: Use class to show/hide
    if (this.visible) {
      return;
    }
    if (this.options.absolute) {
      this.element.style.visibility = 'visible';
    } else {
      this.element.style.display = '';
      hui.ui.reLayout();
    }
    this.visible = true;
    hui.ui.callVisible(this);
  },
  /** Hide the bar */
  hide: function() {
    if (!this.visible) {
      return;
    }
    if (this.options.absolute) {
      this.element.style.visibility = 'hidden';
    } else {
      this.element.style.display = 'none';
      hui.ui.reLayout();
    }
    this.visible = false;
    hui.ui.callVisible(this);
  },
  _getRight: function() {
    if (!this.right) {
      this.right = hui.find('.hui_bar_right', this.element);
      if (!this.right) {
        this.right = hui.build('div', {
          'class': 'hui_bar_right',
          parent: this.element
        });
      }
    }
    return this.right;
  },
  select: function(key) {
    var children = hui.ui.getDescendants(this);
    hui.log(children);
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.getKey && child.setSelected) {
        child.setSelected(child.getKey() == key);
      }
    }
  },
  $clickButton: function(button) {
    this.fire('clickButton', button);
  }
};

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
  this.options = hui.override({}, options);
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.listen(this.element, 'click', this._click.bind(this));
  hui.listen(this.element, 'mousedown', this._mousedown.bind(this));
  hui.listen(this.element, 'mouseup', hui.stop);
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
  var e = options.element = hui.build('a', {
    'class': 'hui_bar_button'
  });
  if (options.icon) {
    e.appendChild(hui.ui.createIcon(options.icon, 16));
  }
  return new hui.ui.Bar.Button(options);
};

hui.ui.Bar.Button.prototype = {
  _mousedown: function(e) {
    this.fire('mousedown');
    if (this.options.stopEvents) {
      hui.stop(e);
    }
  },
  _click: function(e) {
    this.fire('click');
    if (this.options.stopEvents) {
      hui.stop(e);
    }
    hui.ui.callAncestors(this, '$clickButton');
  },
  /** Mark the button as selected
   * @param {Boolean} selected If it should be marked selected
   */
  setSelected: function(selected) {
    hui.cls.set(this.element, 'hui_bar_button-selected', selected);
  },
  getKey: function() {
    return this.options.key;
  }
};

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
  this.options = hui.override({}, options);
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Bar.Text.prototype = {
  /** Change the text
   * @param {String} str The text
   */
  setText: function(str) {
    hui.dom.setText(this.element, hui.ui.getTranslated(str));
  }
};


/**
 * A dock
 * @param {Object} The options
 * @constructor
 */
hui.ui.IFrame = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
};

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
};

/** A video player
 * @constructor
 */
hui.ui.VideoPlayer = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.placeholder = hui.get.firstByTag(this.element, 'div');
  this.name = options.name;
  this.state = {
    duration: 0,
    time: 0,
    loaded: 0
  };
  this.handlers = [hui.ui.VideoPlayer.HTML5, hui.ui.VideoPlayer.QuickTime, hui.ui.VideoPlayer.Embedded];
  this.handler = null;
  hui.ui.extend(this);
  if (this.options.video) {
    if (this.placeholder) {
      hui.listen(this.placeholder, 'click', function() {
        this.setVideo(this.options.video);
      }.bind(this));
    } else {
      hui.ui.onReady(function() {
        this.setVideo(this.options.video);
      }.bind(this));
    }
  }
};

hui.ui.VideoPlayer.prototype = {
  setVideo: function(video) {
    if (this.placeholder) {
      this.placeholder.style.display = 'none';
    }
    this.handler = this.getHandler(video);
    this.element.appendChild(this.handler.element);
    if (this.handler.showController()) {
      this.buildController();
    }
  },
  getHandler: function(video) {
    for (var i = 0; i < this.handlers.length; i++) {
      var handler = this.handlers[i];
      if (handler.isSupported(video)) {
        return new handler(video, this);
      }
    }
  },
  buildController: function() {
    var e = hui.build('div', {
      'class': 'hui_videoplayer_controller',
      parent: this.element
    });
    this.playButton = hui.build('a', {
      href: '#',
      'class': 'hui_videoplayer_playpause',
      text: 'wait!',
      parent: e
    });
    hui.listen(this.playButton, 'click', this.playPause.bind(this));
    this.status = hui.build('span', {
      'class': 'hui_videoplayer_status',
      parent: e
    });
  },
  onCanPlay: function() {
    this.playButton.update('Play');
  },
  onLoad: function() {
    this.state.loaded = this.state.duration;
    this.updateStatus();
  },
  onDurationChange: function(duration) {
    this.state.duration = duration;
    this.updateStatus();
  },
  onTimeChange: function(time) {
    this.state.time = time;
    this.updateStatus();
  },
  onLoadProgressChange: function(progress) {
    this.state.loaded = progress;
    this.updateStatus();
  },
  playPause: function() {
    if (this.handler.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  },
  play: function() {
    this.handler.play();
  },
  pause: function() {
    this.handler.pause();
  },
  updateStatus: function() {
    this.status.innerHTML = this.state.time + ' / ' + this.state.duration + ' / ' + this.state.loaded;
  }
};

///////// HTML5 //////////

hui.ui.VideoPlayer.HTML5 = function(video, player) {
  var e = this.element = hui.build('video', {
    width: video.width,
    height: video.height,
    src: video.src
  });
  hui.listen(e, 'load', player.onLoad.bind(player));
  hui.listen(e, 'canplay', player.onCanPlay.bind(player));
  hui.listen(e, 'durationchange', function(x) {
    player.onDurationChange(e.duration);
  });
  hui.listen(e, 'timeupdate', function() {
    player.onTimeChange(this.element.currentTime);
  }.bind(this));
};

hui.ui.VideoPlayer.HTML5.isSupported = function(video) {
  if (hui.browser.webkitVersion > 528 && (video.type === 'video/quicktime' || video.type === 'video/mp4')) {
    return true;
  }
  return false;
};

hui.ui.VideoPlayer.HTML5.prototype = {
  showController: function() {
    return true;
  },
  pause: function() {
    this.element.pause();
  },
  play: function() {
    this.element.play();
  },
  getTime: function() {
    return this.element.currentTime;
  },
  isPlaying: function() {
    return !this.element.paused;
  }
};

///////// QuickTime //////////

hui.ui.VideoPlayer.QuickTime = function(video, player) {
  this.player = player;
  var e = this.element = hui.build('object', {
    width: video.width,
    height: video.height,
    data: video.src,
    type: 'video/quicktime'
  });
  e.innerHTML = '<param value="false" name="controller"/>' +
    '<param value="true" name="enablejavascript"/>' +
    '<param value="undefined" name="posterframe"/>' +
    '<param value="false" name="showlogo"/>' +
    '<param value="false" name="autostart"/>' +
    '<param value="true" name="cache"/>' +
    '<param value="white" name="bgcolor"/>' +
    '<param value="false" name="aggressivecleanup"/>' +
    '<param value="true" name="saveembedtags"/>' +
    '<param value="true" name="postdomevents"/>';

  hui.listen(e, 'qt_canplay', player.onCanPlay.bind(player));
  hui.listen(e, 'qt_load', player.onLoad.bind(player));
  hui.listen(e, 'qt_progress', function() {
    player.onLoadProgressChange(e.GetMaxTimeLoaded() / 3000);
  });
  hui.listen(e, 'qt_durationchange', function(x) {
    player.onDurationChange(e.GetDuration() / 3000);
  });
  hui.listen(e, 'qt_timechanged', function() {
    player.onTimeChange(e.GetTime());
  });
};

hui.ui.VideoPlayer.QuickTime.isSupported = function(video) {
  return video.html === undefined;
};

hui.ui.VideoPlayer.QuickTime.prototype = {
  showController: function() {
    return true;
  },
  pause: function() {
    window.clearInterval(this.observer);
    this.element.Stop();
  },
  play: function() {
    this.element.Play();
    this.observer = window.setInterval(this.observeVideo.bind(this), 100);
  },
  observeVideo: function() {
    this.player.onTimeChange(this.element.GetTime() / 3000);
  },
  getTime: function() {
    return this.element.GetTime();
  },
  isPlaying: function() {
    return this.element.GetRate() !== 0;
  }
};

///////// Embedded //////////

hui.ui.VideoPlayer.Embedded = function(video, player) {
  this.element = hui.build('div', {
    width: video.width,
    height: video.height,
    html: video.html
  });
};

hui.ui.VideoPlayer.Embedded.isSupported = function(video) {
  return video.html !== undefined;
};

hui.ui.VideoPlayer.Embedded.prototype = {
  showController: function() {
    return false;
  },
  pause: function() {

  },
  play: function() {

  },
  getTime: function() {

  },
  isPlaying: function() {

  }
};


/**
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Segmented = function(options) {
  this.options = hui.override({value:null,allowNull:false},options);
  this.element = hui.get(options.element);
  this.name = options.name;
  this.value = this.options.value;
  this.state = {
    enabled: true,
    visible: true
  };
  hui.ui.extend(this);
  hui.listen(this.element,'click',this._click.bind(this));
};

hui.ui.Segmented.create = function(options) {
  var e = options.element = hui.build('span',{'class':'hui_segmented hui_segmented-standard'});
  if (options.items) {
    for (var i = 0; i < options.items.length; i++) {
      var item = options.items[i];
      var a = hui.build('a.hui_segmented_item',{parent:e,href:'#','rel':item.value});
      if (item.icon) {
        a.appendChild(hui.ui.createIcon(item.icon,16));
      }
      if (item.text) {
        hui.build('span',{'class':'hui_segmented_text',text:item.text,parent:a});
      }
      if (options.value!==undefined && options.value == item.value) {
        hui.cls.add(a,'hui-is-selected');
      }
    }
  }
  return new hui.ui.Segmented(options);
};

hui.ui.Segmented.prototype = {
  _click : function(e) {
    e = new hui.Event(e);
    e.stop();
    if (!this.state.enabled) { return; }
    var a = e.findByTag('a');
    if (a) {
      var changed = false;
      var value = a.getAttribute('rel');
      var x = hui.get.byClass(this.element,'hui-is-selected');
      for (var i=0; i < x.length; i++) {
        hui.cls.remove(x[i],'hui-is-selected');
      }
      if (value===this.value && this.options.allowNull) {
        changed=true;
        this.value = null;
      } else {
        hui.cls.add(a,'hui-is-selected');
        changed=this.value!== value;
        this.value = value;
      }
      if (changed) {
        this.fireValueChange();
      }
    }
  },
  _draw : function() {
    var state = this.state, element = this.element;
    hui.cls.set(element,'hui-is-disabled', !state.enabled);
    element.style.display = state.visible ? '' : 'none';
  },
  setEnabled : function(enabled) {
    this.state.enabled = enabled;
    this._draw();
  },
  setVisible : function(visible) {
    this.state.visible = visible;
    this._draw();
  },
  setValue : function(value) {
    if (value===undefined) {
      value=null;
    }
    var as = this.element.getElementsByTagName('a');
    this.value = null;
    for (var i=0; i < as.length; i++) {
      if (as[i].getAttribute('rel')===value) {
        hui.cls.add(as[i],'hui-is-selected');
        this.value=value;
      } else {
        hui.cls.remove(as[i],'hui-is-selected');
      }
    }
  },
  getValue : function() {
    return this.value;
  }
};

/** @namespace */
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

    if (navigator.plugins && navigator.plugins.length > 0) {
      if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
        var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
        var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
        var descArray = flashDescription.split(" ");
        var tempArrayMajor = descArray[2].split(".");
        var versionMajor = tempArrayMajor[0];
        var versionMinor = tempArrayMajor[1];
        var versionRevision = descArray[3];
        if (versionRevision === "") {
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
    } catch (ignore) {}

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

      } catch (ignore) {
      }
    }

    if (!version)
    {
      try {
        // version will be set for 4.X or 5.X player
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
        version = axo.GetVariable("$version");
      } catch (ignore) {
      }
    }

    if (!version)
    {
      try {
        // version will be set for 3.X player
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
        version = "WIN 3,0,18,0";
      } catch (ignore) {
      }
    }

    if (!version)
    {
      try {
        // version will be set for 2.X player
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
        version = "WIN 2,0,0,11";
      } catch (ignore) {
        version = -1;
      }
    }

    return version;
  }
};

/**
 * A link
 * @constructor
 */
hui.ui.Link = function(options) {
  this.options = options;
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
  this.addBehavior();
};

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
};

/**
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
};

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
        hui.cls.remove(x,'hui_links_row_selected');
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
    }
  },
  addLink : function() {
    this.editedLink = null;
    this.getEditWindow().show();
    this.editForm.reset();
    this.editForm.focus();
  },
  getEditWindow : function() {
    if (!this.editWindow) {
      var win = this.editWindow = hui.ui.Window.create({title:'Link',width:300,padding:10});
      var form = this.editForm = hui.ui.Form.create();
      var g = form.buildGroup({above:false},[
        {label:'Tekst',type:'TextInput',options:{key:'text'}}
      ]);

      var url = hui.ui.TextInput.create({key:'url'});
      g.add(url,'URL');
      this.inputs.url = url;

      var email = hui.ui.TextInput.create({key:'email'});
      g.add(email,'E-mail');
      this.inputs.email = email;

      page = hui.ui.DropDown.create({key:'page',source:this.options.pageSource});
      g.add(page,'Side');
      this.inputs.page = page;

      file = hui.ui.DropDown.create({key:'file',source:this.options.fileSource});
      g.add(file,'Fil');
      this.inputs.file = file;

      var self = this;
      hui.each(this.inputs,function(key,value) {
        value.listen({$valueChanged:function(){self.changeType(key);}});
      });

      form.createButtons().add(hui.ui.Button.create({text:'Gem',submit:true,highlighted:true}));
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
    if (values.email !== '') {
      link.kind='email';
      link.value=values.email;
      link.info=values.email;
      link.icon='monochrome/email';
    } else if (values.url !== '') {
      link.kind='url';
      link.value=values.url;
      link.info=values.url;
      link.icon='monochrome/globe';
    } else if (hui.isDefined(values.page)) {
      link.kind='page';
      link.value=values.page;
      link.info=this.inputs.page.getItem().title;
      link.icon='common/page';
    } else if (hui.isDefined(values.file)) {
      link.kind='file';
      link.value=values.file;
      link.info=this.inputs.file.getItem().title;
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
};

/**
 * @constructor
 * @param options {Object} The options
 * @param options.debug {boolean}
 * @param options.value {String} The HTML to edit
 * @param options.css {String}
 * @param options.autoHideToolbar {boolean}
 * @param options.replace {Element | String}
 */
hui.ui.MarkupEditor = function(options) {
  this.name = options.name;
  this.options = options = hui.override({debug:false,value:'',autoHideToolbar:true},options);
  if (options.replace) {
    options.replace = hui.get(options.replace);
    options.element = hui.build('div',{'class':'hui_markupeditor '+options.replace.className});
    options.replace.parentNode.insertBefore(options.element,options.replace);
    options.replace.style.display='none';
    options.value = this.options.replace.innerHTML;
  }
  this.ready = false;
  this.pending = [];
  this.element = hui.get(options.element);
  if (hui.browser.msie) {
    this.impl = hui.ui.MarkupEditor.MSIE;
  } else {
    this.impl = hui.ui.MarkupEditor.webkit;
  }
  this.impl.initialize({
    element : this.element,
    controller : this,
    $ready : this._ready.bind(this)
  });
  if (options.value) {
    this.setValue(options.value);
  }
  hui.ui.extend(this);
};

hui.ui.MarkupEditor.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{className:'hui_markupeditor'});
  return new hui.ui.MarkupEditor(options);
};

hui.ui.MarkupEditor.prototype = {

  _ready : function() {
    this.ready = true;
    for (var i=0; i < this.pending.length; i++) {
      this.pending[i]();
    }
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

  implSelectionChanged : function() {
    if (this.options.linkDelegate) {
      this.options.linkDelegate.$cancel();
    }
    this._highlightNode(null);
    this.temporaryLink = null;
    this._valueChanged();
    this._refreshInfoWindow();
    if (this.bar) this.bar.setBlock(this._getFirstBlock());
  },
  _getFirstBlock : function() {
    var path = this.impl.getPath();
    var blocks = ['P','DIV','H1','H2','H3','H4','H5','H6','BLOCKQUOTE'];
    for (var i = path.length - 1; i >= 0; i--) {
      var tag = path[i].tagName;
      if (blocks.indexOf(tag)!==-1) {
        return path[i];
      }
    }
    return null;
  },

  /** Remove the widget from the DOM */
  detach : function() {
    if (this.options.replace) {
      this.options.replace.style.display='';
    }
    var dest = ['_infoWindow','impl'];
    for (var i = dest.length - 1; i >= 0; i--) {
      if (this[dest[i]]) {
        this[dest[i]].destroy();
      }
    }
  },
  getAccessories : function() {
    return [this.colorPicker,this.bar].filter(function(e) {!!e});
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
      this.bar = new hui.ui.MarkupEditor.Bar({
        $clickButton : this._buttonClicked.bind(this),
        $changeBlock : this._changeBlock.bind(this)
      });
    }
    this.bar.show(this);
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
    } else if (info.key=='info') {
      this._toggleInfoWindow();
    } else {
      this.impl.format(info);
    }
    this._valueChanged();
    this._refreshInfoWindow();
    this.impl.restoreSelection();
    this.impl._selectionChanged();
  },
  _changeBlock : function(tag) {
    var block = this._getFirstBlock();
    if (block) {
      block = hui.dom.changeTag(block,tag);
      this.impl.selectNode(block);
    }
  },
  _showColorPicker : function() {
    if (!this.colorPicker) {
      this.colorPicker = hui.ui.Window.create({title:{en:'Color',da:'Farve'}});
      var picker = hui.ui.ColorPicker.create();
      picker.listen(this);
      this.colorPicker.add(picker);
      this.colorPicker.listen({
        $userClosedWindow : function() {
          this.impl.restoreSelection();
        }.bind(this)
      });
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
      delegate.$editLink({
        node : this.temporaryLink,
        $changed : function() {
          this._highlightNode(null);
          this.temporaryLink = null;
          this._valueChanged();
        }.bind(this),
        $cancel : function() {
          this._highlightNode(null);
          this.temporaryLink = null;
          this._valueChanged();
        }.bind(this),
        $remove : function() {
          // TODO: Standardise this
          this.impl._unWrap(this.temporaryLink);
          this.impl._selectionChanged();
        }.bind(this)
      });
    } else if (!this.linkEditor) {
      this.linkEditor = hui.ui.Window.create({padding:5,width:300});
      this.linkForm = hui.ui.Form.create();
      this.linkEditor.add(this.linkForm);
      this.linkForm.buildGroup({},[
        {type : 'TextInput', options:{key:'url',label:'Address:'}}
      ]);
      var buttons = this.linkForm.createButtons();
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
    this._refreshInfoWindow();
  },

  // Info window

  _toggleInfoWindow : function() {
    if (!this._infoWindow) {
      this._infoWindow = new hui.ui.MarkupEditor.Info({editor:this});
    }
    this._infoWindow.toggle();
    this._refreshInfoWindow();
  },

  _refreshInfoWindow : function() {
    if (!this._infoWindow) {return;}
    this._infoWindow.updatePath(this.impl.getPath());
  },

  /** @private */
  $colorWasSelected : function(color) {
    this.impl.restoreSelection(function() {
      this.impl.colorize(color);
      this._valueChanged();
    }.bind(this));
  },

  /** @private */
  $$parentMoved : function() {
    if (this.bar) {
      this.bar.place(this);
    }
  }
};








hui.ui.MarkupEditor.Bar = function(options) {
  this.options = options;
  this._initialize();
  hui.ui.extend(this);
};

hui.ui.MarkupEditor.Bar.prototype = {
  _initialize : function() {

    var things = [
      {key:'bold',icon:'edit/text_bold'},
      {key:'italic',icon:'edit/text_italic'},
      {divider:true},
      {key:'color',icon:'common/color'},
      {key:'addLink',icon:'monochrome/link'},
      {divider:true},
      {key:'align',value:'left',icon:'edit/text_align_left'},
      {key:'align',value:'center',icon:'edit/text_align_center'},
      {key:'align',value:'right',icon:'edit/text_align_right'},
      {key:'align',value:'justify',icon:'edit/text_align_justify'},
      {divider:true},
      {key:'clear',icon:'edit/clear'},
      {key:'info',icon:'monochrome/info'}
    ];

    this.bar = hui.ui.Bar.create({absolute:true,variant:'mini',small:true});
    var drop = this.blockSelector = hui.ui.DropDown.create({focus:false,variant:'bar_mini',items:[
      {value:'h1',text:'Header 1'},
      {value:'h2',text:'Header 2'},
      {value:'h3',text:'Header 3'},
      {value:'h4',text:'Header 4'},
      {value:'h5',text:'Header 5'},
      {value:'h6',text:'Header 6'},
      {value:'p',text:'Paragraph'},
      {value:'div',text:'Division'},
      {value:'blockquote',text:'Blockquote'}
    ]});
    this.bar.add(drop);

    drop.listen({
      $valueChanged : function(value) {
        this.options.$changeBlock(value);
      }.bind(this)
    });

    hui.each(things,function(info) {
      if (info.divider) {
        this.bar.addDivider();
        return;
      }
      var button = new hui.ui.Bar.Button.create({icon:info.icon,stopEvents:true});
      button.listen({
        $mousedown : function() { this.options.$clickButton(info); }.bind(this)
      });
      this.bar.add(button);
    }.bind(this));
    this.bar.addToDocument();
  },

  show : function(widget) {
    this.bar.placeAbove(widget);
    this.bar.show();
  },
  place : function(widget) {
    this.bar.placeAbove(widget);
  },
  hide : function() {
    this.bar.hide();
  },
  setBlock : function(value) {
    if (value) {
      this.blockSelector.setValue(value.tagName.toLowerCase());
    }
  },
  getAccessories : function() {
    return [this.bar];
  }
};





hui.ui.MarkupEditor.Info = function(options) {
  this.options = options;
  this._initialize();
};

hui.ui.MarkupEditor.Info.prototype = {
  _initialize : function() {
    this._window = hui.ui.Window.create({title:'Info',width:400});
    this._css = hui.ui.CodeInput.create();
    this._css.listen({
      $valueChanged : function(value) {
        if (!this.tag) {return;}
        this.tag.setAttribute('style',value);
      }.bind(this)
    });
    this._window.add(this._css);
    this._path = hui.build('div',{'class':'hui_markupeditor_path'});
    this._window.add(this._path);
  },
  toggle : function() {
   this._window.toggle({avoid:this.options.editor.element});
  },
  updatePath : function(path) {
    var html = '';
    for (var i = path.length - 1; i >= 0; i--) {
      html+='<a data-index="' + i + '" href="javascript://">' + path[i].tagName + '</a> ';
    }
    this._path.innerHTML = html;
    this.tag = path[0];
    this._css.setValue(this.tag ? this.tag.getAttribute('style') : '');
  },
  destroy : function() {
    this._window.destroy();
  }
};




/** @namespace */
hui.ui.MarkupEditor.webkit = {

  path : [],

  initialize : function(options) {
    this.element = options.element;
    hui.style.set(this.element,options.controller.options.style);
    this.element.style.overflow='auto';
    this.element.contentEditable = true;
    var ctrl = this.controller = options.controller;
    hui.listen(this.element,'focus',function() {
      ctrl.implFocused();
    });
    hui.listen(this.element,'blur',function() {
      ctrl.implBlurred();
    });
    hui.listen(this.element,'keyup',this._change.bind(this));
    hui.listen(this.element,'mouseup',this._change.bind(this));
    options.$ready();
  },
  saveSelection : function() {

  },
  restoreSelection : function(callback) {
    if (callback) {callback();}
  },
  focus : function() {
    this.element.focus();
    this._selectionChanged();
    this.controller.implFocused();
  },
  format : function(info) {
    if (info.key=='strong' || info.key=='em') {
      this._wrapInTag(info.key);
    } else if (info.key=='insert-table') {
      this._insertHTML('<table><tbody><tr><td>Lorem ipsum dolor</td><td>Lorem ipsum dolor</td></tr></tbody></table>');
    } else {
      document.execCommand(info.key,null,info.value);
      var node = this._getSelectedNode();
      if (node.tagName=='B') {
        node = hui.dom.changeTag(node,'strong');
        this.selectNode(node);
      } else if (node.tagName=='I') {
        node = hui.dom.changeTag(node,'em');
        this.selectNode(node);
      }
      this.controller._valueChanged();
    }
    this._selectionChanged();
  },
  selectNode : function(node) {
    window.getSelection().selectAllChildren(node);
    this._selectionChanged();
  },
  getOrCreateLink : function() {
    var node = this._getSelectedNode();
    if (node && node.tagName.toLowerCase()=='a') {
      return node;
    }
    document.execCommand('createLink',null,'#');
    this._selectionChanged();
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
    var node = this._getSelectedNode();
    if (node.tagName=='FONT') {
      node = hui.dom.changeTag(node,'span');
      node.style.color = color;
      node.removeAttribute('color');
      var selection = window.getSelection();
      selection.selectAllChildren(node);
    }
    this._selectionChanged();
  },
  align : function(value) {
    var x = {center:'justifycenter',justify:'justifyfull',left:'justifyleft',right:'justifyright'};
    document.execCommand(x[value],null,null);
    this._updateInlinePanel();
  },
  _change : function() {
    this.controller.implValueChanged();
    this._selectionChanged();
  },
  _wrapInTag : function(tag) {
    var selection = window.getSelection();
    if (selection.rangeCount<1) {return;}
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
    this._selectionChanged();
  },
  _getInlineTag : function() {
    var selection = window.getSelection();
    if (selection.rangeCount<1) {return;}

  },
  removeLink : function(node) {
    this._unWrap(node);
    this._selectionChanged();
  },
  _unWrap : function(node) {
    var c = node.childNodes;
    for (var i=0; i < c.length; i++) {
      node.parentNode.insertBefore(c[i],node);
    }
    node.parentNode.removeChild(node);
  },
  _insertHTML : function(html) {
    document.execCommand('inserthtml',null,html);
  },
  _getAncestor : function() {
    var selection = window.getSelection();
    if (selection.rangeCount<1) {
      return null;
    }
    var range = selection.getRangeAt(0);
    var ancestor = range.commonAncestorContainer;
    if (!hui.dom.isElement(ancestor)) {
      ancestor = ancestor.parentNode;
    }
    return ancestor;
  },
  _buildInlinePanel : function() {
    this._inlinePanel = hui.ui.BoundPanel.create({variant:'light'});
    var content = hui.build('div',{
      'class' : 'hui_markupeditor_inlinepanel',
      html : '<a href="javascript://" data="bold"><strong>Bold</strong></a><a href="javascript://" data="italic"><em>Italic</em></a>'
    });
    hui.listen(content,'mousedown',function(e) {
      e = hui.event(e);
      e.stop();
      var a = e.findByTag('a');
      if (a) {
        this.saveSelection();
        this.format({key:a.getAttribute('data')});
        this.restoreSelection();
        this._selectionChanged();
      }
    }.bind(this));
    this._inlinePanel.add(content);
  },
  _updateInlinePanel : function() {
    var selection = window.getSelection();
    if (!this._inlinePanel) this._buildInlinePanel();
    if (selection.rangeCount < 1) {
      this._inlinePanel.hide();
      return;
    }
    var range = selection.getRangeAt(0);
    if (range.startOffset==range.endOffset) {
      this._inlinePanel.hide();
      return;
    }
    var rects = range.getClientRects();
    if (rects.length > 0) {
      var rect = rects[0];
      this._inlinePanel.position({rect:rect,position:'vertical'});
      this._inlinePanel.show();
    }

  },
  _selectionChanged : function() {
    var sel = window.getSelection();
    var hash = this._hash(sel);
    var node = sel.anchorNode ? sel.anchorNode.parentNode : null;
    var latest = this._latestSelection;
    if (latest) {
      if (node == latest.node && latest.hash == hash) {
        return;
      }
    }
    this._latestSelection = {node:node,hash:hash};
    var path = [],
      tag = this._getAncestor();
    while (tag && tag !== this.element) {
      path.push(tag);
      tag = tag.parentNode;
    }
    this.path = path;
    this.controller.implSelectionChanged();
    this._updateInlinePanel();
  },
  _storeSelection : function(selection) {

  },
  _hash : function(sel) {
    return sel.anchorOffset+':'+sel.baseOffset+':'+sel.extentOffset;
  },
  removeFormat : function() {
    document.execCommand('removeFormat',null,null);
    this._selectionChanged();
  },
  setHTML : function(html) {
    this.element.innerHTML = html;
  },
  getHTML : function() {
    var cleaned = hui.ui.MarkupEditor.util.clean(this.element);
    return cleaned.innerHTML;
  },
  getPath : function() {
    return this.path;
  },
  destroy : function() {
    if (this._inlinePanel) {
      this._inlinePanel.destroy();
    }
  }
};






















/** @namespace */
hui.ui.MarkupEditor.MSIE = {
  initialize : function(options) {
    this.element = options.element;
    this.iframe = hui.build('iframe',{style:'display:block; width: 100%; border: 0;',parent:this.element});
    hui.listen(this.iframe,'load',function() {
      this._load();
      options.$ready();
    }.bind(this));
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
      if (callback) {callback();}
    }.bind(this));
  },
  _load : function() {
    this.document = hui.frame.getDocument(this.iframe);
    this.body = this.document.body;
    this.body.contentEditable = true;
    hui.listen(this.body,'keyup',this._keyUp.bind(this));
    hui.listen(this.body,'mouseup',this._mouseUp.bind(this));
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
  },
  getPath : function() {
    return [];
  },
  destroy : function() {
  }
};

/** @namespace */
hui.ui.MarkupEditor.util = {
  clean : function(node) {
    var copy = node.cloneNode(true);
    this.replaceNodes(copy,{b:'strong',i:'em',font:'span'});

    var apples = hui.get.byClass(copy,'Apple-style-span');
    for (var i = apples.length - 1; i >= 0; i--){
      apples[i].removeAttribute('class');
    }
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
        }
      }
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
    }
  }
};

/**
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
  if (options.listener) {
    this.listen(options.listener);
  }
  this.addBehavior();
  this.buildData();
};

hui.ui.ColorPicker.create = function(options) {
  var swatches = '',
    c, hex, j;
  for (var i = 0; i < 360; i += 30) {
    for (j = 0.05; j <= 1; j += 0.15) {
      c = hui.Color.hsv2rgb(i, j, 1);
      hex = hui.Color.rgb2hex(c);
      swatches += '<a style="background: rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')" rel="' + hex + '"></a>';
    }
    for (j = 1; j >= 0.20; j -= 0.15) {
      c = hui.Color.hsv2rgb(i, 1, j);
      hex = hui.Color.rgb2hex(c);
      swatches += '<a style="background: rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')" rel="' + hex + '"></a>';
    }
  }
  for (j = 255; j >= 0; j -= 255 / 12) {
    hex = hui.Color.rgb2hex([j, j, j]);
    swatches += '<a style="background: rgb('+Math.round(j)+','+Math.round(j)+','+Math.round(j)+')" rel="'+hex+'"></a>';
  }
  options = options || {};
  options.element = hui.build('div',{
    'class':'hui_colorpicker',
    html :
      '<div class="hui_bar hui_bar-window_mini">'+
        '<div class="hui_bar_left">'+
          '<a class="hui_bar_button hui_bar_button-selected" href="javascript:void(0)" rel="0">'+
            '<span class="hui_icon_16" style="'+hui.ui.getIconStyle('colorpicker/wheel_pastels',16)+'"></span>'+
          '</a>'+
          '<a class="hui_bar_button" href="javascript:void(0)" rel="1">'+
            '<span class="hui_icon_16" style="'+hui.ui.getIconStyle('colorpicker/wheel_brightness',16)+'"></span>'+
          '</a>'+
          '<a class="hui_bar_button" href="javascript:void(0)" rel="2">'+
            '<span class="hui_icon_16" style="'+hui.ui.getIconStyle('colorpicker/wheel_saturated',16)+'"></span>'+
          '</a>'+
          '<a class="hui_bar_button" href="javascript:void(0)" rel="3">'+
            '<span class="hui_icon_16" style="'+hui.ui.getIconStyle('colorpicker/swatches',16)+'"></span>'+
          '</a>'+
        '</div>'+
        '<div class="hui_bar_right">'+
          '<input class="hui_colorpicker"/>'+
        '</div>' +
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
};

hui.ui.ColorPicker.prototype = {
  /** @private */
  addBehavior : function() {
    var bs = hui.get.byClass(this.element,'hui_bar_button');
    for (var i=0; i < bs.length; i++) {
      var button = new hui.ui.Bar.Button({element:bs[i]});
      button.listen(this);
      this.buttons.push(button);
    }

    hui.listen(this.element,'click',this._click.bind(this));
    hui.listen(this.wheel1,'mousemove',this._hoverWheel1.bind(this));
    hui.listen(this.wheel1,'click',this._pickColor.bind(this));
    hui.listen(this.wheel2,'mousemove',this._hoverWheel2.bind(this));
    hui.listen(this.wheel2,'click',this._pickColor.bind(this));
    hui.listen(this.wheel3,'mousemove',this._hoverWheel3.bind(this));
    hui.listen(this.wheel3,'click',this._pickColor.bind(this));
    hui.listen(this.element,'mousedown',function(e) {
      hui.stop(e);
    });
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
    }
    for (i=0; i < this.buttons.length; i++) {
      this.buttons[i].setSelected(this.buttons[i]==button);
    }
  },
  _click : function(e) {
    e = hui.event(e);
    e.stop();
    var input = e.findByTag('input');
    if (input) {input.focus();}
  },
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
    var addary = [];           //red
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
    var c;
    if(x == 512 & y == 512) {
      c = "000000";
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

    if (y > 256) {return;}

    var cartx = x - 128;
    var carty = 128 - y;
    var cartx2 = cartx * cartx;
    var carty2 = carty * carty;
    var rraw = Math.sqrt(cartx2 + carty2);       //raw radius
    var rnorm = rraw / 128;                        //normalized radius
    if (rraw === 0) {
      sat = 0;
      val = 0;
      rgb = new Array(0, 0, 0);
    } else {
      var arad = Math.acos(cartx / rraw);            //angle in radians
      var aradc = (carty >= 0) ? arad : 2 * Math.PI - arad;  //correct below axis
      var adeg = 360 * aradc / (2 * Math.PI);  //convert to degrees
      if (rnorm > 1) {    // outside circle
        rgb = new Array(255, 255, 255);
        sat = 1;
        val = 1;
      } else if (rnorm >= 0.5) {
        sat = 1 - ((rnorm - 0.5) * 2);
        val = 1;
        rgb = hui.Color.hsv2rgb(adeg, sat, val);
      } else {
        sat = 1;
        val = rnorm * 2;
        rgb = hui.Color.hsv2rgb(adeg, sat, val);
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

    if (y > 256) {return;}

    var cartx = x - 128;
    var carty = 128 - y;
    var cartx2 = cartx * cartx;
    var carty2 = carty * carty;
    var rraw = Math.sqrt(cartx2 + carty2);       //raw radius
    var rnorm = rraw/128;                        //normalized radius
    if (rraw === 0) {
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
};

/**
 * An input component for geo-location
 * @constructor
 */
hui.ui.LocationInput = function(options) {
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
  this._addBehavior();
};

hui.ui.LocationInput.create = function(options) {
  options = options || {};
  options.element = hui.build('span',{'class':'hui_locationinput', html:'<span class="hui_locationinput_latitude"><span><input autocomplete="off"></span></span><span class="hui_locationinput_longitude"><span><input autocomplete="off"></span></span><a class="hui_locationinput_picker" href="javascript://"></a>'});
  return new hui.ui.LocationInput(options);
};

hui.ui.LocationInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.chooser,'click',this._showPicker.bind(this));
    hui.ui.addFocusClass({element:this.latField.element,classElement:this.element,'class':'hui_locationinput-focused'});
    hui.ui.addFocusClass({element:this.lngField.element,classElement:this.element,'class':'hui_locationinput-focused'});
  },
  reset : function() {
    this.setValue();
  },
  getValue : function() {
    return this.value;
  },
  /** Set the value
   *
   */
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
    this._updatePicker();
  },
  _updatePicker : function() {
    if (this.picker) {
      this.picker.setLocation(this.value);
    }
  },
  _showPicker : function() {
    if (!this.picker) {
      this.picker = new hui.ui.LocationPicker();
      this.picker.listen(this);
    }
    this.picker.show({node:this.chooser,location:this.value});
  },
  /** @private */
  $locationChanged : function(loc) {
    this.setValue(loc);
    this.fire('valueChanged',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  },
  /** @private */
  $valueChanged : function() {
    var lat = this.latField.getValue();
    var lng = this.lngField.getValue();
    if (lat===null || lng===null) {
      this.value = null;
    } else {
      this.value = {latitude:lat,longitude:lng};
    }
    this._updatePicker();
    this.fire('valueChanged',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  }
};

/////////////////////////// Style length /////////////////////////

/**
 * A date and time field
 * @constructor
 */
hui.ui.StyleLength = function(o) {
  this.options = hui.override({value:null,min:0,max:1000,units:['px','pt','em','%'],initialValue:null,defaultUnit:'px',allowNull:false},o);
  this.name = o.name;
  var e = this.element = hui.get(o.element);
  this.input = hui.get.firstByTag(e,'input');
  var as = e.getElementsByTagName('a');
  this.up = as[0];
  this.down = as[1];
  this.value = this.parseValue(this.options.value);
  hui.ui.extend(this);
  this._addBehavior();
};

hui.ui.StyleLength.create = function(options) {
  options.element = hui.build('span',{
    'class' : 'hui_style_length hui_numberinput',
    html : '<input class="hui_textinput" type="text"/><a class="hui_numberinput_up"></a><a class="hui_numberinput_down"></a>'});
  return new hui.ui.StyleLength(options);
};

hui.ui.StyleLength.prototype = {
  /** @private */
  _addBehavior : function() {
    var e = this.element;
    hui.listen(this.input,'blur',this._onBlur.bind(this));
    hui.listen(this.input,'keyup',this.keyEvent.bind(this));
    hui.listen(this.up,'mousedown',this._upEvent.bind(this));
    hui.listen(this.down,'mousedown',this._downEvent.bind(this));
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
    }
    parsed.number = Math.max(this.options.min,Math.min(this.options.max,parsed.number));
    return parsed;
  },
  _onBlur : function() {
    this._updateInput();
  },
  /** @private */
  keyEvent : function(e) {
    e = e || window.event;
    if (e.keyCode == 38) {
      hui.stop(e);
      this._upEvent();
    } else if (e.keyCode == 40) {
      this._downEvent();
    } else {
      this._checkAndSetValue(this.parseValue(this.input.value));
    }
  },
  /** @private */
  _updateInput : function() {
    this.input.value = this.getValue();
  },
  _checkAndSetValue : function(value) {
    var old = this.value;
    var changed = false;
    if (old===null && value===null) {
      // nothing
    } else if (old!==null && value!==null && old.number===value.number && old.unit===value.unit) {
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
  _setInitialValue : function() {
    if (!this.value && this.options.initialValue) {
      this.setValue(this.options.initialValue);
    }
  },
  _downEvent : function() {
    this._setInitialValue();
    if (this.value) {
      this._checkAndSetValue({number:Math.max(this.options.min,this.value.number-1),unit:this.value.unit});
    } else {
      this._checkAndSetValue({number:this.options.min,unit:this.options.defaultUnit});
    }
    this._updateInput();
  },
  _upEvent : function() {
    this._setInitialValue();
    if (this.value) {
      this._checkAndSetValue({number:Math.min(this.options.max,this.value.number+1),unit:this.value.unit});
    } else {
      this._checkAndSetValue({number:this.options.min+1,unit:this.options.defaultUnit});
    }
    this._updateInput();
  },

  // Public

  setInitialValue : function(value) {
    this.options.initialValue = value;
  },
  getValue : function() {
    return this.value ? this.value.number+this.value.unit : '';
  },
  setValue : function(value) {
    this.value = this.parseValue(value);
    this._updateInput();
  },
  focus : function() {
    try {
      this.input.focus();
    } catch (e) {}
  },
  reset : function() {
    this.setValue('');
  }
};

/**
 * A date and time field
 * @constructor
 */
hui.ui.DateTimeInput = function(o) {
  this.inputFormats = ['d-m-Y','d/m-Y','d/m/Y','d-m-Y H:i:s','d/m-Y H:i:s','d/m/Y H:i:s','d-m-Y H:i','d/m-Y H:i','d/m/Y H:i','d-m-Y H','d/m-Y H','d/m/Y H','d-m','d/m','d','Y','m-d-Y','m-d','m/d'];
  this.outputFormat = 'd-m-Y H:i:s';
  this.name = o.name;
  this.element = hui.get(o.element);
  this.input = hui.get.firstByTag(this.element,'input');
  this.options = hui.override({returnType:null,allowNull:true,value:null},o);
  this.value = this.options.value;
  hui.ui.extend(this);
  this._addBehavior();
  this._updateUI();
};

hui.ui.DateTimeInput.create = function(options) {
  options = options || {};
  var node = hui.build('span',{'class':'hui_datetime'});
  hui.build('input',{'class':'hui_textinput',parent:node});
  hui.build('a',{'class':'hui_datetime_selector',href:'#',tabIndex:'-1',parent:node});
  options.element = node;
  return new hui.ui.DateTimeInput(options);
};

hui.ui.DateTimeInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.input,'blur',this._onBlur.bind(this));
    hui.listen(this.input,'keyup',this._parse.bind(this));
    hui.listen(this.input,'focus',this._onFocus.bind(this));
    var a = hui.get.firstByTag(this.element,'a');
    hui.listen(a,'mousedown',hui.stop);
    hui.listen(a,'click',this._onClickIcon.bind(this));
  },
  _onClickIcon : function(e) {
    hui.stop(e);
    this.input.focus();
    this._showPicker();
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
    this._updateUI();
  },
  _parse : function() {
    var originalTime = this.value ? this.value.getTime() : 0;
    var str = this.input.value;
    var parsed = null;
    for (var i = 0; i < this.inputFormats.length && parsed === null; i++) {
      parsed = Date.parseDate(str, this.inputFormats[i]);
    }
    if (this.options.allowNull || parsed !== null) {
      this.value = parsed;
    }
    if (this.datePicker) {
      this.datePicker.setValue(this.value);
    }
    var newTime =  this.value ? this.value.getTime() : 0;
    if (originalTime != newTime) {
      hui.ui.callAncestors(this, 'childValueChanged', this.value);
      this.fire('valueChanged', this.value);
    }
  },
  _check : function() {
    this._parse();
    this._updateUI();
  },
  getValue : function() {
    if (this.value !== null && this.options.returnType == 'seconds') {
      return Math.round(this.value.getTime() / 1000);
    }
    return this.value;
  },
  _updateUI : function() {
    if (this.value) {
      this.input.value = this.value.dateFormat(this.outputFormat);
    } else {
      this.input.value = '';
    }
  },
  _onBlur : function() {
    this._check();
    if (this.panel) {
      this.panel.hide();
    }
    if (this.datePickerPanel) {
      this.datePickerPanel.hide();
    }
  },
  _onFocus : function() {
    this._showPanel();
  },
  _showPanel : function() {
    if (!this.panel) {
      this.panel = hui.ui.BoundPanel.create({variant:'light'});
      var b = hui.ui.Buttons.create({align:'center'});
      b.add(hui.ui.Button.create({
        text : 'Idag',
        small : true,
        variant : 'light',
        listener : {$click:this.goToday.bind(this)}
      }));
      b.add(hui.ui.Button.create({
        text : '+ dag',
        small : true,
        variant : 'light',
        listener : {$click:function() {this.addDays(1);}.bind(this)}
      }));
      b.add(hui.ui.Button.create({
        text : '+ uge',
        small : true,
        variant : 'light',
        listener : {$click:function() {this.addDays(7);}.bind(this)}
      }));
      b.add(hui.ui.Button.create({
        text : '12:00',
        small : true,
        variant : 'light',
        listener : {$click:function() {this.setHour(12);}.bind(this)}
      }));
      b.add(hui.ui.Button.create({
        text : '00:00',
        small : true,
        variant : 'light',
        listener : {$click:function() {this.setHour(0);}.bind(this)}
      }));
      /*
      b.add(hui.ui.Button.create({
        text : 'Kalender',
        small : true,
        variant : 'light',
        listener : {$click:this._showPicker.bind(this)}
      }));*/
      this.panel.add(b);
    }
    this.panel.position({element:this.element,position:'vertical'});
    this.panel.show();
  },
  goToday : function() {
    var newDate = this._getValueOrNowCopy();
    var now = new Date();
    newDate.setDate(now.getDate());
    newDate.setMonth(now.getMonth());
    newDate.setFullYear(now.getFullYear());
    this.setValue(newDate);
  },
  addDays : function(num) {
    var newDate = this._getValueOrNowCopy();
    newDate.setDate(newDate.getDate()+num);
    this.setValue(newDate);
  },
  setHour : function(hours) {
    var newDate = this._getValueOrNowCopy();
    newDate.setMilliseconds(0);
    newDate.setSeconds(0);
    newDate.setMinutes(0);
    newDate.setHours(hours);
    this.setValue(newDate);
  },
  _getValueOrNowCopy : function() {
    return this.value === null ? new Date() : new Date(this.value.getTime());
  },
  _showPicker : function() {
    if (this.panel) {
      this.panel.hide();
    }
    if (!this.datePickerPanel) {
      this.datePickerPanel = hui.ui.BoundPanel.create({variant:'light'});
      this.datePicker = hui.ui.DatePicker.create({value:this.value});
      this.datePicker.listen({
        $dateChanged : function(date) {
          this.setValue(date);
        }.bind(this)
      });
      this.datePickerPanel.add(this.datePicker);
    }
    this.datePicker.setValue(this.value);
    this.datePickerPanel.position(this.element);
    this.datePickerPanel.show();
  },
  /** @private */
  $$parentMoved : function() {
    if (this.datePickerPanel && this.datePickerPanel.isVisible()) {
      this.datePickerPanel.position(this.element);
      this.datePickerPanel.show();
    }
    if (this.panel && this.panel.isVisible()) {
      this.panel.position({element:this.element,position:'vertical'});
      this.panel.show();
    }
  },
  /** @private */
  $visibilityChanged : function() {
    if (this.datePickerPanel) {
      this.datePickerPanel.hide();
    }
    if (this.panel) {
      this.panel.hide();
    }
  }
};

/**
 * A tokens component
 * @constructor
 */
hui.ui.TokenField = function(o) {
  this.options = hui.override({key:null},o);
  this.element = hui.get(o.element);
  this.name = o.name;
  this.value = [''];
  hui.ui.extend(this);
  this._updateUI();
};

hui.ui.TokenField.create = function(o) {
  o = o || {};
  o.element = hui.build('div',{'class':'hui_tokenfield'});
  return new hui.ui.TokenField(o);
};

hui.ui.TokenField.prototype = {
  setValue : function(objects) {
    this.value = objects || [];
    this.value.push('');
    this._updateUI();
  },
  reset : function() {
    this.value = [''];
    this._updateUI();
  },
  getValue : function() {
    var out = [];
    hui.each(this.value,function(value) {
      value = hui.string.trim(value);
      if (value.length>0) {
        out.push(value);
      }
    });
    return out;
  },
  _updateUI : function() {
    this.element.innerHTML='';
    hui.each(this.value,function(value,i) {
      var input = hui.build('input',{'class':'hui_textinput',parent:this.element,style:{width:'50px'}});
      if (this.options.width) {
        input.style.width=this.options.width+'px';
      }
      input.value = value;
      hui.listen(input,'keyup',function() {
        this._inputChanged(input,i);
      }.bind(this));
    }.bind(this));
  },
  _inputChanged : function(input,index) {
    if (index==this.value.length-1 && input.value!=this.value[index]) {
      this._addField();
    }
    this.value[index] = input.value;
    hui.animate({node:input,css:{width:Math.min(Math.max(input.value.length*7+3,50),150)+'px'},duration:200});
  },
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      this.$$layout();
    }
  },
  /** @private */
  $$layout : function() {
    var inputs = hui.findAll('input',this.element);
    for (var i=0; i < inputs.length; i++) {
      inputs[i].style.width = Math.min(Math.max(inputs[i].value.length*7+3,50),150)+'px';
    }
  },
  _addField : function() {
    var input = hui.build('input',{'class':'hui_textinput',style:{width:'50px'}});
    if (this.options.width) {
      input.style.width = this.options.width+'px';
    }
    var i = this.value.length;
    this.value.push('');
    this.element.appendChild(input);
    var self = this;
    hui.listen(input,'keyup',function() {
      self._inputChanged(input,i);
    });
  }
};

hui.component('Checkbox', {
  'with': [
    'value', 'enabled', 'key', 'size'
  ],
  state : {
    text: undefined
  },
  nodes: {
    label: '.hui_checkbox_label'
  },
  create : function(options) {
    return hui.build('a.hui_checkbox', { href: '#', html: '<span class="hui_checkbox_button"></span>' });
  },
  init : function(options) {
    hui.ui.addFocusClass({element: this.element, 'class': 'hui_checkbox_focused'});
  },
  isVoid : function() {
    var href = this.element.getAttribute('href');
    return (href === '#' || href === 'javascript://');
  },
  '!click' : function(e) {
    if (this.isVoid()) {
      e.prevent();
    } else {
      return;
    }
    if (!this.isEnabled()) { return }
    this.element.focus();
    this.setValue(!this.getValue());
    this.tellValueChange();
  },
  draw : function(changed) {
    ('value' in changed) && hui.cls.set(this.element, 'hui_checkbox_selected', this.getValue());
    ('enabled' in changed) && hui.cls.set(this.element, 'hui_checkbox-disabled', !this.isEnabled());
    ('text' in changed) && this._drawText();
    ('size' in changed) && hui.cls.set(this.element, 'hui-large', this.state.size == 'large');
  },
  _drawText : function() {
    if (this.state.text && !this.nodes.label) {
      this.nodes.label = hui.build('span.hui_checkbox_label', {parent: this.element, text: hui.ui.getTranslated(this.state.text)})
    } else if (!this.state.text && this.nodes.label) {
      hui.dom.remove(this.nodes.label);
      this.nodes.label = undefined;
    } else {
      hui.dom.setText(this.nodes.label, hui.ui.getTranslated(this.state.text));
    }
  },
  setText : function(txt) {
    this.change({text: txt});
  },
  /** Resets the checkbox */
  reset : function() {
    this.setValue(false);
  }

});

/////////////////////////// Checkboxes ////////////////////////////////

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
  this._addBehavior();
  this._updateUI();
  if (options.url) {
    new hui.ui.Source({url:options.url,delegate:this});
  }
};

hui.ui.Checkboxes.create = function(o) {
  o.element = hui.build('div',{'class':o.vertical ? 'hui_checkboxes hui_checkboxes_vertical' : 'hui_checkboxes'});
  if (o.items) {
    hui.each(o.items,function(item) {
      var node = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span class="hui_checkbox_button"></span><span class="hui_checkbox_label">'+hui.string.escape(item.title)+'</span>'});
      hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
      o.element.appendChild(node);
    });
  }
  return new hui.ui.Checkboxes(o);
};

hui.ui.Checkboxes.prototype = {
  _addBehavior : function() {
    var checks = hui.get.byClass(this.element,'hui_checkbox');
    hui.each(checks,function(check,i) {
      hui.ui.addFocusClass({element:check,'class':'hui_checkbox_focused'});
      hui.listen(check,'click',function(e) {
        hui.stop(e);
        this.flipValue(this.items[i].value);
      }.bind(this));
    }.bind(this));
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
      }
      if (found) {
        newValues.push(value);
      }
    }
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
    }
    var nodes = hui.get.byClass(this.element,'hui_checkbox');
    for (i=0; i < this.items.length; i++) {
      item = this.items[i];
      found = hui.array.contains(this.values,item.value);
      hui.cls.set(nodes[i],'hui_checkbox_selected',found);
    }
  },
  refresh : function() {
    for (var i=0; i < this.subItems.length; i++) {
      this.subItems[i].refresh();
    }
  },
  reset : function() {
    this.setValues([]);
  },
  /**
   * @private
   * @deprecated
   */
  setValues : function(values) {
    this.setValue(values);
  },
  /**
   * @private
   * @deprecated
   */
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
  $optionsLoaded : function(items) {
    hui.each(items,function(item) {
      var node = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span class="hui_checkbox_button"></span><span class="hui_checkbox_label">'+hui.string.escape(item.title)+'</span>'});
      hui.listen(node,'click',function(e) {
        hui.stop(e);
        this.flipValue(item.value);
      }.bind(this));
      hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
      this.element.appendChild(node);
      this.items.push(item);
    }.bind(this));
    this._checkValues();
    this._updateUI();
  }
};

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
};

hui.ui.Checkboxes.Items.prototype = {
  refresh : function() {
    if (this.options.source) {
      this.options.source.refresh();
    }
  },
  /** @private */
  $optionsLoaded : function(items) {
    this.checkboxes = [];
    this.element.innerHTML='';
    var self = this;
    hui.each(items,function(item) {
      var parsed = {text:item.title || item.text,value:hui.intOrString(item.value)};
      var node = parsed.element = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span class="hui_checkbox_button"></span><span class="hui_checkbox_label">'+hui.string.escape(parsed.text)+'</span>'});
      hui.listen(node,'click',function(e) {
        hui.stop(e);
        node.focus();
        self._onItemClick(parsed);
      });
      hui.ui.addFocusClass({element:node,'class':'hui_checkbox_focused'});
      self.element.appendChild(node);
      self.checkboxes.push(parsed);
    });
    this.parent._checkValues();
    this._updateUI();
  },
  $objectsLoaded : function(items) {
    this.$optionsLoaded(items);
  },
  _onItemClick : function(item) {
    this.parent.flipValue(item.value);
  },
  _updateUI : function() {
    for (var i=0; i < this.checkboxes.length; i++) {
      var item = this.checkboxes[i];
      var index = hui.array.indexOf(this.parent.values,item.value);
      hui.cls.set(item.element,'hui_checkbox_selected',index!=-1);
    }
  },
  _hasValue : function(value) {
    for (var i=0; i < this.checkboxes.length; i++) {
      if (this.checkboxes[i].value==value) {
        return true;
      }
    }
    return false;
  }
};

/**
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
};

hui.ui.Radiobuttons.prototype = {
/*  click : function() {
    this.value = !this.value;
    this.updateUI();
  },*/
  /** @private */
  updateUI : function() {
    for (var i=0; i < this.radios.length; i++) {
      var radio = this.radios[i];
      hui.cls.set(hui.get(radio.id),'hui_radiobutton_selected',radio.value==this.value);
    }
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
    this.enabled = !!enabled;
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
    };
  }
};

/**
 * A number field
 * @constructor
 */
hui.ui.NumberInput = function(o) {
  this.options = hui.override({min:0,max:undefined,value:null,tickSize:1,decimals:0,allowNull:false},o);
  this.name = o.name;
  var e = this.element = hui.get(o.element);
  this.input = hui.get.firstByTag(e,'input');
  this.up = hui.get.firstByClass(e,'hui_numberinput_up');
  this.down = hui.get.firstByClass(e,'hui_numberinput_down');
  if (hui.isString(this.options.value)) {
    this.value = parseInt(this.options.value,10);
  } else {
    this.value = this.options.value;
  }
  if (isNaN(this.value)) {
    this.value = null;
  }
  hui.ui.extend(this);
  this._addBehavior();
};

/** Creates a new number field */
hui.ui.NumberInput.create = function(o) {
  o.element = hui.build('span',{
    'class':'hui_numberinput',
    html:'<input class="hui_textinput" type="text" value="'+(o.value!==undefined ? o.value : '0')+'"/><a class="hui_numberinput_up"></a><a class="hui_numberinput_down"></a>'
  });
  return new hui.ui.NumberInput(o);
};

hui.ui.NumberInput.prototype = {
  _addBehavior : function() {
    var e = this.element;
    hui.listen(this.input,'focus',this._onFocus.bind(this));
    hui.listen(this.input,'blur',this._onBlur.bind(this));
    hui.listen(this.input,'keyup',this._onKey.bind(this));
    hui.listen(this.up,'mousedown',this.upEvent.bind(this));
    //hui.listen(this.up,'dblclick',this.upEvent.bind(this));
    hui.listen(this.down,'mousedown',this.downEvent.bind(this));
    //hui.listen(this.down,'dblclick',this.upEvent.bind(this));
  },
  _onBlur : function() {
    this._updateField();
    if (this.sliderPanel) {
      this.sliderPanel.hide();
    }
  },
  _onFocus : function() {
    this._showSlider();
    this._updateSlider();
  },
  _onKey : function(e) {
    e = e || window.event;
    if (e.keyCode == 38) {
      hui.stop(e);
      this.upEvent();
    } else if (e.keyCode == 40) {
      this.downEvent();
    } else {
      var parsed = parseFloat(this.input.value,10);
      if (!isNaN(parsed)) {
        this._setLocalValue(parsed,true);
      } else {
        this._setLocalValue(null,true);
      }
    }
  },
  /** @private */
  downEvent : function(e) {
    hui.stop(e);
    if (this.value===null) {
      this._setLocalValue(this.options.min,true);
    } else {
      this._setLocalValue(this.value-this.options.tickSize,true);
    }
    this._updateField();
  },
  /** @private */
  upEvent : function(e) {
    hui.stop(e);
    this._setLocalValue(this.value+this.options.tickSize,true);
    this._updateField();
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
  /** Sets the value */
  setValue : function(value) {
    if (value===null || value===undefined) {
      this._setLocalValue(null,false);
    } else {
      value = parseFloat(value,10);
      if (!isNaN(value)) {
        this._setLocalValue(value,false);
      }
    }
    this._updateField();
  },
  _updateField : function() {
    this.input.value = this.value===null || this.value===undefined ? '' : this.value;
  },
  _setLocalValue : function(value,fire) {
    var orig = this.value;
    if (value===null || value===undefined && this.options.allowNull) {
      this.value = null;
    } else {
      value = this._getValueWithinRange(value);
      this.value = this._round(value);
    }
    if (fire && orig!==this.value) {
      this.fireValueChange();
    }
    this._updateSlider();
  },
  _round : function(value) {
    if (this.options.decimals!==undefined) {
      var x = Math.pow(10,this.options.decimals);
      value = Math.round(value * x) / x;
    }
    return value;
  },
  /** Resets the field */
  reset : function() {
    if (this.options.allowNull) {
      this.value = null;
    } else {
      this.value = this._getValueWithinRange(0);
    }
    this._updateField();
  },
  _getValueWithinRange : function(value) {
    if (hui.isDefined(this.options.min)) {
      value = Math.max(value,this.options.min);
    }
    if (hui.isDefined(this.options.max)) {
      value = Math.min(value,this.options.max);
    }
    return value;
  },
  _onSliderChange : function(value) {
    var conv = this.options.min+(this.options.max-this.options.min)*value;
    this._setLocalValue(conv,true);
    this._updateField();
  },
  _showSlider : function() {
    if (this.options.min===undefined || this.options.max===undefined) {
      return;
    }
    if (!this.sliderPanel) {
      this.sliderPanel = hui.ui.BoundPanel.create({variant:'light'});
      this.slider = hui.ui.Slider.create({width:200});
      this.slider.element.style.margin='0 3px';
      this.slider.listen({$valueChanged : this._onSliderChange.bind(this)});
      this.sliderPanel.add(this.slider);
    }
    this.sliderPanel.position({element:this.element,position:'vertical'});
    this.sliderPanel.show();
  },
  _updateSlider : function() {
    if (this.slider) {
      this.slider.setValue((this.value -this.options.min) / (this.options.max-this.options.min));
    }
  },
  /** @private */
  $$parentMoved : function() {
    if (this.sliderPanel && this.sliderPanel.isVisible()) {
      this.sliderPanel.position({element:this.element,position:'vertical'});
      this.sliderPanel.show();
    }
  }
};

///////////////////////// Text /////////////////////////

/**
 * A text field
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  key : «String»,
 *  maxHeight : «<strong>100</strong> | integer»,
 *  animateUserChange : «<strong>true</strong> | false»
 * }
 *
 * <strong>Events:</strong>
 * $valueChanged(value) - When the value of the field is changed by the user
 * @constructor
 */
hui.ui.TextInput = function(options) {
  this.options = hui.override({key:null,lines:1,maxHeight:100,animateUserChange:true,submitOnEnter:null},options);
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
  this.input = this.element;
  this.multiline = this.input.tagName.toLowerCase() == 'textarea';
  this.placeholder = hui.get.firstByClass(this.element,'hui_field_placeholder');
  this.value = this.input.value;
  this.modified = false;
  this._attach();
};

/**
 * Creates a new text field
 * <pre><strong>options:</strong> {
 *  value : «String»,
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
hui.ui.TextInput.create = function(options) {
  options = hui.override({lines:1},options);
  var node,input;
  if (options.lines>1 || options.multiline) {
    input = hui.build('textarea',
      {'class':'hui_textinput','rows':options.lines}
    );
  } else {
    input = hui.build('input',{'class':'hui_textinput'});
    if (options.secret) {
      input.setAttribute('type','password');
    }
  }
  if (options.testName) {
    input.setAttribute('data-test', options.testName);
  }
  if (options.large) {
    hui.cls.add(input, 'hui-large');
  }
  if (options.autocomplete) {
    input.setAttribute('autocomplete', options.autocomplete);
  }
  if (options.value!==undefined) {
    input.value=options.value;
  }
  options.element = input;
  return new hui.ui.TextInput(options);
};

hui.ui.TextInput.prototype = {
  _attach : function() {
    if (this.placeholder || this.input.type=='password') {
      var self = this;
      hui.ui.onReady(function() {
        window.setTimeout(function() {
          self.value = self.input.value;
          self._updateClass();
        }, 500);
      });
    }
    hui.ui.addFocusClass({
      element: this.input,
      classElement: this.element,
      'class': 'hui_field_focused',
      widget: this
    });
    hui.listen(this.input, 'keyup', this._onKeyUp.bind(this));
    hui.listen(this.input, 'keydown', this._onKeyDown.bind(this));
    hui.listen(this.input, 'input', this._onKeyUp.bind(this));
    hui.listen(this.input, 'change', this._onChange.bind(this));
    var p = this.element.getElementsByTagName('em')[0];
    if (p) {
      this._updateClass();
      hui.listen(p, 'mousedown', function() {
        window.setTimeout(function() {
          this.input.focus();
          this.input.select();
        }.bind(this));
      }.bind(this));
      hui.listen(p, 'mouseup', function() {
        this.input.focus();
        this.input.select();
      }.bind(this));
    }
  },
  _updateClass : function() {
    hui.cls.set(this.element,'hui_field_dirty',this.value.length>0);
  },
  _onKeyDown : function(e) {
    if (e.keyCode === 13) {
      if (this.multiline && !(e.ctrlKey || e.metaKey)) {
        return;
      }
      hui.stop(e);
      this.fire('submit');
      var form = hui.ui.getAncestor(this,'hui_form');
      if (form) {form.submit();}
    }
  },
  _onChange : function(e) {
    this._onKeyUp(e);
  },
  _onKeyUp : function(e) {
    if (this.input.value==this.value) {return;}
    this.value=this.input.value;
    this._updateClass();
    this._expand(this.options.animateUserChange);
    hui.ui.callAncestors(this,'childValueChanged',this.input.value);
    this.fire('valueChanged',this.input.value);
    this.modified = true;
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
  isModified : function() {
      return this.modified;
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
    this.modified = false;
  },
  /** Get the value
   * @returns {String} The value
   */
  getValue : function() {
    return this.input.value;
  },
  /** Check if the value is empty ('' / the empty string)
   * @returns {Boolean} True if the value the empty string
   */
  isEmpty : function() {
    return this.input.value === '';
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
      return;
    }
    var textHeight = this._getTextAreaHeight(this.input);
    textHeight = Math.min(textHeight,this.options.maxHeight);
    if (animate) {
      hui.animate({
        node : this.input,
        duration : 300,
        css : {height:textHeight+'px'},
        ease : hui.ease.slowFastSlow
      });
    } else {
      this.input.style.height = textHeight+'px';
    }
  },
  _getTextAreaHeight : function(input) {
    var t = this.textAreaDummy;
    if (!t) {
      t = this.textAreaDummy = hui.build('div.hui_textinput_dummy', {parent: document.body});
    }
    var html = input.value;
    if (html[html.length-1]==='\n') {
      html+='x';
    }
    html = hui.string.escape(html).replace(/\n/g,'<br/>');
    t.innerHTML = html;
    t.style.width = input.clientWidth + 'px';
    return t.clientHeight + 2;
  }
};

/** @constructor */
hui.ui.Rendering = function(options) {
  this.options = hui.override({clickObjects:false},options);
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
  //hui.listen(this.element,'click',this._click.bind(this));
};

hui.ui.Rendering.prototype = {
  _click : function(e) {
    e = hui.event(e);

  },
  setContent : function(html) {
    this.element.innerHTML = html;
  }
};

hui.on(['hui.ui'], function() { hui.ui.make(

  /** @lends hui.ui.Icon.prototype */
  {
    name : 'Icon',
    /**
     * @constructs hui.ui.Icon
     * @extends hui.ui.Component
     * @param params
     * @param params.icon {String} The icon
     */
    $init : function(params) {
      this.visible = false;
      this.icon = params.icon;
      this.labeled = false;
    },
    $build : function(params) {
      return hui.ui.createIcon(params.icon, params.size, 'span');
    },
    $events : {
      //root : {click: 'click!'}
      root : {click: function() {
        this.fire('click')
      }}
    },
    /**
     * Change the icon size
     * @param size {Number} The size in pixels: 16, 32 etc.
     */
    setSize : function(size) {
      var iconNode = hui.find('span', this.element) || this.element;
      this.size = size;
      hui.ui.setIconImage(iconNode, this.icon, size);
      iconNode.className = 'hui_icon hui_icon_' + size;
      if (hui.cls.has(this.element, 'hui_icon_labeled')) {
        this.element.className = 'hui_icon_labeled hui_icon_labeled_' + size;
      }
    }
  }

);});

/////////////////////////// Color input /////////////////////////

/**
 * A component for color input
 * @constructor
 */
hui.ui.ColorInput = function(options) {
  this.options = hui.override({value:null},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.button = hui.get.firstByTag(this.element,'a');
  this.input = new hui.ui.Input({
    element : hui.get.firstByTag(this.element,'input'),
    validator : {
      validate : function(value) {
        if (hui.isBlank(value)) {
          value = '';
        } else {
          value = new hui.Color(value).toHex();
        }
        return {valid:true,value:value};
      }
    }
  });
  this.input.listen({$valueChanged:this._onInputChange.bind(this)});
  this.value = null;
  hui.ui.extend(this);
  this.setValue(this.options.value);
  this._addBehavior();
};

hui.ui.ColorInput.create = function(options) {
  options = options || {};
  var e = options.element = hui.build(
    'span', {
      'class' : 'hui_colorinput',
      html : '<input class="hui_textinput" type="text" value=""/><a tabindex="-1" class="hui_colorinput_color" href="javascript://"></a>'
    });
  return new hui.ui.ColorInput(options);
};

hui.ui.ColorInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.button, 'click',this._onButtonClick.bind(this));
  },
  _syncInput : function() {
    this.input.setValue(this.value);
  },
  _syncColorButton : function() {
    this.button.innerHTML = this.value ? '' : '?';
    this.button.style.backgroundColor = this.value ? this.value : '';
  },
  _onInputChange : function(value) {
    var changed = value!=this.value;
    this.value = value;
    this._syncColorButton();
    if (changed) {
      this._fireChange();
    }
  },
  _fireChange : function() {
    hui.ui.callAncestors(this,'childValueChanged',this.value);
    this.fire('valueChanged',this.value);
  },
  _onBlur : function() {
    hui.Color.parse(this.value);
  },
  _onButtonClick : function() {
    if (hui.window.getViewHeight() < 200) {
      this.fire('clickPicker',this.value);
      return; // TODO: mini picker
    }
    if (!this.panel) {
      this.panel = hui.ui.BoundPanel.create({modal:true});
      this.picker = hui.ui.ColorPicker.create();
      this.picker.listen(this);
      this.panel.add(this.picker);
    }
    this.panel.position(this.button);
    this.panel.show();
  },
  /** @private */
  $colorWasSelected : function(color) {
    this.panel.hide();
    this.setValue(color);
    this._fireChange();
  },

  // Public...

  getValue : function() {
    return this.value;
  },
  setValue : function(value) {
    this.value = hui.isBlank(value) ? value : new hui.Color(value).toHex();
    this._syncInput();
    this._syncColorButton();
  },
  focus : function() {
    try {
      this.input.focus();
    } catch (e) {}
  },
  reset : function() {
    this.setValue('');
  },
  getAccessories : function() {
    return this.panel ? [this.panel] : [];
  }
};

/**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.Columns = function(options) {
  this.name = options.name;
  this.options = options || {};
  this.element = hui.get(options.element);
  this.body = hui.get.firstByTag(this.element,'tr');
  hui.ui.extend(this);
};

/**
 * Creates a new Columns opject
 */
hui.ui.Columns.create = function(options) {
  options = options || {};
  options.flexible = true;
  options.element = hui.build('table',{'class' : 'hui_columns',html : '<tbody><tr></tr></tbody>'});
  return new hui.ui.Columns(options);
};

hui.ui.Columns.prototype = {
  $$layout : function() {
    if (this.options.flexible) {
      return;
    }
    this.element.style.height = hui.position.getRemainingHeight(this.element)+'px';
    var children = hui.get.children(this.element);
    var left = 0;
    for (var i=0; i < children.length; i++) {
      var child = children[i];
      var width = (this.element.clientWidth/children.length);
      child.style.width = width + 'px';
      child.style.position = 'absolute';
      child.style.marginLeft = left + 'px';
      child.style.height = this.element.clientHeight+'px';
      left+=width;
    }
  },
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
};

////////////////////////// Finder ///////////////////////////

/**
 * A "finder" for finding objects
 * @constructor
 */
hui.ui.Finder = function(options) {
  this.options = hui.override({title:'Finder',selection:{},list:{}},options);
  this.name = options.name;
  this.uploader = null; // hui.ui.Upload
  hui.ui.extend(this);
  if (options.listener) {
    this.listen(options.listener);
  }
};

/**
 * Creates a new finder
 * <pre><strong>options:</strong> {
 *  title : «String»,
 *  selection : {
 *      value : «String»,
 *      url : «String»,
 *      parameter : «String»,
 *      kindParameter : «String»
 *  },
 *  list : {
 *      url : «String»
 *  },
 *  search : {
 *      parameter : «String»
 *  },
 *  listener : {$select : function(object) {}}
 * }
 * </pre>
 */
hui.ui.Finder.create = function(options) {
  return new hui.ui.Finder(options);
};

hui.ui.Finder.prototype = {
  /** Shows the finder */
  show : function() {
    if (!this.window) {
      this._build();
    } else {
      // Refresh if re-openede
      // TODO refresh more
      if (this.list) {
        this.list.refresh();
      }
    }
    this.window.show();
  },
  hide : function() {
    if (this.window) {
      this.window.hide();
    }
  },
  clear : function() {
    this.list.clearSelection();
  },
  _build : function() {
    var win = this.window = hui.ui.Window.create({
      title : this.options.title,
      icon : 'common/search',
      width : 600,
      height : 400
    });
    win.listen({
      $userClosedWindow : function() {
        this.fire('cancel');
      }.bind(this)
    });
    if (this.options.url) {
      win.setBusy(true);
      hui.ui.request({
        url : this.options.url,
        $object : function(config) {
          hui.override(this.options,config);
          if (config.title) {
            win.setTitle(config.title);
          }
          win.setBusy(false);
          this._buildBody();
        }.bind(this)
      });
      return;
    }
    this._buildBody();
  },
  _buildBody : function() {
    var opts = this.options;
    var layout = hui.ui.Structure.create();
    this.window.add(layout);

    var left = hui.ui.Overflow.create({dynamic:true});
    layout.addLeft(left);

    var list = this.list = hui.ui.List.create();

    this.list.listen({
      $select : this._selectionChanged.bind(this)
    });

    var searchField, bar;

    if (opts.search || opts.gallery) {
      bar = hui.ui.Bar.create({
        variant: 'layout'
      });
      layout.addCenter(bar);
      if (opts.search) {
        searchField = hui.ui.SearchField.create({
          expandedWidth: 200
        });
        searchField.listen({
          $valueChanged: function() {
            list.resetState();
          }
        });
        bar.addToRight(searchField);
      }
    }
    var right = hui.ui.Overflow.create({dynamic:true});
    layout.addCenter(right);
    right.add(this.list);


    this.selection = hui.ui.Selection.create({value : opts.selection.value});
    this.selection.listen({
      $select : function() {
        list.resetState();
      }
    });

    if (opts.selection.items) {
      //this.selection.setObjects(opts.selection.items);
      this.selection.addItems({items: opts.selection.items});
    }
    var selectionSource;
    if (opts.selection.url) {
      selectionSource = new hui.ui.Source({url : opts.selection.url});
      this.selection.addItems({source:selectionSource});
    }
    left.add(this.selection);

    var parameters = [];
    if (opts.list.url) {
      parameters = [
        {key:'windowSize',value:10},
        {key:'windowPage',value:'@'+list.name+'.window.page'},
        {key:'direction',value:'@'+list.name+'.sort.direction'},
        {key:'sort',value:'@'+list.name+'.sort.key'}
      ];
    }
    if (opts.selection.parameter) {
      parameters.push({
        key:opts.selection.parameter || 'text',value:'@'+this.selection.name+'.value'
      });
    }
    if (opts.selection.kindParameter) {
      parameters.push({
        key:opts.selection.kindParameter || 'text',value:'@'+this.selection.name+'.kind'
      });
    }

    if (opts.search && searchField) {
      parameters.push({key:opts.search.parameter || 'text',value:'@'+searchField.name+'.value'});
    }
    if (opts.list.pageParameter) {
      parameters.push({key:opts.list.pageParameter,value:'@'+list.name+'.window.page'});
    }

    var listSource = opts.list.source;
    if (listSource) {
      for (var i=0; i < parameters.length; i++) {
        listSource.addParameter(parameters[i]);
      }
    }
    if (opts.list.url) {
      listSource = new hui.ui.Source({
        url : opts.list.url,
        parameters : parameters
      });
    }
    this.list.setSource(listSource);

    if (opts.gallery) {
      var viewChanger = hui.ui.Segmented.create({
        value: 'gallery',
        items: [{
          icon: 'view/list',
          value: 'list'
        }, {
          icon: 'view/gallery',
          value: 'gallery'
        }]
      });
      viewChanger.listen({
        $valueChanged: this.changeView.bind(this)
      });
      bar.add(viewChanger);
      var gallerySource = new hui.ui.Source({
        url: opts.gallery.url,
        parameters: parameters
      });
      var gallery = this.gallery = hui.ui.Gallery.create({
        source: gallerySource
      });
      this.list.hide();
      right.add(gallery);
      gallery.listen({
        $select: function(value) {
          this.fire('select', gallery.getFirstSelection());
        }.bind(this)
      });
      gallerySource.refresh();
    }
    if (opts.upload && hui.ui.Upload.HTML5.support().supported) {
      var uploadButton = hui.ui.Button.create({
        text: 'Add...',
        small: true
      });
      uploadButton.listen({
        $click: this._showUpload.bind(this)
      });
      bar.add(uploadButton);
    }
    if (opts.creation) {
      bar.add(hui.ui.Button.create({
        text: opts.creation.button || 'Add...',
        small: true,
        listen : {
          $click:  this._showCreation.bind(this)
        }
      }));
    }
    if (selectionSource) {
      selectionSource.refresh();
    }
    hui.ui.reLayout();
  },
  changeView : function(value) {
    if (value=='gallery') {
      this.list.hide();
      this.gallery.show();
    } else {
      this.list.show();
      this.gallery.hide();
    }
  },

  _selectionChanged : function() {
    var row = this.list.getFirstSelection();
    if (row) {
      this.fire('select',row);
    }
  },

  _showUpload : function(button) {
    if (!this.uploadPanel) {
      var options = this.options.upload;
      var panel = this.uploadPanel = hui.ui.BoundPanel.create({padding:5,width:300,modal:true});
      this.uploader = hui.ui.Upload.create({
        url : options.url,
        placeholder : options.placeholder,
        chooseButton : {en:'Choose file...',da:'Vælg fil...'}
      });
      this.uploader.listen({
        $uploadDidComplete : function(file) {
          this._uploadSuccess(hui.string.fromJSON(file.request.responseText));
        }.bind(this)
      });
      panel.add(this.uploader);
    }
    this.uploadPanel.show({target:button});
  },
  _uploadSuccess : function(obj) {
    this.uploadPanel.hide();
    this.fire('select',obj);
  },
  _showCreation : function(button) {
    if (!this._createPanel) {
      var form = this._createForm = hui.ui.Form.create({listen:{$submit:this._create.bind(this)}});
      form.buildGroup({above:true},this.options.creation.formula);
      var panel = this._createPanel = hui.ui.BoundPanel.create({padding:10,width:300,modal:true});
      panel.add(form);
      var buttons = hui.ui.Buttons.create();
      buttons.add(hui.ui.Button.create({
        text:'Cancel',
        listen: { $click : function() {
          form.reset();
          panel.hide();
        } }
      }));
      buttons.add(hui.ui.Button.create({text:'Create',highlighted:true,submit:true}));
      form.add(buttons);
    }
    this._createPanel.show({target:button});
    this._createForm.focus();
  },
  _create : function(form) {
    var values = this._createForm.getValues();
    this._createForm.reset();
    this._createPanel.hide();
    this.window.setBusy(true);
    var self = this;
    hui.ui.request({
      url : this.options.creation.url,
      parameters : values,
      $object : function(obj) {
        self.fire('select',obj);
      },
      $failure : function() {

      },
      $finally : function() {
        self.window.setBusy(false);
      }
    });
  }
};

if (window.define) {define('hui.ui.Finder',hui.ui.Finder);}

/**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.Structure = function(options) {
  this.name = options.name;
  this.options = options || {};
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Structure.create = function(options) {
  options = hui.override({},options);

  options.element = hui.dom.parse('<div class="hui_structure">'+
    '<div class="hui_structure_middle">'+
    '<div class="hui_structure_left hui_context_sidebar"></div>'+
    '<div class="hui_structure_center"></div>'+
    '</div>'+
    '</div>');
  return new hui.ui.Structure(options);
};

hui.ui.Structure.prototype = {

  addLeft : function(widget) {
    var tbody = hui.get.firstByClass(this.element,'hui_structure_left');
    tbody.appendChild(widget.element);
  },

  addCenter : function(widget) {
    var tbody = hui.get.firstByClass(this.element,'hui_structure_center');
    tbody.appendChild(widget.element);
  },
  $$layout : function() {
    var t = hui.get.firstByClass(this.element,'hui_structure_top');
    var b = hui.get.firstByClass(this.element,'hui_structure_bottom');
    var m = hui.get.firstByClass(this.element,'hui_structure_middle');
    if (m) {
      m.style.top = (t ? t.clientHeight+2 : 0)+'px';
      m.style.bottom = (b ? b.clientHeight+2 : 0)+'px';
    }
  }
};

/**
 * @constructor
 * @param {Object} options The options : {modal:false}
 */
hui.ui.Slider = function(options) {
  this.options = hui.override({value:0,min:0,max:1},options);
  this.name = options.name;

  this.element = hui.get(options.element);
  this.handler = hui.get.firstByTag(options.element,'a');
  hui.ui.extend(this);
  this.position = 0;
  this.value = 0;
  this.setValue(this.options.value);
  this._addBehavior();
};

hui.ui.Slider.create = function(options) {
  options = hui.override({},options);
  var e = options.element = hui.build('span',{'class':'hui_slider',html:'<a href="javascript://" class="hui_slider_knob"></a><span class="hui_slider_bar"></span>'});
  if (options.width) {
    e.style.width = options.width+'px';
  }
  return new hui.ui.Slider(options);
};

hui.ui.Slider.prototype = {
  _addBehavior : function() {
    hui.drag.register({
      element : this.handler,
      onBeforeMove : this._onBeforeMove.bind(this),
      onMove : this._onMove.bind(this),
      onAfterMove : this._onAfterMove.bind(this)
    });
  },
  _onBeforeMove : function(event) {
    this.dragging = true;
    var pos = hui.position.get(this.handler);
    this.dragInfo = {
      left : hui.position.getLeft(this.element),
      diff : event.getLeft()-pos.left,
      max : this.element.clientWidth-this.handler.clientWidth-5
    };
    hui.cls.add(document.body,'hui_slider-grabbing');
    hui.cls.add(this.handler,'hui_slider-grabbing');
  },
  _onMove : function(event) {
    var left = event.getLeft()-this.dragInfo.left;
    left = (left-this.dragInfo.diff);
    left = Math.max(left,5);
    left = Math.min(left,this.dragInfo.max);
    this.handler.style.left = left+'px';
    this._setPosition((left-5)/(this.dragInfo.max-5));
  },
  _onAfterMove : function() {
    this.dragging = false;
    hui.cls.remove(document.body,'hui_slider-grabbing');
    hui.cls.remove(this.handler,'hui_slider-grabbing');
    this.fire('valueChangedEnd',this.position);
  },

  _setPosition : function(pos) {
    this.position = pos;
    this.fire('valueChanged',pos);
  },
  setValue : function(value) {
    var pos = Math.max(0,Math.min(value,1));
    var width = this.element.clientWidth-10-this.handler.clientWidth;
    if (!this.dragging) {
      hui.animate({
        node : this.handler,
        css : { left: (pos*width+5)+'px'},
        duration : 200,
        ease : hui.ease.fastSlow
      });
    }
    this.position = this.value = pos;
  }
};

/**
 * A code editor
 * @constructor
 */
hui.ui.CodeInput = function(options) {
  this.options = hui.override({},options);
  this.name = options.name;
  var e = this.element = hui.get(options.element);
  this.textarea = hui.get.firstByTag(e,'textarea');
  if (options.value) {
    this.textarea.value = options.value;
  }
  this.value = this.textarea.value;
  hui.ui.extend(this);
  this._addBehavior();
};

hui.ui.CodeInput.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{
    'class' : 'hui_codeinput',
    html : '<textarea class="hui_codeinput_input" spellcheck="false"></textarea>'
  });
  if (options.height) {
    options.element.style.height = hui.style.length(options.height);
  }
  return new hui.ui.CodeInput(options);
};

hui.ui.CodeInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.textarea, 'keydown', this._onKeyDown.bind(this));
    hui.listen(this.textarea, 'keyup', this._onKeyUp.bind(this));
  },

  getValue : function() {
    return this.textarea.value;
  },
  setValue : function(value) {
    this.textarea.value = value;
    this.value = value;
  },
  addLine : function(line) {
    if (this.value==='') {
      this.setValue(line);
    } else {
      this.setValue(this.value+"\n"+line);
    }
  },
  reset : function() {
    this.setValue('');
  },
  _onKeyUp : function() {
    if (this.textarea.value !== this.value) {
      this.value = this.textarea.value;
      this.fireValueChange();
    }
  },

  _onKeyDown: function(evt) {
    var tab = String.fromCharCode(9);
    var e = window.event || evt;
    var t = e.target ? e.target : e.srcElement ? e.srcElement : e.which;
    var scrollTop = t.scrollTop;
    var k = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    var ch, a, i, rt, nr;
    if (k == 9 && !e.ctrlKey && !e.altKey) {
      if (t.setSelectionRange) {
        e.preventDefault();
        var ss = t.selectionStart;
        var se = t.selectionEnd;
        // Multi line selection
        if (ss != se && t.value.slice(ss, se).indexOf("\n") != -1) {
          if (ss > 0) {
            ss = t.value.slice(0, ss).lastIndexOf("\n") + 1;
          }
          var pre = t.value.slice(0, ss);
          var sel = t.value.slice(ss, se);
          var post = t.value.slice(se, t.value.length);
          if (e.shiftKey) {
            a = sel.split("\n");
            for (i = 0; i < a.length; i++) {
              if (a[i].slice(0, 1) == tab || a[i].slice(0, 1) == ' ') {
                a[i] = a[i].slice(1, a[i].length);
              }
            }
            sel = a.join("\n");
            t.value = pre.concat(sel, post);
            t.selectionStart = ss;
            t.selectionEnd = pre.length + sel.length;
          } else {
            sel = sel.replace(/\n/g, "\n" + tab);
            pre = pre.concat(tab);
            t.value = pre.concat(sel, post);
            t.selectionStart = ss;
            t.selectionEnd = se + (tab.length * sel.split("\n").length);
          }
        }
        // Single line selection
        else {
          if (e.shiftKey) {
            var brt = t.value.slice(0, ss);
            ch = brt.slice(brt.length - 1, brt.length);
            if (ch == tab || ch == ' ') {
              t.value = brt.slice(0, brt.length - 1).concat(t.value.slice(ss, t.value.length));
              t.selectionStart = ss - 1;
              t.selectionEnd = se - 1;
            }
          } else {
            t.value = t.value.slice(0, ss).concat(tab).concat(t.value.slice(ss, t.value.length));
            if (ss == se) {
              t.selectionStart = t.selectionEnd = ss + tab.length;
            } else {
              t.selectionStart = ss + tab.length;
              t.selectionEnd = se + tab.length;
            }
          }
        }
      } else {
        e.returnValue = false;
        var r = document.selection.createRange();
        var br = document.body.createTextRange();
        br.moveToElementText(t);
        br.setEndPoint("EndToStart", r);
        //Single line selection
        if (r.text.length === 0 || r.text.indexOf("\n") === -1) {
          if (e.shiftKey) {
            ch = br.text.slice(br.text.length - 1, br.text.length);
            if (ch == tab || ch == ' ') {
              br.text = br.text.slice(0, br.text.length - 1);
              r.setEndPoint("StartToEnd", br);
            }
          } else {
            var rtn = t.value.slice(br.text.length, br.text.length + 1);
            if (rtn != r.text.slice(0, 1)) {
              br.text = br.text.concat(rtn);
            }
            br.text = br.text.concat(tab);
          }
          nr = document.body.createTextRange();
          nr.setEndPoint("StartToEnd", br);
          nr.setEndPoint("EndToEnd", r);
          nr.select();
        }
        //Multi line selection
        else {
          var p;
          if (e.shiftKey) {
            a = r.text.split("\r\n");
            rt = t.value.slice(br.text.length, br.text.length + 2);
            if (rt == r.text.slice(0, 2)) {
              p = br.text.lastIndexOf("\r\n".concat(tab));
              if (p != -1) {
                br.text = br.text.slice(0, p + 2).concat(br.text.slice(p + 3, br.text.length));
              }
            }
            for (i = 0; i < a.length; i++) {
              ch = a[i].length > 0 && a[i].slice(0, 1);
              if (ch == tab || ch == ' ') {
                a[i] = a[i].slice(1, a[i].length);
              }
            }
            r.text = a.join("\r\n");
          } else {
            if (br.text.length > 0) {
              rt = t.value.slice(br.text.length, br.text.length + 2);
              if (rt != r.text.slice(0, 2)) {
                r.text = tab.concat(r.text.split("\r\n").join("\r\n".concat(tab)));
              } else {
                var selectionStart; // TODO: what is this about?
                p = br.text.slice(0, selectionStart).lastIndexOf("\r\n") + 2;
                br.text = br.text.slice(0, p).concat(tab, br.text.slice(p, br.text.length));
                r.text = r.text.split("\r\n").join("\r\n".concat(tab));
              }
            } else {
              r.text = tab.concat(r.text).split("\r\n").join("\r\n".concat(tab));
            }
          }
          nr = document.body.createTextRange();
          nr.setEndPoint("StartToEnd", br);
          nr.setEndPoint("EndToEnd", r);
          nr.select();
        }
      }
    }
    t.scrollTop = scrollTop;
  }

};

/**
 * An input for a link
 * @constructor
 */
hui.ui.LinkInput = function(options) {
  var e = this.element = hui.get(options.element);
  this.options = hui.override({types:[]},options);
  this.types = this.options.types;
  this.name = options.name;
  this.value = options.value;
  this.input = new hui.ui.Input({element:hui.get.firstByTag(e,'input')});
  this.input.listen({
    $valueChanged : this._onInputChange.bind(this)
  });
  this.object = hui.get.firstByClass(e,'hui_linkinput_object');
  this.dropdown = new hui.ui.DropDown({
    element : hui.get.firstByClass(e,'hui_dropdown'),
    value : 'none',
    items : this._buildDropDownOptions(),
    listener : {
      $valueChanged : this._onDropDownChange.bind(this)
    }
  });
  hui.ui.extend(this);
  this._addBehavior();
};

hui.ui.LinkInput.prototype = {
  _addBehavior : function() {
    //hui.listen(this.textarea,'keydown',this._onKeyDown.bind(this));
    //hui.listen(this.textarea,'keyup',this._onKeyUp.bind(this));
  },
  _buildDropDownOptions : function() {
    var options = [{value:'none',text:'Intet link'}];
    for (var i=0; i < this.options.types.length; i++) {
      var type = this.options.types[i];
      options.push({value:type.key,text:type.label});
    }
    return options;
  },
  _getType : function(key) {
    for (var i=0; i < this.types.length; i++) {
      if (this.types[i].key==key) {
        return this.types[i];
      }
    }
  },
  _onInputChange : function(value) {
    this.value = {type:this.dropdown.getValue(),value:value};
    this._updateUI();
    this.fireValueChange();
  },
  _onDropDownChange : function(value) {
    this._closeAllFinders();
    var type = this._getType(value);
    if (!type) {
      this.input.element.style.display = this.object.style.display = 'none';
      return;
    }
    this.input.element.style.display = !type.finderOptions ? '' : 'none';
    this.object.style.display = type.finderOptions ? '' : 'none';
    if (type.finderOptions) {
      if (!type._finder) {
        type._finder = hui.ui.Finder.create(
          type.finderOptions
        );
        type._finder.listen({
          $select : function(object) {
            this._selectObject(type,object);
          }.bind(this)
        });
      }
      type._finder.show();
      this.value = {type:value,value:null};
    } else  {
      this.input.focus();
      this.input.setValue('');
      this.value = {type:value,value:''};
    }
    this._updateUI();
    this.fireValueChange();
  },
  _closeAllFinders : function() {
    for (var i=0; i < this.types.length; i++) {
      if (this.types[i]._finder) {
        this.types[i]._finder.hide();
      }
    }
  },
  _selectObject : function(type,object) {
    this.value = {type : type.key, value : object};
    this._updateUI();
    this._closeAllFinders();
    this.fireValueChange();
  },
  _updateUI : function() {
    var value = this.value;
    if (!hui.isDefined(value)) {
      this.dropdown.setValue('none');
      this.input.element.style.display = this.object.style.display = 'none';
    } else {
      var type = this._getType(value.type);
      if (type) {
        this.dropdown.setValue(value.type);
        this.input.element.style.display = !type.finderOptions ? '' : 'none';
        this.object.style.display = type.finderOptions ? '' : 'none';
        if (!type.finderOptions) {
          this.input.value = value.value;
        } else {
          var title = hui.get.firstByClass(this.element,'hui_linkinput_title'),
            icon = hui.get.firstByClass(this.element,'hui_linkinput_icon');
          if (!value.value) {
            this.object.style.display = 'none';
          } else {
            this.object.style.display = '';
            if (hui.isDefined(value.value.title)) {
              hui.dom.setText(title,hui.string.shorten(value.value.title,40));
            } else {
              this._setBusy(true);
              hui.ui.request({
                url : type.lookupUrl,
                parameters : {id:value.value.id},
                $object : function(obj) {
                  hui.dom.setText(title,hui.string.shorten(obj.title,40));
                  this._setBusy(false);
                }.bind(this),
                $failure : function() {
                  hui.dom.setText(title,'!!Error');
                  this._setBusy(false);
                }.bind(this)
              });
            }
            icon.style.backgroundImage = 'url(\''+hui.ui.getIconUrl(type.icon,16)+'\')';
          }
        }
      }
    }
  },
  _setBusy : function(busy) {
    this.busy = busy;
    hui.cls.set(this.element,'hui_linkinput_busy',busy);
  },


  getValue : function() {
    return this.value;
  },
  setValue : function(value) {
    this.value = value;
    this._updateUI();
  },
  reset : function() {
    this.setValue(null);
  }
};

/**
 * A component for font input
 * @constructor
 */
hui.ui.FontInput = function(options) {
  this.options = hui.override({value:null},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.button = hui.get.firstByClass(this.element,'hui_fontinput');
  this.dropdown = new hui.ui.DropDown({
    element : hui.get.firstByClass(this.element,'hui_dropdown'),
    items : [{text:'',value:''}].concat(hui.ui.FontPicker.fonts),
    listener : this
  });
  this.value = null;
  hui.ui.extend(this);
  this.setValue(this.options.value);
  this._addBehavior();
};

hui.ui.FontInput.create = function(options) {
  options = options || {};
  var e = options.element = hui.build('span',{'class':'hui_colorinput',html:'<span class="hui_field_top"><span><span></span></span></span><span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content"><span class="hui_field_singleline"><input type="text" value=""/></span></span></span></span><span class="hui_field_bottom"><span><span></span></span></span><a tabindex="-1" class="hui_colorinput" href="javascript://"></a>'});

  return new hui.ui.ColorInput(options);
};

hui.ui.FontInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.button, 'click',this._onButtonClick.bind(this));
  },
  _syncInput : function() {
    this.dropdown.setValue(this.value);
  },
  _fireChange : function() {
    hui.ui.callAncestors(this,'childValueChanged',this.value);
    this.fire('valueChanged',this.value);
  },
  _onBlur : function() {
    hui.Color.parse(this.value);
  },
  _onButtonClick : function() {
    if (hui.window.getViewHeight()<200) {
      this.fire('clickPicker',this.value);
      return; // TODO: mini picker
    }
    if (!this.panel) {
      this.panel = hui.ui.BoundPanel.create({modal:true,variant:'light'});
      this.picker = hui.ui.FontPicker.create();
      this.picker.listen(this);
      this.panel.add(this.picker);
    }
    this.panel.position(this.button);
    this.panel.show();
  },
  /** @private */
  $select : function(font) {
    this.panel.hide();
    this.setValue(font.value);
    this._fireChange();
  },
  $valueChanged : function(value) {
    this.setValue(value);
    this._fireChange();
  },

  // Public...

  getValue : function() {
    return this.value;
  },
  setValue : function(value) {
    this.value = value;
    this._syncInput();
    this.button.style.fontFamily = value;
  },
  focus : function() {
    try {
      this.input.focus();
    } catch (e) {}
  },
  reset : function() {
    this.setValue('');
  },
  getAccessories : function() {
    var a = [];
    if (this.panel) a.push(this.panel);
    if (this.picker) a.push(this.picker);
    return a;
  }
};

/**
  @constructor
  @param options The options (non)
*/
hui.ui.FontPicker = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  this.fonts = options.fonts.concat(options.additionalFonts);
  this.previews = {};
  this.options = options || {};
  hui.override(this.options,options);
  hui.ui.extend(this);
  if (this.options.listener) {
    this.listen(this.options.listener);
  }
  this._addBehavior();
};

hui.ui.FontPicker.fonts =[
  {text:'Verdana',value:'Verdana,sans-serif'},
  {text:'Tahoma',value:'Tahoma,Geneva,sans-serif'},
  {text:'Trebuchet',value:'Trebuchet MS,Helvetica,sans-serif'},
  {text:'Geneva',value:'Geneva,Tahoma,sans-serif'},
  {text:'Helvetica',value:'Helvetica,Arial,sans-serif'},
  {text:'Helvetica Neue',value:'Helvetica Neue,Helvetica,Arial,sans-serif'},
  {text:'Arial',value:'Arial,Helvetica,sans-serif'},
  {text:'Arial Black',value:'Arial Black,Gadget,Arial,sans-serif'},
  {text:'Impact',value:'Impact,Charcoal,Arial Black,Gadget,Arial,sans-serif'},

  {text:'Times New Roman',value:'Times New Roman,Times,serif'},
  {text:'Times',value:'Times,Times New Roman,serif'},
  {text:'Book Antiqua',value:'Book Antiqua,Palatino,serif'},
  {text:'Palatino',value:'Palatino,Book Antiqua,serif'},
  {text:'Georgia',value:'Georgia,Book Antiqua,Palatino,serif'},
  {text:'Garamond',value:'Garamond,Times New Roman,Times,serif'},

  {text:'Comic Sans',value:'Comic Sans MS,cursive'},

  {text:'Courier New',value:'Courier New,Courier,monospace'},
  {text:'Courier',value:'Courier,Courier New,monospace'},
  {text:'Lucida Console',value:'Lucida Console,Monaco,monospace'},
  {text:'Monaco',value:'Monaco,Lucida Console,monospace'}
];

hui.ui.FontPicker.create = function(options) {
  options = hui.override({
    fonts : hui.ui.FontPicker.fonts,
    additionalFonts : []
  },options);

  var fonts = options.fonts.concat(options.additionalFonts);

  var element = options.element = hui.build('div',{
    'class' : 'hui_fontpicker'
    });
  for (var i=0; i < fonts.length; i++) {
    var font = fonts[i];
    var node = hui.build('div',{parent:element,'class':'hui_fontpicker_item',text:font.text,style:'font-family:'+font.value+';'});
    var icon = hui.ui.createIcon('monochrome/info',16,'a');
    node.appendChild(icon);
    node.huiIndex = i;
  }
  return new hui.ui.FontPicker(options);
};

hui.ui.FontPicker.prototype = {
  _addBehavior : function() {
    hui.listen(this.element,'click',this._onClick.bind(this));
  },
  _onClick : function(e) {
    e = hui.event(e);
    var node = e.findByClass('hui_fontpicker_item');
    if (node) {
      var a = e.findByClass('hui_icon');
      var font = this.fonts[node.huiIndex];
      if (a) {
        this._buildPreview(font);
      } else {
        this.fire('select',font);
      }
    }
  },
  /** @private */
  $visibilityChanged : function() {
    if (!hui.dom.isVisible(this.element)) {
      hui.each(this.previews,function(key,value) {
        value.hide();
      });
    }
  },
  _buildPreview : function(font) {
    if (this.previews[font.text]) {
      this.previews[font.text].show();
      return;
    }
    var e = hui.build('div',{className:'hui_fontpicker_example',style:'font-family:'+font.value+';'});

    var weights = [100,200,300,'normal',500,600,'bold','bolder'];
    var sizes = ['9pt','10pt','11pt','12pt','13pt','14pt','16px','18pt'];

    var html = '<h1>'+font.text+'</h1>';

    html+='<p style="font-size: 12px;">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';

    html+='<table>';
    html+='<thead><tr><th></th>';
    var i;
    for (i=0; i < weights.length; i++) {
      html+='<th>'+weights[i]+'</th>';
    }
    html+='</tr></thead>';

    html+='<tbody>';
    for (i=0; i < sizes.length; i++) {
      html+='<tr><th>'+sizes[i]+'</th>';
      for (var j=0; j < weights.length; j++) {
        html+='<td style="font-weight: '+weights[j]+'; font-size:'+sizes[i]+';">Pack my box with five dozen liquor jugs</td>';
      }
    }
    html+='</tbody>';
    e.innerHTML = html;
    var win = hui.ui.Window.create({title:font.text,padding:3});
    win.add(e);
    this.previews[font.text] = win;
    win.show();
  },
  getAccessories : function() {
    return this.previews;
  }
};

/**
 * A bar
 * <pre><strong>options:</strong> {
 *  element : «Element»,
 *  name : «String»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Split = function(options) {
  this.options = hui.override({},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.rows = hui.get.children(this.element);
  this.handles = [];
  this.sizes = [];
  for (var i=0; i < this.rows.length; i++) {
    if (i>0) {
      this.handles.push(hui.build('div',{'class':'hui_split_handle',parent:this.element}));
    }
  }
  this._buildSizes();
  hui.ui.extend(this);
  this._attach();
};

hui.ui.Split.prototype = {
  _attach : function() {
    hui.each(this.handles,function(handle) {
      hui.drag.register({
        element : handle,
        //onStart : this._onDragStart.bind(this) ,
        onBeforeMove : function(e) {
          hui.log('before');
        },
        onMove : function(e) {
          hui.log('moving');
        }
        //onMove : this._onMove.bind(this),
        //onAfterMove : this._onAfterMove.bind(this)
      });
    });
  },

  _buildSizes : function() {
    this.sizes = [];
    var i;
    for (i=0; i < this.rows.length; i++) {
      var row = this.rows[i],
        str = row.getAttribute('data-height');
      if (str) {
        this.sizes.push(this._getSize(str));
      } else {
        this.sizes.push(0);
      }
    }
    var total = 0,
      unspecified = 0;
    for (i=0; i < this.sizes.length; i++) {
      total += this.sizes[i];
      unspecified += this.sizes[i] === 0 ? 1 : 0;
    }
    var rest = (1 - total) / unspecified;
    for (i=0; i < this.sizes.length; i++) {
      if (this.sizes[i] === 0) {
        this.sizes[i] = rest;
      }
    }
  },
  _getSize : function(str) {
    if (str.indexOf('%')!=-1) {
      return parseInt(str)/100;
    }
    return parseInt(str)/this.element.clientHeight;
  },
  $$layout : function() {
    this._layout();
  },
  _getSiblingHeight : function(e) {
    var height = e.parentNode.clientHeight;
    var siblings = e.parentNode.childNodes;
    for (var i=0; i < siblings.length; i++) {
      var sib = siblings[i];
      if (sib!==e && hui.dom.isElement(siblings[i])) {
        if (hui.style.get(sib,'position')!='absolute') {
          height-=sib.offsetHeight;
        }
      }
    }
    return height;
  },
  _layout : function() {
    var pos = 0,
      full = hui.position.getRemainingHeight(this.element);
    for (var i=0; i < this.rows.length; i++) {
      this.rows[i].style.top = (pos*full)+'px';
      var height = (this.sizes[i]*full);
      if (i<this.rows.length-1) {
        height-=6;
      }
      this.rows[i].style.height = height+'px';
      pos+=this.sizes[i];
      if (i<this.rows.length-1) {
        this.handles[i].style.top = (pos*full)+'px';
      }
    }
  }
};

/** @constructor */
hui.ui.NumberValidator = function(options) {
  hui.override({allowNull:false,min:0,max:10},options);
  this.min = options.min;
  this.max = options.max;
  this.allowNull = options.allowNull;
  this.middle = Math.max(Math.min(this.max,0),this.min);
};

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
};

;(function (_super) {

  /**
   * A component for attaching objects
   * @constructor
   */
  hui.ui.ObjectInput = function(options) {
    this.options = hui.override({},options);
    this.key = options.key;
    this.value = [];
    if (options.value) {
      this.value.push(options.value);
    }
    if (typeof(options.finder)=='string') {
      this.finder = hui.ui.get(options.finder);
      this.finder.listen({
        $select: this._found.bind(this)
      });
    }
    this.nodes = {
      text : '.hui_objectinput_text',
      list : '.hui_objectinput_list'
    };
    this.choose = null;
    this.remove = null;
    _super.call(this, options);
    this._attach();
  };

  hui.ui.ObjectInput.prototype = {
    _attach: function() {
      this.choose = new hui.ui.Button({
        element: hui.get.firstByClass(this.element, 'hui_objectinput_choose')
      });
      this.choose.listen({
        $click: this._choose.bind(this)
      });
      this.remove = new hui.ui.Button({
        element: hui.get.firstByClass(this.element, 'hui_objectinput_remove')
      });
      this.remove.listen({
        $click: this.reset.bind(this)
      });
      hui.listen(this.nodes.list,'click',this._clickList.bind(this));
    },
    _choose: function() {
      if (!this.finder) {
        this.finder = hui.ui.Finder.create(
          this.options.finder
        );
        this.finder.listen({
          $select: this._found.bind(this)
        });
      }
      this.finder.show();
    },
    _clickList : function(e) {
      e = hui.event(e);
      e.stop();
      var del = e.findByClass('hui_objectinput_delete');
      if (del) {
        var item = e.findByClass('hui_objectinput_object');
        var idx = parseInt(item.getAttribute('data-index'),10);
        this.value.splice(idx,1);
        this._render();
      }
    },
    _found: function(object) {
      this.finder.hide();
      this.value.push(object);
      this._render();
      this.fireValueChange();
    },
    _render: function() {
      this.nodes.list.innerHTML = '';
      for (var i = 0; i < this.value.length; i++) {
        var item = this.value[i];
        item = this.fire('render',item) || item;
        var html = '';
        var obj = hui.build('div',{'class':'hui_objectinput_object',parent:this.nodes.list,'data-index':i});
        if (item.icon) {
          obj.appendChild(hui.ui.createIcon(item.icon,16));
        }
        obj.appendChild(hui.build('span',{'class':'hui_objectinput_title',text:item.text || item.title}));
        var del = hui.ui.createIcon('monochrome/delete',16,'a');
        hui.cls.add(del,'hui_objectinput_delete');
        del.href = '#';
        obj.appendChild(del);
      }
      this.remove.setEnabled(this.value ? true : false);
    },
    setValue: function(value) {
      this.value = value || [];
      this._render();
      this.fireValueChange();
    },
    getValue : function() {
      return this.value;
    },
    reset : function() {
      this.setValue(null);
    }
  };

  hui.extend(hui.ui.ObjectInput, _super);

})(hui.ui.Component);


(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Rows = function(options) {
    _super.call(this, options);
    this.rows = [];
    this._attach();
  };

  hui.ui.Rows.prototype = {
    _attach : function() {
      var children = hui.get.children(this.element);
      for (var i = 0; i < children.length; i++) {
        var node = children[i];
        var info = hui.string.fromJSON(node.getAttribute('data')) || {};
        info.node = node;
        this.rows.push(info);
      }
    },
    _findSizes : function(fullHeight) {
      var sizes = [];
      var count = this.rows.length;
      var fixedCount = 0;
      var fixedHeight = 0;
      for (var i = 0; i < count; i++) {
        var row = this.rows[i];
        if (row.height=='content') {
          var contentHeight = this._getContentHeight(row.node);
          fixedHeight += contentHeight;
          sizes.push(contentHeight);
          fixedCount++;
        } else {
          sizes.push(null);
        }
      }
      var remainingHeight = fullHeight - fixedHeight;
      var remainder = count - fixedCount;
      for (var j = 0; j < sizes.length; j++) {
        if (sizes[j] === null) {
          sizes[j] = 1 / remainder * remainingHeight;
        }
      }
      this.sizes = sizes;
    },
    _getContentHeight : function(node) {
      var height = 0;
      var children = hui.get.children(node);
      for (var i = 0; i < children.length; i++) {
        height += children[i].clientHeight;
      }
      return height;
    },
    $$childSizeChanged : function() {
      this.$$layout();
    },
    $$layout : function() {
      var fullHeight = this.element.parentNode.clientHeight;
      this.element.style.height = fullHeight + 'px';
      this._findSizes(fullHeight);
      var count = this.rows.length;
      for (var i = 0; i < count; i++) {
        var row = this.rows[i];
        row.node.style.height = this.sizes[i] + 'px';
      }
    }
  };

  hui.extend(hui.ui.Rows, _super);

})(hui.ui.Component);

/**
 * Pages
 * @constructor
 */
hui.ui.Pages = function(options) {
  this.options = options || {};
  this.element = hui.get(options.element);
  this.name = options.name;
  this.pages = hui.get.children(this.element);
  this.index = 0;
  this.fixedHeight = hui.cls.has(this.element,'hui_pages_full');
  this.expanded = false;
  hui.ui.extend(this);
};

hui.ui.Pages.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_pages'});
  return new hui.ui.Pages(options);
};

hui.ui.Pages.prototype = {
  add : function(widgetOrElement) {
    var element = hui.dom.isElement(widgetOrElement) ? element : widgetOrElement.element;
    var page = hui.build('div',{'class':'hui_pages_page'});
    page.appendChild(element);
    this.element.appendChild(page);
    if (this.pages.length>0) {
      page.style.display = 'none';
    }
    this.pages = hui.get.children(this.element);
  },
  next : function() {
    if (this.expanded) {return;}
    var current = this.pages[this.index];
    this.index = this.pages.length <= this.index+1 ? 0 : this.index+1;
    this._transition({hide:current,show:this.pages[this.index]});
  },
  previous : function() {
    if (this.expanded) {return;}
    var current = this.pages[this.index];
    this.index = this.index === 0 ? this.pages.length-1 : this.index-1;
    this._transition({hide:current,show:this.pages[this.index]});
  },
  goTo : function(key) {
    for (var i=0; i < this.pages.length; i++) {
      if (this.pages[i].getAttribute('data-key')==key && i!=this.index) {
        var current = this.pages[this.index];
        this.index = i;
        this._transition({hide:current,show:this.pages[i]});
        return;
      }
    }
  },
  getPageKey : function() {
    return this.pages[this.index].getAttribute('data-key');
  },
  expand : function() {
    var l = this.pages.length;
    for (var i=0; i < l; i++) {
      if (!this.expanded) {
        hui.style.set(this.pages[i],{
          width : (100 / l)+'%',
          display : 'block',
          'float' : 'left',
          opacity: 1
        });
      } else {
        hui.style.set(this.pages[i],{
          width : '',
          display : i==this.index ? 'block' : 'none',
          'float' : ''
        });
      }
    }
    hui.ui.callVisible(this);
    this.expanded = !this.expanded;
  },
  _unFocus : function() {
    var active = document.activeElement;
    if (active && hui.dom.isDescendantOrSelf(active, this.element)) {
      active.blur();
    }
  },
  _transition : function(options) {
    this._unFocus();
    var hide = options.hide,
      show = options.show,
      e = this.element,
      duration = 200;
    if (this.fixedHeight) {
      hui.style.set(hide, {
        position : 'absolute',
        width : e.clientWidth + 'px',
        height : this.element.clientHeight + 'px'
      });
      hui.style.set(show,{
        position : 'absolute',
        display : 'block',
        opacity : 0,
        width : e.clientWidth + 'px',
        height : this.element.clientHeight + 'px'
      });
    } else {
      hui.style.set(hide,{
        position: 'absolute',
        width: e.clientWidth + 'px'
      });
      hui.style.set(show,{
        position: 'absolute',
        width: e.clientWidth + 'px',
        display: 'block',
        opacity: 0
      });
      hui.style.set(e,{
        height: hide.offsetHeight + 'px',
        overflow: 'hidden',
        position: 'relative'
      });
      hui.animate({
        node : e,
        css : {height: show.offsetHeight + 'px'},
        duration : duration,
        ease : hui.ease.slowFastSlow
      });
    }
    hui.ui.reLayout();

    hui.effect.fadeOut({
      element : hide,
      duration : duration,
      $complete : function() {
        hui.style.set(hide,{width : '',position:'',height:''});
        window.setTimeout(function() {
          hide.style.display = 'none';
        });
      }
    });

    hui.effect.fadeIn({
      element : show,
      duration : duration,
      $complete : function() {
        hui.style.set(show, {width : '', position:'', height:''});
        if (!this.fixedHeight) {
          hui.style.set(e, {height:'', overflow:'', position:''});
        }
        hui.ui.reLayout();
        hui.ui.callVisible(this);
        this.fireSizeChange();
      }.bind(this)
    });
  }
};

(function (_super) {

  var ns = 'hui_panel';
  /**
   * @constructor
   */
  hui.ui.Panel = function(options) {
    _super.call(this, options);
    this.options = options;
    this.visible = false;
    this._attach();
    if (options.listener) {
      this.listen(options.listener);
    }
  };

  hui.ui.Panel.create = function(options) {
    options = hui.override({}, options);
    var html = (options.closable ? '<div class="hui_panel_close"></div>' : '')+
      '<div class="hui_panel_arrow"></div><div class="hui_panel_titlebar">';
      if (options.icon) {
        html+='<span class="hui_icon hui_icon_16 hui_panel_icon" style="background-image: url('+hui.ui.getIconUrl(options.icon,16)+'); background-image: -webkit-image-set(url('+hui.ui.getIconUrl(options.icon,16)+') 1x,url('+hui.ui.getIconUrl(options.icon,32+'x2')+') 2x);"></span>';
      }
    html+='<span class="hui_panel_title">' + hui.ui.getTranslated(options.title) + '</span></div>'+
      '<div class="hui_panel_body" style="'+
      (options.width ? 'width:'+options.width+'px;':'')+
      (options.height ? 'height:'+options.height+'px;':'')+
      (options.padding ? 'padding:'+options.padding+'px;':'')+
      '">'+
      '</div>'+
      '';
    var cls = 'hui_panel hui-is-floating'+(options.variant ? ' hui_panel_'+options.variant : '');
    if (options.title) { cls+= ' hui-is-titled'; }
    if (options.variant=='dark') {
      cls+=' hui_context_dark';
    }
    options.element = hui.build('div', {'class' : cls, html : html, parent: options.parent || document.body});
    return new hui.ui.Panel(options);
  };

  hui.ui.Panel.prototype = {
    _target : null,
    nodes : {
      close: '.hui_panel_close',
      titlebar: '.hui_panel_titlebar',
      title: '.hui_panel_title',
      body: '.hui_panel_body',
      arrow: '.hui_panel_arrow'
    },
    _attach : function() {
      if (this.nodes.close) {
        hui.listen(this.nodes.close,'click',function(e) {
          this.hide();
          this.fire('close');
        }.bind(this));
        hui.listen(this.nodes.close,'mousedown',function(e) {hui.stop(e);});
      }
      hui.drag.register({
        touch: true,
        window: this.element.ownerDocument.defaultView,
        element : this.nodes.titlebar,
        $before : this._onDragStart.bind(this) ,
        $startMove : this._onBeforeMove.bind(this) ,
        $move : this._onMove.bind(this),
        $endMove : this._onAfterMove.bind(this)
      });
      hui.listen(this.element,'mousedown',function() {
        this.element.style.zIndex = hui.ui.nextPanelIndex();
      }.bind(this));
    },
    _attachHider : function() {
      if (this.options.autoHide && !this._hideListener) {
        this._hideListener = hui.on(document.body, 'tap', function(e) {
          if (!hui.ui.isWithin(e, this.element) && (!this._target || !hui.ui.isWithin(e, this._target))) {
            this.hide();
          }
        }.bind(this));
      }
      if (!this._resizeListener) {
        var go = function() {
          this._adjustSize();
          this._positionAtTarget();
        }.bind(this)
        this._resizeListener = hui.listen(window, 'resize', function(e) {
          if (this.visible) {
            hui.onDraw(go);
          }
        }.bind(this));
      }
    },
    setTitle : function(title) {
      hui.dom.setText(this.nodes.title,hui.ui.getTranslated(title));
      hui.cls.set(this.element,'hui-is-titled', !hui.isBlank(title));
    },
    _positionInView : function() {
      var scrollTop = hui.window.getScrollTop();
      var winTop = hui.position.getTop(this.element);
      if (winTop < scrollTop || winTop + this.element.clientHeight > hui.window.getViewHeight()+scrollTop) {
        hui.animate({
          node: this.element,
          css: {top: (scrollTop + 40) + 'px'},
          duration: 500,
          ease: hui.ease.slowFastSlow
        });
      }
    },
    _ensureInView : function() {
      if (!this.visible || this._target) return;
      var viewWidth = hui.window.getViewWidth() - 3;
      var right = hui.position.getLeft(this.element) + this.element.offsetWidth;
      if (viewWidth - right < 0) {
        this.element.style.left = (viewWidth - this.element.offsetWidth) + 'px';
      }
    },
    _adjustSize : function() {
      var viewWidth = hui.window.getViewWidth();
      var isTooLarge = this.options.width + 40 > viewWidth;
      hui.cls.set(this.element, 'hui-is-full', isTooLarge);
      if (!isTooLarge) {
        this._ensureInView();
      }
    },
    _placeOnTop : function() {
      if (this.visible) {
        hui.style.set(this.element,{
          zIndex : hui.ui.nextPanelIndex()
        });
      } else {
        hui.style.set(this.element,{
          zIndex : hui.ui.nextPanelIndex(),
          visibility : 'hidden',
          display : 'block'
        });
      }
    },
    show : function(options) {
      var element = this.element;
      options = options || {};
      this._target = options.target;
      this._adjustSize();
      this._placeOnTop();
      if (this._target) {
        if (!this.visible) {
          this._positionAtTarget();
          hui.style.set(element,{
            opacity: '0',
            transform: 'scale(0.5)',
            visibility : 'visible'
          });
          setTimeout(function() {
            hui.cls.add(element, 'hui-is-animating');
          })
        } else {
          hui.cls.add(element, 'hui-is-animating');
          this._positionAtTarget();
        }
        hui.cls.add(element,'hui-is-targeted');
        if (!this.visible) {
          setTimeout(function() {
            hui.style.set(element, {
              opacity: 1,
              transform: 'scale(1) '
            });
          });
        }
        setTimeout(function() {
          hui.cls.remove(element,'hui-is-animating');
        }, 600);
      } else {
        if (this.visible) {
          this._positionInView();
          return;
        }
        hui.style.set(element,{
          visibility : 'visible'
        });
        if (options.avoid) {
          hui.position.place({
            insideViewPort : true,
            target : {element : options.avoid, vertical : 0.5, horizontal : 1},
            source : {element : element, vertical : 0.5, horizontal : 0}
          });
        } else {
          if (!element.style.top) {
            element.style.top = (hui.window.getScrollTop()+40)+'px';
          } else {
            this._positionInView();
          }
          if (!element.style.left) {
            element.style.left = Math.round((hui.window.getViewWidth()-element.clientWidth)/2)+'px';
          }
        }
        hui.animate(element,'opacity',1,0);
      }
      this.visible = true;
      hui.ui.callVisible(this);
      this._attachHider();
    },
    updatePosition : function() {
      if (this.visible) {
        this._positionAtTarget();
      }
    },
    _positionAtTarget : function() {
      if (!this._target) { return; }
      var panel = {
        width: this.element.clientWidth,
        height: this.element.clientHeight
      };
      var target = this._target;
      var panelScrollOffset = hui.position.getScrollOffset(this.element);
      var targetScrollOffset;
      if (target.nodeType===1) {
        targetScrollOffset = hui.position.getScrollOffset(this._target);
        target = hui.position.get(this._target);
        target.height = this._target.offsetHeight || this._target.clientHeight;
        target.width = this._target.offsetWidth || this._target.clientWidth;
      } else {
        targetScrollOffset = {top: 0, left: 0};
      }
      var view = {
        height: hui.window.getViewHeight(),
        width: hui.window.getViewWidth(),
        scrollTop: hui.window.getScrollTop(),
        scrollLeft: hui.window.getScrollLeft()
      }
      var dist = {
        above: (target.top - view.scrollTop) / panel.height,
        below: (view.height - (target.top - view.scrollTop + target.height))  / panel.height,
        left: (target.left - view.scrollLeft)  / panel.width,
        right: (view.width - (target.left - view.scrollLeft + target.width)) / panel.width
      }
      var pos = {
        top: 0, left: 0
      }
      var orientation = this._getOrientation(dist);
      if (orientation == 'below') {
        pos.top = target.top + target.height + 5;
        pos.left = target.left + target.width/2 - panel.width/2;
      } else if (orientation == 'above') {
        pos.top = target.top - panel.height - 5;
        pos.left = target.left + target.width/2 - panel.width/2;
      } else if (orientation == 'left') {
        pos.top = target.top + target.height/2 - panel.height/2;
        pos.left = target.left - panel.width - 5;
      } else if (orientation == 'right') {
        pos.top = target.top + target.height/2 - panel.height/2;
        pos.left = target.left + target.width + 5;
      }
      var scrollDiff = {
        top: (targetScrollOffset.top - panelScrollOffset.top),
        left: (targetScrollOffset.left - panelScrollOffset.left)
      }
      var gutter = 5;
      pos.top = hui.between(gutter + targetScrollOffset.top, pos.top - scrollDiff.top, view.scrollTop + view.height - panel.height - gutter);
      pos.left = hui.between(gutter + targetScrollOffset.left, pos.left, view.scrollLeft + view.width - panel.width - gutter);
      this.nodes.arrow.className = 'hui_panel_arrow hui_panel_arrow-' + orientation;
      if (orientation == 'above' || orientation == 'below') {
        hui.style.set(this.nodes.arrow,{
          left: hui.between(3, (target.left - pos.left + target.width/2 - 10), panel.width - 3 - 20) + 'px',
          top: ''
        });
      } else {
        hui.style.set(this.nodes.arrow,{
          top: hui.between(3, (target.top - pos.top + target.height/2 - 10) - scrollDiff.top, panel.height - 3 - 20) + 'px',
          left: ''
        });
      }
      hui.style.set(this.element,{
        top: pos.top + 'px',
        left: pos.left + 'px'
      })
    },
    _getOrientation : function(distances) {
      var prop, value = 0;
      for (dim in distances) {
        if (distances.hasOwnProperty(dim)) {
          if (distances[dim] > value) {
            value = distances[dim];
            prop = dim;
          }
        }
      }
      return prop;
    },
    toggle : function(options) {
      if (this.visible) {
        this.hide();
      } else {
        this.show(options);
      }
    },
    isVisible : function() {
      return this.visible;
    },
    hide : function() {
      if (!this.visible) return;
      this._unFocus();
      hui.cls.add(this.element, 'hui-is-animating');
      this.element.style.opacity='0';
      setTimeout(function() {
        if (this.visible == true) {
          return;
        }
        hui.cls.remove(this.element, 'hui-is-animating');
        this.element.style.display='none';
        hui.ui.callVisible(this);
      }.bind(this),500);
      this.visible = false;
    },
    _unFocus : function() {
      var active = document.activeElement;
      if (active && hui.dom.isDescendantOrSelf(active, this.element)) {
        active.blur();
      }
    },
    clear : function() {
      hui.ui.destroyDescendants(this.nodes.body);
      this.nodes.body.innerHTML = '';
    },
    add : function(widgetOrNode) {
      if (widgetOrNode.getElement) {
        this.nodes.body.appendChild(widgetOrNode.getElement());
      } else {
        this.nodes.body.appendChild(widgetOrNode);
      }
      this._positionAtTarget();
    },
    setBusy : function(stringOrBoolean) {
      if (stringOrBoolean===false) {
        clearTimeout(this._busyTimer);
        if (this._busyCurtain) {
          hui.cls.remove(this._busyCurtain, 'hui-is-visible');
        }
        return;
      }
      var curtain = this._busyCurtain;
      if (!curtain) {
        curtain = this._busyCurtain = hui.build('div.hui_panel_busy',{parentFirst:this.nodes.body});
        if (hui.browser.msie) {
          hui.cls.add(curtain,'hui_panel_busy-legacy');
        }
      }
      var text = hui.isString(stringOrBoolean) ? hui.string.escape(stringOrBoolean) : '';
      curtain.innerHTML = '<span class="hui_panel_busy_text">' + text + '</span>';
      this._busyTimer = setTimeout(function() {
        hui.cls.add(curtain, 'hui-is-visible');
      },16);
    },

    move : function(point) {
      hui.style.set(this.element,{top:point.top+'px',left:point.left+'px'});
    },

    _onDragStart : function(e) {
      this.element.style.zIndex = hui.ui.nextPanelIndex();
    },
    _onBeforeMove : function(e) {
      e = hui.event(e);
      var pos = hui.position.get(this.element);
      this.dragState = {
        left: e.getLeft() - pos.left,
        top: e.getTop() - pos.top,
        maxLeft: hui.window.getViewWidth() - this.element.offsetWidth - 3
      };
      this.element.style.right = 'auto';
      hui.cls.add(this.element,'hui-is-dragging');
      hui.cls.remove(this.element,'hui-is-targeted');
    },
    _onMove : function(e) {
      var top = (e.getTop()-this.dragState.top);
      var left = (e.getLeft()-this.dragState.left);
      this.element.style.top = Math.max(top, 3) + 'px';
      this.element.style.left = hui.between(3, left, this.dragState.maxLeft) + 'px';
    },
    _onAfterMove : function() {
      hui.ui.callDescendants(this,'$$parentMoved');
      hui.cls.remove(this.element,'hui-is-dragging');
    }
  };


  hui.extend(hui.ui.Panel, _super);

  hui.define('hui.ui.Panel', hui.ui.Panel);

})(hui.ui.Component);

hui.component('Collection', {

  init : function(options) {
    if (options.source) {
      options.source.listen(this);
      this.source = options.source;
    }
    this.selectable = options.selectable;
    this.selectionClass = options.selectionClass || 'hui-is-selected';
    this.items = [];
  },
  nodes : {
    empty : '.hui_collection_empty'
  },
  setData : function(data) {
    data = data || [];
    this.data = [];
    this._clear();
    this.items = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      this._renderItem(item, i);
      this.data.push(item);
    }
    if (this.items.length === 0) {
      this.fire('empty');
    }
    if (this.nodes.empty) {
      this.nodes.empty.style.display = this.items.length ? 'none' : '';
    }
  },
  _renderItem: function(item, i) {
    var rendition = hui.ui.callDelegates(this, 'render', item);
    if (!rendition) {
      rendition = hui.build('div', {text: item.toString()});
    }
    hui.cls.add(rendition,'hui_collection_item');
    if (this.selectable) {
      hui.cls.set(rendition, this.selectionClass, this._isSelected(i))
    }
    this.items.push(rendition);
    this.element.appendChild(rendition);
  },
  _clear : function() {
    //hui.ui.destroyDescendants(this.body);
    for (var i = 0; i < this.items.length; i++) {
      hui.dom.remove(this.items[i]);
    }
  },
  $objectsLoaded : function(objects) {
    this.setData(objects)
  },
  refresh : function() {
    if (this.source) {
      this.source.refresh();
    }
  },
  _isSelected : function(i) {
    return hui.ui.callDelegates(this, 'isSelected', this.data[i]);
  },
  updateSelection : function() {
    if (this.selectable) {
      for (var i = 0; i < this.items.length; i++) {
        hui.cls.set(this.items[i], this.selectionClass, this._isSelected(i));
      }
    }
  },
  '!click' : function(e) {
    var item = e.closest('.hui_collection_item');
    if (item) {
      var idx = this.items.indexOf(item);
      this.fire('select', {data: this.data[idx]});
      this.updateSelection();
    }
  }
});



/**
 * A chart (line / column etc.)
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  (TODO many more)
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Chart = function(options) {
  this.options = options = options || {};
  this.element = hui.get(options.element);
  this.body  = {
    width : undefined,
    height : undefined,
    paddingTop : 10,
    paddingBottom : 30,
    paddingLeft : 10,
    paddingRight : 10,
    innerPaddingVertical : 10,
    innerPaddingHorizontal : 10
  };
  this.style = {
    border : true,
    background : true,
    colors : ['#36a','#69d','#acf'],
    legends : { position: 'right' , left: 0, top: 0 },
    pie : { radiusFactor: 0.9 , valueInLegend: false , left: 0, top: 0 }
  };
  this.xAxis = { labels:[], grid:true, concentration: 0.8 , maxLabels: 12};
  this.yAxis = { min:0, max:0, steps:8, above:false , factor: 10};

  this.dataSets = [];
  this.data = null;

  hui.ui.extend(this);

  if (this.options.source) {
    this.options.source.listen(this);
  }
};

hui.ui.Chart.create = function(options) {
  options.element = hui.build('div',{
    'class' : 'hui_chart',
    parent : hui.get(options.parent),
    style : 'width: 100%; height: 100%;'
  });
  return new hui.ui.Chart(options);
};

hui.ui.Chart.prototype = {
  addDataSet : function(dataSet) {
    this.dataSets[this.dataSets.length] = dataSet;
  },
  setXaxisLabels : function(labels) {
    for (var i=0; i < labels.length; i++) {
      this.xAxis.labels[this.xAxis.labels.length] = {key:labels[i],label:labels[i]};
    }
  },
  setData : function(data) {
    if (!data.dataSets) {
      this.data = hui.ui.Chart.Util.convertData(data);
    } else {
      this.data = data;
    }
  },
  render : function() {
    var renderer = new hui.ui.Chart.Renderer(this);
    renderer.render();
  },
  $$layout : function() {
    this.render();
  },
  $objectsLoaded : function(data) {
    this.setData(data);
    this.render();
  }
};


//////////////////////// Data ////////////////////

hui.ui.Chart.Data = function(options) {
  this.xAxis = hui.override({ labels:[], grid:true, concentration:0.8 , maxLabels:12},options.xAxis);
  this.yAxis = hui.override({ min:0, max:0, steps:8, above:false , factor: 10},options.yAxis);
  this.dataSets = [];
};

hui.ui.Chart.Data.prototype = {
  addDataSet : function(set) {
    this.dataSets.push(set);
  }
};


///////////////////// Data set ////////////////////

hui.ui.Chart.DataSet = function(options) {
  options = options || {};
  this.dataSets = [];
  this.entries = options.entries || [];
  this.legend = null;
  this.style = {type:options.type || 'line'};
};

hui.ui.Chart.DataSet.prototype = {

  addDataSet : function(dataSet) {
    this.dataSets[this.dataSets.length] = dataSet;
  },
  setLegend : function(legend) {
    this.legend = legend;
  },
  isMultiDimensional : function() {
    return this.dataSets.length>0;
  },
  addEntry : function(key,value) {
    this.entries[this.entries.length] = {key:key,value:value};
  },
  setValues : function(graph,values) {
    for (var i=0; i < graph.xAxis.labels.length; i++) {
      if (values[i]) {
        this.addEntry(graph.xAxis.labels[i].key,values[i]);
      }
    }
  },
  getEntryValue : function(key) {
    var value = 0;
    for (var i=0;i<this.entries.length;i++) {
      if (this.entries[i].key==key) {
        return this.entries[i].value;
      }
    }
    return value;
  },
  getEntryValue2D : function(key) {
    var value = [];
    for (var i=0;i<this.dataSets.length;i++) {
      var set = this.dataSets[i];
      for (var j=0;j<set.entries.length;j++) {
        if (set.entries[j].key==key) {
          value[i] = set.entries[j].value;
        }
      }
      if (!value[i]) {
        value[i]=0;
      }
    }
    return value;
  },
  keysToValues : function(keys) {
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values[i] = this.getEntryValue(keys[i].key);
    }
    return values;
  },
  keysToValues2D : function(keys) {
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values[i] = this.getEntryValue2D(keys[i].key);
    }
    return values;
  },
  getValueRange : function(keys) {
    var vals = [];
    if (this.isMultiDimensional()) {
      var vals2D = this.keysToValues2D(keys);
      for (var i=0; i < vals2D.length; i++) {
        var sum = 0;
        for (var j=0; j < vals2D[i].length; j++) {
          sum+=vals2D[i][j];
        }
        vals[i] = sum;
      }
    } else {
      vals = this.keysToValues(keys);
    }
    var min = Number.MAX_VALUE,
      max = Number.MIN_VALUE;
    for (var k=0; k < vals.length; k++) {
      min = Math.min(min, vals[k]);
      max = Math.max(max, vals[k]);
    }
    return {min:min,max:max};
  },
  getSubLegends : function() {
    var value = [];
    for (var i = 0; i < this.dataSets.length; i++) {
      value[i] = this.dataSets[i].legend;
    }
    return value;
  }
};

/*********************************************************************/
/*                             Renderer                              */
/*********************************************************************/

hui.ui.Chart.Renderer = function(chart) {
  this.chart = chart;
  this.crisp = false;
  this.legends = [];
  this.state = { numColumns:0, currColumn:0, xLabels:[], yLabels:[], body:{left:0}, innerBody:{}, coordinateSystem: false, currColor:0 };
  this.width = null;
  this.height = null;
};

hui.ui.Chart.Renderer.prototype = {
  _registerLegend : function(color,label) {
    this.legends[this.legends.length] = {color:color,label:label};
  },
  _buildInnerBody : function() {
    var body = this.chart.body;
    var xLabels = this.state.xLabels;
    var space = 0;
    if (this.state.numColumns>0) {
      space = ( this.width - 2 * body.innerPaddingHorizontal - body.paddingLeft - body.paddingRight ) / xLabels.length;
    }
    var innerBody = {
      left : (body.innerPaddingHorizontal + this.state.body.left + space/2),
      top : (body.paddingTop + body.innerPaddingVertical),
      width : (this.state.body.width-2 * body.innerPaddingHorizontal - space),
      height : (this.state.body.height - body.innerPaddingVertical * 2 )
    };
    return innerBody;
  },
  _buildBody : function() {
    var body = this.chart.body,
    left = body.paddingLeft + this.state.yLabelWidth;
    return {
      left : left,
      top : body.paddingTop,
      width : this.width - left - body.paddingRight,
      height : this.height - body.paddingTop - body.paddingBottom,
      right : this.width - body.paddingRight,
      bottom : this.height - body.paddingBottom
    };
  }
};

hui.ui.Chart.Renderer.prototype.render = function() {

  this.width = this.chart.body.width || this.chart.element.clientWidth;
  this.height = this.chart.body.height || this.chart.element.clientHeight;

  hui.dom.clear(this.chart.element);
  this.canvas = hui.build('canvas',{parent:this.chart.element,width:this.width,height:this.height});
  if (!this.canvas.getContext) {
    return;
  }
  this.ctx = this.canvas.getContext("2d");

  if (!hui.isDefined(this.chart.data)) {
    return;
  }

  var i, dataSet;

  // Extract basic info about the chart
  for (i=0;i<this.chart.data.dataSets.length;i++) {
    dataSet = this.chart.data.dataSets[i];
    if (dataSet.style.type=='line' || dataSet.style.type=='column') {
      this.state.coordinateSystem = true;
    }
    if (dataSet.style.type=='column') {
      this.state.numColumns++;
    }
  }

  this.state.xLabels = this.chart.data.xAxis.labels;
  this.state.yLabels = hui.ui.Chart.Util.generateYLabels(this.chart);
  this.state.yLabelWidth = 0;
  for (i = 0; i < this.state.yLabels.length; i++) {
    this.state.yLabelWidth = Math.max(this.state.yLabelWidth, String(this.state.yLabels[i]).length * 5);
  }
  this.state.yLabelWidth+=5;
  this.state.body = this._buildBody();
  this.state.innerBody = this._buildInnerBody();

  // Render the coordinate system (below)
  if (this.state.coordinateSystem) {
    this.renderBody();
  }

  // Loop through data sets and render them
  var xLabels = this.state.xLabels;
  for (i = 0; i < this.chart.data.dataSets.length; i++) {
    dataSet = this.chart.data.dataSets[i];
    var values, legend;
    if (dataSet.style.type=='line') {
      values = dataSet.keysToValues(xLabels);
      this.renderLineGraph( { values:values, style:dataSet.style , legend:dataSet.legend } );
    } else if (dataSet.style.type=='column') {
      if (dataSet.isMultiDimensional()) {
        values = dataSet.keysToValues2D(xLabels);
        legend = dataSet.getSubLegends();
      } else {
        values = dataSet.keysToValues(xLabels);
        legend = dataSet.legend;
      }
      this.renderColumnGraph( { values:values, style:dataSet.style , legend: legend} );
    } else if (dataSet.style.type=='pie') {
      values = dataSet.keysToValues(xLabels);
      this.renderPie( { values:values, style:dataSet.style } );
    }
  }

  // Render the coordinate system (above)
  if (this.shouldRenderCoordinateSystem) {
    this.renderPostBody();
  }

  // Render possible lengends
  this.renderLegends();
};

/**
 * Renders a legend box
 */
hui.ui.Chart.Renderer.prototype.renderLegends = function() {
  if (this.legends.length>0) {
    var position = this.chart.style.legends.position;
    var box = hui.build('div',{style:{position:'absolute',zIndex:5,width:this.width+'px'}});

    var html='<div class="hui_chart_legends" style="margin-right: '+(5-this.chart.style.legends.left)+'px; margin-top: '+(5+this.chart.style.legends.top)+'px;">';
    for (var i=0;i<this.legends.length;i++) {
      var style = '';
      if (position=='bottom') {
        style = 'padding: 2px; padding-right: 8px; float: left; white-space: nowrap;';
        if (i==this.legends.length-1) {
          style+='padding-right: 3px';
        }
      } else {
        style = 'padding: 2px;';
      }
      html+='<div class="hui_chart_legend" style="'+style+'"><em style="background: '+this.legends[i].color+';"></em><span>'+this.legends[i].label+'</span></div>';
    }
    html+='</div>';
    box.innerHTML = html;
    if (position=='right') {
      this.canvas.parentNode.insertBefore(box,this.canvas);
    } else if (position=='bottom') {
      this.canvas.parentNode.appendChild(box);
      var y = document.createElement('div');
      y.appendChild(box);
      this.canvas.parentNode.appendChild(y);
    }
  }
};

/**
 * Renders the body of the chart
 */
hui.ui.Chart.Renderer.prototype.renderBody = function() {

  var body = this.chart.body,
    stroke = 'rgb(255,255,255)',
    background = 'rgb(240,240,240)',
    state = this.state,
    innerBody = this.state.innerBody;

  stroke = '#eee'; // TODO Make this configurable
  background = '#fff';

  if (this.chart.style.background) {
    this.ctx.fillStyle = background;
    this.ctx.fillRect(
      state.body.left,
      state.body.top,
      state.body.width,
      state.body.height
    );
  }

  var mod = 1;
  /* Build X-axis*/
  var xLabels = this.state.xLabels;
  if (xLabels.length>this.chart.data.xAxis.maxLabels) {
    mod = Math.ceil(xLabels.length/this.chart.data.xAxis.maxLabels);
  }
  this.ctx.strokeStyle=stroke;
  for (var i = 0; i < xLabels.length; i++) {
    var left = i * ((innerBody.width) / (xLabels.length - 1)) + innerBody.left;
    left = Math.round(left);

    if (mod < 10 || (i % mod) === 0) {
      // Draw grid
      if (this.chart.data.xAxis.grid) {
        this.ctx.beginPath();
        this.ctx.moveTo(0.5 + left, state.body.top + 0.5);
        this.ctx.lineTo(0.5 + left, state.body.top + 0.5 + state.body.height);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
    if ((i % mod) === 0) {
      // Draw label
      hui.build('span',{
        'class' : 'hui_chart_label',
        text : xLabels[i].label,
        before : this.canvas,
        style : {
          marginLeft : (left - 25) + 'px',
          marginTop : (state.body.bottom + 4) + 'px',
          color : '#999'
        }
      });
    }
  }
  this.ctx.strokeStyle=stroke;

  /* Build Y-axis*/
  var yLabels = this.state.yLabels.concat();
  yLabels.reverse();
  var top;
  for (i = 0; i < yLabels.length; i++) {
    // Draw grid
    top = i * ((state.body.height - body.innerPaddingVertical * 2) / (yLabels.length - 1)) + body.paddingTop + body.innerPaddingVertical;
    top = Math.round(top);
    if (!this.chart.data.yAxis.above) {
      this.ctx.beginPath();
      this.ctx.moveTo(0.5 + state.body.left, top + 0.5);
      this.ctx.lineTo(0.5 + state.body.right, top + 0.5);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    // Draw label
    var label = hui.build('span',{text:yLabels[i],style:{
      position: 'absolute',
      textAlign : 'right',
      width : (this.state.yLabelWidth - 5) + 'px',
      font : '9px Tahoma',
      marginTop : (top - 5) +'px',
      marginLeft : body.paddingLeft+'px',
      color : '#999'
    }});
    this.canvas.parentNode.insertBefore(label,this.canvas);
  }

  // Draw a line at 0 if
  if (!this.chart.data.yAxis.above && yLabels[0] > 0 && yLabels[yLabels.length-1] < 0) {
    top = (state.body.height - body.innerPaddingVertical * 2) * yLabels[0] / (yLabels[0] - yLabels[yLabels.length - 1]) + body.paddingTop + body.innerPaddingVertical;
    top = Math.round(top);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle=stroke;
    this.ctx.beginPath();
    this.ctx.moveTo(0.5 + state.body.left, top);
    this.ctx.lineTo(0.5 + state.body.right, top);
    this.ctx.stroke();
    this.ctx.closePath();
  }
};

hui.ui.Chart.Renderer.prototype.renderPostBody = function() {
  var body = this.chart.body;
  if (this.chart.data.yAxis.above) {

    this.ctx.strokeStyle='rgb(240,240,240)';
    var yLabels = this.state.yLabels.concat();
    yLabels.reverse();
    var top;
    for (var i = 0; i < yLabels.length; i++) {
      top = i * ((this.height - body.innerPaddingVertical * 2 - body.paddingTop - body.paddingBottom) / (yLabels.length - 1)) + body.paddingTop + body.innerPaddingVertical;
      top = Math.round(top);
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0.5 + body.paddingLeft, top + 0.5);
      this.ctx.lineTo(0.5 + this.width - body.paddingRight, top + 0.5);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    if (yLabels[0] > 0 && yLabels[yLabels.length - 1] < 0) {
      top = (this.height - body.innerPaddingVertical * 2 - body.paddingTop - body.paddingBottom) * yLabels[0] / (yLabels[0] - yLabels[yLabels.length - 1]) + body.paddingTop + body.innerPaddingVertical;
      top = Math.round(top);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'rgb(255,255,255)';
      this.ctx.beginPath();
      this.ctx.moveTo(0.5 + body.paddingLeft,top);
      this.ctx.lineTo(0.5 + this.width - body.paddingRight,top);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  if (this.chart.style.border) {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle='rgb(230,230,230)';
    this.ctx.strokeRect(body.paddingLeft + 0.5, body.paddingTop + 0.5, this.width-body.paddingLeft - body.paddingRight, this.height - body.paddingTop - body.paddingBottom);
  }
};

hui.ui.Chart.Renderer.prototype.renderLineGraph = function(data) {
  var values = data.values;
  var xLabels = this.state.xLabels;
  var yLabels = this.state.yLabels;
  var yMin = yLabels[0];
  var yMax = yLabels[yLabels.length - 1];
  var body = this.chart.body;
  var innerBody = this.state.innerBody;
  var color;
  if (data.style.colors) {
    color = data.style.colors[0];
  } else {
    color = this.chart.style.colors[this.state.currColor];
    if (this.state.currColor + 2 > this.chart.style.colors.length) {
      this.state.currColor = 0;
    } else {
      this.state.currColor++;
    }
  }
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = data.width ? data.width : 3;
  this.ctx.lineCap = this.ctx.lineJoin = 'round';
  this.ctx.beginPath();
  for (var i = 0; i < xLabels.length; i++) {
    var amount = (values[i] === undefined ? 0 : values[i]);
    var value = (amount - yMin) / (yMax - yMin);
    var top = this.height - value * (innerBody.height) - body.innerPaddingVertical - body.paddingBottom;
    var left = i * (innerBody.width / (xLabels.length - 1)) + innerBody.left;
    if (i === 0) {
      this.ctx.moveTo(left + 0.5, top + 0.5);
    } else {
      this.ctx.lineTo(left + 0.5, top + 0.5);
    }
  }
  this.ctx.stroke();
  this.ctx.closePath();

  if (data.legend) {
    this._registerLegend(color,data.legend);
  }
};


hui.ui.Chart.Renderer.prototype.renderColumnGraph = function(data) {
  var values = data.values;
  var xLabels = this.state.xLabels;
  var yLabels = this.state.yLabels;
  var yMin = yLabels[0];
  var yMax = yLabels[yLabels.length-1];
  var body = this.chart.body;
  var colors = data.style.colors ? data.style.colors : this.chart.style.colors;
  this.state.currColumn++;
  var innerBody = this.state.innerBody;
  var space = (this.width - body.paddingLeft - body.paddingRight) / xLabels.length * this.chart.data.xAxis.concentration;
  var thickness = space / this.state.numColumns;
  this.ctx.lineCap = this.ctx.lineJoin = 'round';
  this.ctx.beginPath();
  for (var i = 0; i < xLabels.length; i++) {
    if (values[i]) {
      var colorIndex = 0;
      var currTop = 0;
      if (values[i] instanceof Array) {
        for (var j = 0; j < values[i].length; j++) {
          var val = values[i][j];
          currTop += this.renderOneColumn(val, colors[colorIndex], body, innerBody, yMin, yMax, currTop, i, xLabels, space, thickness);

          if (colorIndex+2>colors.length) {
            colorIndex = 0;
          } else {
            colorIndex++;
          }
        }
      } else {
        currTop += this.renderOneColumn(values[i], colors[colorIndex], body, innerBody, yMin, yMax, currTop, i, xLabels, space, thickness);
      }
    }
  }
  this.ctx.stroke();
  this.ctx.closePath();

  if (data.legend && data.legend instanceof Array) {
    for (var k = 0; k < data.legend.length; k++) {
      this._registerLegend(colors[k], data.legend[k]);
    }
  } else if (data.legend) {
    this._registerLegend(colors[0], data.legend);
  }
};

hui.ui.Chart.Renderer.prototype.renderOneColumn = function(val,color,body,innerBody,yMin,yMax,currTop,i,xLabels,space,thickness) {
  var value = (val - yMin) / (yMax - yMin);
  var height, top;
  if (yMin<=0 && val<=0) {
    top = innerBody.top + (innerBody.height) * yMax / (yMax - yMin) + currTop;
    height = innerBody.height * Math.abs(val) / (yMax - yMin);
  } else if (yMin <= 0) {
    top = this.height - body.innerPaddingVertical - body.paddingBottom - value * (innerBody.height) - currTop;
    height = (innerBody.height) * Math.abs(val) / (yMax - yMin);
  }
  else {
    top = this.height - value * (this.height - body.innerPaddingVertical * 2 - body.paddingTop - body.paddingBottom) - body.innerPaddingVertical - body.paddingBottom - currTop;
    height = (this.height - body.paddingBottom - top);
  }
  var left = i* ((innerBody.width) / (xLabels.length - 1)) + innerBody.left;

  this.ctx.fillStyle = color;
  if (this.crisp) {
    this.ctx.fillRect(Math.round(left - space / 2 + thickness * (this.state.currColumn - 1)), Math.floor(top), Math.ceil(thickness), Math.ceil(height));
  } else {
    this.ctx.fillRect(left - space / 2 + thickness * (this.state.currColumn - 1), top, thickness, height);
  }
  return height;
};

hui.ui.Chart.Renderer.prototype.renderPie = function(data) {

  var values = data.values;
  var colors = data.style.colors ? data.style.colors : this.chart.style.colors;
  var total = hui.ui.Chart.Util.arraySum(values);

  var colorIndex = 0;
  var current = Math.PI * 1.5;
  var cTop = this.height / 2 + this.chart.style.pie.top;
  var cLeft = this.width / 2 + this.chart.style.pie.left;
  var radius = this.height / 2 * this.chart.style.pie.radiusFactor;

  for (var i = 0; i < values.length; i++) {
    this.ctx.beginPath();
    var color = colors[colorIndex];
    this.ctx.fillStyle = color;
    var rads = values[i] / total * (Math.PI * 2);
    this.ctx.moveTo(cLeft, cTop);
    this.ctx.arc(cLeft, cTop, radius, current, current + rads, false);
    this.ctx.lineTo(cLeft, cTop);
    this.ctx.fill();
    this.ctx.closePath();
    current+=rads;

    if (!true) {
      this._registerLegend(color, this.state.xLabels[i].label);
    } else {
      this._registerLegend(color, values[i] + ' ' + this.state.xLabels[i].label);
    }
    if (colorIndex + 2 > colors.length) {
      colorIndex = 0;
    } else {
      colorIndex++;
    }
  }

};





/*********************************************************************/
/*                           Utitlities                              */
/*********************************************************************/

hui.ui.Chart.Util = function() {};

hui.ui.Chart.Util.generateYLabels = function(graph) {
  var range = hui.ui.Chart.Util.getYrange(graph);
  var labels = [];
  for (var i = 0; i <= graph.yAxis.steps; i++) {
    labels[labels.length] = Math.round(range.min + (range.max - range.min) / graph.yAxis.steps * i);
  }
  return labels;
};

hui.ui.Chart.Util.getYrange = function(graph) {
  var min = graph.yAxis.min,
    max = graph.yAxis.max,
    data = graph.data;
  for (var i = 0; i < data.dataSets.length; i++) {
    var range = data.dataSets[i].getValueRange(data.xAxis.labels);
    min = Math.min(min, range.min);
    max = Math.max(max, range.max);
  }
  var factor = max / graph.yAxis.steps;
  if (factor < graph.yAxis.factor) {
    factor = Math.ceil(factor);
  } else {
    factor = graph.yAxis.factor;
  }
  if (max != Number.MIN_VALUE) {
    max = Math.ceil(max / factor / graph.yAxis.steps) * factor * graph.yAxis.steps;
  } else {
    max = graph.yAxis.steps;
  }
  return {min: min, max : max};
};

hui.ui.Chart.Util.arraySum = function(values) {
  var total = 0;
  for (var i = 0; i < values.length; i++) {
    total += values[i];
  }
  return total;
};

/** Converts a simple data-representation into a class-based stucture */
hui.ui.Chart.Util.convertData = function(obj) {
  var labels = [],keys = [];
  var i;
  for (i = 0; i < obj.sets.length; i++) {
    var set = obj.sets[i];
    if (hui.isArray(set.entries)) {
      for (var j=0; j < set.entries.length; j++) {
        var entry = set.entries[j];
        if (!hui.array.contains(keys, entry.key)) {
          keys.push(entry.key);
          labels.push({key: entry.key, label: entry.label || entry.key});
        }
      }
    } else {
      for (var key in set.entries) {
        if (!hui.array.contains(keys, key)) {
          keys.push(key);
          labels.push({key: key, label: key});
        }
      }
    }
  }
  var options = {xAxis: {labels: labels}};
  if (obj.axis && obj.axis.x && obj.axis.x.time===true) {
    options.xAxis.resolution = 'time';
  }
  if (obj.axis && obj.axis.x && hui.isArray(obj.axis.x.labels)) {
    options.xAxis.labels = obj.axis.x.labels;
  }
  var data = new hui.ui.Chart.Data(options);

  for (i = 0; i < obj.sets.length; i++) {
    var setData = obj.sets[i];
    var dataSet = new hui.ui.Chart.DataSet({type : setData.type});
    if (hui.isArray(setData.entries)) {
      for (var k = 0; k < setData.entries.length; k++) {
        var dataEntry = setData.entries[k];
        dataSet.addEntry(dataEntry.key, dataEntry.value);
      }
    } else {
      for (var setKey in setData.entries) {
        dataSet.addEntry(setKey, setData.entries[setKey]);
      }
    }
    data.addDataSet(dataSet);
  }
  return data;
};

(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Clipboard = function(options) {
    options = options || {};
    _super.call(this, options);
    this.value = null;
    this._attach();
  };

  hui.ui.Clipboard.prototype = {
    _attach : function() {
      hui.on(document, 'paste', this._onPaste.bind(this));
    },
    _onPaste : function(e) {
      this.fire('paste',e);
      console.log('Paste event', e);
      console.log('Clipboard data', e.clipboardData)
      var items = e.clipboardData.items;
      console.log('Clipboard data items', items)
      if (items) {
        console.log('items:', items)
        for (var i = 0; i < items.length; i++) {
          console.log(items[i]);
          if (items[i].type == 'file') {
            this._readFile(items[i].getAsFile());
          }
          if (items[i].type == 'text/plain') {
            items[i].getAsString(function(x) {
              this.fire('text', {text:x});
            }.bind(this));
          }
        }
      }
      var files = e.clipboardData.files;
      console.log('files:', files)
      if (files) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          this._readFile(file);
        }
      }

      var types = e.clipboardData.types;
      console.log('Clipboard data types:', types)
      if (types) {
        for (var i = 0; i < types.length; i++) {
          var data = e.clipboardData.getData(types[i], console.log);
          console.log(data)
        }
      }
      console.log(arguments)
    },
    _readFile : function(file) {
      console.log(file.type)
      var self = this;
      if (/image\//.test(file.type)) {
        var reader = new FileReader();
        reader.onload = function (event) {
          self.fire('image', {base64:reader.result});
        }
        reader.readAsDataURL(file);
      } else if (/text\//.test(file.type)) {
        var reader = new FileReader();
        reader.onload = function (event) {
          self.fire('text', {text:reader.result});
        }
        reader.readAsText(file);
      } else {
        self.fire('file', {file:file});
      }
    }

  };

  hui.extend(hui.ui.Clipboard, _super);
  hui.define('hui.ui.Clipboard', hui.ui.Clipboard);

})(hui.ui.Component);

/** A diagram
 * @constructor
 */
hui.ui.Diagram = function(options) {
  this.options = hui.override({layout: 'D3'}, options);
  this.name = options.name;
  this.nodes = [];
  this.lines = [];
  this.data = {};
  this.translation = {x:0,y:0};
  this.element = hui.get(options.element);
  this.width = this.element.clientWidth;
  this.height = this.element.clientHeight;
  this.layout = hui.ui.Diagram[this.options.layout];
  this.layout.diagram = this;
  hui.ui.extend(this);
  if (options.source) {
    options.source.listen(this);
  }
  this._init();
};

hui.ui.Diagram.create = function(options) {
  options = hui.override({width: null, height: null}, options);

  options.element = hui.build('div', {
    'class': 'hui_diagram',
    parent: options.parent,
    style: {height: options.height + 'px'}
  });

  return new hui.ui.Diagram(options);
};

hui.ui.Diagram.prototype = {
  _init : function() {
    this.background = hui.ui.Drawing.create({
      width: this.width || 0,
      height: this.height || 0
    });
    this.element.appendChild(this.background.element);
    this.fire('added');
  },
  $$layout : function() {
    var newWidth = this.element.clientWidth;
    var newHeight = this.element.clientHeight;
    if (newWidth === this.width && newHeight === this.height) {
      // Only re-layout if size actually changed
      return;
    }
    this.width = newWidth;
    this.height = newHeight;
    this.background.setSize(this.width,this.height);
    this.layout.resize();
    this.layout.resume();
  },
  _getMagnet : function(from,to,node) {
    var margin = 1;
    var size = node.getSize();
    var center = node.getCenter();
    var topLeft = {
        x : center.x - size.width/2 - margin,
        y : center.y - size.height/2 - margin
      },
      bottomRight = {
        x : topLeft.x + size.width + margin * 2,
        y : topLeft.y + size.height + margin * 2
      };
    var hits = [];
    hits = hui.geometry.intersectLineRectangle(from,to,topLeft,bottomRight);
    if (hits.length>0) {
      return hits[0];
    }
    return to;
  },

  // Data ...

  /** @private */
  $objectsLoaded : function(data) {
    this.setData(data);
  },
  setData : function(data) {
    this.data = data;
    this.clear();
    var nodes = data.nodes,
      lines = data.lines || data.edges;
    if (!nodes || !lines) {
      return;
    }
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].type=='icon') {
        this.addIcon(nodes[i]);
      } else {
        this.addBox(nodes[i]);
      }
    }
    for (i = 0; i < lines.length; i++) {
      this.addLine(lines[i]);
    }
    if (this.layout.loaded) {
      this.layout.populate();
    } else {
      this.play();
    }
  },
  /** Deprecated */
  play : function() {
    this.layout.start();
  },
  resume : function() {
    if (this.layout.resume) { this.layout.resume(); }
  },
  expand : function() {
    if (this.layout.expand) { this.layout.expand(); }
  },
  contract : function() {
    if (this.layout.contract) { this.layout.contract(); }
  },
  /** @private */
  $sourceShouldRefresh : function() {
    return hui.dom.isVisible(this.element);
  },
  /** @private */
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      this.width = this.element.clientWidth;
      this.height = this.element.clientHeight;
      this.background.setSize(this.width,this.height);
      if (this.options.source) {
        this.options.source.refreshFirst();
      }
    }
  },
  clear : function() {
    this.layout.clear();
    this.selection = null;
    this.background.clear();
    this.lines = [];
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      hui.dom.remove(this.nodes[i].element);
    }
    this.nodes = [];
    var lines = hui.get.byClass(this.element,'hui_diagram_line_label');
    for (var j = lines.length - 1; j >= 0; j--) {
      hui.dom.remove(lines[j]);
    }
  },

  addBox : function(options) {
    var box = hui.ui.Diagram.Box.create(options,this);
    this.add(box);
  },

  addIcon : function(options) {
    var box = hui.ui.Diagram.Icon.create(options,this);
    this.add(box);
  },
  add : function(widget) {
    var e = widget.element;
    this.element.appendChild(e);
    widget.setCenter({x: this.width / 2, y : this.height / 2});
    this.nodes.push(widget);
  },
  addLine : function(options) {
    var from = this.getNode(options.from),
      to = this.getNode(options.to);
    if (from === null || to === null) {
      hui.log('Unable to build line...');
      hui.log(options);
      return;
    }
    var fromCenter = this._getCenter(from),
      toCenter = this._getCenter(to);
    var lineNode = this.background.addLine({
        from: fromCenter,
        to: toCenter,
        color: options.color || '#999' ,end:{}
      }),
      line = {
        from: options.from,
        fromNode : from,
        to: options.to,
        toNode : to,
        node: lineNode
      };
    if (options.label) {
      line.label = hui.build('span',{
        parent: this.element,
        'class': 'hui_diagram_line_label',
        text: options.label
      });
      this._updateLine(line);
    }
    this.lines.push(line);
  },


  _getCenter : function(widget) {
    return widget.getCenter();
  },
  getNode : function(id) {
    return this._getNode(id,this.nodes);
  },
  getDataNode : function(id) {
    return this._getNode(id,this.data.nodes);
  },
  _getNode : function(id,nodes) {
    if (nodes) {
      for (var i=0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
          return nodes[i];
        }
      }
    }
    return null;
  },

  // Drawing...

  _updateLine : function(line) {
    if (!line.label) {
      return;
    }
    var from = line.node.getFrom(),
      to = line.node.getTo(),
      label = line.label;
    var middle = { x : from.x+(to.x-from.x)/2, y : from.y+(to.y-from.y)/2 };
    //var deg = Math.atan((from.y-to.y) / (from.x-to.x)) * 180/Math.PI;
    line.label.style.webkitTransform='rotate('+line.node.getDegree()+'deg)';
    //line.label.innerHTML = Math.round(hui.geometry.distance(from,to));
    var width = Math.round(hui.geometry.distance(from,to)-30);
    // TODO: cache width + height
    var w = label.huiWidth = label.huiWidth || label.clientWidth;
    var h = label.huiHeight = label.huiHeight || label.clientHeight;
    w = Math.min(w,width);
    hui.style.set(line.label,{
      left : (middle.x - w / 2) + 'px',
      top : (middle.y - h / 2) + 'px',
      maxWidth : Math.max(0, width) + 'px',
      visibility : width > 10 ? '' : 'hidden'
    });
  },
  __nodeMoved : function(widget) {
    var center = this._getCenter(widget);
    for (var i=0; i < this.lines.length; i++) {
      var line = this.lines[i];
      var magnet, magnet2;
      if (line.from == widget.id) {
        magnet = this._getMagnet(line.node.getTo(),center,widget);
        line.node.setFrom(magnet);
        magnet2 = this._getMagnet(center,this._getCenter(line.toNode),line.toNode);
        line.node.setTo(magnet2);
        this._updateLine(line);
      }
      else if (line.to == widget.id) {
        magnet = this._getMagnet(line.node.getFrom(),center,widget);
        line.node.setTo(magnet);
        magnet2 = this._getMagnet(center,this._getCenter(line.fromNode),line.fromNode);
        line.node.setFrom(magnet2);
        this._updateLine(line);
      }
    }
  },
  __select : function(widget) {
    if (this.selection) {
      this.selection.setSelected(false);
    }
    this.selection = widget;
    this.selection.setSelected(true);
  },
  __nodeOpen : function(widget) {
    this.fire('open',this.getDataNode(widget.id));
  }
};

hui.ui.Diagram.D3 = {
  loaded : false,
  diagram : null,

  _load : function() {
    hui.require(hui.ui.getURL('lib/d3.v3/d3.v3.min.js'),function() {
      this.loaded = true;
      this.start();
    }.bind(this));
  },

  resize : function() {
    if (this.layout) {
      this.layout.size([this.diagram.width,this.diagram.height]);
    }
  },

  start : function() {
    if (!this.loaded) {
      this._load();
      return;
    }
    var diagram = this.diagram,
      nodes = diagram.nodes,
      lines = diagram.lines,
      width = diagram.element.clientWidth,
      height = diagram.element.clientHeight;

    for (var i=0; i < lines.length; i++) {
      lines[i].source = this._findById(nodes,lines[i].from);
      lines[i].target = this._findById(nodes,lines[i].to);
    }

    var force = this.layout = d3.layout.force()
            .linkDistance(100)
            .friction(0.9)
            .gravity(0.1)
            .theta(0.3)
            .linkStrength(0.2)
      .charge(-1000)
      .distance(100)
      .nodes(this.diagram.nodes)
      .links(this.diagram.lines)
      .size([width, height]);

    var ticker = function() {
      var sel = diagram.selection ? diagram.selection.id : null;
      var nodes = force.nodes(),
        links = force.links();
      for (var i=0; i < nodes.length; i++) {
        var node = diagram.nodes[nodes[i].index];
        if (node.id!=sel) {
          node.setCenter(nodes[i]);
        }
      }
      for (var j=0; j < links.length; j++) {
        var link = links[j];
        var source = link.source,
          sourceCenter = link.source.center;
        var target = link.target,
          targetCenter = link.target;
        if (source==diagram.selection) {
          sourceCenter = diagram._getCenter(diagram.selection);
        }
        if (target==diagram.selection) {
          targetCenter = diagram._getCenter(diagram.selection);
        }
        var from = diagram._getMagnet(sourceCenter,targetCenter,source);
        var to = diagram._getMagnet(targetCenter,sourceCenter,target);
        link.node.setFrom(from);
        link.node.setTo(to);
        diagram._updateLine(link);
      }
    };
    force.start();
    force.gravity(0.5);
    for (var k=0; k < 10000; k++) {
      force.tick();
    }
    force.gravity(0.1);

    force.on("tick", ticker);

    force.start();
  },

  resume : function() {
    if (this.layout) { this.layout.start(); }
  },
  expand : function() {
    if (this.layout) {
      this.layout.linkDistance(this.layout.linkDistance() * 1.3);
      this.layout.charge(this.layout.charge() * 1.3);
      this.layout.start();
    }
  },
  contract : function() {
    if (this.layout) {
      this.layout.linkDistance(Math.max(0,this.layout.linkDistance() * 0.9));
      this.layout.charge(Math.min(0,this.layout.charge() * 0.9));
      this.layout.start();
    }
  },

  _findById : function(nodes,id) {
    for (var i = nodes.length - 1; i >= 0; i--){
      if (nodes[i].id===id) {
        return i;
      }
    }
    return null;
  },
  _convert : function(data) {
    var nodes = data.nodes;
    data.links = data.edges;
    for (var i = data.links.length - 1; i >= 0; i--){
      var link = data.links[i];
      link.source = this._findById(nodes,link.from);
      link.target = this._findById(nodes,link.to);
    }
    return data;
  },
  populate : function() {
    this.start();
  },
  clear : function() {
    if (this.layout) {
      this.layout.stop();
    }
  }

};


/** A box in a diagram
 * @constructor
 */
hui.ui.Diagram.Box = function(options) {
  this.options = options;
  this.id = options.id;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.center = {};
  this.size = null;
  hui.ui.extend(this);
  hui.ui.Diagram.util.enableDragging(this);
};

hui.ui.Diagram.Box.create = function(options,diagram) {
  options = hui.override({title: 'Untitled', diagram: diagram}, options);
  var e = options.element = hui.build('div', {'class': 'hui_diagram_box'});
  hui.build('h1',{text: options.title, parent: e});
  if (options.properties) {
    var table = hui.build('table', {parent: e});
    for (var i=0; i < options.properties.length; i++) {
      var p = options.properties[i];
      var tr = hui.build('tr',{parent: table});
      hui.build('th',{parent: tr,text: p.label});
      var td = hui.build('td',{parent: tr,text: p.value || ''});
      if (p.hint) {
        hui.build('em',{parent: td, text: p.hint});
      }
    }
  }
  return new hui.ui.Diagram.Box(options);
};

hui.ui.Diagram.Box.prototype = {
  _syncSize : function() {
    if (this.size) {
      return;
    }
    this.size = {
      width : this.element.offsetWidth,
      height : this.element.offsetHeight
    };
  },
  getSize : function() {
    this._syncSize();
    return this.size;
  },
  getCenter : function() {
    return this.center;
  },
  setCenter : function(point) {
    this._syncSize();
    this.center = {x : point.x, y : point.y};
    this._updateCenter();
  },
  _updateCenter : function() {
    this.element.style.top = Math.round(this.center.y - this.size.height / 2) + 'px';
    this.element.style.left = Math.round(this.center.x - this.size.width / 2) + 'px';
  },
  setSelected : function(selected) {
    hui.cls.set(this.element,'hui_diagram_box_selected', selected);
  }
};

if (hui.browser.webkit) {
  hui.ui.Diagram.Box.prototype._updateCenter = function() {
    this.element.style.WebkitTransform = 'translate3d(' + Math.round(this.center.x - this.size.width/2) + 'px,' + Math.round(this.center.y - this.size.height/2) + 'px,0)';
  };
}




/** A box in a diagram
 * @constructor
 */
hui.ui.Diagram.Icon = function(options) {
  this.options = options;
  this.id = options.id;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.center = {};
  hui.ui.extend(this);
  hui.ui.Diagram.util.enableDragging(this);
};

hui.ui.Diagram.Icon.create = function(options,diagram) {
  options = hui.override({icon:'common/folder',diagram:diagram},options);
  var e = options.element = hui.build('div',{'class':'hui_diagram_icon'});
  e.appendChild(hui.ui.createIcon(options.icon,32));
  if (options.title) {
    hui.build('strong',{parent: e, text: options.title});
  }
  return new hui.ui.Diagram.Icon(options);
};

hui.ui.Diagram.Icon.prototype = {
  _syncSize : function() {
    if (this.size) {
      return;
    }
    this.size = {
      width : this.element.offsetWidth,
      height : this.element.offsetHeight
    };
  },
  getSize : function() {
    this._syncSize();
    return this.size;
  },
  getCenter : function() {
    return this.center;
  },
  setCenter : function(point) {
    var e = this.element;
    e.style.top = Math.round(point.y - e.clientHeight / 2) + 'px';
    e.style.left = Math.round(point.x - e.clientWidth / 2) + 'px';
    this.center = {x : point.x, y : point.y};
  },
  setSelected : function(selected) {
    hui.cls.set(this.element, 'hui_diagram_icon_selected', selected);
  }
};

/** Utilities **/

hui.ui.Diagram.util = {
  enableDragging : function(obj) {
    var diagram = obj.options.diagram;
    hui.cls.add(obj.element, 'hui_diagram_dragable');
    var dragState = null;
    hui.drag.register({
      touch : true,
      element : obj.element,
      onStart : function() {
        hui.cls.add(obj.element,'hui_diagram_dragging');
        obj.fixed = true;
      },
      onNotMoved : function() {
        diagram.__select(obj);
        diagram.fire('select', obj.id);
      },
      onBeforeMove : function(e) {
        diagram.__nodeMoved(obj);
        e = hui.event(e);
        obj.element.style.zIndex = hui.ui.nextPanelIndex();
        var pos = obj.getCenter();
        var size = obj.getSize();
        pos = {left: pos.x - size.width / 2, top: pos.y - size.height / 2};
        var diagramPosition = hui.position.get(diagram.element);
        dragState = {
          left : e.getLeft() - pos.left,
          top : e.getTop()-pos.top
        };
        obj.element.style.right = 'auto';
      },
      onMove : function(e) {
        var top = (e.getTop()-dragState.top);
        var left = (e.getLeft()-dragState.left);
        var size = obj.getSize();
        top += size.height/2;
        left += size.width/2;
        obj.setCenter({x:left,y:top});
        obj.px = left;
        obj.py = top;
        diagram.__nodeMoved(obj);
      },
      onEnd : function() {
        hui.cls.remove(obj.element,'hui_diagram_dragging');
        obj.fixed = false;
        hui.log('end');
      }
    });
    hui.listen(obj.element,'dblclick',function(e) {
      diagram.__nodeOpen(obj);
    });
  }
};

/**
 * @constructor
 */
hui.ui.Drawing = function(options) {
  this.options = hui.override({width:200,height:200},options);
  this.element = hui.get(options.element);
  hui.log({width:options.width,height:options.height});
  this.svg = hui.ui.Drawing._build({tag:'svg',parent:this.element,attributes:{width:options.width,height:options.height}});
  this.element.appendChild(this.svg);
  this.name = options.name;
  hui.ui.extend(this);
};

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
    hui.get(options.parent).appendChild(e);
  }
  return new hui.ui.Drawing(options);
};

hui.ui.Drawing.prototype = {
  setSize : function(width,height) {
    this.svg.setAttribute('width',width);
    this.svg.setAttribute('height',height);
    this.svg.style.width = width+'px';
    this.svg.style.height = height+'px';
    this.element.style.width = width+'px';
    this.element.style.height = height+'px';
  },
  clear : function() {
    hui.dom.clear(this.svg);
  },
  addLine : function(options) {
    options.parent = this.svg;
    return hui.ui.Drawing.Line.create(options);
  },
  addRect : function(options) {
    options.parent = this.svg;
    return hui.ui.Drawing.Rect.create(options);
  },
  addCircle : function(options) {
    options.parent = this.svg;
    return hui.ui.Drawing.Circle.create(options);
  },
  addArc : function(options) {
    options.parent = this.svg;
    return hui.ui.Drawing.Arc.create(options);
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
      });
    }
    return element;
  }
};

hui.ui.Drawing._build = function(options) {
  var node = document.createElementNS('http://www.w3.org/2000/svg',options.tag);
  if (options.attributes) {
    for (var att in options.attributes) {
      node.setAttribute(att,options.attributes[att]);
    }
  }
  if (options.parent) {
    options.parent.appendChild(node);
  }
  return node;
};


// Line

hui.ui.Drawing.Line = function(options) {
  this.node = options.node;
  this.endNode = options.endNode;
  this.from = options.from;
  this.to = options.to;
  this._updateEnds();
};

hui.ui.Drawing.Line.create = function(options) {
  if (!options.from) {
    options.from = {x:options.x1,y:options.y1};
  }
  if (!options.to) {
    options.to = {x:options.x2,y:options.y2};
  }

  var attributes = {
    x1 : options.from.x.toFixed(10),
    y1 : options.from.y.toFixed(10),
    x2 : options.to.x.toFixed(10),
    y2 : options.to.y.toFixed(10),
    style : 'stroke:'+(options.color || '#000')+';stroke-width:'+(options.width || 1)
  };

  options.node = hui.ui.Drawing._build({
    tag : 'line',
    parent : options.parent,
    attributes : attributes
  });
  if (options.end) {
    options.endNode = hui.ui.Drawing._build({
      tag : 'path',
      parent : options.parent,
      attributes : {d:'M 0 -1 L 5 10 L -5 10',fill:options.color || '#000'}
    });
  }
  return new hui.ui.Drawing.Line(options);
};

hui.ui.Drawing.Line.prototype = {
  setFrom : function(point) {
    this.from = point;
    this.node.setAttribute('x1',point.x.toFixed(10));
    this.node.setAttribute('y1',point.y.toFixed(10));
    this._updateEnds();
  },
  getFrom : function() {
    return this.from;
  },
  setTo : function(point) {
    this.to = point;
    this.node.setAttribute('x2',point.x.toFixed(10));
    this.node.setAttribute('y2',point.y.toFixed(10));
    this._updateEnds();
  },
  getTo : function() {
    return this.to;
  },
  _updateEnds : function() {
    //var deg = Math.atan((this.from.y-this.to.y) / (this.from.x-this.to.x)) * 180/Math.PI;
    if (this.endNode) {
      var deg = -90 + Math.atan2(this.from.y - this.to.y, this.from.x - this.to.x) * 180 / Math.PI;
      this.endNode.setAttribute('transform','translate('+ ( this.to.x.toFixed(10)) + ',' + ( this.to.y.toFixed(10) ) + ') rotate(' + (deg) + ')');

    }
  },
  getDegree : function() {
    return Math.atan((this.from.y - this.to.y) / (this.from.x - this.to.x)) * 180 / Math.PI;
  }
};



// Circle

hui.ui.Drawing.Circle = function(options) {
  this.node = options.node;
  this.properties = {};
};

hui.ui.Drawing.Circle.create = function(options) {
  var css = [];
  if (options.stroke) {
    if (options.stroke.color) {
      css.push('stroke:' + options.stroke.color);
    }
    if (options.stroke.width) {
      css.push('stroke-width:' + options.stroke.width);
    }
  }
  if (options.fill) {
    css.push('fill:' + options.fill);
  }
  options.node = hui.ui.Drawing._build({
    tag : 'circle',
    parent : options.parent,
    attributes : {
      cx : options.cx,
      cy : options.cy,
      r : options.r,
      style : css.join(';')
    }
  });
  return new hui.ui.Drawing.Circle(options);
};

hui.ui.Drawing.Circle.prototype = {
  setRadius : function(radius) {
    this.node.setAttribute("r", radius);
  },

  setCenter : function(point) {
    this.node.setAttribute('cx', point.x);
    this.node.setAttribute('cy', point.y);
  }
};



// Rect

hui.ui.Drawing.Rect = function(options) {
  this.node = options.node;
};

hui.ui.Drawing.Rect.create = function(options) {
  var css = [];
  if (options.stroke) {
    if (options.stroke.color) {
      css.push('stroke:'+options.stroke.color);
    }
    if (options.stroke.width) {
      css.push('stroke-width:'+options.stroke.width);
    }
  }
  if (options.fill) {
    css.push('fill:'+options.fill);
  }
  options.node = hui.ui.Drawing._build({
    tag : 'rect',
    parent : options.parent,
    attributes : {
      x : options.x,
      y : options.y,
      width : options.width,
      height : options.height,
      style : css.join(';')
    }
  });
  return new hui.ui.Drawing.Circle(options);
};

hui.ui.Drawing.Rect.prototype = {
  setPosition : function(point) {
    this.node.setAttribute('x',point.x);
    this.node.setAttribute('y',point.y);
  }
};


// Arc
hui.ui.Drawing.Arc = function(options) {
  this.node = options.node;
  this.options = hui.override({
    center : {x:100,y:100},
    startDegrees : 0,
    endDegrees : 0,
    innerRadius : 0,
    outerRadius : 0,
    skew: 0,
    fill : '#eee'
  },options);
  this._redraw();
};

hui.ui.Drawing.Arc.create = function(options) {
  var css = [];
  if (options.stroke) {
    if (options.stroke.color) {
      css.push('stroke:'+options.stroke.color);
    }
    if (options.stroke.width) {
      css.push('stroke-width:'+options.stroke.width);
    }
  }
  options.node = hui.ui.Drawing._build({ tag : 'path' ,parent : options.parent, attributes : {fill : options.fill || '#000', style:css.join(';')}});
  var arc = new hui.ui.Drawing.Arc(options);
  return arc;
};

hui.ui.Drawing.Arc.prototype = {

  update : function(options) {
    this.options = hui.override(this.options,options);
    this._redraw();
  },
  _redraw : function() {
    var o = this.options,
      cx = o.center.x,
      cy = o.center.y,
      startRadians = (o.startDegrees || 0) * Math.PI/180,
      closeRadians = (o.endDegrees   || 0) * Math.PI/180,
      r1 = o.innerRadius,
      r2 = o.outerRadius;
    var points = [
      [
        cx + r2 * Math.cos(startRadians),
        cy + r2 * Math.sin(startRadians)
      ],
      [
        cx + r2 * Math.cos(closeRadians),
        cy + r2 * Math.sin(closeRadians)
      ],
      [
        cx + r1 * Math.cos(closeRadians - o.skew),
        cy + r1 * Math.sin(closeRadians - o.skew)
      ],
      [
        cx + r1 * Math.cos(startRadians + o.skew),
        cy + r1 * Math.sin(startRadians + o.skew)
      ]
    ];

    var angleDiff = closeRadians - startRadians;
    var largeArc = (angleDiff % (Math.PI*2)) > Math.PI ? 1 : 0;
    var cmds = [
      "M"+points[0].join(),                 // Move to P0
      "A"+[r2,r2,0,largeArc,1,points[1]].join(),        // Arc to  P1
      "L"+points[2].join(),                 // Line to P2
      "A"+[r1,r1,0,largeArc,0,points[3]].join(),        // Arc to  P3
      "z"                                           // Close path (Line to P0)
    ];
    this.node.setAttribute('d',cmds.join(' '));
  }
};



// Element

hui.ui.Drawing.Element = function(node) {
  this.node = node;
};

hui.ui.Drawing.Element.prototype = {
  setPosition : function(point) {
    this.node.style.left = point.x+'px';
    this.node.style.top = point.y+'px';
  },
  setCenter : function(point) {
    this.node.style.left = (point.x - this.node.clientWidth/2)+'px';
    this.node.style.top = (point.y - this.node.clientHeight/2)+'px';
  }
};


hui.geometry = {
  intersectLineLine : function(a1, a2, b1, b2) {

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b !== 0 ) {
      var ua = ua_t / u_b;
      var ub = ub_t / u_b;

      if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        return {
          x : a1.x + ua * (a2.x - a1.x),
          y : a1.y + ua * (a2.y - a1.y)
        };
      }
    }
    return null;
  },
  intersectLineRectangle : function(a1, a2, r1, r2) {
    var min        = {x : Math.min(r1.x,r2.x),y : Math.min(r1.y,r2.y)};
    var max        = {x : Math.max(r1.x,r2.x),y : Math.max(r1.y,r2.y)};
    var topRight   = {x: max.x, y: min.y };
    var bottomLeft = {x: min.x, y: max.y };

    var inter1 = hui.geometry.intersectLineLine(min, topRight, a1, a2);
    var inter2 = hui.geometry.intersectLineLine(topRight, max, a1, a2);
    var inter3 = hui.geometry.intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = hui.geometry.intersectLineLine(bottomLeft, min, a1, a2);

    var result = [];

    if (inter1 !== null) result.push(inter1);
    if (inter2 !== null) result.push(inter2);
    if (inter3 !== null) result.push(inter3);
    if (inter4 !== null) result.push(inter4);
    return result;
  },
  distance : function( point1, point2 ) {
    var xs = point2.x - point1.x;

    var ys = point2.y - point1.y;

    return Math.sqrt( xs * xs + ys * ys );
  }
};

(function(_super, hui) {

  hui.ui.EditManager = function(options) {
    _super.call(this, options);
    this.options = options;
    this.root = hui.get(options.root);
    this.window = null;
    this.form = null;
    this.saveButton = null;
    this.deleteButton = null;
    this.cancelButton = null;
    this._collect();
    this._attach();
  };

  hui.ui.EditManager.prototype = {
    _collect : function() {
      var root = this.root;
      var desc = hui.findAll('*',root);
      desc.push(root);
      var components = hui.ui.getComponents(function(c) {
        return (c.getElement && desc.indexOf(c.getElement()) !== -1);
      });
      for (var i = 0; i < components.length; i++) {
        var cmp = components[i];
        if (hui.ui.is(cmp,hui.ui.Window)) {
          this.window = cmp;
        }
        else if (hui.ui.is(cmp,hui.ui.Form)) {
          this.form = cmp;
        }
        else if (hui.ui.is(cmp,hui.ui.Button)) {
          var role = cmp.getRole();
          if (role=='save') {
            this.saveButton = cmp;
          }
          else if (role=='delete') {
            this.deleteButton = cmp;
          }
          else if (role=='cancel') {
            this.cancelButton = cmp;
          }
        }
      }
    },
    _attach : function() {
      var self = this;
      this.cancelButton.listen({
        $click : function() {
          self.end();
        }
      });
      this.form.listen({
        $submit : function() {
          self._save();
        }
      });
      this.deleteButton.listen({
        $click : function() {
          self._delete();
        }
      });
    },

    end : function() {
      this._reset();
      this.window.hide();
    },
    makeNew : function() {
      this._reset();
      this.window.show();
      this.form.focus();
      this.deleteButton.disable();
    },
    _save : function() {
      this.window.setBusy(true);
      var self = this;
      var values = this.form.getValues();
      if (this.objectId !== undefined) {
        values.id = this.objectId;
      }
      hui.ui.request({
        url : this.options.save.url,
        json : {data:values},
        $success : function() {
          self._saveSuccess();
        },
        $finally : function() {
          self.window.setBusy(false);
        }
      });
    },
    _reset : function() {
      this.form.reset();
      this.objectId = undefined;
    },
    _saveSuccess : function() {
      var create = this.objectId === undefined;
      this.end();
      this.fire(create ? 'created' : 'updated');
      this.fire('changed');
    },

    edit : function(id) {
      this._reset();
      this.window.setBusy(true);
      this.window.show();
      var self = this;
      hui.ui.request({
        message : {start:{en:'Loading...',da:'Henter...'},delay:300},
        parameters : {id:id},
        url : this.options.read.url,
        $object : function(obj) {
          self.objectId = obj.id;
          self.form.setValues(obj);
          self.deleteButton.setEnabled(true);
          self.window.show();
          self.form.focus();
        },
        $finally : function() {
          self.window.setBusy(false);
        }
      });
    },

    _delete : function(id) {
      var self = this;
      hui.ui.request({
        message : {start:{en:'Deleting...',da:'Sletter...'},delay:300},
        parameters : {id:this.objectId},
        url : this.options.remove.url,
        $success : function(obj) {
          self.end();
          self.fire('removed');
          self.fire('changed');
        }
      });
    }
  };



  hui.extend(hui.ui.EditManager, _super);
})(hui.ui.Component, hui);


(function(_super) {

  /**
   * A component with a value
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   * @param {any} options.value The value
   */
  hui.ui.Editable = function(options) {
    _super.call(this, options);
    this.value = options.value;
  };

  hui.ui.Editable.prototype = {
    setValue : function(value) {
      var changed = value !== this.value;
      this.value = value;
      if (changed) {
        this.fireValueChange();
      }
    },
    getValue : function() {
      return this.value;
    },
    fireValueChange : function() {
      this.fire('valueChanged', this.value);
      hui.ui.firePropertyChange(this, 'value', this.value);
      hui.ui.callAncestors(this, 'childValueChanged', this.value);
    }
  };

  hui.extend(hui.ui.Editable, _super);

})(hui.ui.Component);

/**
 * Editing of documents composed of different parts
 *
 * @constructor
 * @fires hui.ui.Editor#editPart
 * @fires hui.ui.Editor#cancelPart
 * @fires hui.ui.Editor#savePart
 * @fires hui.ui.Editor#addPart
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
  this.enableStructure = true;
  hui.ui.extend(this);
};

/**
 * Get the one and only editor instance
 * @return {hui.ui.Editor}
 */
hui.ui.Editor.get = function() {
  if (!hui.ui.Editor.instance) {
    hui.ui.Editor.instance = new hui.ui.Editor();
  }
  return hui.ui.Editor.instance;
};

hui.ui.Editor.prototype = {
  /** Start the editor */
  ignite : function() {
    //hui.listen(window,'keydown',this._onKeyDown.bind(this));
    //hui.listen(window,'keyup',this._onKeyUp.bind(this));
    this.reload();
  },
  /*
  _onKeyDown : function(e) {
    e = hui.event(e);
    //this.live = e.altKey;
  },
  _onKeyUp : function(e) {
    //this.live = false;
  },*/

  addPartController : function(key,title,controller) {
    this.partControllers.push({key:key,'title':title,'controller':controller});
  },
  setOptions : function(options) {
    hui.override(this.options,options);
  },
  _getPartController : function(key) {
    var ctrl = null;
    hui.each(this.partControllers,function(item) {
      if (item.key==key) {ctrl=item;}
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
      hui.listen(column,'mouseout',function(e) {
        self._onBlurColumn(e);
      });
      if (self.enableStructure)
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
      this._deactivatePart(this.activePart);
    }
    if (this.partControls) {
      this.partControls.hide();
    }
  },


  ///////////////////////// Columns ////////////////////////

  _onHoverColumn : function(column) {
    if (this.hoveredColumn) {
      hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
    }
    this.hoveredColumn = column;
    if (!this.active || this.activePart) {
      return;
    }
    hui.cls.add(column,'hui_editor_column_hover');
  },

  _onBlurColumn : function(e) {
    if (!this.active || !this.hoveredColumn || hui.ui.isWithin(e,this.hoveredColumn)) return;
    hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
  },

  contextColumn : function(column,rowIndex,columnIndex,e) {
    if (!this.active || this.activePart) return;
    if (!this.columnMenu) {
      var menu = hui.ui.Menu.create({name:'huiEditorColumnMenu'});
      menu.addItem({title:'Edit part',value:'editSection'});
      menu.addDivider();
      menu.addItem({title:'Edit column',value:'editColumn'});
      menu.addItem({title:'Remove column',value:'removeColumn'});
      menu.addItem({title:'Add column',value:'addColumn'});
      menu.addDivider();
      menu.addItem({title:'Edit row',value:'editRow'});
      menu.addDivider();
      for (var i=0; i < this.partControllers.length; i++) {
        var ctrl = this.partControllers[i];
        menu.addItem({title:ctrl.title,value:ctrl.key});
      }
      this.columnMenu = menu;
      menu.listen(this);
    }
    this.hoveredRow=rowIndex;
    this.hoveredColumnIndex=columnIndex;
    this.columnMenu.showAtPointer(e);
  },
  /** @private */
  $select$huiEditorColumnMenu : function(value) {
    if (value=='editSection') {
      this._editPart(this.hoveredPart);
    } else if (value=='removeColumn') {
      this.fire('removeColumn',{'row':this.hoveredRow,'column':this.hoveredColumnIndex});
    } else if (value=='editColumn') {
      this.editColumn(this.hoveredRow,this.hoveredColumnIndex);
    } else if (value=='addColumn') {
      this.fire('addColumn',{'row':this.hoveredRow,'position':this.hoveredColumnIndex+1});
    } else if (value=='editRow') {
      this.editRow(this.hoveredRow);
    } else {
      this.fire('addPart',{'row':this.hoveredRow,'column':this.hoveredColumnIndex,'position':0,type:value});
    }
  },

  ///////////////////// Rows //////////////////////

  _editedRow : null,

  editRow : function(rowIndex) {
    this.stopRowEditing();
    var node = hui.get.byClass(this.element,this.options.rowClass)[rowIndex];
    hui.cls.add(node,'hui_editor_row_edit');
    this._editedRow = node;
    var self = this;
    this.fire('editRow',{'index' : rowIndex, node: node});
  },
  stopRowEditing : function() {
    if (this._editedRow) {
      hui.cls.remove(this._editedRow,'hui_editor_row_edit');
      this._editedRow = null;
    }
  },

  ///////////////////// Columns //////////////////////

  _editedColumn : null,

  editColumn : function(rowIndex,columnIndex) {
    this.stopColumnEditing();
    var row = hui.get.byClass(this.element,this.options.rowClass)[rowIndex];
    if (row) {
      var node = hui.get.byClass(row,this.options.columnClass)[columnIndex];
      if (node) {
        this._editedColumn = node;
        hui.cls.add(node,'hui_editor_column_edit');
        this.fire('editColumn',{'rowIndex' : rowIndex, 'index' : columnIndex, node: node});
      }
    }
  },
  stopColumnEditing : function() {
    if (this._editedColumn) {
      hui.cls.remove(this._editedColumn,'hui_editor_column_edit');
      this._editedColumn = null;
    }
  },

  ///////////////////////// Parts //////////////////////////

  hoverPart : function(part,event) {
    if (!this.active || this.activePart || !this.live || this.dragging || this.busy) {
      return;
    }
    this.hoveredPart = part;
    hui.cls.add(part.element,'hui_editor_part_hover');
    var self = this;
    this.partControlTimer = window.setTimeout(function() {self.showPartControls();},200);
  },
  blurPart : function(e) {
    window.clearTimeout(this.partControlTimer);
    if (hui.ui.isWithin(e,this.hoveredPart.element)) {
      return;
    }
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
      this.partEditControls = hui.ui.Overlay.create({name:'huiEditorPartEditActions',variant:'light',zIndex:100});
      this.partEditControls.element.style.zIndex = '99999999';
      this.partEditControls.addIcon('save','common/ok');
      this.partEditControls.addIcon('cancel','common/undo');
      this.partEditControls.addIcon('info','common/info');
      this.partEditControls.listen(this);
      var self = this;
      hui.on(window,'resize',function() {
        hui.onDraw(function() {
          self._positionEditControls();
        });
      });
    }
    this._positionEditControls();
  },
  _positionEditControls : function() {
    if (this.activePart) {
      this.partEditControls.showAtElement(this.activePart.element,{'horizontal':'right','vertical':'topOutside'});
    }
  },
  showPartControls : function() {
    if (!this.partControls) {
      this.partControls = hui.ui.Overlay.create({name:'huiEditorPartActions',variant:'light'});
      this.partControls.addIcon('edit','common/edit');
      this.partControls.addIcon('new','common/new');
      this.partControls.addIcon('delete','common/delete');
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
    } else if (key=='info') {
      this.fire('toggleInfo');
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
    if (this.activePart) {
      this._deactivatePart(this.activePart);
    }
    if (this.hoveredPart) {
      hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
    }
    this.activePart = part;
    this.showPartEditControls();
    hui.cls.add(part.element,'hui_editor_part_active');
    hui.ui.msg({text:{en:'Loading...',da:'Indlæser...'},delay:300,busy:true});
    part.activate(function() {
      hui.ui.hideMessage();
    });
    window.clearTimeout(this.partControlTimer);
    this._hidePartControls();
    if (this.hoveredColumn) {
      hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
    }
    this.fire('editPart',part);
  },
  cancelPart : function(part) {
    part.cancel();
    this._deactivatePart(this.activePart);
    this.activePart = null;
    this.fire('cancelPart',part);
  },
  savePart : function(part) {
    this.busy = true;
    hui.ui.msg({text:{en:'Saving...',da:'Gemmer...'},delay:300,busy:true});
    part.save({
      callback : function() {
        hui.ui.hideMessage();
        this.activePart = null;
        this.busy = false;
        this._deactivatePart(part);
        this.partChanged(part);
        this.fire('savePart',part);
      }.bind(this)
    });
  },
  getEditorForElement : function(element) {
    for (var i=0; i < this.parts.length; i++) {
      if (this.parts[i].element==element) {
        return this.parts[i];
      }
    }
    return null;
  },
  _deactivatePart : function(part) {
    part.deactivate(function() {
      this.partDidDeactivate(part);
      this.fire('deactivatePart',part);
    }.bind(this));
  },
  partDidDeactivate : function(part) {
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
    };
    hui.log('startDrag');
    hui.drag.start({
      element : proxy,
      onBeforeMove : this._onBeforeDrag.bind(this),
      onMove : this._onDrag.bind(this),
      onAfterMove : this._onAfterDrag.bind(this),
      onEnd : function() {

      }
    },e);
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
    }
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
        var partIndex = dropInfo.partIndex;
        if (dragInfo.columnIndex == dropInfo.columnIndex && dragInfo.partIndex < dropInfo.partIndex) {
          partIndex--;
        }
        this.fire('partWasMoved',{dragged:dragged,rowIndex : dropInfo.rowIndex,columnIndex : dropInfo.columnIndex,partIndex : partIndex,
          $success : function() {
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
                hui.style.set(dragged,{transform:'scale(1)',opacity:0,height:''});
                hui.animate({node:dragged,css:{opacity:1},duration:500,ease:hui.ease.slowFastSlow});
              }});
              hui.animate({node:dragged,css:{transform:'scale(0)',height:'0px'},duration:500,ease:hui.ease.slowFastSlow});
            }
            this._cleanDrag();
          }.bind(this),
          $failure : function() {
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
    }
    this.dropTargets = [];
    this._dragging = false;
    if (this._dropMarker) {
      this._dropMarker.style.display='none';
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
        }
      }
    }
    return null;
  },


  _activeDragPlaceholder : null,

  _dragColumnHeights : null,

  _insertDropPlaceholders : function() {
    var infos = this.dropTargets = [];
    var colHeights = this._dragColumnHeights = {};
    var proxy = this.dragProxy;
    var draggedPart = this._dragInfo.draggedElement;
    var rows = hui.get.byClass(document.body,this.options.rowClass);
    for (var i=0; i < rows.length; i++) {
      var row = rows[i];
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
        var k = 0;
        var previous = null;
        var left, right, top;
        var part;
        for (; k < parts.length; k++) {
          part = parts[k];
          var next = parts[k+1];
          previous = parts[k-1];
          left = hui.position.getLeft(part);
          right = left + part.clientWidth;
          top = previous ? hui.position.getTop(previous)+previous.clientHeight/2 : min;
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
          };
          current += part.clientHeight;
          infos.push(info);
          previous = part;
        }
        var last = parts.length>0 ? parts[parts.length-1] : null;
        var position;
        if (last) {
          top = hui.position.getTop(last)+last.clientHeight/2;
          position = hui.position.getTop(last)+last.clientHeight;
        } else {
          top = min;
          position = min;
          left = hui.position.getLeft(column);
          right = left + column.clientWidth;
        }
        if (part) {
          current += part.clientHeight;
        }
        infos.push({
          rowIndex : i,
          columnIndex : j,
          partIndex : k, // TODO 
          part : part,
          left : left,
          right : right,
          top : top,
          position : position,
          bottom : max-top > 20 ? max : top+20
        });
      }
    }
  }
};

hui.ui.Editor.getPartId = function(element) {
  var data = hui.string.fromJSON(element.getAttribute('data'));
  return data ? data.id : null;
};

////////////////////////////////// Header editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Header = function(options) {
  this.element = hui.get(options.element);
  this.id = hui.ui.Editor.getPartId(this.element);
  this.header = hui.get.firstByTag(this.element,'*');
  this.field = null;
};

hui.ui.Editor.Header.prototype = {
  activate : function(callback) {
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
    callback();
  },
  save : function(options) {
    var value = this.field.value;
    this.header.innerHTML = value;
    if (value!=this.value) {
      this.value = value;
    }
    options.callback();
  },
  cancel : function() {

  },
  deactivate : function(callback) {
    this.header.style.visibility='';
    this.element.removeChild(this.field);
    callback();
  },
  updateFieldStyle : function() {
    hui.style.set(this.field,{width:this.header.clientWidth+'px',height:this.header.clientHeight+'px'});
    hui.style.copy(this.header,this.field,['font-size','line-height','margin-top','font-weight','font-family','text-align','color','font-style']);
  },
  getValue : function() {
    return this.value;
  }
};

////////////////////////////////// Html editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Html = function(options) {
  this.element = hui.get(options.element);
  this.id = hui.ui.Editor.getPartId(this.element);
  this.field = null;
};

hui.ui.Editor.Html.prototype = {
  activate : function(callback) {
    this.value = this.element.innerHTML;
    this.element.innerHTML='';
    var style = this.buildStyle();
    this.editor = hui.ui.MarkupEditor.create({autoHideToolbar:false,style:style});
    this.element.appendChild(this.editor.getElement());
    this.editor.listen(this);
    this.editor.setValue(this.value);
    this.editor.focus();
    callback();
  },
  buildStyle : function() {
    return {
      'textAlign' : hui.style.get(this.element,'text-align'),
      'fontFamily' : hui.style.get(this.element,'font-family'),
      'fontSize' : hui.style.get(this.element,'font-size'),
      'fontWeight' : hui.style.get(this.element,'font-weight'),
      'color' : hui.style.get(this.element,'color')
    };
  },
  cancel : function() {
    this.element.innerHTML = this.value;
  },
  save : function(options) {
    var value = this.editor.getValue();
    if (value!=this.value) {
      this.value = value;
    }
    this.element.innerHTML = this.value;
    options.callback();
  },
  deactivate : function(callback) {
    if (this.editor) {
      this.editor.destroy();
      this.element.innerHTML = this.value;
    }
    callback();
  },
  getValue : function() {
    return this.value;
  }
};

(function (_super) {

  var NS = 'http://www.w3.org/2000/svg';

  /**
   * Emotion
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Emotion = function(options) {
    options = options || {};
    _super.call(this, options);
    this.value = null;
    this._attach();
  };

  hui.ui.Emotion.create = function() {
    var node = document.createElementNS(ns,'svg');
    node.addAttribute('width','100');
    node.addAttribute('height','100');
    return new hui.ui.Emotion({element: node})
  }

  hui.ui.Emotion.prototype = {

  };

  hui.extend(hui.ui.Emotion, _super);
  hui.define('hui.ui.Emotion', hui.ui.Emotion);

})(hui.ui.Component);

(function (_super) {

  /**
   * A base foundation
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Foundation = function(options) {
    _super.call(this, options);
    this._attach();
  };

  hui.ui.Foundation.prototype = {
    nodes : {
      resizeNavigation : '.hui_foundation_resize_navigation',
      resizeResults : '.hui_foundation_resize_overlay',
      navigation : '.hui_foundation_navigation',
      results : '.hui_foundation_results',
      content : '.hui_foundation_content',
      main : '.hui_foundation_main',
      actions : '.hui_foundation_actions',
      overlay : '.hui_foundation_overlay',
      toggle : '.hui_foundation_overlay_toggle',
      close : '.hui_foundation_overlay_close',
      details : '.hui_foundation_details',
      detailsToggle : '.hui_foundation_details_toggle',
      back : '.hui_foundation_back'
    },
    _attach : function() {
      var initial = 0,
        navigation = this.nodes.navigation,
        results = this.nodes.results,
        content = this.nodes.content,
        actions = this.nodes.actions,
        overlay = this.nodes.overlay,
        main = this.nodes.main,
        navWidth, fullWidth, resultsWidth, overlayWidth,
        self = this;

      hui.on(this.nodes.toggle,'tap',this._toggleOverlay,this);
      hui.on(this.nodes.close,'tap',this._toggleOverlay,this);
      hui.on(this.nodes.detailsToggle,'tap',this._toggleDetails,this);
      hui.on(this.nodes.back,'tap',this._back,this);

      hui.drag.attach({
        element : this.nodes.resizeNavigation,
        touch: true,
        $startMove : function(e) {
          initial = e.getLeft();
          navWidth = navigation.clientWidth;
          overlayWidth = overlay.clientWidth;
          fullWidth = self.element.clientWidth;
          navigation.style.transition = 'none';
          results.style.transition = 'none';
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          var ratio = (navWidth + diff) / overlayWidth;
          ratio = hui.between(0.3, ratio, 0.7);
          navigation.style.width = (ratio * 100) + '%';
          results.style.left = (ratio * 100) + '%';
          results.style.width = (100 - ratio * 100) + '%';
        },
        $finally : function() {
          navigation.style.transition = '';
          results.style.transition = '';
        }
      });

      hui.drag.attach({
        element : this.nodes.resizeResults,
        touch: true,
        $startMove : function(e) {
          initial = e.getLeft();
          fullWidth = self.element.clientWidth;
          overlayWidth = overlay.clientWidth;
          overlay.style.transition = 'none';
          main.style.transition = 'none';
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          var ratio = (overlayWidth + diff) / fullWidth;
          ratio = hui.between(0.2, ratio, 0.7);
          overlay.style.width = (ratio * 100) + '%';
          main.style.left = (ratio * 100) + '%';
        },
        $finally : function() {
          overlay.style.transition = '';
          main.style.transition = '';
        }
      });
    },
    _toggleOverlay : function() {
      hui.cls.toggle(this.element, 'hui-is-open');
    },
    _toggleDetails : function() {
      hui.cls.toggle(this.element, 'hui-is-details-open');
    },
    _back : function() {
      hui.cls.remove(this.element, 'hui-is-submerged');
    },
    _break : -1,
    $$layout : function() {
      var breaks = [0, 600, 800, 1100, 1400];
      var w = this.element.clientWidth;
      var curr = -1;
      for (var i = 0; i < breaks.length; i++) {
        if (breaks[i] > w) { break; }
        curr = breaks[i];
      }
      if (curr !== this._break) {
        this.nodes.main.style.left = '';
        this.nodes.overlay.style.width = '';
        this.nodes.results.style.width = '';
        this.nodes.results.style.left = '';
        this.nodes.navigation.style.width = '';
        this._break = curr;
      }
    },
    disposeOverlay : function() {
      hui.cls.remove(this.element, 'hui-is-open');
    },
    submerge : function() {
      hui.cls.add(this.element,'hui-is-submerged');
    },
    setBusyMain : function(busy) {
      hui.cls.set(this.nodes.main, 'hui-is-busy', busy);
    }
  };

  hui.extend(hui.ui.Foundation, _super);

})(hui.ui.Component);

/** A graph
 * @constructor
 */
hui.ui.Graph = function(options) {
  this.options = options;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.ready = false;
  this.defered = [];

  this.impl = hui.ui.Graph.D3;

  hui.ui.extend(this);
  hui.log('Initializing implementation...');
  this.impl.init(this);
  if (options.source) {
    options.source.listen(this);
  }
};

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
      hui.log('Defering function');
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
    }
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
  /** @private */
  $$layout : function() {
    hui.log('graph.layoutChanged');
    window.setTimeout(function(){
      this.impl.resize(this.element.parentNode.clientWidth,this.element.parentNode.clientHeight);
    }.bind(this),100);
  }
};

/** @namespace */
hui.ui.Graph.D3 = {
  init : function(parent) {
    this.parent = parent;
    var self = this;
    hui.require(hui.ui.getURL('lib/d3.v3/d3.v3.js'),function() {
      self._init();
      parent.implIsReady();
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
    }
    return null;
  },
  _convert : function(data) {
    var nodes = data.nodes;
    data.links = data.edges;
    for (var i = data.links.length - 1; i >= 0; i--){
      var link = data.links[i];
      link.source = this._findById(nodes,link.from);
      link.target = this._findById(nodes,link.to);
    }
    return data;
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
      .style("stroke-width", function(d) { return d.label=='Friends' ? 3 : 1; })
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
    });
//      node.attr("transform", "translate("+(w*Math.random())+","+(h*Math.random())+")")

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
    .text(function(d) { return d.label; });

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

        node.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; });
    });
    force.start();
    hui.log('Starting...');
  },
  buildIcon : function(icon,parent) {
    var node;
    if (icon=='monochrome/person') {
      node = parent.append('svg:path').attr('class','hui_graph_icon');
      node.attr('d','M-9.315,10c0,0-0.575-2.838,1.863-3.951c1.763-0.799,2.174-0.949,2.512-1.2 c0.138-0.087,0.263-0.198,0.438-0.351c0.661-0.561,0.562-1.324,1.038-1.562c0.474-0.225,0.424,0.238,0.524,0 c0.101-0.225-0.075-1.799,0-1.551c0.062,0.252-0.863-1.636-0.901-2.611C-3.888-2.439-4.702-2.99-4.613-3.651 c0.212-1.513,1.472-2.322,1.472-2.322s-2.423-0.454-1.36-1.478c1.062-1.012,1.474-1.4,2.6-2.076c1.138-0.663,2.674-0.599,4.163,0 C3.749-8.914,4.124-8.489,4.61-7.602c0.425,0.762,0.45,1.326,0.413,1.813C4.986-5.314,5.049-4.926,5.049-4.926 s0.499,0.112,0.513,0.837c0.013,0.687-0.175,1.699-0.551,2.162C4.861-1.752,4.599-1.114,4.197-0.264 C3.812,0.574,3.3,1.898,3.3,1.898s0.012,0.725,0,0.926c-0.039,0.45,0.649,0.012,0.962,0.512c0.312,0.501,0.1,0.85,0.799,1.162 c0.688,0.312,2.639,1.562,3.588,2.151C9.762,7.337,9.262,10,9.262,10H-9.315z').attr('fill-rule','evenodd');
    } else if (icon=='monochrome/folder') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:polygon').attr('fill','#fff').attr('points','9.464,-3.309 9.464,-6.384 -0.354,-6.384 -3.433,-9.462 -9.462,-9.462 -9.462,-3.309 -11.153,-3.309 -9.329,9.462 9.331,9.462 11.153,-3.309');
      node.append('svg:polygon').attr('points','-9.999,-2.309 -8.461,8.462 8.464,8.462 10.001,-2.309');
      node.append('svg:polygon').attr('points','8.464,-5.384 -0.769,-5.384 -3.846,-8.462 -8.461,-8.462 -8.461,-5.384 -8.461,-3.846 8.464,-3.846');
      //node.append('svg:rect').attr('cx','0').attr('cy','0').attr('r','12').attr('fill','#fff');
      //node.append('svg:polygon').attr('points','-10,-2 -8.461,8 8.461,8 10,-2');
      //node.append('svg:polygon').attr('points','8,-5 -0.77,-5 -3.846,-8 -8,-8 -8,-5.384 -8,-4 8,-4');
    } else if (icon=='monochrome/image') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:rect').attr('x','-11').attr('y','-9').attr('width','22').attr('height','18').attr('fill','#fff');
      node.append('svg:path').attr('d','M8-6V6H-8V-6H8 M10-8h-20V8h20V-8L10-8z');
      node.append('svg:circle').attr('cx','-2.818').attr('cy','-2.693').attr('r','1.875');
      node.append('svg:path').attr('d','M-7,5H7v-5.033L4.271-3.625L1.585,2.18L0,0.561c0,0-2.193,0.814-2.917,2.064c-1.151-0.625-1.776,0-1.776,0L-7,5z');
    } else if (icon=='monochrome/news') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:path').attr('d','M10.523-9.273l-1.25-1.25C8.967-10.831,8.559-11,8.125-11s-0.842,0.169-1.148,0.477L5.625-9.173 l-1.352-1.351C3.968-10.83,3.56-11,3.125-11c-0.367,0-0.727,0.126-1.014,0.354L0-8.956l-2.109-1.688 C-2.396-10.873-2.757-11-3.124-11c-0.435,0-0.843,0.169-1.149,0.477l-1.352,1.351l-1.352-1.351C-7.283-10.831-7.691-11-8.125-11 s-0.842,0.169-1.148,0.477l-1.25,1.25C-10.831-8.967-11-8.559-11-8.125v16.25c0,0.434,0.169,0.841,0.477,1.148l1.25,1.25 c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.352-1.351l1.352,1.351c0.309,0.308,0.716,0.476,1.149,0.476 c0.366,0,0.726-0.125,1.012-0.354L0,8.956l2.109,1.688C2.394,10.873,2.755,11,3.125,11c0.44,0,0.852-0.172,1.157-0.485l1.343-1.342 l1.352,1.351c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.25-1.25C10.831,8.966,11,8.559,11,8.125v-16.25 C11-8.559,10.831-8.967,10.523-9.273z').attr('fill','#fff');
      node.append('svg:path').attr('d','M9.816-8.566l-1.25-1.25c-0.244-0.244-0.639-0.244-0.883,0L5.625-7.759L3.566-9.816c-0.225-0.226-0.583-0.245-0.832-0.047 L0-7.675l-2.734-2.188c-0.248-0.198-0.606-0.179-0.832,0.047l-2.059,2.058l-2.059-2.058c-0.244-0.244-0.639-0.244-0.883,0 l-1.25,1.25C-9.934-8.449-10-8.291-10-8.125v16.25c0,0.166,0.066,0.324,0.184,0.441l1.25,1.25c0.244,0.244,0.639,0.244,0.883,0 l2.059-2.058l2.059,2.058c0.226,0.225,0.584,0.244,0.832,0.047L0,7.676l2.734,2.188C2.85,9.956,2.987,10,3.125,10 c0.161,0,0.321-0.061,0.441-0.184l2.059-2.058l2.059,2.058c0.244,0.244,0.639,0.244,0.883,0l1.25-1.25 C9.934,8.449,10,8.291,10,8.125v-16.25C10-8.291,9.934-8.449,9.816-8.566z M-1.25,3.75H-7.5V-2.5h6.25V3.75z M7.5,3.75H0V2.5h7.5 V3.75z M7.5,1.25H0V0h7.5V1.25z M7.5-1.25H0V-2.5h7.5V-1.25z M7.5-3.75h-15V-5h15V-3.75z');
    } else if (icon=='monochrome/warning') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:path').attr('d','M10.672,7.15L2.321-9.432C1.913-10.386,0.984-11-0.057-11c-0.882,0-1.693,0.445-2.173,1.19 c-0.099,0.156-0.176,0.309-0.234,0.459l-8.152,16.403C-10.867,7.46-11,7.929-11,8.411C-11,9.839-9.841,11-8.416,11H8.416 C9.841,11,11,9.839,11,8.411C11,7.969,10.887,7.533,10.672,7.15z').attr('fill','#fff');
      node.append('svg:path').attr('d','M9.8,7.639L1.411-9.013C1.175-9.592,0.607-10-0.057-10c-0.558,0-1.049,0.291-1.333,0.731 c-0.062,0.1-0.116,0.206-0.156,0.316L-9.744,7.543C-9.908,7.795-10,8.091-10,8.411C-10,9.286-9.294,10-8.416,10H8.416 C9.291,10,10,9.286,10,8.411C10,8.13,9.928,7.867,9.8,7.639 M1.613-5.456L1.166,3.906H-1.15l-0.444-9.362H1.613z M0.009,8.869 h-0.02c-1.077,0-1.808-0.792-1.808-1.855c0-1.1,0.751-1.855,1.827-1.855c1.077,0,1.788,0.756,1.81,1.855 C1.818,8.077,1.107,8.869,0.009,8.869');
    } else if (icon=='monochrome/globe') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
      node.append('svg:path').attr('d','M0.048-9.91c-5.496,0-9.955,4.456-9.955,9.954S-5.448,10,0.048,10 S10,5.542,10,0.044S5.544-9.91,0.048-9.91 M6.974-5.686C7.083-5.721,7.47-5.287,7.556-5.406c0.113-0.149-0.407-0.515-0.407-0.668 c0-0.21,0.978,0.964,1.032,1.057c0.013,0.021-0.27-0.136-0.276-0.108C7.883-4.966,7.852-4.809,7.813-4.65 C7.402-4.612,6.57-5.55,6.974-5.686 M2.82,4.227c-0.755,0.929-0.313,1.975-1.71,2.39C0.392,6.831,0.7,8.332-0.506,7.959 c0.069,0.07,0.069,0.171,0.239,0.28c-0.266,0.19-0.57,0.228-0.885,0.322c0.077,0.088,0.285,0.672,0.468,0.605 C-2.344,10-2.666,6.858-3.027,6c-0.271-0.653-1.199-0.954-1.596-1.555C-4.869,4.069-5.025,3.651-5.262,3.27 c-0.565-0.908,0.843-1.993,0.208-2.791C-5.307,0.159-5.762,0.667-6.25,0.026c-0.127-0.167-0.172-0.534-0.226-0.732 C-6.811-0.622-7.312-1.351-7.42-1.242c-0.375,0.375-0.934-0.514-0.891-0.845c0.128-0.971-0.375-1.522,0.148-2.444 c0.793-1.392,1.738-2.674,3.156-3.475c0.827-0.467,2.369-1.355,3.358-1.085C-1.83-9.02-3.658-8.137-3.457-8.079 c0.175,0.052,0.582-0.202,0.69,0.064c0.003,0.118-0.025,0.225-0.089,0.323c0.203,0.299,1.448-0.978,1.707-1.078 c0.506-0.2,0.744,0.327,1.312,0.132c0.396-0.135,0.213,0.623,0.172,0.623c0.066,0,0.53-0.203,0.503,0.042 C0.77-7.379-1.377-8.058-1.604-7.367c-0.061,0.188,0.697-0.175,0.82-0.063c-0.051,0.083-0.109,0.16-0.173,0.236 c0.059,0.117,0.523,0.265,0.573,0.158C-0.434-6.93-1.781-6.76-2.012-6.664c-0.393,0.162-1.07,0.585-1.436,0.911 c-0.217,0.197-0.126,0.482-0.376,0.659c-0.274,0.194-0.561,0.381-0.811,0.608C-4.96-4.19-4.667-3.286-5.028-3.119 c0.102-0.047-0.356-1.584-0.97-0.84C-6.243-3.661-6.733-3.787-7.11-3.42c-0.335,0.327-0.454,0.969-0.391,1.412 c0.149,1.05,0.815-0.293,1.221-0.293c0.271,0-0.46,0.972-0.247,1.128C-6.086-0.85-5.801-1.399-5.96-0.417 c-0.236,1.433,2.149,0.1,2.071-0.053c0.112,0.226-0.282,0.441-0.009,0.629c0.11,0.075,0.096-0.386,0.17-0.464 c0.24-0.251,0.339,0.118,0.551,0.202c0.269,0.11,1.516,0.09,1.595,0.495c0.206,1.011,2.215,0.385,1.633,1.951 c0.065-0.041,0.134-0.066,0.208-0.078c0.485,0.127,0.933,0.55,1.366,0.498C2.539,2.651,3.563,3.32,2.82,4.227 M7.309,0.806 c-1.176-1.099-1.178-3.391-0.12-4.486c-0.12-0.761,0.75-0.87,1.163-0.548c0.3,0.23,0.628,0.978,0.741,1.332 c0.683,2.116,0.578,4.827-0.563,6.78C8.935,3.006,8.911,2.22,9.108,1.319C9.436-0.147,7.744,1.213,7.309,0.806');
    } else if (icon=='monochrome/dot') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
      node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','10');
    } else if (icon=='monochrome/page') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
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
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:path').attr('fill','#fff').attr('d','M8.574,4L3.527,0.971V-11h-7V0.939L-8.575,4H-11v7h22V4H8.574z');
      node.append('svg:polygon').attr('points','8.297,5 2.526,1.537 2.526,-2.5 0.651,-2.5 0.651,-5 2.526,-5 2.526,-10 -2.474,-10 -2.474,-5 -0.599,-5 -0.599,-2.5 -2.474,-2.5 -2.474,1.505 -8.298,5 -10,5 -10,10 -5,10 -5,5 -5.868,5 -1.702,2.5 -0.599,2.5 -0.599,5 -2.474,5 -2.474,10 2.526,10 2.526,5 0.651,5 0.651,2.5 1.702,2.5 5.869,5 5,5 5,10 10,10 10,5');
    } else if (icon=='monochrome/email') {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:path').attr('fill','#fff').attr('d','M10.727-1.695C10.727-7.086,6.645-11,1.02-11c-6.696,0-11.746,5.137-11.746,11.949 C-10.727,7.549-5.713,11-0.76,11c2.283,0,3.872-0.314,5.668-1.121L5.707,9.52L4.701,6.158C8.271,5.922,10.727,2.76,10.727-1.695z');
      node.append('svg:path').attr('d','M4.498,8.967C2.773,9.742,1.281,10-0.76,10c-4.771,0-8.967-3.418-8.967-9.051C-9.727-4.912-5.445-10,1.02-10 c5.086,0,8.707,3.479,8.707,8.305c0,4.225-2.355,6.869-5.459,6.869c-1.35,0-2.328-0.719-2.471-2.211H1.74 C0.82,4.398-0.445,5.174-1.996,5.174c-1.84,0-3.219-1.408-3.219-3.764c0-3.535,2.613-6.695,6.754-6.695 c1.262,0,2.699,0.314,3.391,0.688L4.066,0.748c-0.258,1.695-0.059,2.473,0.748,2.5c1.234,0.057,2.787-1.523,2.787-4.855 c0-3.766-2.414-6.639-6.867-6.639c-4.426,0-8.248,3.42-8.248,8.938c0,4.828,3.045,7.529,7.328,7.529 c1.467,0,3.045-0.318,4.193-0.893L4.498,8.967z M1.969-2.9C1.74-2.957,1.422-3.016,1.078-3.016c-1.898,0-3.391,1.867-3.391,4.08 c0,1.092,0.488,1.781,1.408,1.781c1.092,0,2.213-1.35,2.443-3.018L1.969-2.9z');
    } else {
      node = parent.append('svg:g').attr('class','hui_graph_icon');
      node.append('svg:polygon').attr('fill','#fff').attr('points','0.09,-11 -9.182,-11 -9.182,11 9.182,11 9.182,-1.909');
      node.append('svg:polygon').attr('points','0.91,-8.182 0.91,-2.727 6.365,-2.727');
      node.append('svg:polygon').attr('points','-8.182,-10 -0.91,-10 -0.91,-0.909 8.182,-0.909 8.182,10 -8.182,10');
    }

  }
};

hui.ui.KeyboardNavigator = function(options) {
  options = options || {};
  this.text = '';
  this.items = [];
  this.index = null;
  this.name = options.name;
  hui.listen(window,'keydown',this._onKeyDown.bind(this));
  this.element = hui.build('div',{'class':'hui_keyboardnavigator',parent:document.body});
  this.input = hui.build('p',{'class':'hui_keyboardnavigator_input',parent:this.element});
  this.list = hui.build('ul',{parent:this.element});
  this.listNodes = [];
  hui.ui.extend(this);
};

hui.ui.KeyboardNavigator.prototype = {
  _onKeyDown : function(e) {
    e = hui.event(e.key);
    if (e.metaKey || e.altKey || e.shiftKey || e.leftKey || e.rightKey) {
      return;
    } else if (e.downKey) {
      this._selectNext();
      return;
    } else if (e.upKey) {
      this._selectPrevious();
      return;
    } else if (e.returnKey || e.enterKey) {
      this._select();
      this.text = '';
      this._render();
      return;
    }
    if (e.escapeKey) {
      this.text = '';
    } else if (e.backspaceKey) {
      e.stop();
      if (this.text.length>0) {
        this.text = this.text.substring(0,this.text.length-1);
      } else {
        return;
      }
    } else {
      this.text+=String.fromCharCode(e.keyCode).toLowerCase();
    }
    this._render();
    if (this.text.length>0) {
      this._complete();
    }
  },
  _select : function() {
    if (this.index!==null) {
      this.fire('select',this.items[this.index]);
    }
  },
  _selectPrevious : function() {
    if (this.items.length === 0) {
      return;
    }
    if (this.index === null) {
      this.index = 0;
    } else {
      hui.cls.remove(this.listNodes[this.index],'hui_keyboardnavigator_selected');
    }
    this.index--;
    if (this.index < 0) {
      this.index = this.items.length-1;
    }
    hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
  },
  _selectNext : function() {
    if (this.items.length === 0) {
      return;
    }
    if (this.index===null) {
      this.index = -1;
    } else {
      hui.cls.remove(this.listNodes[this.index],'hui_keyboardnavigator_selected');
    }
    this.index++;
    if (this.index>this.items.length-1) {
      this.index = 0;
    }
    hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
  },
  _render : function() {
    if (!this.text) {
      this.element.style.display='none';
      return;
    }
    hui.dom.setText(this.input,this.text);
    hui.dom.clear(this.list);
    this.listNodes = [];
    this.index = Math.min(this.index,this.items.length-1);
    for (var i=0; i < this.items.length; i++) {
      var item = this.items[i];
      var node = hui.build('li',{text:item.text,parent:this.list});
      this.listNodes.push(node);
    }
    if (this.index>-1) {
      hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
    } else {
      this.index = null;
    }
    this.element.style.display = 'block';
    this.element.style.marginLeft = (this.element.clientWidth/-2)+'px';
    hui.animate({node:this.element,duration:300,ease:hui.ease.slowFastSlow,css:{marginTop:(this.element.clientHeight/-2)+'px'}});
  },
  _complete : function() {
    this.fire('complete',{
      text : this.text,
      callback : function(items) {
        this.items = items;
        this._render();
      }.bind(this)
    });
  }
};

hui.ui.Matrix = function(options) {
  this.options = options = options || {};
  this.element = hui.get(options.element);
  hui.ui.extend(this);
  if (this.options.source) {
    this.options.source.listen(this);
  }
};

hui.ui.Matrix.create = function(options) {
  options.element = hui.build('div',{'class':'hui_matrix',parent:hui.get(options.parent),style:'width: 100%; height: 100%;'});
  return new hui.ui.Matrix(options);
};

hui.ui.Matrix.prototype = {
  $$layout : function() {

  },
  $objectsLoaded : function(data) {
    this.setData(data);
    this.render();
  }
};

/**
 * Media simulator
 * @class
 * @augments hui.ui.Component
 * @param {Object} options
 */
hui.ui.MediaSimulator = function(options) {
  hui.ui.Component.call(this, options);
  this.base = hui.find('.hui_mediasimulator_base',this.element);
  this.left = hui.find('.hui_mediasimulator_base',this.element);
  this._attach();
};

hui.ui.MediaSimulator.prototype = {
  _attach : function() {
    var self = this;
    hui.drag.attach({
      element : hui.find('.hui_mediasimulator_handle-right', this.element),
      $startMove : function(e) {
        this.left = e.getLeft();
        this.width = self.base.clientWidth;
        hui.cls.add(self.element,'is-resizing');
      },
      $move : function(e) {
        self.base.style.maxWidth = Math.max(300, (this.width + ((e.getLeft() - this.left)) * 2)) + 'px';
      },
      $finally : function() {
        hui.cls.remove(self.element,'is-resizing');
      }
    });

    hui.drag.attach({
      element : hui.find('.hui_mediasimulator_handle-bottom', this.element),
      $startMove : function(e) {
        this.top = e.getTop();
        this.height = self.base.clientHeight;
        hui.cls.add(self.element,'is-resizing');
      },
      $move : function(e) {
        self.base.style.maxHeight = Math.max(300, (this.height + ((e.getTop() - this.top)))) + 'px';
      },
      $finally : function() {
        hui.cls.remove(self.element,'is-resizing');
      }
    });
  },
  setSize : function(size) {
    this.base.style.maxWidth = size.width ? size.width + 'px' : '';
    this.base.style.maxHeight = size.height ? size.height + 'px' : '';
  },
  /**
   * @return {Window} The window object of the iframe
   */
  getFrameWindow : function() {
    return hui.frame.getWindow(hui.find('iframe', this.element));
  },
  $$childSizeChanged : function() {
  },
  $$layout : function() {
    hui.log('Layout changed');
  },
  $$draw : function() {
    hui.log('Draw!');
  }
};

hui.extend(hui.ui.MediaSimulator, hui.ui.Component);

(function (_super) {

  /**
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.ModelEditor = function(options) {
    this.options = options;
    _super.call(this, options);
    this._build();
  };

  hui.ui.ModelEditor.prototype = {
    _build : function() {
      var form = this._form = hui.ui.Form.create();
      var group = form.createGroup();
      var model = this.options.model;
      hui.each(model.properties, function(prop) {
        var widget, label;
        if (prop.type == 'text') {
          widget = hui.ui.TextInput.create({key: prop.name});
          label = prop.name;
        }
        else if (prop.type == 'number') {
          widget = hui.ui.NumberInput.create({key: prop.name});
          label = prop.name;
        }
        if (widget) {
          group.add(widget, label);
        }
      });
      document.body.appendChild(form.getElement());
    },
    setValues : function(values) {
      this._form.setValues(values);
    }
  };

  hui.extend(hui.ui.ModelEditor, _super);

})(hui.ui.Component);

(function (_super) {

  var ns = 'hui_presentation';

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Presentation = function(options) {
    _super.call(this, options);
    this.items = [];
    this.images = [];
    hui.cls.add(this.element, 'hui-is-light');
    this.nativeScroll = !!navigator.userAgent.match('iPhone|iPad|iPod|Safari') && !window.chrome && hui.browser.webkitVersion > 603;
    //this.nativeScroll = false;
    this._attach();
  };

  hui.ui.Presentation.create = function(options) {
    options = options || {};
    var makeIcon = function(body, size) {
      return '<svg class="' + ns + '_icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '">' + body + '</svg>';
    };
    /*
    var close = makeIcon(
      '<line class="' + ns + '_line" x1="1" y1="1" x2="31" y2="31"/>' +
      '<line class="' + ns + '_line" x1="1" y1="31" x2="31" y2="1"/>'
    );
    close = makeIcon('<path class="' + ns + '_line" d="M1,1l30,30 M1,31L31,1"/>', 32);
    */
    var close = makeIcon('<path class="' + ns + '_line" d="M1,1l20,20 M1,21L21,1"/>', 22);
    var right = makeIcon('<path class="' + ns + '_line" d="M8.5,31l15-15L8.5,1"/>', 32);
    var left = makeIcon('<path class="' + ns + '_line" d="M23.5,1l-15,15l15,15"/>', 32);
    options.element = hui.build('div', {
      'class' : ns,
      html : '<div class="' + ns + '_viewer id-viewer"><div class="' + ns + '_items id-items"></div></div>' +
        '<div class="' + ns + '_control ' + ns + '_thumbnails id-thumbs"></div>'+
        '<div class="' + ns + '_control ' + ns + '_close id-close">' + close + '</div>'+
        '<div class="' + ns + '_control ' + ns + '_arrow ' + ns + '_next id-next">' + right + '</div>'+
        '<div class="' + ns + '_control ' + ns + '_arrow ' + ns + '_previous id-previous">' + left + '</div>',
      parent: document.body
    });
    if (!hui.browser.touch) {
      hui.cls.add(options.element, 'hui-is-mouse');
    }
    return new hui.ui.Presentation(options);
  };

  hui.ui.Presentation.prototype = {
    position: 0,
    index : 0,
    width: 0,
    animating: false,
    nodes : {
      viewer : '.id-viewer',
      items : '.id-items',
      thumbs : '.id-thumbs',
      close : '.id-close',
      full : '.id-full',
      next : '.id-next',
      previous : '.id-previous'
    },
    _attach : function() {
      hui.on(this.nodes.close,'tap',this.close, this);
      hui.on(this.nodes.next,'tap',this.next, this);
      hui.on(this.nodes.previous,'tap',this.previous, this);
      hui.on(this.nodes.thumbs,'tap',this._tapThumbs, this);
      if (this.nativeScroll) {
        hui.cls.add(this.element, 'hui-is-native-scroll');
        this._attachNative();
      } else {
        this._attachDrag();
      }

      this._keyListener = function(e) {
        e = hui.event(e);
        if (e.escapeKey) {
          this.close();
        } else if (!self.zoomed) {
          if (e.rightKey) {
            this.next();
          } else if (e.leftKey) {
            this.previous();
          }
        }
      }.bind(this);
    },
    close : function(e) {
      if (e) hui.event(e).stop();
      hui.cls.remove(this.element,'hui-is-open');
      this._lockScroll(false);
      hui.unListen(document, 'keydown', this._keyListener);
    },
    _attachNative : function() {
      var x,y;
      var moved = false;
      hui.listen(this.element,'touchstart',function(e) {
        moved = false;
      }.bind(this));
      hui.listen(this.element,'touchmove',function(e) {
        if (e.touches && e.touches.length == 2) {
          if (x===undefined) {x = e.pageX;}
          if (y===undefined) {y = e.pageY;}
          var img = this.images[this.index];
          var newX = e.pageX - x + img.x;
          var newY = e.pageY - y + img.y;
          var scale = (e.scale) * (img.scale);
          img.newScale = scale;
          img.newX = newX;
          img.newY = newY;
          img.node.style.transform =  'scale(' + scale + ') translate(' + (newX)/scale + 'px,' + (newY)/scale + 'px)';
        }
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
        }
        moved = true;
        //console.log('Scale', e.scale);
      }.bind(this));
      hui.listen(this.element,'touchend',function(e) {
        x = y = undefined;
        this.images.forEach(function(img) {
          if (img.newScale) {
            img.scale = img.newScale;
            img.newScale = undefined;
          }
          if (img.newX) {
            img.x = img.newX;
            img.newX = undefined;
          }
          if (img.newY) {
            img.y = img.newY;
            img.newY = undefined;
          }
        });
        if (!moved && hui.dom.isDescendantOrSelf(e.target, this.nodes.viewer)) {
          var img = this.images[this.index];
          if (img.scale != 1) {
            img.node.style.transition = 'transform .3s';
            img.node.style.transform = 'scale(1) translate(0px,0px)';
            setTimeout(function() {
              img.node.style.transition = '';
            },350);
            img.scale = 1;
            img.x = img.y = 0;
          } else {
            this._toggleThumbs();
          }
        }
      }.bind(this));
      var timer;
      var scrollEnd = function() {
        var width = this.nodes.viewer.clientWidth;
        var scrl = this.nodes.viewer.scrollLeft;
        this.index = Math.round(scrl / width);
      }.bind(this);
      hui.listen(this.nodes.viewer,'scroll',function(e) {
        //console.log('Scroll', e);
        clearTimeout(timer);
        timer = setTimeout(scrollEnd,150);
      });
    },
    _originalScroll : 0,
    _lockScroll : function(lock) {
      if (lock) {
        this._originalScroll = document.body.scrollTop;
      }
      lock = lock ? 'hidden' : '';
      document.body.parentNode.style.overflow = lock;
      document.body.style.overflow = lock;
      if (!lock) {
        document.body.scrollTop = this._originalScroll;
      }
    },
    /** Go to the previous image
     * @param {Boolean} user If it is initiated by the user
     */
    previous : function(e) {
      if (e) hui.stop(e);
      this.index--;
      var num = 1;
      if (this.index < 0) {
        this.index = this.items.length - 1;
        num = this.items.length;
      }
      this._goToImage(true,num,true);
    },
    /** Go to the next image
     * @param {Boolean} user If it is initiated by the user
     */
    next : function(e) {
      if (e) hui.stop(e);
      this.index++;
      var num = 1;
      if (this.index==this.items.length) {
        this.index = 0;
        num = this.items.length;
      }
      this._goToImage(true,num,true);
    },
    show : function(params) {
      params = params || {};
      if (params.source) {
        var pos = hui.position.get(params.source);
        hui.cls.add(this.element,'hui-is-minimized');
      }
      hui.cls.add(this.element,'hui-is-open');
      this._calculateSize();
      if (params.items) {
        this.items = params.items;
        this._rebuild();
      }
      if (hui.isNumber(params.index)) {
        this.index = params.index;
        this._goToImage(false, 0, false);
      }
      window.setTimeout(function() {
        this._lockScroll(true);        
      }.bind(this),100)
      hui.listen(document, 'keydown', this._keyListener);
    },
    _tapThumbs : function(e) {
      e = hui.event(e);
      var thumb = e.findByClass(ns + '_thumbnail');
      if (thumb) {
        var index = parseInt(thumb.getAttribute('data'),10);
        this._goTo(index);
      }
    },
    _rebuild : function() {
      this.images = [];
      this.nodes.items.innerHTML = '';
      this.nodes.thumbs.innerHTML = '';
      for (var i = 0; i < this.items.length; i++) {
        var url = hui.ui.callDelegates(this,'getPreview',{item: this.items[i], index: i});
        var item = hui.build('div',{parent : this.nodes.items, 'class' : ns+'_item'});
        var image = hui.build('div',{parent : item, 'class' : ns+'_image'});
        var content = hui.build('div',{parent : image, 'class' : ns+'_image_content'});
        var thumb = hui.build('div',{parent : this.nodes.thumbs, 'class' : ns+'_thumbnail', data:i});
        if (url) {
          content.style.backgroundImage = 'url(' + url + ')';
          thumb.style.backgroundImage = 'url(' + url + ')';
        }
        this.images.push({node:content,scale:1,x:0,y:0});
      }
      hui.cls.set(this.element, 'hui-is-multiple', this.items.length > 1);
      this._updateImages();
    },
    _updateImages : function() {
      if (!this.items.length) { return; }
      var width = this.nodes.viewer.clientWidth,
        height = this.nodes.viewer.clientHeight,
        thumbs = hui.get.children(this.nodes.thumbs);
      var thumbSize = thumbs[0].clientWidth;
      var load = function(url, node) {
        var img = new Image();
        hui.cls.add(node, 'hui-is-busy');
        img.onload = function() {
          node.style.backgroundImage = "url('" + url + "')";
          hui.cls.remove(node, 'hui-is-busy');
        };
        img.src = url;
      };
      var ratio = window.devicePixelRatio > 1 ? 2 : 1;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var url = hui.ui.callDelegates(this,'getImage', {item: item, width: width * ratio, height: height * ratio});
        if (this.images[i].currentUrl != url) {
          this.images[i].currentUrl = url;
          load(url, this.images[i].node);
        }
        //images[i].style.backgroundImage = "url('" + url + "')";
        if (this.items.length > 1) {
          var thmbUrl = hui.ui.callDelegates(this,'getImage',{item: item, width: thumbSize * ratio, height: thumbSize * ratio});
          load(thmbUrl, thumbs[i]);
        }
        //thumbs[i].style.backgroundImage = "url('" + url + "')";
      }
    },
    _calculateSize : function() {
      this.width = this.nodes.viewer.clientWidth;
    },
    $$layout : function() {
      this._calculateSize();
      clearTimeout(this._x);
      this._x = setTimeout(function() {
        this._updateImages();
      }.bind(this), 200)
    },
    _draw : function() {
      this.nodes.items.style.transform = 'translate3d(' + this.position + 'px,0,0)';
    },
    _attachDrag : function() {
      var initial = 0;
      var left = 0;
      var scrl = 0;
      var viewer = this.nodes.viewer;
      var inner = this.nodes.items;
      var max = 0;
      var stmp;
      var currentSlide;
      var speed = 0;
      hui.drag.attach({
        touch : true,
        element : viewer,
        $check : function() {
          return !this.animating;
        }.bind(this),
        $startMove : function(e) {
          initial = e.getLeft();
          scrl = this.position;
          max = (this.items.length-1) * this.width * -1;
          stmp = e.event.timeStamp;
          speed = 0;
        }.bind(this),
        $move : function(e) {
          var latestLeft = left;
          left = e.getLeft();
          var pos = (scrl - (initial - left));
          if (pos > 0) {
            pos = (Math.exp(pos * -0.013) -1) * -80;
          }
          if (pos < max) {
            pos = (Math.exp((pos - max) * 0.013) -1) * 80 + max;
          }
          this.position = pos;
          var dur = (e.event.timeStamp - stmp);
          var curSpeed = dur > 0 ? (latestLeft - left) / dur : 0;
          speed = (speed + curSpeed) / 2;
          //console.log(speed);
          stmp = e.event.timeStamp;
          this._draw();
        }.bind(this),
        $endMove : function(e) {
          var func = (initial - left) < 0 ? Math.floor : Math.ceil;
          this.index = func(this.position * -1 / this.width);
          var num = this.items.length - 1;
          if (this.index==this.items.length) {
            this.index = 0;
            this.index = this.items.length - 1;
          } else if (this.index < 0) {
            this.index = this.items.length - 1;
            this.index = 0;
          } else {
            num = 1;
          }

          this._goToImage(true,num,false,true, Math.abs(speed));
        }.bind(this),
        $notMoved : this._toggleThumbs.bind(this)
      });
    },
    _toggleThumbs : function() {
      if (this.items.length > 1) {
        hui.cls.toggle(this.element,'hui-is-thumbnails');
      }
    },
    _goTo : function(index) {
      if (this.index == index) {
        return;
      }
      var diff = Math.abs(this.index - index);
      this.index = index;
      this._goToImage(true, diff, false);
    },
    _goToImage : function(animate,num,user,drag,speed) {
      if (this.nativeScroll) {
        var viewer = this.nodes.viewer,
          scrl = viewer.clientWidth * this.index;
        if (animate) {
          hui.animate({
            node: viewer,
            duration: 500,
            property: 'scrollLeft',
            value: scrl,
            ease: hui.ease.fastSlow
          });
        } else {
          if (hui.browser.webkitVersion < 603) {
            setTimeout(function() {
              viewer.scrollTo(scrl,0);
            });
          } else {
            this.nodes.viewer.scrollLeft = scrl;
          }
        }
        return;
      }
      speed = speed || 2;
      var initial = this.position;
      var target = this.position = this.index * (this.width) * -1;
      if (animate) {
        var duration, ease;
        if (drag) {
          duration = 300 / speed;
          ease = hui.ease.quadOut;
          duration = Math.min(800,Math.max(200, duration));
        }
        else if (num > 1) {
          duration = Math.min(num * 500, 2000);
          ease = hui.ease.fastSlow;
        } else {
          var end = this.index === 0 || this.index === this.items.length - 1;
          ease = hui.ease.fastSlow; //(end ? hui.ease.elastic : hui.ease.fastSlow);
          if (!user) {
            ease = hui.ease.fastSlow;
          }
          duration = 1000 / speed;
          //duration = (end ? 1000 : 1000 / speed);
        }
        this.animating = true;
        hui.animate({
          node : this.nodes.items,
          //css : {marginLeft : target + 'px'},
          duration : duration,
          ease : ease,
          $render : function(node,v) {
            this.position = initial + (target - initial) * v;
            this._draw();
          }.bind(this),
          $complete : function() {
            this.animating = false;
          }.bind(this)
        });
      } else {
        this._draw();
      }
    }
  };

  hui.extend(hui.ui.Presentation, _super);

  hui.define('hui.ui.Presentation', hui.ui.Presentation);

})(hui.ui.Component);

/** A progress indictator that shows progress from 0% to 100%
  @constructor
*/
hui.ui.ProgressIndicator = function(options) {
  this.element = hui.get(options.element);
  this.options = hui.override({opacity : .1}, options);
  this.size = options.size;
  this.name = options.name;
  this.value = 0;
  this._renderedValue = 0;
  hui.ui.extend(this);
  this._init();
};

/** Creates a new progress bar:
  @param o {Object} Options : {small:false}
*/
hui.ui.ProgressIndicator.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_progressindicator',style:'display: inline-block; vertical-align: middle; width:'+options.size+'px;height:'+options.size+'px;'});
  return new hui.ui.ProgressIndicator(options);
};

hui.ui.ProgressIndicator.prototype = {
  _init : function() {
    this.drawing = hui.ui.Drawing.create({parent:this.element,width:this.size,height:this.size});
    this.arc = this.drawing.addArc({
      center : {x:this.size/2,y:this.size/2},
        startDegrees : -90,
      endDegrees : -90,
        innerRadius : this.size/4,
      outerRadius : this.size/2,
      fill : 'rgba(0,0,0,' + this.options.opacity + ')'
    });
  },
  setValue : function(value) {
    if (value==this.value) {
      return;
    }
    var start = this._renderedValue;
    var dur = Math.max(200,Math.abs(value-start)*1000);
    hui.animate({
      node : this.element,
      duration : dur,
      ease: hui.ease.cubicOut,
      callback : function(node,pos) {
        var p = start+(value-start)*pos;
        this._renderedValue = p;
        this._draw(p);
      }.bind(this)
    });
    this.value = value;
  },
  _draw : function(value) {
    this.arc.update({
      center : {x:this.size/2,y:this.size/2},
      startDegrees : -90,
      endDegrees : Math.min(-90 + value * 360, 269.9999),
      innerRadius : this.size/3,
      outerRadius : this.size/2,
      fill : '#eee'
    });
  },
  reset : function() {
    var start = this._renderedValue;
    this._renderedValue = this.value = 0;
    hui.animate({
      node : this.element,
      duration : 300,
      ease : hui.ease.fastSlow,
      callback : function(node,pos) {
        var x = 1 - pos;
        this.arc.update({
          center : {x:this.size/2,y:this.size/2},
          startDegrees : -90,
          endDegrees : Math.min(-90 + (start+(1-start)*pos) * 360, 269.9999),
          innerRadius : this.size/4 * x,
          outerRadius : this.size/2 * x,
          fill : '#eee'
        });
      }.bind(this)
    });
  }
};

/** @constructor */
hui.ui.RevealingToolbar = function(options) {
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
};

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
};

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
};

(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.StyleEditor = function(options) {
    _super.call(this, options);
    this.value = null;
    this.components = options.components;
    this.queryEditors = [];
    this._attach();
  };

  hui.ui.StyleEditor.create = function(options) {
    options = options || {};
    var element = hui.build('div.hui_styleeditor',{html:'<div class="hui_styleeditor_list"></div>'});
    options.element = element;
    return new hui.ui.StyleEditor(options);
  };

  hui.ui.StyleEditor.prototype = {
    nodes : {
      list : '.hui_styleeditor_list'
    },
    _attach : function() {
      var self = this;
      hui.on(this.element, 'click', function(e) {
        e = hui.event(e);
        var query = e.findByClass('hui_styleeditor_query');
        if (query) {
          self.editQuery(parseInt(query.getAttribute('data-index'), 10));
        }
      });
      var button = hui.ui.Button.create({text:'Add', small:true});
      this.element.appendChild(button.element);
      button.listen({$click:this.add.bind(this)});
    },
    editQuery : function(index) {
      var query = this.value.queries[index];
      win = this.queryEditors[index];
      if (win) {
        win.show();
        return;
      }
      win = hui.ui.Window.create({
        title : this._getQueryDescription(query),
        width: 400,
        padding: 10
      });
      this.queryEditors[index] = win;
      var self = this;
      var overflow = hui.ui.Overflow.create({height: 400});
      win.add(overflow);
      hui.each(this.components,function(component) {
        var form = hui.ui.Form.create();
        form.buildGroup({above:false},[{
          type : 'DropDown', label: 'Display:', options : {key:'display', value:'', items:[
            {value:'',text:'Unchanged'}, {value:'block',text:'Block'}, {value:'flex',text:'Flex'}
          ]}
        },{
          type : 'DropDown', label: 'Flex direction:', options : {key:'flex-direction', value:'', items:[
            {value:'',text:'Unchanged'},
            {value:'row',text:'Row'},{value:'row-reverse',text:'Row reverse'},{value:'Column',text:'column'},{value:'column-reverse',text:'Column reverse'},
            {value:'inherit',text:'Inherit'}, {value:'initial',text:'Initial'}, {value:'unset',text:'Unset'}, {value:'revert',text:'Revert'}
          ]}
        },{
          type : 'StyleLength', label: 'Width:', options : {key:'width', value:''}
        },{
          type : 'ColorInput', label: 'Text color:', options : {key:'color', value:''}
        },{
          type : 'StyleLength', label: 'Max width:', options : {key:'max-width', value:''}
        },{
          type : 'StyleLength', label: 'Min width:', options : {key:'min-width', value:''}
        }]);
        overflow.add(hui.build('div',{text:component.description, style: 'text-transform: uppercase; font-size: 12px;'}));
        form.setValues(self._getComponentValues(query, component));
        overflow.add(form);
        var values = {};
        form.listen({
          $valuesChanged : function(values) {
            var rules = self._getRulesFor({query:index, component:component.name});
            hui.log(component.name, values, rules);
            hui.each(rules,function(rule) {
              if (values[rule.name]!==undefined) {
                rule.value = values[rule.name];
                values[rule.name] = undefined;
              }
            });
            hui.each(values,function(key,value) {
              // TODO We filter out unnamed (could be text filed inside color or other stuff)
              if (key.indexOf('unnamed')!==0 && !hui.isBlank(value)) {
                rules.push({name:key, value:value});
              }
            });
            self.fireValueChange();
          }
        });
      });
      win.show();
    },
    _getComponentValues : function(query,component) {
      var values = {};
      if (query.components) {
        var found = query.components.find(function(other) {
          return other.name == component.name;
        });
        if (found) {
          found.rules.forEach(function(rule) {
            values[rule.name] = rule.value;
          });
        }
      }
      return values;
    },
    add : function() {
      this.value.queries.push({components:[]});
      this.draw();
    },
    setValue : function(value) {
      this.value = value;
      this.draw();
    },
    _getRulesFor : function(params) {
      var query = this.value.queries[params.query];
      var comps = query.components;
      for (var i = 0; i < comps.length; i++) {
        if (comps[i].name == params.component) {
          if (!comps[i].rules) {
            comps[i].rules = [];
          }
          return comps[i].rules;
        }
      }
      var rules = [];
      query.components.push({name:params.component, rules:rules});
      return rules;
    },
    draw : function() {
      this.nodes.list.innerHTML = '';
      if (this.value && this.value.queries) {
        for (var i = 0; i < this.value.queries.length; i++) {
          var query = this.value.queries[i];
          hui.build('div.hui_styleeditor_query',{text:this._getQueryDescription(query), parent: this.nodes.list, 'data-index':i});
        }
      }
    },
    _getQueryDescription : function(query) {
      var text = [];
      var props = ['max-width','min-width','max-height','min-height'];
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (query[prop]) {
          text.push(prop + ': ' + query[prop]);
        }
      }
      if (!text.length) {
        text.push('Anything');
      }
      return text.join(', ');
    },
    $$childSizeChanged : function() {
    },
    $$layout : function() {
    }
  };

  hui.extend(hui.ui.StyleEditor, _super);

})(hui.ui.Component);

/** @namespace */
hui.test = {
  status : null,
  busy : 0,
  run : function(recipe) {
    this.errorHandler = hui.listen(window,'error',function(e) {
      hui.log(e);
      hui.ui.msg.fail({text:'Error ('+e.message+') ['+e.lineno+']'});
      throw e;
    });
    this.status = {failures:0,successes:0};
    this.busy = 0;
    hui.ui.msg({text:'Running test',busy:true});
    this._next(0,recipe);

  },
  _next : function(num,recipe) {
    if (recipe[num]===undefined) {
      this._stop();
      return;
    }
    hui.ui.msg({text:'Running test ('+num+')',busy:true});
    if(typeof(recipe[num])=='function') {
      recipe[num]();
      this._next(num+1,recipe);
    } else {
      window.setTimeout(function(){
        this._next(num + 1, recipe);
      }.bind(this), recipe[num]);
    }
  },
  _stop : function() {
    if (this.busy>0) {
      window.setTimeout(this._stop.bind(this),100);
      return;
    }
    if (this.status.failures>0) {
      hui.ui.msg.fail({text:'Failure',duration:2000});
    } else {
      hui.ui.msg.success({text:'Success',duration:2000});
    }
    hui.unListen(window,'error',this.errorHandler);
  },
  click : function(node,func) {
    this.busy++;
    Syn.click(node,function() {
      if (func) {func();}
      this.busy--;
    }.bind(this));
  },
  type : function(node,text,func) {
    this.busy++;
    Syn.type(node,text,function() {
      if (func) {func();}
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

  assert : {
    equals : function(obj1,obj2,msg) {
      return hui.test.assertEquals(obj1,obj2,msg);
    },
    notEquals : function(obj1,obj2,msg) {
      return hui.test.assertNotEquals(obj1,obj2,msg);
    },
    'false' : function(value,msg) {
      return hui.test.assertFalse(value,msg);
    },
    'true' : function(value,msg) {
      return hui.test.assertTrue(value,msg);
    },
    'defined' : function(value,msg) {
      return hui.test.assertDefined(value,msg);
    }
  },

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
};

/**
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
};

hui.ui.Tiles.prototype = {
  _addBehavior : function() {
  },
  _reveal : function() {
    for (var i=0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      this._bounce(tile);
    }
  },
  _bounce : function(tile) {
    hui.effect.fadeIn({element:tile,delay:Math.random()*500});
  }
};

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
  };
  this._addBehavior();
};

hui.ui.Tile._zIndex = 0;

hui.ui.Tile.prototype = {
  _addBehavior : function() {
    hui.listen(this.element,'click',function(e) {
      e = hui.event(e);
      if (hui.cls.has(e.element,'hui_tile_icon')) {
        var key = e.element.getAttribute('data-hui-key');
        this.fire('clickIcon',{key:key,tile:this});
      }
    }.bind(this));
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
          hui.ui.reLayout();
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
          hui.ui.reLayout();
        }
      });
    }
    this.fullScreen = !this.fullScreen;
  }
};

/**
 * A timeline showing events over time
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
hui.ui.TimeLine = function(options) {
  this.name = options.name;
  this.options = options || {};
  this.element = hui.get(options.element);
  hui.ui.extend(this);
  hui.onReady(this._start.bind(this));
};

hui.ui.TimeLine.prototype = {
  _attach : function() {

  },
  _start : function() {
    this.startTime = new Date().getTime();
    this.background = hui.build('div',{'class':'hui_timeline_bg',parent:this.element});
    this._next();
    window.setTimeout(this.pause.bind(this),20000);
    window.setTimeout(this._addLine.bind(this),2000);
    window.setTimeout(this._addLine.bind(this),4000);
    window.setTimeout(this._addBlock.bind(this),Math.random()*4000);
    window.setTimeout(this._addBlock.bind(this),Math.random()*4000);
    window.setTimeout(this._addBlock.bind(this),Math.random()*4000);
    window.setTimeout(this._addBlock.bind(this),Math.random()*4000);
  },
  _next : function() {
    if (this.paused) return;
    var width = this._getNow();
    this.background.style.width = width+'px';
    this.element.scrollLeft = Math.max(0,width-this.element.clientWidth);
    window.setTimeout(this._next.bind(this),500);
  },
  _setData : function() {

  },
  _addLine : function() {
    var line = hui.build('div',{'class':'hui_timeline_line',parent:this.element});
    line.style.left=this._getNow()+'px';
  },
  _addBlock : function() {
    var line = hui.build('div',{'class':'hui_timeline_block',text:'New word',parent:this.element});
    line.style.left=this._getNow()+'px';
    line.style.width=Math.round(30+Math.random()*100)+'px';
  },
  _getNow : function() {
    return Math.round((new Date().getTime() - this.startTime)/10);
  },
  pause : function() {
    this.paused = true;
  }
};

// MSIE 8-
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
  };
}

// MSIE 7-
// https://gist.github.com/chrisjlee/8960575
if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

(function() {
  if(!window.XMLHttpRequest){

    var AXOs = ['MSXML2.XMLHTTP.6.0', 'MSXML3.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.3.0'];
    var correctAXO = null;

    XMLHttpRequest = function() {
      if (correctAXO === null) {
        var xhr;
        if (window.ActiveXObject) {
          for (var i = 0, c = AXOs.length; i < c; i++) {
            try {
              xhr = new window.ActiveXObject(AXOs[i]);
            } catch (e) { xhr = false; }
            if (xhr) {
              correctAXO = AXOs[i];
              return xhr;
            }
          }
        }
        correctAXO = false;
      }
      if (correctAXO === false) {
        throw new Error('XMLHttpRequest not supported in this browser');
      }
      return new window.ActiveXObject(correctAXO);
    };


  }
}());

if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();

    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;
    if (thisArg === undefined)
      while (++i !== len)
        // checks to see if the key was set
        if (i in this)
          if (func(t[i], i, t))
            res[c++] = t[i];
    else
      while (++i !== len)
        // checks to see if the key was set
        if (i in this)
          if (func.call(thisArg, t[i], i, t))
            res[c++] = t[i];
    res.length = c; // shrink down array to proper size
    return res;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(this);

/**
* @preserve HTML5 Shiv 3.7.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
!function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=t.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=t.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),t.elements=c+" "+a,j(b)}function f(a){var b=s[a[q]];return b||(b={},r++,a[q]=r,s[r]=b),b}function g(a,c,d){if(c||(c=b),l)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():p.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||o.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),l)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return t.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(t,b.frag)}function j(a){a||(a=b);var d=f(a);return!t.shivCSS||k||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||i(a,d),a}var k,l,m="3.7.2",n=a.html5||{},o=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q="_html5shiv",r=0,s={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",k="hidden"in a,l=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){k=!0,l=!0}}();var t={elements:n.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:m,shivCSS:n.shivCSS!==!1,supportsUnknownElements:l,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=t,j(b)}(this,document);

hui.on(function() {
  var configs = document.getElementsByTagName('noscript');
  for (var i = 0; i < configs.length; i++) {
    var type = configs[i].getAttribute('data-type');
    if (type) {
      var options = hui.string.fromJSON(configs[i].textContent);
      options.element = configs[i].parentNode;
      new hui.ui[type](options);
    }
  }
});

hui.on(function() {
  var configs = document.querySelectorAll('*[data-hui]');
  for (var i = 0; i < configs.length; i++) {
    var type = configs[i].getAttribute('data-hui');
    if (type) {
      var children = configs[i].childNodes;
      var options = {};
      if (type.indexOf('{') !== -1) {
        var parts = type.split(' ');
        type = parts[0];
        options = hui.string.fromJSON(parts[1]);
      } else {
        var attr = configs[i].getAttribute('data-options');
        if (attr) {
          options = hui.string.fromJSON(attr);
        } else {
          for (var j = children.length - 1; j >= 0; j--) {
            if (children[j].nodeType == 8) {
              options = hui.string.fromJSON(children[j].nodeValue);
              break;
            }
          }
        }
      }
      options.element = configs[i];
      new hui.ui[type](options);
    }
  }
});

hui.on(function() {
  var configs = document.querySelectorAll('script[type=hui]');
  for (var i = 0; i < configs.length; i++) {
    var data = hui.string.fromJSON(configs[i].textContent);
    data.element = configs[i].parentNode;
    new hui.ui[configs[i].getAttribute('data-type')](data);
  }
});

hui = window.hui || {};

hui._ready = false;

hui.ready = function(delegate) {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded',delegate,false);
  }
  else if(document.addEventListener) {
    document.addEventListener('load', delegate, false);
  }
  else if(typeof window.attachEvent != 'undefined') {
    window.attachEvent('onload', delegate);
  }
  else {
    if(typeof window.onload == 'function') {
      var existing = window.onload;
      window.onload = function() {
        existing();
        delegate();
      };
    } else {
      window.onload = delegate;
    }
  }
};

hui.Color.table = {
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

