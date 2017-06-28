QUnit.test("simple", function(assert) {
  var done = assert.async();
  hui.onReady(function() {
    assert.ok(typeof(hui.get)=='function');
    done()
  })

})

QUnit.test("color", function(assert) {
  var done = assert.async();
  hui.onReady(['hui.Color'],function() {
    assert.ok(typeof(hui.Color)=='function');
    hui.onReady(['hui.Color'],function() {
      assert.ok(typeof(hui.Color)=='function');
      done()
    })
  })

})