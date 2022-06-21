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
      this.context = '/';
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
 *  element : Element, // the element to show at
 *  widget : Widget, // the widget to show at
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
  options = hui.override({method:'post',parameters:{}},options);
  if (options.json) {
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

