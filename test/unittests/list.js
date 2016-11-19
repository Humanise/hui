QUnit.test( "Test", function( assert ) {
  var list = hui.ui.List.create({});
  assert.ok(list);
});

QUnit.test( "Test", function( assert ) {
  var done = assert.async();
	var src = new hui.ui.Source({url:'data/list_data.xml'});
	var list = hui.ui.List.create({source:src, name: 'myList'});
	list.listen({
		$selectionReset : function() {
      assert.ok(true)
			done();
		},
		$select : function() {
      assert.ok(false)
		}
	})
	document.body.appendChild(list.element)

});

QUnit.test( "Test2", function( assert ) {
  var done = assert.async();
	var src = new hui.ui.Source({url:'data/list_data.xml'});
	var list = hui.ui.List.create({source:src});
	document.body.appendChild(list.element)
  list.listen({$selectionReset : function() {

    assert.ok(list, 'found previous test')
    list.clearListeners();
    list.listen({
      $select : function() {
        assert.ok(true)
      }
    });
    window.setTimeout(function() {
      var tbody = hui.get.firstByTag(list.element,'tbody');
      assert.ok(tbody);
      var cell = hui.get.firstByTag(tbody,'td');
      assert.ok(cell);
      syn.click(cell);

      list.hide();
      assert.notOk(hui.dom.isVisible(list.element),'The list should be hidden');
      list.show();
      assert.ok(hui.dom.isVisible(list.element),'The list should be visible');
      done();

    })

  }})
})