QUnit.test( "is", function( assert ) {
  var win = hui.ui.Window.create();
  assert.ok(hui.ui.is(win, hui.ui.Window));
  assert.notOk(hui.ui.is(win, hui.ui.Panel));
});