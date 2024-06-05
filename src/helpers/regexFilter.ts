import { KeywordModel } from '../models/Keyword.js'

export async function fetchKeywordsAndCreateRegex(): Promise<RegExp | null> {
    try {
        // Fetch keywords where `turn_on` is true and only return the `word` field
        const keywords = await KeywordModel.find({ turn_on: true })
            .select('word -_id')
            .exec()
        // Map the result to get an array of strings
        const keywordList = keywords.map((keyword) => keyword.word)

        if (keywordList.length === 0) {
            console.error('No keywords found in the database.')
            return null
        }

        // Create regex pattern from fetched keywords
        const regexPattern = new RegExp(`(${keywordList.join('|')})`, 'i')

        return regexPattern
    } catch (error) {
        console.error('Error fetching keywords:', error)
        return null
    }
}
