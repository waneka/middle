function Controller(map) {
  this.map = map
  this.map.init()
}

window.onload = function() {
  Map = new Map()
  App = new Controller(Map)
  View = new View()
  View.init()
}
