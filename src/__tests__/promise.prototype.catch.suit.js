/* global test, expect, jest */

import Promise from '../extend'

// Test: constructor
test('test Promise.prototype.catch #1', (done) => {
  expect(typeof Promise.prototype.catch === 'function').toBeTruthy()

  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))

  // Reset timeout handler
  promise1.deferThrowErr_.handler = error => {
    expect(error).toBe(testError)
    done()
  }
})

// Test: arg(no arg)
test('test Promise.prototype.catch #2', (done) => {
  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))

  promise1.catch().then(undefined, error => {
    expect(error).toBe(testError)
    done()
  })
})


// Test: arg(non-function)
test('test Promise.prototype.catch #3', (done) => {
  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))
  promise1.catch(1).then(undefined, error => {
    expect(error).toBe(testError)
    done()
  })
})

// Test: normal catch
test('test Promise.prototype.catch #4', (done) => {
  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))
  const promise2 = promise1.catch(err => {
    expect(err).toBe(testError)
    done()
  })
})

// Test: then
test('test Promise.prototype.catch #5', (done) => {
  let exception
  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))

  promise1.catch(err => { exception = err }).then(v => {
    expect(exception).toBe(testError)
    expect(v).toBeUndefined()
    done()
  })
})

// Test: re-throw error
test('test Promise.prototype.catch #6', (done) => {
  let exception
  const testError = new Error('test')
  const testRethrowError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))

  promise1.catch(err => {
    throw testRethrowError
  }).then(undefined, err => {
    expect(err).toBe(testRethrowError)
    done()
  })
})

// Test: re-throw error
test('test Promise.prototype.catch #7', (done) => {
  const testError = new Error('test')
  const promise1 = new Promise((resolve, reject) => reject(testError))

  const promise2 = promise1.then(undefined, err => {
    throw err
  }).catch(err => {
    expect(err).toBe(testError)
    done()
  })
})
