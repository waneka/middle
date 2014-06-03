var Map = {
  startingPoints: [],
  locationTypes: [],
  venueInfo: {},
  counter: 0,
  initLoad: false,

  init: function() {
    this.map = L.mapbox.map('map', 'waneka.i5nnfp13', {zoomControl: false})
    new L.Control.Zoom({ position: 'topright' }).addTo(this.map)
    this.venueLayer = L.mapbox.featureLayer().addTo(this.map)
    this.humanLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userOneDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userTwoDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userThreeDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userFourDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
  },

  geoLocation: function() {
    View.initiateSpinner()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(Map.initialGeoLocation)
    } else {
      View.geoLocationError()
    }
  },

  initialGeoLocation: function(position) {
    View.overlay()
    var location = {
      location: [ position.coords.longitude, position.coords.latitude ]
    }
    Map.startingPoints.push(location)
    Map.setStartingMarkers()
    Map.map.setView([position.coords.latitude, position.coords.longitude], 14)
    View.showLocationsWindow()
  },

  initialManualLocation: function(address) {
    View.overlay()
    View.showLocationsWindow()
    this.findLocation(address, function(location) {
      var reverseCoords = [location[1],location[0]]
      Map.setStartingMarkers()
      Map.map.setView(reverseCoords, 14)
    })
  },

  setStartingMarkers: function() {
    var humanLocations = []
    var counter = 0
    this.startingPoints.forEach(function(point) {
      var colors = {
        0: "#16a085",
        1: "#c0392b",
        2: "#2980b9",
        3: "#d35400"
      }
      var geoJSON = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": point.location
          },
          "properties": {
            "title": "Human",
            "marker-color": colors[counter],
            "marker-size": "large",
            "marker-symbol": "star-stroked"
          }
        }
      humanLocations.push(geoJSON)
      counter++
    })
    this.humanLayer.setGeoJSON(humanLocations)
  },

  findLocation: function(address, callback) {
    var self = this
    var geocoder = L.mapbox.geocoder('waneka.i5nnfp13')
    geocoder.query(address, function(err, result) {
      var location = {
        location: [result.latlng[1],result.latlng[0]],
      }
      self.startingPoints.push(location)
      callback(location.location)
    })
  },

  recenterMap: function() {
    if (this.startingPoints.length >= 2) {
      this.middle = this.findTheMiddle()
      this.setStartingMarkers()
      this.fetchVenueResults()
      this.populateTheMiddle()
      this.fitBounds()
    }
  },

  fitBounds: function() {
    this.map.fitBounds(this.humanLayer.getBounds())
  },

  callback: function() {
    Map.counter++
    if (Map.counter >= 3) {
      Map.counter = 0
      Map.populateTheMiddle()
    }
  },

  fetchVenueResults: function() {
    this.fetchVenues('coffee', this.callback)
    this.fetchVenues('food', this.callback)
    this.fetchVenues('drinks', this.callback)
  },

  fetchVenues: function(type, callback) {
    $.ajax({
      url: '/places',
      type: 'POST',
      dataType: 'json',
      data: {
        middle: this.middle,
        type: type
      }
    }).success(function(response) {
      Map[type] = response.response.groups[0].items
      if (Map.initLoad === false) {
        Map.initLoad = true
        Map.locationTypes.push(type)
        var geoLocations = Map.addMarkers(type)
        Map.venueLayer.setGeoJSON(geoLocations)
        View.setInitialVenue(type)
      }
      callback()
    })
  },

  populateTheMiddle: function() {
    if (this.initLoad === true) {
      var geoLocations = []
      this.locationTypes.forEach(function(type) {
        geoLocations.push(Map.addMarkers(type))
      })
      var merged = []
      merged = merged.concat.apply(merged, geoLocations)
      this.venueLayer.setGeoJSON(merged)
      this.bindDirections()
      this.bindVenueInfo(Map.venueLayer)
      View.showVenueButtons()
    }
  },

  bindDirections: function() {
    this.bindDirectionsEvent(this.userOneDirectionsLayer, 0, Map.venueLayer)
    this.bindDirectionsEvent(this.userTwoDirectionsLayer, 1, Map.venueLayer)
    this.bindDirectionsEvent(this.userThreeDirectionsLayer, 2, Map.venueLayer)
    this.bindDirectionsEvent(this.userFourDirectionsLayer, 3, Map.venueLayer)
  },

  bindVenueInfo: function(layer) {
    layer.on('click', function(e) {
      View.showVenueInfo()
      var venue = Map.venueInfo[e.layer.feature.id]
      View.renderVenueInfo(venue)
    })
  },

  addMarkers: function(type) {
    var symbol, color, venues
    if (type === "coffee") {
      symbol = "cafe"
      color = "#3fbfbf"
      venues = this.coffee
    } else if (type === "food") {
      symbol = "restaurant"
      color = "#2d7ac7"
      venues = this.food
    } else if (type === "drinks") {
      symbol = "bar"
      color = "#2dc787"
      venues = this.drinks
    }
    var geoLocations = []
    venues.forEach(function(place) {
      var geoJSON = {
        "type": "Feature",
        "id": place.venue.id,
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
      Map.venueInfo[place.venue.id] = place.venue
    })
    return geoLocations
  },

  bindDirectionsEvent: function(dirLayer, human, layer) {
    if (Map.startingPoints[human]) {
      layer.on('click', function(e) {
        var points = {
          pointOne: Map.startingPoints[human].location,
          pointTwo: e.layer.feature.geometry.coordinates
        }
        $.ajax({
          type: 'POST',
          url: '/directions',
          data: points,
          dataType: 'json'
        }).success(function(data) {
          var geoArray = data.routes[0].geometry.coordinates
          Map.drawRoute(geoArray, dirLayer, human)

          var steps = data.routes[0].steps
          View.displaySteps(human, steps)
        })
      })
    }
  },

  drawRoute: function(geoArray, dirLayer, human) {
    var arryLength = geoArray.length
    var geoJSONObject = {
      "type": "LineString",
      "coordinates": []
    }
    for (var i=0;i<arryLength;i++) {
      geoJSONObject.coordinates[i] = geoArray[i]
    }
    var colors = {
      0: "#16a085",
      1: "#c0392b",
      2: "#2980b9",
      3: "#d35400"
    }
    var stylezzz = {
      color: colors[human],
      weight: 4,
      opacity: 0.8
    }
    dirLayer.setGeoJSON(geoJSONObject)
    dirLayer.setStyle(stylezzz)
  },

  findTheMiddle: function() {
    var humans = this.startingPoints.length
    var latTotal = 0,
      lngTotal = 0
    for (var i=0;i<humans;i++) {
      latTotal += this.startingPoints[i].location[1]
      lngTotal += this.startingPoints[i].location[0]
    }

    var pythagorean = Math.pow((this.startingPoints[0].location[0] - this.startingPoints[1].location[0]),2) + Math.pow((this.startingPoints[0].location[1] - this.startingPoints[1].location[1]),2)
    return {
      lat: (latTotal)/humans,
      lng: (lngTotal)/humans,
      radius: (Math.sqrt(pythagorean) * 10000)
    }
  }
}

