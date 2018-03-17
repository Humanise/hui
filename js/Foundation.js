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
    if (options.selection) {
      var selection = hui.ui.get(options.selection);
      selection.listen({
        $select : function(e) {
          this.submerge();
        }.bind(this)
      })
    }
  };

  hui.ui.Foundation.prototype = {
    nodes : {
      resizeNavigation : '.hui_foundation_resize_navigation',
      resizeResults : '.hui_foundation_resize_results',
      navigation : '.hui_foundation_navigation',
      results : '.hui_foundation_results',
      content : '.hui_foundation_content',
      main : '.hui_foundation_main',
      actions : '.hui_foundation_actions',
      overlay : '.hui_foundation_overlay',
      toggle : '.hui_foundation_overlay_toggle',
      close : '.hui_foundation_overlay_close',
      details : '.hui_foundation_details',
      detailsToggle : '.hui_foundation_details_toggle',
      back : '.hui_foundation_back'
    },
    _attach : function() {
      var initial = 0,
        navigation = this.nodes.navigation,
        results = this.nodes.results,
        content = this.nodes.content,
        actions = this.nodes.actions,
        overlay = this.nodes.overlay,
        main = this.nodes.main,
        navWidth, fullWidth, resultsWidth, overlayWidth,
        self = this;

      hui.on(this.nodes.toggle,'tap',this._toggleOverlay,this);
      hui.on(this.nodes.close,'tap',this._toggleOverlay,this);
      hui.on(this.nodes.detailsToggle,'tap',this._toggleDetails,this);
      hui.on(this.nodes.back,'tap',this._back,this);

      hui.drag.attach({
        element : this.nodes.resizeNavigation,
        $startMove : function(e) {
          initial = e.getLeft();
          navWidth = navigation.clientWidth;
          overlayWidth = overlay.clientWidth;
          fullWidth = self.element.clientWidth;
          navigation.style.transition = 'none';
          results.style.transition = 'none';
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          navigation.style.width = ((navWidth + diff) / overlayWidth * 100) + '%';
          results.style.left = ((navWidth + diff) / overlayWidth * 100) + '%';
          results.style.width = (100 - (navWidth + diff) / overlayWidth * 100) + '%';
        },
        $finally : function() {
          navigation.style.transition = '';
          results.style.transition = '';
        }
      });

      hui.drag.attach({
        element : this.nodes.resizeResults,
        $startMove : function(e) {
          initial = e.getLeft();
          fullWidth = self.element.clientWidth;
          overlayWidth = overlay.clientWidth;
          overlay.style.transition = 'none'
          main.style.transition = 'none'
        },
        $move : function(e) {
          var diff = e.getLeft() - initial;
          var ratio = (overlayWidth + diff) / fullWidth;
          overlay.style.width = (ratio * 100) + '%';
          main.style.left = (ratio * 100) + '%';
        },
        $finally : function() {
          overlay.style.transition = ''
          main.style.transition = ''
        }
      });
    },
    _toggleOverlay : function() {
      hui.cls.toggle(this.element, 'hui-is-open');
    },
    _toggleDetails : function() {
      hui.cls.toggle(this.element, 'hui-is-details-open');
    },
    _back : function() {
      hui.cls.remove(this.element, 'hui-is-submerged');
    },
    $$layout : function() {
      var w = this.element.clientWidth;
      if (w < 800) {
        this.nodes.main.style.left = ''
        this.nodes.overlay.style.width = ''
      }
      //this.nodes.content.style.top = h + 'px';
      //console.log('layout')
    },
    disposeOverlay : function() {
      hui.cls.remove(this.element, 'hui-is-open');
    },
    submerge : function() {
      hui.cls.add(this.element,'hui-is-submerged');
    }
  };

  hui.extend(hui.ui.Foundation, _super);

})(hui.ui.Component);