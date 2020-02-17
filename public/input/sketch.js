// Open and connect input socket
let socket = io('/input');

// this object contains everything you need to draw in this sketch, including win conditions
// DO NOT MUTATE THIS OBJECT, IT SHOULD BE READ ONLY
// Changes to position are made by emitting the data, NOT by changing X, Y positions within this object
let inputClient = null

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)

  // Listen for confirmation of connection
  socket.on('connect', () => {
    console.log('connected')
  })

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
    //console.log(data)
    inputClient = data
    console.log(inputClient)
  })
}

/*
You will need to emit a 'data' function when the arrow keys are pressed, with the following payload
  @PAYLOAD: data, an object
    @x: an updated normalized x position (between 0 and 1)
    @y: an updated normalized y position (between 0 and 1)
    @id: this input client's id (obtainable through socket.id)
*/
function draw(){
  if(inputClient){
    clear()
    fill(inputClient.color)
    noStroke()
    let mappedX = map(inputClient.x, 0, 1, 0, windowWidth)
    let mappedY = map(inputClient.y, 0, 1, 0, windowHeight)
    console.log(`drawing ${mappedX},${mappedY}`)
    //console.log(`current cordinates: ${mappedX}, ${mappedY}`)
    //console.log(`current cordinates: ${inputClient.x}, ${inputClient.y}`)
    circle(mappedX, mappedY, 20)
    let changeX = 0
    let changeY = 0
    if (keyIsDown(LEFT_ARROW)) {
      changeX -= 1
    }
    if (keyIsDown(RIGHT_ARROW)) {
      changeX += 1
    }
    if (keyIsDown(UP_ARROW)) {
      changeY -= 1
    }
    if (keyIsDown(DOWN_ARROW)) {
      changeY += 1
    }
    if(changeX !== 0 || changeY !== 0) {
      socket.emit('data', {
        x: (mappedX + changeX) / windowWidth,
        y: (mappedY + changeY) / windowHeight,
        id: socket.id
      })
    }
  }
}
