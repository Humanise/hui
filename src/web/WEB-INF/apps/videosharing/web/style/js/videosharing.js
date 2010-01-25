ui.listen({
	uploadPanel : null,
	
	$click$logIn : function() {
		var username = ui.get('usernameField').getValue();
		var password = ui.get('passwordField').getValue();
		CoreSecurity.changeUser(username,password,function() {
			document.location.reload();
		});
	},
	$click$logOut : function() {
		CoreSecurity.logOut(function() {
			document.location.reload();
		});
	},
	$click$showUpload : function() {
		if (!this.uploadPanel) {
			var p = this.uploadPanel = ui.Box.create({closable:true,width:400,modal:true,absolute:true,padding:10});
			var buttons = ui.Buttons.create({top: 10,align:'center'});
			var cancel = ui.Button.create({name:'cancelUpload',title:'Cancel'});
			var choose = ui.Button.create({text:'Choose video file...'});
			buttons.add(choose);
			buttons.add(cancel);
			var upload = ui.Upload.create({
				url:'importVideo.action',
				widget:choose,
				placeholder:{title:'Choose a videofile...',text:'The file must be an MPEG 4 file'},
				parameters:{hep:'hey!'}
			});
			p.add(upload);
			p.add(buttons);
			p.addToDocument();
		}
		this.uploadPanel.show();
	},
	$click$cancelUpload : function() {
		this.uploadPanel.hide();
	},
	$uploadDidCompleteQueue : function() {
		ui.showMessage({text:'The upload is complete!',duration:2000});
	}
})