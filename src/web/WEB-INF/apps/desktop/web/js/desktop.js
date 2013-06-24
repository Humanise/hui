var desktop = {
	add : function() {
		new desktop.widget.Bookmarks();
	}
}



desktop.widget = {
	makeMovable : function(widget) {
		hui.drag.register({
			element : widget.element,
			$check : function(e) {
				e = hui.event(e);
				if (e.findByClass('widget_nodrag')) {
					return false;
				}
			},
			onStart : function(e) {
				widget.element.style.zIndex = hui.ui.nextPanelIndex();
			},
			onBeforeMove : function(e) {
				e = hui.event(e);
				var pos = hui.position.get(widget.element);
				this.dragState = {left: e.getLeft() - pos.left,top:e.getTop()-pos.top};				
				hui.cls.add(widget.element,'widget_moving');
			},
 			onMove : function(e) {
				var top = (e.getTop()-this.dragState.top);
				var left = (e.getLeft()-this.dragState.left);
				widget.element.style.top = Math.max(top,0)+'px';
				widget.element.style.left = Math.max(left,0)+'px';
				
			},
			onAfterMove : function(e) {
				hui.cls.remove(widget.element,'widget_moving');				
			}
		});
	}
}