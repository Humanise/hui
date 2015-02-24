hui.ui.listen({
	dragDrop : [
		{drag:'internetAddress',drop:'tag'}
	],
	bookmarkId : null,
	
	
	$drop$internetAddress$tag : function(dragged,dropped) {
		Common.addTag(dragged.id,dropped.value,function() {
			this.refreshAll();
		}.bind(this));
	},
	$submit$quickEnter : function() {
		var url = quickEnter.getValue();
		hui.ui.showMessage({text:'Anaylserer adresse...'});
		AppCommunity.lookupInternetAddress(url,function(obj) {
			quickEnter.setValue();
			hui.ui.hideMessage();
			this.bookmarkId = null;
			bookmarkFormula.reset();
			bookmarkFormula.setValues(obj);
			bookmarkWindow.show();
			bookmarkFormula.focus();
			deleteBookmark.setEnabled(false);
		}.bind(this));
	},
	$select$selection : function() {
		bookmarksList.resetState();
	},
	$select$bookmarksList : function() {
		deleteItem.setEnabled(true);
		showItem.setEnabled(true);
		itemInfo.setEnabled(true);
	},
	$selectionReset$bookmarksList : function() {
		deleteItem.setEnabled(false);
		showItem.setEnabled(false);
		itemInfo.setEnabled(false);
	},
	$valueChanged$searchfield : function() {
		bookmarksList.resetState();
	},
	$click$newBookmark : function() {
		this.bookmarkId = null;
		bookmarkFormula.reset();
		bookmarkWindow.show();
		bookmarkFormula.focus();
		deleteBookmark.setEnabled(false);
	},
	$click$cancelBookmark : function() {
		this.bookmarkId = null;
		bookmarkWindow.hide();
	},
	$click$deleteItem : function() {
		var obj = bookmarksList.getFirstSelection();
		if (obj) {
			Common.deleteEntity(obj.id,this.refreshAll.bind(this));
			if (obj.id==this.bookmarkId) {
				this.$click$cancelBookmark();
			}
		}
	},
	$click$itemInfo : function() {
		var obj = bookmarksList.getFirstSelection();
		this.editBookmark(obj.id);
	},
	$click$showItem : function() {
		var obj = bookmarksList.getFirstSelection();
		window.open(obj.data.address);
	},
	$click$deleteBookmark : function() {
		Common.deleteEntity(this.bookmarkId,function() {
			this.$click$cancelBookmark();
			this.refreshAll();
		}.bind(this));
	},
	$open$bookmarksList : function(obj) {
		this.editBookmark(obj.id);
	},
	refreshAll : function() {
		bookmarksSource.refresh();
		tagsSource.refresh();
	},
	editBookmark : function(id) {
		AppCommunity.getInternetAddress(id,function(obj) {
			this.bookmarkId = obj.id;
			bookmarkFormula.reset();
			bookmarkFormula.setValues(obj);
			bookmarkWindow.show();
			deleteBookmark.setEnabled(true);			
		}.bind(this));
	},
	$click$saveBookmark : function() {
		var obj = bookmarkFormula.getValues();
		obj.id = this.bookmarkId;
		AppCommunity.saveInternetAddress(obj,function() {
			bookmarkFormula.reset();
			bookmarkWindow.hide();
			this.refreshAll();
		}.bind(this));
	},
	////////////////// Import ///////////////
	$click$import : function() {
		importWindow.show();
	}
});