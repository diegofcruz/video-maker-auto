const readline = require('readline-sync')

function start() {
    const content = {}

    content.searchTerm = askSearchTerm()
    content.prefix = askPrefix()

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

    console.log(content)
}

start()