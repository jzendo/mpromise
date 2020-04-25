/* global describe, test, expect */

import Promise, { defer } from '../index'

// defer
import deferSuit from './extend.defer.suit'

describe('default promise', () => {
  deferSuit(defer)

  describe('Promise.prototype.then', () => {
    test('should call the fulfilled when the prev-then block is called with no argument', done => {
      expect(typeof Promise === 'function').toBeTruthy()

      const testResult = 'test'

      new Promise(resolve => resolve(testResult))
        .then()
        .then(v => {
          expect(v).toBe(testResult)
          done()
        })
    })

    test('should call the rejected when the pre-then block be rejected in the fulfilled', done => {
      expect(typeof Promise === 'function').toBeTruthy()

      const testResult = new Error('test')

      new Promise(resolve => resolve(testResult))
        .then(() => {
          throw testResult
        })
        .then(undefined, v => {
          expect(v).toBe(testResult)
          done()
        })
    })
  })
})
