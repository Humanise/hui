/**
 * @constructor
 */
In2iGui.Tabs = function(o) {
	o = o || {};
	this.name = o.name;
	this.element = $(o.element);
	this.activeTab = -1;
	this.bar = this.element.select('.in2igui_tabs_bar ul')[0];
	this.tabs = this.bar.select('li');
	this.contents = this.element.select('.in2igui_tabs_tab');
	this.addBehavior();
	In2iGui.extend(this);
}

In2iGui.Tabs.create = function(options) {
	options = options || {};
	var e = options.element = new Element('div',{'class':'in2igui_tabs'});
	var bar = new Element('div',{'class' : options.small ? 'in2igui_tabs_bar in2igui_tabs_bar_small' : 'in2igui_tabs_bar'});
	e.insert(bar);
	var ul = new Element('ul');
	bar.insert(ul);
	return new In2iGui.Tabs(options);
}

In2iGui.Tabs.prototype = {
	addBehavior : function() {
		this.tabs.each(this.addTabBehavior.bind(this));
	},
	addTabBehavior : function(tab,index) {	
		tab.observe('click',function() {
			this.tabWasClicked(index);
		}.bind(this))
	},
	registerTab : function(obj) {
		obj.parent = this;
		this.tabs.push(obj);
	},
	tabWasClicked : function(index) {
		this.activeTab = index;
		this.updateGUI();
	},
	updateGUI : function() {
		for (var i=0; i < this.tabs.length; i++) {
			this.tabs[i].setClassName('in2igui_tabs_selected',i==this.activeTab);
			this.contents[i].setStyle({display : (i==this.activeTab ? 'block' : 'none')});
		};
	},
	createTab : function(options) {
		options = options || {};
		var tab = new Element('li').update('<a><span><span>'+options.title+'</span></span></a>');
		this.bar.insert(tab);
		this.addTabBehavior(tab,this.tabs.length);
		this.tabs.push(tab);
		var e = options.element = new Element('div',{'class':'in2igui_tabs_tab'});
		if (options.padding>0) {
			e.setStyle({'padding':options.padding+'px'});
		}
		this.contents.push(e);
		this.element.insert(e);
		if (this.activeTab==-1) {
			this.activeTab=0;
			tab.addClassName('in2igui_tabs_selected');
		} else {
			e.setStyle({display:'none'});			
		}
		return new In2iGui.Tab(options);
	}
};

/**
 * @constructor
 */
In2iGui.Tab = function(o) {
	this.name = o.name;
	this.element = $(o.element);
}

In2iGui.Tab.prototype = {
	add : function(widget) {
		this.element.insert(widget.element);
	}
}

/* EOF */