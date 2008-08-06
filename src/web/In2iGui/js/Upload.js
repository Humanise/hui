In2iGui.Upload = function(element,name,options) {
	this.element = $(element);
	this.name = name;
	this.file = $class('file',this.element)[0];
	this.form = $tag('form',this.element)[0];
	In2iGui.extend(this);
	this.loader = null;
	this.addBehavior();
	this.createProgressBar();
}

In2iGui.Upload.create = function(name,options) {
	var element = new Element('div',{'class':'in2igui_upload'});
	var form = new Element('form',{'action':options.action, 'method':'post', 'enctype':'multipart/form-data','encoding':'multipart/form-data','target':'upload'});
	for (var i=0; i < options.parameters.length; i++) {
		var hidden = new Element('input',{'type':'hidden','name':options.parameters[i].name,'value':options.parameters[i].value});
		form.insert(hidden);
	};
	var file = N2i.create('input',{'type':'file','class':'file','name':options.name});
	form.insert(file);
	element.insert(form);
	element.insert(new Element('iframe',{name:'upload',id:'upload'}).setStyle({display:'none'}));
	return new In2iGui.Upload(element,name,options);
}

In2iGui.Upload.prototype = {
	addBehavior : function() {
		var self = this;
		this.file.onchange = function() {
			self.submit();
		}
	},
	createProgressBar : function() {
		this.progressBar = In2iGui.ProgressBar.create();
		this.progressBar.hide();
		this.element.appendChild(this.progressBar.getElement());
	},
	submit : function() {
		this.form.submit();
		In2iGui.callDelegates(this,'uploadDidSubmit');
	},
	startProgress : function() {
		this.form.style.display='none';
		this.progressBar.show();
	},
	setProgress : function(value) {
		this.progressBar.setValue(value);
	},
	endProgress : function() {
		this.form.style.display='block';
		this.form.reset();
		this.progressBar.reset();
		this.progressBar.hide();
	}
}





//////////////////////////////////////// Mulit-upload ////////////////////////////////////////



In2iGui.MultiUpload = function(element,name,options) {
	this.options = {url:''};
	N2i.override(this.options,options);
	this.element = $(element);
	this.itemContainer = this.element.select('.in2igui_multiupload_items')[0];

	this.name = name;
	this.items = [];
	this.busy = false;

	this.button = this.element.select('.in2igui_button')[0];
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.MultiUpload.prototype = {
	addBehavior : function() {
		var self = this;
		this.button.observe('click',function() {
			self.loader.selectFiles();
		});
		document.observe('dom:loaded', function() {self.createLoader()});
	},
	createLoader : function() {
		var loc = new String(document.location);
		var url = loc.slice(0,loc.lastIndexOf('/')+1);
		url += this.options.url;
		var session = Cookie.get('JSESSIONID');
		if (session) {
			url+=';jsessionid='+session;
		}
		var self = this;
		this.loader = new SWFUpload({
			upload_url : url,
			flash_url : In2iGui.context+"/In2iGui/lib/swfupload/swfupload_f8.swf",
			file_size_limit : "20480",
			file_upload_limit : 100,
			debug : true,
			
			swfupload_loaded_handler : function() {self.loaded()},
			file_queued_handler : function(file) {self.fileQueued(file)},
			file_queue_error_handler : function(file, error, message) {self.fileQueueError(file, error, message)},
			file_dialog_complete_handler : function() {self.fileDialogComplete()},
			upload_start_handler : function() {self.uploadStart()},
			upload_progress_handler : function(file,complete,total) {self.uploadProgress(file,complete,total)},
			upload_error_handler : function(file, error, message) {self.uploadError(file, error, message)},
			upload_success_handler : function(file,data) {self.uploadSuccess(file,data)},
			upload_complete_handler : function(file) {self.uploadComplete(file)},
			queue_complete_handler : function() {self.queueComplete()},
		
			// SWFObject settings
			swfupload_pre_load_handler : function() {},
			swfupload_load_failed_handler : function() {}

		});
	},
	startNextUpload : function() {
		this.loader.startUpload();
	},
	addError : function(error,file) {
		var element = new Element('div',{'class':'in2igui_multiupload_item_error'});
		element.insert(new Element('a',{'class':'in2igui_link'}).update('<span>Fjern</span>').observe('click',function() {this.parentNode.remove(); return false;}));
		element.insert('<strong>'+In2iGui.MultiUpload.errors[error]+'</strong><br/><em>'+file.name+'</em>');
		this.itemContainer.insert(element);
	},
	
	//////////////////// Events //////////////
	
	loaded : function() {
		
	},
	fileQueued : function(file) {
		var item = new In2iGui.MultiUpload.Item(file);
		this.items[file.index] = item;
		this.itemContainer.insert(item.element);
	},
	fileQueueError : function(file, error, message) {
		this.addError(error,file);
	},
	fileDialogComplete : function() {
		this.startNextUpload();
	},
	uploadStart : function() {
		
	},
	uploadProgress : function(file,complete,total) {
		this.items[file.index].updateProgress(complete,total);
	},
	uploadError : function(file, error, message) {
		if (file) {
			this.items[file.index].update(file);
		}
		this.addError(error,file);
	},
	uploadSuccess : function(file,data) {
		this.items[file.index].updateProgress(file.size,file.size);
	},
	uploadComplete : function(file) {
		this.startNextUpload();
		var self = this;
		window.setTimeout(function() {
			self.items[file.index].hide();
		},100);
		In2iGui.callDelegates(this,'uploadDidComplete',file);
	},
	queueComplete : function() {
		
	}
}

In2iGui.MultiUpload.Item = function(file) {
	this.element = new Element('div').addClassName('in2igui_multiupload_item');
	this.info = new Element('strong');
	this.progress = In2iGui.ProgressBar.create();
	this.element.insert(this.progress.getElement());
	this.element.insert(this.info);
	this.update(file);
}

In2iGui.MultiUpload.Item.prototype = {
	update : function(file) {
		this.info.update(file.name);
	},
	updateProgress : function(complete,total) {
		this.progress.setValue(complete/total);
	},
	hide : function() {
		this.element.hide();
	}
}

if (window.SWFUpload) {
In2iGui.MultiUpload.errors = {};
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED]			= 'Der er for mange filer i køen';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]		= 'Filen er for stor';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]				= 'Filen er tom';
In2iGui.MultiUpload.errors[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]				= 'Filens type er ikke understøttet';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]					= 'Der skete en netværksfejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]			= 'Upload-adressen findes ikke';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.IO_ERROR]						= 'Der skete en IO-fejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]				= 'Der skete en sikkerhedsfejl';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]			= 'Upload-størrelsen er overskredet';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]				= 'Upload af filen fejlede';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]	= 'Filens id kunne ikke findes';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]		= 'Validering af filen fejlede';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]				= 'Filen blev afbrudt';
In2iGui.MultiUpload.errors[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]				= 'Upload af filen blev stoppet';
}
/* EOF */