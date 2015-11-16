var questionEditor = {
  name : 'questionEditor',

	window : null,
	form : null,

	$ready : function() {
		this.window = hui.ui.get('questionWindow');
		this.form = hui.ui.get('questionForm');
	},
	
	edit : function(id) {
		this.window.show();
		this.window.setBusy(true);
		this._reset();
    hui.ui.request({
      url : '/editQuestion',
      parameters : {id:id},
      $object : function(obj) {
        this._setObject(obj);
      }.bind(this),
      $finally : function() {
        this.window.setBusy(false);
      }.bind(this)
    });
	},
	_reset : function() {
		this.form.reset();
		this.object = null;
	},
	_setObject : function(object) {
		this.object = object;
		this.form.setValues({
			text: object.text,
      authors: object.authors
		});
	},
	$submit$questionForm : function() {
		var form = hui.ui.get('questionForm');
    var values = this.form.getValues();
		var data = {
			id : this.object.id,
			text : values.text,
      authors : values.authors
		};
    this.window.setBusy(true);
    hui.ui.request({
      url : '/saveQuestion',
      json : {data:data},
      $success : function() {
        this._reset();
				this.window.hide();
				this._notify();
      }.bind(this),
      $finally : function() {
        this.window.setBusy(false);
      }.bind(this)
    });
	},
	$click$deleteQuestion : function() {
    this.window.setBusy(true);
    hui.ui.request({
      url : '/deleteQuestion',
      parameters : {id : this.object.id},
      $success : function(obj) {
        this._reset();
				this.window.hide();
				this._notify();
      }.bind(this),
      $finally : function() {
        this.window.setBusy(false);
      }.bind(this)
    });
	},
	$userClosedWindow$questionWindow : function() {
		this._reset();
	},
  $render$questionAuthor : function(item) {
    return {
      icon: 'common/person',
      text: item.name || item.title || item.text
    }
  },
	_notify : function() {
    hui.ui.callDelegates(this,'questionChanged');
	}
}

hui.ui.listen(questionEditor);