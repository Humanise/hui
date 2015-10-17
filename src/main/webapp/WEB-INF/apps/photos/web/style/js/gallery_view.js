var galleryView = {
	galleryId : null,
	editable : false,
	username : null,
	
	$ready : function() {
    var data = hui.get.firstByClass(document.body,'js-gallery');
    this.galleryId = parseInt(data.getAttribute('data-id'),10);
    this.username = data.getAttribute('data-username');
    this.editable = data.getAttribute('data-editable') == 'true';
    
		if (this.editable) {
			new oo.InlineEditor({
				element : 'editableTitle',
				name : 'titleEditor'
			});
			hui.drag.listen({
				element : hui.get.firstByClass(document.body,'oo_layout_body'),
				hoverClass : 'photos_gallery_drop',
				$dropFiles : this._dropFiles.bind(this),
				$dropURL : this._dropURL.bind(this)
			})
		}
		var images = hui.get.byTag(document.body,'img');
		for (var i=0; i < images.length; i++) {
			images[i].onerror = function(e) {
				hui.log(e)
			}
			
		};
	},
	$click$present : function() {
		hui.ui.get('gallery').present();
	},
	_refreshImages : function() {
		hui.ui.get('gallery').refresh();
	},
	_clickImages : function(e) {
		e = hui.event(e);
		var a = e.findByTag('a');
		if (a && a.getAttribute('data')=='remove') {
			var img = a.parentNode.parentNode; 
			hui.ui.confirmOverlay({element:img,text:'Remove from gallery?',$ok : function() {
				this._removeImage(parseInt(img.getAttribute('data')))
			}.bind(this)});
			e.stop();
		}
	},
	
	_busyUploads : 0,
	
	_dropFiles : function(files) {
		this._busyUploads+=files.length;
		for (var i=0; i < files.length; i++) {
			this._addFile(files[i],i);
		};
	},
	_addFile : function(file,index) {
		var item = hui.ui.get('gallery').addIncoming();
		hui.ui.request({
			url : oo.appContext+'/uploadToGallery',
			parameters : {galleryId : this.galleryId, index : index},
			file : file,
			$object : function(images) {
				this._uploadEnded(item,images[0])
			}.bind(this),
			$success : function() {
				this._uploadEnded(item,true)
			}.bind(this),
			$failure : function() {
				this._uploadEnded(item,false)
			}.bind(this),
			$progress : function(loaded,total) {
				item.$progress(loaded/total);
			}
		});
	},
	_uploadEnded : function(item,object) {
		if (object) {
			item.$success(object);
		} else {
			item.$failure();
		}
		this._busyUploads--;
		if (this._busyUploads<1) {
			this._refreshImages();
		}
	},
	
	_addUpload : function() {
		var images = hui.get('photos_gallery_images');
		return hui.build('span',{parent:images});
	},
	
	_dropURL : function(url) {
	},
	
	$remove$gallery : function(info) {
		hui.ui.request({
			url : oo.appContext+'/removeImageFromGallery',
			parameters : {galleryId : this.galleryId, imageId : info.id},
			$finally : function() {
				info.callback();
			}.bind(this)
		});
	},
	
	$move$gallery : function(info) {
		hui.ui.request({
			url : oo.appContext+'/changeGallerySequence',
			json : {info:{galleryId : this.galleryId, images : info.images}},
			$failure : function() {
				hui.ui.msg.fail({text:'Unable to change image sequence'});
			},
			$finally : function() {
				info.callback();
			}
		});		
	},
	
	_removeImage : function(imageId) {
		hui.ui.request({
			message : {start:{en:'Removing image','da':'Fjerner billede'}, delay:300, success:{en:'The image is removed',da:'Billedet er fjernet'}},
			url : oo.appContext+'/removeImageFromGallery',
			parameters : {galleryId : this.galleryId, imageId : imageId},
			$success : function() {
				this._refreshImages();
			}.bind(this)
		});		
	},
	
	$click$deleteGallery : function(button) {
		hui.ui.confirmOverlay({widget:button,text:'Delete gallery?',$ok : function() {
			hui.ui.request({
				url : oo.appContext+'/deleteGallery',
				parameters : {id : this.galleryId},
				$success : function() {
					document.location = oo.appContext+'/'+oo.language+'/users/'+this.username;
				}.bind(this),
				$failure : function() {
					hui.ui.showMessage({text:'Unable to delete gallery',icon:'common/warning',duration:2000});
				}
			})
		}.bind(this)});
	},
	$valueChanged$titleEditor : function(value) {
		hui.ui.request({
			message : {start:{en:'Changing title','da':'Ændrer titel'}, delay:300, success:{en:'The title is changed',da:'Titlen er ændret'}},
			url : oo.appContext+'/updateGalleryTitle',
			parameters : {id:this.galleryId,title:value},
			$failure : function() {
				hui.ui.showMessage({text:{en:'Unable to change title',da:'Kunne ikke ændre titlen'},icon:'common/warning',duration:2000});
			},
			$success : function() {
				oo.update({id:'galleries',fade:true});
			}
		})
	},
	$click$addToGallery : function() {
		hui.ui.get('imageFinder').show();
	},
	$add$imageFinder : function(items) {
		hui.ui.request({
			url : oo.appContext+'/addImagesToGallery',
			json : {
				'info' : {galleryId : this.galleryId, images : items}
			},
			$success : function() {
				this._refreshImages();
			}.bind(this)
		});
	}
}

hui.ui.listen(galleryView);