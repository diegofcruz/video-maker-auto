const fs = require('fs')
const contentFilePath = './content.json'

function save(content) {
  contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(content) {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  load
}
