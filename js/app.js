var App = {
  init: function(gmap){
    this.gmap = gmap
    this.gmap.initialize()
    var location1 = findAddress1() || '717 california st, san francisco'
    var location2 = findAddress2() || 'Mission, san francisco'
    this.gmap.findLatLong(location1)
    this.gmap.findLatLong(location2)
  }
}

window.onload = function(){
  App.init(GMap)
}