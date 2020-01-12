const ensureStatusProxy = expect => s => s === expect

export const PENDING = 'pending'
export const FULFILLED = 'fulfilled'
export const REJECTED = 'rejected'

export const isPending = ensureStatusProxy(PENDING)
export const isFulfilled = ensureStatusProxy(FULFILLED)
export const isRejected = ensureStatusProxy(REJECTED)

export const isResolved = s => isFulfilled(s) || isRejected(s)
