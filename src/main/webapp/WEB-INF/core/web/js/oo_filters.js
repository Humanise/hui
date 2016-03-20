(function (_super) {

  hui.on = function(node,event,func,bind) {
    if (event=='tab') {
      if (bind) {
        func = func.bind(bind);
      }
      var moved = false;
      var touched = false;
      hui.listen(node,'touchstart',function() {
        touched = true;
        moved = false;
      },bind);
      hui.listen(node,'touchmove',function() {
        moved = true;
      },bind);
      hui.listen(node,'touchcancel',function() {
        console.log('cancel')
      },bind);
      hui.listen(node,'touchend',function() {
        touched = false;
        if (!moved) {
          touched = true;
          func();
        }
      },bind);
      hui.listen(node,'click',function() {
        if (!moved && !touched) {
          func();
        }
      },bind);
    } else {
      hui.listen(node,event,func,bind);      
    }
  }

  oo.Filters = function(options) {
    _super.call(this, options);
    this.items = hui.findAll('.oo_filters_bar_item');
    this.filters = hui.findAll('.oo_filters_filter');
    this.body = hui.find('.oo_filters_body');
  	this._attach();
  }

  oo.Filters.prototype = {
    _open: null,
    _items : {},
  	_attach : function() {
      hui.on(this.element,'tab',this._click,this);
      hui.ui.listen({$$afterResize : this._resize.bind(this)})
  	},
    _click : function(e) {
      e = hui.event(e);
      var item = e.findByClass('oo_filters_bar_item');
      if (item) {
        e.stop();
        this._toggle(item);
      }
    },
    _toggle : function(item) {
      var body = this.body;
      var index = parseInt(item.getAttribute('data-index'),10);
      var toClose = this._open ? (this._open==item ? item : this._open) : null;
      if (toClose) {
        hui.cls.remove(toClose,'is-open');
        hui.cls.remove(this.filters[parseInt(toClose.getAttribute('data-index'),10)],'is-visible');
        body.style.height = '';
      }
      if (this._open !== item) {
        hui.cls.add(item,'is-open');
        hui.cls.add(this.filters[index],'is-visible');
        var height = this.filters[index].clientHeight;
        hui.onDraw(function() {body.style.height = height+'px'});
      }
      this._open = this._open === item ? null : item;
    },
    _resize : function() {
      if (this._open && this.element.clientHeight) {
        var index = parseInt(this._open.getAttribute('data-index'),10);
        var height = this.filters[index].clientHeight;
        var body = this.body;
        hui.onDraw(function() {body.style.height = height+'px'});
      }
    }
  }

  hui.extend(oo.Filters, _super);
  
  window.define && define('oo.Filters',oo.Filters);

})(hui.ui.Component);