var personsController = {
	activePerson : 0,
	
	$ready : function() {
		this.refreshPersonList();
	},
	
	$select : function(item) {
		if (item.value=='persons') {
			hui.ui.changeState('persons');
			this.refreshPersonList();
		} else if (item.value=='invitations') {
			hui.ui.changeState('invitations');
			this.refreshInvitationList();
		}
	},
	$open$personList : function(obj) {
		this.editPerson(obj.id);
	},
	
	refreshPersonList : function() {
		AppCommunity.listPersons(function(list) {
			personList.setObjects(list);
		});
	},
	
	refreshInvitationList : function() {
		AppCommunity.getInvitations(function(invites) {
			invitationList.setObjects(invites);
		});
	},
	
	//////////////////////////////// Persons /////////////////////////////
	
	$click$newPerson : function() {
		this.activePerson = 0;
		personFormula.reset();
		personWindow.show();
	},
	$click$cancelPerson : function() {
		this.activePerson = 0;
		personFormula.reset();
		personWindow.hide();
	},
	$click$savePerson : function() {
		var person = personFormula.getValues();
		person.id=this.activePerson;
		
		var emails = personEmails.getValue();
		var phones = personPhones.getValue();
		var self = this;
		AppCommunity.savePerson(person,emails,phones,function() {
			self.refreshPersonList();
			personFormula.reset();
			personWindow.hide();
		});
	},
	editPerson : function(id) {
		this.activePerson = id;
		personFormula.reset();
		personWindow.show();
		AppCommunity.loadPerson(id,function(person) {
			personFormula.setValues(person.person);
			personEmails.setValue(person.emails);
			personPhones.setValue(person.phones);
		});
	},
	
	///////////////////////////// Invitations /////////////////////////////
	
	$click$newInvitation : function() {
		invitationFormula.reset();
		invitationWindow.show();
	},
	$click$sendInvitation : function() {
		var form = invitationFormula.getValues();
		invitationWindow.hide();
		this.showInvitationProgress();
		var self = this;
		AppCommunity.createInvitation(form.name,form.email,form.message,{
			callback: function() {
				self.invitationWasSent();
			},
			errorHandler:function(errorString, exception) {
				hui.log(errorString);
				hui.log(exception);
				self.invitationFailed(errorString);
			}
		});
	},
	$click$inviteSentOK : function() {
		this.inviteSentAlert.hide();
	},
	
	showInvitationProgress : function() {
		if (!this.inviteProgress) {
			this.inviteProgress = hui.ui.Alert.create({
				emotion: 'smile',
				title: 'Sender invitation...',
				text: 'Vent venligst mens invitationen sendes.'
			});
		}
		this.inviteProgress.show();
	},
	
	invitationFailed : function(errorString) {
		this.inviteProgress.hide();
		hui.ui.alert({
			emotion: 'gasp',
			title: 'Invitationen kunne ikke afsendes',
			text: 'Der skete følgende fejl: '+errorString
		});
		this.refreshInvitationList();
	},
	invitationWasSent : function() {
		this.inviteProgress.hide();
		hui.ui.alert({
			emotion: 'smile',
			title: 'Invitationen er sendt!',
			text: 'Personen vil modtage en email med oplysninger om hvordan han/hun kan tilmelde sig!'
		});
		this.refreshInvitationList();
	}
}