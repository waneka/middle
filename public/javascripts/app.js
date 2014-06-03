var App = {
  init: function(map) {
    this.map = map
    this.map.init()
  }
}

window.onload = function() {
  App.init(Map)
  View.init()
}
