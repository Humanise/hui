hui.ui.listen({
  $ready : function() {
    var editor = hui.ui.Editor.get();
    editor.addPartController('html','Text',hui.ui.Editor.Html);
    editor.addPartController('header','Header',hui.ui.Editor.Header);
    editor.ignite();
    editor.activate();
  },
	$partWasMoved : function(info) {
		hui.ui.showMessage({text:'Moving',busy:true});
		window.setTimeout(function() {
			if (hui.cls.has(info.dragged,'nodrag')) {
				hui.ui.showMessage({text:'I could not move it',duration:2000});
				info.$failure()
			} else {
				hui.ui.hideMessage();
				info.$success();
			}
		}
		,Math.random()*1500);
	},
  $editRow : function(info) {
    var win = hui.ui.Window.create({padding:10});
    var form = hui.ui.Formula.create();
    var group = form.createGroup();
    var field = hui.ui.CodeInput.create();
    group.add(field)
    win.add(form);
    win.show();
    win.listen({
      $userClosedWindow : function() {
        info.$complete();
      }
    })
  }
})