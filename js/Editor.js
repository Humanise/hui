/**
 * Editing of documents composed of different parts
 *
 * <pre>
 * <strong>Events</strong>
 * $partWasMoved : function(info)
 * $addPart
 * </pre>
 * @constructor
 */
hui.ui.Editor = function() {
	this.name = 'huiEditor';
	this.options = {rowClass:'row',columnClass:'column',partClass:'part'};
	this.parts = [];
	this.rows = [];
	this.partControllers = [];
	this.activePart = null;
	this.active = false;
	this.live = true;
	hui.ui.extend(this);
}

hui.ui.Editor.get = function() {
	if (!hui.ui.Editor.instance) {
		hui.ui.Editor.instance = new hui.ui.Editor();
	}
	return hui.ui.Editor.instance;
}

hui.ui.Editor.prototype = {
	/** Start the editor */
	ignite : function() {
		hui.listen(window,'keydown',this._onKeyDown.bind(this));
		hui.listen(window,'keyup',this._onKeyUp.bind(this));
		this.reload();
	},
	_onKeyDown : function(e) {
		e = hui.event(e);
		//this.live = e.altKey;
	},
	_onKeyUp : function(e) {
		//this.live = false;
	},
	
	addPartController : function(key,title,controller) {
		this.partControllers.push({key:key,'title':title,'controller':controller});
	},
	setOptions : function(options) {
		hui.override(this.options,options);
	},
	_getPartController : function(key) {
		var ctrl = null;
		hui.each(this.partControllers,function(item) {
			if (item.key==key) {ctrl=item};
		});
		return ctrl;
	},
	reload : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
		var self = this;
		this.parts = [];
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		hui.each(rows,function(row,i) {
			var columns = hui.get.byClass(row,self.options.columnClass);
			self._reloadColumns(columns,i);
			hui.each(columns,function(column,j) {
				var parts = hui.get.byClass(column,self.options.partClass);
				self._reloadParts(parts,i,j);
			});
		});
		/*
		var parts = hui.get.byClass(document.body,this.options.partClass);
		hui.each(this.parts,function(part) {
			var i = parts.indexOf(part.element);
			if (i!=-1) {
				delete(parts[i]);
			}
		});
		this._reloadParts(parts,-1,-1);
		*/
	},
	_reloadColumns : function(columns,rowIndex) {
		var self = this;
		hui.each(columns,function(column,columnIndex) {
			hui.listen(column,'mouseover',function() {
				self._onHoverColumn(column);
			});
			hui.listen(column,'mouseout',function(e) {
				self._onBlurColumn(e);
			});
			/*
			hui.listen(column,'contextmenu',function(e) {
				self.contextColumn(column,rowIndex,columnIndex,e);
			});*/
		});
	},
	_reloadParts : function(parts,row,column) {
		var self = this;
		var reg = new RegExp(this.options.partClass+"_([\\w]+)","i");
		hui.each(parts,function(element,partIndex) {
			if (!element) return;
			var match = element.className.match(reg);
			if (match && match[1]) {
				var handler = self._getPartController(match[1]);
				if (handler) {
					var part = new handler.controller({element:element});
					part.type = match[1];
					hui.listen(element,'click',function(e) {
						e = hui.event(e);
						if (!e.findByTag('a') && e.altKey) {
							self._editPart(part);
						}
					});
					hui.listen(element,'mouseover',function(e) {
						self.hoverPart(part);
					});
					hui.listen(element,'mouseout',function(e) {
						self.blurPart(e);
					});
					self.parts.push(part);
				}
				hui.listen(element,'mousedown',function(e) {
					self._startPartDrag({
						element : element,
						event : e
					});
				});
			}
		});
	},
	activate : function() {
		this.active = true;
	},
	deactivate : function() {
		this.active = false;
		if (this.activePart) {
			this._deactivatePart(this.activePart);
		}
		if (this.partControls) {
			this.partControls.hide();
		}
	},
	
	
	///////////////////////// Columns ////////////////////////
	
	_onHoverColumn : function(column) {
		if (this.hoveredColumn) {
			hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
		}
		this.hoveredColumn = column;
		if (!this.active || this.activePart) {
			return;
		}
		hui.cls.add(column,'hui_editor_column_hover');
	},
	
	_onBlurColumn : function(e) {
		if (!this.active || !this.hoveredColumn || hui.ui.isWithin(e,this.hoveredColumn)) return;
		hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
	},
	
	contextColumn : function(column,rowIndex,columnIndex,e) {
		if (!this.active || this.activePart) return;
		if (!this.columnMenu) {
			var menu = hui.ui.Menu.create({name:'huiEditorColumnMenu'});
			menu.addItem({title:'Rediger kolonne',value:'editColumn'});
			menu.addItem({title:'Slet kolonne',value:'removeColumn'});
			menu.addItem({title:'Tilføj kolonne',value:'addColumn'});
			menu.addDivider();
			for (var i=0; i < this.partControllers.length; i++) {
				var ctrl = this.partControllers[i];
				menu.addItem({title:ctrl.title,value:ctrl.key});
			};
			this.columnMenu = menu;
			menu.listen(this);
		}
		this.hoveredRow=rowIndex;
		this.hoveredColumnIndex=columnIndex;
		this.columnMenu.showAtPointer(e);
	},
	/** @private */
	$itemWasClicked$huiEditorColumnMenu : function(value) {
		if (value=='removeColumn') {
			this.fire('removeColumn',{'row':this.hoveredRow,'column':this.hoveredColumnIndex});
		} else if (value=='editColumn') {
			this.editColumn(this.hoveredRow,this.hoveredColumnIndex);
		} else if (value=='addColumn') {
			this.fire('addColumn',{'row':this.hoveredRow,'position':this.hoveredColumnIndex+1});
		} else {
			this.fire('addPart',{'row':this.hoveredRow,'column':this.hoveredColumnIndex,'position':0,type:value});
		}
	},
	
	///////////////////// Column editor //////////////////////
	
	editColumn : function(rowIndex,columnIndex) {
		this.closeColumn();
		var row = hui.get.byClass(document.body,'row')[rowIndex];
		var c = this.activeColumn = hui.get.byClass(row,'column')[columnIndex];
		hui.cls.add(c,'hui_editor_column_edit');
		this.showColumnWindow();
		this.columnEditorForm.setValues({width:hui.style.get(c,'width'),paddingLeft:hui.style.get(c,'padding-left')});
	},
	closeColumn : function() {
		if (this.activeColumn) {
			hui.cls.remove(this.activeColumn,'hui_editor_column_edit');
		}
	},
	showColumnWindow : function() {
		if (!this.columnEditor) {
			var w = this.columnEditor = hui.ui.Window.create({name:'columnEditor',title:'Rediger kolonne',width:200});
			var f = this.columnEditorForm = hui.ui.Formula.create();
			var g = f.createGroup();
			var width = hui.ui.TextField.create({label:'Bredde',key:'width'});
			width.listen({$valueChanged:function(v) {this.changeColumnWidth(v)}.bind(this)})
			g.add(width);
			var marginLeft = hui.ui.TextField.create({label:'Venstremargen',key:'left'});
			marginLeft.listen({$valueChanged:function(v) {this.changeColumnLeftMargin(v)}.bind(this)})
			g.add(marginLeft);
			var marginRight = hui.ui.TextField.create({label:'Højremargen',key:'right'});
			marginRight.listen({$valueChanged:this.changeColumnRightMargin.bind(this)})
			g.add(marginRight);
			w.add(f);
			w.listen(this);
		}
		this.columnEditor.show();
	},
	/** @private */
	$userClosedWindow$columnEditor : function() {
		this.closeColumn();
		var values = this.columnEditorForm.getValues();
		values.row=this.hoveredRow;
		values.column=this.hoveredColumnIndex;
		this.fire('updateColumn',values);
	},
	changeColumnWidth : function(width) {
		this.activeColumn.style.width=width;
	},
	changeColumnLeftMargin : function(margin) {
		this.activeColumn.setStyle({'paddingLeft':margin});
	},
	changeColumnRightMargin : function(margin) {
		this.activeColumn.setStyle({'paddingRight':margin});
	},
	///////////////////////// Parts //////////////////////////
	
	hoverPart : function(part,event) {
		if (!this.active || this.activePart || !this.live || this.dragging || this.busy) {
			return;
		}
		this.hoveredPart = part;
		hui.cls.add(part.element,'hui_editor_part_hover');
		var self = this;
		this.partControlTimer = window.setTimeout(function() {self.showPartControls()},200);
	},
	blurPart : function(e) {
		window.clearTimeout(this.partControlTimer);
		if (hui.ui.isWithin(e,this.hoveredPart.element)) {
			return;
		}
		if (!this.active) return;
		if (this.partControls && !hui.ui.isWithin(e,this.partControls.element)) {
			this._hidePartControls();
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		}
		if (!this.partControls && this.hoveredPart) {
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');			
		}
	},
	showPartEditControls : function() {
		if (!this.partEditControls) {
			this.partEditControls = hui.ui.Overlay.create({name:'huiEditorPartEditActions',variant:'light',zIndex:100});
			this.partEditControls.addIcon('save','common/ok');
			this.partEditControls.addIcon('cancel','common/stop');
			this.partEditControls.addIcon('info','common/info_small');
			this.partEditControls.listen(this);
		}
		this.partEditControls.showAtElement(this.activePart.element,{'horizontal':'right','vertical':'topOutside'});
	},
	showPartControls : function() {
		if (!this.partControls) {
			this.partControls = hui.ui.Overlay.create({name:'huiEditorPartActions',variant:'light'});
			this.partControls.addIcon('edit','common/edit');
			this.partControls.addIcon('new','common/new');
			this.partControls.addIcon('delete','common/delete');
			var self = this;
			hui.listen(this.partControls.getElement(),'mouseout',this._blurControls.bind(this));
			hui.listen(this.partControls.getElement(),'mouseover',this._hoverControls.bind(this));
			this.partControls.listen(this);
		}
		if (this.hoveredPart.column==-1 || true) {
			this.partControls.hideIcons(['new','delete']);
		} else {
			this.partControls.showIcons(['new','delete']);
		}
		this.partControls.showAtElement(this.hoveredPart.element,{'horizontal':'right'});
	},
	_hoverControls : function(e) {
		hui.cls.add(this.hoveredPart.element,'hui_editor_part_hover');
	},
	_blurControls : function(e) {
		hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		if (!hui.ui.isWithin(e,this.hoveredPart.element)) {
			this._hidePartControls();
		}
	},
	/** @private */
	$iconWasClicked$huiEditorPartActions : function(key,event) {
		if (key=='delete') {
			this.deletePart(this.hoveredPart);
		} else if (key=='new') {
			this.newPart(event);
		} else if (key=='edit') {
			this._editPart(this.hoveredPart);
		}
	},
	/** @private */
	$iconWasClicked$huiEditorPartEditActions : function(key,event) {
		if (key=='cancel') {
			this.cancelPart(this.activePart);
		} else if (key=='save') {
			this.savePart(this.activePart);
		} else if (key=='info') {
			this.fire('toggleInfo');
		}
	},
	_hidePartControls : function() {
		if (this.partControls) {
			this.partControls.hide();
		}
	},
	_hidePartEditControls : function() {
		if (this.partEditControls) {
			this.partEditControls.hide();
		}
	},
	_editPart : function(part) {
		if (!this.active || this.activePart) return;
		if (this.activePart) {
			this._deactivatePart(this.activePart);
		}
		if (this.hoveredPart) {
			hui.cls.remove(this.hoveredPart.element,'hui_editor_part_hover');
		}
		this.activePart = part;
		this.showPartEditControls();
		hui.cls.add(part.element,'hui_editor_part_active');
		hui.ui.msg({text:{en:'Loading...',da:'Indlæser...'},delay:300,busy:true});
		part.activate(function() {
			hui.ui.hideMessage();
		});
		window.clearTimeout(this.partControlTimer);
		this._hidePartControls();
		if (this.hoveredColumn) {
			hui.cls.remove(this.hoveredColumn,'hui_editor_column_hover');
		}
		this.fire('editPart',part);
	},
	cancelPart : function(part) {
		part.cancel();
		this._deactivatePart(this.activePart);
		this.activePart = null;
		this.fire('cancelPart',part);
	},
	savePart : function(part) {
		this.busy = true;
		hui.ui.msg({text:{en:'Saving...',da:'Gemmer...'},delay:300,busy:true});
		part.save({
			callback : function() {
				hui.ui.hideMessage();
				this.activePart = null;
				this.busy = false;
				this._deactivatePart(part);
				this.partChanged(part);
				this.fire('savePart',part);
			}.bind(this)
		});
	},
	getEditorForElement : function(element) {
		for (var i=0; i < this.parts.length; i++) {
			if (this.parts[i].element==element) {
				return this.parts[i];
			}
		};
		return null;
	},
	_deactivatePart : function(part) {
		part.deactivate(function() {
			this.partDidDeactivate(part);
			this.fire('deactivatePart',part);
		}.bind(this))
	},
	partDidDeactivate : function(part) {
		hui.cls.remove(part.element,'hui_editor_part_active');
		this.activePart = null;
		this._hidePartEditControls();
	},
	partChanged : function(part) {
		hui.ui.callDelegates(part,'partChanged');
	},
	deletePart : function(part) {
		hui.ui.callDelegates(part,'deletePart');
		this.partControls.hide();
	},
	newPart : function(e) {
		if (!this.newPartMenu) {
			var menu = hui.ui.Menu.create({name:'huiEditorNewPartMenu'});
			hui.each(this.partControllers,function(item) {
				menu.addItem({title:item.title,value:item.key});
			});
			menu.listen(this);
			this.newPartMenu=menu;
		}
		this.newPartMenu.showAtPointer(e);
	},
	$itemWasClicked$huiEditorNewPartMenu : function(value) {
		var info = {row:this.hoveredPart.row,column:this.hoveredPart.column,position:this.hoveredPart.position+1,type:value};
		hui.ui.callDelegates(this,'addPart',info);
	},
	
	
	
	
	
	
	/**** Dragging ****/
	
	_dragInfo : null,
	
	_dropInfo : null,
	
	dragProxy : null,
	
	_startPartDrag : function(info) {
		if (!this.active || this.activePart || !this.live) {
			return true;
		}
		var e = hui.event(info.event),
			element = info.element;
		if (!e.altKey) {
			return;
		}
		e.stop();
		
		if (!this.dragProxy) {
			this.dragProxy = hui.build('div',{'class':'hui_editor_dragproxy',parent:document.body,style:'display:none;'});
		}
		var proxy = this.dragProxy;
		proxy.innerHTML = element.innerHTML;
		
		var pos = this._getPartPosition(element);
		if (!pos) {
			return;
		}
		
		this._dragInfo = {
			diffLeft : e.getLeft() - hui.position.getLeft(element),
			diffTop : e.getTop() - hui.position.getTop(element),
			draggedElement : element,
			partIndex : pos.partIndex,
			rowIndex : pos.rowIndex,
			columnIndex : pos.columnIndex,
			initialHeight : element.clientHeight
		}
		hui.log('startDrag')
		hui.drag.start({
			element : proxy,
			onBeforeMove : this._onBeforeDrag.bind(this),
			onMove : this._onDrag.bind(this),
			onAfterMove : this._onAfterDrag.bind(this),
			onEnd : function() {
				
			}
		},e);
	},
	_onBeforeDrag : function() {
		var dragged = this._dragInfo.draggedElement,
			proxy = this.dragProxy;
		
		
		this._insertDropPlaceholders();
		
		hui.style.set(proxy,{
			display : 'block',
			visibility : 'visible',
			height  : dragged.clientHeight+'px',
			width  : dragged.clientWidth+'px',
			transform : 'scale(1)',
			background : 'rgba(255,255,255,.5)',
			padding : '1px',
			opacity: 1
		});
		
		//hui.animate({node:this.dragProxy,css:{transform:'scale(1.1)'},duration:1000,ease:hui.ease.slowFastSlow});
		
		hui.style.setOpacity(dragged,0.5);
		
		this._dragging = true;
		
		if (!this._dropMarker) {
			this._dropMarker = hui.build('div',{'class':'hui_editor_dropmarker',parent:document.body});
		}
	},
	_onDrag : function(e) {
		var left = e.getLeft();
		var top = e.getTop();
		this.dragProxy.style.left = (left - this._dragInfo.diffLeft) + 'px';
		this.dragProxy.style.top = (top - this._dragInfo.diffTop) + 'px';
		for (var i=0; i < this.dropTargets.length; i++) {
			var info = this.dropTargets[i];
			if (info.left<left && info.right>left && info.top<top && info.bottom>top) {
				//if (info.placeholder!=this._activeDragPlaceholder) {
					var h = this._dragColumnHeights[info.rowIndex+'-'+info.columnIndex];
					//hui.log(info.columnIndex+': '+h)
					//info.debug.style.borderColor='blue'
					//hui.animate({node:info.placeholder,css:{height : h+'px'},duration:500,ease:hui.ease.slowFastSlow});
					if (this._latestProxyColumn!=info.columnIndex || this._latestProxyRow!=info.rowIndex) {
						hui.animate({node:this.dragProxy,css:{width:(info.right-info.left)+'px'},duration:300,ease:hui.ease.fastSlow});
						this._latestProxyColumn = info.columnIndex;
						this._latestProxyrow = info.rowIndex;
					}
					//this._activeDragPlaceholder = info.placeholder;
					this._dropInfo = info;
					hui.style.set(this._dropMarker,{width:(info.right-info.left)+'px',left:info.left+'px',top:info.position+'px',display:'block'});
				//}	
				break;
			}
		};
	},
	_onAfterDrag : function(e) {
		var proxy = this.dragProxy,
			dragInfo = this._dragInfo,
			dragged = this._dragInfo.draggedElement,
			dropInfo = this._dropInfo;
		
		if (dropInfo) {
			var newHeight = this._dragColumnHeights[dropInfo.rowIndex+'-'+dropInfo.columnIndex];
			
			var top = dropInfo.position,
				left = dropInfo.left;
				
			if ((dragInfo.columnIndex == dropInfo.columnIndex && dragInfo.partIndex < dropInfo.partIndex) || dragInfo.rowIndex < dropInfo.rowIndex) {
				top = top - dragInfo.initialHeight;
			}
			//top+=3;
			left++;
			// Move the proxy to new position
			hui.animate({
				node : proxy,
				css : {
					left : left+'px',
					top : top+'px',
					opacity : 0.5
					},
				duration : 500,
				ease : hui.ease.slowFastSlow
			});
			
			var column = this._getColumn(dropInfo.rowIndex,dropInfo.columnIndex);
			
			var parts = hui.get.byClass(column,this.options.partClass);
			
			if (parts[dropInfo.partIndex] != dragged) {
				this.fire('partWasMoved',{dragged:dragged,rowIndex : dropInfo.rowIndex,columnIndex : dropInfo.columnIndex,partIndex : dropInfo.partIndex, 
					$success : function() {
						dragged.style.webkitTransformOrigin='0 0';
						var dummy = hui.build('div');
						if (dropInfo.partIndex>=parts.length) {
							hui.animate({node:dragged,css:{height:'0px'},duration:500,ease:hui.ease.slowFastSlow,onComplete:function() {
								hui.dom.remove(dragged);
								column.appendChild(dragged);
								hui.animate({node:dragged,css:{transform:'scale(1)',height:newHeight+'px'},duration:500,ease:hui.ease.slowFastSlow,onComplete:function() {
									dragged.style.height='';
								}});
							}});
						} else {
							hui.dom.insertBefore(parts[dropInfo.partIndex],dummy);
							hui.animate({node:dummy,css:{height:newHeight+'px'},duration:600,ease:hui.ease.slowFastSlow,onComplete:function() {
								hui.dom.remove(dragged);
								hui.dom.replaceNode(dummy,dragged);
								hui.style.set(dragged,{transform:'scale(1)',opacity:0,height:''})
								hui.animate({node:dragged,css:{opacity:1},duration:500,ease:hui.ease.slowFastSlow});
							}});
							hui.animate({node:dragged,css:{transform:'scale(0)',height:'0px'},duration:500,ease:hui.ease.slowFastSlow});
						}
						this._cleanDrag();
					}.bind(this),
					$failure : function() {
						this._cleanDrag();
					}.bind(this)
				});
			} else {	
				this._cleanDrag();
			}
		}
	},
	_cleanDrag : function() {
		var proxy = this.dragProxy;
		hui.animate({node:proxy,css:{opacity:0},duration:500,delay:500,ease:hui.ease.slowFastSlow,onComplete:function() {
				proxy.style.display='none';
			}
		});
		hui.style.setOpacity(this._dragInfo.draggedElement,1);
		var p = hui.get.byClass(document.body,'hui_editor_drop_placeholder');
		for (var i=0; i < p.length; i++) {
			hui.dom.remove(p[i]);
		};
		this.dropTargets = [];
		this._dragging = false;
		if (this._dropMarker) {
			this._dropMarker.style.display='none'
		}
	},
	_getColumn : function(rowIndex,columnIndex) {
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		var row = rows[rowIndex];
		var columns = hui.get.byClass(row,this.options.columnClass);
		return columns[columnIndex];
	},
	_getPartPosition : function(element) {
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		for (var i=0; i < rows.length; i++) {
			
			var columns = hui.get.byClass(rows[i],this.options.columnClass);
			for (var j=0; j < columns.length; j++) {
				var parts = hui.get.byClass(columns[j],this.options.partClass);
				for (var k=0; k < parts.length; k++) {
					if (element===parts[k]) {
						return {rowIndex:i,columnIndex:j,partIndex:k};
					}
				};
			};
		};
		return null;
	},
	
	
	_activeDragPlaceholder : null,
	
	_dragInfo : null,
	
	_dragColumnHeights : null,
	
	_insertDropPlaceholders : function() {
		var infos = this.dropTargets = [];
		var colHeights = this._dragColumnHeights = {}
		var proxy = this.dragProxy;
		var draggedPart = this._dragInfo.draggedElement;
		var rows = hui.get.byClass(document.body,this.options.rowClass);
		for (var i=0; i < rows.length; i++) {
			var row = rows[i]
			var columns = hui.get.byClass(row,this.options.columnClass);
			for (var j=0; j < columns.length; j++) {
				var column = columns[j];
				hui.style.set(proxy,{
					width : column.clientWidth+'px',
					height : '',
					visibility : 'hidden',
					display : 'block'
				});
				var height = colHeights[i+'-'+j] = proxy.clientHeight;
				var parts = hui.get.byClass(column,this.options.partClass);
				var min = hui.position.getTop(column);
				var max = min+column.clientHeight;
				var current = min;
				var k=0;
				var previous = null;
				for (; k < parts.length; k++) {
					var part = parts[k],
						next = parts[k+1],
						previous = parts[k-1]
					var left = hui.position.getLeft(part);
					var right = left + part.clientWidth;
					var top = previous ? hui.position.getTop(previous)+previous.clientHeight/2 : min;
					var bottom = hui.position.getTop(part)+part.clientHeight/2;
					
					var info = {
						rowIndex : i,
						columnIndex : j,
						partIndex : k,
						part : part,
						left : left,
						right : right,
						top : top,
						bottom : bottom,
						position : hui.position.getTop(part)
					}
					current += part.clientHeight;
					infos.push(info);
					previous = part;
				};
				var last = parts.length>0 ? parts[parts.length-1] : null;
				if (last) {
					var top = hui.position.getTop(last)+last.clientHeight/2;
					var position = hui.position.getTop(last)+last.clientHeight;
				} else {
					var top = min;
					var position = min;
					var left = hui.position.getLeft(column);
					var right = left + column.clientWidth;
				}
				var info = {
					rowIndex : i,
					columnIndex : j,
					partIndex : k+1,
					part : part,
					left : left,
					right : right,
					top : top,
					position : position,
					bottom : max-top > 20 ? max : top+20
				}
				if (part) {
					current += part.clientHeight;
				}
				infos.push(info);
			}
		}
		for (var i=0; i < infos.length; i++) {
			var info = infos[i]
			//info.debug = hui.build('div',{style:'border: 1px solid red; position: absolute; top:'+info.top+'px;left:'+(info.left)+'px; height: '+(info.bottom-info.top)+'px; width:'+(info.right-info.left)+'px',parent:document.body})
		};
	}
}

hui.ui.Editor.getPartId = function(element) {
	if (!element.id) return;
	var m = element.id.match(/part\-([\d]+)/i);
	if (m && m.length>0) return m[1];
}

////////////////////////////////// Header editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Header = function(options) {
	this.element = hui.get(options.element);
	this.id = hui.ui.Editor.getPartId(this.element);
	this.header = hui.get.firstByTag(this.element,'*');
	this.field = null;
}

hui.ui.Editor.Header.prototype = {
	activate : function(callback) {
		this.value = this.header.innerHTML;
		this.field = hui.build('textarea',{className:'hui_editor_header'});
		this.field.value = this.value;
		this.header.style.visibility='hidden';
		this.updateFieldStyle();
		this.element.insertBefore(this.field,this.header);
		this.field.focus();
		this.field.select();
		hui.listen(this.field,'keydown',function(e) {
			if (e.keyCode==Event.KEY_RETURN) {
				this.save();
			}
		}.bind(this));
        callback();
	},
	save : function(options) {
		var value = this.field.value;
		this.header.innerHTML = value;
		if (value!=this.value) {
			this.value = value;
		}
        options.callback();
	},
	cancel : function() {
		
	},
	deactivate : function(callback) {
		this.header.style.visibility='';
		this.element.removeChild(this.field);
        callback();
	},
	updateFieldStyle : function() {
		hui.style.set(this.field,{width:this.header.clientWidth+'px',height:this.header.clientHeight+'px'});
		hui.style.copy(this.header,this.field,['font-size','line-height','margin-top','font-weight','font-family','text-align','color','font-style']);
	},
	getValue : function() {
		return this.value;
	}
}

////////////////////////////////// Html editor ////////////////////////////////

/**
 * @constructor
 */
hui.ui.Editor.Html = function(options) {
	this.element = hui.get(options.element);
	this.id = hui.ui.Editor.getPartId(this.element);
	this.field = null;
}

hui.ui.Editor.Html.prototype = {
	activate : function(callback) {
		this.value = this.element.innerHTML;
		this.element.innerHTML='';
		var style = this.buildStyle();
		this.editor = hui.ui.MarkupEditor.create({autoHideToolbar:false,style:style});
		this.element.appendChild(this.editor.getElement());
		this.editor.listen(this);
		this.editor.setValue(this.value);
		this.editor.focus();
		callback();
	},
	buildStyle : function() {
		return {
			'textAlign':hui.style.get(this.element,'text-align')
			,'fontFamily':hui.style.get(this.element,'font-family')
			,'fontSize':hui.style.get(this.element,'font-size')
			,'fontWeight':hui.style.get(this.element,'font-weight')
			,'color':hui.style.get(this.element,'color')
		}
	},
	cancel : function() {
		this.element.innerHTML = this.value;
	},
	save : function(options) {
		var value = this.editor.getValue();
		if (value!=this.value) {
			this.value = value;
		}
		this.element.innerHTML = this.value;
        options.callback();
	},
	deactivate : function(callback) {
		if (this.editor) {
			this.editor.destroy();
			this.element.innerHTML = this.value;
		}
		callback();
	},
	richTextDidChange : function() {
		//this.deactivate();
	},
	getValue : function() {
		return this.value;
	}
}

/* EOF */