QUnit.test( "Test", function( assert ) {
  var panel = hui.ui.Panel.create({title:'This is the window title',width:200,name:'myPanel'});
  assert.equal(hui.ui.get('myPanel'),panel,'Could get window by name');
  assert.equal(hui.style.get(panel.getElement(),'display'), 'none', 'Panel is not visible');

  panel.show();
  assert.equal(hui.style.get(panel.getElement(), 'block'), '', 'Panel is visible');

  panel.toggle();
  var done = assert.async();
  window.setTimeout(function() {
    assert.equal(hui.style.get(panel.getElement(),'display'), 'none', 'Window is not visible');
    panel.destroy();
    done();
  },300)
});

QUnit.test( "Test", function( assert ) {
  var panel = hui.ui.Panel.create({title:'This is the window title',width:200,name:'myPanel'});
  var panel = hui.ui.get('myPanel');

  panel.show();
  panel.setTitle('Hey hey hep!');
  panel.add(hui.build('div',{text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}));

  var closeEventFired;
  panel.listen({$close:function() {
    closeEventFired=true;
  }});

  var done = assert.async();
  var close = hui.find('.hui_panel_close', panel.getElement());
  assert.ok(close);
  syn.click(close,function() {
    assert.ok(closeEventFired,'close was fired');
    panel.show();
    done();
  });
});