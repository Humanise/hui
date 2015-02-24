var controller = {
	$click$toolPersons : function() {
		document.location='../persons/';
	},
	$click$toolSettings : function() {
		document.location='../settings/';
	},
	$click$toolImages : function() {
		document.location='../images/';
	},
 	$click$toolBookmarks : function() {
		document.location='../bookmarks/';
	},
 	$click$toolIntegration : function() {
		document.location='../integration/';
	},
	
	$click$barPublic : function(icon) {
		document.location='../../';
	},
	$click$barWebsite : function(icon) {
		document.location='../site/';
	},
	$click$barUser : function(icon) {
		document.location='../';
	},
	$click$barLogOut : function() {
		CoreSecurity.logOut(function() {
			hui.ui.showMessage('Du er nu logget ud');
			window.setTimeout(function() {
				document.location='../../';
			},1000);
		});
	}
}