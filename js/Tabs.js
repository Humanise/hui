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