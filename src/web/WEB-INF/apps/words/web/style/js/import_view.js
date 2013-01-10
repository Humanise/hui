var importView = {
	$ready : function() {
		var a = hui.get.firstByClass(document.body,'unknown');
		if (a) {
			a.focus();
		}
	},
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
		hui.ui.request({
			url : oo.appContext+'/createWord',
			parameters : { language : values.language, category : values.category, text : this.word },
			$success : function(id) {
				this._lowlight();
				hui.ui.get('registrationPanel').hide();
				this.latestWordNode.className='known';
				this.latestWordNode.focus();
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:{en:'Unable to add word',da:'Kunne ikke tilføje ordet'},icon:'common/warning',duration:2000});
			}
		});
	}
};

hui.ui.listen(importView)