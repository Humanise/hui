/**
 * @constructor
 * @param {Object} options The options : {modal:false}
 */
hui.ui.Slider = function(options) {
	this.options = hui.override({value:0},options);
	this.name = options.name;
	
	this.element = hui.get(options.element);
	this.handler = hui.get.firstByTag(options.element,'a');
	hui.ui.extend(this)
	this.position = 0;
	this.value = 0;
	
	this._addBehavior();
}

hui.ui.Slider.create = function(options) {
	options = hui.override({},options);
	var e = options.element = hui.build('span',{'class':'hui_slider',html:'<a href="javascript://"></a><span></span>'});
	if (options.width) {
		e.style.width = options.width+'px';
	}
	return new hui.ui.Slider(options);
}

hui.ui.Slider.prototype = {
	_addBehavior : function() {
		hui.drag.register({
			element : this.handler,
			onBeforeMove : this._onBeforeMove.bind(this),
			onMove : this._onMove.bind(this),
			onAfterMove : this._onAfterMove.bind(this)
		})
	},
	_onBeforeMove : function(event) {
		var pos = hui.position.get(this.handler);
		this.dragInfo = {
			left : hui.position.getLeft(this.element),
			diff : event.getLeft()-pos.left,
			max : this.element.clientWidth-this.handler.clientWidth-5
		};
		hui.cls.add(this.element,'hui_slider_active');
	},
	_onMove : function(event) {
		var left = event.getLeft()-this.dragInfo.left
		left = (left-this.dragInfo.diff);
		left = Math.max(left,5);
		left = Math.min(left,this.dragInfo.max);
		this.handler.style.left = left+'px'
		this._setPosition((left-5)/(this.dragInfo.max-5));
		hui.log(this.position)
	},
	_onAfterMove : function() {
		hui.cls.remove(this.element,'hui_slider_active');
	},
	
	_setPosition : function(pos) {
		this.position = pos;
		this.fire('valueChanged',pos);
	},
	setValue : function(value) {
		var pos = Math.max(0,Math.min(value,1));
		var width = this.element.clientWidth-10-this.handler.clientWidth;
		hui.animate({
			node : this.handler,
			css : { left: (pos*width+5)+'px'},
			duration : 200,
			ease : hui.ease.fastSlow
		})
		this.position = this.value = pos;
	}
}