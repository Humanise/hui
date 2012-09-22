hui.ui.listen({
	$ready : function() {
		CoreSecurity.getUser(function(user) {
			
		}.bind(this))
	},
	init : function() {
		hui.drag.listen({
			element : document.body,
			hoverClass : 'hey',
			onURL : this.addUrl.bind(this),
			onText : this.addNote.bind(this),
			onFiles : this.addFile.bind(this)
		})
		this.addUrl('http://www.apple.com/iphone/design/');
		new hui.ui.KeyboardNavigator({name:'keyboarder'});

	},
	$valueChanged$keyboarder : function(text) {
		
	},
	
	addUrl : function(url) {
		try {
			var win = hui.ui.Window.create({title:'New bookmark',padding:10,width:500});
			var form = hui.ui.Formula.create();
			form.buildGroup(null,[
				{type:'TextField',label:'Address',options:{value:url,expanding:true}}
			])
			win.add(form);
			var buttons = hui.ui.Buttons.create({align:'right'});
			var create = hui.ui.Button.create({text:'Create'});
			buttons.add(create);
			win.add(buttons);
			win.show();
		} catch (e) {
			hui.log(e)
		}
	},
	
	addFiles : function(file) {
		
	},
	
	
	addNote : function(text) {
		try {
			var win = hui.ui.Window.create({title:'New note',padding:5,variant:'news',width:500});
			var form = hui.ui.Formula.create();
			form.buildGroup(null,[
				{type:'TextField',options:{value:text,multiline:true}}
			])
			win.add(form);
			var buttons = hui.ui.Buttons.create({align:'right'});
			var create = hui.ui.Button.create({text:'Create'});
			buttons.add(create);
			win.add(buttons);
			win.show();
		} catch (e) {
			hui.log(e)
		}
	}
})

hui.ui.KeyboardNavigator = function(options) {
	options = options || {};
	this.text = '';
	this.name = options.name;
	hui.listen(window,'keydown',this._onKeyDown.bind(this));
	this.element = hui.build('div',{parent:document.body,style:'display: none; left: 50%; top: 50%; position: absolute; background: rgba(0,0,0,.5); color: #fff; font-size: 18px; padding: 3px 8px; border-radius: 5px;'})
}

hui.ui.KeyboardNavigator.prototype = {
	_onKeyDown : function(e) {
		e = hui.event(e.key);
		if (e.backspaceKey && this.text.length>0) {
			this.text = this.text.substring(0,this.text.length-1);			
		} else {
			this.text+=String.fromCharCode(e.keyCode).toLowerCase();
		}
		this._display();
		this.fire('valueChanged',this.text);
	},
	_display : function() {
		hui.dom.setText(this.element,this.text);
		this.element.style.display='block'
		this.element.style.marginLeft=(this.element.clientWidth/-2)+'px'
	}
}