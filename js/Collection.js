(function (_super) {
  /**
   * A collection of objects
   * @constructor
   * @param {Object} options The options
   */
  hui.ui.Collection = function(options) {
    _super.call(this, options);
    if (options && options.source) {
      options.source.listen(this);
    }
    this.data = [];
    this.items = [];
    this._attach();
  };

  /**
   * Creates a new instance of a collection
   */
  hui.ui.Collection.create = function(options) {
    options = hui.override({}, options);
    options.element = hui.build('div', {
      'class': 'hui_collection',
      html: '<div class="hui_collection_body"></div>'
    });
    return new hui.ui.Collection(options);
  };

  hui.ui.Collection.prototype = {
    nodes : {
      body : '.hui_collection_body',
      empty : '.hui_collection_empty',
    },
    _attach : function() {
      hui.listen(this.element, 'click', this._click.bind(this));
    },
    setData : function(data) {
      this.data = data;
      this._clear();
      this.items = [];
      for (var i = 0; i < data.length; i++) {
        var node = hui.build('div.hui_collection_item');
        var rendition = hui.ui.callDelegates(this, 'render', data[i]);
        if (rendition) {
          node.appendChild(rendition);
        }
        this.items.push(node);
        this.nodes.body.appendChild(node);
      }
      this.nodes.body.style.display = this.items.length ? '' : 'none';
      if (this.nodes.empty) {
        this.nodes.empty.style.display = this.items.length ? 'none' : '';      
      }
    },
    _clear : function() {
      hui.ui.destroyDescendants(this.body);
      this.nodes.body.innerHTML = '';
    },
    $$objectsLoaded : function(objects) {
      this.setData(objects)
    },
    _click : function(e) {
      e = hui.event(e);
      var item = e.closest('.hui_collection_item');
      if (item) {
        var idx = this.items.indexOf(item);
        this.fire('select', {data: this.data[idx]});
      }
    }
  };

  hui.extend(hui.ui.Collection, _super);

})(hui.ui.Component);