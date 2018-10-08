QUnit.test( "Basic properties",
  function( assert ) {
    var editor = hui.ui.MarkupEditor.create({text:'My button'});
    assert.ok(typeof(editor)=='object','The editor is an object');
    editor.destroy();
    assert.ok(!hui.find('.hui_markupeditor'));
  }
)

QUnit.test( "Cleaning",
  function( assert ) {
    var node = hui.build('div',{html:'<b color="red">This is bold</b><span class="Apple-style-span"><i>Italic</i></span><font color="blue">Blue text</font>'});
    var html = node.innerHTML;
    var cleaned = hui.ui.MarkupEditor.util.clean(node);
    assert.equal(html, node.innerHTML, 'The original must not change');

    assert.equal(0, cleaned.getElementsByTagName('b').length);
    var strongs = cleaned.getElementsByTagName('strong');
    assert.equal(1, strongs.length);
    assert.equal('#ff0000', new hui.Color(strongs[0].style.color).toHex());

    assert.equal(0, cleaned.getElementsByTagName('i').length);
    assert.equal(1, cleaned.getElementsByTagName('em').length);

    assert.equal(0, cleaned.getElementsByClassName('Apple-style-span').length);

    assert.equal(0, cleaned.getElementsByTagName('font').length);
    var spans = cleaned.getElementsByTagName('span');
    assert.equal(2, spans.length);
    assert.equal('#0000ff', new hui.Color(spans[1].style.color).toHex());
  }
)