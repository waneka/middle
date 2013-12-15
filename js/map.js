var GMap = {
  geocoder: new google.maps.Geocoder(),
  startingpoints: [],
  locationTypes: ['cafe'],

  initialize: function() {
    var mapOptions = {
      center: new google.maps.LatLng(37.7833, -122.4167),
      zoom: 12
    };
    this.gmap = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
  },

  findLatLong: function(address){
    var that = this;
    this.geocoder.geocode( { 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latLng = results[0].geometry.location
        that.startingpoints.push(latLng)
        var marker = new google.maps.Marker({
            map: that.gmap,
            position: latLng
        })
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
      that.recenterMap()
    })
  },

  findTheMiddle: function(){
    return {
      lat: (this.startingpoints[0].nb + this.startingpoints[1].nb)/2,
      lng: (this.startingpoints[0].ob + this.startingpoints[1].ob)/2
    }
  },

  recenterMap: function(){
    if (this.startingpoints.length == 2){
      var midPoint = this.findTheMiddle()
      themiddle = new google.maps.LatLng(midPoint.lat, midPoint.lng)
      this.gmap.setCenter(themiddle)
      this.populateTheMiddle()
    }
  },

  resetMap: function(){
    this.gmap.setZoom(14) //temp hardcode

    var mapOptions = {
      center: themiddle,
      zoom: 14
    };

    this.gmap = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
  },

  populateTheMiddle: function(){
    this.resetMap()
    if (this.locationTypes.length > 0){
      var requestOptions = {
        location: themiddle,
        radius: '500',
        types: this.locationTypes,
      }

      var service = new google.maps.places.PlacesService(this.gmap)
      service.nearbySearch(requestOptions, this.createMarkers)
    }
  },

  createMarkers: function(results, status) {
    if (status == "ZERO_RESULTS"){
      alert("No results found")
    }
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        GMap.createMarker(results[i]);
      }
    }
  },

  createMarker: function(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.gmap,
      position: place.geometry.location
    });
    var infowindow = new google.maps.InfoWindow({content:place.name})
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(GMap.gmap, marker);
      var directionsDisplay1 = new google.maps.DirectionsRenderer()
      var directionsDisplay2 = new google.maps.DirectionsRenderer()
      var directionsDisplay1m = new google.maps.DirectionsRenderer()
      var directionsDisplay2m = new google.maps.DirectionsRenderer()
      var directions1 = document.getElementsByClassName('directions1')[0]
      var directions2 = document.getElementsByClassName('directions2')[0]
      var directions1m = document.getElementsByClassName('directions1-mobile')[0]
      var directions2m = document.getElementsByClassName('directions2-mobile')[0]
      directions1.innerHTML=""
      directions2.innerHTML=""
      directions1m.innerHTML=""
      directions2m.innerHTML=""
      directionsDisplay1.setPanel(directions1)
      directionsDisplay1m.setPanel(directions1m)
      directionsDisplay2.setPanel(directions2)
      directionsDisplay2m.setPanel(directions2m)
      directions1.classList.remove('hidden')
      directions2.classList.remove('hidden')
      directions1m.classList.remove('hidden')
      directions2m.classList.remove('hidden')
      var request = {
        origin: document.getElementById('address1').value,
        destination: place.vicinity,
        travelMode: google.maps.TravelMode.DRIVING
      }
      var directionsService = new google.maps.DirectionsService()
      directionsService.route(request,function(response,status){
        if (status== google.maps.DirectionsStatus.OK){
          directionsDisplay1.setDirections(response)
          directionsDisplay1m.setDirections(response)
        }
      })
      request.origin = document.getElementById('address2').value
      directionsService.route(request,function(response,status){
        if (status== google.maps.DirectionsStatus.OK){
          directionsDisplay2.setDirections(response)
          directionsDisplay2m.setDirections(response)
        }
      })
    });
  },
}