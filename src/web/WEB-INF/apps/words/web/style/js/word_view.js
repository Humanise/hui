var wordView = {
	language : null,
	text : null,
	
	$ready : function() {
		//this.addRelation();
	},
	
	addRelation : function(options) {
		this.wordInfo = options;
		if (!this._finder) {
			this._finder = hui.ui.Finder.create({
				name : 'relatedWordFinder',
				title : {en:'Find word',da:'Find ord'},
				list : {source : new hui.ui.Source({dwr:'AppWords.searchWords'}),pageParameter:'page'},
				search : {parameter:'text'}
			});
		}
		this._finder.show();
	},
	
	$select$relatedWordFinder : function(word) {
		var button = hui.ui.get('relate'+this.wordInfo.id),
			panel = hui.ui.get('relationKindPanel');

			hui.listenOnce(hui.get.firstByClass(panel.element,'panel_body'),'click',function(e) {
				e = hui.event(e);
				var a = e.findByTag('a');
				if (a) {
					panel.hide();
					this._createRelation(this.wordInfo.id,a.getAttribute('rel'),word.id);
				}
			}.bind(this))
		this._finder.hide();
		window.setTimeout(function() {
			panel.position(button);
			panel.show();
			
		},1000)
		
	},
	_createRelation : function(from,kind,to) {
		AppWords.relateWords(from,kind,to,{
			callback : function() {
				oo.update({id:'word',
					onComplete:function() {
						hui.ui.showMessage({text:'The relation is created',icon:'common/success',duration:2000});
					}
				});
			},
			errorHandler : function() {
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
		return;
		
		AppWords.getDiagram( this.text, {
			callback : function(data) {
				diagram.$objectsLoaded(data);
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to get diagram',icon:'common/warning',duration:2000});
			}
		});
	},

	$click$registerWord : function() {
		hui.ui.showMessage({text:'Registering word',busy:true});
		AppWords.createWord( oo.language, null, this.text, {
			callback : function() {
				oo.update({id:'word', onComplete:function() {
					hui.ui.showMessage({text:'The word is now registered',icon:'common/success',duration:2000});
				}});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to store word',icon:'common/warning',duration:2000});
			}
		});
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
		
		AppWords.createWord(values.language,values.category,this.text,{
			callback:function() {
				oo.update({id:'word',
					onComplete:function() {
						hui.ui.showMessage({text:{en:'The variant has been added',da:'Varianten er tilføjet'},icon:'common/success',duration:2000});
					}
				});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:{en:'Unable to add variant',da:'Kunne ikke tilføje variant'},icon:'common/warning',duration:2000});
			}
		})
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
				this._clickLanguage(a.getAttribute('rel'));
			}
		}.bind(this))
		panel.position(info.element);
		panel.show();
	},
	_clickLanguage : function(language) {
		AppWords.changeLanguage( this.wordInfo.id, language, {
			callback : function() {
				oo.update({id:'word',
					onComplete:function() {
						hui.ui.showMessage({text:'The language is now changed',icon:'common/success',duration:2000});
					}
				});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to change language',icon:'common/warning',duration:2000});
			}
		});
	},
	
	categorizeWord : function(info) {
		hui.stop(info.event)
		this.wordInfo = info;
		var panel = hui.ui.get('wordEditor');
		hui.listenOnce(hui.get.firstByClass(panel.element,'panel_body'),'click',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				panel.hide();
				this._clickCategory(a.getAttribute('rel'));
			}
		}.bind(this))
		panel.position(info.element);
		panel.show();
	},
	_clickCategory : function(category) {
		AppWords.categorizeWord( this.wordInfo.id, category, {
			callback : function() {
				oo.update({id:'word', onComplete:function() {
					hui.ui.showMessage({text:'The word is now categorized',icon:'common/success',duration:2000});
				}});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to categorize word',icon:'common/warning',duration:2000});
			}
		});
	},
	changeWord : function(info) {
		hui.stop(info.event)
		this.wordInfo = info;
		var panel = hui.ui.get('wordEditor');
		hui.listenOnce(hui.get.firstByClass(panel.element,'panel_body'),'click',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				panel.hide();
				this._clickChange(a.getAttribute('rel'));
			}
		}.bind(this))
		panel.position(info.widget || info.element);
		panel.show();
	},
	
	_clickChange : function(category) {
		hui.ui.showMessage({text:{en:'Changing word',da:'Ændrer ord'},busy:true,delay:300});
		AppWords.changeWord( this.wordInfo.id, category, {
			callback : function() {
				oo.update({id:'word', onComplete:function() {
					hui.ui.showMessage({text:{en:'The word is now changed',da:'Ordet er nu ændret'},icon:'common/success',duration:2000});
				}});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to categorize word',icon:'common/warning',duration:2000});
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
				AppWords.deleteWord(
					info.id,
					{
						callback : function() {
							oo.update({id:'word',
								onComplete:function() {
									hui.ui.showMessage({text:{en:'The word is now deleted',da:'Ordet er nu slettet'},icon:'common/success',duration:2000});
								}
							});
						},
						errorHandler : function() {
							hui.ui.showMessage({text:{en:'Unable to delete word',da:'Kunne ikke slettet ord'},icon:'common/warning',duration:2000});
						}
					}
				);
				
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
				AppWords.deleteRelation(
					info.id,
					{
						callback : function() {
							oo.update({id:'word',
								onComplete:function() {
									hui.ui.showMessage({text:{en:'The relation is now deleted',da:'relationen er nu slettet'},icon:'common/success',duration:2000});
								}
							});
						},
						errorHandler : function() {
							hui.ui.showMessage({text:{en:'Unable to delete relation',da:'Kunne ikke slettet relationen'},icon:'common/warning',duration:2000});
						}
					}
				);
				
			}
		})
	}
};

hui.ui.listen(wordView)