/**
 * Media simulator
 * @class
 * @augments hui.ui.Component
 * @param {Object} options
 */
hui.ui.MediaSimulator = function(options) {
  hui.ui.Component.call(this, options);
  this.base = hui.find('.hui_mediasimulator_base',this.element)
  this.left = hui.find('.hui_mediasimulator_base',this.element)
  this._attach();
}

hui.ui.MediaSimulator.prototype = {
  _attach : function() {
    var self = this;
    hui.drag.attach({
      element : hui.find('.hui_mediasimulator_handle-right', this.element),
      $startMove : function(e) {
        this.left = e.getLeft();
        this.width = self.base.clientWidth;
        hui.cls.add(self.element,'is-resizing');
      },
      $move : function(e) {
        self.base.style.maxWidth = Math.max(300, (this.width + ((e.getLeft() - this.left)) * 2)) + 'px';
      },
      $finally : function() {
        hui.cls.remove(self.element,'is-resizing');
      }
    });

    hui.drag.attach({
      element : hui.find('.hui_mediasimulator_handle-bottom', this.element),
      $startMove : function(e) {
        this.top = e.getTop();
        this.height = self.base.clientHeight;
        hui.cls.add(self.element,'is-resizing');
      },
      $move : function(e) {
        self.base.style.maxHeight = Math.max(300, (this.height + ((e.getTop() - this.top)))) + 'px';
      },
      $finally : function() {
        hui.cls.remove(self.element,'is-resizing');
      }
    });
  },
  setSize : function(size) {
    this.base.style.maxWidth = size.width ? size.width + 'px' : '';
    this.base.style.maxHeight = size.height ? size.height + 'px' : '';
  },
  /**
   * @return {Window} The window object of the iframe
   */
  getFrameWindow : function() {
    return hui.frame.getWindow(hui.find('iframe', this.element));
  },
  $$childSizeChanged : function() {
  },
  $$layout : function() {
    hui.log('Layout changed')
  },
  $$draw : function() {
    hui.log('Draw!')
  }
}

hui.extend(hui.ui.MediaSimulator, hui.ui.Component);