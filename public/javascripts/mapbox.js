var Map = {
  startingPoints: [],
  locationTypes: ['coffee'],
  counter: 0,
  initPop: false,

  init: function() {
    this.map = L.mapbox.map('map', 'waneka.i5nnfp13').setView([37.7833, -122.4167], 13);
    this.featureLayer = L.mapbox.featureLayer().addTo(this.map)
    this.humanLayer = L.mapbox.featureLayer().addTo(this.map)
  }
  ,

  findLocation: function(address, email) {
    var self = this
    self.startingPoints = []
    var geocoder = L.mapbox.geocoder('waneka.i5nnfp13')
    geocoder.query(address, function(err, result) {
      var location = {
        location: result.latlng,
        email: email
      }
      self.startingPoints.push(location)
      self.recenterMap()
    })
  },

  recenterMap: function() {
    if (this.startingPoints.length === 2) {
      this.middle = this.findTheMiddle()
      this.setStartingMarkers()
      this.fetchVenueResults()
      this.populateTheMiddle()
    }
  },

  setStartingMarkers: function() {
    var humanLocations = []
    this.startingPoints.forEach(function(point) {
      var geoJSON = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [point.location[1],point.location[0]]
          },
          "properties": {
            "title": point.email,
            "marker-color": "#fc4353",
            "marker-size": "large",
            "marker-symbol": "star-stroked"
          }
        }
      humanLocations.push(geoJSON)
    })
    this.humanLayer.setGeoJSON(humanLocations)
    this.map.fitBounds(this.humanLayer.getBounds());
  },

  callback: function() {
    Map.counter++
    if (Map.counter >= 3) {
      Map.counter = 0
      Map.populateTheMiddle()
    }
  },

  fetchVenueResults: function() {
    this.fetchCoffeeVenues(this.callback)
    this.fetchFoodVenues(this.callback)
    this.fetchDrinkVenues(this.callback)
  },

  populateTheMiddle: function() {
    // check the dom for which location types are selected
    // populate the map based on these types
    // this function can be called when the buttons are clicked, as well as when the results have finished returning.
    if (this.initPop === true) {
      var geoLocations = []
      this.locationTypes.forEach(function(type) {
        geoLocations.push(Map.addMarkers(type))
      })
      var merged = []
      merged = merged.concat.apply(merged, geoLocations)
      Map.featureLayer.setGeoJSON(merged)
    }
  },

  addMarkers: function(type) {
    var symbol, color, venues
    if (type === "coffee") {
      symbol = "cafe"
      color = "#3fbfbf"
      venues = this.coffee
    } else if (type === 'food') {
      symbol = "restaurant"
      color = "#2d7ac7"
      venues = this.food
    } else if (type === 'drinks') {
      symbol = "bar"
      color = "#2dc787"
      venues = this.drink
    }
    var geoLocations = []
    venues.forEach(function(place) {
      var geoJSON = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [place.venue.location.lng,place.venue.location.lat]
        },
        "properties": {
          "title": place.venue.name,
          "marker-color": color,
          "marker-size": "large",
          "marker-symbol": symbol
        }
      }
      geoLocations.push(geoJSON)
    })
    return geoLocations
  },

  fetchCoffeeVenues: function(callback) {
    $.ajax({
      url: '/places',
      type: 'POST',
      dataType: 'json',
      data: {
        middle: this.middle,
        type: 'coffee'
      }
    }).success(function(response) {
      Map.coffee = response.response.groups[0].items
      if (Map.initPop === false) {
        Map.initPop = true
        var geoLocations = Map.addMarkers('coffee')
        Map.featureLayer.setGeoJSON(geoLocations)
      }
      callback()
    })
  },

  fetchFoodVenues: function(callback) {
    $.ajax({
      url: '/places',
      type: 'POST',
      dataType: 'json',
      data: {
        middle: this.middle,
        type: 'food'
      }
    }).success(function(response) {
      Map.food = response.response.groups[0].items
      callback()
    })
  },

  fetchDrinkVenues: function(callback) {
    $.ajax({
      url: '/places',
      type: 'POST',
      dataType: 'json',
      data: {
        middle: this.middle,
        type: 'drinks'
      }
    }).success(function(response) {
      Map.drink = response.response.groups[0].items
      callback()
    })
  },

  updateMap: function() {
    this.startingPoints = []
    var address1 = document.getElementById('address1').value
    var address2 = document.getElementById('address2').value
    this.findLocation(address1, App.user.email[1])
    this.findLocation(address2, App.user.email[2])
  },

  findTheMiddle: function() {
    // var pythagorean = Math.pow((this.startingPoints[0].location[0] - this.startingPoints[1].location[0]),2) + Math.pow((this.startingPoints[0].location[1] - this.startingPoints[1].location[1]),2)
    return {
      lat: (this.startingPoints[0].location[0] + this.startingPoints[1].location[0])/2,
      lng: (this.startingPoints[0].location[1] + this.startingPoints[1].location[1])/2
      // zoom: (Math.sqrt(pythagorean)/0.0040604835604766834)
    }
  }
}

