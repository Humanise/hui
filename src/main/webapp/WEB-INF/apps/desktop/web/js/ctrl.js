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
			hoverClass : 'dropping',
			$dropURL : this.importUrl.bind(this),
			$dropText : this.addNote.bind(this),
			$dropFiles : this.addFiles.bind(this)
		})
		desktop.add();
		//this.loadWidget({id:276576,position:{left:250,top:250}});
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
				new desktop.widget[obj.type]({entity : obj.entity, position : options.position})
			},
			$failure : function() {
				hui.ui.showMessage({text:'Not found',duration:2000})
			}
		})
	},
	
	
	imports : {},
	importUrl : function(url,info) {
		hui.log('Importing url...',url)
		var event = info.event;
		var progress = this._createProgress({left:event.getLeft(),top:event.getTop()});
		hui.ui.request({
			url : 'importUrl',
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
		for (var i=0; i < files.length; i++) {
			var pos = {left:info.event.getLeft()+i*50,top:info.event.getTop()+i*50}
			this.uploadFile(files[i],pos);
		};
	},
	_removeProgress : function(progress) {
		window.setTimeout(progress.reset.bind(progress),2000);
		window.setTimeout(progress.destroy.bind(progress),3000);
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
			$progress : function(current,total) {
				progress.setValue(current/total);
			},
			$load : function() {
				//hui.ui.showMessage({text:'Uploading',busy:true})
			},
			$abort : function() {
				this._removeProgress(progress);
			}.bind(this),
			$success : function(t) {
				var info = hui.string.fromJSON(t.responseText);
				if (info.entity) {
					this.loadWidget({id:info.entity.id,position:pos});
				} else {
					hui.ui.showMessage({text:'The file could not be recognized', icon: 'common/warning',duration:3000})
				}
				this._removeProgress(progress);
			}.bind(this),
			$failure : function() {
				this._removeProgress(progress);
				hui.ui.showMessage({text:'The upload failed',duration:3000})
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