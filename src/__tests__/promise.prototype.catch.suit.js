/* global describe, test, expect */

export default Promise => {
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
}
