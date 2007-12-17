var controller = {
	editedId : 0,
	interfaceIsReady : function(gui) {
		var delegate = {callback:function(person) {
			givenName.setValue(person.givenName);
			familyName.setValue(person.familyName);
			namePrefix.setValue(person.namePrefix);
			nameSuffix.setValue(person.nameSuffix);
		}};
		CommunityTool.getUsersMainPerson(delegate);
		
		CommunityTool.getUsersMainPersonsAddresses(function(addresses) {
			mails.addObjects(addresses);
		});
		this._refreshInvitation();
	},
	searchFieldChanged : function(searchField) {
		this._search();
	},
	selectorSelectionChanged : function(selector) {
		this._search();
	},
	listRowsWasOpened$invitations : function(obj) {
		N2i.log(obj);
	},
	toolbarIconWasClicked$newInvitation : function(icon) {
		invitationFormula.reset();
		invitationWindow.show();
	},
	toolbarIconWasClicked$test : function(icon) {
		if (!this.alert) {
			this.alert = In2iGui.Alert.create({variant:'smile'});
			this.alert.setTitle('Invitationen er sendt!');
			this.alert.setText('Personen vil modtage en email med oplysninger om hvordan de kan tilmelde sig OnlineObjects!');
			var button = In2iGui.Button.create({text : 'Fantastisk!', name : 'myButton'});
			this.alert.addButton(button);
		}
		this.alert.show();
	},
	buttonWasClicked$myButton : function() {
		this.alert.hide();
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
	},
	buttonWasClicked$sendInvitation : function() {
		var name = invitationName.getValue();
		var emailAddress = invitationEmail.getValue();
		var message = invitationMessage.getValue();
		invitationWindow.hide();
		var self = this;
		CommunityTool.createInvitation(name,emailAddress,message,function(response) {
			self._refreshInvitation();
		});
	},
	
	_refreshInvitation : function() {
		CommunityTool.getInvitations(function(invites) {
			invitations.setObjects(invites);
		});
	}
}