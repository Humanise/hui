oo.community.ImgeView = {
	id:null,
	created:false,
	$click$editImage : function() {
		if (!this.created) {
			var form = this.imageFormula = ui.Formula.create();
			var group = form.buildGroup({above:false},[
				{type:'Text',options:{label:'Titel:',key:'name'}},
				{type:'Text',options:{label:'Beskrivelse:',key:'description',lines:2}},
				{type:'DateTime',options:{label:'Dato:',key:'taken'}},
				{type:'Tokens',options:{label:'Nøgleord:',key:'tags',width:80}},
			]);
			var buttons = group.createButtons();
			buttons.add(ui.Button.create({text:'Annuller',name:'cancelEditImage'}));
			buttons.add(ui.Button.create({text:'Opdater',highlighted:true,name:'updateEditImage'}));
			$('imageEditor').insert(form.element);
			this.created = true;
		}
		AppCommunity.getImageInfo(this.id,function(data) {
			n2i.log(data);
			this.imageFormula.setValues(data);
			$('imageEditor').show();
			$('imageProperies').hide();
		}.bind(this));
	},
	$click$cancelEditImage : function() {
		$('imageEditor').hide();
		$('imageProperies').show();
	},
	$click$updateEditImage : function() {
		var values = this.imageFormula.getValues();
		values.id = this.id;
		AppCommunity.updateImageInfo(values,function() {
			document.location.reload();
		});
	}
}

ui.get().listen(oo.community.ImgeView);