'use strict'

const { split } = require('./lib/split')
const { pivot } = require('./lib/pivot')
const BluPromise = require('bluebird')

BluPromise.config({
  cancellation: true
})

class GenepiReader {
  constructor(text, outputter) {
    this._delay = 200
    this._currentIndex = 0
    this._backward = false
    this._prom = null
    this._outputter = outputter
    this._text = text
  }

  get isBackward() {
    return this._backward
  }

  get delay() {
    return this._delay
  }

  get position() {
    return this._currentIndex
  }

  get status() {
    if (this._prom === null) {
      return 'init'
    }
    if (this._prom.isFulfilled()) {
      return 'end'
    }
    if (this._prom.isCancelled()) {
      return 'paused'
    }
    // actually this line is tested, istanbul does not see it. TODO see why
    /* istanbul ignore next */
    if (this._prom.isPending()) {
      return 'reading'
    }
  }

  pause() {
    // bluebird cancel is synchronous
    this._prom.cancel()
    return this._currentIndex
  }

  read(delayMs = 200, position = 0, backward = false) {
    return this.play(this._text,
      this._outputter,
      this._delay || delayMs,
      this._position || position,
      this._backward || backward)
  }

  resume(text, outputter) {
    return this.play(this._text || text,
      this._outputter || outputter,
      this._delay,
      this._currentIndex,
      this._backward)
  }

  play(text, outputter, delayMs = 200, position = 0, backward = false) {
    this._backward = backward
    this._delay = delayMs
    this._currentIndex = position
    // TODO avoid duplication
    this._prom = new BluPromise((resolve, reject, onCancel) => {
      outputter.header()
      const words = split(text)
      const time = setInterval(() => {
        if (this._prom.isCancelled()) return // TODO un-hack
        if ((this._currentIndex < 0) || (words.length <= this._currentIndex)) {
          clearInterval(time)
          outputter.footer()
          resolve()
        } else {
          const word = words[this._currentIndex]
          const index = pivot(word)
          outputter.inner(word, index)
        }
        this._currentIndex = this._currentIndex + (backward ? -1 : 1)
      }, this._delay)
      // actually this line is tested, istanbul does not see it. TODO see why
      /* istanbul ignore next */
      onCancel && onCancel(() => clearInterval(time))
    })
    return this._prom
  }
}

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

module.exports = { genepi, GenepiReader }
