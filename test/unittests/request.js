QUnit.test("simple", function(assert) {
  var done = assert.async();
  hui.request({
    url: 'data/list_data.xml',
    method: 'GET',
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