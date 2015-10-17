var personView = {
	
	userId : null, // set by page
	
	$ready : function() {
		this.container = hui.get('profileContainer');
		this.profileInfo = hui.get('profileInfo');
		this.editLink = hui.get('editProfile');
    
    this.userId = parseInt(this.container.getAttribute('data-id'),10);
    
		this._attach();
	},
	
	_attach : function() {
		var edit = hui.ui.get('editProfile');
		if (edit) {
			edit.listen({
				$click:this.editProfile.bind(this)
			});
			hui.listen(hui.get('profileImage'),'click',function(e) {hui.stop(e);this.$click$changeImage()}.bind(this));
		}
	},
	$click$changeImage :function() {
		if (!this.imagePanel) {
			var p = this.imagePanel = hui.ui.BoundPanel.create({width:300});
			var buttons = hui.ui.Buttons.create({align:'center'});
			var choose = hui.ui.Button.create({text:'Vælg billede...',highlighted:true});
			buttons.add(choose);
			var up = hui.ui.Upload.create({
				name : 'upload',
				url : oo.appContext+'/uploadProfileImage',
				widget : choose,
				maxItems : 1,
				types : "*.jpg;*.png",
				placeholder : {title:'Vælg et billede på din computer...'}
			});
			p.add(up);
			var cancel = hui.ui.Button.create({name:'cancelChangeProfileImage',text:'Annuller'});
			buttons.add(cancel);
			p.add(buttons);
		}
		this.imagePanel.position(hui.get('profileImage'));
		this.imagePanel.show();
	},
	$click$cancelChangeProfileImage : function() {
		if (this.imagePanel) {
			this.imagePanel.hide();
		}
	},
	$uploadDidCompleteQueue$upload : function() {
		document.location.reload();
	},
	editProfile : function() {
		this.buildProfileEditor();
		hui.ui.request({
			url : oo.appContext+'/getUserProfile',
			parameters : {userId : this.userId},
			$object : function(data) {
				this.profileForm.setValues(data);
				this.expand({container:this.container,hide:this.profileInfo,show:this.profileEditor});
			}.bind(this)
		})
	},
	buildProfileEditor : function() {
		if (this.profileEditor) return;
		this.profileEditor = hui.build('div',{'class':'profile_editor',style:'width:'+this.profileInfo.clientWidth+'px;position:absolute'});
		hui.style.set(this.profileEditor,{opacity:0});
		this.container.appendChild(this.profileEditor);
		var form = this.profileForm = hui.ui.Formula.create();
		var cancel = hui.ui.Button.create({text:'Annuller'});
		var update = hui.ui.Button.create({text:'Opdatér',highlighted:true});
		cancel.listen({$click:this.cancelEditor.bind(this)});
		update.listen({$click:this.saveEditor.bind(this)});
		var group = form.buildGroup({above:false},[
			{type:'TextField',options:{label:'Fornavn:',key:'givenName'}},
			{type:'TextField',options:{label:'Mellemnavn:',key:'additionalName'}},
			{type:'TextField',options:{label:'Efternavn:',key:'familyName'}},
			{type:'TextField',options:{label:'Om mig:',key:'resume',lines:5}},
			{type:'DropDown',options:{label:'Køn:',key:'sex',items:[{value:null,title:'Ukendt'},{value:true,title:'Mand'},{value:false,title:'Kvinde'}]}},
			{type:'TokenField',options:{label:'Interesser:',key:'interests',width:80}},
			{type:'TokenField',options:{label:'Yndlingsmusik:',key:'music',width:80}}
		]);
		var emails = hui.ui.ObjectList.create({label:'E-mail:',key:'emails',template:[{type:'text',label:'E-mail',key:'address'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(emails);
		var phones = hui.ui.ObjectList.create({label:'Telefonnumre:',key:'phones',template:[{type:'text',label:'Nummer',key:'number'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(phones);
		var urls = hui.ui.ObjectList.create({label:'Internetadresser:',key:'urls',template:[{type:'text',label:'Adresse',key:'address'},{type:'text',label:'Kontekst',key:'context'}]});
		group.add(urls);
		var buttons = group.createButtons();
		buttons.add(cancel);
		buttons.add(update);
		this.profileEditor.appendChild(form.element);
	},
	saveEditor : function() {
		hui.ui.showMessage({text:'Gemmer profil...',busy:true});
		var info = this.profileForm.getValues();
		info.userId = this.userId;
		hui.ui.request({
			url : oo.appContext+'/updateUserProfile',
			json : {info : info},
			$success : function() {
				hui.ui.showMessage({text:{da:'Gemt',en:'Saved'},icon:'common/success',duration:2000});
				oo.update({id:'profileInfo',$success:function() {
					this.cancelEditor();
				}.bind(this)})
			}.bind(this),
			$failure : function() {
				hui.ui.showMessage({text:'An unexpected error occurred',duration:4000})
			}
		})
	},
	cancelEditor : function() {
		this.expand({container:this.container,hide:this.profileEditor,show:this.profileInfo});
	},
	expand : function(options) {
		var container = options.container,
			toHide = options.hide,
			toShow = options.show,
			width = container.clientWidth;
		hui.style.set(container,{height:container.clientHeight+'px',overflow:'hidden',position:'relative'});
		hui.style.set(toHide,{width:width+'px',position:'absolute',background:'#fff'});
		hui.style.set(toShow,{width:width+'px',opacity:0,display:'block',position:'absolute',background:'#fff'});
		hui.animate(toHide,'opacity',0,500,{hideOnComplete:true});
		hui.animate(toShow,'opacity',1,500,{delay:300});
		hui.animate(container,'height',toShow.clientHeight+'px',500,{ease:hui.ease.slowFastSlow,onComplete:function() {
			toHide.style.position='static';
			toShow.style.position='static';
			hui.style.set(container,{height:'',overflow:'',position:'static'});
			if (options.$complete) {
				options.$complete();
			}
		}});
	}
}

hui.ui.listen(personView);