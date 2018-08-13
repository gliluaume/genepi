'use strict'

const { genepi } = require('../')

const outputter = {
  header: function header() {},
  inner: function inner(word, index) {},
  footer: function footer() {}
}

jest.setTimeout(100)

describe('Genepi', () => {
  let spyHeader
  let spyInner
  let spyFooter

  beforeEach(() => {
    spyHeader = jest.spyOn(outputter, 'header')
    spyInner = jest.spyOn(outputter, 'inner')
    spyFooter = jest.spyOn(outputter, 'footer')
  })

  afterEach(() => {
    spyHeader.mockReset()
    spyHeader.mockRestore()
    spyInner.mockReset()
    spyInner.mockRestore()
    spyFooter.mockReset()
    spyFooter.mockRestore()
  })

  describe('genepi function iterates on a string containing words', () => {
    it('uses an outputter class [integration]', () => {
      const text = 'This is a splendid textstring.'

      return genepi(text, outputter, 1).then(() => {
        expect(spyHeader).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyFooter).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyInner).toBeCalledWith('This', 1)
        expect(spyInner).toBeCalledWith('is', 1)
        expect(spyInner).toBeCalledWith('a', 0)
        expect(spyInner).toBeCalledWith('splendid', 2)
        expect(spyInner).toBeCalledWith('textstring.', 3)
      })
    })
    it('uses an outputter class [integration] deux', () => {
      const text = 'This ot.'

      return genepi(text, outputter, 1).then(() => {
        expect(spyHeader).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyFooter).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyInner).toBeCalledWith('This', 1)
        expect(spyInner).toBeCalledWith('ot.', 1)
        expect(spyInner).not.toBeCalledWith('a', 0)
        expect(spyInner).not.toBeCalledWith('splendid', 2)
        expect(spyInner).not.toBeCalledWith('textstring.', 3)
      })
    })
    // TODO see why test put after this one fail (is it specific to current usage?)
    it('calls outputter with a 200ms delay by default', () => {
      jest.useFakeTimers()
      const text = 'This.'

      genepi(text, outputter)

      expect(spyHeader).toBeCalled()
      expect(spyInner).not.toBeCalled()
      expect(spyFooter).not.toBeCalled()

      jest.advanceTimersByTime(200)
      expect(spyInner).toBeCalled()
      expect(spyFooter).not.toBeCalled()

      jest.advanceTimersByTime(200)
      expect(spyFooter).toBeCalled()
    })
  })
})
