/*!
 *  A Promises/A+ implememt by jzendo
 *  - Specification: https://promisesaplus.com/
 */

import {
  FULFILLED,
  PENDING,
  REJECTED,
  isFulfilled,
  isPending,
  isRejected,
  isResolved
} from './status'
import {
  flushPendingHandlers,
  isFunction,
  isObject,
  runAsync,
  teardownDeferThrow
} from './util'

/**
 *  @class Promise
 */
class Promise {
  constructor (fn) {
    this.status_ = PENDING
    this.value_ = undefined
    this.pendingHandlers_ = []
    this.promiseConstructor_ = Promise

    fn(this.resolve_.bind(this), this.reject_.bind(this))
  }

  resolve_ (value) {
    if (isResolved(this.status_)) return

    if (value === this) {
      throw new TypeError('Chaining cycle detected for promise')
    } else if (value instanceof this.promiseConstructor_) {
      value.then(this.resolve_.bind(this), this.reject_.bind(this))
    } else if (isFunction(value) || isObject(value)) {
      let once = false

      try {
        const { then } = value

        if (isFunction(then)) {
          const callerProxy = fn => val => {
            if (!once) {
              fn(val)
              once = true
            }
          }

          then.call(
            value,
            callerProxy(this.resolve_.bind(this)),
            callerProxy(this.reject_.bind(this))
          )
        } else {
          this.fulfill_(value)
        }
      } catch (e) {
        // https://promisesaplus.com/#point-55
        // https://promisesaplus.com/#point-59
        if (!once) this.reject_(e)
      }
    } else {
      this.fulfill_(value)
    }
  }

  fulfill_ (value) {
    this.fillWith_(value, FULFILLED)
  }

  reject_ (value) {
    this.fillWith_(value, REJECTED)
  }

  fillWith_ (value, status) {
    if (isResolved(this.status_)) return

    this.status_ = status
    this.value_ = value

    flushPendingHandlers(this)
  }

  then (onFulfilled, onRejected) {
    teardownDeferThrow(this)

    const { status_, value_ } = this

    const handleFulfillProxy = (resolve, reject) => val => {
      try {
        if (isFunction(onFulfilled)) resolve(onFulfilled(val))
        else resolve(val)
      } catch (e) {
        reject(e)
      }
    }

    const handleRejectProxy = (resolve, reject) => err => {
      try {
        if (isFunction(onRejected)) resolve(onRejected(err))
        else {
          reject(err)
        }
      } catch (e) {
        reject(e)
      }
    }

    // Refer to Promise constructor
    const PromiseConstructor = this.promiseConstructor_

    // Status: pending
    if (isPending(status_)) {
      return new PromiseConstructor((resolve, reject) => {
        this.pendingHandlers_.push([
          handleFulfillProxy(resolve, reject),
          handleRejectProxy(resolve, reject)
        ])
      })
    }

    // Status: fulfilled
    if (isFulfilled(status_)) {
      return new PromiseConstructor((resolve, reject) =>
        // NOTE: onFulfilled should be called async mode
        runAsync(() => {
          handleFulfillProxy(resolve, reject)(value_)
        })
      )
    }

    // Status: rejected
    if (isRejected(status_)) {
      return new PromiseConstructor((resolve, reject) =>
        // NOTE: onRejected should be called async mode
        runAsync(() => {
          handleRejectProxy(resolve, reject)(value_)
        })
      )
    }

    // throw new Error('invalid status')
  }
}

export default Promise

// Generate `defer` util
export const defer = () => {
  const pending = {}

  pending.promise = new Promise((resolve, reject) => {
    pending.resolve = resolve
    pending.reject = reject
  })

  return pending
}
