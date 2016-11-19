QUnit.test( "Test", function( assert ) {
	var win = hui.ui.Window.create({title:'This is the window title',width:200,name:'myWindow'});
	assert.equal(hui.ui.get('myWindow'),win,'Could get window by name');

	win.show();
	assert.ok(win.getElement().style.display=='block', 'Window is visible');

	win.toggle();
  var done = assert.async();
  window.setTimeout(function() {
    assert.equal(hui.style.get(win.getElement(),'display'), 'none', 'Window is not visible');
    done();
  },300)
});

QUnit.test( "Test", function( assert ) {
	var win = hui.ui.get('myWindow')

	win.show();
	win.setTitle('Hey hey hep!');
	win.add(hui.build('div',{text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}));

	var closeEventFired;
	win.listen({$userClosedWindow:function() {
		closeEventFired=true;
	}});

  var done = assert.async();
	var close = hui.get.firstByClass(win.getElement(),'hui_window_close');
  assert.ok(close);
	syn.click(close,function() {
		assert.ok(closeEventFired,'userClosedWindow was fired');
		win.show();
    done();
	});


	hui.ui.showMessage({text:'Dark variant',duration: 1000});
	win.setVariant('dark');

	hui.ui.showMessage({text:'Light variant',duration: 1000});
	win.setVariant('light');
});