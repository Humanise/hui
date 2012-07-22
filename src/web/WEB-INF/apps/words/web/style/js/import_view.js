var importView = {
	lookupWord : function(word,node) {
		this.word = word;
		this._lowlight();
		this.latestWordNode = node;
		if (!this._wordPanel) {
			this._wordPanel = hui.ui.BoundPanel.create({width:200});
			this._wordPanelContent = hui.build('div');
			var form = this.wordPanelForm = hui.ui.Formula.create();
			var group = form.buildGroup(null,[
				{type:'DropDown',options:{label:'Language',key:'language',value:'en',items:[
					{value:'en',label:'English'},
					{value:'da',label:'Danish'}
				]}},
				{type:'DropDown',options:{label:'Category',key:'category',value:null,items:[
					{value:null,label:'Unknown'},
					{value:'nomen',label:'Noun'},
					{value:'pronomen',label:'Pronoun'},
					{value:'adjectivum',label:'Adjective'},
					{value:'verbum',label:'Verb'},
					{value:'adverbium',label:'Adverb'},
					{value:'praeposition',label:'Preposition'},
					{value:'conjunction',label:'Conjunction'},
					{value:'interjection',label:'Interjection'}
				]}}
			]);
			var buttons = group.createButtons();
			buttons.add(hui.ui.Button.create({text:'Register',highlighted:true,name:'register'}));
			this._wordPanel.add(this._wordPanelContent);
			this._wordPanel.add(form);
		}
		hui.animate(node,'font-size','32px',500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			hui.cls.add(node,'highlighted');
			this._wordPanelContent.innerHTML = '<p style="margin: 0; text-align: center; padding: 2px 0;">'+word+'</p>';
			this._wordPanel.position(node);
			this._wordPanel.show();
			hui.ui.get('register').focus()
		}.bind(this)})
	},
	_lowlight : function() {
		if (this.latestWordNode) {
			hui.cls.remove(this.latestWordNode,'highlighted');
			hui.animate(this.latestWordNode,'font-size','16px',500,{ease:hui.ease.slowFastSlow});
		}
	},
	$click$register : function() {
		
		var values = this.wordPanelForm.getValues();
		AppWords.createWord(values.language,values.category,this.word,{
			callback : function() {
				this._lowlight();
				this._wordPanel.hide();
				this.latestWordNode.className='known';
				this.latestWordNode.focus();
			}.bind(this),
			errorHandler : function(msg,e) {
				ui.showMessage({text:msg,duration:2000,icon:'common/warning'});
			}
		})
	}
};

hui.ui.listen(importView)
