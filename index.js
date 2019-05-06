const readline = require('readline-sync')

const robots = {
    input: require('./robots/input.js') ,
    text: require('./robots/text.js')
}

async function start() {
    const videoContent = {
        maxSentences: 7
    }

    await robots.input(videoContent)
    await robots.text(videoContent)
}

start()