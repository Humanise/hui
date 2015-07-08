(function (_super) {

  oo.Selection = function(options) {
    _super.call(this, options);
  	this.list = hui.get.firstByTag(this.element,'ol');
  	if (options.source) {
  		this.source = hui.ui.get(options.source);
  	}
  	this.options = [];
  	this.selections = [];
  	this.value = [];
  	if (options.value) {
  		this.value.push(options.value);
  	}
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
  		hui.dom.clear(this.list);
  		for (var i=0; i < this.options.length; i++) {
  			var option = this.options[i];
  			var icon = option.icon || 'tag_line';
  			var html = '<a class="oo_selection_link" href="javascript://" data-index="'+i+'">'+
  				'<span class="oo_selection_icon oo_icon oo_icon_16 oo_icon_' + icon + '"></span>'+
  				'<span class="oo_selection_text">' + hui.string.escape(option.text || option.title || option.label) + '</span>';
  			if (option.badge) {
  				html+= '<span class="oo_selection_badge">' + hui.string.escape(option.badge) + '</span>';
  			}
  			html+= '</a>';
  			var li = hui.build('li',{'class':'oo_selection_option',html:html,parent:this.list});
  			if (hui.array.contains(this.value,option.value)) {
  				hui.array.add(this.selections,i);
  				hui.cls.add(li,'oo_selection_option_selected');
  			}
  		};
  		this.fireSizeChange();
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


  hui.extend(oo.Selection, _super);

})(hui.ui.Component);