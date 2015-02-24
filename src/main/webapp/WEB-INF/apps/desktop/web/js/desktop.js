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
				var target = e.getElement();
				this.resize = null;
				if (hui.cls.has(target,'widget_resize')) {
					this.resize = {
						l : hui.cls.has(target,'widget_resize_left'),
						r : hui.cls.has(target,'widget_resize_right'),
						t : hui.cls.has(target,'widget_resize_top'),
						b : hui.cls.has(target,'widget_resize_bottom')
					}
				}
			},
			onStart : function(e) {
				widget.element.style.zIndex = hui.ui.nextPanelIndex();
			},
			onBeforeMove : function(e) {
				e = hui.event(e);
				var pos = hui.position.get(widget.element);
				this.dragState = {
					left : e.getLeft() - pos.left,
					top : e.getTop() - pos.top
				};
				this.startPosition = {
					left : e.getLeft(),
					top : e.getTop()
				}
				this.initialSize = {
					left : pos.left,
					top : pos.top,
					width : widget.element.clientWidth,
					height : widget.element.clientHeight
				};
 				if (!this.resize) {
					hui.cls.add(widget.element,'widget_moving');
				}
			},
 			onMove : function(e) {
 				if (this.resize) {
					if (this.resize.r) {
 						this.element.style.width = Math.max(200, e.getLeft() - this.startPosition.left + this.initialSize.width)+'px';
					}
					if (this.resize.b) {
 						this.element.style.height = Math.max(200, e.getTop() - this.startPosition.top + this.initialSize.height)+'px';
					}
 				} else {
					var top = (e.getTop()-this.dragState.top);
					var left = (e.getLeft()-this.dragState.left);
					widget.element.style.top = Math.max(top,0)+'px';
					widget.element.style.left = Math.max(left,0)+'px';
				}
			},
			onAfterMove : function(e) {
				hui.cls.remove(widget.element,'widget_moving');				
			}
		});
	}
}