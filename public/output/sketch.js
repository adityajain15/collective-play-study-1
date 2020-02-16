// Open and connect output socket
let socket = io('/output')

// use the arrays below to draw everything, they should contain all the information you need
// DO NOT MUTATE THESE ARRAYS, THEY SHOULD BE READ ONLY
let outputClients = []
let inputClients = []
let canvas = null

function setup() {
  canvas = createCanvas(windowWidth, windowHeight)
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
    createDelaunay()
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
    createDelaunay()
  })
}

function createDelaunay(){
  
  const points = []
  for(let i = 0; i < outputClients.length; i++) {
    points.push([outputClients[i].x, outputClients[i].y])
  }
  for(let i = 0; i < inputClients.length; i++) {
    points.push([inputClients[i].x, inputClients[i].y])
  }
  const delaunay = d3.Delaunay.from(points)
  //console.log(delaunay)
  const voronoi = delaunay.voronoi([0, 0, 1, 1])
  const polygons = voronoi.cellPolygons()
  
  let result = polygons.next();
  while (!result.done) {
    console.log(result.value);
    for(let i = 0; i < result.value.length; i++) {
      const screenX = map(result.value[i][0], 0, 1, 0, windowWidth)
      const screenY = map(result.value[i][1], 0, 1, 0, windowHeight)
      fill('red')
      circle(screenX, screenY, 10)
    }
    result = polygons.next();
  }

  /*for(let i = 0; i < pol.length; i++) {
    if(pol[i][0] !== 0 && pol[i][1] !== 1 && pol[i][1] !== 0 && pol[i][0] !== 1) {
      console.log(pol[i])
      const screenX = map(pol[i][0], 0, 1, 0, windowWidth)
      const screenY = map(pol[i][1], 0, 1, 0, windowHeight)
      fill('red')
      circle(screenX, screenY, 10)
    }
  }*/
}

function draw() {
  for(let i = 0; i < outputClients.length; i++) {
    const screenX = map(outputClients[i].x, 0, 1, 0, windowWidth)
    const screenY = map(outputClients[i].y, 0, 1, 0, windowHeight)
    if(outputClients[i].id === socket.id) {
      fill(255, 204, 0)
    }
    circle(screenX, screenY, 10)
  }

  for(let i = 0; i < inputClients.length; i++) {
    const screenX = map(inputClients[i].x, 0, 1, 0, windowWidth)
    const screenY = map(inputClients[i].y, 0, 1, 0, windowHeight)
    fill('#222222')
    circle(screenX, screenY, 10)
  }
  
}
