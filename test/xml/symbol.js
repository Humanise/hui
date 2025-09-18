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
    var container = document.querySelector('#container');
    iconNames.forEach(name => {
      var sym = hui.ui.Symbol.create({name: name, size: 32});
      hui.build('div', { text: name, children:[
        sym.getElement(),
        hui.build('span.hui_symbol.hui_symbol-' + name)
      ], style: {margin: '5px'}, parent: container});
    })
  }
}