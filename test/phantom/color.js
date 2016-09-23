QUnit.test( "Parsing", function( assert ) {
  var tests = [{
    input : 'white',
    rgb : 'rgb(255,255,255)',
    hex : '#ffffff'
  },{
    input : '#abc',
    rgb : 'rgb(170,187,204)',
    hex : '#aabbcc'
  },{
    input : '123',
    rgb : 'rgb(17,34,51)',
    hex : '#112233'
  },{
    input : [255,0,0],
    rgb : 'rgb(255,0,0)',
    hex : '#ff0000'
  },
  // Fails...
  {
    input : '',
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : [],
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : {},
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : '#',
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : undefined,
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : null,
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : '',
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : '12',
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : '1',
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  },{
    input : 123,
    rgb : 'rgb(0,0,0)',
    hex : '#000000'
  }];

  for (var i = 0; i < tests.length; i++) {
    var test = tests[i];

    var clr = new hui.Color(test.input);

    assert.equal( clr.toHex(), test.hex );
    assert.equal( clr.toRGB(), test.rgb );
  }


  assert.equal( hui.Color.rgb2hex([0,0,0]), '#000000' );

});