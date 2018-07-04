'use strict'

const { genepi } = require('../')

describe('Genepi', () => {
  const outputter = {
    header: function header() {},
    inner: function inner(word, index) {},
    footer: function footer() {}
  }

  describe('iterates on a string containing words', () => {
    it('uses an outputter class [integration]', () => {
      const spyHeader = jest.spyOn(outputter, 'header')
      const spyInner = jest.spyOn(outputter, 'inner')
      const spyFooter = jest.spyOn(outputter, 'footer')
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
      }).then(() => {
        spyHeader.mockReset()
        spyHeader.mockRestore()
        spyInner.mockReset()
        spyInner.mockRestore()
        spyFooter.mockReset()
        spyFooter.mockRestore()
      })
    })
    it('calls outputter with a 200ms delay by default', () => {
      jest.useFakeTimers()
      const spyHeader = jest.spyOn(outputter, 'header')
      const spyInner = jest.spyOn(outputter, 'inner')
      const spyFooter = jest.spyOn(outputter, 'footer')

      const text = 'This.'

      genepi(text, outputter)

      try {
        expect(spyHeader).toBeCalled()
        expect(spyInner).not.toBeCalled()
        expect(spyFooter).not.toBeCalled()

        jest.advanceTimersByTime(200)
        expect(spyInner).toBeCalled()
        expect(spyFooter).not.toBeCalled()

        jest.advanceTimersByTime(200)
        expect(spyFooter).toBeCalled()
      } finally {
        spyHeader.mockReset()
        spyHeader.mockRestore()
        spyInner.mockReset()
        spyInner.mockRestore()
        spyFooter.mockReset()
        spyFooter.mockRestore()
      }
    })
  })
})
