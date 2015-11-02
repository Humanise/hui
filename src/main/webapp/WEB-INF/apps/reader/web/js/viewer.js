var readerViewer = {

  _viewedItem : null,
  
  $ready : function() {

    this.viewer = hui.get('viewer');
    this.viewerContent = hui.get('viewer_content');
    this.viewerFrame = hui.get('viewer_frame');
    this.viewerSpinner = hui.get('viewer_spinner');

    var textListener = function() {
      var selection = hui.selection.getText();
      if (!hui.isBlank(selection)) {
        this.text = selection;
        hui.log(this.text);
      }
    }.bind(this);
    hui.listen(this.viewer,'mouseup',textListener);
    hui.listen(window,'keyup',textListener);
    hui.listen(window,'keydown',function(e) {
      e = hui.event(e);
      if (this.viewerVisible && e.escapeKey) {
        this._hideViewer();
      }
    }.bind(this));

    hui.listen(this.viewer,'click',this._click.bind(this));
    hui.listen(hui.get('viewer_info'),'click',this._clickInfo.bind(this));
  },
  
  _click : function(e) {

    e = hui.event(e);
    var a = e.findByTag('a');
    if (a) {
      e.stop();
      if (hui.cls.has(a,'reader_viewer_close')) {
        this._hideViewer();
      }
      else if (hui.cls.has(a,'reader_viewer_quote_icon')) {
        this._editStatement({link:a});
      }
      else if (hui.cls.has(a.parentNode,'link')) {
        window.open(a.href)
      }
    } else if (hui.cls.has(e.element,'reader_viewer_quote')) {
      e.stop();
      this._highlightStatement(e.element.getAttribute('data-id'));
    } else {
      var mark = e.findByTag('mark');
      if (mark) {
        if (e.altKey && hui.cls.has(mark,'quote')) {
          this._peek({
            type : 'statement',
            node : mark,
            id : parseInt(mark.getAttribute('data-id'), 10)
          });
        }
      }
    }
  },
  
  _clickInfo : function(e) {

    e = hui.event(e);
    var a = e.findByTag('a');
    if (a) {
      e.stop();
      if (hui.cls.has(a,'info_tags_add')) {
        var finder = oo.WordFinder.get();
        finder.show();
        finder.setSearch(this.text);
      }
      else if (hui.cls.has(a,'info_word')) {
        this._clickWord(a);
      }
      else if (hui.cls.has(a,'info_tag')) {
        this._clickTag(a);
      }
    }
  },

  $valueChanged$extractionAlgorithm : function() {
    if (this._viewedItem) {
      this.load(this._viewedItem);
    }
  },
	
	reload : function() {
		var obj = this._viewedItem;
    obj.statementId = undefined; // Avoid scroll
		this._viewedItem = null;
		this.load(obj);
	},

  load: function(object) {
    if (!object.addressId) {
      return;
    }
    if (this._viewedItem && this._viewedItem.addressId == object.addressId) {
      this._highlightStatement(object.statementId);
      return;
    }
		addressInfoController.clear();
    this._viewedItem = object;
    object = object || {};
    hui.get('viewer_header').innerHTML = '<h1>' + hui.string.escape(object.title || 'Loading...') + '</h1>';
    hui.get('viewer_formatted').innerHTML = '';
    hui.get('viewer_text').innerHTML = '';
    hui.get('viewer_info').innerHTML = ''
    this.viewer.style.display = 'block';
    this.viewerVisible = true;
    hui.cls.add(document.body, 'reader_modal');
    hui.cls.add(this.viewerSpinner, 'oo_spinner_visible');
    var self = this;
    var parameters = {
      algorithm : hui.ui.get('extractionAlgorithm').getValue()
    };
    if (object.addressId) {
      parameters.id = object.addressId;
    } else {
      return;
    }
    hui.ui.request({
      url: '/loadArticle',
      parameters: parameters,
      $object: function(article) {
        self._drawArticle(article);
        if (object.statementId) {
          window.setTimeout(function() {
            self._highlightStatement(object.statementId);
          },500)
        }
      },
      $failure: function() {
        self._hideViewer();
        hui.ui.msg.fail({
          text: 'Sorry!'
        });
      },
      $finally: function() {
        hui.cls.remove(self.viewerSpinner, 'oo_spinner_visible');
      }
    });
  },


  _drawArticle : function(article) {
    this._currentArticle = article;
    hui.get('viewer_formatted').innerHTML = article.formatted;
    hui.get('viewer_text').innerHTML = article.text;
    hui.get('viewer_header').innerHTML = article.header;
    hui.get('viewer_info').innerHTML = article.info;

    hui.cls.set(hui.get('reader_viewer_inbox'),'reader_viewer_action_selected',article.inbox);
    hui.cls.set(hui.get('reader_viewer_favorite'),'reader_viewer_action_selected',article.favorite);
    var view = hui.ui.get('readerViewerView').getValue();
    if (view === 'web') {
      // TODO Find a way to handle errors
      this.viewerFrame.setAttribute('src',article.url);
    }
    this.frameSet = view === 'web';
  },

  _highlightStatement : function(id) {
    if (id==null || id==undefined) {
      return;
    }
    var marks = document.querySelectorAll('mark[data-id="' + id + '"]');
    if (marks.length==0) {
      return;
    }
    var mark = marks[0];
    var content = hui.get('viewer_content');
    var top = content.clientHeight / -2;
    var parent = mark.parentNode;
    while (parent && parent!==content) {
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }
    top = Math.max(0, Math.round(top));
    var dur = Math.min(1500,Math.abs(top - content.scrollTop));
    hui.animate({
      node : content,
      property : 'scrollTop',
      value : top,
      duration : dur,
      ease : hui.ease.slowFastSlow,
      $complete : function() {
        for (var i = 0; i < marks.length; i++) {
          hui.effect.wiggle({element:marks[i]});
        }
      }
    });
  },

  _reloadInfo : function() {
    var info = hui.get('viewer_info');
    info.style.opacity = '.5';
    hui.ui.request({
      url : '/loadArticle',
      parameters : {id:this._currentArticle.id},
      $object : function(article) {
        this._currentArticle = article;
        info.innerHTML = article.info;
      }.bind(this),
      $finally : function() {
        info.style.opacity='';
      }
    })
  },
  
  _peek : function(options) {
    statementController.edit(options.id);
    // TODO:
    //hui.ui.get('peekPanel').show({target:options.node});
  },
	
	_editStatement : function(options) {
		statementController.edit(options.link.getAttribute('data-id'));
	},

  _hideViewer : function() {
    viewer.style.display='none';
    hui.cls.remove(document.body,'reader_modal');
    this.viewerVisible = false;
    this.viewerFrame.src = "about:blank";
    hui.get('viewer_info').innerHTML = ''
    this._viewedItem = null;
		addressInfoController.clear();
  },
  _lockViewer : function() {
    this._viewerLocked = true;
    hui.cls.add(this.viewer,'reader_viewer_locked');
  },
  _unlockViewer : function() {
    this._viewerLocked = false;
    hui.cls.remove(this.viewer,'reader_viewer_locked');
  },
  $click$favoriteButton : function() {
    if (this._viewerLocked) {return}
    this._lockViewer();
    var newValue = !this._currentArticle.favorite;
    hui.cls.set(hui.get('reader_viewer_favorite'),'reader_viewer_action_selected',newValue);
    hui.ui.request({
      url : '/changeFavoriteStatus',
      parameters : {id:this._currentArticle.id,favorite:newValue},
      $success : function() {
        this._currentArticle.favorite = newValue;
        hui.ui.get('listSource').refresh();
        hui.ui.msg.success({text:newValue ? 'Added to favorites' : 'Removed from favorites'});
      }.bind(this),
      $finally : function() {
        this._unlockViewer();
      }.bind(this)
    });
  },
  $click$inboxButton : function() {
    if (this._viewerLocked) {return}
    this._lockViewer();
    var newValue = !this._currentArticle.inbox;
    hui.cls.set(hui.get('reader_viewer_inbox'),'reader_viewer_action_selected',newValue);
    hui.ui.request({
      url : '/changeInboxStatus',
      parameters : {id:this._currentArticle.id,inbox:newValue},
      $success : function() {
        this._currentArticle.inbox = newValue;
        hui.ui.get('listSource').refresh();
        hui.ui.msg.success({text:newValue ? 'Added to inbox' : 'Removed from inbox'});
      }.bind(this),
      $finally : function() {
        this._unlockViewer();
      }.bind(this)
    });
  },

  $click$inspectButton : function() {
    oo.Inspector.inspect({id:this._currentArticle.id})
  },
	
	$click$infoButton : function() {
		if (!this._currentArticle) {
			return;
		}
		addressInfoController.edit(this._currentArticle);
	},

  $click$quoteButton : function() {
		if (hui.isBlank(this.text)) {
			return;
		}
    var parameters = {
      id : this._currentArticle.id,
      text : this.text
    }
    hui.ui.request({
      url : '/addQuote',
      parameters : parameters,
      $success : function() {
        this.reload();
      }.bind(this)
    })
  },
  $valueChanged$readerViewerView : function(value) {

    this.viewerContent.className = 'reader_viewer_content reader_viewer_content_'+value;
    if (!this.frameSet && value === 'web') {
      this.viewerFrame.src = this._currentArticle.url;
      this.frameSet = true;
    }
  },

  // Words...

  $found$wordFinder : function(obj) {
    var p = {
      internetAddressId : this._viewedItem.addressId,
      wordId : obj.id
    }
    hui.ui.request({
      url : '/addWord',
      parameters : p,
      $success : function() {
        this._reloadInfo();
        hui.ui.get('tagSource').refresh();
        hui.ui.get('listSource').refresh();
      }.bind(this)
    })
  },

  _activeWordId : null,

  _clickWord : function(node) {
    var panel = hui.ui.get('wordPanel'),
      rendering = hui.ui.get('wordRendering');
    rendering.setHTML('<div>Loading: '+node.getAttribute('data')+'</div>');
    panel.show({target:node,modal:true});
    this._activeWordId = node.getAttribute('data');
    hui.ui.request({
      url : '/getWordInfo',
      parameters : {id:this._activeWordId},
      $object : function(obj) {
        rendering.setHTML(obj.rendering);
      }
    })
  },
  $click$removeWord : function() {
    hui.ui.get('wordPanel').hide();
    hui.ui.request({
      url : '/removeWord',
      message : {start:'Removing',success:'Removed'},
      parameters : {
        wordId : this._activeWordId,
        internetAddressId : this._currentArticle.id
      },
      $success : function(obj) {
        this._reloadInfo();
        hui.ui.get('tagSource').refresh();
        hui.ui.get('listSource').refresh();
      }.bind(this)
    })
  },
}
hui.ui.listen(readerViewer);