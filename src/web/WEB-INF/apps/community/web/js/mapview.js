oo.community.MapView = {
	map : null,
	markers : [],
	$interfaceIsReady : function() {
		this.startMap();
		var id = n2i.location.getHashParameter('image');
		if (id!==null) {
			AppCommunity.getImageLocation(id,function(location) {
				if (location) {
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(location.latitude,location.longitude), 
						map: this.map,
						title:"Hey!"
					});
				}
			}.bind(this));
		}
	},
	startMap : function() {		
		var myLatlng = new google.maps.LatLng(56.212814,11.531396);
		var myOptions = {
			zoom: 7,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		}
		this.map = new google.maps.Map(document.getElementById("map"), myOptions);
		n2i.log(this.map);
	},
	$valueChanged$mapSearch : function(query) {
		if (query==='') {
			$('map_search_result').update();
			return;
		}
			var self = this;
		AppCommunity.searchLocations(query,function(list) {
			var ol = new Element('ol');
			list.each(function(item) {
				var li = new Element('li');
				li.update('<img src="http://'+oo.baseDomainContext+'/service/image/id'+item.value.id+'width40height40cropped.jpg"/><strong>'+item.value.name+'</strong>')
				li.observe('click',function() {self.showMarker(item)});
				ol.insert(li);
			});
			$('map_search_result').update(ol);
		});
	},
	clearMarkers : function() {
		this.markers.each(function(marker) {
			marker.set_map();
		});
		this.markers = [];
	},
	showMarker : function(item) {
		this.clearMarkers();
		var latLng = new google.maps.LatLng(item.key.latitude,item.key.longitude);
		var marker = new google.maps.Marker({
			position: latLng, 
			map: this.map,
			title:item.key.name
		});
		this.markers.push(marker);
		this.map.set_mapTypeId(google.maps.MapTypeId.SATELLITE);
		if (this.map.get_zoom()==7) {
			this.map.set_zoom(15);
		}
		this.map.set_center(latLng);
	}
}

ui.get().listen(oo.community.MapView);