In2iGui.List = function(element,options) {
	this.element = $id(element);
	this.source = options.source;
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.columns = [];
	this.rows = [];
	this.selected = [];
	this.navigation = $class('navigation',this.element)[0];
	this.count = $class('count',this.navigation)[0];
	this.windowSize = $class('window_size',this.navigation)[0];
	this.windowNumber = $class('window_number',this.navigation)[0];
	this.window = {size:null,number:1,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.List.prototype.registerColumn = function(column) {
	this.columns.push(column);
}

In2iGui.List.prototype.getSelection = function() {
	var items = [];
	for (var i=0; i < this.selected.length; i++) {
		items.push(this.rows[this.selected[i]]);
	};
	return items;
}

In2iGui.List.prototype.getFirstSelection = function() {
	var items = this.getSelection();
	if (items.length>0) return items[0];
	else return null;
}

In2iGui.List.prototype.loadData = function(url) {
	this.source = url;
	this.selected = [];
	this.window.number = 0;
	this.refresh();
}

/**
 * @private
 */
In2iGui.List.prototype.refresh = function() {
	if (!this.source) return;
	var self = this;
	var delegate = {
		onSuccess:function(t) {
			self.parse(t.responseXML);
		}
	};
	var url = this.source;
	if (this.window.number) {
		url+=url.indexOf('?')==-1 ? '?' : '&';
		url+='windowNumber='+this.window.number;
	}
	if (this.window.size) {
		url+=url.indexOf('?')==-1 ? '?' : '&';
		url+='windowSize='+this.window.size;
	}
	$get(url,delegate);
}

/**
 * @private
 */
In2iGui.List.prototype.parse = function(doc) {
	this.parseWindow(doc);
	this.buildNavigation();
	this.body.innerHTML='';
	this.rows = [];
	var rows = doc.getElementsByTagName('row');
	for (var i=0; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName('cell');
		var row = document.createElement('tr');
		for (var j=0; j < cells.length; j++) {
			var text = '';
			if (cells[j].firstChild) {
				text = cells[j].firstChild.nodeValue.substring(0,30);
			}
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(text));
			row.appendChild(cell);
		};
		this.addRowBehavior(row,i);
		this.body.appendChild(row);
		this.rows.push({uid:rows[i].getAttribute('uid'),kind:rows[i].getAttribute('kind'),index:i});
	};
}

/**
 * @private
 */
In2iGui.List.prototype.parseWindow = function(doc) {
	var wins = doc.getElementsByTagName('window');
	if (wins.length>0) {
		var win = wins[0];
		this.window.total = parseInt(win.getAttribute('total'));
		this.window.size = parseInt(win.getAttribute('size'));
		this.window.number = parseInt(win.getAttribute('number'));
	} 
}

In2iGui.List.prototype.buildNavigation = function(doc) {
	var self = this;
	this.count.innerHTML = this.window.total;
	this.windowNumber.innerHTML = '';
	var pages = Math.ceil(this.window.total/this.window.size);
	for (var i=1;i<=pages;i++) {
		var a = document.createElement('a');
		a.appendChild(document.createTextNode(i));
		a.in2GuiNumber = i;
		a.onclick = function() {
			self.windowNumberWasClicked(this);
			return false;
		}
		if (i==this.window.number) {
			a.className='selected';
		}
		this.windowNumber.appendChild(a);
	}
}

/********************************** Update from objects *******************************/

In2iGui.List.prototype.setObjects = function(objects) {
	this.selected = [];
	this.body.innerHTML='';
	this.rows = [];
	for (var i=0; i < objects.length; i++) {
		var row = N2i.create('tr');
		var obj = objects[i];
		for (var j=0; j < this.columns.length; j++) {
			var cell = N2i.create('td');
			if (this.builder) {
				cell.innerHTML = this.builder.buildColumn(this.columns[j],obj);
			} else {
				cell.innerHTML = obj[this.columns[j].key];
			}
			row.appendChild(cell);
		};
		this.body.appendChild(row);
		this.addRowBehavior(row,i);
		this.rows.push(obj);
	};
}

/************************************* Behavior ***************************************/


/**
 * @private
 */
In2iGui.List.prototype.addRowBehavior = function(row,index) {
	var self = this;
	row.onmousedown = function() {
		self.rowDown(index);
		return false;
	}
	row.ondblclick = function() {
		self.rowDoubleClick(index);
		return false;
	}
}

In2iGui.List.prototype.changeSelection = function(indexes) {
	var rows = this.body.getElementsByTagName('tr');
	for (var i=0;i<this.selected.length;i++) {
		N2i.Element.removeClassName(rows[this.selected[i]],'selected');
	}
	for (var i=0;i<indexes.length;i++) {
		N2i.Element.addClassName(rows[indexes[i]],'selected');
	}
	this.selected = indexes
}

/**
 * @private
 */
In2iGui.List.prototype.rowDown = function(index) {
	this.changeSelection([index]);
}

/**
 * @private
 */
In2iGui.List.prototype.rowDoubleClick = function(index) {
	In2iGui.callDelegates(this,'listRowsWasOpened');
}

/**
 * @private
 */
In2iGui.List.prototype.windowNumberWasClicked = function(tag) {
	this.window.number = tag.in2GuiNumber;
	this.refresh();
}