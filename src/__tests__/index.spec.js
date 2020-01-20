/* global test, expect */

import Promise from '../index'

test('test Promise.prototype.then #1', done => {
  expect(typeof Promise === 'function').toBeTruthy()

  const testResult = 'test'

  new Promise(resolve => resolve(testResult))
    .then()
    .then(v => {
      expect(v).toBe(testResult)
      done()
    })
})

test('test Promise.prototype.then #2', done => {
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
