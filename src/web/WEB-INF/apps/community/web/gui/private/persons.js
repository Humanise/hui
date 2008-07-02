var personsController = {
	activePerson : 0,
	
	interfaceIsReady : function() {
		this.refreshPersonList();
	},
	
	selectionChanged : function(value) {
		if (value=='persons') {
			In2iGui.get().changeState('persons');
			this.refreshPersonList();
		} else if (value=='invitations') {
			In2iGui.get().changeState('invitations');
			this.refreshInvitationList();
		}
	},
	listRowsWasOpened$personList : function(list) {
		var obj = list.getFirstSelection();
		this.editPerson(obj.id);
	},
	
	refreshPersonList : function() {
		CommunityTool.listPersons(function(list) {
			personList.setObjects(list);
		});
	},
	
	refreshInvitationList : function() {
		CommunityTool.getInvitations(function(invites) {
			invitationList.setObjects(invites);
		});
	},
	
	//////////////////////////////// Persons /////////////////////////////
	
	click$newPerson : function() {
		this.activePerson = 0;
		personFormula.reset();
		personWindow.show();
	},
	click$cancelPerson : function() {
		this.activePerson = 0;
		personFormula.reset();
		personWindow.hide();
	},
	click$savePerson : function() {
		var person = personFormula.getValues();
		person.id=this.activePerson;
		var self = this;
		CommunityTool.savePerson(person,function() {
			self.refreshPersonList();
			personFormula.reset();
			personWindow.hide();
		});
	},
	editPerson : function(id) {
		this.activePerson = id;
		personFormula.reset();
		personWindow.show();
		CommunityTool.loadPerson(id,function(person) {
			personFormula.setValues(person);
		});
	},
	
	///////////////////////////// Invitations /////////////////////////////
	
	click$newInvitation : function() {
		invitationFormula.reset();
		invitationWindow.show();
	},
	click$sendInvitation : function() {
		var form = invitationFormula.getValues();
		invitationWindow.hide();
		this.showInvitationProgress();
		var self = this;
		CommunityTool.createInvitation(form.name,form.email,form.message,{
			callback: function() {
				self.invitationWasSent();
			},
			errorHandler:function(errorString, exception) {
				N2i.log(errorString);
				N2i.log(exception);
				self.invitationFailed(errorString);
			}
		});
	},
	click$inviteSentOK : function() {
		this.inviteSentAlert.hide();
	},
	
	showInvitationProgress : function() {
		if (!this.inviteProgress) {
			this.inviteProgress = In2iGui.Alert.create(null,{
				variant: 'gasp',
				title: 'Sender invitation...',
				text: 'Vent venligst mens invitationen sendes.'
			});
		}
		this.inviteProgress.show();
	},
	
	invitationFailed : function(errorString) {
		this.inviteProgress.hide();
		In2iGui.get().showAlert({
			variant: 'gasp',
			title: 'Invitationen kunne ikke afsendes',
			text: 'Der skete følgende fejl: '+errorString
		});
		this.refreshInvitationList();
	},
	invitationWasSent : function() {
		this.inviteProgress.hide();
		if (!this.inviteSentAlert) {
			this.inviteSentAlert = In2iGui.Alert.create(null,{
				variant: 'smile',
				title: 'Invitationen er sendt!',
				text: 'Personen vil modtage en email med oplysninger om hvordan de kan tilmelde sig OnlineObjects!'
			});
			var button = In2iGui.Button.create('inviteSentOK',{text : 'Fantastisk!'});
			this.inviteSentAlert.addButton(button);
		}
		this.inviteSentAlert.show();
		this.refreshInvitationList();
	}
}