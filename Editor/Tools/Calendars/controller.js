hui.ui.listen({
	$valueChanged$viewSelection : function(value) {
		hui.ui.changeState(value);
	},
	$selectionChanged$selector : function(value) {
		if (value.kind=='calendar') {
			list.setSource(calendarEventsListSource);
		} else if (value.kind=='calendarsource') {
			list.setSource(sourceEventsListSource);
		} else {
			list.setSource(sourcesListSource);
		}
	}
});