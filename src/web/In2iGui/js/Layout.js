/**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
In2iGui.Layout = function(options) {
	this.name = options.name;
	this.options = options || {};
	this.element = $(options.element);
	In2iGui.extend(this);
	if (n2i.browser.msie7) {
		In2iGui.onDomReady(this.resize.bind(this));
		Event.observe(window,'resize',this.resize.bind(this));
	}
}

In2iGui.Layout.prototype = {
	resize : function() {
		var height = this.element.parentNode.clientHeight;
		var top = this.element.select('thead td')[0].firstDescendant().clientHeight;
		var bottom = this.element.select('tfoot td')[0].firstDescendant().clientHeight;
		if ((height-top-bottom-40)>0) {
			this.element.select('tbody tr td')[0].style.height=(height-top-bottom-40)+'px';
		}
	}
};


/**
 * @constructor
 * @param {Object} options { element «Node | id», name: «String» }
 */
In2iGui.Columns = function(options) {
	this.name = options.name;
	this.options = options || {};
	this.element = $(options.element);
	this.body = this.element.select('tr')[0];
	In2iGui.extend(this);
}

/**
 * Creates a new Columns opject
 */
In2iGui.Columns.create = function(options) {
	options = options || {};
	options.element = new Element('table',{'class':'in2igui_columns'}).insert(new Element('tbody').insert(new Element('tr')));
	return new In2iGui.Columns(options);
}

In2iGui.Columns.prototype = {
	addToColumn : function(index,widget) {
		var c = this.ensureColumn(index);
		c.insert(widget.getElement());
	},
	setColumnStyle : function(index,style) {
		var c = this.ensureColumn(index);
		c.setStyle(style);
	},
	setColumnWidth : function(index,width) {
		var c = this.ensureColumn(index);
		c.setStyle({width:width+'px'});
	},
	/** @private */
	ensureColumn : function(index) {
		var children = this.body.childElements();
		for (var i=children.length-1;i<index;i++) {
			this.body.insert(new Element('td',{'class':'in2igui_columns_column'}));
		}
		return this.body.childElements()[index];
	}
}

/* EOF */