var controller = {
	$ready : function() {
		var self = this;
	},
	buildUsers : function(users) {
		
	},
	$click$frontLogin : function() {
		front.hideLeft();
		users.showRight();
	},
	$click$frontUsers : function() {
		front.hideLeft();
		users.showRight();
	},
	$click$usersBack : function() {
		front.showLeft();
		users.hideRight();
	},
	$click$usersBack : function() {
		front.showLeft();
		users.hideRight();
	}
}