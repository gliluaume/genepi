'use strict'

const { split } = require('./split')
const { pivot } = require('./pivot')

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
