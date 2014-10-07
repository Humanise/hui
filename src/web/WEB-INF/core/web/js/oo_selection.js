oo.Selection = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.list = hui.get.firstByTag(this.element,'ol');
	this.name = options.name;
	if (options.source) {
		this.source = hui.ui.get(options.source);
	}
	this.options = [];
	this.selections = [];
	this.value = [];
	hui.ui.extend(this);
	this._attach();
}

oo.Selection.prototype = {
	_attach : function() {
		var source = this.source;
		if (source) {
			source.listen({
				$objectsLoaded : function(objects) {
					this.options = objects;
					this._render();
				}.bind(this)
			});
		}
		hui.listen(this.element,'mousedown',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				this.selectByIndex(parseInt(a.getAttribute('data-index')),e.shiftKey);
				e.stop();
			}
		}.bind(this))
	},
	_render : function() {
		this.selections = [];
		this.value = [];
		hui.dom.clear(this.list);
		for (var i=0; i < this.options.length; i++) {
			var option = this.options[i];
			var html = '<a class="oo_selection_link" href="javascript://" data-index="'+i+'">'+
				'<span class="oo_selection_icon oo_icon oo_icon_12 oo_icon_tag"></span>'+
				'<span class="oo_selection_text">' + hui.string.escape(option.title || option.label) + '</span>';
			if (option.badge) {
				html+= '<span class="oo_selection_badge">' + hui.string.escape(option.badge) + '</span>';
			}
			html+= '</a>';
			hui.build('li',{'class':'oo_selection_option',html:html,parent:this.list});
		};
		
	},
	getValue : function() {
		return this.value;
	},
	selectById : function(id,add) {
		for (var i = 0; i < this.options.length; i++) {
			var option = this.options[i];
			if (option.id == id) {
				this.selectByIndex(i,add);
				return;
			}
		}
	},
	selectByIndex : function(index,add) {
		this.value = [];
		if (add) {
			hui.array.flip(this.selections,index);
		} else {
			this.selections = [index];
		}
		var lis = hui.get.byTag(this.list,'li');
		for (var i=0; i < lis.length; i++) {
			var selected = hui.array.contains(this.selections,i);
			hui.cls.set(lis[i],'oo_selection_option_selected',selected);
			if (selected) {
				this.value.push(this.options[i].value);
			}
		};
		this.fireValueChange();
	}
}