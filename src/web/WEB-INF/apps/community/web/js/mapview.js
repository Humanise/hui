oo.community.MapView = {
	
	map : null,
	markers : [],
	cursorMarker : null,
	
	$ready : function() {
		this.startMap();
		var id = hui.location.getHashParameter('image');
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
		google.maps.event.addListener(this.map, 'idle',this.updateMap.bind(this));
		google.maps.event.addListener(this.map, 'click',this.$_mapWasClicked.bind(this));
		
		this.cursorMarker = new google.maps.Marker({
			position: myLatlng, 
			map: this.map,
			draggable : true,
			icon:new google.maps.MarkerImage(
				oo.appContext+'/gfx/maps/pin_red.png',
				new google.maps.Size(18, 44),new google.maps.Point(0,0),new google.maps.Point(8,40)
			)
		});
		google.maps.event.addListener(this.cursorMarker, 'dblclick',function() {
			this.zoomIn(this.cursorMarker.getPosition());
		}.bind(this));
	},
	zoomIn : function(position) {
		if (position) {
			this.map.setCenter(position);
		}
		this.map.setZoom(this.map.getZoom()+1);
	},
	$valueChanged$mapSearch : function(query) {
		if (query==='') {
			$('map_search_result').update();
			return;
		}
		var self = this;
		AppCommunity.searchLocations({words:query},function(list) {
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
			marker.setMap();
		});
		this.markers = [];
	},
	showMarker : function(item) {
		var latLng = new google.maps.LatLng(item.key.latitude,item.key.longitude);
		this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		if (this.map.getZoom()==7) {
			this.map.setZoom(15);
		}
		this.map.setCenter(latLng);
	},
	updateMap : function() {
		var b = this.map.getBounds();
		var ne = {lat:b.getNorthEast().lat(),lng:b.getNorthEast().lng()};
		var sw = {lat:b.getSouthWest().lat(),lng:b.getSouthWest().lng()};
		
		AppCommunity.searchLocations({northEast:ne,southWest:sw},function(list) {
			this.clearMarkers();
			list.each(function(pair) {
				var pos = pair.key;
				var img = pair.value;
				var latLng = new google.maps.LatLng(pos.latitude,pos.longitude);
				var marker = new google.maps.Marker({
					position: latLng, 
					map: this.map,
					title:pos.name,
					icon:new google.maps.MarkerImage(
						oo.baseContext+'/service/image/id'+img.id+'width30height30cropped.jpg',
						new google.maps.Size(30, 30),new google.maps.Point(0,0),new google.maps.Point(15,49)
					),
					shadow:new google.maps.MarkerImage(
						oo.appContext+'/gfx/maps/image_frame.png',
						new google.maps.Size(36, 52),new google.maps.Point(0, 0),new google.maps.Point(18, 52)
					)
				});
				google.maps.event.addListener(marker, 'click',function() {
					this.markerClicked(img);
				}.bind(this));
				this.markers.push(marker);
			}.bind(this));
		}.bind(this));
	},
	markerClicked : function(img) {
		oo.community.showImage(img);
	},
	$_mapWasClicked : function(event) {
		this.cursorMarker.setPosition(event.latLng);
	}
}

hui.ui.listen(oo.community.MapView);