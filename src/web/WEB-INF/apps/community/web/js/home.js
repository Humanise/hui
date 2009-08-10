oo.community.Home = function() {
	this.images = [];
	this.searchField = ui.get('filter');
	this.searchField.listen(this);
	this.search();
}

oo.community.Home.prototype = {
	$valueChanged$filter : function(value) {
		this.search(value);
	},
	setSearch : function(str) {
		this.searchField.setValue(str);
		this.search(str);
	},
	search : function(query) {
		if (this.busySearch) {
			this.waitingQuery=query;
			return;
		}
		this.waitingQuery = null;
		this.busySearch = true;
		var self = this;
		AppCommunity.getLatest(query,function(map) {
			self.buildImages(map.images);
			self.buildUsers(map.users);
			self.buildTags(map.tags);
			self.busySearch = false;
			if (self.waitingQuery) {
				self.search(self.waitingQuery);
			}
		});
	},
	buildTags : function(tags) {
		var self = this;
		tags = new Hash(tags);
		var cloud = $('tags_container');
		cloud.update();
		tags.each(function(entry) {
			var element = new Element('a').addClassName('tag tag-'+Math.round(5*entry.value));
			element.insert(new Element('span').update(entry.key));
			element.href='#';
			element.observe('click',function(e) {self.setSearch(entry.key);e.stop()});
			cloud.insert(element);
			cloud.appendChild(document.createTextNode(' '));
		});
	},
	buildImages : function(images) {
		this.dirtyImages = true;
		this.images = images;
		var container = $('images_container');
		container.update();
		var self = this;
		images.each(function(image,index) {
			var width = Math.round(image.width/image.height*60);
			var height = Math.round(image.height/Math.max(image.width,image.height)*60);
			var thumb = new Element('div').addClassName('thumbnail').setStyle({
				width:width+'px',opacity:0,'backgroundImage':'url("'+oo.baseContext+'/service/image/?id='+image.id+'&thumbnail='+Math.max(width,height)+'")'
			});
			thumb.observe('click',function(e) {
				self.imageWasClicked(index);
				e.stop();
			});
			thumb.observe('mouseover',function() {
				In2iGui.showToolTip({text:image.name,element:thumb});
			})
			thumb.observe('mouseout',function() {
				In2iGui.hideToolTip();
			})
			n2i.ani(thumb,'opacity',1,500,{ease:n2i.ease.slowFast,delay:Math.random()*1000});
			container.insert(thumb);
		});
	},
	buildUsers : function(users) {
		var container = $('users_container');
		container.update();
		users.each(function(pair) {
			var element = new Element('div').addClassName('user');
			element.insert(new Element('div').addClassName('thumbnail'));
			var html = '<p class="name">'+
				'<a class="link" href="'+oo.appContext+'/'+pair.user.username+'/">'+
				'<span>'+pair.person.name+'</span></a>'+
				'</p>'+
				'<p class="username">'+pair.user.username+'</p>'+
				'<p class="website"><a class="link" href="'+oo.community.Home.buildUserURL(pair.user.username)+'"><span>Website »</span></a></p>';
			element.insert(html);
			container.insert(element);
		});
	},
	imageWasClicked : function(index) {
		this.getViewer().show(index);
	},
	getViewer : function() {
		if (!this.viewer) {
			this.viewer = In2iGui.ImageViewer.create();
			this.viewer.addDelegate(this);
		}
		if (this.dirtyImages) {
			this.viewer.clearImages();
			this.viewer.addImages(this.images);
			this.dirtyImages = false;
		}
		return this.viewer;
	},
	$resolveImageUrl : function(image,width,height) {
		return oo.baseContext+'/service/image/?id='+image.id+'&width='+width+'&height='+height;
	}
}

oo.community.Home.buildUserURL = function(username) {
	return 'http://'+oo.baseDomainContext+'/'+username+'/site/';
	return oo.domainIsIP
		? 'http://'+oo.baseDomainContext+'/'+username+'/site/'
		: 'http://'+username+'.'+oo.baseDomainContext+'/';
}

In2iGui.onDomReady(function() {new oo.community.Home();});