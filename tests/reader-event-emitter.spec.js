'use strict'

const { GenepiReaderEE } = require('../lib/reader-event-emitter')

function itWillEndBuilder(reader) {
  return new Promise((resolve) =>
    reader.on('statusChange', (data) => {
      if (data === 'end') {
        resolve(data)
      }
    })
  )
}

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
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReaderEE(text, outputter)
      const itWillEnd = itWillEndBuilder(reader)

      reader.read(1)
      return itWillEnd.then(() => {
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
    it('can read forward from a given word index', () => {
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReaderEE(text, outputter)
      const itWillEnd = itWillEndBuilder(reader)

      reader.read(1, 2)
      return itWillEnd.then(() => {
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
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReaderEE(text, outputter)
      const itWillEnd = itWillEndBuilder(reader)

      reader.read(1, 3, true)
      return itWillEnd.then(() => {
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
    describe('when asked index is greater than text length', () => {
      it('do nothing and immediately ends', () => {
        const text = 'This is a splendid textstring.'
        const reader = new GenepiReaderEE(text, outputter)
        const itWillEnd = itWillEndBuilder(reader)

        expect(reader.status).toBe('init')
        reader.read(1, 30, true)
        expect(reader.status).toBe('end')

        return itWillEnd.then(() => {
          expect(spyHeader).not.toHaveBeenCalled()
          expect(spyInner).not.toHaveBeenCalled()
          expect(spyFooter).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('GenepiReader advanced', () => {
    it('can be paused and resumed', () => {
      jest.useFakeTimers()
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReaderEE(text, outputter)

      expect(reader.status).toBe('init')
      reader.read()
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
      jest.advanceTimersByTime(1000)

      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      reader.read()
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
    it('delay can be changed', () => {
      jest.useFakeTimers()
      const text = 'This is a splendid textstring.'
      const reader = new GenepiReaderEE(text, outputter)

      expect(reader.status).toBe('init')
      reader.read(200)
      expect(reader.status).toBe('reading')

      expect(reader.delay).toBe(200)
      expect(spyInner).not.toBeCalled()

      jest.advanceTimersByTime(400)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      const currentIndex = reader.changeDelay(400)
      expect(reader.status).toBe('reading')
      expect(currentIndex).toBe(2)
      expect(reader.position).toBe(2)
      jest.advanceTimersByTime(200)

      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1]
      ])
      jest.advanceTimersByTime(200)
      expect(spyInner.mock.calls).toEqual([
        ['This', 1],
        ['is', 1],
        ['a', 0]
      ])
    })
  })
})
