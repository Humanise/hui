/**
 * @class
 * This is a form
 */
hui.ui.Form = function(options) {
  this.options = options;
  hui.ui.extend(this,options);
  this.addBehavior();
  // TODO Deprecated
  if (options.listener) {
    this.listen(options.listener);
  }
  if (options.listen) {
    this.listen(options.listen);
  }
};

/** @static Creates a new form */
hui.ui.Form.create = function(o) {
  o = o || {};
  var atts = {'class':'hui_form'};
  if (o.action) {
    atts.action=o.action;
  }
  if (o.method) {
    atts.method=o.method;
  }
  o.element = hui.build('form',atts);
  return new hui.ui.Form(o);
};

hui.ui.Form.prototype = {
  /** @private */
  addBehavior : function() {
    this.element.onsubmit=function() {return false;};
  },
  submit : function() {
    this.fire('submit');
  },
  /** Returns a map of all values of descendants */
  getValues : function() {
    var data = {};
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      var widget = d[i];
      if (widget.options && widget.options.key && widget.getValue) {
        data[widget.options.key] = widget.getValue();
      } else if (widget.getKey && widget.getKey() && widget.getValue) {
        data[widget.getKey()] = widget.getValue();
      } else if (widget.name && widget.getValue) {
        data[widget.name] = widget.getValue();
      }
    }
    return data;
  },
  /** Sets the values of the descendants */
  setValues : function(values) {
    if (!hui.isDefined(values)) {
      return;
    }
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      var key = (function(obj) {
        if (obj.getKey && obj.getKey()) {
          return obj.getKey();
        }
        if (obj.options) {
          return obj.options.key || obj.options.name;
        }
      })(d[i]);
      if (key && values[key]!==undefined) {
        d[i].setValue(values[key]);
      }
    }
  },
  /** Sets focus in the first found child */
  focus : function(key) {
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      if (d[i].focus && (!key || (d[i].options && d[i].options.key==key) || d[i].name==key)) {
        d[i].focus();
        return;
      }
    }
  },
  /** Resets all descendants */
  reset : function() {
    var d = hui.ui.getDescendants(this);
    for (var i=0; i < d.length; i++) {
      if (d[i].reset) {
        d[i].reset();
      }
    }
  },
  /** Adds a widget to the form */
  add : function(widget) {
    this.element.appendChild(widget.getElement());
  },
  /** Creates a new form group and adds it to the form
   * @returns {'hui.ui.Form.Group'} group
   */
  createGroup : function(options) {
    var g = hui.ui.Form.Group.create(options);
    this.add(g);
    return g;
  },
  /** Builds and adds a new group according to a recipe
   * @returns {'hui.ui.Form.Group'} group
   */
  buildGroup : function(options,recipe) {
    var g = this.createGroup(options);
    hui.each(recipe, function(item) {
      var w, field;
      if (hui.ui.Form[item.type]) {
        w = hui.ui.Form[item.type].create(item.options);
        field = g.add(w, item.label);
      }
      else if (hui.ui[item.type]) {
        w = hui.ui[item.type].create(item.options);
        field = g.add(w, item.label);
      }
      else {
        hui.log('buildGroup: Unable to find type: '+item.type);
      }
      if (item.extra) {
        hui.each(item.extra, function(other) {
          field.add(other);
        });
      }
    });
    return g;
  },
  createButtons : function(options) {
    var buttons = hui.ui.Buttons.create(options);
    this.add(buttons);
    return buttons;
  },
  /** @private */
  childValueChanged : function(value) {
    this.fire('valuesChanged',this.getValues());
  },
  show : function() {
    this.element.style.display='';
  },
  hide : function() {
    this.element.style.display='none';
  }
};

///////////////////////// Group //////////////////////////


/**
 * A form group
 * @constructor
 */
hui.ui.Form.Group = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  this.tableMode = this.element.nodeName.toLowerCase() == 'table'
  this.options = hui.override({above:true, large:false},options);
  hui.ui.extend(this);
};

/** Creates a new form group */
hui.ui.Form.Group.create = function(options) {
  options = hui.override({above:true},options);
  var element;
  if (options.above) {
    element = hui.build('div', {'class':'hui_form_fields hui_form_fields_above'});
  } else {
    element = hui.build('table.hui_form_fields');
    element.appendChild(hui.build('tbody'));
  }
  options.element = element;
  return new hui.ui.Form.Group(options);
};

hui.ui.Form.Group.prototype = {
  add : function(widget,label) {
    if (this.tableMode) {
      var tr = hui.build('tr',{'class':'hui_form_field'});
      hui.find('tbody', this.element).appendChild(tr);
      var td = hui.build('td');
      if (label) {
        label = hui.ui.getTranslated(label);
        var th = hui.build('th',{parent:tr});
        hui.build('label',{className:'hui_form_field_label',text:label,parent:th});
      }
      td.appendChild(widget.getElement());
      tr.appendChild(td);
      return new hui.ui.Form.Field({element: tr});
    } else {
      var field = hui.build('div.hui_form_field');
      if (this.options.large) {
        hui.cls.add(field, 'hui-large');
      }
      if (label) {
        label = hui.ui.getTranslated(label);
        hui.build('label',{className:'hui_form_field_label',text:label,parent:field});
      }
      field.appendChild(widget.getElement());
      this.element.appendChild(field);
      return new hui.ui.Form.Field({element: field});
    }
  }
};

// TODO: Should be hui.ui.Form.Fields
hui.ui.Form.Fields = hui.ui.Form.Group;

///////////////////////// Field //////////////////////////


/**
 * A form field
 * @constructor
 */
hui.ui.Form.Field = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Form.Field.prototype = {
  setVisible : function(visible) {
    this.element.style.display = visible ? '' : 'none';
  },
  add : function(w) {
    this.element.appendChild(w.element);
  }
};