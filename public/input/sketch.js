// Open and connect input socket
let socket = io('/input');

// this object contains everything you need to draw in this sketch, including win conditions
// DO NOT MUTATE THIS OBJECT, IT SHOULD BE READ ONLY
// Changes to position are made by emitting the data, NOT by changing X, Y positions within this object
let inputClient = null;

let x;
let y;

let xSpeed = 0;
let ySpeed = 0;

//can be altered to preference
let maxSpeed = 2;
let accel = 0.04;

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)
  noStroke();
    
  x = width/2;
  y = height/2;

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
    inputClient = data
    
  })
}

function draw(){
  background(255);
    
  if (inputClient && !inputClient.hasFallen) {
      fill(inputClient.color);
      
      circle(inputClient.x * width, inputClient.y * height, 20)
      
      x = inputClient.x * width;
      y = inputClient.y * height;
  
      if (keyIsDown(LEFT_ARROW)) {
        if (xSpeed > -maxSpeed) {
          xSpeed -= accel;
        }
      }

      else if (keyIsDown(RIGHT_ARROW)) {
        if (xSpeed < maxSpeed) {
          xSpeed += accel;
        }
      }

      else {
        if (xSpeed > 0) {
          xSpeed -= accel;
        }
        if (xSpeed < 0) {
          xSpeed += accel;
        }
      }

      if (keyIsDown(UP_ARROW)) {
        if (ySpeed > -maxSpeed) {
          ySpeed -= accel;
        }
      }

      else if (keyIsDown(DOWN_ARROW)) {
        if (ySpeed < maxSpeed) {
          ySpeed += accel;
        }
      }

      else {
        if (ySpeed > 0) {
          ySpeed -= accel;
        }
        if (ySpeed < 0) {
          ySpeed += accel;
        }
      }

      x += xSpeed;
      y += ySpeed;

      if(x > width-10) {
        x = width-10;
        xSpeed = 0;
      }

      if(x < 10) {
        x = 10;
        xSpeed = 0;
      }

      if(y > height-10) {
        y = height-10;
        ySpeed = 0;
      }

      if(y < 10) {
        y = 10;
        ySpeed = 0;
      }
      
      if(xSpeed !== 0.0 || ySpeed !== 0.0) {
        socket.emit('data', {x: x / width, y: y / height, id: socket.id});
      } else {
        
      }
  }

}
/*
TODO: You will need to emit a 'data' function when the arrow keys are pressed, with the following payload
  @PAYLOAD: data, an object
    @x: an updated normalized x position (between 0 and 1)
    @y: an updated normalized y position (between 0 and 1)
    @id: this input client's id (obtainable through socket.id)
*/
