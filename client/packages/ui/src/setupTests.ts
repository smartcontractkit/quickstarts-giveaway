import 'jest'
import replaceAllInserter from 'string.prototype.replaceall'

global.IS_REACT_ACT_ENVIRONMENT = true

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

replaceAllInserter.shim()
