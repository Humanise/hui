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
	}
})