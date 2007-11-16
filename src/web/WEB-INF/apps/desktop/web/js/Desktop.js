var OO = {};

OO.Desktop = function() {
	this.selectedWorkspace = 0;
	this.snapIn();
	this.workspaces = [];
	this.latestWindowId=0;
	this.addWorkspace(1,'Home');
	this.addWorkspace(2,'Work');
	this.addWorkspace(3,'Play');
	this.updateBar();
	this.changeWorkspace(1);
	OO.Desktop.debug('Init');
}

OO.Desktop.getInstance = function() {
	if (!OO.Desktop.instance) {
		OO.Desktop.instance = new OO.Desktop();
	}
	return OO.Desktop.instance;
}

OO.Desktop.prototype.getNextWindowId = function() {
	this.latestWindowId++;
	return this.latestWindowId;
}

OO.Desktop.prototype.addWorkspace = function(id,title) {
	this.workspaces[this.workspaces.length] = new OO.Desktop.Workspace(id,title);
}

OO.Desktop.prototype.addWindow = function(title) {
	var ws = this.getActiveWorkspace();
	ws.addWindow(new OO.Desktop.Window(null,ws));
}

OO.Desktop.prototype.addEntityWindow = function(id,title) {
	var ws = this.getActiveWorkspace();
	ws.addWindow(new OO.Desktop.Window(new OO.Desktop.Window.EntityDelegate(id,title),ws));
}

OO.Desktop.prototype.getActiveWorkspace = function() {
	for (var i=0;i<this.workspaces.length;i++) {
		if (this.workspaces[i].id==this.selectedWorkspace) {
			return this.workspaces[i];
		}
	}
	alert('No active workspace!');
}

OO.Desktop.prototype.changeWorkspace = function(id) {
	for (var i=0;i<this.workspaces.length;i++) {
		var ws = this.workspaces[i];
		if (ws.id==id) {
			this.selectedWorkspace = id;
			ws.setSelected(true);
		} else {
			ws.setSelected(false);
		}
	}
}

OO.Desktop.prototype.snapIn = function() {
	this.bar = $id('bar');
	this.logo = $id('logo');
	this.logo.onclick = function() {
		OO.Desktop.getInstance().addWindow();
	}
	var self = this;
	var searchDelegate = {
		valueChanged: function(field) {
			self.search(field.getValue());
		},
		focus: function(field) {
			self.search(field.getValue());
		},
		arrowUp: function(field) {
			self.changeSearchSelection(-1);
		},
		arrowDown: function(field) {
			self.changeSearchSelection(1);
		},
		returnKey: function(field) {
			self.chooseSearchSelection();
		},
		blur: function(field) {
			self.hideSearch();
		}
	}
	this.searchField = new N2i.Input.Textfield('searchfield',null,searchDelegate);
}

OO.Desktop.prototype.updateBar = function() {
	var spaces = $id('workspaces');
	for (var i=0;i<this.workspaces.length;i++) {
		spaces.appendChild(this.workspaces[i].buildTab());
	}
}

OO.Desktop.prototype.search = function(query) {
	if (query.length==0) {
		this.hideSearch();
		return;
	}
	var self = this;
	Desktop.search(query,{
  		callback:function(list) { self.displaySearch(list) },
  		timeout:5000,
  		errorHandler:function(message) { alert("Oops: " + message); }
		}
	);
}

OO.Desktop.prototype.displaySearch = function(list) {
	this.searchResults = list;
	this.clearSearch();
	var result = $id('searchresult');
	for (var i=0;i<list.length;i++) {
		var item = document.createElement('div');
		var name = document.createElement('strong');
		name.appendChild(document.createTextNode(list[i].title));
		item.appendChild(name);
		result.appendChild(item);
	}
	this.updateSearchSelection();
	$id('searchresult').style.display='block';
}

OO.Desktop.prototype.hideSearch = function() {
	this.clearSearch();
	this.searchResults = [];
	$id('searchresult').style.display='none';
}

OO.Desktop.prototype.clearSearch = function() {
	$id('searchresult').innerHTML = '';
	this.selectedSearchResult = 0;
}

OO.Desktop.prototype.changeSearchSelection = function(dir) {
	this.selectedSearchResult+=dir;
	if (this.selectedSearchResult<0) {
		this.selectedSearchResult=this.searchResults.length-1;
	} else if (this.selectedSearchResult>this.searchResults.length-1) {
		this.selectedSearchResult=0;
	}
	this.updateSearchSelection();
}

OO.Desktop.prototype.updateSearchSelection = function() {
	var result = $id('searchresult');
	var children = result.childNodes;
	for (var i=0; i < children.length; i++) {
		children[i].className = (this.selectedSearchResult==i ? 'highlighted' : '');
	};
}
OO.Desktop.prototype.chooseSearchSelection = function() {
	if (this.searchResults[this.selectedSearchResult]) {
		var result = this.searchResults[this.selectedSearchResult];
		this.addEntityWindow(result.id,result.title);
	}
}



OO.Desktop.Workspace = function(id,title) {
	this.id = id;
	this.title = title;
	this.windows = [];
	this.active = false;
	this.activeWindow = null;
	//this.addWindow(new OO.Desktop.Window());
}

OO.Desktop.Workspace.prototype.addWindow = function(window) {
	this.windows[this.windows.length] = window;
	window.setVisible(this.active);
	window.setWorkspace(this);
	this.setActiveWindow(window);
}

OO.Desktop.Workspace.prototype.setActiveWindow = function(window) {
	if (this.activeWindow) {
		this.activeWindow.setActive(false);
	}
	if (window) {
		window.setActive(true);
	}
	this.activeWindow = window;
}

OO.Desktop.Workspace.prototype.removeWindow = function(window) {
	var newWindows = [];
	for (var i=0; i<this.windows.length;i++) {
		if (this.windows[i].id!=window.id) {
			newWindows[newWindows.length] = this.windows[i];
		}
	}
	this.windows = newWindows;
	window.destroy();
}

OO.Desktop.Workspace.prototype.buildTab = function() {
	var div = document.createElement('div');
	var self = this;
	div.onclick = function() {
		OO.Desktop.getInstance().changeWorkspace(self.id);
	}
	div.className = 'workspace';
	var text = document.createTextNode(this.title);
	div.appendChild(text);
	this.barTab = div;
	return div;
}

OO.Desktop.Workspace.prototype.setSelected = function(selected) {
	this.active = selected;
	if (selected) {
		N2i.Element.addClassName(this.barTab,'selected');
	} else {
		N2i.Element.removeClassName(this.barTab,'selected');
	}
	for (var i=0;i<this.windows.length;i++) {
		this.windows[i].setVisible(selected);
	}
}

OO.Desktop.Workspace.prototype.overlaps = function(dims,id) {
	for (var i=0; i<this.windows.length;i++) {
		var win = this.windows[i];
		if (win.id!=id && !win.isOutlined) {
			var winDims = win.getDimensions();
			if (!(dims.left>winDims.right || dims.right<winDims.left) && !(dims.top>winDims.bottom || dims.bottom<winDims.top)) {
				//OO.Desktop.debug('left: '+dims.left+' > '+winDims.right+',right: '+dims.right+' < '+winDims.left);
				return true;
			}
		}
	}
	return false;
}

OO.Desktop.debug = function(text) {
	//$id('debugger').innerHTML=text+"<br/>"+$id('debugger').innerHTML;
}





OO.Desktop.Window = function(delegate,workspace) {
	this.isBuilt = false;
	this.id = OO.Desktop.getInstance().getNextWindowId();
	this.delegate = delegate || OO.Desktop.Window.defaultDelegate;
	this.delegate.window = this;
	this.workspace = workspace;
	this.build();
	this.delegate.refresh();
	this.isInitiated = true;
	this.isOutlined = false;
}

OO.Desktop.Window.defaultDelegate = {
	getTitle:function() {return 'Window'},
	getWidth:function() {return 200},
	getHeight:function() {return 200},
	refresh:function() {}
};

OO.Desktop.Window.prototype.getDimensions = function() {
	return {
		id: this.id,
		left: N2i.Element.getLeft(this.base),
		right: N2i.Element.getLeft(this.base)+N2i.Element.getWidth(this.base),
		top: N2i.Element.getTop(this.base),
		bottom: N2i.Element.getTop(this.base)+N2i.Element.getHeight(this.base)
	};
}

OO.Desktop.Window.prototype.setWorkspace = function(workspace) {
	this.workspace = workspace;
}

OO.Desktop.Window.prototype.build = function() {
	this.base = document.createElement('div');
	this.base.style.display = 'none';
	this.base.className='box';
	var top = 0;
	var left = 0;
	var width = this.delegate.getWidth();
	var height = (this.delegate.getHeight() ? this.delegate.getHeight() : 100);
	var tries = 100;
	top = Math.round((N2i.Window.getInnerHeight()-100)*Math.random());
	left = Math.round((N2i.Window.getInnerWidth()-width)*Math.random());
	var dims = {id:this.id,left:left,right:left+width+30,top:top,bottom:top+height+30};
	while (this.workspace.overlaps(dims,this.id) && tries>0) {
		top = Math.round((N2i.Window.getInnerHeight()-200)*Math.random());
		left = Math.round((N2i.Window.getInnerWidth()-width)*Math.random());
		dims = {id:this.id,left:left,right:left+width+30,top:top,bottom:top+height+30};
		tries--;
	}
	OO.Desktop.debug(this.workspace.overlaps(dims,this.id)+": "+tries);
	this.base.style.top = top+'px';
	this.base.style.left = left+'px';
	
	this.titleBar = document.createElement('div');
	this.titleBar.appendChild(document.createTextNode(this.delegate.getTitle()));
	this.titleBar.className='titlebar';
	this.titleBarRight = document.createElement('div');
	this.titleBarRight.className = 'right';

	this.close = document.createElement('div');
	this.close.className = 'close';
	this.titleBarRight.appendChild(this.close);
	
	this.titleBar.appendChild(this.titleBarRight);
	this.body = document.createElement('div');
	this.body.className='body';
	this.body.style.width = width+'px';
	if (this.delegate.getHeight()) {
		this.body.style.height = height+'px';
	}
	this.base.appendChild(this.titleBar);
	this.base.appendChild(this.body);
	document.body.appendChild(this.base);
	var self = this;
	this.base.onmousedown=function() {
		if (self.isOutlined) return false;
		self.workspace.setActiveWindow(self);
		return false;
	};
	this.titleBar.onmousedown=function() {
		if (self.isOutlined) return false;
		self.startDrag();
		return false;
	}
	N2i.Event.addListener(this.close,'click',function() {
		self.closeWindow();
		return false;
	}
	);
	this.titleBar.ondblclick = function() {
		self.toggleOutlined();
		return false;
	}
}

OO.Desktop.Window.prototype.changeBody = function(html) {
	this.body.innerHTML = html;
}

OO.Desktop.Window.prototype.destroy = function() {
	this.base.parentNode.removeChild(this.base);
}

OO.Desktop.Window.prototype.startDrag = function(event) {
	
	var e = new N2i.Event(event);
	this.leftDif = N2i.Element.getLeft(this.base)-e.mouseLeft();
	this.topDif = N2i.Element.getTop(this.base)-e.mouseTop();
	var self = this;
	this.mover = function(event) {
		self.drag(event);
		return false;
	};
	this.upper = function() {
		N2i.Event.removeListener(document.body,'mousemove',self.mover);
		N2i.Event.removeListener(document.body,'mouseup',self.upper);
		self.endDrag();
		return true;
	};
	N2i.Event.addListener(document.body,'mousemove',this.mover);
	N2i.Event.addListener(document.body,'mouseup',this.upper);
}

OO.Desktop.Window.prototype.closeWindow = function(event) {
	this.workspace.removeWindow(this);
}

OO.Desktop.Window.prototype.setActive = function(active) {
	if (active) {
		N2i.Element.addClassName(this.base,'active');
	} else {
		N2i.Element.removeClassName(this.base,'active');
	}
	this.base.style.zIndex = (active ? 1 : 0);
}

OO.Desktop.Window.prototype.toggleOutlined = function() {
	if (this.isOutlined) {
		N2i.Element.removeClassName(this.base,'outlined');
		this.workspace.setActiveWindow(this);
	} else {
		N2i.Element.addClassName(this.base,'outlined');
		this.workspace.setActiveWindow(null);
	}
	this.isOutlined=!this.isOutlined;
}

OO.Desktop.Window.prototype.endDrag = function(event) {
	OO.Desktop.debug(this.workspace.overlaps(this.getDimensions(),this.id));
}

OO.Desktop.Window.prototype.drag = function(event) {
	var e = new N2i.Event(event);
	this.base.style.left = (e.mouseLeft()+this.leftDif)+'px';
	this.base.style.top = (e.mouseTop()+this.topDif)+'px';
}

OO.Desktop.Window.prototype.setVisible = function(visible) {
	this.base.style.display = (visible ? '' : 'none');
}

N2i.Event.addLoadListener(
	function() {
		OO.Desktop.getInstance();
	}
);



OO.Desktop.Window.EntityDelegate = function(id,title) {
	this.title = title;
	this.id = id;
}

OO.Desktop.Window.EntityDelegate.prototype.getTitle = function() {
	return this.title;
}

OO.Desktop.Window.EntityDelegate.prototype.getWidth = function() {
	return 200;
}

OO.Desktop.Window.EntityDelegate.prototype.getHeight = function() {
	return null;
}

OO.Desktop.Window.EntityDelegate.prototype.refresh = function() {
	var self = this;
	Desktop.getEntityWindow(this.id,{
  		callback:function(win) { self.refreshResponse(win) },
  		timeout:5000,
  		errorHandler:function(message) { alert("Oops: " + message); }
		}
	);
}

OO.Desktop.Window.EntityDelegate.prototype.refreshResponse = function(win) {
	var html = '<table class="properties">';
	for (var i=0; i < win.properties.length; i++) {
		var prop = win.properties[i];
		html+='<tr><th>'+prop.badge+'</th><td>';
		if (prop.entityId>0) {
			html+='<a href="javascript: OO.Desktop.getInstance().addEntityWindow('+prop.entityId+',\''+prop.value+'\')">';
		}
		html+=prop.value;
		if (prop.entityId>0) {
			html+='</a>';
		}
		html+='</td></tr>';
	};
	html+='</table>';
	this.window.changeBody(html);
}