In2iGui.List = function(element,name,options) {
	this.element = $(element);
	this.name = name;
	this.state = options.state;
	
	this.source = options.source;
	this.head = this.element.getElementsByTagName('thead')[0];
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.columns = [];
	this.rows = [];
	this.selected = [];
	this.navigation = $class('navigation',this.element)[0];
	this.count = $class('count',this.navigation)[0];
	this.windowSize = $class('window_size',this.navigation)[0];
	this.windowNumber = $firstClass('window_number',this.navigation);
	this.windowNumberBody = $firstClass('window_number_body',this.navigation);
	this.parameters = {};
	this.sortKey = null;
	this.sortDirection = null;
	
	this.window = {size:null,number:1,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	In2iGui.enableDelegating(this);
	this.refresh();
}

In2iGui.List.prototype = {
	hide : function() {
		this.element.hide();
	},
	show : function() {
		this.element.show();
	},
	registerColumn : function(column) {
		this.columns.push(column);
	},
	getSelection : function() {
		var items = [];
		for (var i=0; i < this.selected.length; i++) {
			items.push(this.rows[this.selected[i]]);
		};
		return items;
	},
	getFirstSelection : function() {
		var items = this.getSelection();
		if (items.length>0) return items[0];
		else return null;
	},
	setParameter : function(key,value) {
		this.parameters[key]=value;
	},
	loadData : function(url) {
		this.source = url;
		this.selected = [];
		this.sortKey = null;
		this.sortDirection = null;
		this.window.number = 0;
		this.refresh();
	},

/**
 * @private
 */
	refresh : function() {
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
		if (this.sortKey) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='sort='+this.sortKey;
		}
		if (this.sortDirection) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='direction='+this.sortDirection;
		}
		for (key in this.parameters) {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+=key+'='+this.parameters[key];
		}
		$get(url,delegate);
	},
	sort : function(index) {
		var key = this.columns[index].key;
		if (key==this.sortKey) {
			this.sortDirection = this.sortDirection=='ascending' ? 'descending' : 'ascending';
		}
		this.sortKey = key;
		this.refresh();
	},

	/**
	 * @private
	 */
	parse : function(doc) {
		this.parseWindow(doc);
		this.buildNavigation();
		N2i.removeChildren(this.body);
		N2i.removeChildren(this.head);
		this.rows = [];
		this.columns = [];
		var headTr = N2i.create('tr');
		var sort = doc.getElementsByTagName('sort');
		this.sortKey=null;
		this.sortDirection=null;
		if (sort.length>0) {
			this.sortKey=sort[0].getAttribute('key');
			this.sortDirection=sort[0].getAttribute('direction');
		}
		var headers = doc.getElementsByTagName('header');
		for (var i=0; i < headers.length; i++) {
			var className = '';
			var th = N2i.create('th');
			var width = headers[i].getAttribute('width');
			var key = headers[i].getAttribute('key');
			var sortable = headers[i].getAttribute('sortable')=='true';
			if (width && width!='') {
				th.style.width=width+'%';
			}
			if (sortable) {
				var self = this;
				th.in2iguiIndex = i;
				th.onclick=function() {self.sort(this.in2iguiIndex)};
				className+='sortable';
			}
			if (key==this.sortKey) {
				className+=' sort_'+this.sortDirection;
			}
			th.className=className;
			var span = N2i.create('span');
			th.appendChild(span);
			span.appendChild(document.createTextNode(headers[i].getAttribute('title')));
			headTr.appendChild(th);
			this.columns.push({'key':key,'sortable':sortable,'width':width});
		};
		this.head.appendChild(headTr);
		var rows = doc.getElementsByTagName('row');
		for (var i=0; i < rows.length; i++) {
			var cells = rows[i].getElementsByTagName('cell');
			var row = document.createElement('tr');
			var info = {uid:rows[i].getAttribute('uid'),kind:rows[i].getAttribute('kind'),icon:rows[i].getAttribute('icon'),title:rows[i].getAttribute('title'),index:i};
			row.dragDropInfo = info;
			for (var j=0; j < cells.length; j++) {
				//var text = null;
				var cell = document.createElement('td');
				this.parseCell(cells[j],cell);
				//cell.appendChild(document.createTextNode(' '));
				row.appendChild(cell);
			};
			this.addRowBehavior(row,i);
			this.body.appendChild(row);
			this.rows.push(info);
		};
	}
};

In2iGui.List.prototype.filter = function(str) {
	var len = 20;
	var regex = new RegExp("[\\w]{"+len+",}","g");
	var match = regex.exec(str);
	if (match) {
		for (var i=0; i < match.length; i++) {
			var rep = '';
			for (var j=0; j < match[i].length; j++) {
				rep+=match[i][j];
				if ((j+1)%len==0) rep+='\u200B';
			};
			str = str.replace(match[i],rep);
		};
	}
	return str;
}

In2iGui.List.prototype.parseCell = function(node,cell) {
	if (node.getAttribute('icon')!=null) {
		var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.getIconUrl(node.getAttribute('icon'),1)+'")'});
		cell.appendChild(icon);
	}
	for (var i=0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if (child.nodeType==N2i.TEXT_NODE && child.nodeValue.length>0) {
			cell.appendChild(document.createTextNode(this.filter(child.nodeValue)));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='break') {
			cell.appendChild(N2i.create('br'));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='object') {
			var obj = N2i.create('div',{'class':'object'});
			if (child.getAttribute('icon')!=null) {
				var icon = N2i.create('div',{'class':'icon'},{'backgroundImage':'url("'+In2iGui.getIconUrl(child.getAttribute('icon'),1)+'")'});
				obj.appendChild(icon);
			}
			if (child.firstChild && child.firstChild.nodeType==N2i.TEXT_NODE && child.firstChild.nodeValue.length>0) {
				obj.appendChild(document.createTextNode(child.firstChild.nodeValue));
			}
			cell.appendChild(obj);
		}
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
	} else {
		this.window.total = 0;
		this.window.size = 0;
		this.window.number = 0;
	}
}

In2iGui.List.prototype.buildNavigation = function(doc) {
	var self = this;
	var pages = this.window.size>0 ? Math.ceil(this.window.total/this.window.size) : 0;
	if (pages<2) {
		this.navigation.style.display='none';
		return;
	}
	this.navigation.style.display='block';
	var from = ((this.window.number-1)*this.window.size+1);
	this.count.innerHTML = '<span><span>'+from+'-'+Math.min((this.window.number)*this.window.size,this.window.total)+'/'+this.window.total+'</span></span>';
	this.windowNumberBody.innerHTML = '';
	if (pages<2) {
		this.windowNumber.style.display='none';	
	} else {
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
			this.windowNumberBody.appendChild(a);
		}
		this.windowNumber.style.display='block';
	}
}

/********************************** Update from objects *******************************/

In2iGui.List.prototype.setObjects = function(objects) {
	this.selected = [];
	this.body.innerHTML='';
	this.rows = [];
	for (var i=0; i < objects.length; i++) {
		var row = new Element('tr');
		var obj = objects[i];
		for (var j=0; j < this.columns.length; j++) {
			var cell = new Element('td');
			if (this.builder) {
				cell.update(this.builder.buildColumn(this.columns[j],obj));
			} else {
				var value = obj[this.columns[j].key] || '';
				if (value.constructor == Array) {
					for (var k=0; k < value.length; k++) {
						if (value[k].constructor == Object) {
							cell.insert(this.createObject(value[k]));
						} else {
							cell.insert(new Element('div').update(value));
						}
					};
				} else if (value.constructor == Object) {
					cell.insert(this.createObject(value[j]));
				} else {
					cell.insert(value);
				}
			}
			row.insert(cell);
		};
		this.body.appendChild(row);
		this.addRowBehavior(row,i);
		this.rows.push(obj);
	};
}

In2iGui.List.prototype.createObject = function(object) {
	var node = new Element('div',{'class':'object'});
	if (object.icon) {
		node.insert(new Element('div',{'class':'icon'}).setStyle({'backgroundImage':'url("'+In2iGui.getIconUrl(object.icon,1)+'")'}));
	}
	return node.insert(object.text || object.name || '');
}

/************************************* Behavior ***************************************/


/**
 * @private
 */
In2iGui.List.prototype.addRowBehavior = function(row,index) {
	var self = this;
	row.onmousedown = function(e) {
		self.rowDown(index);
		In2iGui.startDrag(e,row);
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

/* EOF */