desktop.widget.Bookmarks = function(options) {
	this.options = hui.override({left:Math.random()*200,top:Math.random()*200},options);
	this.element = hui.build('div',{'class':'widget widget_links',
		style:'left: '+this.options.left+'px;top:'+this.options.top+'px; z-index: 1',
		parent:document.body,
		html : desktop.widget.Bookmarks.template
	});
	desktop.widget.makeMovable(this);
	this.body = hui.get.firstByClass(this.element,'widget_body');
	this.searchBar = desktop.SearchBar.create({parent:this.body});
	this.source = new hui.ui.Source({url:'listBookmarks'});
	this.list = desktop.List.create({parent:this.body,source:this.source});
	this._attach();
	this.list.refresh();
}

desktop.widget.Bookmarks.template = '<div class="widget_header">'+
		'<span class="widget_left">'+
			'<a class="widget_nodrag" href="javascript://" data="close">×</a>'+
		'</span>'+
		'<strong>Bookmarks</strong>'+
		'<span class="widget_right">'+
			'<a href="javascript://" class="widget_nodrag" style="font-weight: 400" data="more">···</a>'+
			'<a href="javascript://" class="widget_nodrag">+</a>'+
		'</span>'+
	'</div>'+
	'<div class="widget_body"></div>'+
	'<div class="widget_resize widget_resize_left"></div>'+
	'<div class="widget_resize widget_resize_right"></div>'+
	'<div class="widget_resize widget_resize_top"></div>'+
	'<div class="widget_resize widget_resize_bottom"></div>'+
	'<div class="widget_resize widget_resize_bottom widget_resize_right"></div>';

desktop.widget.Bookmarks.prototype = {
	_attach : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
		this.searchBar.listen({
			$valueChanged : function(value) {
				this.list.refresh({parameters:{text:value}});
			}.bind(this) 
		});
	},
	_onClick : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			var data = a.getAttribute('data');
			if (data=='more') {
				hui.cls.toggle(this.element,'widget_searching');
			}
			if (data=='close') {
				this.destroy();
			}
		}
	},
	destroy : function() {
		hui.dom.remove(this.element);
	}
}
