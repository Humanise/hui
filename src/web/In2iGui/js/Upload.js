/**
 * @class
 *
 * Options
 * {url:'',parameters:{}}
 *
 * Events:
 * uploadDidCompleteQueue
 * uploadDidStartQueue
 * uploadDidComplete(file)
 */
In2iGui.Upload = function(o) {
	o = this.options = n2i.override({url:'',parameters:{}},o);
	this.element = $(o.element);
	this.itemContainer = this.element.select('.in2igui_upload_items')[0];
	this.status = this.element.select('.in2igui_upload_status')[0];
	this.name = o.name;
	this.items = [];
	this.busy = false;
	this.loaded = false;
	this.flashMode = swfobject.hasFlashPlayerVersion("8");
	In2iGui.extend(this);
	this.addBehavior();
}

In2iGui.Upload.create = function(o) {
	o = o || {};
	o.element = new Element('div',{'class':'in2igui_upload'});
	o.element.update('<div class="in2igui_upload_placeholder"></div>'+
		'<div class="in2igui_upload_items"></div>'+
		'<div class="in2igui_upload_status"></div>'+
	'</div>');
	return new In2iGui.Upload(o);
}

In2iGui.Upload.prototype = {
	addBehavior : function() {
		var self = this;
		if (!this.flashMode) {
			this.createIframeVersion();
			return;
		}
		if (In2iGui.get().domLoaded) {
			this.createFlashVersion();			
		} else {
			In2iGui.onDomReady(function() {self.createFlashVersion()});
		}
	},
	
	/////////////////////////// Iframe //////////////////////////
	
	createIframeVersion : function() {
		var container = new Element('div',{'class':'in2igui_upload'});
		var form = new Element('form',{'action':this.options.url || '', 'method':'post', 'enctype':'multipart/form-data','encoding':'multipart/form-data','target':'upload'});
		if (this.options.parameters) {
			$H(this.options.parameters).each(function(pair) {
				var hidden = new Element('input',{'type':'hidden','name':pair.key});
				hidden.setValue(pair.value);
				form.insert(hidden);
			});
		}
		var file = new Element('input',{'type':'file','class':'file','name':this.options.name});
		var self = this;
		file.onchange = function() {self.iframeSubmit()}
		form.insert(file);
		container.insert(form);
		var iframe = new Element('iframe',{name:'upload',id:'upload'}).setStyle({display:'none'});
		iframe.observe('load',function() {self.iframeUploadComplete()});
		container.insert(iframe);
		this.progressBar = In2iGui.ProgressBar.create();
		this.progressBar.hide();
		container.insert(this.progressBar.getElement());
		this.form = form;
		this.element.insert(container);
	},
	iframeUploadComplete : function() {
		if (!this.uploading) return;
		this.uploading = false;
		this.form.reset();
		this.fire('uploadDidCompleteQueue');
	},
	iframeSubmit : function() {
		this.uploading = true;
		// IE: set value of parms again since they disappear
		var p = this.options.parameters;
		for (var i=0; i < p.length; i++) {
			this.form[p[i].name].value=p[i].value;
		};
		this.form.submit();
		this.fire('uploadDidSubmit');
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
	},
	
	parentShown : function() {
		this.updateButtonPosition();
	},
	clear : function() {
		for (var i=0; i < this.items.length; i++) {
			if (this.items[i]) {
				this.items[i].destroy();
			}
		};
		this.items = [];
		this.itemContainer.hide();
		this.status.update();
	},
	
	/////////////////////////// Flash //////////////////////////
	
	createFlashVersion : function() {
		var loc = new String(document.location);
		var url = loc.slice(0,loc.lastIndexOf('/')+1);
		url += this.options.url;
		var session = n2i.cookie.get('JSESSIONID');
		if (session) {
			url+=';jsessionid='+session;
		}
		//var size = this.button.getDimensions();
		var size = {width:108,height:28};
		var self = this;
		this.loader = new SWFUpload({
			upload_url : url,
			flash_url : In2iGui.context+"/In2iGui/lib/swfupload/swfupload.swf",
			file_size_limit : "20480",
			file_upload_limit : 100,
			debug : true,
			post_params : this.options.parameters,
			button_placeholder_id : 'x',
			button_placeholder : this.element.select('.in2igui_upload_placeholder')[0],
			button_width : size.width,
			button_height : size.height,

			swfupload_loaded_handler : function() {self.flashLoaded()},
			file_queued_handler : self.fileQueued.bind(self),
			file_queue_error_handler : function(file, error, message) {self.fileQueueError(file, error, message)},
			file_dialog_complete_handler : function() {self.fileDialogComplete()},
			upload_start_handler : function() {self.uploadStart()},
			upload_progress_handler : function(file,complete,total) {self.uploadProgress(file,complete,total)},
			upload_error_handler : function(file, error, message) {self.uploadError(file, error, message)},
			upload_success_handler : function(file,data) {self.uploadSuccess(file,data)},
			upload_complete_handler : function(file) {self.uploadComplete(file)},
		
			// SWFObject settings
			swfupload_pre_load_handler : function() {alert('swfupload_pre_load_handler!')},
			swfupload_load_failed_handler : function() {alert('swfupload_load_failed_handler!')}
		});
		if (this.options.button) {
			this.setButton(In2iGui.get(this.options.button));
		}
	},
	setButton : function(widget) {
		this.button = widget;
		if (this.button && this.flashMode) {
			var m = this.element.select('object')[0].remove();
			m.setStyle({width:'108px','marginLeft':'-108px',position:'absolute'});
			widget.getElement().insert(m);
			return;
		}
	},
	updateButtonPosition : function() {
		if (this.button) {
			var f = this.button.element.select('object')[0];
			if (f) {
				var w = this.button.element.getWidth();
				f.setStyle({width:w+'px','marginLeft':'-'+w+'px',position:'absolute'})
			}
		}
	},
	startNextUpload : function() {
		this.loader.startUpload();
	},
	addError : function(error,file) {
		var element = new Element('div',{'class':'in2igui_upload_item_error'});
		element.insert(new Element('a',{'class':'in2igui_link'}).update('<span>Fjern</span>').observe('click',function() {this.parentNode.remove(); return false;}));
		element.insert('<strong>'+In2iGui.Upload.errors[error]+'</strong><br/><em>'+file.name+'</em>');
		this.itemContainer.insert(element);
	},
	
	//////////////////// Events //////////////
	
	flashLoaded : function() {
		this.loaded = true;
	},
	fileQueued : function(file) {
		var item = new In2iGui.Upload.Item(file);
		this.items[file.index] = item;
		this.itemContainer.insert(item.element);
		this.itemContainer.setStyle({display:'block'});
	},
	fileQueueError : function(file, error, message) {
		this.addError(error,file);
	},
	fileDialogComplete : function() {
		this.startNextUpload();
	},
	uploadStart : function() {
		if (!this.busy) {
			this.fire('uploadDidStartQueue');
		}
		this.busy = true;
	},
	uploadProgress : function(file,complete,total) {
		this.updateStatus();
		this.items[file.index].updateProgress(complete,total);
	},
	uploadError : function(file, error, message) {
		if (file) {
			this.items[file.index].update(file);
		}
	},
	uploadSuccess : function(file,data) {
		this.items[file.index].updateProgress(file.size,file.size);
	},
	uploadComplete : function(file) {
		this.items[file.index].update(file);
		this.startNextUpload();
		var self = this;
		this.fire('uploadDidComplete',file);
		if (this.loader.getStats().files_queued==0) {
			this.fire('uploadDidCompleteQueue');
		}
		this.updateStatus();
		this.busy = false;
	},
	
	/// Status ///
	updateStatus : function() {
		var s = this.loader.getStats();
		this.status.update('Status: '+Math.round(s.successful_uploads/this.items.length*100)+'%');
		n2i.log(s);
	}
}

In2iGui.Upload.Item = function(file) {
	this.element = new Element('div').addClassName('in2igui_upload_item');
	if (file.index % 2 == 1) {
		this.element.addClassName('in2igui_upload_item_alt')
	}
	this.content = new Element('div').addClassName('in2igui_upload_item_content');
	this.icon = In2iGui.createIcon('file/generic',2);
	this.element.insert(this.icon);
	this.element.insert(this.content);
	this.info = new Element('strong');
	this.status = new Element('em');
	this.progress = In2iGui.ProgressBar.create({small:true});
	this.content.insert(this.progress.getElement());
	this.content.insert(this.info);
	this.content.insert(this.status);
	this.update(file);
}

In2iGui.Upload.Item.prototype = {
	update : function(file) {
		this.status.update(In2iGui.Upload.status[file.filestatus]);
		this.info.update(file.name);
		if (file.filestatus==SWFUpload.FILE_STATUS.ERROR) {
			this.element.addClassName('in2igui_upload_item_error');
			this.progress.hide();
		}
	},
	updateProgress : function(complete,total) {
		this.progress.setValue(complete/total);
	},
	hide : function() {
		this.element.hide();
	},
	destroy : function() {
		this.element.remove();
	}
}

if (window.SWFUpload) {
(function(){
	var e = In2iGui.Upload.errors = {};
	e[SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED]			= 'Der er for mange filer i køen';
	e[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT]		= 'Filen er for stor';
	e[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE]				= 'Filen er tom';
	e[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE]				= 'Filens type er ikke understøttet';
	e[SWFUpload.UPLOAD_ERROR.HTTP_ERROR]					= 'Der skete en netværksfejl';
	e[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL]			= 'Upload-adressen findes ikke';
	e[SWFUpload.UPLOAD_ERROR.IO_ERROR]						= 'Der skete en IO-fejl';
	e[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR]				= 'Der skete en sikkerhedsfejl';
	e[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED]		= 'Upload-størrelsen er overskredet';
	e[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED]				= 'Upload af filen fejlede';
	e[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND]	= 'Filens id kunne ikke findes';
	e[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED]		= 'Validering af filen fejlede';
	e[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED]				= 'Filen blev afbrudt';
	e[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]				= 'Upload af filen blev stoppet';
	e[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED]				= 'Upload af filen blev stoppet';
	var s = In2iGui.Upload.status = {};
	s[SWFUpload.FILE_STATUS.QUEUED] = 'Filen er i kø';
	s[SWFUpload.FILE_STATUS.IN_PROGRESS] = 'Filen er i gang';
	s[SWFUpload.FILE_STATUS.ERROR] = 'Filen gav fejl';
	s[SWFUpload.FILE_STATUS.COMPLETE] = 'Filen er færdig';
	s[SWFUpload.FILE_STATUS.CANCELLED] = 'Filen er afbrudt';
}())
}
/* EOF */