oo.Inspector = function(options) {
	var win = this.window = hui.ui.Window.create({title:'Inspector',width:600,variant:'light'});
	var diagram = hui.ui.Diagram.create({height:400});
	diagram.listen({
		$open : function(obj) {
			oo.Inspector.inspect({id:obj.id});
		}
	});
	win.add(diagram);
	hui.ui.request({
		url : oo.appContext+'/service/model/diagram',
		parameters : {id:options.id},
		$object : function(data) {
			diagram.$objectsLoaded(data);				
		},
		$failure : function() {
			// TODO Handle this (permissions)
		}
	})
}

oo.Inspector.existing = {};

/**
 * Use this to show a singleton enspector pr. object;
 */
oo.Inspector.inspect = function(options) {
	var existing = oo.Inspector.existing;
	if (!existing[options.id]) {
		existing[options.id] = new oo.Inspector(options);
	}
	existing[options.id].show();
}

oo.Inspector.prototype = {
	show : function() {
		this.window.show();
	}
};