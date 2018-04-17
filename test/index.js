hui.ui.listen({
  $ready : function() {
    this._loadSchema();
    this._loadXSL();
  },
  _loadXSL : function() {
    hui.ui.request({
      url : '../xslt/gui.xsl',
      $xml : function(doc) {
        hui.log(doc)
        var elements = doc.querySelectorAll('stylesheet > template');
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          hui.log(element.getAttribute('match'))
        }
      }
    })
  },
  _loadSchema : function() {
    hui.ui.request({
      url : '../xslt/schema.xsd',
      $xml : function(doc) {
        var options = [];
        var elements = doc.querySelectorAll('schema > element');
        for (var i = 0; i < elements.length; i++) {
          var name = elements[i].getAttribute('name');
          options.push({
            text : name,
            value : name,
            kind : 'component'
          });
        }
        componentOptions.$optionsLoaded([{text:'Components',value:'components',icon:'common/folder',children:options}])
      }
    })
  },
  $click$publish : function() {
    panel.position(publish);
    panel.show();
  },
  $click$mini1 : function() {
    mini1.setSelected(true);
    mini2.setSelected(false);
    mini3.setSelected(false);
    mini4.setSelected(false);
  },
  $click$mini2 : function() {
    mini1.setSelected(false);
    mini2.setSelected(true);
    mini3.setSelected(false);
    mini4.setSelected(false);
  },
  $click$mini3 : function() {
    mini1.setSelected(false);
    mini2.setSelected(false);
    mini3.setSelected(true);
    mini4.setSelected(false);
  },
  $click$mini4 : function() {
    mini1.setSelected(false);
    mini2.setSelected(false);
    mini3.setSelected(false);
    mini4.setSelected(true);
  }
})