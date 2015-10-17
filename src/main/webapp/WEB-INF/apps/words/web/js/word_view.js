var wordView = window.wordView = {
	language : null,
	text : undefined,
	activeRelation : null,
	activeRelationUrl : null,
	
	$ready : function() {
		this._attach();
		var id = hui.location.getHash();
		if (id!==null) {
			var node = hui.get('word-'+id);
			if (node) {
				hui.cls.add(node,'words_word_variant_highlighted')
			}
		}
	},
  
  getText : function() {
    if (this.text == undefined) {
      this.text = hui.get.firstByClass(document.body,'words_word').getAttribute('data-text');
    }
    return this.text;
  },

	_attach : function() {
		hui.listen('word','click',function(e) {
			e = hui.event(e);
			var relation = e.findByClass('words_word_relation');
			if (relation) {
				var panel = hui.ui.get('relationInfoPanel');
				if (panel) {
					e.stop();
					this.activeRelationUrl = relation.href;
					hui.ui.request({
						url : oo.appContext+'/getRelationInfo',
						parameters : {
							relationId : relation.getAttribute('data-relation'),
							wordId : relation.getAttribute('data-word'),
							language : oo.language
						},
						$object : function(obj) {
							this.activeRelation = obj;
							var info = hui.build('div',{'class':'word_word_relation_info',html:obj.rendering});
							hui.ui.get('relationFragment').setContent(info);
							panel.position(relation);
							panel.show();
						}.bind(this)
					});
				}
			}
			var more = e.findByClass('words_word_relations_showmore');
			if (more) {
				hui.cls.toggle(more.parentNode,'words_word_relations_reveal');
			}
		}.bind(this));
	},
	
	_update : function(options) {
		oo.update({ id : 'word', $success : function() {
			hui.ui.showMessage({text : options.text, icon : 'common/success', duration : 2000});
			this._attach();
		}.bind(this)});
	},
		
	$click$visitRelationButton : function() {
		document.location = this.activeRelationUrl;
	},
	$click$removeRelationButton : function(button) {
		var relationId = this.activeRelation.id;
		hui.ui.confirmOverlay({
			widget : button,
			text : {en:'Are you sure?', da:'Er du sikker?'},
			okText : {en:'Yes, delete', da:'Ja, slet'},
			cancelText : {en:'No', da:'Nej'},
			$ok : function() {
				hui.ui.showMessage({text:{en:'Deleting relation',da:'Sletter relation'},busy:true,delay:300});

				hui.ui.request({
					url : oo.appContext+'/deleteRelation',
					parameters : { relationId : relationId },
					$success : function(id) {
						this._update({en:'The relation is now deleted',da:'relationen er nu slettet'});
					}.bind(this),
					$failure : function() {
						hui.ui.showMessage({text:{en:'Unable to delete relation',da:'Kunne ikke slettet relationen'},icon:'common/warning',duration:2000});
					}
				});				
			}.bind(this)
		})
	},
	
	addRelation : function(options) {
		this.wordInfo = options;
		oo.WordFinder.get().show(this.$select$oo_wordfinder.bind(this));
	},
	
	$click$toggleExpanded : function() {
		hui.cls.toggle('word','words_word_expanded')
	},
		
	$select$oo_wordfinder : function(word) {
		var button = hui.ui.get('relate'+this.wordInfo.id),
			panel = hui.ui.get('relationKindPanel');
		
		this.newRelatedWord = word;
		panel.position(button);
		panel.show();
	},
	selectRelationKind : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			hui.ui.get('relationKindPanel').hide();
			var info = hui.string.fromJSON(a.getAttribute('rel'));
			if (info.reverse) {
				this._createRelation(this.newRelatedWord.id,info.kind,this.wordInfo.id);
			} else {
				this._createRelation(this.wordInfo.id,info.kind,this.newRelatedWord.id);
			}
		}
		
	},
	
	_createRelation : function(from,kind,to) {
		hui.ui.showMessage({text:{en:'Adding relation...',da:'Tilføjer relation...'},busy:true,delay:300});
		hui.ui.request({
			url : oo.appContext+'/relateWords',
			parameters : { parentId : from, kind : kind, childId : to },
			$success : function() {
				this._update({text:'The relation is created'});
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Unable to create relation',icon:'common/warning',duration:2000});
			}
		});		
	},
	
	$added$diagram : function() {
		var diagram = hui.ui.get('diagram');
		hui.ui.request({
			url : oo.appContext+'/diagram.json',
			parameters : {word:this.getText()},
			$object : function(data) {
				diagram.$objectsLoaded(data);				
			}
		})
	},
	$open$diagram : function(node) {
		hui.log(node);
		if (node.data) {
			if (node.data.type=='Item/Entity/Word') {
				document.location = node.data.name+'.html';
			}
		}
	},
	
	$click$addVariant : function(button) {
		var panel = hui.ui.get('addVariantPanel'),
			form = hui.ui.get('addVariantForm');
		
		panel.position(button);
		panel.show();
		form.focus();
	},
	
	$click$addVariantButton : function(values) {
		var panel = hui.ui.get('addVariantPanel'),
			form = hui.ui.get('addVariantForm'),
			values = form.getValues();
		
		form.reset();
		panel.hide();
		
		hui.ui.showMessage({text:{en:'Adding variant...',da:'Tilføjer variant...'},busy:true,delay:300});
		
		hui.ui.request({
			url : oo.appContext+'/createWord',
			parameters : {
        language : values.language,
        category : values.category, 
        text : this.getText()
      },
			$success : function(id) {
				this._update({text:{en:'The variant has been added',da:'Varianten er tilføjet'}});
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:{en:'Unable to add variant',da:'Kunne ikke tilføje variant'},icon:'common/warning',duration:2000});
			}
		});
	},
	
	changeLanguage : function(info) {
		hui.stop(info.event)
		this.wordInfo = info;
		var panel = hui.ui.get('languagePanel');
		hui.listenOnce(hui.get.firstByClass(panel.element,'panel_body'),'click',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				panel.hide();
				this._changeLanguage(a.getAttribute('rel'));
			}
		}.bind(this))
		panel.position(info.element);
		panel.show();
	},
	_changeLanguage : function(language) {
		hui.ui.showMessage({text:'Changing language...',busy:true});
		hui.ui.request({
			url : oo.appContext+'/changeLanguage',
			parameters : { wordId : this.wordInfo.id , language : language },
			$success : function() {
				this._update({text:'The language is now changed'});
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Unable to change language',duration:2000});
			}
		});
	},
	
	changeCategory : function(info) {
		hui.stop(info.event)
		this.wordInfo = info;
		var panel = hui.ui.get('wordEditor');
		hui.listenOnce(hui.get.firstByClass(panel.element,'panel_body'),'click',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				panel.hide();
				this._changeCategory(a.getAttribute('rel'));
			}
		}.bind(this))
		panel.position(info.widget || info.element);
		panel.show();
	},
	_changeCategory : function(category) {
		hui.ui.showMessage({text:'Changing category...',busy:true});
		hui.ui.request({
			url : oo.appContext+'/changeCategory',
			parameters : { wordId : this.wordInfo.id , category : category },
			$success : function(id) {
				this._update({text:'The category is now changed'});
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'Unable to change category',duration:2000});
			}
		});
	},
	
	deleteWord : function(info) {
		hui.ui.confirmOverlay({
			widget : hui.ui.get('delete'+info.id),
			text : {en:'Are you sure?', da:'Er du sikker?'},
			okText : {en:'Yes, delete', da:'Ja, slet'},
			cancelText : {en:'No', da:'Nej'},
			$ok : function() {
				hui.ui.showMessage({text:{en:'Deleting word',da:'Sletter ord'},busy:true,delay:300});
				hui.ui.request({
					url : oo.appContext+'/deleteWord',
					parameters : { wordId : info.id },
					$success : function(id) {
						this._update({text:{en:'The word is now deleted',da:'Ordet er nu slettet'}});
					}.bind(this),
					$failure : function() {
						hui.ui.showMessage({text:{en:'Unable to delete word',da:'Kunne ikke slettet ord'},icon:'common/warning',duration:2000});
					}
				});				
			}.bind(this)
		})
	}
};

hui.ui.listen(wordView);