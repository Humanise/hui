hui.on(['hui.ui'], function() { hui.ui.make(

  /** @lends hui.ui.Icon.prototype */
  {
    name : 'Icon',
    /**
     * @constructs hui.ui.Icon
     * @extends hui.ui.Component
     * @param params
     * @param params.icon {String} The icon
     */
    $init : function(params) {
      this.visible = false;
      this.icon = params.icon;
      this.labeled = false;
    },
    $build : function(params) {
      return hui.ui.createIcon(params.icon, params.size, 'span');
    },
    $events : {
      //root : {click: 'click!'}
      root : {click: function() {
        this.fire('click')
      }}
    },
    /**
     * Change the icon size
     * @param size {Number} The size in pixels: 16, 32 etc.
     */
    setSize : function(size) {
      var iconNode = hui.find('span', this.element) || this.element;
      this.size = size;
      hui.ui.setIconImage(iconNode, this.icon, size);
      iconNode.className = 'hui_icon hui_icon_' + size;
      if (hui.cls.has(this.element, 'hui_icon_labeled')) {
        this.element.className = 'hui_icon_labeled hui_icon_labeled_' + size;
      }
    }
  }

);});