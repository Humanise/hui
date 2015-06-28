var controller = {
	interfaceIsReady : function() {
		var sticky = n2i.cookie.get('calendarUser');
		if (sticky) {
			this.changeUser(sticky);
		} else {
			calendar.refresh();
			this.updateUser();
		}
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
		if (info.username.length==0) {
			return;
			hui.ui.alert({title:'Brugeren findes desværre ikke!',text:'Prøv venligst igen...',emotion:'gasp'});
		}
		this.changeUser(info.username);
	},
	
	changeUser : function(username) {
		var self = this;
		CoreSecurity.changeUser(username,'changeme',function(success) {
			if (success) {
				calendar.refresh();
				userWindow.hide();
				self.updateUser();
				n2i.cookie.set('calendarUser',username,90);
			} else {
				hui.ui.alert({title:'Brugeren findes desværre ikke!',text:'Prøv venligst igen...',emotion:'gasp'});
			}
		});
		
	},
	
	requestEventInfo : function(event) {
		AppSchool.getEventInfo(event.id,function(data) {
			calendar.updateEventInfo(event,data);
		});
	},
	objectWasClicked : function(object) {
		var self = this;
		AppSchool.changeToUserOfPerson(object.id,function(success) {
			if (success) {
				calendar.refresh();
				self.updateUser();
			}
		});
	},
	click$test : function() {
		var self = this;
		CoreSecurity.changeUser(100036,'changeme',function(success) {
			calendar.setDate(Date.parseDate('2007-08-13','Y-m-d'));
			self.updateUser();
		});
	},
	updateUser : function() {
		CoreSecurity.getUsersPerson(function(user) {
			userInfo.setText(user ? user.name : 'ingen');
		});
	}
}