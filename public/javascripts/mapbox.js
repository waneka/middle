var Map = {
  startingPoints: [],
  locationTypes: [],
  counter: 0,
  initLoad: false,
  updateFlag: false,

  init: function(callback) {
    this.map = L.mapbox.map('map', 'waneka.i5nnfp13').on('viewreset', function() {
      callback()
    })
    this.venueLayer = L.mapbox.featureLayer().addTo(this.map)
    this.humanLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userOneDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
    this.userTwoDirectionsLayer = L.mapbox.featureLayer().addTo(this.map)
  },

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
      this.fitBounds()
    }
  },

  fitBounds: function() {
    this.map.fitBounds(this.humanLayer.getBounds())
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

  populateTheMiddle: function() {
    if (this.initLoad === true) {
      var geoLocations = []
      this.locationTypes.forEach(function(type) {
        geoLocations.push(Map.addMarkers(type))
      })
      var merged = []
      merged = merged.concat.apply(merged, geoLocations)
      this.venueLayer.setGeoJSON(merged)
      this.bindDirectionsEvent(this.userOneDirectionsLayer, this.startingPoints[0], Map.venueLayer)
      this.bindDirectionsEvent(this.userTwoDirectionsLayer, this.startingPoints[1], Map.venueLayer)
    }
  },

  bindDirectionsEvent: function(dirLayer, human, layer) {
    layer.on('click', function(e) {
      $.ajax({
        type: 'POST',
        url: '/directions',
        data: {
          pointOne: human.location,
          pointTwo: e.layer.feature.geometry.coordinates
        },
        dataType: 'json'
      }).success(function(data) {
        var geoArray = data.routes[0].geometry.coordinates
        Map.drawRoute(geoArray, dirLayer)

      })
    })
  },

  drawRoute: function(geoArray, dirLayer) {
    var arryLength = geoArray.length
    var geoJSON = {
      "type": "LineString",
      "coordinates": []
    }
    for (var i=0;i<arryLength;i++) {
      geoJSON.coordinates[i] = geoArray[i]
    }
    dirLayer.setGeoJSON(geoJSON)
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
        "geometry": {
          "type": "Point",
          "coordinates": [place.venue.location.lng,place.venue.location.lat]
        },
        "properties": {
          "title": place.venue.name,
          "description": Map.urlChecker(place),
          "marker-color": color,
          "marker-size": "large",
          "marker-symbol": symbol
        }
      }
      geoLocations.push(geoJSON)
    })
    return geoLocations
  },

  urlChecker: function(place) {
    if (place.venue.url !== undefined) {
      return (place.venue.location.address + "<br>" + "<a href='" + place.venue.url + "'>" + "Website" + "</a>")
    } else {
      return (place.venue.location.address)
    }
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

  updateMap: function() {
    this.startingPoints = []
    var address1 = document.getElementById('address1').value
    var address2 = document.getElementById('address2').value
    this.findLocation(address1, App.user.email[1])
    this.findLocation(address2, App.user.email[2])
  },

  findTheMiddle: function() {
    var pythagorean = Math.pow((this.startingPoints[0].location[0] - this.startingPoints[1].location[0]),2) + Math.pow((this.startingPoints[0].location[1] - this.startingPoints[1].location[1]),2)
    return {
      lat: (this.startingPoints[0].location[0] + this.startingPoints[1].location[0])/2,
      lng: (this.startingPoints[0].location[1] + this.startingPoints[1].location[1])/2,
      radius: (Math.sqrt(pythagorean) * 10000)
    }
  }
}

