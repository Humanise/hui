var hypothesisViewer = {
  id : null,
  data : null,
  locked : false,
  visible : false,
  
  nodes : {
    root : '.js_hypothesis',
    text : '.js_hypothesis_text',
    body : '.js_hypothesis_body'
  },
  
  $ready : function() {
    this.nodes = hui.collect(this.nodes);
    this._attach();
  },
  
  $click$closeQuestion : function() {
    this.hide();
  },
  
  $click$hypothesisInfo : function() {
    reader.edit({type:'Hypothesis',id:this.id});
  },

  $click$hypothesisFavorite : function(icon) {
    if (this.locked) {return;}
    var newValue = !this.data.favorite;
    icon.setSelected(newValue);
    this.changeStatus({ id : this.id, favorite : newValue, type : 'Hypothesis',
      $success : function() {
        this.data.favorite = newValue;
      }.bind(this)
    })
  },

  $click$hypothesisInbox : function(icon) {
    if (this.locked) {return;}
    var newValue = !this.data.inbox;
    icon.setSelected(newValue);
    this.changeStatus({ id : this.id, inbox : newValue, type : 'Hypothesis',
      $success : function() {
        this.data.inbox = newValue;
      }.bind(this)
    })
  },

  changeStatus : function(options) {
    this._lock();
    hui.ui.request({
      url : '/changeStatus',
      parameters : options,
      $success : function() {
        hui.ui.get('listSource').refresh();
        options.$success();
      }.bind(this),
      $finally : function() {
        this._unlock();
      }.bind(this)
    });
  },
  
  _lock : function() {
    this.locked = true;
  },
  _unlock : function() {
    this.locked = false;    
  },
  
  _attach : function() {
    hui.listen(this.nodes.body,'click',this._click,this);
  },
  
  _click : function(e) {
    e = hui.event(e);
    var clickable = e.findByClass('js-clickable');
    if (clickable) {
      var data = hui.string.fromJSON(clickable.getAttribute('data'));
      if (data.type=='Statement') {
        statementController.edit(data.id);
      } else {
        reader.view(data);
      }
    }
  },
  
  $hypothesisChanged$hypothesisEditor : function() {
    this._load();
  },
  
  $hypothesisChanged$statementEditor : function() {
    this._load();
  },
  
  show : function(options) {
    this.id = options.id;
    this.nodes.root.style.display = 'block';
    hui.dom.setText(this.nodes.text,options.placeholder || 'Loading...');
    this._load();
    this.visible = true;
  },
  hide : function(e) {
    this.nodes.root.style.display = 'none';
    this.visible = false;
    this.id = null;
  },
  
  _load : function() {
    if (!this.visible || !this.id) {
      return;
    }
    hui.ui.request({
      url : '/viewHypothesis',
      parameters : {id:this.id},
      $object : function(data) {
        this.data = data;
        this._render();
      }.bind(this),
      $finally : function() {
        
      }.bind(this)
    });
  },
  _render : function() {
    hui.dom.setText(this.nodes.text,this.data.text);
    this.nodes.body.innerHTML = this.data.rendering;
    hui.ui.get('hypothesisFavorite').setSelected(this.data.favorite);
    hui.ui.get('hypothesisInbox').setSelected(this.data.inbox);
  }
}

hui.ui.listen(hypothesisViewer);