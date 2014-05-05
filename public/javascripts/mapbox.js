var Map = {
  startingPoints: [],

  init: function() {
    this.map = L.mapbox.map('map', 'waneka.i249l66n').setView([37.7833, -122.4167], 13);
  },

  findLocation: function(address) {
    var self = this
    self.startingPoints = []
    var geocoder = L.mapbox.geocoder('waneka.i249l66n')
    geocoder.query(address, function(err, result) {
      self.startingPoints.push(result.latlng)
      self.recenterMap()
    })
  },

  recenterMap: function() {
    if (this.startingPoints.length === 2) {
      var middle = this.findTheMiddle()
      this.map.setView([middle.lat, middle.lng], 13);
      $.ajax({
        type: 'POST',
        url: '/places',
        data: middle
      }).success(function(response) {
        console.log(response)
      })
    }
  },

  fetchVenueResults: function() {
    this.fetchCoffeeVenues(this.callback)
    this.fetchFoodVenues(this.callback)
    this.drink = this.fetchDrinkVenues(this.callback)
  },

  populateTheMiddle: function() {
    // check the dom for which location types are selected
    // populate the map based on these types
    // this function can be called when the buttons are clicked, as well as when the results have finished returning.
    debugger
  },

  initialPopulation: function() {
    this.coffee.forEach(function(place){
      L.marker([place.venue.location.lat,place.venue.location.lng], {
        title: place.venue.name,
        riseOnHover: true
      })
      .addTo(Map.map)
    })
    debugger
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
      // debugger
      Map.coffee = response.response.groups[0].items
      callback()
      if (Map.pageLoad <= 1) {
        Map.pageLoad = 0
        Map.initialPopulation()
      }
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
      // debugger
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
      // debugger
      Map.drink = response.response.groups[0].items
      callback()
    })
  },

  findTheMiddle: function() {
    return {
      lat: (this.startingPoints[0][0] + this.startingPoints[1][0])/2,
      lng: (this.startingPoints[0][1] + this.startingPoints[1][1])/2
    }
  }
}

