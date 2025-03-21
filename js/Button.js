hui = window.hui || {}; hui.ui = hui.ui || {};

/**
 * A push button
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  data : «Object»,
 *  confirm : {text : «String», okText : «String», cancelText : «String»},
 *  submit : «Boolean»
 * }
 *
 * <strong>Events:</strong>
 * $click(button) - When the button is clicked (and confirmed)
 * </pre>
 * @param options {Object} The options
 * @constructor
 */
hui.ui.Button = function(options) {
  this.options = options;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.enabled = !hui.cls.has(this.element,'hui_button_disabled');
  hui.ui.extend(this);
  this._attach();
  // TODO: Deprecated!
  if (options.listener) {
    this.listen(options.listener);
  }
  if (options.listen) {
    this.listen(options.listen);
  }
};

/**
 * Creates a new button
 * <pre><strong>options:</strong> {
 *  text : «String»,
 *  title : «String», // deprecated
 *  highlighted : «true | <strong>false</strong>»,
 *  enabled : «<strong>true</strong> | false»,
 *  icon : «String»,
 *
 *  name : «String»,
 *  data : «Object»,
 *  confirm : {text : «String», okText : «String», cancelText : «String»},
 *  submit : «Boolean»,
 *
 *  listener : «Object»
 * }
 * </pre>
 */
hui.ui.Button.create = function(options) {
  options = hui.override({text:'',highlighted:false,enabled:true},options);
  var className = 'hui_button';
  if (options.variant) {
    className+=' hui-'+options.variant;
  }
  if (options.small) {
    className+=' hui-small';
  }
  if (options.mini) {
    className+=' hui-mini';
  }
  if (options.tiny) {
    className+=' hui-tiny';
  }
  if (options.large) {
    className+=' hui-large';
  }
  if (options.highlighted) {
    className+=' hui-highlighted';
  }
  if (!options.enabled) {
    className+=' hui-disabled';
  }
  var text = options.text ? hui.ui.getTranslated(options.text) : null;
  if (options.title) { // Deprecated
    text = hui.ui.getTranslated(options.title);
  }
  var element = options.element = hui.build('a',{'class':className, href:'#'});
  if (options.testName) {
    element.setAttribute('data-test', options.testName);
  }
  if (options.icon) {
    var icon = hui.build('span',{parent:element,'class':'hui_button_icon',style:'background-image:url('+hui.ui.getIconUrl(options.icon,16)+')'});
    if (!text) {
      hui.cls.add(icon,'hui_button_icon_notext');
    }
  }
  if (text) {
    hui.dom.addText(element,text);
  }
  return new hui.ui.Button(options);
};

hui.ui.Button.prototype = {
  _attach : function() {
    var self = this;
    hui.listen(this.element,'mousedown',function(e) {
      hui.stop(e);
    });
    hui.listen(this.element,'click',function(e) {
      hui.stop(e);
      self._onClick(e);
    });
  },
  _onClick : function(e) {
    if (this.enabled) {
      var alt = false;
      if (e) {
        alt = hui.event(e).altKey;
      }
      if (this.options.confirm && !alt) {
        hui.ui.confirmOverlay({
          widget : this,
          text : this.options.confirm.text,
          okText : this.options.confirm.okText,
          cancelText : this.options.confirm.cancelText,
          onOk : this._fireClick.bind(this)
        });
      } else {
        this._fireClick();
      }
    } else {
      this.element.blur();
    }
  },
  _fireClick : function() {
    this.fire('click',this);
    if (this.options.submit) {
      var form = hui.ui.getAncestor(this, 'hui_form');
      if (form) {
        form.submit();
      } else {
        form = hui.closest('form', this.element)
        if (form) {
          form.submit();
        } else {
          hui.log('No form found to submit');
        }
      }
    }
  },
  /** Registers a function as a click listener or issues a click
   * @param func? {Function} The function to run when clicked, leave out to issue a click
   */
  click : function(func) {
    if (func) {
      this.listen({$click:func});
      return this;
    } else {
      this._onClick();
    }
  },
  /** Focus the button */
  focus : function() {
    this.element.focus();
  },
  /** Registers a function as a click handler
   * @param func {Function} The fundtion to invoke when clicked click
   */
  onClick : function(func) {
    this.listen({$click:func});
  },
  /** Enables or disables the button
   * @param enabled {Boolean} If the button should be enabled
   */
  setEnabled : function(enabled) {
    this.enabled = enabled;
    this._updateUI();
  },
  /** Enables the button */
  enable : function() {
    this.setEnabled(true);
  },
  /** Disables the button */
  disable : function() {
    this.setEnabled(false);
  },
  /** Sets whether the button is highlighted
   * @param highlighted {Boolean} If the button should be highlighted
   */
  setHighlighted : function(highlighted) {
    hui.cls.set(this.element,'hui-highlighted',highlighted);
  },
  _updateUI : function() {
    hui.cls.set(this.element,'hui-disabled',!this.enabled);
  },
  /** Sets the button text
   * @param
   */
  setText : function(text) {
    hui.dom.setText(this.element, hui.ui.getTranslated(text));
  },
  /**
   * Get the data object for the button
   * @returns {Object} The data object
   */
  getData : function() {
    return this.options.data;
  },
  /**
   * Get the role of the button
   * @returns {String} The role
   */
  getRole : function() {
    return this.options.role;
  }
};

////////////////////////////////// Buttons /////////////////////////////

/** @constructor */
hui.ui.Buttons = function(options) {
  this.name = options.name;
  this.element = hui.get(options.element);
  hui.ui.extend(this);
};

hui.ui.Buttons.create = function(options) {
  options = hui.override({top:0},options);
  var e = options.element = hui.build('div',{'class':'hui_buttons'});
  if (options.align==='right') {
    hui.cls.add(e,'hui_buttons-right');
  }
  if (options.align==='center') {
    hui.cls.add(e,'hui_buttons-center');
  }
  if (options.top > 0) {
    e.style.paddingTop=options.top+'px';
  }
  return new hui.ui.Buttons(options);
};

hui.ui.Buttons.prototype = {
  add : function(widget) {
    this.element.appendChild(widget.element);
    return this;
  }
};

hui.on(['hui.ui'],function() {
  hui.define('hui.ui.Button',hui.ui.Button);
});