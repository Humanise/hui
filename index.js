hui.ui.listen({
  $ready : function() {
    //hui.build('link',{
    //  //href : 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800',
    //  href: 'https://rsms.me/inter/inter.css',
    //  rel : 'stylesheet',
    //  type : 'text/css',
    //  parent : document.head
    //});

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
    this._loadInfo();
  },

  _loadInfo : function() {
    hui.ui.request({
      url: 'info/info.json',
      method: 'GET',
      $object : function(obj) {
        this._buildData(obj)
      }.bind(this)
    })
  },
  _buildData : function(info) {
    this.data = {
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
    window.components.setData(this.data)
  },
  $valueChanged$search : function() {
    if (!this.data) return;
    this._updateResults();
  },
  _updateResults : function() {
    var str = hui.ui.get('search').getValue();
    var words = str.split(/\W+/).filter(function(str) {return str.length>0});
    var rows = this.data.rows;
    if (words.length > 0) {
      var indexed = rows.map(function(row) {
        var rating = 1000;
        for (var i = 0; i < row.cells.length; i++) {
          var txt = row.cells[i].text;
          if (txt) {
            for (var j = 0; j < words.length; j++) {
              var word = words[j];
              var idx = txt.indexOf(word);
              if (idx != -1) {
                rating = Math.min(rating, idx);
              }
            }
          }
        }
        return {
          rating: rating,
          row: row
        };
      });
      indexed = indexed.filter(function(a) { return a.rating < 1000})
      indexed.sort(function(a,b) {return a.rating - b.rating} )
      rows = indexed.map(function(x) {return x.row})
    }

    window.components.setData({
      headers: this.data.headers,
      rows: rows
    })
  }
})