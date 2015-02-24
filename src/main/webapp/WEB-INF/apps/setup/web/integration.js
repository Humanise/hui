hui.ui.listen({
	
	publisherId : null,
	
	$open$list : function(row) {
		this._loadPublisher(row.id);
	},
	_loadPublisher : function(id) {
		hui.ui.request({
			url : 'loadPublisher',
			parameters : {id:id},
			$object : function(obj) {
				this.publisherId = obj.id;
				publisherFormula.setValues(obj);
				publisherWindow.show();
				deletePublisher.enable();
			}.bind(this)
		})
	},
	$click$newPublisher : function() {
		this.publisherId = null;
		publisherWindow.show();
		publisherFormula.reset()
		publisherFormula.focus();
		deletePublisher.disable();
	},
	$submit$publisherFormula : function() {
		var values = publisherFormula.getValues();
		values.id = this.publisherId;
		
		hui.ui.request({
			url : 'savePublisher',
			json : {publisher : values},
			$success : function(user) {
				listSource.refresh();
				this._reset();
			}.bind(this)
		})
	},
	$click$deletePublisher : function() {
		hui.ui.request({
			url : 'deletePublisher',
			parameters : {id : this.publisherId},
			$success : function(user) {
				listSource.refresh();
				this._reset();
			}.bind(this)
		})
	},
	$click$cancelPublisher : function() {
		this._reset();
	},
	_reset : function() {
		this.publisherId = null;
		publisherFormula.reset();
		publisherWindow.hide();
	}
})