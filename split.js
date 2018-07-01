'use strict'

function split(text) {
  return text.match(/[àäëéèêàïîöôça-z0-9']+[,.]?( ?[;:!?])?/gi)
}

module.exports = {
  split
}
