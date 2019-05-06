const readline = require('readline-sync')

function startRobot(content) {
    content.searchTerm = askSearchTerm()
    content.prefix = askPrefix()
    content.lang = askLang()

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

    function askLang() {
        const langs = [
            'pt',
            'en'
        ]
        const selectedLangIndex = readline.keyInSelect(langs)
        return langs[selectedLangIndex]
    }
}

module.exports = startRobot