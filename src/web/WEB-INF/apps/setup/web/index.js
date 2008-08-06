var controller = {
	click$changePassword : function() {
		var pass1 = password1.getValue();
		var pass2 = password2.getValue();
		AppSetup.changeAdminPassword(pass1,pass2,function() {
			In2iGui.get().alert({title:'Adgangskoden er ændret',emotion:'smile'});
		});
	}
}