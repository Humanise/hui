require(['all'],function() {

  hui.ui.listen({
    $ready : function() {
      //hui.ui.get('testFinder').show();
      hui.ui.get('objectInputWindow').show();
    },
    $click$resetObjectInputFormula : function() {
      hui.ui.get('objectInputFormula').reset();
    },
    $click$logObjectInputFormula : function() {
      var values = hui.ui.get('objectInputFormula').getValues();
      hui.log(values);
    },
    $render$authorInput : function(obj) {
      hui.log(obj);
      return {
        icon : 'monochrome/person',
        text : (obj.title || obj.name) + '!'
      };
    },
    $click$changeObjectInputFormula : function() {
      var form = hui.ui.get('objectInputFormula');
      form.setValues({
        text : 'Hep hey',
        author : [{title:'Barack Obama'},{title:'John Wayne'}]
      })
    }
  })
  
})

