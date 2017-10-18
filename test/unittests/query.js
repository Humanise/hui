QUnit.test( "Get", function( assert ) {

  hui.query('div').addClass('hephey').each(function(node) {
    assert.ok(hui.cls.has(node, 'hephey'));
  })

});