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
		N2i.log(c);
		c.insert(widget.getElement());
	},
	ensureColumn : function(index) {
		var children = this.body.childElements();
		N2i.log(children.length-1);
		for (var i=children.length-1;i<index;i++) {
			this.body.insert(new Element('td',{'class':'in2igui_columns_column'}));
			N2i.log('insert');
		}
		N2i.log(this.body);
		return this.body.childElements()[index];
	}
}

/* EOF */