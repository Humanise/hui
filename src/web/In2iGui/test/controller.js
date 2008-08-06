var controller = {
	interfaceDidLoad : function() {
		alert('x');
		picker.show();
	},
	click$newUser : function() {
		userEditor.show();
	},
	click$showPicker : function() {
		var panel = In2iGui.Panel.create();
		var picker = In2iGui.ColorPicker.create();
		panel.add(picker);
		panel.show();
	}
}