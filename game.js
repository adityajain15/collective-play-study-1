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
    const assignedColor = paperColors[this.outputClients.length].hex
    this.inputClients.push({
      socket: socket,
      color: assignedColor
    })
    return assignedColor
  }
  // add output client
  addOutputClient (socket) {
    this.outputClients.push({
      socket: socket,
      x: Math.random(),
      y: Math.random(),
      score: 0
    })
  }

  // remove output client / might not be needed
  removeOutputClient () {
    this.outputClients = []
  }
  
  // Does the game have atleast 4 input clients and 1 output client?
  canStart () {

  }

  // get a random input client from list of input clients
  getRandomInputClient () {

  }
}

module.exports = Game