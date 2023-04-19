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