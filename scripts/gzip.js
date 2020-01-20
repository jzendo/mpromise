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

try {
  const items = fs.readdirSync('./dist')
  console.log('\nbuild gzip files:')
  items.forEach(fileName => {
    if (/\.js$/.test(fileName)) {
      console.log(`- generating "${fileName}.gz" file...`)
      gzipFile(`./dist/${fileName}`)
    }
  })
  console.log('\n')
} catch (e) {
  console.log('Error: ', e)
}
