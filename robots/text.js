const algorithmia = require('algorithmia')
const algorithmiaKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: "2018-04-05",
    url: "https://gateway.watsonplatform.net/natural-language-understanding/api"
})

async function startRobot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaxSentences(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthetincated = algorithmia(algorithmiaKey)
        const wikipediaAlgorithm = algorithmiaAuthetincated.algo('web/WikipediaParser/0.1.2?timeout=300')
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            'articleName': content.searchTerm, 
            'lang': content.lang
        })
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

    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitize)
        
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    function limitMaxSentences(content) {
        content.sentences = content.sentences.slice(0, content.maxSentences)
    }

    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                html: sentence,
                features: {
                    keywords: {}
                }
            }, function(err, response) {
                if (err) {
                    throw error
                }
    
                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })
    
                resolve(keywords)
            })
        })
    }
}

module.exports = startRobot