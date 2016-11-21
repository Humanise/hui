hui.ui.listen({
  $ready : function() {

    var editor = hui.ui.StyleEditor.create({
      name : 'myStyleEditor',
      components : [
        {'name' : 'base', description: 'Base'},
        {'name' : 'container', description: 'Container'},
        {'name' : 'strong', description: 'Stong text'},
        {'name' : 'link', description: 'Links'}
      ]
    });
    document.body.append(editor.getElement());

    hui.build('div',{
      'class' : 'js-output',
      style : 'white-space: pre',
      parent: document.body
    });

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
      },{
        'min-width' : '499px',
        'components' : [{
            name : 'strong',
            rules : [
              {name:'font-weight', value:'500'}
            ]
          }]
        }
      ]
    })
    editor.editQuery(0)
  },
  $valueChanged$myStyleEditor : function(value) {
    hui.find('.js-output').innerHTML = JSON.stringify(value,null,2);
    hui.log(value)
  }
})