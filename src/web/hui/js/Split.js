/**
 * A bar
 * <pre><strong>options:</strong> {
 *  element : «Element»,
 *  name : «String»
 * }
 * </pre>
 * @constructor
 * @param {Object} options The options
 */
hui.ui.Split = function(options) {
	this.options = hui.override({},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.rows = hui.get.children(this.element);
	this.handles = [];
	this.sizes = [];
	for (var i=0; i < this.rows.length; i++) {
		if (i>0) {
			this.handles.push(hui.build('div',{'class':'hui_split_handle',parent:this.element}));
		}
		this.sizes.push(1/this.rows.length);
	};
	hui.ui.extend(this);
	this._addBehavior()
}

hui.ui.Split.prototype = {
	_addBehavior : function() {
		
	},
	$$resize : function() {
		this._layout();
	},
	_layout : function() {
		var pos = 0,
			full = this.element.clientHeight;
		for (var i=0; i < this.rows.length; i++) {
			this.rows[i].style.top = (pos*full)+'px';
			this.rows[i].style.height = (this.sizes[i]*full)+'px';
			pos+=this.sizes[i];
			if (i<this.rows.length-1) {
				this.handles[i].style.top = (pos*full)+'px';
			}
		};
	}
}