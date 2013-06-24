desktop.List = function(options) {
	this.element = hui.get(options.element)
	if (options.source) {
		options.source.listen({
			$objectsLoaded : this._render.bind(this)
		});
		options.source.refreshFirst();
	}
}

desktop.List.create = function(options) {
	options = options || {};
	options.element = hui.build('ol',{'class':'widget_list',parent:options.parent});
	return new desktop.List(options);
}

desktop.List.prototype = {
	refresh : function(options) {
		options = options || {};
		var parameters = options.parameters;
		hui.ui.request({
			url : 'listBookmarks',
			parameters : parameters,
			$object : this._render.bind(this)
		});
	},
	_render : function(data) {
		hui.dom.clear(this.element)
		for (var i=0; i < data.items.length; i++) {
			hui.build('li',{
				parent : this.element,
				html : '<p class="widget_list_asside">'+
							'<a class="widget_icon_info widget_nodrag" href="javascript://" style="font-size: 26px;font-family: inherit;line-height: 11px;font-weight: 100;">›</a>'+
							'<a class="widget_icon_info widget_nodrag" href="javascript://">i</a>'+
							'<a class="widget_list_move widget_nodrag">☰</a>'+
						'</p>'+
						'<p>'+data.items[i].text+' <a class="widget_icon_more widget_nodrag" href="javascript://">···</a></p>'
			});
		};
	}
};