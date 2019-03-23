(function (_super) {

  var NS = 'http://www.w3.org/2000/svg';

  /**
   * Emotion
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Emotion = function(options) {
    options = options || {};
    _super.call(this, options);
    this.value = null;
    this._attach();
  };

  hui.ui.Emotion.create = function() {
    var node = document.createElementNS(ns,'svg');
    node.addAttribute('width','100');
    node.addAttribute('height','100');
    return new hui.ui.Emotion({element: node})
  }

  hui.ui.Emotion.prototype = {

  };

  hui.extend(hui.ui.Emotion, _super);
  hui.define('hui.ui.Emotion', hui.ui.Emotion);

})(hui.ui.Component);