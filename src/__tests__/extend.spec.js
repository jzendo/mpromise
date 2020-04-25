/* global describe, test, expect, jest */

import Promise, { defer } from '../extend'

// Promise.prototype.catch suit
import catchSuit from './promise.prototype.catch.suit'
// defer
import deferSuit from './extend.defer.suit'

describe('extend promise(Add `Promise.prototype.catch` & `Promise.all` & `Promise.race` & ...)', () => {
  deferSuit(defer)
  catchSuit(Promise)

  describe('Promise.prototype.then', () => {
    test('should the resolved value when call then with no argument', done => {
      expect(typeof Promise === 'function').toBeTruthy()

      const testResult = 'test'

      new Promise(resolve => resolve(testResult))
        .then()
        .then(v => {
          expect(v).toBe(testResult)
          done()
        })
    })

    test('should catch when throw exception in then', done => {
      const testResult = new Error('test')

      new Promise(resolve => resolve(testResult))
        .then(() => {
          throw testResult
        })
        .catch(v => {
          expect(v).toBe(testResult)
          done()
        })
    })
  })

  describe('Promise.resolve', () => {
    test('should resolve', async () => {
      expect(typeof Promise.resolve === 'function').toBeTruthy()

      expect(() => {
        Promise.resolve()
      }).not.toThrow()

      expect(await Promise.resolve(1)).toBe(1)
    })
  })

  describe('Promise.reject', () => {
    test('reject none', done => {
      expect(typeof Promise.reject === 'function').toBeTruthy()

      // eslint-disable-next-line
      const promise1 = Promise.reject()

      promise1.deferThrowErr_.handler = error => {
        expect(error).toBeUndefined()
        done()
      }
    })

    test('reject error', done => {
      expect(typeof Promise.reject === 'function').toBeTruthy()

      const testError = new Error('test')
      const promise1 = Promise.reject(testError)

      promise1.deferThrowErr_.handler = error => {
        expect(error).toBe(testError)
        done()
      }
    })

    test('reject promise', done => {
      expect(typeof Promise.reject === 'function').toBeTruthy()

      const testError = new Error('test')
      const promise = Promise.reject(testError)
      const promise1 = Promise.reject(promise)

      promise1.deferThrowErr_.handler = error => {
        expect(error).toBe(testError)
        done()
      }
    })

    test('catch after piped', done => {
      expect(typeof Promise.reject === 'function').toBeTruthy()

      const testError = new Error('test')
      const promise = Promise.reject(testError)

      Promise.reject(promise).then(undefined, err => {
        expect(err).toBe(testError)
        done()
      })
    })
  })

  describe('Promise.all', () => {
    test('should throw when no argument', () => {
      expect(typeof Promise.all === 'function').toBeTruthy()

      expect(() => {
        Promise.all()
      }).toThrow()

      expect(() => {
        Promise.all(1)
      }).toThrow()
    })

    test('should be ok when all resolved', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      const allFn = jest.fn()

      const promise1 = new Promise((resolve) => {
        fn1()
        resolve(1)
      })

      const promise2 = new Promise((resolve) => {
        fn2()
        resolve(2)
      })

      let values

      try {
        values = await Promise.all([promise1, promise2])
        allFn()
      } catch (e) {
        values = undefined
      }

      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
      expect(allFn).toHaveBeenCalled()
      expect(values && values.length === 2).toBeTruthy()
    })

    test('should be rejected when one rejected', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      const allFn = jest.fn()

      const throwError = new Error('test')

      const promise1 = new Promise((resolve) => {
        fn1()
        resolve(1)
      })

      const promise2 = new Promise((resolve, reject) => {
        fn2()
        reject(throwError)
      })

      let values

      try {
        await Promise.all([promise1, promise2])
        allFn()
      } catch (e) {
        values = e
      }

      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
      expect(allFn).toHaveBeenCalledTimes(0)
      expect(values === throwError).toBeTruthy()
    })
  })

  describe('Promise.race', () => {
    test('should throw when no argument', () => {
      expect(typeof Promise.race === 'function').toBeTruthy()

      expect(() => {
        Promise.race()
      }).toThrow()

      expect(() => {
        Promise.race(1)
      }).toThrow()
    })

    test('should be resolved when one resolved', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      const allFn = jest.fn()

      let promise1Result

      const promise1 = new Promise((resolve) => {
        setTimeout(() => {
          promise1Result = 1
          fn1()
          resolve(1)
        }, 500)
      })

      const promise2 = new Promise((resolve) => {
        setTimeout(() => {
          fn2()
          resolve(2)
        }, 100)
      })

      let value

      try {
        value = await Promise.race([promise1, promise2])
        allFn()
      } catch (e) {
        value = undefined
      }

      expect(promise1Result).toBeUndefined()
      expect(fn2).toHaveBeenCalled()
      expect(allFn).toHaveBeenCalled()
      expect(value === 2).toBeTruthy()
    })

    test('should be resolved when the first resolved', async () => {
      const allFn = jest.fn()

      let value
      const maybeValue = 1

      try {
        value = await Promise.race([maybeValue, 2])
        allFn()
      } catch (e) {
        value = undefined
      }

      expect(allFn).toHaveBeenCalled()
      expect(value === maybeValue).toBeTruthy()
    })

    test('should match the first item resolved or rejected', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      let value
      const maybeRejectedValue = new Error('test')
      const maybeResolvedValue = 2

      try {
        value = await Promise.race([Promise.reject(maybeRejectedValue), maybeResolvedValue])
        fn1()
      } catch (e) {
        value = e
      }

      expect(fn1).toHaveBeenCalledTimes(0)
      expect(value === maybeRejectedValue).toBeTruthy()

      try {
        value = await Promise.race([maybeResolvedValue, Promise.reject(maybeRejectedValue)])
        fn2()
      } catch (e) {
        value = e
      }

      expect(fn2).toHaveBeenCalledTimes(1)
      expect(value === maybeResolvedValue).toBeTruthy()
    })
  })

  describe('Promise.prototype.catch', () => {
    // Test: constructor
    test('rejected when instantiating an object', (done) => {
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
    test('rethrow when no argument', (done) => {
      const testError = new Error('test')
      const promise1 = new Promise((resolve, reject) => reject(testError))

      promise1.catch().then(undefined, error => {
        expect(error).toBe(testError)
        done()
      })
    })

    // Test: arg(non-function)
    test('ignore the non-function argument', (done) => {
      const testError = new Error('test')
      const promise1 = new Promise((resolve, reject) => reject(testError))
      promise1.catch(1).then(undefined, error => {
        expect(error).toBe(testError)
        done()
      })
    })

    // Test: normal catch
    test('catch the rejected', (done) => {
      const testError = new Error('test')
      const promise1 = new Promise((resolve, reject) => reject(testError))
      promise1.catch(err => {
        expect(err).toBe(testError)
        done()
      })
    })

    // Test: then
    test('should do fulfilled after catch', (done) => {
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
    test('should catch when rethrowing in the prev-catch block', (done) => {
      const testError = new Error('test')
      const testRethrowError = new Error('test')
      const promise1 = new Promise((resolve, reject) => reject(testError))

      promise1
        /* eslint-disable handle-callback-err */
        .catch(err => {
          throw testRethrowError
        })
        /* eslint-enable handle-callback-err */
        .then(undefined, err => {
          expect(err).toBe(testRethrowError)
          done()
        })
    })

    // Test: re-throw error
    test('should catch when rethrowing in the prev-then block', (done) => {
      const testError = new Error('test')
      const promise1 = new Promise((resolve, reject) => reject(testError))

      promise1.then(undefined, err => {
        throw err
      }).catch(err => {
        expect(err).toBe(testError)
        done()
      })
    })
  })
})
