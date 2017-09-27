QUnit.test( "Test", function( assert ) {
  var present = hui.ui.Presentation.create();
  present.show();
  assert.ok(present.element.clientHeight > 0);
  present.close();
  assert.ok(present.element.clientHeight == 0);
});