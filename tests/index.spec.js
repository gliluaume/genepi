'use strict'

const { genepi, GenepiReader } = require('../')

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

  describe('GenepiReader', () => {
    it('uses an outputter class [integration]', () => {
      const reader = new GenepiReader()
      const text = 'This is a splendid textstring.'

      return reader.play(text, outputter, 1).then(() => {
        expect(spyHeader).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyFooter).toHaveBeenCalled()
        expect(spyInner.mock.calls).toEqual([
          ['This', 1],
          ['is', 1],
          ['a', 0],
          ['splendid', 2],
          ['textstring.', 3]
        ])
      })
    })
    it('can play forward from a given word index', () => {
      const reader = new GenepiReader()
      const text = 'This is a splendid textstring.'

      return reader.play(text, outputter, 1, 2).then(() => {
        expect(spyHeader).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyFooter).toHaveBeenCalled()
        expect(spyInner.mock.calls).toEqual([
          ['a', 0],
          ['splendid', 2],
          ['textstring.', 3]
        ])
      })
    })
    it('can play backward', () => {
      const reader = new GenepiReader()
      const text = 'This is a splendid textstring.'

      return reader.play(text, outputter, 1, 3, true).then(() => {
        expect(reader.isBackward).toBe(true)
        expect(spyHeader).toHaveBeenCalled()
        expect(spyInner).toHaveBeenCalled()
        expect(spyFooter).toHaveBeenCalled()
        expect(spyInner).not.toBeCalledWith('textstring.', 3)
        expect(spyInner.mock.calls).toEqual([
          ['splendid', 2],
          ['a', 0],
          ['is', 1],
          ['This', 1]
        ])
      })
    })
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

  describe('GenepiReader advanced', () => {
    it('can be paused and resumed', () => {
      jest.useFakeTimers()
      const text = 'This is a splendid textstring.'

      const reader = new GenepiReader()
      expect(reader.status).toBe('init')
      reader.play(text, outputter)
      expect(reader.status).toBe('reading')

      expect(reader.isBackward).toBe(false)
      expect(reader.delay).toBe(200)
      expect(spyInner).not.toBeCalled()

      jest.advanceTimersByTime(400)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      const currentIndex = reader.pause()
      expect(reader.status).toBe('paused')
      expect(currentIndex).toBe(2)
      expect(reader.position).toBe(2)
      expect(reader._prom.isCancelled()).toBe(true)
      jest.advanceTimersByTime(1000)

      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      reader.resume(text, outputter)
      expect(reader._prom.isCancelled()).toBe(false)
      jest.advanceTimersByTime(1000)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1],
        ['a', 0],
        ['splendid', 2],
        ['textstring.', 3]
      ])
      expect(reader.status).toBe('end')
    })
  })

  describe('Provide simple API', () => {
    it('resolves immediately on too great index', () => {
      jest.useFakeTimers()
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReader(text, outputter)

      reader.read(300, 10)
      jest.advanceTimersByTime(5)

      expect(reader._prom.isResolved()).toBe(true)
      expect(reader.status).toBe('end')
    })

    it('can be paused and resumed', () => {
      jest.useFakeTimers()
      const text = 'This is a splendid textstring.'

      const reader = new GenepiReader(text, outputter)
      expect(reader.status).toBe('init')
      reader.read()
      expect(reader.status).toBe('reading')
      expect(reader.length).toBe(5)

      expect(reader.isBackward).toBe(false)
      expect(reader.delay).toBe(200)
      expect(spyInner).not.toBeCalled()

      jest.advanceTimersByTime(400)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      const currentIndex = reader.pause()
      expect(reader.status).toBe('paused')
      expect(currentIndex).toBe(2)
      expect(reader.position).toBe(2)
      jest.advanceTimersByTime(1000)

      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      reader.resume()
      jest.advanceTimersByTime(1000)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1],
        ['a', 0],
        ['splendid', 2],
        ['textstring.', 3]
      ])
      expect(reader.status).toBe('end')
    })
  })
})
