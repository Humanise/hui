/**
 * A component
 * @constructor
 * @param {Object} options
 * @param {Element} options.element
 * @param {String} options.name
 * @param {Object} options.listen A listener
 */
hui.ui.Component = function(options) {
  options = options || {};
  this.name = options.name;
  this.state = hui.override({}, this.state);
  if (!this.name) {
    hui.ui.latestObjectIndex++;
    this.name = 'unnamed'+hui.ui.latestObjectIndex;
  }
  this.element = hui.get(options.element);
  this.delegates = [];
  if (this.nodes) {
    this.nodes = hui.collect(this.nodes,this.element);
  } else {
    this.nodes = [];
  }
  this.owned = {};
  this.nodes.root = this.element
  if (options.listen) {
    this.listen(options.listen);
  }
  hui.ui.registerComponent(this);
};

hui.ui.Component.prototype = {
  /**
   * Add event listener
   * @param {Object} listener An object with methods for different events
   */
  listen : function(listener) {
    this.delegates.push(listener);
  },
  on : function(listener) {
    this.delegates.push(listener);
  },
  /**
   * Fire an event with this component as the sender
   */
  fire : function(name,value,event) {
    return hui.ui.callDelegates(this,name,value,event);
  },
  /**
   * Get the components root element
   * @returns Element
   */
  getElement : function() {
    return this.element;
  },
  addTo(other) {
    other.appendChild(this.getElement());
  },
  /**
   * Removes the component from the DOM
   * @see hui.ui.destroy
   */
  destroy : function() {
    hui.ui.destroy(this)
  },
  detach : function() {
    // TODO: Can we auto-remove all listeners
    // Override this
  },
  valueForProperty : function(property) {
    return this[property];
  },
  /**
   * Notify others of a value change
   */
  fireValueChange : function() {
    this.fire('valueChanged',this.value);
    hui.ui.firePropertyChange(this,'value',this.value);
    hui.ui.callAncestors(this,'childValueChanged',this.value);
  },
  /**
   * Notify others of a layout change
   */
  fireSizeChange : function() {
    hui.ui.callAncestors(this,'$$childSizeChanged');
  },
  change : function(newState) {
    var changed = {};
    var num = 0;
    for (key in newState) {
      if (newState.hasOwnProperty(key) && this.state.hasOwnProperty(key) ) {
        if (this.state[key] !== newState[key]) {
          this.state[key] = newState[key];
          changed[key] = newState[key];
          num++;
        }
      }
    }
    if (num > 0 && this.draw) {
      this.draw(changed);
    }
  },
  getOwned(recipe) {
    if (this.owned[recipe.name]) {
      return this.owned[recipe.name]
    }
    this.owned[recipe.name] = recipe.supplier();
    return this.owned[recipe.name];
  }
};

hui.component = function(name, spec) {
  hui.ui[name] = function(options) {
    options = options || {};
    hui.ui.Component.call(this, options);
    this.init && this.init(options);
    this.change(options);
    this.attach && this.attach();

    for (key in this) {
      if (key[0] == '!' && typeof(this[key]) == 'function') {
        (function(self, key) {
          hui.listen(self.element, key.substr(1), function(e) {
            e = hui.event(e);
            self[key](e);
          });
        })(this, key)
      }
    }
  }
  var component = hui.ui[name]
  component.create = function(state) {
    state = state || {};
    var cp = {element: spec.create(state)};
    hui.extend(cp, state);
    if (state.testName) {
      cp.element.setAttribute('data-test', state.testName);
    }
    var obj = new component(cp);
    obj.change(state);
    return obj;
  };
  component.prototype = spec;
  hui.extend(component.prototype, hui.ui.Component.prototype);
  if (spec['with']) {
    for (var i = 0; i < spec['with'].length; i++) {
      var mixin = hui.component[spec['with'][i]];
      for (prop in mixin) {
        if (typeof(mixin[prop]) == 'function') {
          component.prototype[prop] = mixin[prop]
        }
      }
      if (mixin.state) {
        for (prop in mixin.state) {
          if (component.prototype.state[prop] === undefined) {
            component.prototype.state[prop] = mixin.state[prop]
          }
        }
      }
    }
  }
};

hui.component.value = {
  state: {value: undefined},
  setValue : function(v) {
    this.change({value: v});
  },
  getValue : function() {
    return this.state.value;
  },
  /* TODO: Already a fireValueChange */
  tellValueChange : function(){
    var v = this.state.value;
    hui.ui.callAncestors(this, 'childValueChanged', v);
    this.fire('valueChanged', v);
    hui.ui.firePropertyChange(this, 'value', v);
  }
};

hui.component.enabled = {
  state: {enabled: true},
  setEnabled : function(v) {
    this.change({enabled: !!v});
  },
  isEnabled : function() {
    return !!this.state.enabled;
  }
};

hui.component.key = {
  state: {key: undefined},
  getKey: function() {
    return this.state.key;
  }
};

hui.component.size = {
  state: {size: 'regular'},
  getSize: function() {
    return this.state.size;
  },
  setSize : function(v) {
    this.change({size: v});
  }
};