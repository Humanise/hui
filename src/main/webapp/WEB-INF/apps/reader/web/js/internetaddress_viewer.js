var internetAddressViewer = {

  _viewedItem : null,
  text : '',

  nodes : {
    viewer : '.reader_viewer',
    content : '.reader_viewer_content',
    info : '.reader_viewer_info'
  },

  widgets : {
    selectionPanel : null,
  },
  
  $ready : function() {

    this.nodes = hui.collect(this.nodes);
    
    this.viewerFrame = hui.get('viewer_frame');
    this.viewerSpinner = hui.get('viewer_spinner');
    
    this.widgets.selectionPanel = hui.ui.get('selectionPanel');

    hui.listen(this.nodes.viewer,'click',this._click.bind(this));
    hui.listen(this.nodes.info,'click',this._clickInfo.bind(this));
    this._listenForText();
  },
  
  _listenForText : function() {
    var textListener = function() {
      var selection = document.getSelection();
      this.text = '';
      var panel = this.widgets.selectionPanel;
      if (selection.type == 'Range' && selection.rangeCount == 1) {
        var range = selection.getRangeAt(0);
        var common = range.commonAncestorContainer;
        if (hui.dom.isDescendantOrSelf(common,this.nodes.content)) {
          this.text = hui.selection.getText();
          var rects = range.getClientRects();
          if (rects.length > 0) {
            panel.position({
              rect : rects[0],
              position : 'vertical'
            });
            panel.show();
            return;
          }
        }
      }
      panel.hide();
    }.bind(this);
    hui.listen(document.body,'mouseup',textListener);
    hui.listen(window,'keyup',textListener);
  },
  
  _click : function(e) {

    e = hui.event(e);
    var a = e.findByTag('a');
    if (a) {
      e.stop();
      if (hui.cls.has(a,'reader_viewer_quote_icon')) {
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
  
  $statementChanged$statementEditor : function() {
    this.reload();
  },

  $valueChanged$extractionAlgorithm : function() {
    this.reload();
  },
  $valueChanged$highlightRendering : function() {
    this.reload();
  },
	
	reload : function() {
    if (this._viewedItem) {
  		this.show({
        id : this._viewedItem.id,
        reload : true
      });
    }
	},

  show: function(object) {
    if (!object || !object.id) {
      return;
    }
    if (this._viewedItem) {
      if (this._viewedItem.id == object.id) {
        if (object.statementId) {
          this._highlightStatement(object.statementId);
          return;
        }
      } else {
        hui.get('viewer_formatted').innerHTML = '';
        hui.get('viewer_text').innerHTML = '';
        hui.get('viewer_header').innerHTML = '';
        this.nodes.info.innerHTML = '';
        this.nodes.content.scrollTop = 0;
      }
    }
		addressInfoController.clear();
    this._viewedItem = {id : object.id};
    this._lockViewer();
    hui.get('viewer_header').innerHTML = '<h1>' + hui.string.escape(object.title || 'Loading...') + '</h1>';
    this.nodes.viewer.style.display = 'block';
    this.viewerVisible = true;
    hui.cls.add(this.viewerSpinner, 'oo_spinner_visible');
    var parameters = {
      id : object.id,
      algorithm : hui.ui.get('extractionAlgorithm').getValue(),
      highlight : hui.ui.get('highlightRendering').getValue()
    };

    var self = this;
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
        self.hide();
        hui.ui.msg.fail({
          text: 'Sorry!'
        });
      },
      $finally: function() {
        self._unlockViewer();
        hui.cls.remove(self.viewerSpinner, 'oo_spinner_visible');
      }
    });
  },

  _markInbox : function(checked) {
    var link = hui.ui.get('inboxButton');
    hui.cls.set(link.element,'reader_viewer_action_selected',checked);
    hui.cls.set(hui.get.firstByClass(link.element,'oo_icon'),'oo_icon-selected',checked);
  },

  _markFavorite : function(checked) {
    var link = hui.ui.get('favoriteButton');
    hui.cls.set(link.element,'reader_viewer_action_selected',checked);
    hui.cls.set(hui.get.firstByClass(link.element,'oo_icon'),'oo_icon-selected',checked);
  },

  _drawArticle : function(article) {
    this._currentArticle = article;
    hui.get('viewer_formatted').innerHTML = article.formatted;
    hui.get('viewer_text').innerHTML = article.text;
    hui.get('viewer_header').innerHTML = article.header;
    this.nodes.info.innerHTML = article.info;
    this._markInbox(article.inbox);
    this._markFavorite(article.favorite);
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
    var info = this.nodes.info;
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
  
  $click$closeAddress : function() {
    this.hide();
  },
  
  $addressWillBeDeleted$addressEditor : function() {
    this._lockViewer();
  },

	$addressWasDeleted$addressEditor : function() {
    this.hide();
  },
	
	$addressChanged$addressEditor : function() {
		this.reload();
	},

  hide : function() {
    this._unlockViewer();
    viewer.style.display='none';
    this.viewerVisible = false;
    this.viewerFrame.src = "about:blank";
    hui.get('viewer_info').innerHTML = ''
    this._viewedItem = null;
		addressInfoController.clear();
  },
  _lockViewer : function() {
    this._locked = true;
    hui.cls.add(this.nodes.viewer,'reader_viewer_locked');
  },
  _unlockViewer : function() {
    this._locked = false;
    hui.cls.remove(this.nodes.viewer,'reader_viewer_locked');
  },
  $click$favoriteButton : function() {
    if (this._locked) {return}
    this._lockViewer();
    var newValue = !this._currentArticle.favorite;
    this._markFavorite(newValue);
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
    if (this._locked) {return}
    this._lockViewer();
    var newValue = !this._currentArticle.inbox;
    this._markInbox(newValue);
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
  
  $click$quoteFromSelection : function() {
		if (hui.isBlank(this.text)) {
			return;
		}
    var parameters = {
      id : this._currentArticle.id,
      text : this.text
    }
    this._lockViewer();
    var panel = this.widgets.selectionPanel;
    hui.ui.request({
      url : '/addQuote',
      parameters : parameters,
      $success : function() {
        this.reload();
      }.bind(this),
      $finally : function() {
        panel.hide();
      }.bind(this)
    })    
  },
  $valueChanged$readerViewerView : function(value) {

    this.nodes.content.className = 'reader_viewer_content reader_viewer_content_'+value;
    if (!this.frameSet && value === 'web') {
      this.viewerFrame.src = this._currentArticle.url;
      this.frameSet = true;
    }
  },

  // Words...

  $found$wordFinder : function(obj) {
    var p = {
      internetAddressId : this._viewedItem.id,
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
hui.ui.listen(internetAddressViewer);

var addressSelection = {
  _check : function() {
		var selection = window.getSelection();
		if (selection.rangeCount<1) {return}
  }
}
hui.ui.listen(addressSelection);