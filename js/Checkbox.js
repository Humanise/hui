/**
 * A check box
 * @constructor
 */
hui.ui.Checkbox = function(o) {
  this.element = hui.get(o.element);
  this.control = hui.get.firstByTag(this.element,'span');
  this.options = o;
  this.name = o.name;
  this.value = o.value==='true' || o.value===true;
  hui.ui.extend(this);
  this._attach();
};

/**
 * Creates a new checkbox
 */
hui.ui.Checkbox.create = function(options) {
  var e = options.element = hui.build('a',{'class':'hui_checkbox',href:'#',html:'<span class="hui_checkbox_button"></span>'});
  if (options.value) {
    hui.cls.add(e, 'hui_checkbox_selected');
  }
  if (options.testName) {
    e.setAttribute('data-test', options.testName);
  }
  return new hui.ui.Checkbox(options);
};

hui.ui.Checkbox.prototype = {
  _attach : function() {
    hui.ui.addFocusClass({element:this.element,'class':'hui_checkbox_focused'});
    hui.listen(this.element,'click',this._click.bind(this));
  },
  _click : function(e) {
    hui.stop(e);
    this.element.focus();
    this.value = !this.value;
    this._updateUI();
    hui.ui.callAncestors(this,'childValueChanged',this.value);
    this.fire('valueChanged',this.value);
    hui.ui.firePropertyChange(this,'value',this.value);
  },
  _updateUI : function() {
    hui.cls.set(this.element,'hui_checkbox_selected',this.value);
  },
  /** Sets the value
   * @param {Boolean} value Whether the checkbox is checked
   */
  setValue : function(value) {
    this.value = value===true || value==='true';
    this._updateUI();
  },
  /** Gets the value
   * @return {Boolean} Whether the checkbox is checked
   */
  getValue : function() {
    return this.value;
  },
  /** Resets the checkbox */
  reset : function() {
    this.setValue(false);
  },
  /** Gets the label
   * @return {String} The checkbox label
   */
  getLabel : function() {
    return this.options.label;
  }
};