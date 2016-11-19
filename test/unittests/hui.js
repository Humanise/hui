QUnit.test("isString", function(assert) {

	// Positives...
	assert.ok(hui.isString('This is a string'));
	assert.ok(hui.isString(' '));
	assert.ok(hui.isString(''));

	// Negatives...
	assert.ok(!hui.isString());
	assert.ok(!hui.isString(null));
	assert.ok(!hui.isString(NaN));
	assert.ok(!hui.isString({}));
	assert.ok(!hui.isString([]));
	assert.ok(!hui.isString(['']));
	assert.ok(!hui.isString(['dada']));
	assert.ok(!hui.isString(1));
	assert.ok(!hui.isString(-1));
	assert.ok(!hui.isString(0));

})

QUnit.test("isArray", function(assert) {

	// Positives...
	assert.ok(hui.isArray([]));
	assert.ok(hui.isArray([null]));
	assert.ok(hui.isArray(Array()));

	// Negatives...
	assert.ok(!hui.isArray());
	assert.ok(!hui.isArray(null));
	assert.ok(!hui.isArray(NaN));
	assert.ok(!hui.isArray({}));
	assert.ok(!hui.isArray(""));
	assert.ok(!hui.isArray(" "));
	assert.ok(!hui.isArray("[]"));
	assert.ok(!hui.isArray(1));
	assert.ok(!hui.isArray(-1));
	assert.ok(!hui.isArray(0));

})

QUnit.test("isBlank", function(assert) {

	assert.ok(hui.isBlank(''));
	assert.ok(hui.isBlank(' '));
	assert.ok(hui.isBlank('      '));

	assert.ok(hui.isBlank(null));
	assert.ok(hui.isBlank());

	assert.ok(hui.isBlank("\t")); // Tab

	// Newlines are blank
	assert.ok(hui.isBlank("\n"));
	assert.ok(hui.isBlank("\n \n"));

	// Not blank
	assert.notOk(hui.isBlank("a"));
	assert.notOk(hui.isBlank(" a "));

	// Only strings are blank
	assert.notOk(hui.isBlank([]));
	assert.notOk(hui.isBlank({}));
	assert.notOk(hui.isBlank(1));
	assert.notOk(hui.isBlank(0));
	assert.notOk(hui.isBlank(NaN));
})

QUnit.test("isDefined", function(assert) {
  assert.strictEqual(hui.isDefined(), false, 'undefined is not defined');
  assert.strictEqual(hui.isDefined(null), false, 'NULL is not defined');
  assert.strictEqual(hui.isDefined(''), true, 'Empty string is defined');
  assert.strictEqual(hui.isDefined({}), true, 'empty object is defined');
  assert.strictEqual(hui.isDefined([]), true, 'empty array is defined');
});

QUnit.test("between", function(assert) {

	assert.equal(5, hui.between(5, 0, 10));
	assert.equal(10, hui.between(5, 20, 10));

	// Non-numbers
	assert.equal(10, hui.between(5, "20", 10));
	assert.equal(10, hui.between(5, " +20  \n", 10));

	assert.equal(5, hui.between(5, null, 10));
	assert.equal(5, hui.between(5, "", 10));
})

QUnit.test("fitting", function(assert) {
	! function() {
		var fitted = hui.fit({
			width: 100,
			height: 100
		}, {
			width: 20,
			height: 100
		});
		assert.equal(20, fitted.height);
		assert.equal(20, fitted.width);
	}()

	! function() {
		var fitted = hui.fit({
			width: 100,
			height: 200
		}, {
			width: 20,
			height: 100
		});
		assert.equal(40, fitted.height);
		assert.equal(20, fitted.width);
	}()

	// Same dimensions
	! function() {
		var fitted = hui.fit({
			width: 100,
			height: 100
		}, {
			width: 20,
			height: 20
		});
		assert.equal(20, fitted.height);
		assert.equal(20, fitted.width);
	}()

	! function() {
		var fitted = hui.fit({
			width: 120,
			height: 100
		}, {
			width: 20,
			height: 20
		});
		assert.equal(17, fitted.height);
		assert.equal(20, fitted.width);
	}()

	// Scaled up
	! function() {
		var fitted = hui.fit({
			width: 6,
			height: 5
		}, {
			width: 20,
			height: 20
		});
		assert.equal(17, fitted.height);
		assert.equal(20, fitted.width);
	}()

	! function() {
		var fitted = hui.fit({
			width: 200,
			height: 100
		}, {
			width: 20,
			height: 40
		});
		assert.equal(20, fitted.width);
		assert.equal(10, fitted.height);
	}()

	// Exactly same size
	! function() {
		var fitted = hui.fit({
			width: 50,
			height: 50
		}, {
			width: 50,
			height: 50
		});
		assert.equal(50, fitted.height);
		assert.equal(50, fitted.width);
	}()
})


QUnit.test("string.shorten", function(assert) {

	assert.equal(hui.string.shorten('This is a string',0),'...');
	assert.equal(hui.string.shorten('This is a string',2),'...');
	assert.equal(hui.string.shorten('This is a string',5),'Th...');
	assert.equal(hui.string.shorten('This is a string',6),'Thi...');
	assert.equal(hui.string.shorten('This',5),'This');

	assert.equal(hui.string.shorten(null,5),'');
	assert.equal(hui.string.shorten(undefined,5),'');
	assert.equal(hui.string.shorten([],5),'');
	assert.equal(hui.string.shorten({x:'saa'},5),'');

	assert.equal(hui.string.shorten(123456789,5),'12...');

})

QUnit.test("string.trim", function(assert) {
	assert.strictEqual(hui.string.trim(''), '', 'Empty string trims to empty string');
	assert.strictEqual(hui.string.trim(null), '', 'NULL trims to empty string');
	assert.strictEqual(hui.string.trim(), '', 'undefined trims to empty string');
	assert.strictEqual(hui.string.trim(1), '1', 'number trims to string of number');
	assert.strictEqual(hui.string.trim([]), '', 'empty array trims to empty string');
	assert.strictEqual(hui.string.trim(['abc',1]), 'abc,1', 'Array with values trims to comma separated');
});

QUnit.test("string.escapeHTML", function(assert) {
	assert.strictEqual(hui.string.escapeHTML(''),'','Escape empty string');
	assert.strictEqual(hui.string.escapeHTML(null),'','Escape NULL');
	assert.strictEqual(hui.string.escapeHTML(' '),' ','Escape space');
	assert.strictEqual(hui.string.escapeHTML('abc'),'abc','Escape string');
	assert.strictEqual(hui.string.escapeHTML('abc<>'),'abc&lt;&gt;','Escape <> string');
	assert.strictEqual(hui.string.escapeHTML('&'),'&amp;','Escape & string');
	assert.strictEqual(hui.string.escapeHTML('"'),'"','Escape " string');
	assert.strictEqual(hui.string.escapeHTML('This is <br>some <strong>common & general</strong> markup'),'This is &lt;br&gt;some &lt;strong&gt;common &amp; general&lt;/strong&gt; markup','Escape markup');
});

QUnit.test("string.endsWith", function(assert) {
	assert.ok(hui.string.endsWith('Jonas','as'),'Ends with is correct');
	assert.notOk(hui.string.endsWith('Jonas','ona'),'Ends with is correct');
	assert.ok(hui.string.endsWith('Jonas\nmunk','unk'),'Ends with works with multiple lines');
	assert.notOk(hui.string.endsWith('Jonas\nmunk','as'),'Ends with works with multiple lines');

	assert.equal(hui.string.camelize('font-size'),'fontSize');
	assert.equal(hui.string.camelize('fontSize'),'fontSize');
	assert.equal(hui.string.camelize('color'),'color');
});

QUnit.test("array.contains", function(assert) {

	// inArray
	assert.ok(hui.array.contains(['a','b','c'],'b'),'Find string in array');
	assert.notOk(hui.array.contains(['a','b','c'],'ab'),'Find string in array');
	assert.notOk(hui.array.contains([0,'b','c'],null),'zero in array is not null');
	assert.notOk(hui.array.contains([0,'b','c'],''),'zero in array is not empty string');
	assert.notOk(hui.array.contains([1,'b','c'],'1'),'number in array is not string');
	assert.ok(hui.array.contains([null,'b','c'],null),'Find null in array');
	assert.ok(hui.array.contains(['','b','c'],''),'Find empty string in array');
});

QUnit.test("array.indexOf", function(assert) {
	// indexInArray
	assert.strictEqual(hui.array.indexOf(['','b','c'],'b'),1,'Find index of string in array');
	assert.strictEqual(hui.array.indexOf(['','b',2],2),2,'Find index of number in array');
	assert.strictEqual(hui.array.indexOf(['',null,0],0),2,'Find index of number in array');
	assert.strictEqual(hui.array.indexOf(['',null,0],null),1,'Find index of NULL in array');
	assert.strictEqual(hui.array.indexOf(['',' ',0],null),-1,'Not found in array');
});

QUnit.test("string.toJSON", function(assert) {
	assert.strictEqual(hui.string.toJSON({}),"{}",'JSON of empty object');
	assert.strictEqual(hui.string.toJSON(1),"1",'JSON of number');
	assert.strictEqual(hui.string.toJSON('abc'),'"abc"','JSON of string');
	assert.strictEqual(hui.string.toJSON([]),"[]",'JSON of array');
	assert.strictEqual(hui.string.toJSON(),undefined,'JSON of undefined');
	assert.strictEqual(hui.string.toJSON(null),"null",'JSON of null');

	var x = {a:'b'};
	x.y = x;
	try {
		assert.strictEqual(hui.string.toJSON(x),"null",'JSON of null');
	} catch (e) {
		assert.ok(e,'Should fail on circular reference');
	}

	var object = {str:'ab"c',num:9.5,arr:[1,null,'ab"c']};
	var roundtrip = hui.string.fromJSON(hui.string.toJSON(object));
	assert.strictEqual(roundtrip.str,object.str,'Test that strings are encoded/decoded correct');
	assert.strictEqual(roundtrip.num,object.num,'Test that numbers are encoded/decoded correct');
	assert.strictEqual(roundtrip.arr[0],object.arr[0],'Test that arrays are encoded/decoded correct');
	assert.strictEqual(roundtrip.arr[1],object.arr[1],'Test that arrays are encoded/decoded correct');
	assert.strictEqual(roundtrip.arr[2],object.arr[2],'Test that arrays are encoded/decoded correct');
});

QUnit.test("cookie", function(assert) {
	hui.cookie.set('my cookie','the value');
	hui.cookie.set('my other cookie','the other value');
	assert.equal(hui.cookie.get('my cookie'),'the value');
	hui.cookie.clear('my cookie');
	assert.equal(hui.cookie.get('my other cookie'),'the other value');
	assert.equal(hui.cookie.get('my cookie'),null);
	hui.cookie.clear('my other cookie');
	assert.equal(hui.cookie.get('my other cookie'),null);
});