var videosharing = {
	uploadPanel : null,
	
	$submit$loginForm : function() {
		var form = ui.get('loginForm');
		var values = form.getValues();
		CoreSecurity.changeUser(values.username,values.password,{callback:function() {
			document.location.reload();
		},errorHandler:function(e) {
			ui.showMessage({text:e,duration:2000});
			form.focus();
		}});
	},
	$click$logOut : function() {
		CoreSecurity.logOut(function() {
			document.location.reload();
		});
	},
	$click$showUpload : function() {
		if (!this.uploadPanel) {
			var p = this.uploadPanel = ui.Box.create({title:'Add video',closable:true,width:400,modal:true,absolute:true});
			var tabs = ui.Tabs.create({small:false,centered:true});
			var uploadTab = tabs.createTab({title:'From file',padding:10});
			p.add(tabs);
			var buttons = ui.Buttons.create({top: 10,align:'center'});
			var cancel = ui.Button.create({name:'cancelUpload',title:'Cancel'});
			var choose = ui.Button.create({text:'Choose video file...'});
			buttons.add(choose);
			buttons.add(cancel);
			var upload = ui.Upload.create({
				name:'videoUpload',
				url:'../../importVideo.action',
				maxSize:'40960',
				widget:choose,
				placeholder:{title:'Choose a videofile...',text:'The file must be an MPEG 4 file'},
				parameters:{hep:'hey!'}
			});
			uploadTab.add(upload);
			uploadTab.add(buttons);
			var linkTab = tabs.createTab({title:'From link',padding:10});
			var form = ui.Formula.create({name:'videoUrlForm'});
			form.buildGroup({above:true},[
				{type:'TextField',options:{label:'Title of the video:',key:'title'}},
				{type:'TextField',options:{label:'Internet address:',key:'url'}}
			]);
			linkTab.add(form);
			var create = ui.Button.create({name:'createFromUrl',title:'Create'});
			linkTab.add(create);
			p.addToDocument();
		}
		this.uploadPanel.show();
	},
	$click$cancelUpload : function() {
		this.uploadPanel.hide();
	},
	$uploadDidCompleteQueue$videoUpload : function() {
		ui.showMessage({text:'The upload is complete!',duration:2000});
		document.location.reload();
	},
	$click$createFromUrl : function() {
		var values = ui.get('videoUrlForm').getValues();
		AppVideosharing.addVideoFromUrl(values.title,values.url,function() {
			document.location.reload();
		});
	},
	
	// Signup
	
	$submit$signupForm : function() {
		var form = ui.get('signupForm');
		var values = form.getValues();
		AppVideosharing.signUp(values.name,values.email,values.username,values.password,{callback:function() {
			document.location=oo.appContext+'/users/'+values.username;
		},errorHandler:function(e) {
			ui.showMessage({text:e,duration:2000});
			form.focus();
		}});
	},
	
	showRegistration : function() {
		if (!this.ratingPanel) {
			var p = this.ratingPanel = ui.Box.create({closable:true,modal:true,absolute:true});
			p.addToDocument();
			p.add(n2i.build('div',{'class':'mock_registration'}));
		}
		this.ratingPanel.show();
	}
}
ui.listen(videosharing);