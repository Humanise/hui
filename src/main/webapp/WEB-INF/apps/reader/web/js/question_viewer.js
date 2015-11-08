var questionViewer = {
  id : null,
  data : null,
  
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
  
  _attach : function() {
    hui.listen(this.nodes.body,'click',this._click,this);
  },
  
  _click : function(e) {
    e = hui.event(e);
    var clickable = e.findByClass('js-clickable');
    if (clickable) {
      var data = hui.string.fromJSON(clickable.getAttribute('data'));
      reader.view(data);
    }
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
      url : '/loadQuestion',
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
  }
}

hui.ui.listen(questionViewer);