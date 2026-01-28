QUnit.test( "Basics", assert => {

    assert.expect(3);
    var icon = hui.ui.Icon.create({
      icon : 'common/info',
      size: 32
    });
    var done = assert.async();
    icon.on({
      $click() {
        assert.ok(true, 'Icon was clicked');
        done();
      }
    })
    document.body.appendChild(icon.getElement())
    assert.ok(hui.find('span.hui_icon') != null);
    icon.setSize(16);
    assert.ok(hui.ui.is(icon, hui.ui.Icon));

    syn.click({}, icon.getElement(), function() {});
  }

)