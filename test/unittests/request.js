QUnit.test("simple", function(assert) {
  var done = assert.async();
  hui.request({
    url: 'data/list_data.xml',
    $success : function(req) {
      assert.ok(req.responseText);
    },
    $failure : function(req) {
      hui.log(req)
      assert.notOk(true);
    },
    $finally : function() {
      done();
    }
  })

})