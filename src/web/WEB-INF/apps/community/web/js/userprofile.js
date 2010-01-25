oo.community.UserProfile = function() {
	this.container = $('profileContainer');
	this.profileInfo = $('profileInfo');
	this.editLink = $('editProfile');
	In2iGui.get().addDelegate(this);
	this.addBehavior();
}

oo.community.UserProfile.prototype = {
	addBehavior : function() {
		var edit = In2iGui.get('editProfile');
		if (edit) {
			edit.addDelegate({
				$click:this.editProfile.bind(this)
			});
			$('profileImage').observe('click',function(e) {e.stop();this.$click$changeImage()}.bind(this));
		}
	},
	$click$changeImage :function() {
		if (!this.imagePanel) {
			var p = this.imagePanel = ui.BoundPanel.create({width:300});
			var buttons = ui.Buttons.create({align:'center'});
			var choose = In2iGui.Button.create({text:'Vælg billede...',highlighted:true});
			buttons.add(choose);
			var up = ui.Upload.create({name:'upload',url:'uploadProfileImage',widget:choose,maxItems:1,types:"*.jpg;*.png",placeholder:{title:'Vælg et billede på din computer...'}});
			p.add(up);
			var cancel = ui.Button.create({name:'cancelChangeProfileImage',text:'Annuller'});
			buttons.add(cancel);
			p.add(buttons);
		}
		this.imagePanel.position($('profileImage'));
		this.imagePanel.show();
	},
	$click$cancelChangeProfileImage : function() {
		if (this.imagePanel) this.imagePanel.hide();
	},
	$uploadDidCompleteQueue$upload : function() {
		document.location.reload();
	},
	editProfile : function() {
		this.buildProfileEditor();
		AppCommunity.getUserProfile(function(data) {
			this.profileForm.setValues(data);
			oo.community.util.expand(this.container,this.profileInfo,this.profileEditor);			
		}.bind(this));
	},
	buildProfileEditor : function() {
		if (this.profileEditor) return;
		this.profileEditor = new Element('div',{'class':'profile_editor'}).setStyle({opacity:0,width:this.profileInfo.getWidth()+'px',position:'absolute'});
		this.container.insert(this.profileEditor);
		var form = this.profileForm = In2iGui.Formula.create();
		var cancel = In2iGui.Button.create({text:'Annuller'});
		var update = In2iGui.Button.create({text:'Opdatér',highlighted:true});
		cancel.addDelegate({$click:this.cancelEditor.bind(this)});
		update.addDelegate({$click:this.saveEditor.bind(this)});
		var group = form.buildGroup({above:false},[
			{type:'Text',options:{label:'Fornavn:',key:'givenName'}},
			{type:'Text',options:{label:'Mellemnavn:',key:'additionalName'}},
			{type:'Text',options:{label:'Efternavn:',key:'familyName'}},
			{type:'Text',options:{label:'Om mig:',key:'resume',lines:5}},
			{type:'DropDown',options:{label:'Køn:',key:'sex',items:[{value:null,title:'Ukendt'},{value:true,title:'Mand'},{value:false,title:'Kvinde'}]}},
			{type:'Tokens',options:{label:'Interesser:',key:'interests',width:80}},
			{type:'Tokens',options:{label:'Yndlingsmusik:',key:'music',width:80}}
		]);
		var emails = In2iGui.ObjectList.create({label:'E-mail:',key:'emails',template:[{type:'text',label:'E-mail',key:'address'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(emails);
		var phones = In2iGui.ObjectList.create({label:'Telefonnumre:',key:'phones',template:[{type:'text',label:'Nummer',key:'number'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(phones);
		var urls = In2iGui.ObjectList.create({label:'Internetadresser:',key:'urls',template:[{type:'text',label:'Adresse',key:'address'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(urls);
		var buttons = group.createButtons();
		buttons.add(cancel);
		buttons.add(update);
		this.profileEditor.insert(form.element);
	},
	saveEditor : function() {
		In2iGui.showMessage('Gemmer profil...');
		AppCommunity.updateUserProfile(this.profileForm.getValues(),function() {
			document.location.reload();
		});
	},
	cancelEditor : function() {
		oo.community.util.expand(this.container,this.profileEditor,this.profileInfo);
	}
}

In2iGui.onDomReady(function() {new oo.community.UserProfile();});