// Open and connect output socket
let socket = io('/output')

// use the arrays below to draw everything, they should contain all the information you need
// DO NOT MUTATE THESE ARRAYS, THEY SHOULD BE READ ONLY
let outputClients = []
let inputClients = []

let wormholeX;
let wormholeY;
let score;

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
    
    background(255);
    
    for (let outputClient of outputClients) {
        if (outputClient.id == socket.id) {
            wormholeX = outputClient.x * width;
            wormholeY = outputClient.y * width;
            score = outputClient.score;
        }
    }

    stroke(100);
    strokeWeight(5);
    
    fill(200);
    ellipse(wormholeX, wormholeY, 50, 50);
    
    fill(255);
    textSize(12);
    text("goal", wormholeX, wormholeY + 3);

    noStroke();
    
    for (let inputClient of inputClients) {
        if (!inputClient.hasFallen) {
            fill(inputClient.color);
            ellipse(inputClient.x * width, inputClient.y * height, 20, 20);
        }
    }
    
    fill(100);
    textSize(15);
    text("direct the other players towards your goal", width/2, 50);
    text("your current score is " + score, width/2, 80);
    
}
