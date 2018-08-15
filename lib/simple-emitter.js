'use strict'

class SimpleEmitter {
  constructor() {
    this.callbacks = { }
  }
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => {
        callback(data)
      })
    }
  }
  on(event, callback) {
    this.callbacks[event] = this.callbacks[event] || []
    if (!this.callbacks[event].includes(callback)) {
      this.callbacks[event].push(callback)
    }
  }
}

module.exports = SimpleEmitter
