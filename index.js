const readline = require('readline-sync')

const robots = {
    input: require('./robots/input.js') ,
    text: require('./robots/text.js'),
    state: require('./robots/state.js')
}

async function start() {
    const videoContent = {
        maxSentences: 7
    }

    await robots.input(videoContent)
    await robots.text()

    // console.log(JSON.stringify(videoContent, null, 4))
    const content = robots.state.load()
    console.dir(content, { depth: null })
}

start()