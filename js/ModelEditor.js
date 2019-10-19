(function (_super) {

  /**
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.ModelEditor = function(options) {
    this.options = options;
    _super.call(this, options);
    this._build();
  };

  hui.ui.ModelEditor.prototype = {
    _build : function() {
      var form = this._form = hui.ui.Form.create();
      var group = form.createGroup();
      var model = this.options.model;
      hui.each(model.properties, function(prop) {
        var widget, label;
        if (prop.type == 'text') {
          widget = hui.ui.TextInput.create({key: prop.name});
          label = prop.name;
        }
        else if (prop.type == 'number') {
          widget = hui.ui.NumberInput.create({key: prop.name});
          label = prop.name;
        }
        if (widget) {
          group.add(widget, label);
        }
      });
      document.body.appendChild(form.getElement());
    },
    setValues : function(values) {
      this._form.setValues(values);
    }
  };

  hui.extend(hui.ui.ModelEditor, _super);

})(hui.ui.Component);