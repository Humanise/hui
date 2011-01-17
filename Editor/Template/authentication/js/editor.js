var templateController = {
	
	$ready : function() {
		
	},
	edit : function() {
		if (!this.win) {
			this.win = ui.Window.create({title:'Adgangskontrol',width:250,padding:5});
			var form = this.form = ui.Formula.create({name:'templateForm'});
			this.win.add(form);
			var group = form.buildGroup({labels:'above'},[
				{type:'Text',options:{key:'title',label:'Titel:'}}
			]);
			var buttons = group.createButtons();
			buttons.add(ui.Button.create({text:'Opdater',highlighted:true,submit:true}));
		}
		this.win.show();
		this.form.focus();
		this._load();
	},
	_load : function() {
		var base = n2i.firstByClass(document.body,'authentication');
		var h1 = n2i.firstByTag(base,'h1');
		var title = n2i.dom.getText(h1);
		this.form.setValues({
			title:title
		});
	},
	$submit$templateForm : function() {
		var values = this.form.getValues();
		values.id = op.page.id;
		var self = this;
		ui.request({
			url : '../../../Template/authentication/Save.php',
			parameters : values,
			onSuccess : function() {
				var base = n2i.firstByClass(document.body,'authentication');
				var h1 = n2i.firstByTag(base,'h1');
				if (h1) {
					n2i.dom.setText(h1,values.title);
				}
				self.win.hide();
			}
		});
	}
};

ui.listen(templateController);