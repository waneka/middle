var App = {
  init: function(map) {
    this.setUserData()
    this.map = map
    this.map.init()
    this.map.findLocation(this.user.address[1], this.user.email[1])
    this.map.findLocation(this.user.address[2], this.user.email[2])
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
  }
}

window.onload = function() {
  App.init(Map)
  Midstyle.init()
}
