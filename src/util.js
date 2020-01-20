import { isFulfilled, isRejected, isResolved } from './status'

export const isFunction = f => f && typeof f === 'function'
export const isObject = o => o && typeof o === 'object'
export const runAsync = fn => {
  setTimeout(fn, 0)
}

const getDeferThrowError = (error, promise) => {
  const result = {
    timer: setTimeout(() => {
      result.handler(error)
    }),
    // Reset when unit test/...
    handler: error => { throw error },
    error
  }

  return result
}

export const setupDeferThrow = promise => {
  // Only for `extend`
  if (process.env.IMPL === 'extend') {
    if (promise) {
      const status = promise.status_
      // No rejected-handler
      if (promise.pendingHandlers_.length == 0) {
        // Throw when it is rejected
        if (isRejected(status)) {
          const value = promise.value_
          // Mark rejected
          promise.reject_(value)
          // Defer throw
          promise.deferThrowErr_ = getDeferThrowError(value, promise)
          return true
        }
      }
    }
  }

  return false
}

export const teardownDeferThrow = promise => {
  // Only for `extend`
  if (process.env.IMPL === 'extend') {
    if (promise) {
      if (promise.deferThrowErr_) {
        clearTimeout(promise.deferThrowErr_.timer)
        promise.deferThrowErr_ = undefined
      }
    }
  }
}

export const flushPendingHandlers = promise => {
  const status = promise.status_
  if (!isResolved(status)) return

  const handlers = promise.pendingHandlers_.slice(0)
  const value = promise.value_

  // Return when defer exception setup
  if (setupDeferThrow(promise)) return

  handlers.forEach(f => {
    let handler

    if (isFulfilled(status)) handler = f[0]
    else if (isRejected(status)) handler = f[1]

    if (handler) runAsync(() => handler(value))
  })
}
