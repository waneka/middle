function Controller(map) {
  this.map = map
  this.map.init()
}

window.onload = function() {
  map = new Map()
  app = new Controller(map)
  view = new View()
  view.init()
}
