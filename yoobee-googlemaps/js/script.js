google.maps.event.addDomListener(window, "load", loadStyles);

var map, infoBox;

function loadStyles(){
	$.ajax({
		type: "GET",
		url: "data/styles.json",
		dataType: "json",
		success: function(data){
			console.log(data);

			initMap(data);
		},
		error: function(err){
			console.log("Error "+err.status);
			console.log(err);
		}
	});
}

function initMap(styles){
	var mapOptions = {
		center: {
			lat: -41.279214,
			lng: 174.780340
		},
		zoom: 14,
		disableDefaultUI: true,
		fullscreenControl: true,
		fullscreenControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		mapTypeControl: true,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP
		},
		styles: styles
	}

	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	addAllMarkers();
}

function addAllMarkers(){
	$.ajax({
		type: "GET",
		url: "data/markers.json",
		dataType: "json",
		success: function(data){
			console.log(data);

			for(var i = 0; i < data.length; i++){
				dropMarker(data[i], i + 1, i * 250);
			}
		},
		error: function(err){
			console.log("Error "+err.status);
			console.log(err);
		}
	});
}

function dropMarker(place,num,interval){
	setTimeout(function(){
		$("#placeList").append(
			$("<div class='placeList-item'>").click(function(){
				moveToMarker(marker);
			}).append(
				$("<h3>").text(place.placeName)
			).append(
				$("<p>").text(place.placeDesc)
			).append(
				$("<span>").text(place.address)
			)
		).append("<hr>");

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat, place.lng),
			title: place.placeName,
			description: place.placeDesc,
			address: place.address,
			lng: place.lng,
			lat: place.lat,
			map: map,
			animation: google.maps.Animation.DROP,
			label: num.toString()
		});

		markerClickEvent(marker);

	}, interval);
}

function markerClickEvent(marker){
	infoBox = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, "click", function(){
		moveToMarker(marker);
	});
}

function moveToMarker(marker){
	if(infoBox){
		infoBox.close();
	}

	map.panTo(new google.maps.LatLng(marker.lat, marker.lng));
	map.setZoom(17)

	infoBox.setContent("<div><h4>"+marker.title+"</h4><p>"+marker.address+"</p></div>");
	infoBox.open(map, marker);
}
