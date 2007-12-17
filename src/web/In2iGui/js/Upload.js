In2iGui.Upload = function(element,name) {
	this.element = $id(element);
	this.file = $class('file',this.element)[0];
	this.form = $tag('form',this.element)[0];
	this.name = name;
	In2iGui.enableDelegating(this);
	this.addBehavior();
	this.createProgressBar();
}

In2iGui.Upload.prototype.addBehavior = function() {
	var self = this;
	this.file.onchange = function() {
		self.submit();
	}
}

In2iGui.Upload.prototype.createProgressBar = function() {
	this.progressBar = In2iGui.ProgressBar.create();
	this.progressBar.hide();
	this.element.appendChild(this.progressBar.getElement());
}

In2iGui.Upload.prototype.submit = function() {
	this.form.submit();
	In2iGui.callDelegates(this,'uploadDidSubmit');
}

In2iGui.Upload.prototype.startProgress = function() {
	this.form.style.display='none';
	this.progressBar.show();
}

In2iGui.Upload.prototype.setProgress = function(value) {
	this.progressBar.setValue(value);
}

In2iGui.Upload.prototype.endProgress = function() {
	this.form.style.display='block';
	this.progressBar.reset();
	this.progressBar.hide();
}

In2iGui.Upload.prototype.getElement = function() {
	return this.element;
}

In2iGui.Upload.create = function(options) {
	var element = N2i.create('div');
	var form = N2i.create('form',{'action':options.action, 'method':'post', 'enctype':'multipart/form-data','target':'upload'});
	for (var i=0; i < options.parameters.length; i++) {
		var hidden = N2i.create('input',{'type':'hidden','name':options.parameters[i].name,'value':options.parameters[i].value});
		form.appendChild(hidden);
	};
	var file = N2i.create('input',{'type':'file','class':'file','name':options.name});
	form.appendChild(file);
	var iframe = N2i.create('iframe',{'name':'upload'},{'display':'none'});
	form.appendChild(iframe);
	element.appendChild(form);
	return new In2iGui.Upload(element);
}

//{action:'uploadImage',name:'file',parameters:[{name:'contentId',value:info.content.id}]}