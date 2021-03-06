/** @constructor */
hui.ui.Gallery = function(options) {
  this.options = options || {};
  this.name = options.name;
  this.element = hui.get(options.element);
  this.body = hui.get.firstByClass(this.element,'hui_gallery_body');
  this.objects = [];
  this.nodes = [];
  this.selected = [];
  this.width = 100;
  this.height = 100;
  this.revealing = false;
  hui.ui.extend(this);
  if (options.dropFiles) {
    this._addDrop();
  }
  if (this.options.source) {
    this.options.source.listen(this);
  }
  if (this.element.parentNode && hui.cls.has(this.element.parentNode,'hui_overflow')) {
    this.revealing = true;
    hui.listen(this.element.parentNode,'scroll',this._reveal.bind(this));
  }
};

hui.ui.Gallery.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_gallery',html:'<div class="hui_gallery_progress"></div><div class="hui_gallery_body"></div>'});
  return new hui.ui.Gallery(options);
};

hui.ui.Gallery.prototype = {
  _addDrop : function() {
    hui.drag.listen({
      element : this.element,
      hoverClass : 'hui_gallery_drop',
      $dropFiles : function(files) {
        this.fire('filesDropped',files);
      }.bind(this),
      $dropURL : function(url) {
        this.fire('urlDropped',url);
      }.bind(this)
    });
  },
  hide : function() {
    this.element.style.display='none';
  },
  show : function() {
    this.element.style.display='';
    if (this.options.source) {
      this.options.source.refresh();
    }
  },
  setSize : function(size) {
    this.width = size;
    this.height = size;
    for (var i=0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      node.style.width = size+'px';
      node.style.height = size+'px';
    }
    this.maxRevealed = 0;
    clearTimeout(this._timer);
    this._timer = setTimeout(function() {
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].revealed = false;
      }
      this._reveal();
    }.bind(this),500);
  },
  reRender : function() {
    this._render();
  },
  setObjects : function(objects) {
    this.selected = [];
    this.objects = objects;
    this._render();
    this.fire('selectionReset');
  },
  getObjects : function() {
    return this.objects;
  },
  /** @private */
  $sourceShouldRefresh : function() {
    return hui.dom.isVisible(this.element);
  },
  /** @private */
  $objectsLoaded : function(objects) {
    this.setObjects(objects);
  },
  /** @private */
  $optionsLoaded : function(objects) {
    this.setObjects(objects);
  },
  /** @private */
  _render : function() {
    this.nodes = [];
    this.maxRevealed = 0;
    this.body.innerHTML = '';
    hui.each(this.objects,function(object,i) {
      var top = 0;
      if (!this.revealing && object.height < object.width) {
        top = (this.height-(this.height*object.height/object.width))/2;
      }
      var img = hui.build('img',{style:'margin:'+top+'px auto 0px'});
      var item = hui.build('div',{'class' : 'hui_gallery_item',style:'width:'+this.width+'px; height:'+this.height+'px'});
      if (!this.revealing) {
        item.style.backgroundImage = 'url(' + this._resolveImageUrl(object) + ')';
      }
      //item.appendChild(img);
      hui.listen(item,'click',function(e) {
        this._itemClicked(i,e);
      }.bind(this));
      item.dragDropInfo = {kind:'image',icon:'common/image',id:object.id,title:object.name || object.title};
      item.onmousedown = function(e) {
        hui.ui.startDrag(e,item);
        return false;
      };
      hui.listen(item,'dblclick',function() {
        this._onItemDoubleClick(i);
      }.bind(this));
      this.body.appendChild(item);
      this.nodes.push(item);
    }.bind(this));
    this._reveal();
    this.fireSizeChange();
  },
  _reveal : function() {
    if (!this.revealing) {
      return;
    }
    var container = this.element.parentNode;
    var limit = container.scrollTop + container.clientHeight;
    if (limit <= this.maxRevealed) {
      return;
    }
    this.maxRevealed = limit;
    var self = this;
    for (var i=0,l=this.nodes.length; i < l; i++) {
      var item = this.nodes[i];
      if (item.revealed) {
        continue;
      }
      if (item.offsetTop < limit) {
        this._load(item, this.objects[i]);
      } else {
        hui.cls.add(item,'hui_is_pending');
      }
    }
  },
  _load : function(item, object) {
    hui.cls.add(item,'hui_is_loading');
    var url = this._resolveImageUrl(object);
    var img = new Image();
    img.onload = function() {
      item.className = 'hui_gallery_item';
      hui.cls.remove(item,'hui_is_pending');
      hui.cls.remove(item,'hui_is_loading');
      item.style.backgroundImage = 'url(' + url + ')';
    };
    img.onerror = function() {
      hui.cls.remove(item,'hui_is_loading');
      hui.cls.add(item,'hui_is_error');
    };
    img.src = url;
    item.revealed = true;
  },
  _updateUI : function() {
    var s = this.selected;
    for (var i=0; i < this.nodes.length; i++) {
      hui.cls.set(this.nodes[i],'hui_gallery_item_selected',hui.array.contains(s,i));
    }
  },
  _resolveImageUrl : function(img) {
    var url = hui.ui.callDelegates(this,'buildImageUrl',{item: img, width: this.width, height: this.height});
    return url || hui.ui.resolveImageUrl(this,img,this.width,this.height);
  },
  _itemClicked : function(index,e) {
    if (this.busy) {
      return;
    }
    e = hui.event(e);
    if (e.metaKey) {
      hui.array.flip(this.selected,index);
    } else {
      this.selected = [index];
    }
    this.fire('select',this.selected);
    this._updateUI();
  },
  isOneSelection : function() {
    return this.selected.length==1;
  },
  getSelectionSize : function() {
    return this.selected.length;
  },
  getSelection : function() {
    var selection = [];
    for (var i=0; i < this.selected.length; i++) {
      var obj = this.objects[this.selected[i]];
      if (obj) {
        selection.push(obj);
      }
    }
    return selection;
  },
  getSelectionIds : function() {
    var selection = [];
    for (var i=0; i < this.selected.length; i++) {
      var obj = this.objects[this.selected[i]];
      if (obj) {
        selection.push(obj.id);
      }
    }
    return selection;
  },
  getFirstSelection : function() {
    if (this.selected.length>0) {
      return this.objects[this.selected[0]];
    }
    return null;
  },
  _onItemDoubleClick : function(index) {
    if (this.busy) {
      return;
    }
    this.fire('itemOpened',this.objects[index]);
    this.fire('open',this.objects[index]);
  },
  /**
   * Sets the lists data source and refreshes it if it is new
   * @param {hui.ui.Source} source The source
   */
  setSource : function(source) {
    if (this.options.source!=source) {
      if (this.options.source) {
        this.options.source.unListen(this);
      }
      source.listen(this);
      this.options.source = source;
      source.refresh();
    }
  },
  /** @private */
  $sourceIsBusy : function() {
    this._setBusy(true);
  },
  /** @private */
  $sourceIsNotBusy : function() {
    this._setBusy(false);
  },
  /** @private */
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      if (this.options.source) {
        this.options.source.refreshFirst();
      }
      this._reveal();
    }
  },
  /** @private */
  $$layout : function() {
    if (this.nodes.length > 0) {
      this._reveal();
    }
  },
  _setBusy : function(busy) {
    this.busy = busy;
    window.clearTimeout(this.busytimer);
    if (busy) {
      var e = this.element;
      this.busytimer = window.setTimeout(function() {
        hui.cls.add(e,'hui_gallery_busy');
      },300);
    } else {
      hui.cls.remove(this.element,'hui_gallery_busy');
    }
  }
};