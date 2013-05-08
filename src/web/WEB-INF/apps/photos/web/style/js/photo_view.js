var photoView = {
	imageId : null,
	editable : false,
	
	$ready : function() {
		if (this.editable) {
			new oo.InlineEditor({
				element : 'editableTitle',
				name : 'titleEditor'
			});
			this._addWordBehavior();
		}
	},
	_addWordBehavior : function() {
		hui.listen(hui.get('words'),'click',this._onClickWord.bind(this))
	},
	$valueChanged$titleEditor : function(value) {
		hui.ui.request({
			message : {start:'Updating title', delay:300, success:'The title is changed'},
			url : oo.appContext+'/updateTitle',
			parameters : {id:this.imageId,title:value},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to update tile',icon:'common/warning',duration:2000});
			}
		})
	},
	_onClickWord : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a) {
			hui.ui.confirmOverlay({element:a,text:'Delete word?',$ok : function() {
				this._removeWord(parseInt(a.getAttribute('data'),10));
			}.bind(this)})			
		}
	},
	$click$addLocation : function(widget) {
		var panel = hui.ui.get('locationPanel');
		panel.position(widget);
		panel.show()
	},
	$click$saveLocation : function() {
		var values = hui.ui.get('locationForm').getValues(),
			panel = hui.ui.get('locationPanel');
		
		hui.ui.request({
			message : {start:'Updating location', delay:300, success:'The location is changed'},
			url : oo.appContext+'/updateLocation',
			json : {id : this.imageId, location : values.location},
			$success : function() {
				oo.render({id:'properties'})
			},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to update location',icon:'common/warning',duration:2000});
			}
		});
		panel.hide();
	},
	$click$addDescription : function(button) {
		hui.ui.get('descriptionPages').next()
		hui.ui.get('description').focus();
	},
	$click$cancelDescription : function(button) {
		hui.ui.get('descriptionPages').next()
	},
	$click$saveDescription : function(button) {
		var text = hui.ui.get('description').getValue();
		hui.ui.request({
			message : {start:'Updating description',delay:300, success:'The description is changed'},
			url : oo.appContext+'/updateDescription',
			parameters : {id : this.imageId, description : text},
			$success : function() {
				oo.update({id:'photos_photo_description'});
			},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to update description',icon:'common/warning',duration:2000});
			}
		})
	},
	
	$add$words : function(info) {
		if (!this.imageId) {
			throw 'No id';
		}
		hui.ui.request({
			message : {start:'Adding word', delay:300, success:'The word is added'},
			url : oo.appContext+'/relateWord',
			parameters : {image : this.imageId, word : info.id},
			$success : info.callback,
			$failure : function() {
				hui.ui.showMessage({text:'Unable to add word',icon:'common/warning',duration:2000});
				info.callback();
			}
		})
	},
	
	$delete$words : function(info) {
		hui.ui.request({
			message : {start:'Removing word', delay:300, success:'The word is removed'},
			url : oo.appContext+'/removeWord',
			parameters : {image : this.imageId, word : info.id},
			$success : info.callback,
			$failure : function() {
				hui.ui.showMessage({text:'Unable to remove word',icon:'common/warning',duration:2000});
				info.callback();
			}
		})
	},
	
	$valueChanged$publicAccess : function(value) {
		hui.ui.request({
			message : {start:'Changing access', delay:300, success:'Access has changed'},
			url : oo.appContext+'/changeAccess',
			parameters : {image : this.imageId, 'public' : value},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to change access',icon:'common/warning',duration:2000});
			}
		})
	},
	
	$valueChanged$theMap : function(info) {
		hui.ui.request({
			message : {start:'Changing location', delay:300, success:'The location is changed'},
			url : oo.appContext+'/updateLocation',
			json : {id : this.imageId, location : info.location},
			$success : info.callback,
			$failure : function() {
				hui.ui.showMessage({text:'Unable to change location',icon:'common/warning',duration:2000});
				info.callback();
			}
		});
	}
};