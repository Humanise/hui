oo.View = function(options) {
	this.options = {emptyHtml:'',pageSize:10};
	hui.ui.extend(this,options);
	this.items = [];
	this.page = 0;
	this.pageSize = this.options.pageSize;
	this.revealing = false;
	this.container = null;
	this.itemElements = null; // The LIs
	this.renderingPosition = 0;
	this.maxRevealed = 0;
	this._attach();
}

oo.View.prototype = {
	_attach : function() {
		this.spinner = hui.get.firstByClass(this.element,'oo_spinner');
		if (this.options.source) {
			this.options.source.listen(this);
		}
		var self = this;
		hui.listen(this.element,'click',function(e) {
			e = hui.event(e);
			e.stop();
			var li = e.findByClass('oo_view_item');
			if (li) {
				self.fire('clickItem',{event:e,item:self.items[li._oo_index]});
			}
		})
		this._initScrolling();
		this._setBusy(true);
	},
	_setBusy : function(busy) {
		hui.cls.set(this.spinner,'oo_spinner_visible',busy);
		if (busy) {
			if (this.page > 0) {
				this.spinner.style.top = (this.renderingPosition + 20) + 'px';				
			} else {
				this.spinner.style.top = '';
			}
		}
	},
	_initScrolling : function() {
		var parent = this.element.parentNode;
		if (parent && hui.cls.has(parent,'hui_overflow')) {
			this.container = parent;
			hui.listen(parent,'scroll',this._reveal.bind(this));
		}
	},
	_reveal : function() {
		var limit = this.container.scrollTop + this.container.clientHeight;
		if (limit <= this.maxRevealed) {
			return;
		}
		this.maxRevealed = limit;
		var diff = this.renderingPosition - limit;
		if (diff < 0) {
			hui.log('oo.View._reveal: calling _loadMore:' + diff);
			this._loadMore();
		}
	},
	_loadMore : function() {
		if (this.busy) {
			hui.log('oo.View: im busy');
			return;
		}
		this.busy = true;
		this.page++;
		this.fireProperty('page',this.page);
		hui.log('oo.View: Loading more: ' + this.page);
	},
	reset : function() {
		this.page = this.busy ? 0 : -1;
		this.maxRevealed = 0;
		this.renderingPosition = 0;

		this._loadMore();
		var parent = this.element.parentNode;
		if (parent && hui.cls.has(parent,'hui_overflow')) {
			parent.scrollTop = 0;
		}
		hui.log('oo.View: Resetting');
	},
	$sourceIsBusy : function() {
		this._setBusy(true);
	},
	$objectsLoaded : function(result) {
		hui.log('oo.View: objectsLoaded: page=' + this.page);
		this._setBusy(false);
		var ul;
		if (this.page==0) {
			this.items = [];
			this.itemElements = [];
			if (this.list) {
				this.list.innerHTML = '';				
			}
			ul = this.list = hui.build('ul',{'class':'oo_view_list'});
			for (var i = 0; i < result.total; i++) {
				var li = hui.build('li',{parent:ul,'class':'oo_view_item',html:this.options.emptyHtml});
				li._oo_index = i;
				this.itemElements.push(li);
			}
		}
		var start = this.pageSize * this.page;
		var li;
		var list = result.items;
		for (var i = 0; i < list.length; i++) {
			li = this.itemElements[i + start]
			li.innerHTML = this.options.$render(list[i]);
			this.items.push(list[i]);
		}
		if (ul && !ul.parentNode) {
			this.element.appendChild(ul);
		}
		this.renderingPosition = li ? li.offsetTop + li.clientHeight : 0;
		this.fireSizeChange();
		this.busy = false;
		if (result.total > this.items.length) {
			this._reveal();			
		}
	}
};