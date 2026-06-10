hui.control({
  components: {
    chat: 'chat'
  },
  'ready!'() {
    this.components.chat.focus();
    this.components.chat.addBotItem('Good day sir! How can I help you?')
    //this._request();
  },
  'chat.prompt!'(e) {
    var item = e.source.startItem();
    setTimeout(() => {
      item.setText('Just a second...')
    }, 400)
    setTimeout(() => {
      item.setText('Are you sure you want me to ' + e.value)
      item.complete();
    }, 1000)
  },
  'addText.click!'() {
    this.components.chat.addBotItem('This is a message from the Action Man!')
  }
})