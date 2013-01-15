var wordView = {
	language : null,
	text : null,
	
	$ready : function() {
		//this.addRelation();
		//hui.log('showing window')
		//hui.ui.get('wordFinder').show();
	},
	
	addRelation : function(options) {
		this.wordInfo = options;
		hui.ui.get('wordFinder').show(this.$select$oo_wordfinder.bind(this))
		return;
		oo.WordGetter.show();
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
			$success : function(id) {
				oo.update({ id : 'word', $success : function() {
					hui.ui.showMessage({text:'The relation is created',icon:'common/success',duration:2000});
				}});
			},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to create relation',icon:'common/warning',duration:2000});
			}
		});		
	},
	
	$added$diagram : function() {
		var diagram = hui.ui.get('diagram');
		
		hui.ui.request({
			url : oo.appContext+'/diagram.json',
			parameters : {word:this.text},
			$object : function(data) {
				diagram.$objectsLoaded(data);				
			}
		})
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
			parameters : { language : values.language, category : values.category, text : this.text },
			$success : function(id) {
				oo.update({ id : 'word', $success : function() {
					hui.ui.showMessage({text:{en:'The variant has been added',da:'Varianten er tilføjet'},icon:'common/success',duration:2000});
				}});
			},
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
			$success : function(id) {
				oo.update({ id : 'word', $success : function() {
					hui.ui.showMessage({text:'The language is now changed',icon:'common/success',duration:2000});
				}});
			},
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
				oo.update({ id : 'word', $success : function() {
					hui.ui.showMessage({text:'The category is now changed',icon:'common/success',duration:2000});
				}});
			},
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
						oo.update({ id : 'word', $success : function() {
							hui.ui.showMessage({text:{en:'The word is now deleted',da:'Ordet er nu slettet'},icon:'common/success',duration:2000});
						}});
					},
					$failure : function() {
						hui.ui.showMessage({text:{en:'Unable to delete word',da:'Kunne ikke slettet ord'},icon:'common/warning',duration:2000});
					}
				});				
			}
		})
	},
	
	deleteRelation : function(info) {
		hui.ui.confirmOverlay({
			element : info.element,
			text : {en:'Are you sure?', da:'Er du sikker?'},
			okText : {en:'Yes, delete', da:'Ja, slet'},
			cancelText : {en:'No', da:'Nej'},
			$ok : function() {
				hui.ui.showMessage({text:{en:'Deleting relation',da:'Sletter relation'},busy:true,delay:300});

				hui.ui.request({
					url : oo.appContext+'/deleteRelation',
					parameters : { relationId : info.id },
					$success : function(id) {
						oo.update({ id : 'word', $success : function() {
							hui.ui.showMessage({text:{en:'The relation is now deleted',da:'relationen er nu slettet'},icon:'common/success',duration:2000});
						}});
					},
					$failure : function() {
						hui.ui.showMessage({text:{en:'Unable to delete relation',da:'Kunne ikke slettet relationen'},icon:'common/warning',duration:2000});
					}
				});				
			}
		})
	}
};

hui.ui.listen(wordView)