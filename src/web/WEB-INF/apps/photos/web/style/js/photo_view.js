var photoView = {
	imageId : null,
	editable : false,
	
	$ready : function() {
		if (this.editable) {
			new oo.InlineEditor({
				element : 'editableTitle',
				name : 'titleEditor'
			});
			hui.listen(hui.get('words'),'click',this._onClickWord.bind(this))
		}
	},
	$valueChanged$titleEditor : function(value) {
		AppPhotos.updateImageTitle(this.imageId,value,{
			callback : function() {
				hui.ui.showMessage({text:'The title is changed',duration:1000,icon:'common/success'});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to change title',icon:'common/warning',duration:2000});
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
		var form = hui.ui.get('locationForm'),
			panel = hui.ui.get('locationPanel');
		AppPhotos.updateImageLocation(this.imageId,form.getValues().location,{
			callback : function() {
				oo.render({id:'properties'})
				hui.ui.showMessage({text:'The location is changed',duration:1000,icon:'common/success'});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to change location',icon:'common/warning',duration:2000});
			}
		})
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
		
		AppPhotos.updateImageDescription(this.imageId,text,{
			callback : function() {
				oo.update({id:'photos_photo_description'})
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to save description',icon:'common/warning',duration:2000});
			}
		})
	},
	
	$click$addWord : function() {
		if (!this._wordFinder) {
			this._wordFinder = hui.ui.Finder.create({
				name : 'wordFinder',
				title : {en:'Add word',da:'Tilføj ord'},
				list : {source : new hui.ui.Source({dwr:'AppWords.searchWords'}),pageParameter:'page'},
				search : {parameter:'text'}
			});
		}
		this._wordFinder.show();
	},
	$select$wordFinder : function(value) {
		this._wordFinder.clear();
		this._wordFinder.hide();
		AppPhotos.relateWordToImage(this.imageId,value.id,{
			callback : function() {
				oo.render({id:'properties'});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to add word',icon:'common/warning',duration:2000});
			}
		})
	},
	_removeWord : function(wordId) {
		AppPhotos.removeWordRelation(this.imageId,wordId,{
			callback : function() {
				oo.render({id:'properties'});
			},
			errorHandler : function() {
				hui.ui.showMessage({text:'Unable to remove word',icon:'common/warning',duration:2000});
			}
		})
	}
};

hui.ui.listen(photoView)