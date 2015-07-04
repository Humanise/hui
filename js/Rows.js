(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Rows = function(options) {
    _super.call(this, options);
    this._attach();
  }
  
  hui.ui.Rows.prototype = {
    _attach : function() {
    },
    $$layout : function() {
    }
  }

  hui.extend(hui.ui.Rows, _super);

})(hui.ui.Component);