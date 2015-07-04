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
  }
  
  hui.ui.Rows.prototype = {
    _attach : function() {
      var children = hui.get.children(this.element);
      for (var i = 0; i < children.length; i++) {
        this.rows.push({
          node : children[i]
        });
      }
    },
    $$layout : function() {
      var fullHeight = this.element.parentNode.clientHeight;
      this.element.style.height = fullHeight + 'px';
      var count = this.rows.length;
      for (var i = 0; i < count; i++) {
        var row = this.rows[i];
        row.node.style.height = (fullHeight/count) + 'px';
      }
    }
  }

  hui.extend(hui.ui.Rows, _super);

})(hui.ui.Component);