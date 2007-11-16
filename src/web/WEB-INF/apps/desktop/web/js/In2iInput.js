if (!N2i) var N2i = {};

N2i.Input = function() {}

N2i.Input.DateField = function(element,options,delegate) {
	this.element = $id(element);
	this.options = options || {};
	this.delegate = delegate || {};
	this.value = this.element.value;
	this.tabIn();
}

N2i.Input.DateField.prototype.tabIn = function() {
	this.element.N2iDateField = this;
	this.element.onkeydown = this.element.onkeypress = function(event) {
		return this.N2iDateField.somethingHappened(event);
	}
	this.element.onblur = function(event) {
		return this.N2iDateField.onBlur();
	}
}

N2i.Input.DateField.prototype.somethingHappened = function() {
	if (this.value!=this.element.value) {
		this.value = this.element.value;
		if (this.delegate.valueIsChanged) {
			this.delegate.valueIsChanged(this.value);
		}
	}
}

N2i.Input.DateField.prototype.onBlur = function() {
	this.element.value = this.renderDate(this.parseDate(this.element.value));
}

N2i.Input.DateField.prototype.parseDate = function(str) {
	var reg = /((\d*)([ \/\-](\d*)([ \/\-](\d*))?)?)?/;
	var result = str.match(reg);
	var day = (parseInt(result[2]) || new Date().getDate());
	var month = (parseInt(result[4]) || new Date().getMonth()+1);
	var year = (parseInt(result[6]) || new Date().getFullYear());
	if (new String(year).length<4) year += 2000;
	
	var date = new Date();
	date.setFullYear(year,month-1,day);
	date.setHours(0,0,0,0);
	return date;
}

N2i.Input.DateField.prototype.renderDate = function(date) {
	return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
}





//////////////////////////////////////// Textfield ////////////////////////////////

N2i.Input.Textfield = function(element,options,delegate) {
	this.element = $id(element);
	this.delegate = delegate || {};
	this.options = options || {};
	this.value = this.element.value;
	this.request = null;
	this.completion = null;
	this.tabIn();
	if (this.options.complete) {
		this.element.setAttribute("autocomplete","off");
	}
	if (this.element.N2iInputTextfield) {
		this.element.N2iInputTextfield.destroy();
	}
	if (!this.options.completeMinChars) this.options.completeMinChars=2
	this.element.N2iInputTextfield = this;
	this.completionItems = [];
}

N2i.Input.Textfield.prototype.destroy = function() {
	this.destoyed = true;
}

N2i.Input.Textfield.prototype.setValue = function(value) {
	this.value = value;
	this.element.value = value;
}

N2i.Input.Textfield.prototype.getValue = function() {
	return this.value;
}

N2i.Input.Textfield.prototype.tabIn = function() {
	this.element.N2iTextField = this;
	this.element.onkeydown = function(event) {
		return this.N2iTextField.onKeyDown(event);
	}
	this.element.onkeyup = function(event) {
		return this.N2iTextField.onKeyUp(event);
	}
	this.element.onkeypress = function(event) {
		return this.N2iTextField.onKeyPress(event);
	}
	this.element.onblur = function(event) {
		return this.N2iTextField.onBlur();
	}
	this.element.onfocus = function(event) {
		return this.N2iTextField.onFocus();
	}
}

N2i.Input.Textfield.prototype.onKeyDown = function(event) {
	if (!event) event = window.event;
	switch (event.keyCode) {
		case 38 : this.onArrowUp(event); break;
		case 40 : this.onArrowDown(event); break;
		case 13 : this.onReturnKey(event); break;
		case 27 : this.onEscapeKey(event); break;
	}
	this.valueMightHaveChanged();
}

N2i.Input.Textfield.prototype.onArrowDown = function(event) {
	this.changeCompletion(1);
	if (this.delegate.arrowDown) {
		this.delegate.arrowDown(this);
	}
}

N2i.Input.Textfield.prototype.onArrowUp = function(event) {
	this.changeCompletion(-1);
	if (this.delegate.arrowUp) {
		this.delegate.arrowUp(this);
	}
}

N2i.Input.Textfield.prototype.onReturnKey = function(event) {
	this.finishCompletion();
	if (this.delegate.returnKey) {
		this.delegate.returnKey(this);
	}
}

N2i.Input.Textfield.prototype.onKeyUp = function(event) {
	this.valueMightHaveChanged();
}

N2i.Input.Textfield.prototype.onKeyUp = function(event) {
	this.valueMightHaveChanged();
}

N2i.Input.Textfield.prototype.onKeyPress = function(event) {
	this.valueMightHaveChanged();	
}

N2i.Input.Textfield.prototype.onBlur = function(event) {
	this.clearCompleteTimer();
	this.hideCompletion();
	if (this.delegate.blur) {
		this.delegate.blur(this);
	}
}

N2i.Input.Textfield.prototype.onFocus = function(event) {
	if (this.delegate.focus) {
		this.delegate.focus(this);
	}
}

N2i.Input.Textfield.prototype.onEscapeKey = function(event) {
	this.clearCompleteTimer();
	this.hideCompletion();
}

N2i.Input.Textfield.prototype.valueMightHaveChanged = function() {
	if (this.value!=this.element.value) {
		this.value = this.element.value;
		if (this.delegate.valueChanged) {
			this.delegate.valueChanged(this);
		}
		this.complete();
	}
}

N2i.Input.Textfield.prototype.clearCompleteTimer = function() {
	if (this.completeTimer) window.clearTimeout(this.completeTimer);
}

N2i.Input.Textfield.prototype.complete = function() {
	this.clearCompleteTimer();
	if (this.value.length<this.options.completeMinChars) {
		this.hideCompletion();
		return;
	};
	var self = this;
	this.completeTimer = window.setTimeout(
		function () {
			if (self.options.complete) {
				var delegate = {
					onSuccess : function(trans) {
						if (trans.responseXML) {
							self.updateCompletion(trans.responseXML);
						}
					},
					onFailure : function(trans) {
					}
				}
				self.getRequest().request(self.options.complete+self.value,delegate);
			}
			self.completeTimer=null;
		}
		,200
	);
}

N2i.Input.Textfield.prototype.updateCompletion = function(doc) {
	if (this.destoyed) return;
	var comp = this.getCompletion();
	var html = '';
	var items = doc.getElementsByTagName('item');
	this.completionSelection = -1;
	this.completionItems = [];
	if (items.length>0) {
		for (var i=0;i<items.length;i++) {
			var value = items[i].getAttribute('value');
			var title = items[i].getAttribute('title');
			var hint = items[i].getAttribute('hint');
			html+='<div onmousedown="this.parentNode.N2iTextfield.completionClicked('+i+');"><strong>'+title+'</strong><span>'+hint+'</span></div>';
			this.completionItems[i]={title:title,value:value,hint:hint};
		}
		comp.innerHTML=html;
		comp.style.display='block';
	} else {
		this.completionSelection = -1;
		this.completionItems = [];
		this.hideCompletion();
	}
}

N2i.Input.Textfield.prototype.completionClicked = function(num) {
	this.completionSelection = num;
	this.finishCompletion();
}

N2i.Input.Textfield.prototype.changeCompletion = function(dir) {
	if (!this.completion) return;
	var count = this.completionItems.length;
	if (count==0) {
		return;
	}
	
	var num = this.completionSelection;
	var old = this.completionSelection;
	var comp = this.getCompletion();
	var items = comp.getElementsByTagName('div');
	num+=dir;
	if (num>count-1) num=0;
	else if (num<0) num=count-1;
	items[num].className='selected';
	if (old>=0 && old!=num) {
		items[old].className='';
	}
	this.completionSelection=num;
}


N2i.Input.Textfield.prototype.finishCompletion = function() {
	var count = this.completionItems.length;
	if (this.completionSelection == undefined) return;
	if (this.completionSelection<0 && count==0) return;
	if (this.completionSelection<0 && count>0) {
		var item = this.completionItems[0];
	} else {
		var item = this.completionItems[this.completionSelection];
	}
	if (item.value != undefined ) {
		this.element.value = this.value = item.value;
		this.hideCompletion();
		if (this.delegate.completionFinished) {
			this.delegate.completionFinished(item);
		}
	}
}

N2i.Input.Textfield.prototype.hideCompletion = function() {
	if (this.completion) {
		this.completion.style.display='none';
	}
}

N2i.Input.Textfield.prototype.getCompletion = function() {
	if (!this.completion) {
		this.completion = document.createElement('div');
		this.completion.N2iTextfield = this;
		with (this.completion) {
			className='completion';
			style.width=N2i.Element.getWidth(this.element)+'px';
			style.position='absolute';
			//style.top=N2i.Element.getTop(this.element)+N2i.Element.getHeight(this.element)+'px';
			style.left=N2i.Element.getLeft(this.element)+'px';
			style.display='none';
		}
		if (N2i.Browser.isIE()) {
			this.completion.style.marginTop=N2i.Element.getHeight(this.element)+'px';
			this.completion.style.marginLeft='2px';
		}
		this.element.parentNode.appendChild(this.completion);
	}
	return this.completion;
}

N2i.Input.Textfield.prototype.getRequest = function() {
	if (!this.request) {
		this.request = new N2i.Request();
	}
	return this.request;
}