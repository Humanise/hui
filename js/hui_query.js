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
  each : function(fn) {
    this._context.forEach(fn);
    return this;
  }
};