/* global describe, test, expect */

export default defer => {
  describe('defer', () => {
    test('should be function', () => {
      expect(typeof defer === 'function').toBeTruthy()
    })

    test('should be resolved', (done) => {
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

    test('should throw exception', (done) => {
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
  })
}
