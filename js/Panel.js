(function (_super) {

  var ns = 'hui_panel';
  /**
   * @constructor
   */
  hui.ui.Panel = function(options) {
    _super.call(this, options);
    this.options = options;
    this.visible = false;
    this._attach();
    if (options.listener) {
      this.listen(options.listener);
    }
  };

  hui.ui.Panel.create = function(options) {
    options = hui.override({}, options);
    var html = (options.closable ? '<div class="hui_panel_close"></div>' : '')+
      '<div class="hui_panel_arrow"></div><div class="hui_panel_titlebar">';
      if (options.icon) {
        html+='<span class="hui_icon hui_icon_16 hui_panel_icon" style="background-image: url('+hui.ui.getIconUrl(options.icon,16)+'); background-image: -webkit-image-set(url('+hui.ui.getIconUrl(options.icon,16)+') 1x,url('+hui.ui.getIconUrl(options.icon,32+'x2')+') 2x);"></span>';
      }
    html+='<span class="hui_panel_title">' + hui.ui.getTranslated(options.title) + '</span></div>'+
      '<div class="hui_panel_body" style="'+
      (options.width ? 'width:'+options.width+'px;':'')+
      (options.height ? 'height:'+options.height+'px;':'')+
      (options.padding ? 'padding:'+options.padding+'px;':'')+
      '">'+
      '</div>'+
      '';
    var cls = 'hui_panel hui-is-floating'+(options.variant ? ' hui_panel_'+options.variant : '');
    if (options.title) { cls+= ' hui-is-titled'; }
    if (options.variant=='dark') {
      cls+=' hui_context_dark';
    }
    options.element = hui.build('div', {'class' : cls, html : html, parent: options.parent || document.body});
    return new hui.ui.Panel(options);
  };

  hui.ui.Panel.prototype = {
    _target : null,
    nodes : {
      close: '.hui_panel_close',
      titlebar: '.hui_panel_titlebar',
      title: '.hui_panel_title',
      body: '.hui_panel_body',
      arrow: '.hui_panel_arrow'
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
        this.element.style.zIndex = hui.ui.nextPanelIndex();
      }.bind(this));
    },
    _attachHider : function() {
      if (this.options.autoHide && !this._hideListener) {
        this._hideListener = hui.on(document.body, 'tap', function(e) {
          if (!hui.ui.isWithin(e, this.element) && (!this._target || !hui.ui.isWithin(e, this._target))) {
            this.hide();
          }
        }.bind(this));
      }
      if (!this._resizeListener) {
        var go = function() {
          this._adjustSize();
          this._positionAtTarget();
        }.bind(this)
        this._resizeListener = hui.listen(window, 'resize', function(e) {
          if (this.visible) {
            hui.onDraw(go);
          }
        }.bind(this));
      }
    },
    setTitle : function(title) {
      hui.dom.setText(this.nodes.title,hui.ui.getTranslated(title));
      hui.cls.set(this.element,'hui-is-titled', !hui.isBlank(title));
    },
    _positionInView : function() {
      var scrollTop = hui.window.getScrollTop();
      var winTop = hui.position.getTop(this.element);
      if (winTop < scrollTop || winTop+this.element.clientHeight > hui.window.getViewHeight()+scrollTop) {
        hui.animate({
          node: this.element,
          css: {top: (scrollTop+40)+'px'},
          duration: 500,
          ease: hui.ease.slowFastSlow
        });
      }
    },
    _ensureInView : function() {
      if (!this.visible || this._target) return;
      var viewWidth = hui.window.getViewWidth() - 3;
      var right = hui.position.getLeft(this.element) + this.element.offsetWidth;
      if (viewWidth - right < 0) {
        this.element.style.left = (viewWidth - this.element.offsetWidth) + 'px';
      }
    },
    _adjustSize : function() {
      var viewWidth = hui.window.getViewWidth();
      var isTooLarge = this.options.width + 40 > viewWidth;
      hui.cls.set(this.element, 'hui-is-full', isTooLarge);
      if (!isTooLarge) {
        this._ensureInView();
      }
    },
    _placeOnTop : function() {
      if (this.visible) {
        hui.style.set(this.element,{
          zIndex : hui.ui.nextPanelIndex()
        });
      } else {
        hui.style.set(this.element,{
          zIndex : hui.ui.nextPanelIndex(),
          visibility : 'hidden',
          display : 'block'
        });
      }
    },
    show : function(options) {
      var element = this.element;
      options = options || {};
      this._target = options.target;
      this._adjustSize();
      this._placeOnTop();
      if (this._target) {
        if (!this.visible) {
          this._positionAtTarget();
          hui.style.set(element,{
            opacity: '0',
            transform: 'scale(0.5)',
            visibility : 'visible'
          });
          setTimeout(function() {
            hui.cls.add(element, 'hui-is-animating');
          })
        } else {
          hui.cls.add(element, 'hui-is-animating');
          this._positionAtTarget();
        }
        hui.cls.add(element,'hui-is-targeted');
        if (!this.visible) {
          setTimeout(function() {
            hui.style.set(element, {
              opacity: 1,
              transform: 'scale(1) '
            });
          });
        }
        setTimeout(function() {
          hui.cls.remove(element,'hui-is-animating');
        }, 600);
      } else {
        if (this.visible) {
          this._positionInView();
          return;
        }
        hui.style.set(element,{
          visibility : 'visible'
        });
        if (options.avoid) {
          hui.position.place({
            insideViewPort : true,
            target : {element : options.avoid, vertical : 0.5, horizontal : 1},
            source : {element : element, vertical : 0.5, horizontal : 0}
          });
        } else {
          if (!element.style.top) {
            element.style.top = (hui.window.getScrollTop()+40)+'px';
          } else {
            this._positionInView();
          }
          if (!element.style.left) {
            element.style.left = Math.round((hui.window.getViewWidth()-element.clientWidth)/2)+'px';
          }
        }
        hui.animate(element,'opacity',1,0);
      }
      this.visible = true;
      hui.ui.callVisible(this);
      this._attachHider();
    },
    _positionAtTarget : function() {
      if (!this._target) { return; }
      var panel = {
        width: this.element.clientWidth,
        height: this.element.clientHeight
      };
      var target = this._target;
      var scrollOffset;
      if (target.nodeType===1) {
        scrollOffset = hui.position.getScrollOffset(this._target);
        target = hui.position.get(this._target);
        target.height = this._target.offsetHeight || this._target.clientHeight;
        target.width = this._target.offsetWidth || this._target.clientWidth;
      } else {
        scrollOffset = {top: 0, left: 0};
      }
      var view = {
        height: hui.window.getViewHeight(),
        width: hui.window.getViewWidth(),
        scrollTop: hui.window.getScrollTop(),
        scrollLeft: hui.window.getScrollLeft()
      }
      var dist = {
        above: (target.top - view.scrollTop) / panel.height,
        below: (view.height - (target.top - view.scrollTop + target.height))  / panel.height,
        left: (target.left - view.scrollLeft)  / panel.width,
        right: (view.width - (target.left - view.scrollLeft + target.width)) / panel.width
      }
      var pos = {
        top: 0, left: 0
      }
      var orientation = this._getOrientation(dist);
      if (orientation == 'below') {
        pos.top = target.top + target.height + 5;
        pos.left = target.left + target.width/2 - panel.width/2;
      } else if (orientation == 'above') {
        pos.top = target.top - panel.height - 5;
        pos.left = target.left + target.width/2 - panel.width/2;
      } else if (orientation == 'left') {
        pos.top = target.top + target.height/2 - panel.height/2;
        pos.left = target.left - panel.width - 5;
      } else if (orientation == 'right') {
        pos.top = target.top + target.height/2 - panel.height/2;
        pos.left = target.left + target.width + 5;
      }
      pos.top -= scrollOffset.top;
      pos.left -= scrollOffset.left;
      var gutter = 5;
      pos.top = hui.between(gutter, pos.top, view.scrollTop + view.height - panel.height - gutter);
      pos.left = hui.between(gutter, pos.left, view.scrollLeft + view.width - panel.width - gutter);
      this.nodes.arrow.className = 'hui_panel_arrow hui_panel_arrow-'+orientation;
      if (orientation == 'above' || orientation == 'below') {
        hui.style.set(this.nodes.arrow,{
          left: hui.between(3, (target.left - pos.left + target.width/2 - 10), panel.width - 3 - 20) + 'px',
          top: ''
        });
      } else {
        hui.style.set(this.nodes.arrow,{
          top: hui.between(3, (target.top - pos.top + target.height/2 - 10), panel.height - 3 - 20) + 'px',
          left: ''
        });
      }
      hui.style.set(this.element,{
        top: pos.top + 'px',
        left: pos.left + 'px'
      })
    },
    _getOrientation : function(distances) {
      var prop, value = 0;
      for (dim in distances) {
        if (distances.hasOwnProperty(dim)) {
          if (distances[dim] > value) {
            value = distances[dim];
            prop = dim;
          }
        }
      }
      return prop;
    },
    toggle : function(options) {
      if (this.visible) {
        this.hide();
      } else {
        this.show(options);
      }
    },
    isVisible : function() {
      return this.visible;
    },
    hide : function() {
      if (!this.visible) return;
      this._unFocus();
      hui.cls.add(this.element, 'hui-is-animating');
      this.element.style.opacity='0';
      setTimeout(function() {
        hui.cls.remove(this.element, 'hui-is-animating');
        this.element.style.display='none';
        hui.ui.callVisible(this);
      }.bind(this),500);
      this.visible = false;
    },
    _unFocus : function() {
      var active = document.activeElement;
      if (active && hui.dom.isDescendantOrSelf(active, this.element)) {
        active.blur();
      }
    },
    clear : function() {
      hui.ui.destroyDescendants(this.nodes.body);
      this.nodes.body.innerHTML = '';
    },
    add : function(widgetOrNode) {
      if (widgetOrNode.getElement) {
        this.nodes.body.appendChild(widgetOrNode.getElement());
      } else {
        this.nodes.body.appendChild(widgetOrNode);
      }
      this._positionAtTarget();
    },
    setBusy : function(stringOrBoolean) {
      if (stringOrBoolean===false) {
        clearTimeout(this._busyTimer);
        if (this._busyCurtain) {
          hui.cls.remove(this._busyCurtain, 'hui-is-visible');
        }
        return;
      }
      var curtain = this._busyCurtain;
      if (!curtain) {
        curtain = this._busyCurtain = hui.build('div.hui_panel_busy',{parentFirst:this.nodes.body});
        if (hui.browser.msie) {
          hui.cls.add(curtain,'hui_panel_busy-legacy');
        }
      }
      var text = hui.isString(stringOrBoolean) ? hui.string.escape(stringOrBoolean) : '';
      curtain.innerHTML = '<span class="hui_panel_busy_text">' + text + '</span>';
      this._busyTimer = setTimeout(function() {
        hui.cls.add(curtain, 'hui-is-visible');
      },16);
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
      this.dragState = {
        left: e.getLeft() - pos.left,
        top: e.getTop() - pos.top,
        maxLeft: hui.window.getViewWidth() - this.element.offsetWidth - 3
      };
      this.element.style.right = 'auto';
      hui.cls.add(this.element,'hui-is-dragging');
      hui.cls.remove(this.element,'hui-is-targeted');
    },
    _onMove : function(e) {
      var top = (e.getTop()-this.dragState.top);
      var left = (e.getLeft()-this.dragState.left);
      this.element.style.top = Math.max(top, 3) + 'px';
      this.element.style.left = hui.between(3, left, this.dragState.maxLeft) + 'px';
    },
    _onAfterMove : function() {
      hui.ui.callDescendants(this,'$$parentMoved');
      hui.cls.remove(this.element,'hui-is-dragging');
    }
  };


  hui.extend(hui.ui.Panel, _super);

  hui.define('hui.ui.Panel', hui.ui.Panel);

})(hui.ui.Component);