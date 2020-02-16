const paperColors = require('paper-colors')
const Delaunay = require('d3-delaunay')
// pastel colors, and a counter to allot unique colors as often as possible
const color = paperColors
let index = 0
const winDistance = 0.05

class Game{
  constructor(){
    this.inputClients = []
    this.outputClients = []
    this.isFinished = false
  }

  // add input client
  addInputClient (socket) {
    this.inputClients.push({
      socket: socket,
      color: paperColors[index % 12].hex,
      x: Math.random(),
      y: Math.random(),
      hasFallen: false
    })
    index++
  }

  // remove input client
  removeInputClient (id) {
    if(this.inputClients.find(el=>el.socket.id === id)) {
      this.inputClients.splice(this.inputClients.findIndex(el=>el.socket.id === id), 1)
    }
  }

  // get data for all input clients
  getInputClients () {
    const inputClients = this.inputClients.map(d=>{
      return {
        x: d.x,
        y: d.y,
        color: d.color,
        id: d.socket.id,
        hasFallen: d.hasFallen
      }
    })
    return inputClients
  }

  getClientById (id) {
    const user = this.inputClients[this.inputClients.findIndex(d=>d.socket.id === id)]
    return {
      color: user.color,
      x: user.x,
      y: user.y,
      id: user.socket.id,
      hasFallen: user.hasFallen
    }
  }

  // add output client
  addOutputClient (socket) {
    this.outputClients.push({
      x: Math.random(),
      y: Math.random(),
      score: 0,
      socket: socket
    })
  }

  // remove output client
  removeOutputClient (id) {
    if(this.outputClients.find(el=>el.socket.id === id)) {
      this.outputClients.splice(this.outputClients.findIndex(el=>el.socket.id === id), 1)
    }
  }

  // get data for all output clients
  getOutputClients() {
    const outputClients = this.outputClients.map(d => {
      return {
        x: d.x,
        y: d.y,
        score: d.score,
        id: d.socket.id
      }
    })
    return outputClients
  }

  // get optimal position x,y position for new client
  getOptimalPosition(){
    const points = []
    for(let i = 0; i < this.outputClients.length; i++) {
      points.push([this.outputClients[i].x, this.outputClients[i].y])
    }
    for(let i = 0; i < inputClients.length; i++) {
      points.push([inputClients[i].x, inputClients[i].y])
    }
    if(points.length < 3) {

    } else {
      
    }
    const delaunay = d3.Delaunay.from(points)
    //console.log(delaunay)
    const voronoi = delaunay.voronoi([0, 0, 1, 1])
    const polygons = voronoi.cellPolygons()
    
    let result = polygons.next();
    while (!result.done) {
      console.log(result.value);
      for(let i = 0; i < result.value.length; i++) {
        const screenX = map(result.value[i][0], 0, 1, 0, windowWidth)
        const screenY = map(result.value[i][1], 0, 1, 0, windowHeight)
        fill('red')
        circle(screenX, screenY, 10)
      }
      result = polygons.next();
    }
  }
  
  // change position of input client
  changePosition (id, x, y) {
    if(this.inputClients.find(el=>el.socket.id === id)) {
      const index = this.inputClients.findIndex(el => el.socket.id === id)
      this.inputClients[index].x = x
      this.inputClients[index].y = y
    }
  }

  wormholeCheck (id, x, y) {
    for(let i = 0; i < this.outputClients.length; i++) {
      const distance = Math.hypot(x - this.outputClients[i].x, y - this.outputClients[i].y)
      if(distance < winDistance) {
        this.inputClients[this.inputClients.findIndex(d => d.socket.id === id)].hasFallen = true
        this.outputClients[i].score += 1
        break
      }
    }
  }

  hasGameFinished () {
    this.isFinished = this.inputClients.map(d=>d.hasFallen).reduce((a,b)=>a&&b, true)
    return this.isFinished
  }
}

module.exports = Game