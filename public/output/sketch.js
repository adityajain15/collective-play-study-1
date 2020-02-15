// Open and connect output socket
let socket = io('/output')

// use the arrays below to draw everything, they should contain all the information you need
// DO NOT MUTATE THESE ARRAYS, THEY SHOULD BE READ ONLY
let outputClients = []
let inputClients = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)
  
  /*
  -- You should not need to edit this function ---
  DESCRIPTION: Gives this output client information about all other output clients, including itself
    @PAYLOAD: data, an array of objects
      @x: normalized x position (between 0 and 1) of the wormhole
      @y: normalized y position (between 0 and 1) of the wormhole
      @score: an output client's score
      @id: an output client's id, compare this to socket.id to find out if this the currently connected output client
  */
  socket.on('outputClients', function(data){
    console.log('---OUTPUT CLIENTS---')
    console.log(data)
    outputClients = data
  })

  /*
  -- You should not need to edit this function ---
  DESCRIPTION: Gives this output client information about all input clients
    @PAYLOAD: data, an array of objects
      @x: normalized x position (between 0 and 1) of the input client
      @y: normalized y position (between 0 and 1) of the input client
      @color: the input client's color
      @id: the input client's id, for convenience
      @hasFallen: if the input client has fallen into any wormhole, use this to determine whether to draw this input client or not
  */
  socket.on('inputClients', function(data){
    console.log('---INPUT CLIENTS---')
    console.log(data)
    inputClients = data
  })
}

function draw() {
  
}
