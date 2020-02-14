// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});
const Game = require('./game.js')
const game = new Game()

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Clients in the output namespace
var outputs = io.of('/output');
// Listen for output clients to connect
outputs.on('connection', function(socket){
  // add this output client to the game
  game.addOutputClient(socket)
  console.log(game.outputClients.length)
  // send this output client a list of all current output clients (which includes itself)
  const outputClients = game.outputClients.map(d => {
    return {
      x: d.x,
      y: d.y,
      score: d.score,
      id: d.socket.id
    }
  })
  outputs.emit('outputClients', outputClients)

  // send this output client a list of all current input clients
  const inputClients = game.inputClients.map(d=>{
    return {
      x: d.x,
      y: d.y,
      color: d.color,
      id: d.socket.id
    }
  })
  socket.emit('inputClients', inputClients)

  // Listen for this output client to disconnect
  socket.on('disconnect', function() {
    console.log("An output client has disconnected " + socket.id);
    game.removeOutputClient(socket.id)
    const outputClients = game.outputClients.map(d => {
      return {
        x: d.x,
        y: d.y,
        score: d.score,
        id: d.socket.id
      }
    })
    outputs.emit('outputClients', outputClients)
  });
});

// Clients in the input namespace
var inputs = io.of('/input');
// Listen for input clients to connect
inputs.on('connection', function(socket){
  console.log('An input client connected: ' + socket.id);
  // add input client to the game
  const userObject = game.addInputClient(socket)
  // send the input client its own info
  socket.emit('init', userObject)
  // send a list of updated input clients to all the output clients
  const inputClients = game.inputClients.map(d=>{
    return {
      x: d.x,
      y: d.y,
      color: d.color,
      id: d.socket.id
    }
  })
  outputs.emit('inputClients', inputClients)
  

  // Listen for data messages from this input client
  socket.on('data', function(data) {
    
  })

  socket.on('disconnect', function() {
    console.log("An input client has disconnected " + socket.id);
    // remove the input client from the game
    game.removeInputClient(socket.id)
    // send a list of updated input clients to all the output clients
    const inputClients = game.inputClients.map(d=>{
      return {
        x: d.x,
        y: d.y,
        color: d.color,
        id: d.socket.id
      }
    })
    outputs.emit('inputClients', inputClients)
  });
});
