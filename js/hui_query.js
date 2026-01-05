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
  removeClass : function(cls) {
    return this.each(function(node) {
      hui.cls.remove(node, cls);
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