const zlib = require('zlib')
const fs = require('fs')

function gzipFile(fileName) {
  fs.stat(fileName, (error, stats) => {
    if (error) throw error

    const istream = fs.createReadStream(fileName)
    const ostream = fs.createWriteStream(`${fileName}.gz`)

    istream.pipe(zlib.createGzip()).pipe(ostream)
  })
}

function getWillGzipFiles() {
  try {
    const items = fs.readdirSync('./dist')
    // Filter files which will do gzip.
    return items.filter(fileName => {
      if (/\.js$/.test(fileName)) {
        return true
      }
    })
  } catch (e) {
    throw e
  }
}

function main() {
  try {
    const files = getWillGzipFiles()
    console.log('\nbuild gzip files:')
    files.forEach(fileName => {
      console.log(`- generating "${fileName}.gz" file...`)
      gzipFile(`./dist/${fileName}`)
    })
    console.log('\n')
  } catch (e) {
    console.log('Error: ', e)
  }
}

main()
