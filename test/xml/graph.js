hui.ui.listen({
  $nodeWasClicked : function(node) {
    hui.ui.msg({text:node.label,duration:2000});
  }
})