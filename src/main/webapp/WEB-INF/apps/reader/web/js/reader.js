require(['all'],function() {
  var view = new oo.View({
  	name : 'listView',
  	element : 'my_view',
  	pageSize : 20,
  	source : hui.ui.get('listSource'),
  	emptyHtml : '<div class="reader_list_pending"></div>',
  	$render : function(info) {
  		return info.html;
  	}
  });  
})

var controller = {

  viewer : null,
  viewerVisible : false,
  text : '',

  $ready : function() {

    hui.listen(hui.get.firstByClass(document.body,'reader_layout'),'click',this._click.bind(this));
    new oo.Segmented({
      name : 'readerViewerView',
      element : hui.get('reader_viewer_view'),
      selectedClass : 'reader_viewer_view_item_selected',
      value : 'formatted'
    });
		if (hui.location.getBoolean('dev')) {
			window.setTimeout(function() {
		    readerViewer.load({addressId:2698752});
        statementController.edit(2751699);
			}.bind(this))			
		}
  },
  
  $clickItem$listView : function(info) {
    var event = info.event;
    var a = event.findByTag('a');
    if (hui.cls.has(a,'reader_list_word')) {
      var id = parseInt(a.getAttribute('data-id'));
      hui.ui.get('tags').selectById(id,event.shiftKey);
    } else if (hui.cls.has(a,'reader_list_address_link')) {
      window.open(a.href);
    } else if (info.item) {
      readerViewer.load(info.item);
    }
  },

  _click : function(e) {
    e = hui.event(e);
    var a = e.findByTag('a');
    if (hui.cls.has(a,'reader_list_word')) {
      var id = parseInt(a.getAttribute('data-id'));
      hui.ui.get('tags').selectById(id,e.shiftKey);
    }
  },
	
	statementChanged : function() {
		readerViewer.reload();
		this._reloadList();
	},
	
	addressWillBeDeleted : function() {
		this._lockViewer();
	},
	
	addressWasDeleted : function() {
		this._unlockViewer();
		this._reloadList();
    hui.ui.get('tagSource').refresh();
		this._hideViewer();
	},
	
	addressChanged : function(deleted) {
		readerViewer.reload();
		this._reloadList();
	},

  $valueChanged$search : function() {
    hui.ui.get('listView').reset();
  },

  $valueChanged$tags : function() {
    hui.ui.get('listView').reset();
  },

  $valueChanged$subsets : function() {
    hui.ui.get('listView').reset();
  },

  $valueChanged$types : function() {
    hui.ui.get('listView').reset();
  },

  // List...

  _currentArticle : null,

  $click$addFeed : function(button) {
    hui.ui.get('newFeedPanel').show({target:button})
    hui.ui.get('newFeedForm').focus();
  },
  $submit$newFeedForm : function(form) {
    hui.ui.get('newFeedPanel').hide();
    var url = form.getValues().url;
    hui.ui.showMessage({text:'Adding feed',busy:true});
    hui.ui.request({
      url : '/addFeed',
      parameters : {url:url},
      $success : function() {
        hui.ui.showMessage({text:'Feed added',icon:'common/success',duration:3000});
        hui.ui.get('feedSource').refresh();
      }.bind(this),
      $failure : function() {
   			hui.ui.showMessage({text:'Feed could not be added',icon:'common/warning',duration:3000});
      }
    })
  },
	
	_reloadList : function() {
		hui.ui.get('listView').reset();
    hui.ui.get('listSource').refresh();
	},

  // Add

  $click$addButton : function(button) {
    hui.ui.get('addPanel').show({target:button})
    hui.ui.get('addForm').focus();
  },

  $click$cancelAddPanel : function() {
    hui.ui.get('addPanel').hide();
  },

  $submit$addForm : function(form) {
    hui.ui.get('addPanel').hide();
    var values = form.getValues();
    form.reset();
    hui.ui.request({
      message : {start:'Adding address'},
      url : '/addInternetAddress',
      parameters : {url:values.url},
      $object : function(info) {
        hui.ui.showMessage({text:'Address added',icon:'common/success',duration:3000});
        this._reloadList();
        readerViewer.load({
          addressId : info.id
        });
      }.bind(this),
      $failure : function() {
        hui.ui.showMessage({text:'Address could not be added',icon:'common/warning',duration:3000});
      }
    })
  },


  // Tags

  _clickTag : function(a) {
    hui.ui.confirmOverlay({
      element : a,
      text : 'Delete it?',
      okText : 'Yes, delete',
      $ok : function() {
        hui.ui.request({
          url : '/removeTag',
          parameters : {
            internetAddressId : this._currentArticle.id,
            tag: hui.dom.getText(a)
          },
          $success : this._reloadInfo.bind(this)
        });
      }.bind(this)
    })
  },

  // Settings

  $click$settingsIcon : function() {
    hui.ui.get('settingsWindow').show();
  },

  $click$reIndexButton : function() {
    hui.ui.request({
      url : '/reIndex',
      message : {start:'Indexing',success:'Finished'}
    });
  }
}

hui.ui.listen(controller);

