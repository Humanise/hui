var controller = {
	
	viewer : null,
	viewerVisible : false,
	text : '',
	
	$ready : function() {
		
		this.viewer = hui.get('viewer');
		this.viewerContent = hui.get('viewer_content');
		this.viewerFrame = hui.get('viewer_frame');
		
		hui.listen(document.body,'click',this._click.bind(this));
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
			if (hui.cls.has(a,'add')) {
				hui.ui.get('wordFinder').show();
				hui.ui.get('wordFinderSearch').setValue(this.text);
			}
			if (hui.cls.has(a,'word')) {
				this._clickWord(a);
			}
			if (hui.cls.has(a,'tag')) {
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
		hui.ui.get('list').resetState();
	},
	
	$valueChanged$tags : function() {
		hui.ui.get('list').resetState();
	},
	
	$valueChanged$context : function() {
		hui.ui.get('list').resetState();
	},
	
	$click$removeButton : function() {
		var obj = hui.ui.get('list').getFirstSelection();
        var url = '/removeInternetAddress';
        if (obj.kind == 'HtmlPart') {
            url = '/service/model/removeEntity';
        }
		hui.ui.request({
			url : url,
			parameters : {id:obj.id},
			$success : function() {
				hui.ui.get('tagSource').refresh();
				hui.ui.get('listSource').refresh();
			}
		})
	},
	
	// List...
	
	_currentArticle : null,
	
	$clickIcon$list : function(info) {
		hui.log(info);
		if (info.data == 'graph') {
			oo.Inspector.inspect({id:info.row.id})
		} else {
			window.open(info.data);			
		}
	},
	$open$list : function(info) {
		this._loadArticle(info.id);
	},
		
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
				this._loadArticle(info.id);
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
	
	_loadArticle : function(id) {
		hui.ui.showMessage({text:'Loading...',busy:true});
		hui.get('info').innerHTML = '<h1>Loading...</h1>';
		hui.get('viewer_formatted').innerHTML = '';
		hui.get('viewer_text').innerHTML = '';
		this.viewer.style.display = 'block';
		this.viewerVisible = true;
		hui.cls.add(document.body,'reader_modal');
		hui.ui.request({
			url : '/loadArticle',
			parameters : {id:id},
			$object : function(article) {
				hui.ui.hideMessage();
				this._drawArticle(article);
			}.bind(this),
			$failure : function() {
				this._hideViewer();
				hui.ui.msg.fail({text:'Sorry!'});
			}.bind(this)
		})
	},
	
	_drawArticle : function(article) {
		this._currentArticle = article;
		hui.get('viewer_formatted').innerHTML = article.rendering;
		hui.get('viewer_text').innerHTML = article.text;
		hui.get('info').innerHTML = article.info;
		hui.cls.set(hui.get('reader_viewer_inbox'),'reader_viewer_action_selected',article.inbox);
		hui.cls.set(hui.get('reader_viewer_favorite'),'reader_viewer_action_selected',article.favorite);
		var view = hui.ui.get('readerViewerView').getValue();
		if (view === 'web') {
			this.viewerFrame.src = article.url;
		}
		this.frameSet = view === 'web';
	},
	
	_reloadInfo : function() {
		var info = hui.get('info');
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

oo.Segmented = function(options) {
	this.options = hui.override({selectedClass:'oo_segmented_item_selected'},options);
	this.name = options.name;
	this.element = hui.get(options.element);
	this.current = hui.get.firstByClass(this.element,this.options.selectedClass);
	this.value = options.value || (this.current ? this.current.getAttribute('data-value') : null);
	hui.ui.extend(this);
	this._attach();
}

oo.Segmented.prototype = {
	_attach : function() {
		hui.listen(this.element,'click',this._click.bind(this));
	},
	_click : function(e) {
		e = hui.event(e);
		e.stop();
		var a = e.findByTag('a');
		if (a) {
			this._change(a);
		}
	},
	_change : function(node) {
		if (this.current) {
			hui.cls.remove(this.current,this.options.selectedClass);
		}
		this.value = node.getAttribute('data-value');
		hui.cls.add(node,this.options.selectedClass);
		this.fireValueChange();
		this.current = node;
	},
	getValue : function() {
		return this.value;
	}
}