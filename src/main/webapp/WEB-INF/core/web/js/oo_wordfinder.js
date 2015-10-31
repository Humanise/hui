oo.WordFinder = function() {
  this.name = 'wordFinder';
  hui.ui.extend(this);
  hui.ui.listen(this);
  this.pages = hui.ui.get('wordFinderPages');
  this.form = hui.ui.get('wordFinderForm');
  this.list = hui.ui.get('wordFinderList');
  this.search = hui.ui.get('wordFinderSearch');
}

oo.WordFinder.get = function() {
  this.instance = this.instance || new oo.WordFinder();
  return this.instance
}

oo.WordFinder.prototype = {
  show : function(callback) {
    hui.ui.get('wordFinderListSource').setParameter('language',oo.language);
    hui.ui.get('wordFinderWindow').show();
    this.search.focus();
    this.callback = callback;
  },
  setSearch : function(str) {
    this.search.setValue(str);
  },
  _found : function(obj) {
    if (this.callback) {
      this.callback(obj);
    } else {
      this.fire('found',obj);
    }
    hui.ui.get('wordFinderWindow').hide();
  },
  $click$wordFinderCancel : function() {
    this.pages.next();
  },
  $click$wordFinderAdd : function() {
    this._addWord();
  },
  $click$wordFinderEmpty : function() {
    this._addWord();
  },
  _addWord : function() {
    this.pages.goTo('new');
    var text = this.search.getValue();
    this.form.setValues({
      text : text
    })
    this.form.focus();    
  },
  $valueChanged$wordFinderSearch : function() {
    hui.ui.get('wordFinderList').resetState();
    this.pages.goTo('list');
  },
  $select$wordFinderList : function() {
    var row = this.list.getFirstSelection();
    if (row) {
      this._found(row);
    }
  },
  $submit$wordFinderForm : function(form) {
    var values = form.getValues();
    if (hui.isBlank(values.text) || hui.isBlank(values.language)) {
      hui.ui.showMessage({text:'Please provide the text and language',duration:2000,icon:'common/warning'});
      form.focus();
      return;
    }
    hui.ui.request({
      url : oo.baseContext+'/service/model/addWord',
      parameters : values,
      $object : this._found.bind(this),
      $failure : function() {
        hui.ui.showMessage({text:'Unable to add word',duration:2000,icon:'common/warning'});
      }
    })
  }
};