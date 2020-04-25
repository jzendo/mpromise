const zlib = require('zlib')
const fs = require('fs')

function gzipFile (fileName) {
  // eslint-disable-next-line no-unused-vars
  const stats = fs.statSync(fileName)
  const istream = fs.createReadStream(fileName)
  const ostream = fs.createWriteStream(`${fileName}.gz`)
  return istream.pipe(zlib.createGzip()).pipe(ostream)
}

function getBeGzippedFiles () {
  const items = fs.readdirSync('./dist')
  // Filter files which will do gzip.
  return items.filter(fileName => {
    if (/\.js$/.test(fileName)) {
      return true
    }
  })
}

// Entry
function main () {
  try {
    const files = getBeGzippedFiles()
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

// Start gzip
main()
