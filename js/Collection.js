/**
 * A collection of objects
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Collection = function(options) {
  this.options = hui.override({
  }, options);
  this.element = hui.get(options.element);
  this.name = options.name;
  if (this.options.source) {
    this.options.source.listen(this);
  }
  hui.ui.extend(this);
};

/**
 * Creates a new instance of a collection
 */
hui.ui.Collection.create = function(options) {
  options = hui.override({
  }, options);

  var element = options.element = hui.build('div', {
    'class': 'hui_collection'
  });
  return obj;
};

hui.ui.Collection.prototype = {
  setData : function() {
    
  },
  _rebuild : function() {
    
  },
  $$objectsLoaded : function(objects) {
    console.log(objects)
  }
};