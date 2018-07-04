'use strict'

const { split } = require('./split')
const { pivot } = require('./pivot')

/**
 * Iterate through words using outputter as a plugin
 * @param {string} text a text to process
 * @param {Object} outputter something with header(), footer(), inner(word, index) functions
 * to do something with read words
 * @param {number} delayMs delay between two calls to outputter.inner(word, index)
 */
function genepi(text, outputter, delayMs = 200) {
  return new Promise((resolve, reject) => {
    outputter.header()
    const words = split(text)
    const time = setInterval(() => {
      if (words.length < 1) {
        clearInterval(time)
        outputter.footer()
        resolve()
      } else {
        const word = words.shift()
        const index = pivot(word)
        outputter.inner(word, index)
      }
    }, delayMs)
  })
}

module.exports = { genepi }
