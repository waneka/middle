$(document).ready(function(){
  initialize()
  findLatLong('717 california st, san francisco')
  findLatLong('Mission, san francisco')
})

var geocoder = new google.maps.Geocoder()
var map, middle;
var centerpoint = {
  points: []
};

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 12
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
}

function findLatLong(address){
  geocoder.geocode( { 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latLng = results[0].geometry.location
      centerpoint.points.push(latLng)
      var marker = new google.maps.Marker({
          map: map,
          position: latLng
      })
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    recenterMap()
  })
}

function findTheMiddle(){
  return {
    lat: (centerpoint.points[0].nb + centerpoint.points[1].nb)/2,
    lng: (centerpoint.points[0].ob + centerpoint.points[1].ob)/2
  }
}

function recenterMap(){
  if (centerpoint.points.length == 2){
    var midPoint = findTheMiddle()
    middle = new google.maps.LatLng(midPoint.lat, midPoint.lng)
    map.setCenter(middle)
    populateTheMiddle()
  }
}

function populateTheMiddle(types){
  var types = types || ['cafe']
  map.setZoom(14) //temp hardcode

  var requestOptions = {
    location: middle,
    radius: '500',
    types: types,
  }

  var service = new google.maps.places.PlacesService(map)
  service.nearbySearch(requestOptions, createMarkers)
}

function createMarkers(results, status) {
  console.log(results)
  if (status == "ZERO_RESULTS"){
    alert("No results found")
  }
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
  resizeMap()
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function resizeMap(markers){
  //reset zoom level
}