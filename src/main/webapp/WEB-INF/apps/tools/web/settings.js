var settingsController = {
	editedId : 0,
	$ready : function(gui) {
		AppCommunity.getUsersMainPerson(function(person) {
			givenName.setValue(person.givenName);
			familyName.setValue(person.familyName);
			namePrefix.setValue(person.namePrefix);
			nameSuffix.setValue(person.nameSuffix);
		});
		
		AppCommunity.getUsersMainPersonsAddresses(function(addresses) {
			mails.addObjects(addresses);
		});
	},
	$click$savePerson : function() {
		var emails = mails.getObjects();
		var person = {
			givenName:givenName.getValue(),
			familyName:familyName.getValue(),
			namePrefix:namePrefix.getValue(),
			nameSuffix:nameSuffix.getValue()
		};
		savePerson.setEnabled(false);
		AppCommunity.updateUsersMainPerson(person,emails,function() {
			savePerson.setEnabled(true);
		});
	}
}