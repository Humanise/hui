/**
 * A code editor
 * @constructor
 */
hui.ui.CodeInput = function(options) {
  this.options = hui.override({},options);
  this.name = options.name;
  var e = this.element = hui.get(options.element);
  this.textarea = hui.get.firstByTag(e,'textarea');
  if (options.value) {
    this.textarea.value = options.value;
  }
  this.value = this.textarea.value;
  hui.ui.extend(this);
  this._addBehavior();
};

hui.ui.CodeInput.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{
    'class' : 'hui_codeinput',
    html : '<textarea class="hui_codeinput_input" spellcheck="false"></textarea>'
  });
  if (options.height) {
    options.element.style.height = hui.style.length(options.height);
  }
  return new hui.ui.CodeInput(options);
};

hui.ui.CodeInput.prototype = {
  _addBehavior : function() {
    hui.listen(this.textarea, 'keydown', this._onKeyDown.bind(this));
    hui.listen(this.textarea, 'keyup', this._onKeyUp.bind(this));
  },

  getValue : function() {
    return this.textarea.value;
  },
  setValue : function(value) {
    this.textarea.value = value;
    this.value = value;
  },
  addLine : function(line) {
    if (this.value==='') {
      this.setValue(line);
    } else {
      this.setValue(this.value+"\n"+line);
    }
  },
  reset : function() {
    this.setValue('');
  },
  _onKeyUp : function() {
    if (this.textarea.value !== this.value) {
      this.value = this.textarea.value;
      this.fireValueChange();
    }
  },

  _onKeyDown: function(evt) {
    var tab = String.fromCharCode(9);
    var e = window.event || evt;
    var t = e.target ? e.target : e.srcElement ? e.srcElement : e.which;
    var scrollTop = t.scrollTop;
    var k = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    var ch, a, i, rt, nr;
    if (k == 9 && !e.ctrlKey && !e.altKey) {
      if (t.setSelectionRange) {
        e.preventDefault();
        var ss = t.selectionStart;
        var se = t.selectionEnd;
        // Multi line selection
        if (ss != se && t.value.slice(ss, se).indexOf("\n") != -1) {
          if (ss > 0) {
            ss = t.value.slice(0, ss).lastIndexOf("\n") + 1;
          }
          var pre = t.value.slice(0, ss);
          var sel = t.value.slice(ss, se);
          var post = t.value.slice(se, t.value.length);
          if (e.shiftKey) {
            a = sel.split("\n");
            for (i = 0; i < a.length; i++) {
              if (a[i].slice(0, 1) == tab || a[i].slice(0, 1) == ' ') {
                a[i] = a[i].slice(1, a[i].length);
              }
            }
            sel = a.join("\n");
            t.value = pre.concat(sel, post);
            t.selectionStart = ss;
            t.selectionEnd = pre.length + sel.length;
          } else {
            sel = sel.replace(/\n/g, "\n" + tab);
            pre = pre.concat(tab);
            t.value = pre.concat(sel, post);
            t.selectionStart = ss;
            t.selectionEnd = se + (tab.length * sel.split("\n").length);
          }
        }
        // Single line selection
        else {
          if (e.shiftKey) {
            var brt = t.value.slice(0, ss);
            ch = brt.slice(brt.length - 1, brt.length);
            if (ch == tab || ch == ' ') {
              t.value = brt.slice(0, brt.length - 1).concat(t.value.slice(ss, t.value.length));
              t.selectionStart = ss - 1;
              t.selectionEnd = se - 1;
            }
          } else {
            t.value = t.value.slice(0, ss).concat(tab).concat(t.value.slice(ss, t.value.length));
            if (ss == se) {
              t.selectionStart = t.selectionEnd = ss + tab.length;
            } else {
              t.selectionStart = ss + tab.length;
              t.selectionEnd = se + tab.length;
            }
          }
        }
      } else {
        e.returnValue = false;
        var r = document.selection.createRange();
        var br = document.body.createTextRange();
        br.moveToElementText(t);
        br.setEndPoint("EndToStart", r);
        //Single line selection
        if (r.text.length === 0 || r.text.indexOf("\n") === -1) {
          if (e.shiftKey) {
            ch = br.text.slice(br.text.length - 1, br.text.length);
            if (ch == tab || ch == ' ') {
              br.text = br.text.slice(0, br.text.length - 1);
              r.setEndPoint("StartToEnd", br);
            }
          } else {
            var rtn = t.value.slice(br.text.length, br.text.length + 1);
            if (rtn != r.text.slice(0, 1)) {
              br.text = br.text.concat(rtn);
            }
            br.text = br.text.concat(tab);
          }
          nr = document.body.createTextRange();
          nr.setEndPoint("StartToEnd", br);
          nr.setEndPoint("EndToEnd", r);
          nr.select();
        }
        //Multi line selection
        else {
          var p;
          if (e.shiftKey) {
            a = r.text.split("\r\n");
            rt = t.value.slice(br.text.length, br.text.length + 2);
            if (rt == r.text.slice(0, 2)) {
              p = br.text.lastIndexOf("\r\n".concat(tab));
              if (p != -1) {
                br.text = br.text.slice(0, p + 2).concat(br.text.slice(p + 3, br.text.length));
              }
            }
            for (i = 0; i < a.length; i++) {
              ch = a[i].length > 0 && a[i].slice(0, 1);
              if (ch == tab || ch == ' ') {
                a[i] = a[i].slice(1, a[i].length);
              }
            }
            r.text = a.join("\r\n");
          } else {
            if (br.text.length > 0) {
              rt = t.value.slice(br.text.length, br.text.length + 2);
              if (rt != r.text.slice(0, 2)) {
                r.text = tab.concat(r.text.split("\r\n").join("\r\n".concat(tab)));
              } else {
                var selectionStart; // TODO: what is this about?
                p = br.text.slice(0, selectionStart).lastIndexOf("\r\n") + 2;
                br.text = br.text.slice(0, p).concat(tab, br.text.slice(p, br.text.length));
                r.text = r.text.split("\r\n").join("\r\n".concat(tab));
              }
            } else {
              r.text = tab.concat(r.text).split("\r\n").join("\r\n".concat(tab));
            }
          }
          nr = document.body.createTextRange();
          nr.setEndPoint("StartToEnd", br);
          nr.setEndPoint("EndToEnd", r);
          nr.select();
        }
      }
    }
    t.scrollTop = scrollTop;
  }

};