hui.ui.listen({
	dragDrop : [
		{drag:'internetAddress',drop:'tag'}
	],
	bookmarkId : null,
	
	
	$drop$internetAddress$tag : function(dragged,dropped) {
        hui.ui.request({
			message : {start:'Adding tag...',success:'Tag added'},
            url : '../service/model/addTag',
            parameters : {
                id : dragged.id,
                tag : dropped.value
            },
            $success : function() {
                this.refreshAll();
            }.bind(this)
        });
	},
    $submit$quickAdd : function(field) {
        var value = field.getValue();
        if (!hui.isBlank(value)) {
            hui.ui.request({
			    message : {start:'Adding address',success:'The address is added'},
                url : '../addInternetAddress',
                parameters : {url:value},
                $success : function() {
                    field.setValue();
			        this.refreshAll();
                }.bind(this),
                $failure : function() {
                    hui.ui.msg.fail({text:'Unable to create address'});
                }
            })
        }
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
		bookmarkFormula.reset();
		bookmarkWindow.hide();
	},
	$click$deleteItem : function() {
		var obj = bookmarksList.getFirstSelection();
        this._deleteEntity({
            id: obj.id,
            $success : function() {
                this.$click$cancelBookmark();
    			this.refreshAll();
            }.bind(this)
        })
	},
    
    _deleteEntity : function(options) {
        hui.ui.request({
			message : {start:'Removing...',success:'Removed!'},
            url : '../service/model/removeEntity',
            parameters : {id:options.id},
            $success : options.$success,
            $failure : function() {
                hui.ui.msg.fail({text:'Unable to remove item'});
            }
        });
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
        this._deleteEntity({
            id: this.bookmarkId,
            $success : function() {
    			this.$click$cancelBookmark();
    			this.refreshAll();
            }.bind(this)
        });
	},
	$open$bookmarksList : function(obj) {
		this.editBookmark(obj.id);
	},
	refreshAll : function() {
		bookmarksSource.refresh();
		tagsSource.refresh();
		wordsSource.refresh();
	},
	editBookmark : function(id) {
        hui.ui.request({
            url : '../getInternetAddress',
            parameters : {id:id},
            $object : function(obj) {
    			this.bookmarkId = obj.id;
    			bookmarkFormula.reset();
    			bookmarkFormula.setValues(obj);
    			bookmarkWindow.show();
    			deleteBookmark.setEnabled(true);                
            }.bind(this)
        })
	},
	$click$saveBookmark : function() {
		var obj = bookmarkFormula.getValues();
		obj.id = this.bookmarkId;
        hui.ui.request({
            url : '../saveInternetAddress',
            json : {data:obj},
            $success : function() {
    			bookmarkFormula.reset();
    			bookmarkWindow.hide();
    			this.refreshAll();                
            }.bind(this)
        });
	},
	////////////////// Import ///////////////
	$click$import : function() {
		importWindow.show();
	}
});