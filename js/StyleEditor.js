(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.StyleEditor = function(options) {
    _super.call(this, options);
    this.rows = [];
    this._attach();
  }

  hui.ui.StyleEditor.create = function(options) {
    options = options || {};
    var element = hui.build('div.hui_styleeditor');
    options.element = element;
    return new hui.ui.StyleEditor(options);
  }

  hui.ui.StyleEditor.prototype = {
    _attach : function() {

    },
    setValue : function(value) {
      hui.log(value);
    },
    $$childSizeChanged : function() {
    },
    $$layout : function() {
    }
  }

  hui.extend(hui.ui.StyleEditor, _super);

})(hui.ui.Component);