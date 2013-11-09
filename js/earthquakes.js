/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

$(function(){
	getQuakes();
});

function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes){
		gov.usgs.quakes = quakes;

		$('.message').html('Displaying ' + quakes.length + ' earthquakes');

		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
			center: new google.maps.LatLng(0,0),
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false
		});

		addQuakeMarkers(gov.usgs.quakes, gov.usgs.quakesMap);
	});
}

function addQuakeMarkers(quakes, map) {
	$.each(quakes, function(){
		if (this.location) {
			this.mapMarker = new google.maps.Marker({
				position: new google.maps.LatLng(this.location.latitude, this.location.longitude),
				map: map
			});

			var infoWindow = new google.maps.InfoWindow({
				content: new Date(this.datetime).toLocaleString() + ': magnitude ' + this.magnitude + ' at depth of ' + this.depth + ' meters'
			});

			registerInfoWindow(map, this.mapMarker, infoWindow);
		}
	});
}

function registerInfoWindow(map, marker, infoWindow) {
	google.maps.event.addListener(marker, 'click', function(){
		infoWindow.open(map, marker);
	});
}

