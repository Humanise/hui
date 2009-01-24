(function() {

var p = In2iGui.ProgressBar = function(element,name,o) {
	this.options = o || {};
	this.element = $(element);
	this.indicator = this.element.firstDescendant();
	this.name = name;
	In2iGui.extend(this);
}

p.create = function(o) {
	o = o || {};
	var element = new Element('div',{'class':'in2igui_progressbar'}).insert(new Element('div'));
	if (o.small) element.addClassName('in2igui_progressbar_small');
	return new In2iGui.ProgressBar(element,o.name,o);
}

p.WAITING = 'in2igui_progressbar_small_waiting';
p.COMPLETE = 'in2igui_progressbar_small_complete';
	
p.prototype = {
	setValue : function(value) {
		var el = this.element;
		if (this.waiting) el.removeClassName(p.WAITING);
		el.setClassName(p.COMPLETE,value==1);
		n2i.ani(this.indicator,'width',(value*100)+'%',200);
	},
	setWaiting : function() {
		this.waiting = true;
		this.indicator.setStyle({width:0});
		this.element.addClassName(p.WAITING);
	},
	reset : function() {
		var el = this.element;
		if (this.waiting) el.removeClassName(p.WAITING);
		el.removeClassName(p.COMPLETE);
		this.indicator.style.width='0%';
	},
	hide : function() {
		this.element.style.display = 'none';
	},
	show : function() {
		this.element.style.display = 'block';
	}
}

}());

/* EOF */