var App = {
  user: {
    email: [null, findEmail1(), findEmail2()],
    address: [null, findAddress1(), findAddress2()]
  },

  init: function(gmap){
    this.gmap = gmap
    this.gmap.initialize()
    this.gmap.findLatLong(this.user.address[1])
    this.gmap.findLatLong(this.user.address[2])
  }
}

window.onload = function(){
  App.init(GMap)
}