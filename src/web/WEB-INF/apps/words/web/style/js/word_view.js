var wordView = {
	language : null,
	text : null,
	
	categories : [
		{key : 'nomen',title : 'Noun', description : 'any abstract or concrete entity'},
		{key : 'pronomen',title : 'Pronoun', description : 'any substitute for a noun or noun phrase'},
		{key : 'adjectivum',title : 'Adjective', description : 'any qualifier of a noun'},
		{key : 'verbum',title : 'Verb', description : 'any action or state of being'},
		{key : 'adverbium',title : 'Adverb', description : 'any qualifier of an adjective, verb, or other adverb'},
		{key : 'praeposition',title : 'Preposition', description : 'any establisher of relation and syntactic context'},
		{key : 'conjunction',title : 'Conjunction', description : 'any syntactic connector'},
		{key : 'interjection',title : 'Interjection', description : 'any emotional greeting (or "exclamation")'}
	],
	
	$added$diagram : function() {
		var diagram = hui.ui.get('diagram');
		AppWords.getDiagram(
			this.text,
			{
				callback : function(data) {
					diagram.$objectsLoaded(data);
					//diagram.play();
				},
				errorHandler : function() {
					hui.ui.showMessage({text:'Unable to get diagram',icon:'common/warning',duration:2000});
				}
			}
		);
		return;
		
		var person = diagram.addBox({
			id : 'person',
			title : 'Person',
			properties : [
				{label:'First name',value:'String'},
				{label:'Middle name',value:'String'},
				{label:'Last name',value:'String'},
				{label:'Initials',value:'String'},
				{label:'Gender',value:'Boolean'}
			]
		});
				
		var email = diagram.addBox({
			id : 'email',
			title : 'E-mail',
			properties : [
				{label:'Address',value:'String'},
				{label:'Context',value:'String'}
			]
		});
				
		var phone = diagram.addBox({
			id : 'phone',
			title : 'Phone number',
			properties : [
				{label:'Address',value:'String'},
				{label:'Context',value:'String'}
			]
		});
				
		diagram.addLine({from:'person',to:'email',label:'Work'});
		diagram.addLine({from:'person',to:'phone',label:'Private'});
		diagram.play();
	},

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
	_buildCategories : function() {
		var body = hui.build('div',{
			className : 'panel_body',
			html:'<h2>Lexical Categories</h2>'
		});
		var ul = hui.build('ul',{'class':'selection',parent:body});
		for (var i=0; i < this.categories.length; i++) {
			var cat = this.categories[i]
			hui.build('li',{parent:ul,html:'<li><a rel="'+cat.key+'"><strong>'+cat.title+'</strong>: '+cat.description+'</a></li>'})
		};
		return body;
	},
	_buildCategoryOptions : function() {
		var options = [];
		for (var i=0; i < this.categories.length; i++) {
			var cat = this.categories[i]
			options.push({text:cat.title,value:cat.key});
		};
		return options;
	},
	$click$addVariant : function(button) {
		if (!this._variantPanel) {
			var p = this._variantPanel = hui.ui.BoundPanel.create({title:'Add variant',width:200,hideOnClick:true});
			var form = this._variantForm = hui.ui.Formula.create();
			var group = form.buildGroup({above:false},[
				{type:'DropDown',label:'Language',options:{
					key : 'language',
					items : [{text:'English',value:'en'},{text:'Dansk',value:'da'}]
				}},
				{type:'DropDown',label:'Category',options:{
					key : 'category',
					items : this._buildCategoryOptions()
				}}
			])
			p.add(form)
			form.add
			var buttons = group.createButtons();
			buttons.add(hui.ui.Button.create({text:'Add',highlighted:true,submit:true}));
			form.listen({
				$submit : function() {
					this._sendAddVariant(form.getValues());
				}.bind(this)
			})
		}
		this._variantPanel.position(button);
		this._variantPanel.show();
		this._variantForm.focus();
	},
	_sendAddVariant : function(values) {
		this._variantForm.reset();
		this._variantPanel.hide();
		hui.ui.showMessage({text:'Adding variant...',busy:true,delay:300});
		AppWords.createWord(values.language,values.category,this.text,{
			callback:function() {
				oo.update({id:'word',
					onComplete:function() {
						hui.ui.showMessage({text:'The variant has been added',icon:'common/success',duration:2000});
					}
				});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to add variant',icon:'common/warning',duration:2000});
			}
		})
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
			var p = this._categorizePanel = hui.ui.BoundPanel.create({title:'Categorize',width:200,hideOnClick:true});
			var body = this._buildCategories();
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
	},
	changeWord : function(info) {
		this.wordInfo = info;
		var panel = this._buildChangePanel();
		panel.position(info.widget);
		panel.show();
	},
	_buildChangePanel : function() {
		if (!this._changePanel) {
			var p = this._changePanel = hui.ui.BoundPanel.create({title:'Change',width:300,hideOnClick:true});
			var body = this._buildCategories();
			p.add(body);
			hui.listen(body,'click',function(e) {
				e = hui.event(e);
				var a = e.findByTag('a');
				if (a) {
					p.hide();
					this._clickChange(a.getAttribute('rel'));
				}
			}.bind(this))
		}
		return this._changePanel;
	},
	_clickChange : function(category) {
		AppWords.changeWord(
			this.wordInfo.id,
			category,
			{
				callback : function() {
					oo.update({id:'word',
						onComplete:function() {
							hui.ui.showMessage({text:'The word is now changed',icon:'common/success',duration:2000});
						}
					});
				},
				errorHandler : function() {
					hui.ui.showMessage({text:'Unable to categorize word',icon:'common/warning',duration:2000});
				}
			}
		);
	},
	
	deleteWord : function(info) {
		hui.ui.confirmOverlay({
			widget:hui.ui.get('delete'+info.id),
			text:'Are you sure?',
			okText:'Yes, delete',
			cancelText:'No',
			$ok : function() {
				hui.ui.showMessage({text:'Deleting word',busy:true,delay:300});
				AppWords.deleteWord(
					info.id,
					{
						callback : function() {
							oo.update({id:'word',
								onComplete:function() {
									hui.ui.showMessage({text:'The word is now deleted',icon:'common/success',duration:2000});
								}
							});
						},
						errorHandler : function() {
							hui.ui.showMessage({text:'Unable to delete word',icon:'common/warning',duration:2000});
						}
					}
				);
				
			}
		})
	}
};

hui.ui.listen(wordView)