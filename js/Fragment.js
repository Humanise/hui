/**
 * Simple container
 * @param {Object} The options
 * @constructor
 */
hui.ui.Fragment = function(options) {
  this.options = options;
  this.element = hui.get(options.element);
  this.name = options.name;
  hui.ui.extend(this);
};

hui.ui.Fragment.prototype = {
  show : function() {
    this.setVisible(true);
  },
  hide : function() {
    this.setVisible(false);
  },
  setVisible : function(visible) {
    this.element.style.display = visible ? 'block' : 'none';
    hui.ui.callVisible(this);
  },
  setHTML : function(html) {
    this.clear();
    this.element.innerHTML = html;
    hui.dom.runScripts(this.element);
    this.fireSizeChange();
  },
  setContent : function(widgetOrNode) {
    this.clear();
    this.add(widgetOrNode);
  },
  clear : function() {
    hui.ui.destroyDescendants(this.element);
    this.element.innerHTML = '';
  },
  add : function(widgetOrNode) {
    this.element.appendChild(widgetOrNode.element ? widgetOrNode.element : widgetOrNode);
    this.fireSizeChange();
  }
};