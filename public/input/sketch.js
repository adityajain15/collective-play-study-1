// Open and connect input socket
let socket = io('/input');

// this object contains everything you need to draw in this sketch, including win conditions
// DO NOT MUTATE THIS OBJECT, IT SHOULD BE READ ONLY
// Changes to position are made by emitting the data, NOT by changing X, Y positions within this object
let inputClient = {};

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)

  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected")
  });

  /*
    --- You should not need to edit this function ---
    DESCRIPTION: Core of the clientside, it tells the input client all details it needs to know
      @PAYLOAD: data, an object
        @x: normalized x position (between 0 and 1)
        @y: normalized y position (between 0 and 1)
        @color: what color the inputClient needs to be
        @hasFallen: has this input client fallen into a wormhole
        @id: this input client's id, for convinience
  */
  socket.on('init', function(data) {
    console.log(data)
    inputClient = data
    updateCanvas()
  })
}

function updateCanvas() {
  fill(0);
  const mappedX = map(inputClient.x, 0, 1, 0, windowWidth)
  const mappedY = map(inputClient.y, 0, 1, 0, windowHeight)
  console.log(`current cordinates: ${mappedX}, ${mappedY}`)
  console.log(`current cordinates: ${inputClient.x}, ${inputClient.y}`)
  circle(mappedX, mappedY, 20);
}

function keyPressed() {
  const mappedX = map(inputClient.x, 0, 1, 0, windowWidth)
  const mappedY = map(inputClient.y, 0, 1, 0, windowHeight)
  console.log(`current cordinates: ${mappedX}, ${mappedY}`)
  console.log(`current cordinates: ${inputClient.x}, ${inputClient.y}`)
  if (keyCode === LEFT_ARROW) {
    //if(x<0)
    const newX = ((mappedX - 1) / windowWidth)
    console.log(newX)
    socket.emit('data', {
      x: ((mappedX - 100) / windowWidth),
      y: mappedY,
      id: socket.id
    })
  } else if (keyCode === RIGHT_ARROW) {
    socket.emit('data', {
      x: ((mappedX + 1) / windowWidth),
      y: mappedY,
      id: socket.id
    })
  } else if (keyCode === UP_ARROW) {
    socket.emit('data', {
      x: mappedX,
      y: ((mappedY - 1) / windowHeight),
      id: socket.id
    })
  } else if (keyCode === DOWN_ARROW) {
    socket.emit('data', {
      x: mappedX,
      y: ((mappedY + 1) / windowHeight),
      id: socket.id
    })
  }
}
/*
TODO: You will need to emit a 'data' function when the arrow keys are pressed, with the following payload
  @PAYLOAD: data, an object
    @x: an updated normalized x position (between 0 and 1)
    @y: an updated normalized y position (between 0 and 1)
    @id: this input client's id (obtainable through socket.id)
*/