(function (_super) {

  oo.Icon = function(options) {
    _super.call(this, options);
    this._attach();
  }
  
  oo.Icon.prototype = {
    _attach : function() {
      hui.listen(this.element,'click',this._click,this)
    },
    _click : function(e) {
      hui.stop(e);
      this.fire('click');
    },
    setSelected : function(sel) {
      hui.cls.set(this.element,'oo_icon-selected',sel);
    }
  }

  hui.extend(oo.Icon, _super);

})(hui.ui.Component);