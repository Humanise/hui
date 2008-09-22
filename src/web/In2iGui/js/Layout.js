In2iGui.Columns = function(id,name,options) {
	this.name = name;
	this.options = options || {};
	this.element = $(id);
	this.body = this.element.select('tr')[0];
	In2iGui.extend(this);
}

In2iGui.Columns.create = function(name,options) {
	var e = new Element('table',{'class':'in2igui_columns'}).insert(new Element('tbody').insert(new Element('tr')));
	return new In2iGui.Columns(e,name,options);
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
	ensureColumn : function(index) {
		var children = this.body.childElements();
		for (var i=children.length-1;i<index;i++) {
			this.body.insert(new Element('td',{'class':'in2igui_columns_column'}));
		}
		return this.body.childElements()[index];
	}
}

/* EOF */