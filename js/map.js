$(document).ready(function(){
  initialize()
  findLatLong('717 california st, san francisco')
  findLatLong('Pacifica, california')
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
            position: results[0].geometry.location
        })
        if (centerpoint.points.length == 2){
          var midPoint = findTheMiddle()
          map.setCenter(new google.maps.LatLng(midPoint.lat, midPoint.lng))
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


  //map.setCenter(latLng?)
  //$.each(centerpoint.points, function(i,latlong){})