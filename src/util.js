import { isFulfilled, isRejected, isResolved } from './status'

export const isFunction = f => f && typeof f === 'function'
export const isObject = o => o && typeof o === 'object'
export const runAsync = fn => {
  setTimeout(fn, 0)
}

export const flushPendingHandlers = promise => {
  const status = promise.status_
  if (!isResolved(status)) return

  const handlers = promise.pendingHandlers_.slice()
  const value = promise.value_

  handlers.forEach(f => {
    let handler

    if (isFulfilled(status)) handler = f[0]
    else if (isRejected(status)) handler = f[1]

    if (handler) runAsync(() => handler(value))
  })
}

