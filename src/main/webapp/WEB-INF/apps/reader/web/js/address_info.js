var addressInfoController = {
  name : 'addressEditor',
  
	window : null,
	form : null,
	id : null,

	$ready : function() {
		this.window = hui.ui.get('addressInfoWindow');
		this.form = hui.ui.get('addressInfoForm');
	},
	
	edit : function(data) {
		this.id = data.id;
		this.form.setValues({
			title : data.title,
			address: data.url,
      authors : data.authors
		});
		this.window.show();
	},
	
	clear : function() {
		this._reset();
		this.window.hide();
	},
	
	_reset : function() {
		this.id = null;
		this.form.reset();
	},
	
	$submit$addressInfoForm : function() {
		var data = this.form.getValues();
		if (hui.isBlank(data.title) || hui.isBlank(data.address)) {
			// TODO Proper feedback
			this.form.focus();
			return;
		}
		data.id = this.id;
		this.window.setBusy(true);
    hui.ui.request({
      url : '/saveAddress',
      json : {data : data},
      $success : function() {
        this._reset();
				this.window.hide();
        hui.ui.callDelegates(this,'addressChanged');
      }.bind(this),
      $finally : function() {
        this.window.setBusy(false);
      }.bind(this)
    });
	},
	
	$click$deleteAddressInfo : function() {
		var data = {
			id : this.id
		};
    hui.ui.callDelegates(this,'addressWillBeDeleted');
    hui.ui.request({
      url : '/removeInternetAddress',
      parameters : data,
      $success : function() {
        hui.ui.callDelegates(this,'addressWasDeleted');
				this.clear();
      }.bind(this)
    })
	},
	
	$click$cancelAddressInfo : function() {
		this.clear();
	},
	$userClosedWindow$addressInfoWindow : function() {
		this._reset();
	},

  $render$addressAuthor : function(item) {
    return {
      icon: 'common/person',
      text: item.name || item.title || item.text
    }
  }
}

hui.ui.listen(addressInfoController);