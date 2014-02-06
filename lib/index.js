
var HEX_COLORS = {
  Sheep: '#5f5',
  Wheat: '#ffb',
  Brick: '#f57',
  Ore: '#999',
  Wood: '#aa5',
  Desert: '#cba',
  Water: '#def'
}

var PLAYER = {
  // '-1': 'transparent',
  0: 'red',
  1: 'green',
  2: 'blue',
  3: 'orange'
}

module.exports = function (canvas, data, done) {
  var width = canvas.width
    , height = canvas.height
    , ctx = canvas.getContext('2d')
  width = width < height ? width : height
  ctx.clearRect(0, 0, width, height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  drawTiles(ctx, width, 20, data.map.hexGrid)
  drawKey(ctx, 10, 10, 15, HEX_COLORS)
  drawKey(ctx, 120, 10, 15, PLAYER)
}

function drawKey(ctx, x, y, size, labels) {
  var i = 0
  ctx.font = size + 'px sans-serif'
  for (var name in labels) {
    ctx.fillStyle = labels[name]
    ctx.fillRect(x, y + i*(size + 5), size, size)
    ctx.fillStyle = 'black'
    ctx.fillText(name, x + 10 + size, y + (i+.6)*(size + 5))
    i+=1
  }
}

var RAD = 6
function drawTiles(ctx, width, padding, grid) {
  var h = grid.hexes
    , w = (width - padding*2) / 2 / grid.radius
  for (var y=0; y<h.length; y++) {
    for (var x=0; x<h[y].length; x++) {
      drawHex(ctx, width, width / grid.radius / 2, h[y][x], grid.x0, grid.y0)
      // ctx.fillRect(w*x + padding, w*y + padding, w, w)
    }
  }
  for (var y=0; y<h.length; y++) {
    for (var x=0; x<h[y].length; x++) {
      drawHexLines(ctx, width, width / grid.radius / 2, h[y][x], grid.x0, grid.y0)
      // ctx.fillRect(w*x + padding, w*y + padding, w, w)
    }
  }
  for (var y=0; y<h.length; y++) {
    for (var x=0; x<h[y].length; x++) {
      drawHexVetices(ctx, width, width / grid.radius / 2, h[y][x], grid.x0, grid.y0)
      // ctx.fillRect(w*x + padding, w*y + padding, w, w)
    }
  }
}

function color(hex) {
  if (!hex.isLand) return HEX_COLORS.Water
  return HEX_COLORS[hex.landtype || 'Desert']
}

function hexPoints(rx, ry, hw) {
  return [
      [rx-hw*2/3, ry],
      [rx-hw/3, ry-hw/2],
      [rx+hw/3, ry-hw/2],
      [rx+hw*2/3, ry],
      [rx+hw/3, ry+hw/2],
      [rx-hw/3, ry+hw/2]
  ]
}

// The possible edge directions are "NW","N","NE","SE","S","SW"
function hexLines(rx, ry, hw) {
  var points = hexPoints(rx, ry, hw)
    , lines = []
  for (var i=0; i<points.length; i++) {
    lines.push([points[i], points[i+1 >= points.length ? 0 : i+1]])
  }
  return lines
}

function drawGon(ctx, rx, ry, hw) {
  var points = hexPoints(rx, ry, hw)
  ctx.beginPath()
  ctx.moveTo(points[points.length-1][0], points[points.length-1][1])
  for (var i=0; i<points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.fill()
  /**
  ctx.strokeStyle = '#555'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(points[points.length-1][0], points[points.length-1][1])
  for (var i=0; i<points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.stroke()
  **/
}

function drawHexVetices(ctx, width, hw, hex, x0, y0) {
  var cx = width/2
    , x = (hex.location.x)
    , y = (hex.location.y)
    , rx = cx + x * hw
    , ry = cx + y * hw + x * hw/2
    , points = hexPoints(rx, ry, hw)
  hex.vertexes.forEach(function (vertex, i) {
    if (vertex.value.ownerID === -1) return
    ctx.fillStyle = PLAYER[vertex.value.ownerID]
    var w = vertex.value.worth * hw/8
    ctx.fillRect(points[i][0]-w, points[i][1]-w, w*2, w*2)
  })
}

function drawHexLines(ctx, width, hw, hex, x0, y0) {
  var cx = width/2
    , x = (hex.location.x)
    , y = (hex.location.y)
    , rx = cx + x * hw
    , ry = cx + y * hw + x * hw/2
    , lines = hexLines(rx, ry, hw)
  console.log(lines)
  hex.edges.forEach(function (edge, i) {
    if (edge.value.ownerID === -1) return
    ctx.strokeStyle = PLAYER[edge.value.ownerID]
    ctx.lineWidth = hw/10
    ctx.beginPath()
    ctx.moveTo(lines[i][0][0], lines[i][0][1])
    ctx.lineTo(lines[i][1][0], lines[i][1][1])
    ctx.stroke()
  })
}

function drawHex(ctx, width, hw, hex, x0, y0) {
  var cx = width/2
    , x = (hex.location.x)
    , y = (hex.location.y)
    , rx = cx + x * hw
    , ry = cx + y * hw + x * hw/2
    , lines = hexLines(rx, ry, hw)
  ctx.fillStyle = color(hex)
  // ctx.fillRect(rx - hw/2, ry - hw/2, hw, hw)
  drawGon(ctx, rx, ry, hw)
  ctx.font = (hw/3) + 'px sans-serif'

  ctx.strokeStyle = 'white'
  ctx.lineWidth = hw/20
  ctx.strokeText(x + ', ' + y,  rx - hw/3, ry + hw/8)
  ctx.fillStyle = 'black'
  ctx.fillText(x + ', ' + y,  rx - hw/3, ry + hw/8)
}

