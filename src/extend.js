import PromiseBase from './index'
// import { teardownDeferThrow } from './util'

function checkIterable (iterable) {
  // TODO: check iterable
  if (!Array.isArray(iterable)) {
    throw new Error('The first argument is not iterable (cannot read property Symbol(Symbol.iterator))')
  }
}

/**
 * Extend Promise
 *
 * - Promise.prototype.catch
 * - Promise.resolve
 * - Promise.reject
 * - Promise.all
 * - Promise.race
 *
 * @class Promise
 */
export default class Promise extends PromiseBase {
  /**
   * Handle exception
   * @param {function=} fn exception handler
   */
  catch (fn) {
    // teardownDeferThrow(this)
    return this.then(undefined, fn)
  }

  /**
   * @static Promise.resolve
   * @param {*} v
   */
  static resolve (v) {
    if (v instanceof Promise) return v

    return new Promise((resolve, reject) => {
      resolve(v)
    })
  }

  /**
   * @static Promise.reject
   * @param {*} v
   */
  static reject (v) {
    if (v instanceof Promise) return v

    return new Promise((resolve, reject) => {
      reject(v)
    })
  }

  /**
   * @static Promise.all
   * @param {Iterable} iterable
   */
  static all (iterable) {
    checkIterable(iterable)

    const { promise, resolve, reject } = defer()

    let count = 0
    let resolvedCount = 0
    const values = []

    const checkResolveProxy = idx => value => {
      resolvedCount++
      values[idx] = value

      if (resolvedCount >= count) {
        resolve(values)
      }
    }

    for (const item of iterable) {
      count++

      Promise.resolve(item)
        .then(checkResolveProxy(count - 1), reject)
    }

    return promise
  }

  /**
   * @static Promise.race
   * @param {Iterable} iterable
   */
  static race (iterable) {
    checkIterable(iterable)

    const { promise, resolve, reject } = defer()

    for (const item of iterable) {
      Promise.resolve(item)
        .then(resolve, reject)
    }

    return promise
  }
}

// Generate `defer` util
export const defer = () => {
  const pending = {}

  pending.promise = new Promise((resolve, reject) => {
    pending.resolve = resolve
    pending.reject = reject
  })

  return pending
}
