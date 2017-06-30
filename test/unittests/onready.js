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

QUnit.test("hui.ui", function(assert) {
  var done = assert.async();
  hui.onReady(['hui.ui'],function() {
    assert.ok(typeof(hui.ui)=='object');
    hui.onReady(['hui.ui'],function() {
      hui.ui.onReady(function() {
        assert.ok(hui.ui.domReady);
        done()
      })
    })
  })

})

QUnit.test("Button", function(assert) {
  var done = assert.async();
  hui.onReady(['hui.ui.Button'],function() {
    assert.ok(typeof(hui.ui.Button)=='function');
    done()
  })
  hui.ui.require(['Button']);
  hui.ui.require(['Button']);
})