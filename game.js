const paperColors = require('paper-colors');

// pastel colors, and a counter to allot unique colors as often as possible
const color = paperColors
let index = 0
const winDistance = 0.03

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
      x: parseFloat(Math.random().toFixed(2)),
      y: parseFloat(Math.random().toFixed(2)),
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
      x: parseFloat(Math.random().toFixed(2)),
      y: parseFloat(Math.random().toFixed(2)),
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
  
  // check if input client has fallen
  checkFallen (id) {
    return this.getClientById(id).hasFallen
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
      const distance = parseFloat(Math.hypot(parseFloat(x.toFixed(2)) - this.outputClients[i].x, parseFloat(y.toFixed(2)) - this.outputClients[i].y).toFixed(2))
      //console.log(x.toFixed(2))
      //console.log(this.outputClients[i].x.toFixed(2))
      if((parseFloat(x.toFixed(2)) === this.outputClients[i].x) && (parseFloat(y.toFixed(2)) === this.outputClients[i].y)) {
        this.inputClients[this.inputClients.findIndex(d => d.socket.id === id)].hasFallen = true
        this.outputClients[i].score += 1
        return true
      }
      
      /*if(distance < winDistance) {
        this.inputClients[this.inputClients.findIndex(d => d.socket.id === id)].hasFallen = true
        this.outputClients[i].score += 1
        return true
      }*/
    }
    return false
  }

  hasGameFinished () {
    return this.inputClients.map(d=>d.hasFallen).reduce((a,b)=>a&&b, true)
  }

  getWinner () {
    const scores = this.outputClients.map(d=>d.score)
    const maxScore = Math.max(scores)
    const winners = []
    for(let i = 0; i < this.outputClients.length; i++) {
      if(this.outputClients[i].score === maxScore) {
        winners.push(this.outputClients[i].id)
      }
    }
    return winners
  }
}

module.exports = Game