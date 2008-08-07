
In2iGui.Editor = function(element,name,options) {
	this.name = 'In2iGuiEditor';
	this.parts = [];
	this.rows = [];
	this.partControllers = [];
	this.activePart = null;
	this.active = false;
	this.dragProxy = null;
}

In2iGui.Editor.get = function() {
	if (!In2iGui.Editor.instance) {
		In2iGui.Editor.instance = new In2iGui.Editor();
	}
	return In2iGui.Editor.instance;
}

In2iGui.Editor.prototype = {
	ignite : function(options) {
		this.reload();
	},
	addPartController : function(key,title,controller) {
		this.partControllers.push({key:key,'title':title,'controller':controller});
	},
	getPartController : function(key) {
		var ctrl = null;
		this.partControllers.each(function(item) {
			if (item.key==key) ctrl=item;
		});
		return ctrl;
	},
	reload : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
		var self = this;
		this.parts = [];
		var rows = $$('.row');
		rows.each(function(row,i) {
			var columns = row.select('.column');
			self.reloadColumns(columns,i);
			columns.each(function(column,j) {
				var parts = column.select('.part');
				self.reloadParts(parts,i,j);
			});
		});
		var parts = $$('.part');
		this.parts.each(function(part) {
			var i = parts.indexOf(part.element);
			if (i!=-1) delete(parts[i]);
		});
		this.reloadParts(parts,-1,-1);
	},
	partExists : function(element) {
		
	},
	reloadColumns : function(columns,rowIndex) {
		var self = this;
		columns.each(function(column,columnIndex) {
			column.observe('mouseover',function() {
				self.hoverColumn(column);
			});
			column.observe('mouseout',function() {
				self.blurColumn();
			});
			column.observe('contextmenu',function(e) {
				self.contextColumn(column,rowIndex,columnIndex,e);
			});
		});
	},
	reloadParts : function(parts,row,column) {
		var self = this;
		parts.each(function(element,partIndex) {
			if (!element) return;
			var match = element.className.match(/part_([\w]+)/i);
			if (match && match[1]) {
				var handler = self.getPartController(match[1]);
				if (handler) {
					var part = new handler.controller(element,row,column,partIndex);
					part.type=match[1];
					element.observe('click',function() {
						//self.editPart(part);
					});
					element.observe('mouseover',function(e) {
						self.hoverPart(part);
					});
					element.observe('mouseout',function(e) {
						self.blurPart(e);
					});
					element.observe('mousedown',function(e) {
						self.startPartDrag(e);
					});
					self.parts.push(part);
				}
			}
		});
	},
	activate : function() {
		this.active = true;
	},
	deactivate : function() {
		this.active = false;
		if (this.activePart) {
			this.activePart.deactivate();
		}
		if (this.partControls) this.partControls.hide();
	},
	
	
	///////////////////////// Columns ////////////////////////
	
	hoverColumn : function(column) {
		this.hoveredColumn = column;
		if (!this.active || this.activePart) return;
		column.addClassName('in2igui_editor_column_hover');
	},
	
	blurColumn : function() {
		if (!this.active || !this.hoveredColumn) return;
		this.hoveredColumn.removeClassName('in2igui_editor_column_hover');
	},
	
	contextColumn : function(column,rowIndex,columnIndex,e) {
		if (!this.columnMenu) {
			var menu = In2iGui.Menu.create('In2iGuiEditorColumnMenu');
			menu.addItem('Slet kolonne','removeColumn');
			menu.addItem('Tilføj kolonne','addColumn');
			this.partControllers.each(function(item) {
				menu.addItem(item.title,item.key);
			});
			this.columnMenu = menu;
			menu.addDelegate(this);
		}
		this.hoveredRow=rowIndex;
		this.hoveredColumnIndex=columnIndex;
		this.columnMenu.showAtPointer(e);
	},
	itemWasClicked$In2iGuiEditorColumnMenu : function(value) {
		if (value=='removeColumn') {
			In2iGui.callDelegates(this,'removeColumn',{'row':this.hoveredRow,'column':this.hoveredColumnIndex});
		} else if (value=='addColumn') {
			In2iGui.callDelegates(this,'addColumn',{'row':this.hoveredRow,'position':this.hoveredColumnIndex+1});
		} else {
			In2iGui.callDelegates(this,'addPart',{'row':this.hoveredRow,'column':this.hoveredColumnIndex,'position':0,type:value});
		}
	},
	
	
	///////////////////////// Parts //////////////////////////
	
	hoverPart : function(part,event) {
		if (!this.active || this.activePart) return;
		this.hoveredPart = part;
		part.element.addClassName('in2igui_editor_part_hover');
		var self = this;
		this.partControlTimer = window.setTimeout(function() {self.showPartControls()},500);
	},
	showPartEditControls : function() {
		if (!this.partEditControls) {
			this.partEditControls = In2iGui.Overlay.create('In2iGuiEditorPartEditActions');
			this.partEditControls.addIcon('save','common/save');
			this.partEditControls.addIcon('cancel','common/close');
			this.partEditControls.addDelegate(this);
		}
		this.partEditControls.showAtElement(this.activePart.element,{'horizontal':'right','vertical':'topOutside'});
	},
	showPartControls : function() {
		if (!this.partControls) {
			this.partControls = In2iGui.Overlay.create('In2iGuiEditorPartActions');
			this.partControls.addIcon('edit','common/edit');
			this.partControls.addIcon('new','common/new');
			this.partControls.addIcon('delete','common/delete');
			var self = this;
			this.partControls.getElement().observe('mouseout',function(e) {
				self.blurPart(e);
			});
			this.partControls.addDelegate(this);
		}
		if (this.hoveredPart.column==-1) {
			this.partControls.hideIcons(['new','delete']);
		} else {
			this.partControls.showIcons(['new','delete']);
		}
		this.partControls.showAtElement(this.hoveredPart.element,{'horizontal':'right'});
	},
	iconWasClicked$In2iGuiEditorPartActions : function(key,event) {
		if (key=='delete') {
			this.deletePart(this.hoveredPart);
		} else if (key=='new') {
			this.newPart(event);
		} else if (key=='edit') {
			this.editPart(this.hoveredPart);
		}
	},
	iconWasClicked$In2iGuiEditorPartEditActions : function(key,event) {
		if (key=='cancel') {
			this.cancelPart(this.activePart);
		} else if (key=='save') {
			this.savePart(this.activePart);
		}
	},
	blurPart : function(e) {
		window.clearTimeout(this.partControlTimer);
		if (!this.active) return;
		if (!In2iGui.isWithin(e,this.hoveredPart.element)) {
			N2i.log('not within!')
			this.hidePartControls();
		}
	},
	hidePartControls : function() {
		this.hoveredPart.element.removeClassName('in2igui_editor_part_hover');
		if (this.partControls) {
			this.partControls.hide();
		}
	},
	hidePartEditControls : function() {
		if (this.partEditControls) {
			this.partEditControls.hide();
		}
	},
	editPart : function(part) {
		if (!this.active || this.activePart) return;
		if (this.activePart) this.activePart.deactivate();
		this.activePart = part;
		this.showPartEditControls();
		part.element.addClassName('in2igui_editor_part_active');
		part.activate();
		window.clearTimeout(this.partControlTimer);
		this.hidePartControls();
		this.blurColumn();
	},
	cancelPart : function(part) {
		part.cancel();
	},
	savePart : function(part) {
		part.save();
	},
	getEditorForElement : function(element) {
		for (var i=0; i < this.parts.length; i++) {
			if (this.parts[i].element==element) {
				return this.parts[i];
			}
		};
		return null;
	},
	partDidDeacivate : function(part) {
		part.element.removeClassName('in2igui_editor_part_active');
		this.activePart = null;
		this.hidePartEditControls();
	},
	partChanged : function(part) {
		In2iGui.callDelegates(part,'partChanged');
	},
	deletePart : function(part) {
		In2iGui.get().confirm('cofirmDeletePart',{title:'Er du sikker på at du vil slette?'});
		In2iGui.callDelegates(part,'deletePart');
		this.partControls.hide();
	},
	newPart : function(e) {
		if (!this.newPartMenu) {
			var menu = In2iGui.Menu.create('In2iGuiEditorNewPartMenu');
			this.partControllers.each(function(item) {
				menu.addItem(item.title,item.key);
			});
			menu.addDelegate(this);
			this.newPartMenu=menu;
		}
		this.newPartMenu.showAtPointer(e);
	},
	itemWasClicked$In2iGuiEditorNewPartMenu : function(value) {
		var info = {row:this.hoveredPart.row,column:this.hoveredPart.column,position:this.hoveredPart.position+1,type:value};
		In2iGui.callDelegates(this,'addPart',info);
	},
	/**** Dragging ****/
	startPartDrag : function(e) {
		return true;
		if (!this.active || this.activePart) return true;
		if (!this.dragProxy) {
			this.dragProxy = new Element('div').addClassName('in2igui_editor_dragproxy part part_header');
			document.body.appendChild(this.dragProxy);
		}
		var element = this.hoveredPart.element;
		this.dragProxy.setStyle({'width':element.getWidth()+'px'});
		this.dragProxy.innerHTML = element.innerHTML;
		In2iGui.Editor.startDrag(e,this.dragProxy);
		return;
		Element.observe(document.body,'mouseup',function() {
			self.endPartDrag();
		})
	},
	dragPart : function() {
		
	},
	endPartDrag : function() {
		In2iGui.get();
	}
}



In2iGui.Editor.startDrag = function(e,element) {
	In2iGui.Editor.dragElement = element;
	Element.observe(document.body,'mousemove',In2iGui.Editor.dragListener);
	Element.observe(document.body,'mouseup',In2iGui.Editor.dragEndListener);
	In2iGui.Editor.startDragPos = {top:e.pointerY(),left:e.pointerX()};
	e.stop();
	return false;
}

In2iGui.Editor.dragListener = function(e) {
	var element = In2iGui.Editor.dragElement;
	element.style.left = e.pointerX()+'px';
	element.style.top = e.pointerY()+'px';
	element.style.display='block';
	return false;
}

In2iGui.Editor.dragEndListener = function(event) {
	Event.stopObserving(document.body,'mousemove',In2iGui.Editor.dragListener);
	Event.stopObserving(document.body,'mouseup',In2iGui.Editor.dragEndListener);
	In2iGui.Editor.dragElement.style.display='none';
	In2iGui.Editor.dragElement=null;
}

////////////////////////////////// Header editor ////////////////////////////////

In2iGui.Editor.Header = function(element,row,column,position) {
	this.element = $(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = this.element.id.match(/part\-([\d]+)/i)[1];
	this.header = $tag('*',this.element)[0];
	this.field = null;
}

In2iGui.Editor.Header.prototype = {
	activate : function() {
		this.value = this.header.innerHTML;
		this.field = new Element('textarea').addClassName('in2igui_editor_header');
		this.field.value = this.value;
		this.header.style.visibility='hidden';
		this.updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		var self = this;
		this.field.onblur = function() {
			//self.deactivate();
		}
		this.field.onkeydown = function(e) {
			if (new N2i.Event(e).isReturnKey()) {
				self.save();
			}
		}
	},
	save : function() {
		var value = this.field.value;
		this.header.innerHTML = value;
		this.deactivate();
		if (value!=this.value) {
			this.value = value;
			In2iGui.Editor.get().partChanged(this);
		}
	},
	cancel : function() {
		this.deactivate();
	},
	deactivate : function() {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
		In2iGui.Editor.get().partDidDeacivate(this);
	},
	updateFieldStyle : function() {
		this.field.style.width=N2i.getWidth(this.header)+'px';
		this.field.style.height=N2i.getHeight(this.header)+'px';
		this.field.style.fontSize=N2i.getStyle(this.header,'font-size');
		this.field.style.fontWeight=N2i.getStyle(this.header,'font-weight');
		this.field.style.fontFamily=N2i.getStyle(this.header,'font-family');
		this.field.style.textAlign=N2i.getStyle(this.header,'text-align');
		this.field.style.color=N2i.getStyle(this.header,'color');
	},
	getValue : function() {
		return this.value;
	}
}

////////////////////////////////// Html editor ////////////////////////////////

In2iGui.Editor.Html = function(element,row,column,position) {
	this.element = $id(element);
	this.row = row;
	this.column = column;
	this.position = position;
	this.id = this.element.id.match(/part\-([\d]+)/i)[1];
	this.field = null;
}

In2iGui.Editor.Html.prototype = {
	activate : function() {
		this.value = this.element.innerHTML;
		if (Prototype.Browser.IE) return;
		var height = this.element.getHeight();
		this.element.update('');
		this.editor = In2iGui.RichText.create(null,{autoHideToolbar:false});
		this.editor.setHeight(height);
		this.element.appendChild(this.editor.getElement());
		this.editor.addDelegate(this);
		this.editor.ignite();
		this.editor.setValue(this.value);
		this.editor.focus();
	},
	cancel : function() {
		this.deactivate();
		this.element.innerHTML = this.value;
	},
	save : function() {
		this.deactivate();
		if (Prototype.Browser.IE) return;
		var value = this.editor.value;
		if (value!=this.value) {
			this.value = value;
			In2iGui.Editor.get().partChanged(this);
		}
		this.element.innerHTML = this.value;
	},
	deactivate : function() {
		if (!Prototype.Browser.IE) {
			this.editor.deactivate();
		}
		In2iGui.Editor.get().partDidDeacivate(this);
	},
	richTextDidChange : function() {
		//this.deactivate();
	},
	getValue : function() {
		return this.value;
	}
}

/* EOF */