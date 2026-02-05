var controller = {
  $ready : function() {
    hui.ui.request({
        url: '../../symbols/all.svg',
        $xml : this._parse.bind(this)
    })
  },
  _parse : function(doc) {
    var iconNames = Array.from(doc.querySelectorAll('defs > symbol > title')).map(node => node.textContent);
    console.log(iconNames)
    var table = document.querySelector('#table');
    hui.build('tr', { children: [
      hui.build('th', {text: 'Name'}),
      hui.build('th', {text: 'Component'}),
      hui.build('th', {text: 'CSS'})
    ], parent: table})
    iconNames.forEach(name => {
      var row = hui.build('tr', {parent: table});
      var sym = new hui.ui.Symbol({symbol: name, size: 16});
      hui.build('tr', { children:[
        hui.build('th', {text: name}),
        hui.build('td', {children: [sym.getElement()]}),
        hui.build('td', {children: [hui.build('span.hui_symbol.hui_symbol-' + name)]})
      ], parent: table});
    })
  }
}