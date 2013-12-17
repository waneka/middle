var App = {
  user: {
    email: [null, findEmail(1), findEmail(2)],
    address: [null, findAddress(1), findAddress(2)]
  },

  init: function(gmap){
    this.gmap = gmap
    this.gmap.initialize()
    this.gmap.findLatLong(this.user.address[1])
    this.gmap.findLatLong(this.user.address[2])
  },

}

window.onload = function(){
  App.init(GMap)
  Midstyle.init()
}