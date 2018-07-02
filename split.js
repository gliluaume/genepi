'use strict'

function split(text) {
  return text.match(/[^\s.;,!?]+[,.]?( ?[;:!?])?/gi)
}

module.exports = {
  split
}
