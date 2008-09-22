var controller = {
	interfaceIsReady : function() {
		formula1.setValues({username:'john',password:'pass'});
	},
	click$showValues : function() {
		var v = formula1.getValues();
		alert(Object.toJSON(v));
	}
}