QUnit.test( "Basics", function( assert ) {

    assert.expect(3);
    var icon = new hui.ui.Icon({
      icon : 'common/info',
      size: 32
    });
    var done = assert.async();
    icon.on({
      $click : function() {
        assert.ok(true,'Icon was clicked')
        done();
      }
    })
    document.body.appendChild(icon.getElement())

    assert.ok(hui.find('span.hui_icon') != null);
    syn.click({}, icon.getElement(), function() {});
    icon.setSize(16);
    assert.ok(hui.ui.is(icon, hui.ui.Icon));
  }

)