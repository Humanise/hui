hui.ui.listen({
  $ready : function() {
    hui.ui.request({
      url : '../xslt/schema.xsd',
      $xml : function(doc) {
        hui.log(doc)
        var elements = doc.getElementsByTagName('element');
        for (var i = 0; i < elements.length; i++) {
          hui.log(elements[i].getAttribute('name'))
        }
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