QUnit.test( "Basic properties",
    function( assert ) {
        var data = {id : 4};
        var button = hui.ui.Button.create({text:'My button',data:data});
        assert.ok(typeof(button)=='object','The button is an object');

        var text = hui.dom.getText(button.element);
        assert.equal(text,'My button','The text is correct');

        button.setText('New label');
        assert.equal(hui.dom.getText(button.element),'New label','The text is changed');

        assert.ok(!hui.cls.has(button.element,'hui_is_highlighted'),'Not highlighted from start');
        button.setHighlighted(true);
        assert.ok(hui.cls.has(button.element,'hui_is_highlighted'),'Now highlighted');

        assert.equal(button.getData(),data,'The data is intact');
    }
)

QUnit.test( "Clicking",
    function( assert ) {
        assert.expect(3);
        var done = assert.async();
        // Create a button
        var button = hui.ui.Button.create({text:'My other button',name:'benjamin',small:true});
        document.body.appendChild(button.element);

        button.listen({
            $click : function() {
                assert.ok(true,'The click listener was called');
            }
        })

        // Shortcut for clicking
        button.click(function() {
            assert.ok(true,'Another click listener was called');
        })

        hui.ui.listen({
            $click$benjamin : function() {
                assert.ok(true,'A third click listener was called');
                done();
            }
        })

        syn.click({},button.element,function() {
        });
    }
);

QUnit.test( "Enable / disable",
    function( assert ) {
        assert.expect(2);
        var done = assert.async();

        // Create a button
        var button = hui.ui.Button.create({text:'My skizo button'});
        document.body.appendChild(button.element);

        button.listen({
            $click : function() {
                assert.ok(true,'The click listener was called');
            }
        })

        syn.click({},button.element,function() {
            button.disable();
            syn.click({},button.element,function() {
                button.enable();
                syn.click({},button.element,function() {
                    done();
                });
            });
        });
    }
);

QUnit.test( "Overlay",
    function( assert ) {
        assert.expect(5);
        var done = assert.async();

        // Create a button
        var button = hui.ui.Button.create({text:'I need confirmation',confirm:{text:'Really?'}});
        document.body.appendChild(button.element);

        button.click(function() {
            assert.ok(true,'The click listener was called ONE TIME!');
        })

        // Click button
        syn.click({},button.element,function() {
            // Wait for it...
            window.setTimeout(function() {
                var overlay = hui.get.firstByClass(document.body,'hui_overlay');
                assert.ok(hui.dom.isVisible(overlay),'The overlay should be visible')
                var buttons = hui.get.byClass(overlay,'hui_button');
                assert.equal(buttons.length,2,'There are 2 overlay buttons');
                // Click "OK"
                syn.click({},buttons[0],function() {
                    // Click again
                    window.setTimeout(function() {
                        assert.ok(!hui.dom.isVisible(overlay),'The overlay should be invisible')
                        syn.click({},button.element,function() {
                            // Wait for it...
                            window.setTimeout(function() {
                                // Click "Cancel"
                                syn.click({},buttons[1],function() {
                                    assert.ok(!hui.dom.isVisible(overlay),'The overlay should be invisible')
                                    done()
                                });
                            },500);
                        });
                    });
                });
            },500)
        });
    }
);