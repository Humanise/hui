hui.ui.listen({
	$submit$textAnalysisFormula : function() {
		var values = textAnalysisFormula.getValues();
		
		hui.ui.request({
			url : 'v1.0/language/analyse',
			message : {start:'Analysing'},
			parameters : values,
			$text : function(result) {
				textAnalysisOutput.setValue(result)
			}
		})
	},
	$submit$textExtractionFormula : function() {
		var values = textExtractionFormula.getValues();
		
		hui.ui.request({
			message : {start:'Etracting'},
			url : 'v1.0/html/extract',
			parameters : {url:values.url},
			$text : function(result) {
				textExtractionOutput.setValue(result)
			}
		})
	},
	$select$selection : function(item) {
		pages.goTo(item.value);
	}
})