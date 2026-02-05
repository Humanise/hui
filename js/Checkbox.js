hui.component('Checkbox', {
  use: [
    'value', 'enabled', 'key', 'size'
  ],
  state : {
    text: undefined
  },
  nodes: {
    label: '.hui_checkbox_label'
  },
  create : function(options) {
    return hui.build('a.hui_checkbox', { href: '#', html: '<span class="hui_checkbox_button"></span>' });
  },
  init : function(options) {
    hui.ui.addFocusClass({element: this.element, 'class': 'hui_checkbox_focused'});
  },
  isVoid : function() {
    var href = this.element.getAttribute('href');
    return (href === '#' || href === 'javascript://');
  },
  '!click' : function(e) {
    if (this.isVoid()) {
      e.prevent();
    } else {
      return;
    }
    if (!this.isEnabled()) { return }
    this.element.focus();
    this.setValue(!this.getValue());
    this.tellValueChange();
  },
  draw : function(changed) {
    ('value' in changed) && hui.cls.set(this.element, 'hui_checkbox_selected', this.getValue());
    ('enabled' in changed) && hui.cls.set(this.element, 'hui_checkbox-disabled', !this.isEnabled());
    ('text' in changed) && this._drawText();
    ('size' in changed) && hui.cls.set(this.element, 'hui-large', this.state.size == 'large');
  },
  _drawText : function() {
    if (this.state.text && !this.nodes.label) {
      this.nodes.label = hui.build('span.hui_checkbox_label', {parent: this.element, text: hui.ui.getTranslated(this.state.text)})
    } else if (!this.state.text && this.nodes.label) {
      hui.dom.remove(this.nodes.label);
      this.nodes.label = undefined;
    } else {
      hui.dom.setText(this.nodes.label, hui.ui.getTranslated(this.state.text));
    }
  },
  setText : function(txt) {
    this.change({text: txt});
  },
  /** Resets the checkbox */
  reset : function() {
    this.setValue(false);
  }

});