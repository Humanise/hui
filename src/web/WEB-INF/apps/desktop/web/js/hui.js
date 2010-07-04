if (!window.hui) {window.hui={
	
	widgets : new Hash(),
	listeners : [],

	latestWidgetName : 1,
	
	register : function(widget) {
		if (widget.name===undefined) {
			this.latestWidgetName++;
			widget.name = 'unnamed'+this.latestWidgetName;
		}
		this.widgets.set(widget.name,widget);
	},
	
}};

hui.Widget = new Class({
	initialize : function(options) {
		options = options || {};
		this.options = options;
		this.name = options.name;
		this.listeners = [];
		this.element = $(options.element);
		hui.register(this);
	},
	
	listen : function(listener) {
		this.listeners.push(listener);
	},
	
	fire : function(key,value) {
		key = '$'+key;
		for (var i = this.listeners.length - 1; i >= 0; i--){
			var l = this.listeners[i];
			if (l[key]) {
				l[key](value);
			}
		};
	}
});

hui.KeyboardNavigator = new Class( { Extends:hui.Widget,
	
	text : '',
	timer : null,
	
	initialize : function(options) {
		this.parent(options);
		$(window).addEvent('keydown', this.keyDown.bind(this));
		this.textContainer = this.element.getElement('span');
	},
	
	keyDown : function(event) {
		if (event.key=='esc') {
			window.clearTimeout(this.timer);
			this.end();
			return;
		}
		if (event.key=='backspace' && this.text.length>0) {
			this.text = this.text.substring(0,this.text.length-1);
			event.preventDefault();
		} else {
			this.text+=this.getChar(event);
			if (this.text.length=='') {
				return;
			}
		}
		this.textContainer.set('text',this.text);
		this.element.addClass('hui_keyboardnavigator_visible');
		window.clearTimeout(this.timer);
		this.timer = window.setTimeout(this.end.bind(this),20000);
		this.fire('textChanged',this.text);
	},
	
	getChar : function(event) {
		if (event.control || event.meta) {
			return '';
		}
		if (event.key=='space') {
			return ' ';
		}
		return event.key;
	},
	
	end : function() {
		this.text = '';
		this.element.removeClass('hui_keyboardnavigator_visible');
	}
});

hui.KeyboardNavigator.create = function(options) {
	options = options || {};
	var e = options.element = new Element('div.hui_keyboardnavigator');
	e.adopt(new Element('span'));
	document.body.adopt(e);
	return new hui.KeyboardNavigator(options);
}