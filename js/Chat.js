hui.component('Chat', {
//  use: [
//    'value', 'enabled', 'key', 'size'
//  ],
  state : {
    items: [],
    input: undefined
  },
  nodes: {
    input: 'textarea',
    body: '.hui_chat_body'
  },
  create(options) {
    return hui.build('div.hui_chat', { html: '<div class="hui_chat_body"></div><textarea class="hui_chat_input"></textarea>' });
  },
  init(options) {
    hui.ui.addFocusClass({element: this.element, 'class': 'hui_checkbox_focused'});
  },
  attach() {
    hui.on(this.nodes.input, 'keydown', e => this._inputKeyDown(e));
  },
  draw(changed) {
    this.nodes.body.innerHTML = '';
    var node;
    for (var i = 0; i < this.state.items.length; i++) {
      var item = this.state.items[i];
      node = hui.build('div.hui_chat_item', {
        parent: this.nodes.body
      });
      if (item.text) {
        node.innerText = item.text;
      }
      else if (item.html) {
        console.log(item.html)
        node.innerHTML = item.html;
      }
      if (item.user) {
        hui.cls.add(node, 'hui-user');
      }
      if (item.busy) {
        hui.cls.add(node, 'hui-busy');
      }
    }
    if (node && node.scrollIntoViewIfNeeded) {
      node.scrollIntoViewIfNeeded();
    }
  },
  
  _inputKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      const text = this.nodes.input.value;
      if (!hui.isBlank(text)) {
        this._addItem({ text: text , user: true});
        //this._addDummyResponse({ text: 'Well Dave, I am sorry, but I cannot answer that at the moment'});
        this.nodes.input.value = '';
        this.fire('prompt', text, e);
      }
    }
  },
  _addItem(item) {
    this.change({items: this.state.items.concat([item])});
  },
  _addDummyResponse(item) {
    setTimeout(() => {
      this.change({items: this.state.items.concat([item])});
    }, 1000)
  },
  focus() {
    this.nodes.input.focus();
  },
  addBotItem(text) {
    this._addItem({text: text});
  },
  startItem() {
    var item = { busy: true }
    this._addItem(item);
    var self = this;
    return {
      setHTML(str) {
        item.html = str;
        self.draw({items: self.state.items});
      },
      setText(str) {
        item.text = str;
        self.draw({items: self.state.items});
      },
      complete() {
        item.busy = false;
        self.draw({items: self.state.items});
      }
    }
  }
});