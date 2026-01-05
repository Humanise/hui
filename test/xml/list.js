var controller = {
  dragDrop : [
    {drag:'user',drop:'folder'},
    {drag:'icon',drop:'folder'}
  ],
  $ready : function() {
  },
  $drop$user$folder : function(dragged,target) {
    hui.ui.Alert.alert({
      text : dragged.title + ' was dropped on ' + target.title
    });
  },
  $drop$icon$folder : function(dragged,target) {
    hui.ui.Alert.alert({
      text : dragged.title + ' was dropped on ' + target.title
    });
  },
  $open$list : function(info) {
    alert(hui.string.toJSON(info))
  },
  $clickIcon$list : function(info) {
    hui.ui.msg.success({text:'Icon clicked : '+info.row,duration:3000})
  },
  $clickButton$list : function(info) {
    hui.ui.msg.success({text:'Button clicked : '+info.button.getData(),duration:3000})
  },
  $select$selector : function(item) {
    list.setUrl(item.value);
  }
}