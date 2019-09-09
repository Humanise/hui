hui.ui.listen({
  $ready : function() {
    hui.build('link',{
      href : 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800',
      rel : 'stylesheet',
      type : 'text/css',
      parent : document.head
    });

    hui.animate({
      node : hui.find('h1'),
      css : { 'letter-spacing' : '0px', color: '#ddd' },
      ease : hui.ease.elastic,
      duration : 2000,
      $complete : function() {
        hui.animate({
          node : hui.find('h1'),
          css : { color: '#000' },
          duration : 300});
      }
    });
    this._ensureInfo();
  },
  _buildData : function(info) {
    var data = {
      headers: [{title:'XML'},{title:'Attributes'},{title:'JavaScript'},{title:'XSL'}],
      rows: info.components.map(function(obj) {
        return {
          cells: [
            {text:obj.xml ? obj.xml.name : ''},
            {text:obj.xml ? obj.xml.attributes.map((attr) => {return attr.name}).join(', ') : ''},
            {text:obj.js ? obj.js.name : ''},
            {text:obj.xsl.map(function(o) {return o.match}).join('\n')}
          ]
        }
      })
    }
    window.components.setData(data)
  },

  _ensureInfo : function() {
    if (!this._loaded) {
      this._loaded = true;
      hui.ui.request({
        url: 'info/info.json',
        $object : function(obj) {
          this.info = obj;
          //this._updateResults();
          this._buildData(obj)
        }.bind(this)
      })
    }
  },
  $valueChanged$search : function() {
    this._ensureInfo();
    this._updateResults();
  },
  _updateResults : function() {
    if (!this.info) return;
    var str = hui.ui.get('search').getValue();
    var words = str.split(/\W+/).filter(function(str) {return str.length>0});
    console.log(words)
    var found = [];
    this.info.forEach(function(obj) {
      var index = 1000;
      for (var i = 0; i < words.length; i++) {
        var x = obj.name.toLowerCase().indexOf(words[i]);
        if (x > -1) {
          index = Math.min(index, x);
        } else {
          return;
        }
      }
      if (index < 1000) {
        found.push({index: index, component: obj})
      }
    });
    var out = hui.find('.js-results');
    out.innerHTML = ''
    found.forEach(function(obj) {
      hui.build('a.result', {text: obj.component.name, parent: out, href: 'api/hui.ui.'+obj.component.name+'.html'})
    })
  }
})