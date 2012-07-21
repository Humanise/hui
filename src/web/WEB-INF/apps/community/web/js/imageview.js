oo.community.ImgeView = {
	id:null,
	created:false,
	$click$editImage : function() {
		if (!this.created) {
			var form = this.imageFormula = hui.ui.Formula.create();
			var group = form.buildGroup({above:false},[
				{type:'TextField',options:{label:'Titel:',key:'name'}},
				{type:'TextField',options:{label:'Beskrivelse:',key:'description',lines:5}},
				{type:'DateTimeField',options:{label:'Dato:',key:'taken'}},
				{type:'TokenField',options:{label:'Nøgleord:',key:'tags',width:80}},
				{type:'LocationField',options:{label:'Lokation',key:'location'}}
			]);
			var buttons = group.createButtons();
			buttons.add(hui.ui.Button.create({text:'Annuller',name:'cancelEditImage'}));
			buttons.add(hui.ui.Button.create({text:'Opdater',highlighted:true,name:'updateEditImage'}));
			hui.get('imageEditor').appendChild(form.element);
			this.created = true;
		}
		AppCommunity.getImageInfo(this.id,function(data) {
			this.imageFormula.setValues(data);
			oo.community.util.expand(hui.get('imageContainer'),hui.get('imageProperties'),hui.get('imageEditor'));
		}.bind(this));
	},
	$click$cancelEditImage : function() {
		oo.community.util.expand(hui.get('imageContainer'),hui.get('imageEditor'),hui.get('imageProperties'));
	},
	$click$updateEditImage : function() {
		var values = this.imageFormula.getValues();
		values.id = this.id;
		AppCommunity.updateImageInfo(values,function() {
			document.location.reload();
		});
	},
	$click$makeNonPublic : function() {
		Common.makePubliclyHidden(this.id,function() {
			document.location.reload();
		});
	},
	$click$makePublic : function() {
		Common.makePubliclyViewable(this.id,function() {
			document.location.reload();
		});
	}
}

hui.ui.listen(oo.community.ImgeView);