'use strict'

const { split } = require('./lib/split')
const { pivot } = require('./lib/pivot')
const BluPromise = require('bluebird')

function genepiBuilder(text, outputter, delayMs = 200) {
  return (resolve, reject, onCancel) => {
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
    onCancel(() => clearInterval(time))
  }
}

class GenepiReader {
  constructor() {
    this._delay = 200
    this._currentIndex = 0
    this._prom = null
  }

  pause() {
    // bluebird cancel is synchronous
    // this._prom.cancel();
  }

  play(text, outputter, delayMs = 200) {
    this._prom = new BluPromise(
      genepiBuilder(text, outputter, delayMs = 200))
    return this._prom
  }

  backward() { }

  get promise() {
    return this._prom
  }

  set delay(duration) { }

  get delay() {}
}

/**
 * Iterate through words using outputter as a plugin
 * @param {string} text a text to process
 * @param {Object} outputter something with header(), footer(), inner(word, index) functions
 * to do something with read words
 * @param {number} delayMs delay between two calls to outputter.inner(word, index)
 */
function genepi(text, outputter, delayMs = 200) {
  return new Promise(genepiBuilder(text, outputter, delayMs))
}

module.exports = { genepi, GenepiReader }
