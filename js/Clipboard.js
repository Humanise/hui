(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Clipboard = function(options) {
    options = options || {};
    _super.call(this, options);
    this.value = null;
    this._attach();
  };

  hui.ui.Clipboard.prototype = {
    _attach : function() {
      hui.on(document, 'paste', this._onPaste.bind(this));
    },
    _onPaste : function(e) {
      this.fire('paste',e);
      console.log('Paste event', e);
      console.log('Clipboard data', e.clipboardData)
      var items = e.clipboardData.items;
      console.log('Clipboard data items', items)
      if (items) {
        console.log('items:', items)
        for (var i = 0; i < items.length; i++) {
          console.log(items[i]);
          if (items[i].type == 'file') {
            this._readFile(items[i].getAsFile());
          }
          if (items[i].type == 'text/plain') {
            items[i].getAsString(function(x) {
              this.fire('text', {text:x});
            }.bind(this));
          }
        }
      }
      var files = e.clipboardData.files;
      console.log('files:', files)
      if (files) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          this._readFile(file);
        }
      }

      var types = e.clipboardData.types;
      console.log('Clipboard data types:', types)
      if (types) {
        for (var i = 0; i < types.length; i++) {
          var data = e.clipboardData.getData(types[i], console.log);
          console.log(data)
        }
      }
      console.log(arguments)
    },
    _readFile : function(file) {
      console.log(file.type)
      var self = this;
      if (/image\//.test(file.type)) {
        var reader = new FileReader();
        reader.onload = function (event) {
          self.fire('image', {base64:reader.result});
        }
        reader.readAsDataURL(file);
      } else if (/text\//.test(file.type)) {
        var reader = new FileReader();
        reader.onload = function (event) {
          self.fire('text', {text:reader.result});
        }
        reader.readAsText(file);
      } else {
        self.fire('file', {file:file});
      }
    }

  };

  hui.extend(hui.ui.Clipboard, _super);
  hui.define('hui.ui.Clipboard', hui.ui.Clipboard);

})(hui.ui.Component);