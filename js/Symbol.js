hui.component('Symbol', {
  state: {
    symbol: null,
    size: 16
  },
  nodes : {
    'svg' : 'svg',
    'use' : 'use'
  },
  create(options) {
    var s = this.state.size + 'px';
    return hui.build('a.hui_symbol', {
      html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><use xlink:href="../../symbols/all.svg#icon-' + this.state.symbol + '"></use></svg>',
      style: { width: s, height: s, fontSize: s }
    });
  },
  '!click'() {
    this.fire('click')
  },
  draw(changed) {
    if ('symbol' in changed) {
      this.nodes.user.setAttribute('xlink:href', '../../symbols/all.svg#icon-' + this.state.symbol);
    }
    if ('size' in changed) {
      this.element.style.width = changed.size + 'px';
      this.element.style.height = changed.size + 'px';
      this.element.style.fontSize = changed.size + 'px';
    }
  }
});