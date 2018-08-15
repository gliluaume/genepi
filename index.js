'use strict'

const { GenepiReader, GenepiReaderEE, customize } = require('./lib/reader-event-emitter')
const { split } = require('./lib/split')
const { pivot } = require('./lib/pivot')

/**
 * Iterate through words using outputter as a plugin
 * @param {string} text a text to process
 * @param {Object} outputter something with header(), footer(), inner(word, index) functions
 * to do something with read words
 * @param {number} delayMs delay between two calls to outputter.inner(word, index)
 */
function genepi(text, outputter, delayMs = 200) {
  // TODO avoid duplication
  return new Promise((resolve) => {
    let wordIndex = 0
    outputter.header()
    const words = split(text)
    const time = setInterval(() => {
      if ((wordIndex < 0) || (words.length <= wordIndex)) {
        clearInterval(time)
        outputter.footer()
        resolve()
      } else {
        const word = words[wordIndex]
        const index = pivot(word)
        outputter.inner(word, index)
      }
      wordIndex++
    }, delayMs)
  })
}

module.exports = {
  genepi,
  GenepiReader,
  GenepiReaderEE,
  customize
}
