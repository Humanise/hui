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
				this._loadArticle(this._currentArticle.id);
			}.bind(this)
		})
	},
	_clickWord : function(node) {
		if (!this._wordPanel) {
			this._wordPanel = hui.ui.BoundPanel.create({variant:'light',modal:true});
		}
		this._wordPanel.add(hui.build('div',{style:'height:200px;width:200px; font-size: 12px;',text:node.getAttribute('data')}));
		this._wordPanel.show({target:node,modal:true});
	}
}

hui.ui.listen(controller);