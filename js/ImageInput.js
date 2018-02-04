/**
  Used to choose an image
  @constructor
*/
hui.ui.ImageInput = function(options) {
  this.name = options.name;
  this.options = hui.override({width:48,height:48},options);
  this.element = hui.get(options.element);
  this.value = null;
  hui.ui.extend(this);
  this._attach();
};

hui.ui.ImageInput.prototype = {
  _attach : function() {
    hui.listen(this.element,'click',this._showPicker.bind(this));
    hui.listen(hui.get.firstByTag(this.element,'a'),'click',this._clear.bind(this));
  },
    /** @Deprecated */
  setObject : function(obj) {
    this.value = obj;
    this._updateUI();
  },
    /** @Deprecated */
  getObject : function() {
    return this.value;
  },
  getValue : function() {
    return this.value;
  },
  setValue : function(obj) {
    this.setObject(obj);
  },
  _clear : function(e) {
    hui.stop(e);
    this.reset();
    this._fireChange();
  },
  reset : function() {
    this.value = null;
    this._updateUI();
  },
  _updateUI : function() {
    hui.cls.set(this.element,'hui_imageinput_full',this.value !== null);
    if (this.value === null) {
      this.element.style.backgroundImage = '';
    } else {
      var url = hui.ui.resolveImageUrl(this,this.value,this.options.width,this.options.height);
      this.element.style.backgroundImage = 'url('+url+')';
    }
  },
  _showFinder : function() {
    if (!this.finder) {
      this.finder = hui.ui.Finder.create(
        this.options.finder
      );
      this.finder.listen({
        $select : function(object) {
          this.setObject(object);
          this._fireChange();
          this.finder.hide();
        }.bind(this)
      });
    }
    this.finder.show();
  },
  _showPicker : function() {
    if (this.options.finder) {
      this._showFinder();
    }
  },
  /** @private */
  $visibilityChanged : function() {
    if (this.finder && !hui.dom.isVisible(this.element)) {
      this.finder.hide();
    }
  },
  _fireChange : function() {
    this.fireValueChange();
  }
};