import Promise from '../src'
import promisesAplusTests from 'promises-aplus-tests'

// Config adapter
const adapter = {
  deferred () {
    const pending = {}
    // eslint-disable-next-line
    pending.promise = new Promise((resolver, reject) => {
      pending.resolve = resolver
      pending.reject = reject
    })
    return pending
  }
}

// Run test
promisesAplusTests(adapter, function (err) {
  const splitter = '-------------------'

  console.log(`\n${splitter}`)
  console.log('All done.')
  // Error
  if (err) {
    console.error('\n\nError: ' + (err && err.message))
  }
  console.log(`${splitter}\n`)
})
