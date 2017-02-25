(function (_super) {

  /**
   * A base skeleton
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Skeleton = function(options) {
    this.nodes = {
      resizeNavigation : '.hui_skeleton_resize_navigation',
      resizeResults : '.hui_skeleton_resize_results',
      navigation : '.hui_skeleton_navigation',
      results : '.hui_skeleton_results',
      content : '.hui_skeleton_content',
      actions : '.hui_skeleton_actions',
      toggle : '.hui_skeleton_overlay_toggle',
      details : '.hui_skeleton_details',
      detailsToggle : '.hui_skeleton_details_toggle'
    }
    _super.call(this, options);
    this._attach();
  }

  hui.ui.Skeleton.prototype = {
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

  hui.extend(hui.ui.Skeleton, _super);

})(hui.ui.Component);