///////////////////////// Text /////////////////////////

/**
 * A text field
 * <pre><strong>options:</strong> {
 *  element : «Element | ID»,
 *  name : «String»,
 *  key : «String»,
 *  label : «String»,
 *  maxHeight : «<strong>100</strong> | integer»,
 *  animateUserChange : «<strong>true</strong> | false»
 * }
 *
 * <strong>Events:</strong>
 * $valueChanged(value) - When the value of the field is changed by the user
 * @constructor
 */
hui.ui.TextInput = function(options) {
  this.options = hui.override({label:null,key:null,lines:1,maxHeight:100,animateUserChange:true},options);
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
  this.input = this.element;
  this.multiline = this.input.tagName.toLowerCase() == 'textarea';
  this.placeholder = hui.get.firstByClass(this.element,'hui_field_placeholder');
  this.value = this.input.value;
  this.modified = false;
  this._attach();
};

// TODO: Support Legacy
hui.ui.TextField = hui.ui.TextInput;


/**
 * Creates a new text field
 * <pre><strong>options:</strong> {
 *  value : «String»,
 *  label : «String»,
 *  multiline : «true | <strong>false</strong>»,
 *  lines : «<strong>1</strong> | integer»,
 *
 *  name : «String»,
 *  key : «String»,
 *  maxHeight : «<strong>100</strong> | integer»,
 *  animateUserChange : «<strong>true</strong> | false»
 * }
 * </pre>
 */
hui.ui.TextInput.create = function(options) {
  options = hui.override({lines:1},options);
  var node,input;
  if (options.lines>1 || options.multiline) {
    input = hui.build('textarea',
      {'class':'hui_textinput','rows':options.lines}
    );
  } else {
    input = hui.build('input',{'class':'hui_textinput'});
    if (options.secret) {
      input.setAttribute('type','password');
    }
  }
  if (options.value!==undefined) {
    input.value=options.value;
  }
  options.element = input;
  return new hui.ui.TextInput(options);
};

hui.ui.TextInput.prototype = {
  _attach : function() {
    if (this.placeholder || this.input.type=='password') {
      var self = this;
      hui.ui.onReady(function() {
        window.setTimeout(function() {
          self.value = self.input.value;
          console.log(self.value);
          self._updateClass();
        }, 500);
      });
    }
    hui.ui.addFocusClass({
      element: this.input,
      classElement: this.element,
      'class': 'hui_field_focused',
      widget: this
    });
    hui.listen(this.input, 'keyup', this._onKeyUp.bind(this));
    hui.listen(this.input, 'keydown', this._onKeyDown.bind(this));
    hui.listen(this.input, 'change', this._onChange.bind(this));
    var p = this.element.getElementsByTagName('em')[0];
    if (p) {
      this._updateClass();
      hui.listen(p, 'mousedown', function() {
        window.setTimeout(function() {
          this.input.focus();
          this.input.select();
        }.bind(this));
      }.bind(this));
      hui.listen(p, 'mouseup', function() {
        this.input.focus();
        this.input.select();
      }.bind(this));
    }
  },
  _updateClass : function() {
    hui.cls.set(this.element,'hui_field_dirty',this.value.length>0);
  },
  _onKeyDown : function(e) {
    if (!this.multiline && e.keyCode===hui.KEY_RETURN) {
      hui.stop(e);
      this.fire('submit');
      var form = hui.ui.getAncestor(this,'hui_formula');
      if (form) {form.submit();}
      return;
    }
  },
  _onChange : function(e) {
    this._onKeyUp(e);
  },
  _onKeyUp : function(e) {
    if (this.input.value==this.value) {return;}
    this.value=this.input.value;
    this._updateClass();
    this._expand(this.options.animateUserChange);
    hui.ui.callAncestors(this,'childValueChanged',this.input.value);
    this.fire('valueChanged',this.input.value);
    this.modified = true;
  },
  /** Focus the text field */
  focus : function() {
    try {
      this.input.focus();
    } catch (e) {}
  },
  /** Select the text in the text field */
  select : function() {
    try {
      this.input.focus();
      this.input.select();
    } catch (e) {}
  },
  /** Clear the value of the text field */
  reset : function() {
    this.setValue('');
  },
  isModified : function() {
      return this.modified;
  },
  /** Draw attention to the field */
  stress : function() {
    hui.ui.stress(this);
  },
  /** Set the value of the field
   * @value {String} The value
   */
  setValue : function(value) {
    if (value===undefined || value===null) {
      value='';
    }
    this.value = value;
    this.input.value = value;
    this._expand(this.options.animateValueChange);
    this.modified = false;
  },
  /** Get the value
   * @returns {String} The value
   */
  getValue : function() {
    return this.input.value;
  },
  getLabel : function() {
    return this.options.label;
  },
  /** Check if the value is empty ('' / the empty string)
   * @returns {Boolean} True if the value the empty string
   */
  isEmpty : function() {
    return this.input.value === '';
  },
  /** Check if the value has any non-white-space characters
   * @returns {Boolean} True if the value is blank
   */
  isBlank : function() {
    return hui.isBlank(this.input.value);
  },
  /** Mark the field with error
   * @value {String | Boolean} The error message or true to mark the field
   */
  setError : function(error) {
    var isError = error ? true : false;
    hui.cls.set(this.element,'hui_field_error',isError);
    if (typeof(error) == 'string') {
      hui.ui.showToolTip({text:error,element:this.element,key:this.name});
    }
    if (!isError) {
      hui.ui.hideToolTip({key:this.name});
    }
  },


  // Expanding...

  /** @private */
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      window.setTimeout(this._expand.bind(this));
    }
  },
  _expand : function(animate) {
    if (!this.multiline || !hui.dom.isVisible(this.element)) {
      return;
    }
    var textHeight = this._getTextAreaHeight(this.input);
    textHeight = Math.max(38,textHeight);
    textHeight = Math.min(textHeight,this.options.maxHeight);
    if (animate) {
      hui.animate({
        node : this.input,
        duration : 300,
        css : {height:textHeight+'px'},
        ease : hui.ease.slowFastSlow
      });
    } else {
      this.input.style.height = textHeight+'px';
    }
  },
  _getTextAreaHeight : function(input) {
    var t = this.textAreaDummy;
    if (!t) {
      t = this.textAreaDummy = document.createElement('div');
      t.className='hui_textarea_dummy';
      document.body.appendChild(t);
    }
    var html = input.value;
    if (html[html.length-1]==='\n') {
      html+='x';
    }
    html = hui.string.escape(html).replace(/\n/g,'<br/>');
    t.innerHTML = html;
    t.style.width=(input.clientWidth)+'px';
    return t.clientHeight;
  }
};