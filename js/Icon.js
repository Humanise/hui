hui.component('Icon', {
  state: {
    icon: undefined,
    size: undefined
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
  create : function(params) {
    return hui.ui.createIcon(params.icon, params.size);
  },
  '!click'() {
    this.fire('click')
  },
  setSize : function(size) {
    this.change({size:size})
  },
  draw : function(changed) {
    if ('icon' in changed || 'size' in changed) {
      var iconNode = this.nodes.icon || this.element;
      hui.ui.setIconImage(iconNode, this.state.icon, this.state.size);
      iconNode.className = 'hui_icon hui_icon_' + this.state.size;
      if (hui.cls.has(this.element, 'hui_icon_labeled')) {
        this.element.className = 'hui_icon_labeled hui_icon_labeled_' + this.state.size;
      }
    }
  }
});