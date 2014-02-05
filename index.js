
var drawMap = require('./lib')

module.exports = function (els) {
  var error = function (text) {
    els.messages.innerHTML += '<br/>' + text
  }
  var draw = function () {
    var data
    try {
      data = JSON.parse(els.text.value)
    } catch (e) {
      error(e.message)
      return
    }
    drawMap(els.canvas, data, function (err, result) {
      if (err) error(err.message)
    })
  }
  els.button.addEventListener('click', draw)
  draw()
}

