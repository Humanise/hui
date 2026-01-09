hui.component('Icon', {
  state: {
    icon: undefined,
    size: 16
  },
  nodes : {
    'icon' : '.hui_icon'
  },
  init(params) {
    this.state.icon = params.icon;
    if (params.size) {
      this.state.size = params.size;
    }
  },
  create : function(options) {
    return hui.ui.createIcon(options.icon, options.size, 'span');
  },
  '!click'() {
    this.fire('click')
  },
  setSize : function(size) {
    this.change({size:size})
  },
  draw : function(changed) {
    if ('size' in changed) {
      var iconNode = this.nodes.icon;
      hui.ui.setIconImage(iconNode, this.state.icon, changed.size);
      iconNode.className = 'hui_icon hui_icon_' + changed.size;
      if (hui.cls.has(this.element, 'hui_icon_labeled')) {
        this.element.className = 'hui_icon_labeled hui_icon_labeled_' + changed.size;
      }
    }
  }
});