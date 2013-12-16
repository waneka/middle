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

  displayDirections: function(el,renderer){
    el.innerHTML=""
    renderer.setPanel(el)
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
      that.getDirections(place)
    })
  },

  getDirections: function(place){
    var directionsTarget = {
      1: document.getElementsByClassName('directions1')[0],
      2: document.getElementsByClassName('directions2')[0],
      mobile: {
        1: document.getElementsByClassName('directions1-mobile')[0],
        2: document.getElementsByClassName('directions2-mobile')[0]
      },
    }
    var directionsDisplay1 = new google.maps.DirectionsRenderer()
    var directionsDisplay2 = new google.maps.DirectionsRenderer()
    var directionsDisplay1m = new google.maps.DirectionsRenderer()
    var directionsDisplay2m = new google.maps.DirectionsRenderer()
    GMap.displayDirections(directionsTarget[1],directionsDisplay1)
    GMap.displayDirections(directionsTarget[2],directionsDisplay2)
    GMap.displayDirections(directionsTarget.mobile[1],directionsDisplay1m)
    GMap.displayDirections(directionsTarget.mobile[2],directionsDisplay2m)
    var request1 = {
      origin: document.getElementById('address1').value,
      destination: place.vicinity,
      travelMode: google.maps.TravelMode.DRIVING
    }
    var directionsService1 = new google.maps.DirectionsService()
    directionsService1.route(request1,function(response,status){
      if (status== google.maps.DirectionsStatus.OK){
        directionsDisplay1.setDirections(response)
        directionsDisplay1m.setDirections(response)
      }
    })
    var directionsService2 = new google.maps.DirectionsService()
    var request2 = {
      origin: document.getElementById('address2').value,
      destination: place.vicinity,
      travelMode: google.maps.TravelMode.DRIVING
    }
    directionsService2.route(request2,function(response,status){
      if (status== google.maps.DirectionsStatus.OK){
        directionsDisplay2.setDirections(response)
        directionsDisplay2m.setDirections(response)
      }
    })
    this.constructMailToLinks(directionsTarget, place)
  },

  constructMailToLinks: function(directionsTarget, place){
    var mailto1 = "<a href='mailto:" + findEmail1() + "?subject=Meet+Me&"
    mailto1 += "body=http%3A%2F%2Fmaps.google.com/?saddr="
    mailto1 += window.location.search.match(/address1=([^&]*)&/)[1].replace(/\+/g, '%2B')
    mailto1 += "%26daddr="+ place.vicinity.replace(/\s/g, '%2B') + "'>Email Directions<a>"
    directionsTarget[1].innerHTML = directionsTarget[1].innerHTML + mailto1
    directionsTarget.mobile[1].innerHTML = directionsTarget.mobile[1].innerHTML + mailto1
    var mailto2 = "<a href='mailto:" + findEmail2() + "?subject=Meet+Me&"
    mailto2 += "body=http%3A%2F%2Fmaps.google.com/?saddr="
    mailto2 += window.location.search.match(/address2=([^&]*)/)[1].replace(/\+/g,'%2B')
    mailto2 += "%26daddr="+ place.vicinity.replace(/\s/g, '%2B') + "'>Email Directions<a>"
    directionsTarget[2].innerHTML = directionsTarget[2].innerHTML + mailto2
    directionsTarget.mobile[2].innerHTML = directionsTarget.mobile[2].innerHTML + mailto2
  }
}