var profileView = {
	canModify : false,
	
	$interfaceIsReady : function() {
		if (this.canModify) {
			this.observeImage();
		}
	},
	observeImage : function() {
		$('profile_photo').observe('click',this.changeImage.bind(this));
		$('profile_photo').style.cursor='pointer';
	},
	
	changeImage :function() {
		if (!this.imagePanel) {
			var p = this.imagePanel = ui.BoundPanel.create({width:300});
			var buttons = ui.Buttons.create({align:'center'});
			var choose = hui.ui.Button.create({text:'Choose image...',highlighted:true});
			buttons.add(choose);
			var up = ui.Upload.create({name:'profileImageUpload',url:'../../changeProfileImage.action',widget:choose,maxItems:1,types:"*.jpg;*.png",placeholder:{title:'Choose and image on your computer...'}});
			p.add(up);
			var cancel = ui.Button.create({name:'cancelChangeProfileImage',text:'Cancel'});
			buttons.add(cancel);
			p.add(buttons);
		}
		this.imagePanel.position($('profile_photo'));
		this.imagePanel.show();
	},
	$click$cancelChangeProfileImage : function() {
		this.imagePanel.hide();
	},
	$uploadDidCompleteQueue$profileImageUpload : function() {
		ui.get('profileImageUpload').clear();
		this.imagePanel.hide();
		ui.showMessage({text:'Your profile image is changed!',duration:2000});
		oo.update({id:'profile_photo',onComplete:this.observeImage.bind(this)});
	},
	
	$click$editProfile : function() {
		if (!this.profilePanel) {
			var p = this.profilePanel = ui.Box.create({title:'Edit profile information',closable:true,width:550,padding:10,modal:true,absolute:true});
			var form = this.profileForm = hui.ui.Formula.create();
			var group = form.buildGroup({above:false},[
				{type:'TextField',options:{label:'Name:',key:'fullName'}},
				{type:'DateTimeField',options:{label:'Birthday:',key:'birthday'}},
				{type:'TextField',options:{label:'City:',key:'city'}},
				{type:'TextField',options:{label:'About me:',key:'resume',lines:5}},
				{type:'DropDown',options:{label:'Gender:',key:'sex',items:[{value:null,title:'Unknown'},{value:true,title:'Male'},{value:false,title:'Female'}]}},
				{type:'TokenField',options:{label:'Interests:',key:'interests',width:80}},
				{type:'TokenField',options:{label:'Favorite music:',key:'music',width:80}},
				{type:'TokenField',options:{label:'Favorite song/album:',key:'tracks',width:80}}
			]);
			var buttons = group.createButtons();
			var cancel = ui.Button.create({text:'Cancel'});
			cancel.click(function() {p.hide()});
			buttons.add(cancel);
			var update = ui.Button.create({text:'Update',highlighted:true,name:'updateProfile'});
			buttons.add(update);
			p.add(form);
			p.addToDocument();
		}
		AppVideosharing.getProfileInfo(function(info) {
			this.profileForm.setValues(info);
			this.profilePanel.show();
		}.bind(this))
	},
	$click$updateProfile : function() {
		var values = this.profileForm.getValues();
		AppVideosharing.updateProfileInfo(values,function() {
			document.location.reload();
		});
	}
}

ui.listen(profileView);