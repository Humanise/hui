reader.PeekController = {
  name: 'PeekController',

  nodes: {
    selector: '.js-peek-selector'
  },

  panel: null,
  pages: null,
  
  options : null,

  $ready: function() {
    this.nodes = hui.collect(this.nodes);
    this.panel = hui.ui.get('peekPanel');
    this.pages = hui.ui.get('peekPages');
    hui.listen(this.nodes.selector,'click',function(e) {
      e = hui.event(e);
      var item = e.findByClass('reader_peek_selector_item');
      if (item) {
        this._showItem(this.options.items[item.index]);
      }
    }.bind(this));
  },
  
  hide : function() {
    this.panel.hide();
  },

  peek: function(options) {
    this.options = options;
    var items = options.items || [options.item];
    if (items.length > 1) {
      var selector = this.nodes.selector;
      selector.innerHTML = '';
      for (var i = 0; i < items.length; i++) {
        var info = items[i].info;
        var a = hui.build('a', {
          text: info.description,
          'class': 'reader_peek_selector_item',
          parent: selector
        });
        a.index = i;
      }
      this.pages.goTo('selector');
    } else {
      this._showItem(items[0])
    }
    this.panel.show({
      target: items[0].node
    });
  },
  
  _showItem : function(item) {
    this.pages.goTo('view');    
    this.panel.show({
      target: item.node
    });

    hui.ui.request({
      url : '/peek',
      parameters : item.info,
      $object : this._renderItem.bind(this)
    });
  },
  _renderItem : function(info) {
    this._rendered = info;
    var html = 
    '<div class="reader_peek_rendering">' + info.rendering + '</div>' +
    '<div class="reader_peek_actions">';
    if (info.actions) {
      for (var i = 0; i < info.actions.length; i++) {
        var action = info.actions[i];
        html+='<a class="reader_peek_action" href="#" data-key="' + action.key + '">' + action.text + '</a>';
      }
    }
    html+='</div>';
    var view = hui.build('div.reader_peek_view',{html:html});
    hui.ui.get('peekRendering').setContent(view);
    hui.listen(view,'click',this._clickView,this);
  },
  _clickView : function(e) {
    e = hui.event(e);
    var a = e.findByTag('a');
    if (a) {
      e.stop();
      this._performAction(a.getAttribute('data-key'));
      this.panel.hide();
    }
  },
  _performAction : function(action) {
    var item = this._rendered;
    if (item.type=='Link') {
      if (action=='open') {
        window.open(item.data.url);
      }
      else if (action=='import') {
        reader.importURL({url:item.data.url});
      }
    }
    else if (item.type=='Word') {
      if (action=='search') {
        reader.search({text:item.data.text});
      }
      else if (action=='list') {
        reader.search({tag:item.id});
      }
      else if (action=='remove') {
        reader.remove({type:item.type,id:item.id,context:this.options.context});
      }
    }
    else if (action == 'view') {
      reader.view(item);
    }
    else if (action == 'edit') {
      reader.edit(item);
    }
  }
}

hui.ui.listen(reader.PeekController);
