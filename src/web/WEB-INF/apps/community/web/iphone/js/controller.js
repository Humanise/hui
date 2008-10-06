var controller = {
	interfaceIsReady : function() {
		var self = this;
		//AppCommunity.searchUsers(null,function(users) {self.buildUsers(users)});
	},
	buildUsers : function(users) {
		
	},
	click$frontLogin : function() {
		front.hideLeft();
		users.showRight();
	},
	click$frontUsers : function() {
		front.hideLeft();
		users.showRight();
	},
	click$usersBack : function() {
		front.showLeft();
		users.hideRight();
	},
	click$usersBack : function() {
		front.showLeft();
		users.hideRight();
	}
}