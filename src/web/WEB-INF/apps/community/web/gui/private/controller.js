var controller = {
	$click$toolPersons : function() {
		document.location='persons.gui';
	},
	$click$toolSettings : function() {
		document.location='settings.gui';
	},
	$click$toolImages : function() {
		document.location='images.gui';
	},
 	$click$toolBookmarks : function() {
		document.location='bookmarks.gui';
	},
 	$click$toolIntegration : function() {
		document.location='integration.gui';
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