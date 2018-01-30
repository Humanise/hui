/**
 * A dock
 * @param {Object} The options
 * @constructor
 */
hui.ui.Dock = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.iframe = hui.get.firstByTag(this.element,'iframe');
  this.progress = hui.get.firstByClass(this.element,'hui_dock_progress');
  this.resizer = hui.get.firstByClass(this.element,'hui_dock_sidebar_line');
  this.bar = hui.get.firstByClass(this.element,'hui_dock_bar');
  hui.listen(this.iframe,'load',this._load.bind(this));
  this.name = options.name;
  hui.ui.extend(this);
  this.busy = true;
  hui.ui.listen(this);
  this._attach();
};

hui.ui.Dock.prototype = {
  _attach : function() {
    if (this.resizer) {
      this.sidebar = hui.get.firstByClass(this.element,'hui_dock_sidebar');
      this.main = hui.get.firstByClass(this.element,'hui_dock_sidebar_main');
      hui.drag.register({
        element : this.resizer,
        onStart : function() {
          this.hasDragged = false;
          hui.cls.add(this.element,'hui_dock_sidebar_resizing');
          this._setBusy(true);
        }.bind(this),
        onMove : function(e) {
          var left = e.getLeft();
          if (left<10) {
            left=10;
          }
          this._updateSidebarWidth(left);
          if (!this.hasDragged) {
            hui.cls.remove(this.element,'hui_dock_sidebar_collapsed');
          }
          this.hasDragged = true;
        }.bind(this),
        onEnd : function() {
          this._setBusy(false);
          if (!this.hasDragged) {
            this.toggle();
          } else if (this.latestWidth==10) {
            this.collapse();
          } else {
            this.latestExpandedWidth = this.latestWidth;
          }
          hui.cls.remove(this.element,'hui_dock_sidebar_resizing');
          hui.ui.callVisible(this);
          hui.ui.reLayout();
        }.bind(this)
      });
    }
  },
  _updateSidebarWidth : function(width) {
    this.latestWidth = width;
    this.sidebar.style.width = (width-1)+'px';
    this.main.style.left = width+'px';
    this.resizer.style.left = (width-5)+'px';
  },
  /** Change the url of the iframe
   * @param {String} url The url to change the iframe to
   */
  setUrl : function(url) {
    this._setBusy(true);
    hui.frame.getDocument(this.iframe).location.href=url;
  },
  collapse : function() {
    hui.cls.add(this.element,'hui_dock_sidebar_collapsed');
    this._updateSidebarWidth(10);
    hui.ui.callVisible(this);
  },
  expand : function() {
    hui.cls.remove(this.element,'hui_dock_sidebar_collapsed');
    this._updateSidebarWidth(this.latestExpandedWidth || 200);
    hui.ui.callVisible(this);
  },
  toggle : function() {
    if (hui.cls.has(this.element,'hui_dock_sidebar_collapsed')) {
      this.expand();
    } else {
      this.collapse();
    }
  },
  _load : function() {
    this._setBusy(false);
  },
  _setBusy : function(busy) {
    if (busy) {
      hui.style.set(this.progress,{
        display: 'block',
        height: this.iframe.clientHeight + 'px',
        width: this.iframe.clientWidth + 'px'
      });
    } else {
      this.progress.style.display = 'none';
    }
  },
  /** @private */
  $frameLoaded : function(win) {
    if (win==hui.frame.getWindow(this.iframe)) {
      this._setBusy(false);
    }
  }
};