(function (_super) {

  /**
   * A component for attaching objects
   * @constructor
   */
  hui.ui.ObjectInput = function(options) {
    this.options = hui.override({},options);
    this.value = [];
    if (options.value) {
      this.value.push(options.value);
    }
    if (typeof(options.finder)=='string') {
      this.finder = hui.ui.get(options.finder);
      this.finder.listen({
        $select: this._found.bind(this)
      })
    }
    this.nodes = {
      text : 'hui_objectinput_text',
      list : 'hui_objectinput_list'
    };
    this.choose = null;
    this.remove = null;
    _super.call(this, options);
    this._attach();
  }
  
  hui.ui.ObjectInput.prototype = {
    _attach: function() {
      this.choose = new hui.ui.Button({
        element: hui.get.firstByClass(this.element, 'hui_objectinput_choose')
      });
      this.choose.listen({
        $click: this._choose.bind(this)
      });
      this.remove = new hui.ui.Button({
        element: hui.get.firstByClass(this.element, 'hui_objectinput_remove')
      });
      this.remove.listen({
        $click: this._remove.bind(this)
      });
      hui.listen(this.nodes.list,'click',this._clickList.bind(this));
    },
    _choose: function() {
      if (!this.finder) {
        this.finder = hui.ui.Finder.create(
          this.options.finder
        );
        this.finder.listen({
          $select: this._found.bind(this)
        })
      }
      this.finder.show();
    },
    _clickList : function(e) {
      e = hui.event(e);
      e.stop();
      var del = e.findByClass('hui_objectinput_delete');
      if (del) {
        var item = e.findByClass('hui_objectinput_object');
        alert(item.getAttribute('data-index'));
      }
    },
    _remove: function() {
      this.setValue(null);
    },
    _found: function(object) {
      this.finder.hide();
      this.value.push(object);
      this._render();
      this.fireValueChange();
    },
    _render: function() {
      this.nodes.list.innerHTML = '';
      for (var i = 0; i < this.value.length; i++) {
        var item = this.value[i];
        item = this.fire('render',item) || item;
        hui.log(item);
        var html = ''
        var obj = hui.build('div',{'class':'hui_objectinput_object',parent:this.nodes.list,'data-index':i});
        item.icon && obj.appendChild(hui.ui.createIcon(item.icon,16));
        obj.appendChild(document.createTextNode(item.text || item.title));
        var del = hui.ui.createIcon('common/delete',16,'a');
        hui.cls.add(del,'hui_objectinput_delete');
        del.href = '#';
        obj.appendChild(del);
      }
      this.remove.setEnabled(this.value ? true : false);
    },
    setValue: function(value) {
      this.value = value || [];
      this._render();
      this.fireValueChange();
    },
    getValue : function() {
      return this.value;
    }
  }

  hui.extend(hui.ui.ObjectInput, _super);

})(hui.ui.Component);