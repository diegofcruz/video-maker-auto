const readline = require('readline-sync')

const robots = {
    input: require('./robots/input.js') ,
    text: require('./robots/text.js')
}

async function start() {
    const videoContent = {}

    await robots.input(videoContent)
    await robots.text(videoContent)

function start() {
    const videoContent = {}

    videoContent.searchTerm = askSearchTerm()
    videoContent.prefix = askPrefix()

    function askSearchTerm() {
        return readline.question('What subject do you create a video: ')
    }

    function askPrefix() {
        const prefix = [
            'What is',
            'Who is',
            'Who create',
            'The history of',
            'When'
        ]
        const selectedPrefixIndex = readline.keyInSelect(prefix)
        return prefix[selectedPrefixIndex]
    }

    console.log(videoContent)
}

start()