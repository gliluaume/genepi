# genepi [![Build Status](https://travis-ci.org/gliluaume/genepi.svg?branch=master)](https://travis-ci.org/gliluaume/genepi)
A tiny fast reading library. It is not usable by itself but you can have a look at [genepi-console](https://github.com/gliluaume/genepi-console) to use it from you terminal.

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
__GenepiReader__ object provide function to change reading parameters
 * `genepiReader.pause()` stop reading and returns current position
 * `resume(text, outputter, backward = false)` is an alias of `play`
    return this.play(text, outputter, this._delay, this._currentIndex, backward)
 * `play(text, outputter, delayMs = 200, position = 0, backward = false)` returns a promise resolved when reading is complete