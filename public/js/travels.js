var App = (function() {
	var map = null;
	var infoWindow = null;

	var allMarkers = null;
	var currentMarker = null;
	var currentMetadata = null;

	/**
	 * When window loading finished
	 */
	var onWindowLoaded = function(element) {
		map = new google.maps.Map(document.getElementById(element), {
			zoom: 7
		});

		retrieveAllMarkers();
		useGeolocation();
	};

	var useGeolocation = function() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(pos);
			}, noGeolocation);
		}
		else {
			noGeolocation();
		}
	};

	var noGeolocation = function() {
		var position = new google.maps.LatLng(50.62925, 3.05726);
		map.setCenter(position);
	};

	var retrieveAllMarkers = function() {

		$.ajax({
			url: '/marker',
			type: 'get',
			async: false,

			success: function(data) { allMarkers = data; displayAllMarkers(); },
			error: function(xhr, status, error) { alert('Erreur : ' + error); }
		});
	};

	var displayAllMarkers = function() {
		console.log(allMarkers);

		$.each(allMarkers, function(i, e) {
			var position = new google.maps.LatLng(e.latitude, e.longitude);

			var current = new google.maps.Marker({
				position: position,
				map: map
			});

			google.maps.event.addDomListener(current, 'click', function() {
				onMarkerClick(e, current);
			});
		});
	};

	var displayInfoWindow = function(marker, metadata) {

		var content = 'Description:<br/><textarea id="marker-description">';

		if(metadata) {
			content += metadata.description;
		}
		content += '</textarea><br/>';
		if(metadata) {
			content += '<button id="remove-marker" class="pull-left btn btn-danger btn-small">Supprimer</button>';
		}
		content += '<button id="save-marker" class="pull-right btn btn-success btn-small">Sauvegarder</button>';

		if(metadata) {
			currentMetadata = metadata;
		}
		else {
			currentMetadata = null;
		}

		if(infoWindow) {
			infoWindow.close();
		}

		infoWindow = new google.maps.InfoWindow({
			content: content
		});

		infoWindow.open(map, marker);
		google.maps.event.addDomListener(infoWindow, 'domready', function() {
			document.getElementById('save-marker').onclick = onSaveMarker;
			if(metadata) {
				document.getElementById('remove-marker').onclick = onRemoveMarker;
			}
		});
	};

	var onSaveMarker = function() {
		var metadata = null;

		if(currentMetadata) {
			onUpdateMarker();
		} else {
			onAddMarker();
		}
	};

	var onAddMarker = function() {
		var metadata = {
			description: document.getElementById('marker-description').value,
			latitude: currentMarker.getPosition().lat(),
			longitude: currentMarker.getPosition().lng()
		};

		$.ajax({
			url: '/marker',
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(metadata),

			success: function() { infoWindow.close(); },
			error: function() { alert('KO'); }
		});
	};

	var onUpdateMarker = function() {
		var metadata = currentMetadata;
		metadata.description = document.getElementById('marker-description').value;

		$.ajax({
			url: '/marker/' + metadata.id,
			type: 'put',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(metadata),

			success: function() { alert('OK'); },
			error: function() { alert('KO'); } 
		});
	};

	var onRemoveMarker = function() {
		$.ajax({
			url: '/marker/' + currentMetadata.id,
			type: 'delete',

			success: function() { currentMarker.setMap(null); },
			error: function() { alert('KO'); } 
		});
	};

	var onMarkerClick = function(metadata, marker) {
		currentMarker = marker;
		displayInfoWindow(marker, metadata);
	};

	/**
	 * Constructor
	 */
	var Travels = function(el) {
		google.maps.event.addDomListener(window, 'load', function() { onWindowLoaded(el); });
	};

	Travels.prototype.onSearchResult = function(location) {
		var position = new google.maps.LatLng(location.lat, location.lng);
		map.panTo(position);

		// Bug ! Remove also existing marker if searching
		if(currentMarker !== null) {
			currentMarker.setMap(null);
		}

		currentMarker = new google.maps.Marker({
			position: position,
			map: map
		});

		displayInfoWindow(currentMarker);
	};

	return Travels;
})();

