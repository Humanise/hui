(function (_super) {

  /**
   * A dock
   * @param {Object} The options
   * @constructor
   */
  hui.ui.Dock = function(options) {
    this.options = options;
    this.element = hui.get(options.element);
    this.name = options.name;
    _super.call(this, options);
    this._attach();
  };

  hui.ui.Dock.prototype = {
    nodes : {
      iframe: '.hui_dock_frame',
      resizer: '.hui_dock_sidebar_line',
      sidebar: '.hui_dock_sidebar',
      main: '.hui_dock_main'
    },
    _attach : function() {
      if (hui.browser.msie) {
        hui.cls.add(this.element,'hui-is-legacy');
      }
      hui.ui.listen({
        $frameLoaded : function(win) {
          if (win == hui.frame.getWindow(this.nodes.iframe)) {
            this._setBusy(false);
          }
        }.bind(this)
      });
      hui.listen(this.nodes.iframe,'load',this._load.bind(this));
      if (this.nodes.resizer) {
        hui.drag.register({
          element : this.nodes.resizer,
          onStart : function() {
            this.hasDragged = false;
            hui.cls.add(this.element,'hui-is-resizing');
          }.bind(this),
          onMove : function(e) {
            var left = e.getLeft();
            if (left<10) {
              left=10;
            }
            this._updateSidebarWidth(left);
            if (!this.hasDragged) {
              hui.cls.remove(this.element,'hui-is-collapsed');
            }
            this.hasDragged = true;
          }.bind(this),
          onEnd : function() {
            if (!this.hasDragged) {
              this.toggle();
            } else if (this.latestWidth==10) {
              this.collapse();
            } else {
              this.latestExpandedWidth = this.latestWidth;
            }
            hui.cls.remove(this.element,'hui-is-resizing');
            hui.ui.callVisible(this);
            hui.ui.reLayout();
          }.bind(this)
        });
      }
    },
    _updateSidebarWidth : function(width) {
      this.latestWidth = width;
      this.nodes.sidebar.style.width = (width-1)+'px';
      this.nodes.main.style.left = width+'px';
      this.nodes.resizer.style.left = (width-5)+'px';
    },
    /** Change the url of the iframe
     * @param {String} url The url to change the iframe to
     */
    setUrl : function(url) {
      this._setBusy(true);
      hui.frame.getDocument(this.nodes.iframe).location.href=url;
    },
    collapse : function() {
      hui.cls.add(this.element,'hui-is-collapsed');
      this._updateSidebarWidth(10);
      hui.ui.callVisible(this);
    },
    expand : function() {
      hui.cls.remove(this.element,'hui-is-collapsed');
      this._updateSidebarWidth(this.latestExpandedWidth || 200);
      hui.ui.callVisible(this);
    },
    toggle : function() {
      if (hui.cls.has(this.element,'hui-is-collapsed')) {
        this.expand();
      } else {
        this.collapse();
      }
    },
    _load : function() {
      this._setBusy(false);
    },
    _setBusy : function(busy) {
      hui.cls.set(this.element, 'hui-is-busy', busy);
    }
  };
  hui.extend(hui.ui.Dock, _super);

  hui.define('hui.ui.Dock', hui.ui.Dock);

})(hui.ui.Component);