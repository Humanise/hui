QUnit.test( "Test", function( assert ) {
	assert.equal(hui.string.camelize('font-size'),'fontSize');
	assert.equal(hui.string.camelize('fontSize'),'fontSize');
	assert.equal(hui.string.camelize('color'),'color');

	assert.equal(hui.position.getTop('one'),10);
	assert.equal(hui.get('one').clientWidth,320);
	assert.equal(hui.style.get('one','width'),'300px');
	assert.equal(hui.style.get('one','padding-top'),'10px');
	assert.equal(hui.style.get('one','padding-right'),'10px');

	if (hui.browser.msie7 || hui.browser.msie8 || hui.browser.webkitVersion>=536) {
		assert.equal(hui.style.get('one','padding'),'10px');
	} else {
		assert.equal(hui.style.get('one','padding'),'');
	}
	assert.equal(new hui.Color(hui.style.get('one','color')).toHex(),'#ff0000');
	assert.equal(hui.style.get('one','font-size'),'12px');
	assert.equal(hui.style.get('one','display'),'block');
	assert.equal(hui.style.get('one','border-top-width'),'2px','Check top width');
	if (hui.browser.msie7 || hui.browser.msie8 || hui.browser.webkitVersion>=536) {
		assert.equal(hui.style.get('one','border-width'),'2px');
	} else {
		assert.equal(hui.style.get('one','border-width'),'');
	}
	if (hui.browser.opacity) {
		assert.equal(hui.style.get('one','opacity'),'1','Check opacity');
	} else {
		assert.equal(hui.style.get('one','opacity'),undefined,'Check opacity');
	}
	if (hui.browser.webkit) {
		assert.equal(hui.style.get('one','background-color'),'rgba(0, 0, 0, 0)','Check background color');
		assert.equal(hui.style.get('one','line-height'),'normal');
	} else if (hui.browser.msie) {
		assert.equal(hui.style.get('one','background-color'),'transparent','Check background color');
		assert.equal(hui.style.get('one','line-height'),'normal');
	} else {
		assert.equal(hui.style.get('one','background-color'),'transparent','Check background color');
		assert.equal(hui.style.get('one','line-height'),'16px');
	}

	var fontFamily = hui.style.get('one','font-family');
	assert.ok(fontFamily.indexOf('Verdana')!==-1);
	assert.ok(fontFamily.indexOf('Tahoma')!==-1);
	assert.ok(fontFamily.indexOf('sans-serif')!==-1);

	assert.equal(hui.style.get('two','padding'),'10px 10px 10px 20px','Check padding of #two');

});

QUnit.test( "Color", function( assert ) {

	var color = new hui.Color('red');
	assert.equal(
		color.toRGB() , 'rgb(255,0,0)'
	);
	assert.equal(color.toHex(),'#ff0000');

	var color = new hui.Color('rgb(200,0,0)');
	assert.equal(color.toRGB(),'rgb(200,0,0)');
	assert.equal(color.toHex(),'#c80000');

	var color = new hui.Color('#f00');
	assert.equal(color.toRGB(),'rgb(255,0,0)');

	var color = new hui.Color('rgb(255,0,0)');
	assert.equal(color.toHex(),'#ff0000');

	var color = new hui.Color('rgb(100%,0%,0%)');
	assert.equal(color.toHex(),'#ff0000');

	// failures
	var color = new hui.Color('#ff00');
	assert.notOk(color.ok);

	var color = new hui.Color('');
	assert.notOk(color.ok);

	var color = new hui.Color();
	assert.notOk(color.ok);

	var color = hui.Color.hex2rgb('#f00');
	assert.equal(color.r,255);
	assert.equal(color.g,0);
	assert.equal(color.b,0);

	var color = hui.Color.hsv2rgb(90,1,1);
	assert.equal(color[0],128);
	assert.equal(color[1],255);
	assert.equal(color[2],0);

	var color = hui.Color.rgb2hex([255,0,0]);
	assert.equal(color,'#ff0000');

});