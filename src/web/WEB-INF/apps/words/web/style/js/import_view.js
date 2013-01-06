var importView = {
	lookupWord : function(node) {
		this.word = hui.dom.getText(node);
		this._lowlight();
		this.latestWordNode = node;
		
		var panel = hui.ui.get('registrationPanel');
		
		
		hui.cls.add(node,'highlighted');
		hui.animate(node,'font-size','32px',500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			panel.position(node);
			panel.show();
			hui.ui.get('registerButton').focus()
		}.bind(this)})
	},
	_lowlight : function() {
		if (this.latestWordNode) {
			hui.cls.remove(this.latestWordNode,'highlighted');
			hui.animate(this.latestWordNode,'font-size','16px',500,{ease:hui.ease.slowFastSlow});
		}
	},
	$click$registerButton : function() {
		
		var values = hui.ui.get('registrationForm').getValues();
		AppWords.createWord(values.language,values.category,this.word,{
			callback : function() {
				this._lowlight();
				hui.ui.get('registrationPanel').hide();
				this.latestWordNode.className='known';
				this.latestWordNode.focus();
			}.bind(this),
			errorHandler : function(msg,e) {
				hui.log(msg,e);
				hui.ui.showMessage({text:msg,duration:2000,icon:'common/warning'});
			}
		})
	}
};

hui.ui.listen(importView)