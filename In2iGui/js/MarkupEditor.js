/**
 * @constructor
 */
In2iGui.MarkupEditor = function(options) {
	this.name = options.name;
	this.options = n2i.override({debug:false,value:'',autoHideToolbar:true,style:'font-family: sans-serif; font-size: 11px;'},options);
	if (options.replace) {
		options.replace = n2i.get(options.replace);
		options.element = n2i.build('div',{className:'in2igui_markupeditor'});
		options.replace.parentNode.insertBefore(options.element,options.replace);
		options.replace.style.display='none';
		options.value = options.replace.innerHTML;
	}
	this.element = n2i.get(options.element);
	this.impl = In2iGui.MarkupEditor.webkit;
	this.impl.initialize({element:this.element,controller:this});
	if (options.value) {
		this.impl.setHTML(options.value);
	}
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.MarkupEditor.create = function(options) {
	options = options || {};
	options.element = n2i.build('div',{className:'in2igui_markupeditor'});
	return new In2iGui.MarkupEditor(options);
}

In2iGui.MarkupEditor.prototype = {
	addBehavior : function() {
		
	},
	getValue : function() {
		return this.impl.getHTML();
	},
	focus : function() {
		this.impl.focus();
	},
	focused : function() {
		this.showBar();
	},
	blurred : function() {
		this.bar.hide();
		this.fire('blur');
	},
	showBar : function() {
		if (!this.bar) {
			var things = [
				{key:'strong',icon:'edit/text_bold'},
				{key:'em',icon:'edit/text_italic'}/*,
				{key:'insert-table',icon:'edit/text_italic'}*/
			]
			
			this.bar = In2iGui.Bar.create({absolute:true,small:true});
			n2i.each(things,function(info) {
				var button = new In2iGui.Bar.Button.create({icon:info.icon,stopEvents:true});
				button.listen({
					$click:function() {this.impl.format(info)}.bind(this)
				});
				this.bar.add(button);
			}.bind(this));
			this.bar.addToDocument();
		}
		this.bar.placeAbove(this);
		this.bar.show();
	}
}

In2iGui.MarkupEditor.webkit = {
	initialize : function(options) {
		this.element = options.element;
		this.element.style.overflow='auto';
		this.element.contentEditable = true;
		var ctrl = this.controller = options.controller;
		n2i.listen(this.element,'focus',function() {
			ctrl.focused();
		});
		n2i.listen(this.element,'blur',function() {
			ctrl.blurred();
		});
	},
	focus : function() {
		this.element.focus();
	},
	format : function(info) {
		if (info.key=='strong' || info.key=='em') {
			this._wrapInTag(info.key);
		} else if (info.key=='insert-table') {
			this._insertHTML('<table><tbody><tr><td>Lorem ipsum dolor</td><td>Lorem ipsum dolor</td></tr></tbody></table>');
		} else {
			document.execCommand(info.key,null,null);
		}
	},
	_wrapInTag : function(tag) {
		document.execCommand('inserthtml',null,'<'+tag+'>'+n2i.escape(n2i.getSelectedText())+'</'+tag+'>');
	},
	_insertHTML : function(html) {
		document.execCommand('inserthtml',null,html);
	},
	setHTML : function(html) {
		this.element.innerHTML = html;
	},
	getHTML : function() {
		return this.element.innerHTML;
	}
}

/* EOF */