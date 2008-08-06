In2iGui.Browser = function(element,source) {
	this.element = $id(element);
	this.contents = $class('contents',this.element)[0];
	this.source = source;
	this.levels = [];
	this.selections = [];
	this.columns = [];
	this.update(0,this.source);
}

In2iGui.Browser.prototype.update = function(level,url) {
	var self = this;
	var delegate = {
		onSuccess:function(t) {
			self.levels[level] = self.parse(t.responseXML);
			self.display();
		}
	};
	var request = new N2i.Request(delegate);
	request.request(url);
}

In2iGui.Browser.prototype.parse = function(doc) {
	var list = [];
	var items = doc.getElementsByTagName('element');
	for (var i=0; i < items.length; i++) {
		list[list.length] = {title:items[i].getAttribute('title'),source:items[i].getAttribute('source')};
	};
	return list;
}

In2iGui.Browser.prototype.display = function() {
	var self = this;
	this.contents.style.width=((this.columns.length+1)*200)+'px';
	for (var i=this.columns.length; i < this.levels.length; i++) {
		var column = document.createElement('div');
		column.className = 'column';
		for (var j=0; j < this.levels[i].length; j++) {
			var element = this.levels[i][j];
			var tag = document.createElement('div');
			tag.className = 'element';
			tag.setAttribute('title',element.title);
			tag.innerHTML = element.title;
			tag.in2iGuiIndex = j;
			tag.in2iGuiColumn = i;
			tag.onmousedown=function() {self.itemWasClick(this)};
			column.appendChild(tag);
		};
		this.contents.appendChild(column);
		this.columns[i] = column;
	};
	$ani(this.element,'scrollLeft',this.columns.length*200-this.element.clientWidth,200,{func:N2i.Animation.fastSlow});
}

In2iGui.Browser.prototype.ensureColumns = function(col) {
	for (var i=col; i < this.columns.length; i++) {
		this.contents.removeChild(this.columns[i]);
		this.selections[i]=null;
	};
	this.columns.splice(col);
	this.levels.splice(col);
}


In2iGui.Browser.prototype.changeSelection = function(column,row) {
	var prev = this.selections[column];
	N2i.Element.removeClassName(this.columns[column].childNodes[prev],'selected');
	this.selections[column] = row;
	N2i.Element.addClassName(this.columns[column].childNodes[row],'selected');
}

In2iGui.Browser.prototype.itemWasClick = function(tag) {
	var col = tag.in2iGuiColumn;
	var row = tag.in2iGuiIndex;
	var prev = this.selections[col];
	var item = this.levels[col][row];
	this.changeSelection(col,row);
	this.ensureColumns(col+1);
	if (item.source) {
		this.update(col+1,item.source);
	}
}

/* EOF */