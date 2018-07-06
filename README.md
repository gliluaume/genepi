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
