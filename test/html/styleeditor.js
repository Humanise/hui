hui.ui.listen({
  $ready : function() {
    var editor = hui.ui.StyleEditor.create();
    document.body.append(editor.getElement());
    editor.setValue({
      queries : [{
        'max-width' : '500px',
        'components' : [
          {
            name : 'container',
            rules : [
              {name:'color', value:'#abc'}
            ]
          }
        ]
      }]
    })
  }
})