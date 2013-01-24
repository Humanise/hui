hui.ui.listen({
	
	userInfo : null,
	
	$ready : function() {
		hui.ui.request({
			url : 'getUserInfo',
			$object : function(info) {
				this.userInfo = info;
				this.init();
			}.bind(this),
			$failure : this.login.bind(this)
		})
	},
	login : function() {
		hui.ui.showMessage({text:'You are not logged in'});
	},
	init : function() {
		hui.drag.listen({
			element : document.body,
			hoverClass : 'hey',
			$dropURL : this.importUrl.bind(this),
			$dropText : this.addNote.bind(this),
			$dropFiles : this.addFiles.bind(this)
		})
		this.loadWidget({id:276576,position:{left:250,top:250}});
		//this.importUrl('http://0.tqn.com/d/dogs/1/0/G/2/0/-/disc_dog_DougPensinger-getty.jpg');
		//this.importUrl('http://vbn.aau.dk/files/19079591/Publication');
		//this.addUrl('http://daringfireball.net/2012/10/ipad_mini');
	},
	$valueChanged$keyboarder : function(text) {
		
	},
	$complete$keyboarder : function(obj) {
		hui.ui.request({
			url : 'complete',
			parameters : {text:obj.text},
			$object : obj.callback
		})
	},
	$select$keyboarder : function(obj) {
		window.open(obj.data.address)
		hui.ui.showMessage({text:obj.data.address,duration:3000});
	},
	
	loadWidget : function(options) {
		hui.ui.request({
			url : 'getWidget',
			parameters : {id:options.id},
			$object : function(obj) {
				new desktop[obj.type]({entity : obj.entity, position : options.position})
			}
		})
	},
	
	
	imports : {},
	importUrl : function(url,info) {
		hui.log('Importing url...',url)
		var event = info.event;
		var progress = this._createProgress({left:event.getLeft(),top:event.getTop()});
		hui.ui.request({
			url : 'importURL',
			parameters : {url:url},
			$object : function(info) {
				this.imports[info.id] = progress;
				this.checkImport(info);
			}.bind(this)
		})
	},
	states : {
		waiting:.1,transferring:.3,processing:.8,success:1,failure:0
	},
	checkImport : function(info) {
		var progress = this.imports[info.id];
		hui.log(info)
		progress.setValue(this.states[info.status]);
		if (info.status=='success') {
			var pos = hui.position.get(progress.element);
			
			if (info.entity) {
				this.loadWidget({id:info.entity.id,position:pos});
			} else {
				hui.ui.showMessage({text:'No object was created',icon:'common/warning',duration:4000});
			}
			this._removeProgress(progress);
		} else if (info.status=='failure') {
			hui.ui.showMessage({text:'The import failed',duration:4000});
			this._removeProgress(progress);
		} else {
			window.setTimeout(function() {
				hui.ui.request({
					url : 'getImport',
					parameters : {id:info.id},
					$object : this.checkImport.bind(this)
				})
				
			}.bind(this),200);
		}
	},
	
	addUrl : function(url) {
		bookmarkFormula.reset();
		bookmarkWindow.show();
		hui.defer(function() {
			bookmarkWindow.setBusy('Analyzing address...');
			hui.ui.request({
				url : 'analyzeURL',
				parameters : {url:url},
				$object : function(info) {
					bookmarkWindow.setBusy(false);
					bookmarkFormula.setValues(info)
					bookmarkFormula.focus();				
				}
			})			
		})
	},
	$submit$bookmarkFormula : function() {
		bookmarkWindow.hide();
		var values = bookmarkFormula.getValues();
		bookmarkFormula.reset();
		hui.ui.request({
			message : {start:'Saving address...',delay:300,success:'Address saved'},
			url : 'saveInternetAddress',
			json : {info:values},
			$success : function() {
				//
			}
		})
	},
	$click$cancelBookmark : function() {
		bookmarkFormula.reset();
		bookmarkWindow.hide();
	},
	
	addFiles : function(files,info) {
		/*
		hui.ui.request({
			url : hui.ui.context+"/app/desktop/upload",
			files : file,
			$success : function(obj) {
				hui.log(obj);
			}
		})*/
		var pos = {left:info.event.getLeft(),top:info.event.getTop()}
		this.uploadFile(files[0],pos);
	},
	_removeProgress : function(progress) {
		progress.reset();
		window.setTimeout(progress.destroy.bind(progress),2000);
	},
	_createProgress : function(pos) {
		var progress = hui.ui.ProgressIndicator.create({size:64});
		var element = progress.element;
		document.body.appendChild(element);
		hui.style.set(element,{position:'absolute',left:pos.left-32+'px',top:pos.top-32+'px'})
		return progress;		
	},
	
	uploadFile : function(file,pos) {
		var progress = this._createProgress(pos);
		
		hui.request({
			method : 'post',
			file : file,
			url : 'uploadFile',
			//parameters : this.options.parameters,
			onProgress : function(current,total) {
				progress.setValue(current/total);
			},
			onLoad : function() {
				//hui.ui.showMessage({text:'Uploading',busy:true})
			},
			onAbort : function() {
				// TODO
			}.bind(this),
			onSuccess : function(t) {
				var info = hui.string.fromJSON(t.responseText);
				if (info.entity) {
					this.loadWidget({id:info.entity.id,position:pos});
				} else {
					hui.log('No entity...',info);
				}
			}.bind(this),
			onFailure : function() {
				hui.ui.showMessage({text:'Failure',duration:3000})
			}.bind(this)
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

var desktop = {
	baseContext : '../..'
}

desktop.Image = function(options) {
	var url = desktop.baseContext+'/service/image/id'+options.entity.id+'width100height100cropped.jpg';
	this.element = hui.build('div',{'class':'widget_image',parent:document.body,
		style : { visibility: 'hidden' },
		html : '<img src="'+url+'"/>'
	});
	hui.style.set(this.element,{left : options.position.left-(this.element.clientWidth/2)+'px', top : options.position.top-(this.element.clientHeight/2)+'px'})
	hui.effect.bounceIn({element:this.element});
}
