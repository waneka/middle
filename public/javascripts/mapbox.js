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
      // debugger
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
        debugger
        console.log(response)
      })
    }
  },

  findTheMiddle: function() {
    return {
      lat: (this.startingPoints[0][0] + this.startingPoints[1][0])/2,
      lng: (this.startingPoints[0][1] + this.startingPoints[1][1])/2
    }
  }
}

