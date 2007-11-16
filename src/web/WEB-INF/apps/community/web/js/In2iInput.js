if (!N2i) {var N2i = {};}

N2i.Textfield = function(field,delegate) {
	this.field = $id(field);
	this.value = this.field.value;
	this.delegate = delegate;
	if (this.delegate.placeholder && this.field.value=='') {
		this.field.value=this.delegate.placeholder;
	}
	this.addBehaviour();
}

N2i.Textfield.prototype.addBehaviour = function() {
	var self = this;
	this.field.onfocus = function() {
		self.focus();
	}
	this.field.onblur = function() {
		self.blur();
	}
	this.field.onkeydown = this.field.onkeyup = this.field.onkeypress = function() {
		self.key();
	}
}

N2i.Textfield.prototype.getValue = function() {
	return this.value;
}

N2i.Textfield.prototype.focus = function() {
	if (this.field.value==this.delegate.placeholder) {
		this.field.value='';
	}
}

N2i.Textfield.prototype.blur = function() {
	if (this.field.value=='' && this.delegate.placeholder) {
		this.field.value=this.delegate.placeholder;
	}
}

N2i.Textfield.prototype.key = function() {
	if (this.value != this.field.value) {
		this.value = this.field.value;
		if (this.delegate.valueDidChange) {
			this.delegate.valueDidChange(this);
		}
	}
}