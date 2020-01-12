/* global test, expect, jest */

import Promise from '../extend'

test('test Promise.resolve args', async () => {
  expect(typeof Promise === 'function').toBeTruthy()

  expect(() => {
    Promise.resolve()
  }).not.toThrow()

  expect(await Promise.resolve(1)).toBe(1)
})

test('test Promise.reject args', async () => {
  expect(typeof Promise === 'function').toBeTruthy()

  expect(() => {
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject()
  }).not.toThrow()

  const ex = new Error('test')
  let err = false

  try {
    await Promise.reject(ex)
  } catch (e) {
    err = true
  }

  expect(err).toBeTruthy()
})

test('test Promise.all args', () => {
  expect(typeof Promise === 'function').toBeTruthy()

  expect(() => {
    Promise.all()
  }).toThrow()

  expect(() => {
    Promise.all(1)
  }).toThrow()
})

test('test Promise.all #1', async () => {
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

test('test Promise.all #2', async () => {
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

test('test Promise.race args', () => {
  expect(typeof Promise === 'function').toBeTruthy()

  expect(() => {
    Promise.race()
  }).toThrow()

  expect(() => {
    Promise.race(1)
  }).toThrow()
})

test('test Promise.race #1', async () => {
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

test('test Promise.race #2', async () => {
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

test('test Promise.race #3', async () => {
  const allFn = jest.fn()

  let value
  const maybeValue = new Error('test')

  try {
    await Promise.race([Promise.reject(maybeValue), 2])
    allFn()
  } catch (e) {
    value = e
  }

  expect(allFn).toHaveBeenCalledTimes(0)
  expect(value === maybeValue).toBeTruthy()
})
