var settingsController = {
	editedId : 0,
	interfaceIsReady : function(gui) {
		CommunityTool.getUsersMainPerson(function(person) {
			givenName.setValue(person.givenName);
			familyName.setValue(person.familyName);
			namePrefix.setValue(person.namePrefix);
			nameSuffix.setValue(person.nameSuffix);
		});
		
		CommunityTool.getUsersMainPersonsAddresses(function(addresses) {
			mails.addObjects(addresses);
		});
	},
	buttonWasClicked$savePerson : function() {
		var delegate = {
			callback : function() {
			}
		}
		var emails = mails.getObjects();
		var person = {
			givenName:givenName.getValue(),
			familyName:familyName.getValue(),
			namePrefix:namePrefix.getValue(),
			nameSuffix:nameSuffix.getValue()
		};
		CommunityTool.updateUsersMainPerson(person,emails,delegate);
	}
}