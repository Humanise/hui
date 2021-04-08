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
    this.data = data;
    this._clear();
    this.items = [];
    for (var i = 0; i < data.length; i++) {
      var rendition = hui.ui.callDelegates(this, 'render', data[i]);
      if (!rendition) {
        rendition = hui.build('div', {text: data[i].toString()});
      }
      hui.cls.add(rendition,'hui_collection_item')
      if (this.selectable) {
        hui.cls.set(rendition, this.selectionClass, this._isSelected(i))
      }
      this.items.push(rendition);
      this.element.appendChild(rendition);
    }
    if (this.nodes.empty) {
      this.nodes.empty.style.display = this.items.length ? 'none' : '';
    }
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