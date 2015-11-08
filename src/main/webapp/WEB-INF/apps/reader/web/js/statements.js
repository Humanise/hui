var statementController = {
  name : 'statementEditor',

	window : null,
	form : null,

	$ready : function() {
		this.window = hui.ui.get('statementWindow');
		this.form = hui.ui.get('statementForm');
	},
	
	edit : function(id) {
		this.window.show();
		this.window.setBusy(true);
		this._reset();
    hui.ui.request({
      url : '/loadStatement',
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
      authors: object.authors,
      questions: object.questions,
      supports: object.supports,
      contradicts: object.contradicts
		});
	},
	$submit$statementForm : function() {
		var form = hui.ui.get('statementForm');
    var values = this.form.getValues();
		var data = {
			id : this.object.id,
			text : values.text,
      authors : values.authors,
      questions : values.questions,
      supports : values.supports,
      contradicts : values.contradicts
		};
    this.window.setBusy(true);
    hui.ui.request({
      url : '/saveStatement',
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
	$click$deleteStatement : function() {
    this.window.setBusy(true);
    hui.ui.request({
      url : '/deleteStatement',
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
	$userClosedWindow$statementWindow : function() {
		this._reset();
	},
  $render$statementAuthor : function(item) {
    return {
      icon: 'common/person',
      text: item.name || item.title || item.text
    }
  },
	_notify : function() {
    hui.ui.callDelegates(this,'statementChanged');
	}
}

hui.ui.listen(statementController);