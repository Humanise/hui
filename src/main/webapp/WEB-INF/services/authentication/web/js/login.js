hui.ui.listen({
	username : null,
	password : null,
	
	$ready : function() {
		this.username = hui.ui.get('username');
		this.password = hui.ui.get('password');
		
		this.username.focus();
	},
	$submit$formula : function(formula) {
		formula.element.submit();
	}
})
