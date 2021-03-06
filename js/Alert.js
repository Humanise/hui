/**
 * An alert
 * @constructor
 * @param {Object} options The options
 * @param {Element} options.element The DOM node
 * @param {String} options.name The component name
 * @param {Boolean} options.modal If the alert i modal (false)
 */
hui.ui.Alert = function(options) {
  this.options = hui.override({
    modal: false
  }, options);
  this.element = hui.get(options.element);
  this.name = options.name;
  this.body = hui.get.firstByClass(this.element, 'hui_alert_body');
  this.content = hui.get.firstByClass(this.element, 'hui_alert_content');
  this.emotion = this.options.emotion;
  this.title = hui.get.firstByTag(this.element, 'h1');
  hui.ui.extend(this);
};

/**
 * Creates a new instance of an alert
 * @static
 * @param {Object} options The options
 * @param {String} options.name The component name
 * @param {Boolean} options.modal If the alert i modal (false)
 * @param {String} options.emotion The component name
 * @param {String} options.title The component name
 * @param {String} options.text The component name
 */
hui.ui.Alert.create = function(options) {
  options = hui.override({
    text: '',
    emotion: null,
    title: null
  }, options);

  var element = options.element = hui.build('div', {
    'class': 'hui_alert'
  });
  var body = hui.build('div', {
    'class': 'hui_alert_body',
    parent: element
  });
  hui.build('div', {
    'class': 'hui_alert_content',
    parent: body
  });
  document.body.appendChild(element);
  var obj = new hui.ui.Alert(options);
  if (options.emotion) {
    obj.setEmotion(options.emotion);
  }
  if (options.title) {
    obj.setTitle(options.title);
  }
  if (options.text) {
    obj.setText(options.text);
  }

  return obj;
};

hui.ui.Alert.prototype = {
  /**
   * Shows the alert
   */
  show: function() {
    var zIndex = hui.ui.nextAlertIndex();
    if (this.options.modal) {
      hui.ui.showCurtain({
        widget: this,
        zIndex: zIndex
      });
      zIndex++;
    }
    this.element.style.zIndex = zIndex;
    this.element.style.transform = 'scale(0.5)';
    this.element.style.display = 'block';
    this.element.style.top = (hui.window.getScrollTop() + 100) + 'px';
    hui.animate(this.element, 'opacity', 1, 200);
    hui.animate(this.element, 'transform', 'scale(1)', 600, {
      ease: hui.ease.elastic
    });
  },
  /**
   * Hides the alert
   */
  hide: function() {
    hui.animate(this.element, 'opacity', 0, 100, {
      hideOnComplete: true
    });
    hui.animate(this.element, 'margin-top', '0px', 100);
    hui.ui.hideCurtain(this);
  },
  /**
   * Sets the alert title
   * @param {String} text The new title
   */
  setTitle: function(text) {
    if (!this.title) {
      this.title = hui.build('h1', {
        parent: this.content
      });
    }
    hui.dom.setText(this.title, hui.ui.getTranslated(text));

  },
  /**
   * Sets the alert text
   * @param {String} text The new text
   */
  setText: function(text) {
    if (!this.text) {
      this.text = hui.build('p', {
        parent: this.content
      });
    }
    hui.dom.setText(this.text, hui.ui.getTranslated(text));
  },
  /**
   * Sets the alert emotion
   * @param {String} emotion Can be 'smile' or 'gasp'
   */
  setEmotion: function(emotion) {
    if (this.emotion) {
      hui.cls.remove(this.body, this.emotion);
    }
    this.emotion = emotion;
    hui.cls.add(this.body, emotion);
  },
  /**
   * Updates multiple properties
   * @param {Object} options
   * @param {String} options.title
   * @param {String} options.text
   * @param {String} options.emotion
   */
  update: function(options) {
    options = options || {};
    this.setTitle(options.title || null);
    this.setText(options.text || null);
    this.setEmotion(options.emotion || null);
  },
  /**
   * Adds a Button to the alert
   * @param {hui.ui.Button} button The button to add
   */
  addButton: function(button) {
    if (!this.buttons) {
      this.buttons = hui.ui.Buttons.create({
        align: 'right'
      });
      this.body.appendChild(this.buttons.element);
    }
    this.buttons.add(button);
  }
};

hui.ui.Alert.confirm = function(options) {
  if (!options.name) {
    options.name = 'huiConfirm';
  }
  var alert = hui.ui.get(options.name);
  var ok;
  if (!alert) {
    alert = hui.ui.Alert.create(options);
    var cancel = hui.ui.Button.create({name:name+'_cancel',text : options.cancel || 'Cancel',highlighted:options.highlighted==='cancel'});
    cancel.listen({$click:function(){
      alert.hide();
      if (options.onCancel) {
        options.onCancel();
      }
      hui.ui.callDelegates(alert,'cancel');
    }});
    alert.addButton(cancel);

    ok = hui.ui.Button.create({name:name+'_ok',text : options.ok || 'OK',highlighted:options.highlighted==='ok'});
    alert.addButton(ok);
  } else {
    alert.update(options);
    ok = hui.ui.get(name+'_ok');
    ok.setText(options.ok || 'OK');
    ok.setHighlighted(options.highlighted=='ok');
    ok.clearListeners();
    hui.ui.get(name+'_cancel').setText(options.ok || 'Cancel');
    hui.ui.get(name+'_cancel').setHighlighted(options.highlighted=='cancel');
    if (options.cancel) {hui.ui.get(name+'_cancel').setText(options.cancel);}
  }
  ok.listen({$click:function(){
    alert.hide();
    if (options.onOK) {
      options.onOK();
    }
    hui.ui.callDelegates(alert,'ok');
  }});
  alert.show();
};

hui.ui.Alert.alert = function(options) {
  if (!this.alertBox) {
    this.alertBox = hui.ui.Alert.create(options);
    this.alertBoxButton = hui.ui.Button.create({name:'huiAlertBoxButton',text : 'OK'});
    this.alertBoxButton.listen({
      $click$huiAlertBoxButton : function() {
        hui.ui.Alert.alertBox.hide();
        if (options.onOK) {
          options.onOK();
        }
      }
    });
    this.alertBox.addButton(this.alertBoxButton);
  } else {
    this.alertBox.update(options);
  }
  this.alertBoxButton.setText(options.button ? options.button : 'OK');
  this.alertBox.show();
};