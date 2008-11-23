In2iGui.List = function(element,name,options) {
	this.options = N2i.override({url:null,source:null},options);
	this.element = $(element);
	this.name = name;
	this.state = options.state;
	if (this.options.source) {
		this.options.source.addDelegate(this);
	}
	this.url = options.url;
	this.head = this.element.select('thead')[0];
	this.body = this.element.select('tbody')[0];
	this.columns = [];
	this.rows = [];
	this.selected = [];
	this.navigation = this.element.select('.navigation')[0];
	this.count = this.navigation.select('.count')[0];
	this.windowSize = this.navigation.select('.window_size')[0];
	this.windowPage = this.navigation.select('.window_page')[0];
	this.windowPageBody = this.navigation.select('.window_page_body')[0];
	this.parameters = {};
	this.sortKey = null;
	this.sortDirection = null;
	
	this.window = {size:null,page:0,total:0};
	if (options.windowSize!='') {
		this.window.size = parseInt(options.windowSize);
	}
	In2iGui.extend(this);
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
		this.setUrl(url);
	},
	setUrl : function(url) {
		this.url = url;
		this.selected = [];
		this.sortKey = null;
		this.sortDirection = null;
		this.window.page = 0;
		this.refresh();
	},

	/**
	 * @private
	 */
	refresh : function() {
		if (!this.url) return;
		var url = this.url;
		if (typeof(this.window.page)=='number') {
			url+=url.indexOf('?')==-1 ? '?' : '&';
			url+='windowPage='+this.window.page;
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
		var self = this;
		new Ajax.Request(url,{
			onSuccess:function(r) {
				if (r.responseXML) {
					try {
					self.parse(r.responseXML);
					} catch (e) {N2i.log(e)}
				} else if (r.responseText) {
					var json = r.responseText.evalJSON();
					if (json.list==true) {
						self.setData(json);
					} else {
						self.setObjects(json);
					}
				}
			}
		});
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
		this.body.update();
		this.head.update();
		this.rows = [];
		this.columns = [];
		var headTr = new Element('tr');
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
			var th = new Element('th');
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
			var span = new Element('span');
			th.appendChild(span);
			span.appendChild(document.createTextNode(headers[i].getAttribute('title')));
			headTr.appendChild(th);
			this.columns.push({'key':key,'sortable':sortable,'width':width});
		};
		this.head.appendChild(headTr);
		var rows = doc.getElementsByTagName('row');
		for (var i=0; i < rows.length; i++) {
			var cells = rows[i].getElementsByTagName('cell');
			var row = new Element('tr');
			var icon = rows[i].getAttribute('icon');
			var title = rows[i].getAttribute('title');
			for (var j=0; j < cells.length; j++) {
				var td = new Element('td');
				this.parseCell(cells[j],td);
				row.insert(td);
				if (!title) title = cells[j].innerText;
				if (!icon && cells[j].getAttribute('icon')) icon = cells[j].getAttribute('icon');
			};
			var info = {id:rows[i].getAttribute('id'),kind:rows[i].getAttribute('kind'),icon:icon,title:title,index:i};
			row.dragDropInfo = info;
			this.addRowBehavior(row,i);
			this.body.insert(row);
			this.rows.push(info);
		};
	},
	
	objectsLoaded : function(data) {
		if (data.constructor == Array) {
			this.setObjects(data);
		} else {
			this.setData(data);
		}
	},
	sourceIsBusy : function() {
		this.element.addClassName('in2igui_list_busy');
	},
	sourceIsNotBusy : function() {
		this.element.removeClassName('in2igui_list_busy');
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
		var icon = new Element('div',{'class':'icon'}).setStyle({'backgroundImage':'url("'+In2iGui.getIconUrl(node.getAttribute('icon'),1)+'")'});
		cell.insert(icon);
	}
	for (var i=0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if (child.nodeType==N2i.TEXT_NODE && child.nodeValue.length>0) {
			cell.appendChild(document.createTextNode(child.nodeValue));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='break') {
			cell.insert(new Element('br'));
		} else if (child.nodeType==N2i.ELEMENT_NODE && child.nodeName=='object') {
			var obj = new Element('div',{'class':'object'});
			if (child.getAttribute('icon')!=null) {
				var icon = new Element('div',{'class':'icon'}).setStyle({'backgroundImage':'url("'+In2iGui.getIconUrl(child.getAttribute('icon'),1)+'")'});
				obj.insert(icon);
			}
			if (child.firstChild && child.firstChild.nodeType==N2i.TEXT_NODE && child.firstChild.nodeValue.length>0) {
				obj.appendChild(document.createTextNode(child.firstChild.nodeValue));
			}
			cell.insert(obj);
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
		this.window.page = parseInt(win.getAttribute('page'));
	} else {
		this.window.total = 0;
		this.window.size = 0;
		this.window.page = 0;
	}
}

In2iGui.List.prototype.buildNavigation = function() {
	var self = this;
	var pages = this.window.size>0 ? Math.ceil(this.window.total/this.window.size) : 0;
	N2i.log(this.window);
	if (pages<2) {
		this.navigation.style.display='none';
		return;
	}
	this.navigation.style.display='block';
	var from = ((this.window.page)*this.window.size+1);
	this.count.update('<span><span>'+from+'-'+Math.min((this.window.page+1)*this.window.size,this.window.total)+'/'+this.window.total+'</span></span>');
	this.windowPageBody.update();
	if (pages<2) {
		this.windowPage.style.display='none';	
	} else {
		for (var i=0;i<pages;i++) {
			var a = document.createElement('a');
			a.appendChild(document.createTextNode(i+1));
			a.in2GuiPage = i;
			a.onclick = function() {
				self.windowPageWasClicked(this);
				return false;
			}
			if (i==this.window.page) {
				a.className='selected';
			}
			this.windowPageBody.appendChild(a);
		}
		this.windowPage.style.display='block';
	}
}

/********************************** Update from objects *******************************/

In2iGui.List.prototype.setData = function(data) {
	this.selected = [];
	var win = data.window || {};
	this.window.total = win.total || 0;
	this.window.size = win.size || 0;
	this.window.page = win.page || 0;
	this.buildNavigation();
	this.buildHeaders(data.headers);
	this.buildRows(data.rows);
},

In2iGui.List.prototype.buildHeaders = function(headers) {
	var self = this;
	this.head.update();
	this.columns = [];
	var tr = new Element('tr');
	this.head.insert(tr);
	headers.each(function(h,i) {
		var th = new Element('th');
		var style = {};
		if (h.width) th.setStyle({width:h.width+'%'});
		if (h.sortable) {
			th.observe('click',function() {self.sort(i)});
			th.addClassName('sortable');
		}
		th.insert(new Element('span').update(h.title));
		tr.insert(th);
		self.columns.push(h);
	});
}

In2iGui.List.prototype.buildRows = function(rows) {
	var self = this;
	this.body.update();
	this.rows = [];
	if (!rows) return;
	rows.each(function(r,i) {
		var tr = new Element('tr');
		var icon = r.icon;
		var title = r.title;
		r.cells.each(function(c) {
			var td = new Element('td');
			if (c.icon) {
				var icn = new Element('div',{'class':'icon'}).setStyle({'backgroundImage':'url("'+In2iGui.getIconUrl(c.icon,1)+'")'});
				td.insert(icn);
				icon = icon || c.icon;
			}
			if (c.text) {
				td.insert(c.text);
				title = title || c.text;
			}
			tr.insert(td);
		})
		self.body.insert(tr);
		var info = {id:r.id,kind:r.kind,icon:icon,title:title,index:i};
		tr.dragDropInfo = info;
		self.addRowBehavior(tr,i);
		self.rows.push(info);
	})
}


/********************************** Update from objects legacy *******************************/

In2iGui.List.prototype.setObjects = function(objects) {
	this.selected = [];
	this.body.update();
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
		this.body.insert(row);
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
	In2iGui.callDelegates(this,'listRowWasOpened',this.getFirstSelection());
	In2iGui.callDelegates(this,'onRowOpen',this.getFirstSelection());
}

/**
 * @private
 */
In2iGui.List.prototype.windowPageWasClicked = function(tag) {
	this.window.page = tag.in2GuiPage;
	In2iGui.firePropertyChange(this,'state',{page:this.window.page});
	this.refresh();
}

/* EOF */