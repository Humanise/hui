QUnit.test( "Get", function( assert ) {

  hui.query('div').addClass('hephey').each(function(node) {
    assert.ok(hui.cls.has(node, 'hephey'));
  })

  hui.query('div').add('.ola').each(function(node) {
    assert.ok(hui.cls.has(node, 'ola'));
  })

  assert.equal(hui.query('div.ola').count(),hui.query('div').count());

});