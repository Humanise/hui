oo.community.Home = function() {
	this.images = [];
	this.searchField = hui.ui.get('filter');
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
		var cloud = hui.get('tags_container');
		cloud.innerHTML = '';
		hui.log(tags);
		hui.each(tags,function(key,value) {
			var element = hui.build('a',{'class':'tag tag-'+Math.round(5*value)});
			hui.build('span',{text:key,href:'#',parent:element});
			hui.listen(element,'click',function(e) {self.setSearch(key);hui.stop(e)});
			cloud.appendChild(element);
			cloud.appendChild(document.createTextNode(' '));
		});
	},
	buildImages : function(images) {
		this.dirtyImages = true;
		this.images = images;
		var container = hui.get('images_container');
		hui.dom.clear(container);
		var self = this;
		hui.each(images,function(image,index) {
			var thumbnail = oo.buildThumbnail({height:60,image:image,zoom:true});
			hui.style.set(thumbnail,{opacity:0});
			hui.animate(thumbnail,'opacity',1,500,{ease:hui.ease.slowFast,delay:Math.random()*1000});
			container.appendChild(thumbnail);
		});
	},
	buildUsers : function(users) {
		var container = hui.get('users_container');
		hui.dom.clear(container);
		hui.each(users,function(pair) {
			var element = hui.build('div',{'class':'user'});
			element.appendChild(oo.buildThumbnail({width:50,height:60,variant:'user'}));
			element.appendChild(hui.build('p',{'class':'name',html:'<a class="oo_link" href="'+oo.appContext+'/'+pair.user.username+'/">'+
				'<span>'+pair.person.name+'</span></a>'}));
			element.appendChild(hui.build('p',{'class':'username',text:pair.user.username}));
			element.appendChild(hui.build('p',{'class':'website',html:'<a class="oo_link oo_link_dimmed" href="'+oo.community.Home.buildUserURL(pair.user.username)+'"><span>Website »</span></a>'}));
			container.appendChild(element);
		});
	}
}

oo.community.Home.buildUserURL = function(username) {
	return 'http://'+oo.baseDomainContext+'/'+username+'/site/';
	return oo.domainIsIP
		? 'http://'+oo.baseDomainContext+'/'+username+'/site/'
		: 'http://'+username+'.'+oo.baseDomainContext+'/';
}

hui.ui.onReady(function() {new oo.community.Home();});