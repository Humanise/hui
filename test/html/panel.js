hui.on(function() {
  var panel = hui.ui.Panel.create({
    title: 'This is the title',
    icon: 'common/info',
    name:'myPanel',
    close: true
  });
  panel.add(hui.build('div',{style:'width: 200px; height: 200px;'}));
  panel.add(hui.ui.Button.create({text:'Click me'}))
  panel.show();

  var targets = hui.findAll('.tests a');
  hui.each(targets, function(target) {
    hui.listen(target,'click',function(e) {
      e.preventDefault();
      panel.show({target: target});
    })
  })
})
