desktop.widget.Image = function(options) {
	var e = options.entity;
	var url = hui.ui.context+'/service/image/id'+e.id+'width100height100cropped.jpg';
	this.element = hui.build('div',{'class':'widget widget_image',parent:document.body,
		style : { visibility: 'hidden' },
		html : '<img src="'+url+'"/><div class="widget_image_info widget_nodrag"></div>'
	});
	hui.style.set(this.element,{left : options.position.left-(this.element.clientWidth/2)+'px', top : options.position.top-(this.element.clientHeight/2)+'px'})
	hui.effect.bounceIn({element:this.element});
	desktop.widget.makeMovable(this);
	this.update(e);
}

desktop.widget.Image.prototype = {
	update : function(entity) {
		var body = hui.get.firstByClass(this.element,'widget_image_info');
		body.innerHTML = '<h1>'+entity.name+'</h1>';
	}
}