'use strict'

/**
 * Get pivot char index in a word
 * @param {string} word
 * @returns index of optimal recognition position char
 */
function pivot(word) {
  switch (word.length) {
    case 1:
      return 0
    case 2:
    case 3:
    case 4:
    case 5:
      return 1
    case 6:
    case 7:
    case 8:
    case 9:
      return 2
    case 10:
    case 11:
    case 12:
    case 13:
      return 3
    default:
      return 4
  }
}

module.exports = { pivot }
