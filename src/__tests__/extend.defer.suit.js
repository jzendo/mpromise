/* global test, expect, jest */

import { defer } from '../extend'

test('test defer #1', () => {
  expect(typeof defer === 'function').toBeTruthy()
})

test('test defer #2', (done) => {
  const {
    resolve,
    promise
  } = defer()

  const testResult = 123

  promise.then(v => {
    expect(v).toBe(testResult)
    done()
  })

  resolve(testResult)
})

test('test defer #3', (done) => {
  const {
    reject,
    promise
  } = defer()

  const testError = new Error('test')

  promise.then(undefined, err => {
    expect(err).toBe(testError)
    done()
  })

  reject(testError)
})
