QUnit.test( 'Building', function( assert ) {
  var now = new Date();

	var win = hui.ui.Window.create({title:'This is the window title',width:200,padding:10,name:'myWindow'});
	var formula = hui.ui.Formula.create({name:'myForm'});
	win.add(formula);
	win.show();

	assert.strictEqual(hui.ui.get('myForm'),formula,'Could get form by name');

	formula.buildGroup(null,[
		{type:'TextInput',label:'Text label',options:{name:'textField',key:'text',value:'This is some text'}},
		{type:'DateTimeField',label:'Date label',options:{key:'date',value:now}},
		{type:'NumberField',label:'Number label',options:{key:'number',value:10.56,decimals:2}},
		{type:'DropDown',label:'Drop label',options:{key:'drop',value:'da',items:[{value:'da',label:'Danish'},{value:'en',title:'English'},{value:'abc',title:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}]}},
		{type:'LocationInput',label:'Location label',options:{key:'location',value:{latitude:57.535354,longitude:10.7428479}}},
		{label:'Color',type:'ColorInput',options:{key:'color',value:'#f00'}}
	]);

	var values = formula.getValues();
	assert.strictEqual(values.text,'This is some text','The text field has value');
	assert.strictEqual(values.date,now,'The date field has value');
	assert.strictEqual(values.number,10.56,'The number field has value');
	assert.strictEqual(values.drop,'da','The drop down has value');
	assert.strictEqual(values.location.latitude,57.535354,'The latitude has value');
	assert.strictEqual(values.location.longitude,10.7428479,'The longitude has value');

	syn.click(hui.get.firstByClass(document.body,'hui_numberinput_up'));
	assert.strictEqual(formula.getValues().number,11.56,'The number field has incremented value');
	syn.click(hui.get.firstByClass(document.body,'hui_numberinput_down'));
	assert.strictEqual(formula.getValues().number,10.56,'The number field has decremented value');

	var textField = hui.ui.get('textField');
	var node = textField.getElement();
	assert.ok(node,'The field must have an input element');
	textField.reset();
	assert.strictEqual(textField.getValue(),'','The value of the text field is ""');

	syn.type(node,'hep hey',function() {
		assert.strictEqual(textField.getValue(),'hep hey','The text field has updated its value');
	});
});