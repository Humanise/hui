var controller = {
	interfaceIsReady : function() {
		var self = this;
		//AppCommunity.searchUsers(null,function(users) {self.buildUsers(users)});
	},
	buildUsers : function(users) {
		
	},
	click$frontLogon : function() {
		front.hideLeft();
		users.showRight();
	},
	click$usersBack : function() {
		front.showLeft();
		users.hideRight();
	}
}