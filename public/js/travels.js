var App = (function() {
	var element = null;
	var map = null;

	/**
	 * When window loading finished
	 */
	var onWindowLoaded = function() {
		map = new google.maps.Map(document.getElementById(element), {
			zoom: 7
		});

		useGeolocation();
	};

	var useGeolocation = function() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				
				var previousMarker = new google.maps.Marker({
					position: pos,
					map: map
				});
				
				map.setCenter(position);
				//onMarkerChanged();
				
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

	/**
	 * Constructor
	 */
	var Travels = function(el) {
		element = el;

		google.maps.event.addDomListener(window, 'load', onWindowLoaded);
	};

	return Travels;
})();

