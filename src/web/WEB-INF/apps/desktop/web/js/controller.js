if (!window.oo) {window.oo={}};

oo.Desktop = new Class({
	
	initialize : function() {
		this.keyboardNavigator = hui.KeyboardNavigator.create();
		var self = this;
		this.keyboardNavigator.listen({
			$textChanged : function(text) {
				AppDesktop.find(text,self.displayResults.bind(self));
			}
		})
	},
	
	displayResults : function(results) {
		console.log(results);
	}
})

window.addEvent('load',function() {new oo.Desktop()});