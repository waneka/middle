var App = {
  init: function(map) {
    var app = this
    this.setUserData()
    this.map = map
    this.map.init(function() {
      if (app.map.updateFlag === false) {
        app.map.findLocation(app.user.address[1], app.user.email[1])
        app.map.findLocation(app.user.address[2], app.user.email[2])
      }
    })
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
