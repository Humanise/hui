QUnit.test( "Basic properties",
  function( assert ) {
    
    var check = hui.ui.Checkbox.create({text: 'My check', value: false, key: 'myCheck'});
    assert.ok(typeof(check)=='object', 'The checkbox is an object');

    assert.equal(check.getKey(), 'myCheck', 'It should have a key');

    assert.equal(check.getValue(), false, 'It is not checked');

    check.setValue(true);
    assert.equal(check.getValue(), true, 'It is not checked');

    check.setValue(false);
    assert.equal(check.getValue(), false, 'It is not checked');

    syn.click({}, check.element, function() {
      assert.equal(check.getValue(), true, 'It is now checked');

      syn.click({}, check.element, function() {
        assert.equal(check.getValue(), false, 'It is now checked');
      })
    })
  }
);

QUnit.test( "Test name",
  function( assert ) {
    var check = hui.ui.Checkbox.create({text: 'My check', testName: 'the-check-box', value: false});
    assert.equal(check.getElement().getAttribute('data-test'), 'the-check-box', 'It has the correct test name');
  }
);