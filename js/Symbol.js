hui.component('Symbol', {
  state: {
    name: null,
    size: 16
  },
  nodes : {
    'svg' : 'svg'
  },
  create : function(options) {
    return hui.build('a.hui_symbol', { html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"></svg>'});
  },
  draw : function(changed) {
    if ('name' in changed) {
      this.nodes.svg.innerHTML = '<use xlink:href="../../symbols/all.svg#icon-' + changed.name + '"></use>';
    }
    if ('size' in changed) {
      this.element.style.width = changed.size + 'px';
      this.element.style.height = changed.size + 'px';
      this.element.style.fontSize = changed.size + 'px';
    }
  }
});