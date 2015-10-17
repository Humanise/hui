oo.CustomView = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	if (options.source) {
        
		this.source = hui.ui.get(options.source);
        this.source.listen({
            $objectsLoaded : function(obj) {
                hui.log(obj)
            }
        })
	}
}

oo.CustomView.prototype = {
    $objectsLoaded : function() {
        
    }
};