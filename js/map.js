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
      lat: (this.startingpoints[0].d + this.startingpoints[1].d)/2,
      lng: (this.startingpoints[0].e + this.startingpoints[1].e)/2
    }
  },

  recenterMap: function(){
    if (this.startingpoints.length == 2){
      var midPoint = this.findTheMiddle()
      this.themiddle = new google.maps.LatLng(midPoint.lat, midPoint.lng)
      this.gmap.setCenter(this.themiddle)
      this.populateTheMiddle()
    }
  },

  resetMap: function(){
    this.gmap.setZoom(14) //temp hardcode

    var mapOptions = {
      center: this.themiddle,
      zoom: 14
    };

    this.gmap = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
  },

  populateTheMiddle: function(){
    this.resetMap()
    if (this.locationTypes.length > 0){
      var requestOptions = {
        location: this.themiddle,
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
    var marker = new google.maps.Marker({
      map: this.gmap,
      position: place.geometry.location
    });
    var infowindow = new google.maps.InfoWindow({content:place.name})
    this.addClickListener(place, marker, infowindow)
  },

  addClickListener: function(place, marker, infowindow){
    var that = this
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(GMap.gmap, marker);
      that.createDirections(place)
    })
  },

  createDirections: function(place){
    var directionsTarget = {
      1: document.getElementsByClassName('directions1')[0],
      2: document.getElementsByClassName('directions2')[0],
      mobile: {
        1: document.getElementsByClassName('directions1-mobile')[0],
        2: document.getElementsByClassName('directions2-mobile')[0]
      },
    }

    var directionsDisplay = {
      1: new google.maps.DirectionsRenderer(),
      2: new google.maps.DirectionsRenderer(),
      mobile: {
        1: new google.maps.DirectionsRenderer(),
        2: new google.maps.DirectionsRenderer()
      }
    }

    this.displayDirections(directionsTarget[1],directionsDisplay[1])
    this.displayDirections(directionsTarget[2],directionsDisplay[2])
    this.displayDirections(directionsTarget.mobile[1],directionsDisplay.mobile[1])
    this.displayDirections(directionsTarget.mobile[2],directionsDisplay.mobile[2])

    this.getDirections(place, directionsDisplay, 1)
    this.getDirections(place, directionsDisplay, 2)
    this.constructMailToLinks(place, directionsTarget, 1)
    this.constructMailToLinks(place, directionsTarget, 2)
  },

  getDirections: function(place, directionsDisplay, x){
    var directionsService = new google.maps.DirectionsService()
    var request = {
      origin: document.getElementById('address' + x).value,
      destination: place.vicinity,
      travelMode: google.maps.TravelMode.DRIVING
    }
    directionsService.route(request,function(response,status){
      if (status== google.maps.DirectionsStatus.OK){
        directionsDisplay[x].setDirections(response)
        directionsDisplay.mobile[x].setDirections(response)
      }
    })
  },

  displayDirections: function(el,renderer){
    el.innerHTML=""
    renderer.setPanel(el)
  },

  constructMailToLinks: function(place, directionsTarget, x){
    var mailto = "<a href='mailto:" + App.user.email[x] + "?subject=Meet+Me&"
    mailto += "body=http%3A%2F%2Fmaps.google.com/?saddr="
    mailto += App.user.address[x].replace(/\s/g, '%2B')
    mailto += "%26daddr="+ place.vicinity.replace(/\s/g, '%2B') + "'>Email Directions<a>"
    directionsTarget[x].innerHTML = directionsTarget[x].innerHTML + mailto
    directionsTarget.mobile[x].innerHTML = directionsTarget.mobile[x].innerHTML + mailto
  }

}