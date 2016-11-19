QUnit.test( "Get", function( assert ) {

	var hey = hui.get('hey');
	assert.ok( hui.isDefined(hey), 'Find by id' );

	assert.strictEqual( hey, hui.get(hey), 'Get the same' );


	var node = hui.get('hasSiblings');
	var next = hui.get.next(node);
	assert.strictEqual(next.nodeName, 'HR', 'The next is an <hr/>');
	var last = hui.get.next(next);
	assert.strictEqual(last, null, 'There should be no more');

});

QUnit.test( "Class", function( assert ) {
	var node = hui.get('hasClass');

	assert.ok(hui.cls.has(node,'myclass'), 'Node should have class');
	assert.notOk(hui.cls.has(node,'dsjadha'), 'Node should not have class');

	node = hui.get('alsoHasClass');
	assert.ok(hui.cls.has(node,'myclass'), 'Node should have class');
	assert.ok(hui.cls.has(node,'myotherclass'), 'Node should have class');
	assert.notOk(hui.cls.has(node,'dsjadha'), 'Node should not have class');

})

QUnit.test( 'Building', function( assert ) {
	var built = hui.build('div',{
    'class' : 'hippodippelidoo golbetop dypludido',
    text : 'this is the text',
    parent : document.body
  });

	var found = hui.get.firstByClass(document.body,'hippodippelidoo');
	assert.strictEqual(built,found)

	assert.strictEqual(hui.dom.getText(built), 'this is the text');
	hui.dom.setText(built, 'Fermentum Lorem Parturient Cursus');
	assert.strictEqual(hui.dom.getText(built), 'Fermentum Lorem Parturient Cursus');
})