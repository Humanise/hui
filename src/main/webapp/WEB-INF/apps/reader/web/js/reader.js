var controller = {
	
	viewer : null,
	viewerVisible : false,
	text : '',
	
	$ready : function() {
		
		this.viewer = hui.get('viewer');
		this.viewerContent = hui.get('viewer_content');
		this.viewerFrame = hui.get('viewer_frame');
		this.viewerSpinner = hui.get('viewer_spinner');
		
		hui.listen(hui.get.firstByClass('reader_layout'),'click',this._click.bind(this));
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
		//this._loadArticle(1590);
		new oo.Segmented({
			name : 'readerViewerView',
			element : hui.get('reader_viewer_view'),
			selectedClass : 'reader_viewer_view_item_selected',
			value : 'formatted'
		});
		this._view();
	},
	
	_view : function() {
		var self = this;
		hui.ui.get('listView').listen({
			$clickItem : function(info) {
				var event = info.event;
				var a = event.findByTag('a');
				if (hui.cls.has(a,'list_item_word')) {
					var id = parseInt(a.getAttribute('data-id'));
					hui.ui.get('tags').selectById(id,event.shiftKey);
				} else if (hui.cls.has(a,'list_item_address_link')) {
					window.open(a.href);
				} else if (info.item) {
					self._loadArticle(info.item);					
				}
			}
		})
	},
	
	_click : function(e) {
		if (!this.viewerVisible) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (hui.cls.has(a,'reader_list_word')) {
				var id = parseInt(a.getAttribute('data-id'));
				hui.ui.get('tags').selectById(id,e.shiftKey);
			}
			return;
		}
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			e.stop();
			if (hui.cls.has(a,'info_tags_add')) {
				hui.ui.get('wordFinder').show();
				hui.ui.get('wordFinderSearch').setValue(this.text);
			}
			if (hui.cls.has(a,'info_word')) {
				this._clickWord(a);
			}
			if (hui.cls.has(a,'info_tag')) {
				this._clickTag(a);
			}
			if (hui.cls.has(a,'reader_viewer_close')) {
				this._hideViewer();
			}
			if (hui.cls.has(a.parentNode,'link')) {
				window.open(a.href)
			}
		} else if (hui.cls.has(e.element,'reader_viewer')) {
			e.stop();
			this._hideViewer();
		}
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
	
	$click$removeButton : function() {
        var url = '/removeInternetAddress';
        //if (obj.kind == 'HtmlPart') {
         //   url = '/service/model/removeEntity';
        //}
		this._hideViewer();
		hui.ui.request({
			url : url,
			parameters : {id:this._currentArticle.id},
			$success : function() {
				hui.ui.get('listView').reset();
				hui.ui.get('tagSource').refresh();
			}.bind(this)
		})
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
				hui.ui.get('listSource').refresh();
				this._loadArticle(info);
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
	
	// Words...
	
	$found$wordFinder : function(obj) {
		var p = {
			internetAddressId : this._currentArticle.id,
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
	
	$click$reindexButton : function() {
		hui.ui.request({
			url : '/reIndex',
			message : {start:'Indexing',success:'Finished'}
		});
	},
    
    // Viewer
	
	_loadArticle : function(object) {
    object = object || {};
		hui.get('viewer_header').innerHTML = '<h1>' + hui.string.escape(object.title) + '</h1>';
		hui.get('viewer_formatted').innerHTML = '';
		hui.get('viewer_text').innerHTML = '';
		hui.get('viewer_info').innerHTML = ''
		this.viewer.style.display = 'block';
		this.viewerVisible = true;
		hui.cls.add(document.body,'reader_modal');
		hui.cls.add(this.viewerSpinner,'oo_spinner_visible');
		var self = this;
		hui.ui.request({
			url : '/loadArticle',
			parameters : {id:object.id},
			$object : function(article) {
				self._drawArticle(article);
			},
			$failure : function() {
				self._hideViewer();
				hui.ui.msg.fail({text:'Sorry!'});
			},
			$finally : function() {
				hui.cls.remove(self.viewerSpinner,'oo_spinner_visible');
			}
		})
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
	
	_hideViewer : function() {
		viewer.style.display='none';
		hui.cls.remove(document.body,'reader_modal');
		this.viewerVisible = false;
		this.viewerFrame.src = "about:blank";
		hui.get('viewer_info').innerHTML = ''
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
    
    $click$quoteButton : function() {
        var parameters = {
            id : this._currentArticle.id,
            text : this.text
        }
		hui.ui.request({
			url : '/addQuote',
			parameters : parameters,
			$object : function(article) {
				this._drawArticle(article);
			}.bind(this)
		})
    },
	$valueChanged$readerViewerView : function(value) {
		
		this.viewerContent.className = 'reader_viewer_content reader_viewer_content_'+value;
		if (!this.frameSet && value === 'web') {
			this.viewerFrame.src = this._currentArticle.url;
			this.frameSet = true;
		}
	}
}

hui.ui.listen(controller);

