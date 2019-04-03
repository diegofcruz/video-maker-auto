const algorithmia = require('algorithmia')
const algorithmiaKey = require('../credentials/algorithmia.json').apiKey

async function startRobot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthetincated = algorithmia(algorithmiaKey)
        const wikipediaAlgorithm = algorithmiaAuthetincated.algo('web/WikipediaParser/0.1.2?timeout=300')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikepediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikepediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitize = withoutDatesInParentheses

        function removeBlankLinesAndMarkdown(text) {
            let allLines = text.split('\n')
            let withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })

            return withoutBlankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }
    }
}

module.exports = startRobot