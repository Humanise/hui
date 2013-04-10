var controller = {
	
	viewer : null,
	
	$ready : function() {
		
		var viewer = this.viewer = hui.get('viewer');
		hui.listen(viewer,'click',this._click.bind(this));
		this._refreshFeeds();
		this._loadArticle(3141);
	},
	
	_click : function(e) {
		e = hui.event(e);
		e.stop();
		var a = e.findByTag('a');
		if (a) {
			if (hui.cls.has(a,'add')) {
				hui.ui.get('wordFinder').show();
			}
			if (hui.cls.has(a,'word')) {
				this._clickWord(a);
			}
			if (hui.cls.has(a,'tag')) {
				this._clickTag(a);
			}
			if (hui.cls.has(a.parentNode,'link')) {
				window.open(a.href)
			}
		} else {
			viewer.style.display='none';
		}
	},
	
	// List...
	
	_currentArticle : null,
	
	$clickIcon$list : function(info) {
		window.open(info.data);
	},
	$open$list : function(info) {
		this._loadArticle(info.id);
	},
	
	_loadArticle : function(id) {
		hui.ui.showMessage({text:'Loading...',busy:true});
		hui.get('info').innerHTML = '<h1>Loading...</h1>';
		var rendering = hui.get('rendering');
		rendering.innerHTML='';
		this.viewer.style.display='block';
		hui.ui.request({
			url : 'loadArticle',
			parameters : {id:id},
			$object : function(article) {
				hui.ui.hideMessage();
				this._drawArticle(article);
			}.bind(this)
		})
	},
	
	_drawArticle : function(article) {
		this._currentArticle = article;
		var rendering = hui.get('rendering');
		var info = hui.get('info');
		rendering.innerHTML = article.rendering;
		info.innerHTML = article.info;
	},
	
	_reloadInfo : function() {
		var info = hui.get('info');
		info.style.opacity='.5';
		hui.ui.request({
			url : 'loadArticle',
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
	
	// Feeds...
	
	_refreshFeeds : function() {
		hui.ui.request({
			url : 'getFeeds',
			$object : function(feeds) {
				var c = hui.get('feeds');
				hui.dom.clear(c);
				for (var i=0; i < feeds.length; i++) {
					hui.build('li',{text:feeds[i].title,parent:c});
				};
			}
		})
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
			url : 'addFeed',
			parameters : {url:url},
			$success : function() {
				hui.ui.showMessage({text:'Feed added',icon:'common/success',duration:3000});
				this._refreshFeeds();
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Feed could not be added',icon:'common/warning',duration:3000});
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
					url : 'removeTag',
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
			url : 'addWord',
			parameters : p,
			$success : function() {
				this._reloadInfo();
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
			url : 'getWordInfo',
			parameters : {id:this._activeWordId},
			$object : function(obj) {
				rendering.setHTML(obj.rendering);
			}
		})
	},
	$click$removeWord : function() {
		hui.ui.get('wordPanel').hide();
		hui.ui.request({
			url : 'removeWord',
			messages : {start:'Removing',success:'Removed'},
			parameters : {
				wordId : this._activeWordId,
				internetAddressId : this._currentArticle.id
			},
			$success : function(obj) {
				this._reloadInfo();
			}.bind(this)
		})
	}
}

hui.ui.listen(controller);