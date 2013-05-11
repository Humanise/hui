var galleryView = {
	galleryId : null,
	editable : false,
	username : null,
	
	$ready : function() {
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
	_dropFiles : function(files) {
		for (var i=0; i < files.length; i++) {
			var file = files[i];
			hui.ui.request({
				url : oo.appContext+'/uploadToGallery',
				parameters : {galleryId : this.galleryId},
				file : file,
				$success : function() {
					this._refreshImages();
					hui.ui.showMessage({text:'Finished upload',icon:'common/success',duration:2000});
				}.bind(this)
			});
			
		};
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
			$success : function() {
				info.callback();
			}.bind(this)
		});
	},
	
	_removeImage : function(imageId) {
		hui.ui.request({
			url : oo.appContext+'/removeImageFromGallery',
			parameters : {galleryId : this.galleryId, imageId : imageId},
			$success : function() {
				this._refreshImages();
				hui.ui.showMessage({text:'Image removed',icon:'common/success',duration:2000});
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
			message : {start:'Updating title', delay:300, success:'The title is changed'},
			url : oo.appContext+'/updateGalleryTitle',
			parameters : {id:this.galleryId,title:value},
			$failure : function() {
				hui.ui.showMessage({text:'Unable to update tile',icon:'common/warning',duration:2000});
			},
			$success : function() {
				oo.update({id:'galleries'});
			}
		})
	},
}
