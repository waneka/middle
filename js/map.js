$(document).ready(function(){
  initialize()
  findLatLong('717 california st, san francisco')
  findLatLong('Mission, san francisco')
})

var geocoder = new google.maps.Geocoder()
var map;
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
      if (centerpoint.points.length == 2){
        populateTheMiddle()
      }
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  })
}

function findTheMiddle(){
  return {
    lat: (centerpoint.points[0].nb + centerpoint.points[1].nb)/2,
    lng: (centerpoint.points[0].ob + centerpoint.points[1].ob)/2
  }
}

function populateTheMiddle(types){
  var types = types || ['cafe']
  var midPoint = findTheMiddle()
  var middle = new google.maps.LatLng(midPoint.lat, midPoint.lng)
  map.setCenter(middle)

  var requestOptions = {
    location: middle,
    radius: '500',
    types: types
  }

  var service = new google.maps.places.PlacesService(map)
  service.nearbySearch(requestOptions, createMarkers)
}

function createMarkers(results, status) {
  if (status == "ZERO_RESULTS"){
    alert("no results found")
  }
  console.log(results)
}