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
  outputs.emit('outputClients', game.getOutputClients())
  // send this output client a list of all current input clients
  socket.emit('inputClients', game.getInputClients())

  // Listen for this output client to disconnect
  socket.on('disconnect', function() {
    console.log("An output client has disconnected " + socket.id);
    game.removeOutputClient(socket.id)
    // send the remaining output clients a notification that this output client has dropped out
    outputs.emit('outputClients', game.getOutputClients())
  });
});

// Clients in the input namespace
var inputs = io.of('/input');
// Listen for input clients to connect
inputs.on('connection', function(socket){
  console.log('An input client connected: ' + socket.id);
  // add input client to the game
  game.addInputClient(socket)
  // send the input client its own info
  socket.emit('init', game.getClientById(socket.id))
  // send a list of updated input clients to all the output clients
  outputs.emit('inputClients', game.getInputClients())
  

  // Listen for data messages from this input client
  socket.on('data', function(data) {
    const x = data.x
    const y = data.y
    const id = data.id
    if(!game.checkFallen(id)) {
      game.changePosition(id, x, y)
      if(game.wormholeCheck(id, x, y)){
        outputs.emit('outputClients', game.getOutputClients())
        if(game.hasGameFinished()){
          outputs.emit('finish', game.getWinner())
        }
      }
      socket.emit('init', game.getClientById(id))
      outputs.emit('inputClients', game.getInputClients())
    }
  })

  socket.on('disconnect', function() {
    console.log("An input client has disconnected " + socket.id);
    // remove the input client from the game
    game.removeInputClient(socket.id)
    // send a list of updated input clients to all the output clients
    outputs.emit('inputClients', game.getInputClients())
  });
});
