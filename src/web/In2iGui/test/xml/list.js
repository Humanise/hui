var controller = {
	dragDrop : [
		{drag:'user',drop:'folder'}
	],
	interfaceIsReady : function() {
		this.loadUser();
	},
	loadUser : function() {
		list.loadData('data/list_users.xml');
	},
	drop$user$folder : function(dragged,target) {
		In2iGui.get().alert({text:Object.toJSON(dragged)+' was dropped on '+Object.toJSON(target)});
	}
}