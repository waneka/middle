var App = {

  init: function(gmap){
    this.setUserData()
    this.gmap = gmap
    this.gmap.initialize()
    this.gmap.findLatLong(this.user.address[1])
    this.gmap.findLatLong(this.user.address[2])
  },

  setUserData: function(){
    this.user = {
      email: [null, App.findEmail(1), App.findEmail(2)],
      address: [null, App.findAddress(1), App.findAddress(2)]
    }
  },

  findEmail: function(n){
    var email = RegExp("email" + n + "=([^&]*)")
    return window.location.search.match(email)[1].replace('%40','@')
  },

  findAddress: function(n){
    var address = RegExp("address" + n + "=([^&]*)")
    var commified = window.location.search.match(address)[1].replace(/%2C/g,',')
    return commified.split('+').join(' ')
  },

}

window.onload = function(){
  App.init(GMap)
  Midstyle.init()
}