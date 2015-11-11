var questionViewer = {
  id : null,
  data : null,
  locked : false,
  
  nodes : {
    root : '.reader_question',
    text : '.reader_question_text',
    body : '.reader_question_body'
  },
  
  $ready : function() {
    this.nodes = hui.collect(this.nodes);
    this._attach();
  },
  
  $click$closeQuestion : function() {
    this.hide();
  },
  
  $click$questionInfo : function() {
    reader.edit({type:'Question',id:this.id});
  },

  $click$questionFavorite : function(icon) {
    if (this.locked) {return;}
    var newValue = !this.data.favorite;
    icon.setSelected(newValue);
    this.changeStatus({ id : this.id, favorite : newValue, type : 'Question',
      $success : function() {
        this.data.favorite = newValue;
      }.bind(this)
    })
  },

  $click$questionInbox : function(icon) {
    if (this.locked) {return;}
    var newValue = !this.data.inbox;
    icon.setSelected(newValue);
    this.changeStatus({ id : this.id, inbox : newValue, type : 'Question',
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
  
  $questionChanged$questionEditor : function() {
    this._load();
  },
  
  show : function(options) {
    this.id = options.id;
    this.nodes.root.style.display = 'block';
    hui.dom.setText(this.nodes.text,options.placeholder || 'Loading...');
    this._load();
  },
  hide : function(e) {
    this.nodes.root.style.display = 'none';
  },
  
  _load : function() {
    hui.ui.request({
      url : '/viewQuestion',
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
    hui.ui.get('questionFavorite').setSelected(this.data.favorite);
    hui.ui.get('questionInbox').setSelected(this.data.inbox);
  }
}

hui.ui.listen(questionViewer);