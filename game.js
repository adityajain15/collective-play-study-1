const paperColors = require('paper-colors');

// Select a random color
const color = paperColors[Math.floor(Math.random() * paperColors.length)];

class Game{
  constructor(){
    this.inputClients = []
    this.outputClients = []
    this.hasStarted = false
  }

  // return the current score
  getScore () {
    return this.score
  }

  // award a point
  incrementScore () {
    this.score += 1
  }

  startGame () {
    this.hasStarted = true
  }

  stopGame () {
    this.hasStarted = false
  }

  // add input client
  addInputClient (socket) {
    const userObject = {
      socket: socket,
      color: paperColors[this.outputClients.length].hex,
      x: Math.random(),
      y: Math.random()
    }
    this.inputClients.push(userObject)
    return {
      color: userObject.color,
      x: userObject.x,
      y: userObject.y,
      id: userObject.socket.id
    }
  }

  // remove input client
  removeInputClient (id) {
    if(this.inputClients.find(el=>el.socket.id === id)) {
      this.inputClients.splice(this.inputClients.findIndex(el=>el.socket.id === id), 1)
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
  
  // Does the game have atleast 4 input clients and 1 output client?
  canStart () {

  }

  // get a random input client from list of input clients
  getRandomInputClient () {

  }
}

module.exports = Game