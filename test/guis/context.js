hui.control({
  
    'ready!' : function() {
      //this['contexted.click!'](this.components.contexted)
      console.log(this.components.more)
      //this['more.click!']({source: this.components.more})
      this.components.other.click();
    },
    components : {
      panel : 'context-panel',
      contexted: 'contexted',
      more: 'more',
      other: 'other'
    },
    'contexted.click!'(e) {
      this.components.panel.show({target: e.source})
    },

    'other.click!'(e) {
      var context = this._context = (() => this._context || hui.ui.Context.create())();
      context.show({target: e.source})
      context.load({url:'data/context.json'})
    },
    'more.click!'(e) {
      var context = this._context = (() => this._context || hui.ui.Context.create())();
      context.show({target: e.source})
      context.setInfo({title:'This is the title', text: 'Lorem ipsum dolor'})
      context.setActions([
        {text: 'Copy', icon: 'common/', name: 'copy', data: 'This is the text to copy'},
        {text: 'Download...', icon: 'common/', name: 'download'},
        {text: 'Delete', symbol: 'delete', name: 'delete'}
      ]);
      context.listen({
        'action!'(e) {
          if (e.value.name == 'copy') {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(e.value.data).then(() => {
                hui.ui.msg.success({text:'Copied'})
                e.source.hide();
              },() => {
                hui.ui.msg.fail({text:'Copy failed'})
              });
            } else {
              hui.ui.msg.fail({text:'Clipboard not available'})
            }
          }
          else if (e.value.name == 'download') {
            context.setBusy('Downloading');
            setTimeout(() => context.hide(), 2000)
          }
          else if (e.value.name == 'delete') {
            hui.ui.confirmOverlay({text:'Really delete?', target: context})
          }
        }
      })
    }
})