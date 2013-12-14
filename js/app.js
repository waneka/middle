$(document).ready(function(){
  App.init(GMap)
})

var App = {
  init: function(gmap){
    this.gmap = gmap
    this.gmap.initialize()
    this.gmap.findLatLong('717 california st, san francisco')
    this.gmap.findLatLong('Mission, san francisco')
  }
}