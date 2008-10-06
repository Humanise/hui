var controller = {
	interfaceIsReady : function() {
		this.refresh();
	},
	refresh : function() {
		var url = '../graphviz/'+algorithm.getValue()+'/'+file.getValue();
		graph.load(url);
		
	},
	selectionChanged : function() {
		this.refresh();
	},
	click$smaller : function() {
		graph.zoom(.9);
	},
	click$larger : function() {
		graph.zoom(1/.9);
	}
}