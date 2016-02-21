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

var reader = {

  viewer : null,
  viewerVisible : false,
  text : '',

  $ready : function() {

    hui.listen(hui.get.firstByClass(document.body,'reader_layout'),'click',this._click.bind(this));
		if (hui.location.getBoolean('dev')) {
      /*
			window.setTimeout(function() {
		    internetAddressViewer.show({addressId:2698752});
        statementController.edit(2751699);
			}.bind(this))*/
			window.setTimeout(function() {
        this.view({type:'Question',id:2800932});
			}.bind(this))			
		}
    hui.listen(window,'popstate',function(e) {
      hui.log(e);
    })
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
      this.view(info.item);
    }
  },
  
  _activeViewer : null,

  view : function(options) {
    if (options.type == 'Statement' && options.addressId) {
      options.id = options.addressId;
      options.type = 'InternetAddress';
    }
    var viewers = {
      InternetAddress : internetAddressViewer,
      Question : questionViewer,
      Hypothesis : hypothesisViewer
    }
    var newViewer = viewers[options.type];
    if (this._activeViewer && newViewer!==this._activeViewer) {
      this._activeViewer.hide();
    }
    this._activeViewer = newViewer;
    if (this._activeViewer) {
      this._activeViewer.show(options);
    }
  },
  edit : function(options) {
    var editors = {
      Question : questionEditor,
      Statement : statementController,
      Hypothesis : hypothesisEditor
    };
    for (key in editors) {
      if (options.type == key) {
        editors[key].edit(options.id);
      }
    }
  },
  peek : function(options) {
    reader.PeekController.peek(options);
  },

  search : function(options) {
    if (options.text!==undefined) {
      hui.ui.get('search').setValue(options.text);
    }
    if (options.tag!==undefined) {
      hui.ui.get('tags').selectById(options.tag);
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
  
  $statementChanged$statementEditor : function() {
		this._reloadList();
  },
	
	$addressWasDeleted$addressEditor : function() {
		this._reloadList();
    hui.ui.get('tagSource').refresh();
	},
	
	$addressChanged$addressEditor : function() {
		this._reloadList();
	},
  $addressChanged$internetAddressViewer : function() {
		this._reloadList();
	},
  $statementChanged$internetAddressViewer : function() {
		this._reloadList();
  },
  $questionChanged$questionEditor : function() {
		this._reloadList();
  },
  $hypothesisChanged$hypothesisEditor : function() {
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
    this.importURL({url:values.url})
  },
  
  importURL : function(options) {

    hui.ui.request({
      message : {start:'Adding address'},
      url : '/addInternetAddress',
      parameters : {url:options.url},
      $object : function(info) {
        hui.ui.showMessage({text:'Address added',icon:'common/success',duration:3000});
        this._reloadList();
        this.view({
          id : info.id,
          type: 'InternetAddress'
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

hui.ui.listen(reader);

