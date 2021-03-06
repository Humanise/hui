/**
 * An input component for geo-location
 * @constructor
 */
hui.ui.LocationInput = function(options) {
  this.options = hui.override({value:null},options);
  this.name = options.name;
  this.element = hui.get(options.element);
  this.chooser = hui.get.firstByTag(this.element,'a');
  this.latField = new hui.ui.Input({element:hui.get.firstByTag(this.element,'input'),validator:new hui.ui.NumberValidator({min:-90,max:90,allowNull:true})});
  this.latField.listen(this);
  this.lngField = new hui.ui.Input({element:this.element.getElementsByTagName('input')[1],validator:new hui.ui.NumberValidator({min:-180,max:180,allowNull:true})});
  this.lngField.listen(this);
  this.value = this.options.value;
  hui.ui.extend(this);
  this.setValue(this.value);
  this._addBehavior();
};

hui.ui.LocationInput.create = function(options) {
  options = options || {};
  options.element = hui.build('span',{'class':'hui_locationinput', html:'<span class="hui_locationinput_latitude"><span><input autocomplete="off"></span></span><span class="hui_locationinput_longitude"><span><input autocomplete="off"></span></span><a class="hui_locationinput_picker" href="javascript://"></a>'});
  return new hui.ui.LocationInput(options);
};

hui.ui.LocationInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.chooser,'click',this._showPicker.bind(this));
    hui.ui.addFocusClass({element:this.latField.element,classElement:this.element,'class':'hui_locationinput-focused'});
    hui.ui.addFocusClass({element:this.lngField.element,classElement:this.element,'class':'hui_locationinput-focused'});
  },
  reset : function() {
    this.setValue();
  },
  getValue : function() {
    return this.value;
  },
  /** Set the value
   *
   */
  setValue : function(loc) {
    if (loc) {
      this.latField.setValue(loc.latitude);
      this.lngField.setValue(loc.longitude);
      this.value = loc;
    } else {
      this.latField.setValue();
      this.lngField.setValue();
      this.value = null;
    }
    this._updatePicker();
  },
  _updatePicker : function() {
    if (this.picker) {
      this.picker.setLocation(this.value);
    }
  },
  _showPicker : function() {
    if (!this.picker) {
      this.picker = new hui.ui.LocationPicker();
      this.picker.listen(this);
    }
    this.picker.show({node:this.chooser,location:this.value});
  },
  /** @private */
  $locationChanged : function(loc) {
    this.setValue(loc);
    this.fire('valueChanged',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  },
  /** @private */
  $valueChanged : function() {
    var lat = this.latField.getValue();
    var lng = this.lngField.getValue();
    if (lat===null || lng===null) {
      this.value = null;
    } else {
      this.value = {latitude:lat,longitude:lng};
    }
    this._updatePicker();
    this.fire('valueChanged',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  }
};