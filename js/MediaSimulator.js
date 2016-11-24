(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.MediaSimulator = function(options) {
    _super.call(this, options);
    this._attach();
  }

  hui.ui.MediaSimulator.prototype = {
    _attach : function() {
      var self = this;
      hui.on(this.element, 'click', function(e) {
        e = hui.event(e);
        
      })
    },
    $$childSizeChanged : function() {
    },
    $$layout : function() {
      hui.log('Layout changed')
    }
  }

  hui.extend(hui.ui.MediaSimulator, _super);

})(hui.ui.Component);