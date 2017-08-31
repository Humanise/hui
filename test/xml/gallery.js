hui.ui.listen({
  $select$gallery : function() {
    console.log(parameters);
  },
  $resolveImageUrl : function() {
    return "http://via.placeholder.com/350x150"
  },
  $buildImageUrl$gallery : function(event) {
    console.log(event)
    return "http://via.placeholder.com/" + Math.round(event.width) + "x" + Math.round(event.height);
  },
  $valueChanged$sizeSlider : function(value) {
    gallery.setSize(Math.max(50,value*200));
  }
})