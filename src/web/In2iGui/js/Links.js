/**
 * Simple container
 * @param {Object} The options
 * @constructor
 */
hui.ui.Links = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	this.items = [];
	this.addBehavior();
	this.selectedIndex = null;
	this.inputs = {};
}

hui.ui.Links.prototype = {
	addBehavior : function() {
		hui.listen(this.element,'click',this.onClick.bind(this));
		hui.listen(this.element,'dblclick',this.onDblClick.bind(this));
	},
	reset : function() {
		this.setValue([]);
	},
	setValue : function(items) {
		this.items = items;
		this.selectedIndex = null;
		this.build();
	},
	getValue : function() {
		return this.items;
	},
	onDblClick : function(e) {
		e = new hui.Event(e);
		hui.selection.clear();
		e.stop(e);
		var link = this.selectAndGetRow(e);
		var values = {text:link.text};
		values[link.kind]=link.value;
		this.editedLink = link;
		var win = this.getEditWindow();
		this.editForm.reset();
		this.editForm.setValues(values);
		win.show();
	},
	onClick : function(e) {
		e = new hui.Event(e);
		e.stop();
		var element = e.getElement();
		if (hui.hasClass(element,'in2igui_links_remove')) {
			var row = e.findByClass('in2igui_links_row');
			hui.ui.confirmOverlay({element:element,text:'Vil du fjerne linket?',okText:'Ja, fjern',cancelText:'Annuller',onOk:function() {
				this.items.splice(row.in2igui_index,1);
				if (this.selectedIndex===row.in2igui_index) {
					this.selectedIndex=null;
				}
				this.build();				
			}.bind(this)});
		} else {
			this.selectAndGetRow(e);
		}
	},
	selectAndGetRow : function(event) {
		var row = event.findByClass('in2igui_links_row');
		if (row) {
			var idx = row.in2igui_index;
			if (this.selectedIndex!==null) {
				var x = hui.byClass(this.element,'in2igui_links_row')[this.selectedIndex];
				hui.removeClass(x,'in2igui_links_row_selected')
			}
			this.selectedIndex = idx;
			hui.addClass(row,'in2igui_links_row_selected');
			return this.items[idx];
		}
	},
	build : function() {
		var list = this.list || hui.firstByClass(this.element,'in2igui_links_list'),
			i,item,row,infoNode,text,remove;
		list.innerHTML='';
		for (i=0; i < this.items.length; i++) {
			item = this.items[i];
			row = hui.build('div',{'class':'in2igui_links_row'});
			row.in2igui_index = i;
			
			row.appendChild(hui.ui.createIcon(item.icon,1));
			text = hui.build('div',{'class':'in2igui_links_text',text:item.text});
			row.appendChild(text);

			infoNode = hui.build('div',{'class':'in2igui_links_info',text:hui.wrap(item.info)});
			row.appendChild(infoNode);
			remove = hui.ui.createIcon('monochrome/round_x',1);
			hui.addClass(remove,'in2igui_links_remove');
			row.appendChild(remove);

			list.appendChild(row);
		};
	},
	addLink : function() {
		this.editedLink = null;
		this.getEditWindow().show();
		this.editForm.reset();
		this.editForm.focus();
	},
	getEditWindow : function() {
		if (!this.editWindow) {
			var win = this.editWindow = hui.ui.Window.create({title:'Link',width:300,padding:5});
			var form = this.editForm = hui.ui.Formula.create();
			var g = form.buildGroup({above:false},[
				{type:'Text',options:{label:'Tekst',key:'text'}}
			]);
			
			var url = hui.ui.Formula.Text.create({label:'URL',key:'url'});
			g.add(url);
			this.inputs['url']=url;
			
			var email = hui.ui.Formula.Text.create({label:'E-mail',key:'email'});
			g.add(email);
			this.inputs['email']=email;
			
			page = hui.ui.Formula.DropDown.create({label:'Side',key:'page',source:this.options.pageSource});
			g.add(page);
			this.inputs['page']=page;
			
			file = hui.ui.Formula.DropDown.create({label:'Fil',key:'file',source:this.options.fileSource});
			g.add(file);
			this.inputs['file']=file;
			
			var self = this;
			hui.each(this.inputs,function(key,value) {
				value.listen({$valueChanged:function(){self.changeType(key)}});
			});
			
			g.createButtons().add(hui.ui.Button.create({text:'Gem',submit:true,highlighted:true}));
			this.editForm.listen({$submit:this.saveLink.bind(this)});
			win.add(form);
			if (this.options.pageSource) {
				this.options.pageSource.refresh();
			}
			if (this.options.fileSource) {
				this.options.fileSource.refresh();
			}
		}
		return this.editWindow;
	},
	saveLink : function() {
		var v = this.editForm.getValues();
		var link = this.valuesToLink(v);
		var edited = this.editedLink;
		if (edited) {
			hui.override(edited,link);
		} else {
			this.items.push(link);
		}
		this.build();
		this.editForm.reset();
		this.editWindow.hide();
		this.editedLink = null;
	},
	valuesToLink : function(values) {
		var link = {};
		link.text = values.text;
		if (values.email!='') {
			link.kind='email';
			link.value=values.email;
			link.info=values.email;
			link.icon='monochrome/email';
		} else if (values.url!='') {
			link.kind='url';
			link.value=values.url;
			link.info=values.url;
			link.icon='monochrome/globe';
		} else if (hui.isDefined(values.page)) {
			link.kind='page';
			link.value=values.page;
			link.info=this.inputs['page'].getItem().title;
			link.icon='common/page';
		} else if (hui.isDefined(values.file)) {
			link.kind='file';
			link.value=values.file;
			link.info=this.inputs['file'].getItem().title;
			link.icon='monochrome/file';
		}
		return link;
	},
	changeType : function(type) {
		hui.each(this.inputs,function(key,value) {
			if (key!=type) {
				value.setValue();
			}
		});
	}
}

/* EOF */