(function (_super) {

  /**
   * A base foundation
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Foundation = function(options) {
    _super.call(this, options);
    this._attach();
  }

  hui.ui.Foundation.prototype = {
    nodes : {
      resizeNavigation : '.hui_foundation_resize_navigation',
      resizeResults : '.hui_foundation_resize_results',
      navigation : '.hui_foundation_navigation',
      results : '.hui_foundation_results',
      content : '.hui_foundation_content',
      actions : '.hui_foundation_actions',
      toggle : '.hui_foundation_overlay_toggle',
      details : '.hui_foundation_details',
      detailsToggle : '.hui_foundation_details_toggle'
    },
    _attach : function() {
      var initial = 0,
        navigation = this.nodes.navigation,
        results = this.nodes.results,
        content = this.nodes.content,
        actions = this.nodes.actions,
        navWidth, fullWidth, resultsWidth,
        self = this;

      hui.on(this.nodes.toggle,'tap',this._toggleOverlay,this);
      hui.on(this.nodes.detailsToggle,'tap',this._toggleDetails,this);

      hui.drag.register({
        element : this.nodes.resizeNavigation,
        $startMove : function(e) {
          initial = e.getLeft();
          navWidth = navigation.clientWidth;
          resultsWidth = results.clientWidth;
          fullWidth = self.element.clientWidth;
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          navigation.style.width = ((navWidth + diff) / fullWidth * 100) + '%';
          results.style.left = ((navWidth + diff) / fullWidth * 100) + '%';
          content.style.left = ((navWidth + resultsWidth + diff + 1) / fullWidth * 100) + '%';
          actions.style.left = ((navWidth + resultsWidth + diff + 1) / fullWidth * 100) + '%';
        }
      })

      hui.drag.register({
        element : this.nodes.resizeResults,
        $startMove : function(e) {
          initial = e.getLeft();
          navWidth = navigation.clientWidth;
          resultsWidth = results.clientWidth;
          fullWidth = self.element.clientWidth;
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          results.style.width = ((resultsWidth + diff) / fullWidth * 100) + '%';
          content.style.left = ((navWidth + resultsWidth + diff + 1) / fullWidth * 100) + '%';
          actions.style.left = ((navWidth + resultsWidth + diff + 1) / fullWidth * 100) + '%';
        }
      })
    },
    _toggleOverlay : function() {
      hui.cls.toggle(this.element,'hui-is-open')
    },
    _toggleDetails : function() {
      hui.cls.toggle(this.nodes.details,'hui-is-open')
    },
    $$layout : function() {
      var h = this.nodes.actions.clientHeight;
      this.nodes.content.style.top = h + 'px'
    },
    disposeOverlay : function() {
      hui.cls.remove(this.element,'hui-is-open')
    }
  }

  hui.extend(hui.ui.Foundation, _super);

})(hui.ui.Component);