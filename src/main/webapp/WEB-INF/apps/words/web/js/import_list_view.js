var importListView = {
	sessionId : null,
	
	$ready : function() {
		
	},
	$click$performImport : function(button) {
		button.disable();
		var form = hui.get('selectionForm');
		var words = [];
		var inputs = hui.get.byTag(form,'input');
		for (var i=0; i < inputs.length; i++) {
			if (inputs[i].name=='word' && inputs[i].checked) {
				words.push(inputs[i].value);
			}
		};
		var data = {
			language : hui.ui.get('language').getValue(),
			category : hui.ui.get('category').getValue(),
			words : words,
			sessionId : this.sessionId
		}
		hui.ui.request({
			url : oo.appContext + '/performImport',
			json : {data:data},
			$object : function(log) {
				hui.get('log').value = log;
			},
			$failure : function() {
				hui.get('log').value = 'Failure';
			},
			$finally : function() {
				button.enable();				
			}
		})
	}
};

hui.ui.listen(importListView)