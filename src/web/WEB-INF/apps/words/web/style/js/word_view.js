var wordView = {
	language : null,
	text : null,

	$click$registerWord : function() {
		hui.ui.showMessage({text:'Registering word',busy:true});
		AppWords.createWord(
			oo.language,
			null,
			this.text,
			{
				callback : function() {
					oo.update({id:'word',
						onComplete:function() {
							hui.ui.showMessage({text:'The word is now registered',icon:'common/success',duration:2000});
						}
					});
				},
				errorHandler : function() {
					hui.ui.showMessage({text:'Unable to store word',icon:'common/warning',duration:2000});
				}
			}
		);
	},
	categorizeWord : function(info) {
		this.wordInfo = info;
		var panel = this._buildCategorizePanel();
		panel.position(info.widget);
		panel.show();
	},
	_clickCategory : function(category) {
		AppWords.categorizeWord(
			this.wordInfo.id,
			category,
			{
				callback : function() {
					oo.update({id:'word',
						onComplete:function() {
							hui.ui.showMessage({text:'The word is now categorized',icon:'common/success',duration:2000});
						}
					});
				},
				errorHandler : function() {
					hui.ui.showMessage({text:'Unable to categorize word',icon:'common/warning',duration:2000});
				}
			}
		);
	},
	_buildCategorizePanel : function() {
		if (!this._categorizePanel) {
			var p = this._categorizePanel = hui.ui.BoundPanel.create({title:'Categorize',width:'200px'});
			var body = hui.build('div',{
				className : 'panel_body',
				html:'<h2>Lexical Categories</h2>'+
					'<ul class="selection">'+
					'<li><a rel="nomen"><strong>Noun</strong>: any abstract or concrete entity</a></li>'+
					'<li><a rel="pronomen"><strong>Pronoun</strong>: any substitute for a noun or noun phrase</a></li>'+
					'<li><a rel="adjectivum"><strong>Adjective</strong>: any qualifier of a noun</a></li>'+
					'<li><a rel="verbum"><strong>Verb</strong>: any action or state of being</a></li>'+
					'<li><a rel="adverbium"><strong>Adverb</strong>: any qualifier of an adjective, verb, or other adverb</a></li>'+
					'<li><a rel="praeposition"><strong>Preposition</strong>: any establisher of relation and syntactic context</a></li>'+
					'<li><a rel="conjunction"><strong>Conjunction</strong>: any syntactic connector</a></li>'+
					'<li><a rel="interjection"><strong>Interjection</strong>: any emotional greeting (or "exclamation")</a></li>'+
				'</ul>'
			});
			p.add(body);
			hui.listen(body,'click',function(e) {
				e = hui.event(e);
				var a = e.findByTag('a');
				if (a) {
					p.hide();
					this._clickCategory(a.getAttribute('rel'));
				}
			}.bind(this))
		}
		return this._categorizePanel;
	}
};

hui.ui.listen(wordView)