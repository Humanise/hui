hui.component('Context', {
  'with': [
//    'value', 'enabled', 'key', 'size'
  ],
  state : {
    info: undefined,
    text: undefined,
    actions: undefined
  },
  nodes: {
    info: '.hui_context_info',
    actions: '.hui_context_actions'
  },
  create(options) {
    return hui.build('div.hui_context', {
      html: '<div class="hui_context_info"></div><div class="hui_context_actions"></div>'
    })
  },
  init(options) {
  },
  draw(changed) {
    if ('info' in changed) {
      this.nodes.info.innerHTML = '';
      if (changed.info) {
        if (changed.info.title) {
          hui.build('div.hui_context_info_title', {text: changed.info.title, parent: this.nodes.info});
        }
        if (changed.info.text) {
          hui.build('div.hui_context_info_text', {text: changed.info.text, parent: this.nodes.info});
        }        
      }
    }
    if ('actions' in changed) {
      hui.ui.destroyDescendants(this.nodes.actions);
      this.nodes.actions.innerHTML = '';
      let actions = changed.actions;
      if (actions) {
        for (var i = 0; i < actions.length; i++) {
          let action = actions[i];
          if (action.url) {
            let node = hui.build('a.hui_context_action',{
              href: action.url,
              children: [
                hui.build('span.hui_context_action_text', {text: action.text})
              ],
              parent: this.nodes.actions
            })
          } else {
            let node = hui.build('div.hui_context_action',{
              children: [
                hui.build('span.hui_context_action_text', {text: action.text})
              ],
              parent: this.nodes.actions
            })
            hui.on(node, 'click', (event) => {
              this._actionClicked({event,action})
            })            
          }
        }        
      }
    }
    this._showOrPositionLater();
  },
  load(args) {
    this._getPanel().setBusy(true);
    hui.ui.request({url: args.url, $object: (obj) => {
      var merged = {
        info: obj.info,
        actions: (obj.actions || []).concat(this.state.actions || [])
      }
      this.change(merged)
      this._getPanel().setBusy(false);
    }});
  },
  clear() {
    this.change({info:undefined,actions:undefined})
  },
  _actionClicked(e) {
    this.fire('action', e.action);
  },
  setInfo(info) {
    this.change({info:info})
  },
  setActions(actions) {
    this.change({actions})
  },
  addActions(actions) {
    actions = (this.state.actions || []).concat(actions)
    this.change({actions})
  },
  show(args) {
    this._target = args.target;
    this._showOrPositionLater();
  },
  _showOrPositionLater() {
    clearTimeout(this._pt);
    this._pt = setTimeout(() => {
      this._getPanel().show({target: this._target})
    },100);
  },
  setBusy(x) {
    this._getPanel().setBusy(x);
  },
  hide() {
    this._getPanel().setBusy(false);
    this._getPanel().hide();
  },
  _getPanel() {
    return this.getOwned({name: 'panel', supplier: () => {return this._buildPanel()}})
  },
  _buildPanel() {
    const panel = hui.ui.Panel.create({autoHide: true});
    panel.add(this.nodes.root);
    panel.on({
      '$hide' : function() {
        this.fire('hide');
      }.bind(this)
    })
    return panel;
  }
});