/**
 * A dock
 * @constructor
 */
In2iGui.Dock = function(element,name,options) {
	this.options = n2i.override({modal:false},options);
	this.element = $(element);
	this.iframe = this.element.select('iframe')[0];
	this.name = name;
	In2iGui.extend(this);
	In2iGui.get().registerOverflow(this.iframe,-58);
}

In2iGui.Dock.prototype = {
	setUrl : function(url) {
		n2i.getFrameDocument(this.iframe).location.href=url;
	}
}

/* EOF */