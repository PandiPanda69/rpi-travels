/**
 * Component in the navbar allowing user to search a position using its name.
 * Then use gapi to determine coordinates of the wished address.
 */
var SearchComponent = (function() {

	var inputId = null;
	var successCallback = null;

	/**
	 * Constructor
	 * @param input Input id containing the location to search
	 * @param button Button to be binded
	 * @param callback Callback to be called when search succeed.
	 */
	var theComponent = function(input, button, callback) {
		inputId = input;
		successCallback = callback || null;
		
		document.getElementById(button).onclick = doSearch;
		document.getElementById(input).onkeyup = function(e) {
			if(e.keyCode && e.keyCode == 13) {
				doSearch();
			}
		};
	};

	/**
	 * Triggered when user click on the search button.
	 */
	var doSearch = function() {
		var location = document.getElementById(inputId).value;

		var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
		url += encodeURI(location);

		$.ajax({
			url: url,
			type: 'get',
			
			success: onSuccess,
			error:   onError
		});
	};

	/**
	 * When an error occurred while querying gapi
	 */
	var onError = function(xhr, status, error) {
		alert('Error : ' + error);
	};

	/**
	 * If gapi answered us
	 */
	var onSuccess = function(data) {
		if(data.status !== 'OK') {
			alert('Echec : ' + data.status);
			return;
		}

		if(data.results.length > 1) {
			alert('Plusieurs résultats, veuillez affiner.');
			return;
		}

		var result = data.results[0];
		updateInputWithFullAddress(result.formatted_address);

		if(successCallback !== null) {
			successCallback(result.geometry.location);
		}
	};

	/**
	 * Update input field with the full retrieved address.
	 */
	var updateInputWithFullAddress = function(address) {
		document.getElementById(inputId).value = address;
	};

	return theComponent;
})();
