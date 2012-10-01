hui.ui.listen({
	$ready : function() {
		CoreSecurity.getUser({
			callback : function(user) {
				if (user.username=='public') {
					this.login();
				} else {
					this.init();
				}
			}.bind(this)
		})
	},
	login : function() {
		hui.ui.showMessage({text:'You are not logged in'});
	},
	init : function() {
		hui.drag.listen({
			element : document.body,
			hoverClass : 'hey',
			onURL : this.addUrl.bind(this),
			onText : this.addNote.bind(this),
			onFiles : this.addFiles.bind(this)
		})
		//this.addUrl('http://www.apple.com/iphone/design/');
		new hui.ui.KeyboardNavigator({name:'keyboarder'});

	},
	$valueChanged$keyboarder : function(text) {
		
	},
	$complete$keyboarder : function(obj) {
		AppDesktop.complete(obj.text,obj.callback);
	},
	$select$keyboarder : function(obj) {
		hui.log(obj.data);
		window.open(obj.data.address)
		hui.ui.showMessage({text:obj.data.address,duration:3000});
	},
	addUrl : function(url) {
		try {
			var win = hui.ui.Window.create({title:'New bookmark',padding:10,width:500});
			var form = hui.ui.Formula.create();
			form.buildGroup(null,[
				{type:'TextField',label:'Title',options:{key:'name'}},
				{type:'TextField',label:'Address',options:{key:'address',expanding:true}},
				{type:'TextField',label:'Summary',options:{key:'description',multiline:true}},
				{type:'TokenField',label:'Keywords',options:{key:'tags'}}
			])
			win.add(form);
			var buttons = hui.ui.Buttons.create({align:'right'});
			var create = hui.ui.Button.create({text:'Create',listener:{$click:function() {
				hui.ui.showMessage({text:'Saving address...',busy:true});
				AppDesktop.saveInternetAddress(form.getValues(),function() {
					hui.ui.showMessage({text:'Address saved',icon:'common/success',duration:2000});
				});
				win.hide();
			}}});
			buttons.add(create);
			win.add(buttons);
			hui.ui.showMessage({text:'Analyzing address...',busy:true});
			AppDesktop.analyzeURL(url,{callback:function(info) {
				hui.ui.hideMessage();
				form.setValues(info);
				win.show();
				form.focus();
			}})
		} catch (e) {
			hui.log(e)
		}
	},
	
	addFiles : function(file) {
		hui.ui.request({
			url : hui.ui.context+"/app/desktop/upload",
			files : file,
			$success : function(obj) {
				hui.log(obj);
			}
		})
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
	this.items = [];
	this.index = null;
	this.name = options.name;
	hui.listen(window,'keydown',this._onKeyDown.bind(this));
	this.element = hui.build('div',{'class':'hui_keyboardnavigator',parent:document.body})
	this.input = hui.build('p',{'class':'hui_keyboardnavigator_input',parent:this.element});
	this.list = hui.build('ul',{parent:this.element});
	this.listNodes = [];
	hui.ui.extend(this);
}

hui.ui.KeyboardNavigator.prototype = {
	_onKeyDown : function(e) {
		e = hui.event(e.key);
		if (e.metaKey || e.altKey || e.shiftKey || e.leftKey || e.rightKey) {
			return;
		} else if (e.downKey) {
			this._selectNext();
			return;
		} else if (e.upKey) {
			this._selectPrevious();
			return;
		} else if (e.returnKey || e.enterKey) {
			this._select();
			this.text = '';
			this._render();
			return;
		}
		if (e.escapeKey) {
			this.text = '';
		} else if (e.backspaceKey) {
			if (this.text.length>0) {
				this.text = this.text.substring(0,this.text.length-1);				
			} else {
				return;
			}
		} else {
			this.text+=String.fromCharCode(e.keyCode).toLowerCase();
		}
		this._render();
		if (this.text.length>0) {
			this._complete();			
		}
	},
	_select : function() {
		if (this.index!==null) {
			this.fire('select',this.items[this.index]);
		}
	},
	_selectPrevious : function() {
		if (this.items.length==0) {
			return;
		}
		if (this.index===null) {
			this.index = 0;
		} else {
			hui.cls.remove(this.listNodes[this.index],'hui_keyboardnavigator_selected');
		}
		this.index--;
		if (this.index < 0) {
			this.index = this.items.length-1;
		}
		hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
	},
	_selectNext : function() {
		if (this.items.length==0) {
			return;
		}
		if (this.index===null) {
			this.index = -1;
		} else {
			hui.cls.remove(this.listNodes[this.index],'hui_keyboardnavigator_selected');
		}
		this.index++;
		if (this.index>this.items.length-1) {
			this.index = 0;
		}
		hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
	},
	_render : function() {
		if (!this.text) {
			this.element.style.display='none';
			return;
		}
		hui.dom.setText(this.input,this.text);
		hui.dom.clear(this.list);
		this.listNodes = [];
		this.index = Math.min(this.index,this.items.length-1);
		for (var i=0; i < this.items.length; i++) {
			var item = this.items[i]
			var node = hui.build('li',{text:item.text,parent:this.list});
			this.listNodes.push(node);
		};
		if (this.index>-1) {
			hui.cls.add(this.listNodes[this.index],'hui_keyboardnavigator_selected');
		} else {
			this.index = null;
		}
		this.element.style.display = 'block';
		this.element.style.marginLeft = (this.element.clientWidth/-2)+'px';
		this.element.style.marginTop = (this.element.clientHeight/-2)+'px';
	},
	_complete : function() {
		this.fire('complete',{
			text : this.text,
			callback : function(items) {
				this.items = items;
				this._render();
			}.bind(this)
		});
	}
}