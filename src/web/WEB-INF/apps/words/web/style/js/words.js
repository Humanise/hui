var wordsApp = {
	$click$import : function() {
		if (!this._importWindow) {
			var win = this._importWindow = hui.ui.Box.create({title:'Import',absolute:true,width:500,modal:true,padding:10,closable:true});
			win.addToDocument();
			var form = this._importForm = hui.ui.Formula.create({name:'importFormula'});
			form.buildGroup(null,[
				{'type':'TextField',options:{label:'Adresse',key:'url'}}
			]);
			win.add(form);
		}
		this._importWindow.show();
		this._importForm.setValues({url:'http://daringfireball.net/linked/2012/10/04/valentine'}); //http://en.wikipedia.org/wiki/Language
		this._importForm.focus();
	},
	$submit$importFormula : function(form) {
		var values = form.getValues();
		var url = values.url;
		if (hui.isBlank(url)) {
			hui.ui.showMessage({text:'The address must be filled in',duration:2000});
			form.focus();
			return;
		}
		this._importWindow.hide();
		hui.ui.showMessage({text:'Fetching data...',busy:true});
		AppWords.startUrlImport(url,{
			callback : function(id) {
				hui.ui.showMessage({text:'Complete, redirecting...'});
				document.location=oo.appContext+'/en/import/'+id+'/';
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'The import failed',duration:2000});
			}
		});
	}
}

hui.ui.listen(wordsApp);