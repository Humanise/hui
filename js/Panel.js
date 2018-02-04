(function (_super) {

  var ns = 'hui_panel';
  /**
   * @constructor
   */
  hui.ui.Panel = function(options) {
    this.element = hui.get(options.element);
    this.name = options.name;
    this.visible = false;
    hui.ui.extend(this);
    this._attach();
    if (options.listener) {
      this.listen(options.listener);
    }
  };

  hui.ui.Panel.create = function(options) {
    options = hui.override({close : true}, options);
    var html = (options.close ? '<div class="hui_panel_close"></div>' : '')+
      '<div class="hui_panel_titlebar">';
      if (options.icon) {
        html+='<span class="hui_icon hui_icon_16 hui_panel_icon" style="background-image: url('+hui.ui.getIconUrl(options.icon,16)+')"></span>';
      }
    html+='<span class="hui_panel_title">' + hui.ui.getTranslated(options.title) + '</span></div>'+
      '<div class="hui_panel_body" style="'+
      (options.width ? 'width:'+options.width+'px;':'')+
      (options.height ? 'height:'+options.height+'px;':'')+
      (options.padding ? 'padding:'+options.padding+'px;':'')+
      (options.padding ? 'padding-bottom:'+Math.max(0,options.padding-2)+'px;':'')+
      '">'+
      '</div>'+
      '';
    var cls = 'hui_panel hui-is-floating'+(options.variant ? ' hui_panel_'+options.variant : '');
    if (options.variant=='dark') {
      cls+=' hui_context_dark';
    }
    options.element = hui.build('div', {'class' : cls, html : html, parent: options.parent || document.body});
    return new hui.ui.Panel(options);
  };

  hui.ui.Panel.prototype = {
    nodes : {
      close: '.hui_panel_close',
      titlebar: '.hui_panel_titlebar',
      title: '.hui_panel_title',
      body: '.hui_panel_body'
    },
    _attach : function() {
      if (this.nodes.close) {
        hui.listen(this.nodes.close,'click',function(e) {
          this.hide();
          this.fire('close');
        }.bind(this));
        hui.listen(this.nodes.close,'mousedown',function(e) {hui.stop(e);});
      }
      hui.drag.register({
        touch: true,
        window: this.element.ownerDocument.defaultView,
        element : this.nodes.titlebar,
        $before : this._onDragStart.bind(this) ,
        $startMove : this._onBeforeMove.bind(this) ,
        $move : this._onMove.bind(this),
        $endMove : this._onAfterMove.bind(this)
      });
      hui.listen(this.element,'mousedown',function() {
        self.element.style.zIndex = hui.ui.nextPanelIndex();
      }.bind(this));
    },
    setTitle : function(title) {
      hui.dom.setText(this.nodes.title,hui.ui.getTranslated(title));
    },
    _positionInView : function() {
      var scrollTop = hui.window.getScrollTop();
      var winTop = hui.position.getTop(this.element);
      if (winTop < scrollTop || winTop+this.element.clientHeight > hui.window.getViewHeight()+scrollTop) {
        hui.animate({node:this.element,css:{top:(scrollTop+40)+'px'},duration:500,ease:hui.ease.slowFastSlow});
      }
    },
    show : function(options) {
      if (this.visible) {
        this._positionInView();
        this.element.style.zIndex=hui.ui.nextPanelIndex();
        return;
      }
      options = options || {};
      hui.style.set(this.element,{
        zIndex : hui.ui.nextPanelIndex(), visibility : 'hidden', display : 'block'
      });
      var width = this.element.clientWidth;
      hui.style.set(this.element,{
        width : width+'px' , visibility : 'visible'
      });
      if (options.avoid) {
        hui.position.place({insideViewPort : true, target : {element : options.avoid, vertical : 0.5, horizontal : 1}, source : {element : this.element, vertical : 0.5, horizontal : 0} });
      } else {
        if (!this.element.style.top) {
          this.element.style.top = (hui.window.getScrollTop()+40)+'px';
        } else {
          this._positionInView();
        }
        if (!this.element.style.left) {
          this.element.style.left = Math.round((hui.window.getViewWidth()-width)/2)+'px';
        }
      }
      if (hui.browser.opacity) {
        hui.animate(this.element,'opacity',1,0);
      }
      this.visible = true;
      hui.ui.callVisible(this);
    },
    toggle : function(options) {
      if (this.visible) {
        this.hide();
      } else {
        this.show(options);
      }
    },
    hide : function() {
      if (!this.visible) return;
      if (hui.browser.opacity) {
        hui.animate(this.element,'opacity',0,100,{$complete:function() {
          this.element.style.display='none';
          hui.ui.callVisible(this);
        }.bind(this)});
      } else {
        this.element.style.display='none';
        hui.ui.callVisible(this);
      }
      this.visible = false;
    },
    add : function(widgetOrNode) {
      if (widgetOrNode.getElement) {
        this.nodes.body.appendChild(widgetOrNode.getElement());
      } else {
        this.nodes.body.appendChild(widgetOrNode);
      }
    },
    setBusy : function(stringOrBoolean) {
      window.clearTimeout(this._busyTimer);
      if (stringOrBoolean===false) {
        if (this._busyCurtain) {
          this._busyCurtain.style.display = 'none';
        }
        return;
      }
      this._busyTimer = window.setTimeout(function() {
        var curtain = this._busyCurtain;
        if (!curtain) {
          curtain = this._busyCurtain = hui.build('div',{'class':'hui_panel_busy',parentFirst:hui.get.firstByClass(this.element,'hui_panel_content')});
        }
        curtain.innerHTML = hui.isString(stringOrBoolean) ? '<span>'+stringOrBoolean+'</span>' : '<span></span>';
        curtain.style.display = '';
      }.bind(this),300);
    },

    move : function(point) {
      hui.style.set(this.element,{top:point.top+'px',left:point.left+'px'});
    },

    _onDragStart : function(e) {
      this.element.style.zIndex = hui.ui.nextPanelIndex();
    },
    _onBeforeMove : function(e) {
      e = hui.event(e);
      var pos = hui.position.get(this.element);
      this.dragState = {left: e.getLeft() - pos.left,top:e.getTop()-pos.top};
      this.element.style.right = 'auto';
      hui.cls.add(this.element,'hui-is-dragging');
    },
    _onMove : function(e) {
      var top = (e.getTop()-this.dragState.top);
      var left = (e.getLeft()-this.dragState.left);
      this.element.style.top = Math.max(top,0)+'px';
      this.element.style.left = Math.max(left,0)+'px';
    },
    _onAfterMove : function() {
      hui.ui.callDescendants(this,'$$parentMoved');
      hui.cls.remove(this.element,'hui-is-dragging');
    },
    destroy : function() {
      hui.dom.remove(this.element);
    }
  };


  hui.extend(hui.ui.Panel, _super);

  hui.define('hui.ui.Panel', hui.ui.Panel);

})(hui.ui.Component);