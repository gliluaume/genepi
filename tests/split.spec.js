'use strict'

const { split } = require('../split')

describe('Split', () => {
  it('can split words with punctuation in english', () => {
    const input = 'This text. Is simple: it\'s in english'
    const expected = [
      'This',
      'text.',
      'Is',
      'simple:',
      'it\'s',
      'in',
      'english'
    ]
    const actual = split(input)
    expect(actual).toEqual(expected)
  })
  it('can split words with punctuation in french', () => {
    const input = `C'est un texte, français ?
    Oui : il est simple. Simple ! Même les accents de noël passent !`
    const expected = [
      'C\'est',
      'un',
      'texte,',
      'français ?',
      'Oui :',
      'il',
      'est',
      'simple.',
      'Simple !',
      'Même',
      'les',
      'accents',
      'de',
      'noël',
      'passent !'
    ]
    const actual = split(input)
    expect(actual).toEqual(expected)
  })
})
