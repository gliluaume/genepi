# genepi [![Build Status](https://travis-ci.org/gliluaume/genepi.svg?branch=master)](https://travis-ci.org/gliluaume/genepi)
A tiny fast reading library. It is not usable by itself but you can have a look at [genepi-console](https://github.com/gliluaume/genepi-console) to use it from your terminal.

## Install
```
$ npm install genepi
```

## Usage
```js
const { genepi } = require('genepi')
const DELAY = 180

const outputter = {
  header: function header() { /* do stuff */ },
  inner: function inner(word, index) { /* do stuff */ },
  footer: function footer() { /* do stuff */ }
}

function genepize(text) {
  return genepi(text, myOutputter, DELAY)
}

genepize('This is a text')
  .then(() => console.log('end of treatment'))
```

## API
### GenepiReader class
__GenepiReader__ class extends __SimpleEmitter__ which is a minimalistic way to send event to a listener. It provides `on` and `emit` functions.
__GenepiReader__ provides functions to change reading parameters
 * `constructor(text, outputter)` take a text and an object (outputter) which handle words
 * `read(delayMs = 200, position = 0, backward = false)` executes function of the *outputter* (`header()`, `inner(word, index)` and `footer()`)
 * `pause()` pause reading and returns current position
 * `changeDelay(delay)` which pause then play with given delay
 * `get length()` get number of words
 * `get isBackward()` return true if reader is reading backward
 * `get delay()` return current delay {
 * `get position()` return current position {
 * `get status()` return current status {
 * `emitStatusChange(status)` emit a `'StatusChange'` event with status as a string for payload. This is the function internally used by other functions that changes reading status. Possible statuses are:
   * `'init'`
   * `'reading'`
   * `'paused'`
   * `'end'`

### GenepiReaderEE class
 __GenepiReaderEE__ is the same as GenepiReader but extending node's __EventEmitter__.


### customize function
 __customize__ is a function allowing user to chose extended class as function parameter. It returns a class of readers. So, given a __MyEventEmitter__ a reader can be instanciated as follow
```js
const myCustomReader = new customize(MyEventEmitter)
```

## SimpleEmitter
The minimalistic event emitter used by __GenepiReader__ is a class with two methods:
 * `on(event, callback)`: to register a listener (`callback`)
 * `emit(event, data)`: to send an event to listener with data as a payload

Only those two methods from __EventEmitter__ are called by __GenepiReader__. As __EventEmitter__ may not be available outside of NodeJS, __SimpleEmitter__ is here to give a mean to call listeners in an internal use only. It is not exposed by the API.