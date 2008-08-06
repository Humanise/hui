var controller = {
	interfaceIsReady : function() {
		calendar.refresh();
		this.click$changeUser();
	},
	calendarSpanChanged : function(info) {
		AppSchool.getEvents(info.startTime,info.endTime,{
			callback : function(events) {
				calendar.setEvents(events);
			},
			errorHandler : function() {
				calendar.setBusy(false);
			}
		});
	},
	click$changeUser : function() {
		userWindow.show();
	},
	click$logIn : function() {
		var info = userFormula.getValues();
		CoreSecurity.changeUser(info.username,'changeme',function(success) {
			if (success) {
				calendar.refresh();
				userWindow.hide();
			} else {
				In2iGui.get().alert({title:'Brugernavn eller kodeord er ikke korrekt!',text:'Prøv venligst igen...',emotion:'gasp'});
			}
		});
	},
	requestEventInfo : function(event) {
		AppSchool.getEventInfo(event.id,function(data) {
			calendar.updateEventInfo(event,data);
		});
	},
	objectWasClicked : function(object) {
		AppSchool.changeToUserOfPerson(object.id,function(success) {
			if (success) {
				calendar.refresh();
			}
		});
	},
	click$test : function() {
		
		CoreSecurity.changeUser(100036,'changeme',function(success) {
			calendar.setDate(Date.parseDate('2007-08-13','Y-m-d'));
		});
	}
}