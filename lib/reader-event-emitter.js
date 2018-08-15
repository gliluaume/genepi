'use strict'

const EventEmitter = require('events')
const SimpleEmitter = require('./simple-emitter')
const { split } = require('./split')
const { pivot } = require('./pivot')

function customize(emitterClass) {
  return class GenepiReaderEE extends emitterClass {
    constructor(text, outputter) {
      super()
      this._outputter = outputter
      this._text = text
      this._delay = 200
      this._currentIndex = 0
      this._backward = false
      this._words = split(text)
      this._length = this._words.length
      this._interval = null
      this._status = null
      this.emitStatusChange('init')
    }

    changeDelay(delay) {
      const position = this.pause()
      this.read(delay, position)
      return position
    }

    get length() {
      return this._length
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
      return this._status
    }

    emitStatusChange(status) {
      this._status = status
      this.emit('statusChange', this._status)
    }

    pause() {
      clearInterval(this._interval)
      this.emitStatusChange('paused')
      return this._currentIndex
    }

    read(delayMs, position, backward) {
      if (position >= this.length) {
        this.emitStatusChange('end')
        return
      }

      this._backward = !!backward
      this._currentIndex = Number.isInteger(position) ? position : this._currentIndex
      this._delay = delayMs || this._delay

      this.emitStatusChange('reading')
      this._outputter.header()

      this._interval = setInterval(() => {
        if ((this._currentIndex < 0) || (this.length < this._currentIndex + 1)) {
          clearInterval(this._interval)
          this._outputter.footer()
          this.emitStatusChange('end')
        } else {
          const word = this._words[this._currentIndex]
          const index = pivot(word)
          this._outputter.inner(word, index)
          this._currentIndex = this._currentIndex + (backward ? -1 : 1)
        }
      }, this._delay)
    }
  }
}

module.exports = {
  GenepiReader: customize(SimpleEmitter),
  GenepiReaderEE: customize(EventEmitter),
  customize
}
