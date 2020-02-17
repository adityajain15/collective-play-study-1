// Open and connect output socket
let socket = io('/output')

// use the arrays below to draw everything, they should contain all the information you need
// DO NOT MUTATE THESE ARRAYS, THEY SHOULD BE READ ONLY
let outputClient = {x:0, y:0, score:0, id:'', hasGameFinished: false}
let inputClients = []
let finish = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textAlign(CENTER);
  
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
    for(let i = 0; i < data.length; i++){
      if(data[i].id === socket.id) {
        outputClient = data[i]
      }
    }
  })

  socket.on('finish', function(data){
    console.log(data)
    finish = data
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
  let mappedX = map(outputClient.x, 0, 1, 0, windowWidth)
  let mappedY = map(outputClient.y, 0, 1, 0, windowHeight)
  background(255);
  //stroke(100);
  //strokeWeight(5);
  fill(200);
  noStroke();
  circle(mappedX, mappedY, 15)  
  
  for (let inputClient of inputClients) {
    if (!inputClient.hasFallen) {
      const mappedX = map(inputClient.x, 0, 1, 0, windowWidth)
      const mappedY = map(inputClient.y, 0, 1, 0, windowHeight)
      fill(inputClient.color);
      circle(mappedX, mappedY, 20)
    }
  }
  
  fill(100);
  textSize(15);
  if(finish.length) {
    text(`GAME HAS FINISHED`, width/2, 50)
    text(finish.includes(socket.id) ? finish.length > 1 ? `ITS A TIE` : `YOU WIN. BUT YOU'RE A LOSER.` : `YOU LOSE. YOU'RE A LOSER.`, width/2, 80)
  } else {
    text(`SHOUT OUT THE POSITION OF YOUR WORMHOLE`, width/2, 50)
    text(`YOUR CURRENT SCORE IS ${outputClient.score}`, width/2, 80)
  }
 }
