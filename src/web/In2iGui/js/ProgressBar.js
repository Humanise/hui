In2iGui.ProgressBar = function(element,name) {
	this.element = $(element);
	this.indicator = this.element.firstDescendant();
	this.name = name;
	In2iGui.extend(this);
}

In2iGui.ProgressBar.create = function(name) {
	var element = new Element('div',{'class':'in2igui_progressbar'}).insert(N2i.create('div'));
	return new In2iGui.ProgressBar(element,name);
}
	
In2iGui.ProgressBar.prototype = {
	setValue : function(value) {
		$ani(this.indicator,'width',(value*100)+'%',value==1 ? 10 : 200);
	},
	reset : function() {
		this.indicator.style.width='0%';
	},
	hide : function() {
		this.element.style.display = 'none';
	},
	show : function() {
		this.element.style.display = 'block';
	}
}

/* EOF */