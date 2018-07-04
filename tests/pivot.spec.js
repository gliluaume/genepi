'use strict'

const { pivot } = require('../lib/pivot')

describe('Pivot', () => {
  describe('determines char pivot index in a word according to its length', () => {
    it('of 1 char', () => {
      const actual = pivot('a')
      expect(actual).toEqual(0)
    })
    it('of 2 to 5 chars', () => {
      expect(pivot('ab')).toEqual(1)
      expect(pivot('abc')).toEqual(1)
      expect(pivot('ab :')).toEqual(1)
      expect(pivot('abcde')).toEqual(1)
    })
    it('of 6 to 9 chars', () => {
      expect(pivot('abcdef')).toEqual(2)
      expect(pivot('abcdefg')).toEqual(2)
      expect(pivot('abcdefgh')).toEqual(2)
      expect(pivot('abcdefghi')).toEqual(2)
    })
    it('of 10 to 13 chars', () => {
      expect(pivot('abcdefghij')).toEqual(3)
      expect(pivot('abcdefghijk')).toEqual(3)
      expect(pivot('abcdefghijkl')).toEqual(3)
      expect(pivot('abcdefghijklm')).toEqual(3)
    })
    it('more than 13 chars', () => {
      expect(pivot('abcdefghijklmn')).toEqual(4)
      expect(pivot('abcdefghijklmnopqrdtuvwxyz12345')).toEqual(4)
    })
  })
})
