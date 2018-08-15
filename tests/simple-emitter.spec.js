'use strict'

const SimpleEmitter = require('../lib/simple-emitter')

let spyListen
const listener = {
  listen: function listen(_) { }
}

jest.setTimeout(100)

describe('SimpleEmitter', () => {
  beforeEach(() => {
    spyListen = jest.spyOn(listener, 'listen')
  })

  afterEach(() => {
    spyListen.mockReset()
  })

  it('does not notify listener before emit', () => {
    const simpleEmitter = new SimpleEmitter()

    simpleEmitter.on('data', listener.listen)
    expect(spyListen).not.toBeCalled()
  })

  it('does notify a non registered listener', () => {
    const simpleEmitter = new SimpleEmitter()
    simpleEmitter.emit('data', 'hola')
    expect(spyListen).not.toBeCalled()
  })

  it('does not registered listener more than once', () => {
    const simpleEmitter = new SimpleEmitter()
    simpleEmitter.on('data', listener.listen)
    simpleEmitter.on('data', listener.listen)
    simpleEmitter.emit('data', 'hola')
    expect(spyListen.mock.calls).toEqual([['hola']])
  })

  it('notifies a listener after emit', () => {
    const simpleEmitter = new SimpleEmitter()

    simpleEmitter.on('data', listener.listen)
    expect(spyListen).not.toBeCalled()

    simpleEmitter.emit('data', 'hola')
    expect(spyListen).toBeCalledWith('hola')
  })

  describe('muliple listeners', () => {
    let spyOtherListen
    const otherListener = {
      listen: function listen(_) { }
    }
    beforeEach(() => {
      spyListen = jest.spyOn(listener, 'listen')
      spyOtherListen = jest.spyOn(otherListener, 'listen')
    })

    afterEach(() => {
      spyListen.mockReset()
      spyOtherListen.mockReset()
    })

    it('notifies all listeners after emit', () => {
      const simpleEmitter = new SimpleEmitter()

      simpleEmitter.on('data', listener.listen)
      simpleEmitter.on('data', otherListener.listen)
      expect(spyListen).not.toBeCalled()
      expect(spyOtherListen).not.toBeCalled()

      simpleEmitter.emit('data', 'hola')
      expect(spyListen).toBeCalledWith('hola')
      expect(spyOtherListen).toBeCalledWith('hola')
    })
  })
})
