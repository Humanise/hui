oo.Words = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this._attach();
}

oo.Words.prototype = {
	_attach : function() {
		hui.listen(this.element,'click',this._onClick.bind(this));
	},
	_onClick : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			e.stop();
			if (hui.cls.has(a,'oo_words_add')) {
				this._showFinder();
			} else {
				hui.ui.confirmOverlay({element:a,text:'Delete word?',$ok : function() {
					this.fire('delete',{id:parseInt(a.getAttribute('data')),callback:this._reload.bind(this)});
				}.bind(this)})
			}
		}
	},
	_showFinder : function() {
		oo.WordFinder.get().show(function(value) {
			this.fire('add',{id:value.id,callback:this._reload.bind(this)});
		}.bind(this))
	},
	_reload : function() {
		oo.update({id:this.element.id,$success : this._attach.bind(this)});
	}
};