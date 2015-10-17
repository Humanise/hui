oo.InlineEditor = function(options) {
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this._addBehavior();
	this.editing = false;
}

oo.InlineEditor.prototype = {
	originalValue : null,
	
	_addBehavior : function() {
		hui.listen(this.element,'click',this._edit.bind(this));
	},
	_edit : function() {
		var el = this.element;
		var field = this._getField();
		hui.style.copy(el,field,['font-size','font-family','font-weight','line-height'])
		el.style.visibility = 'hidden'
		hui.position.place({source:{element:field},target:{element:el}});
		hui.style.set(field,{display:'block',width:el.clientWidth+'px',height:el.clientHeight+'px'})
		field.value = hui.dom.getText(el);
		field.style.display='block';
		field.focus();
		field.select();
		this.originalValue = field.value;
		this.editing = true;
	},
	_getField : function() {
		if (!this._field) {
			this._field = hui.build('textarea',{style:'border:none; background:none; position:absolute; display:none; padding: 0; margin: 0;',parent:document.body})
			hui.listen(this._field,'blur',this._save.bind(this));
			hui.listen(this._field,'keydown',function(e) {
				e = hui.event(e);
				if (e.returnKey) {
					e.stop();
					this._save()					
				}
			}.bind(this));
		}
		return this._field;
	},
	_save : function() {
		if (!this.editing) {return}
		var value = this._field.value;
		if (hui.isBlank(value)) {
			value = this.originalValue;
		}
		hui.dom.setText(this.element,value);
		this._field.style.display='none';
		this.element.style.visibility = '';
		document.body.focus();
		if (this.originalValue!=value) {
			this.fire('valueChanged',value);			
		}
		this.editing = false;
	}
};