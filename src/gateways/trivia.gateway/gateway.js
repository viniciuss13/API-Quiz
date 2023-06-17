const axios = require('axios').default
const { BASE_URL, DEFAULT_LIMIT } = require('./constants');


/**
 * @typedef GetQuestionOptions
 * @prop {number?} limit
 * @prop {import('./enums').CATEGORIES?} category
 * @prop {import('./enums').DIFFICULTY?} difficulty
 * @prop {import('./enums').QUESTION_TYPE?} questionType
 */

/**
 * @typedef QuestionResult
 * @prop {string} category
 * @prop {string} type
 * @prop {string} difficulty
 * @prop {string} question
 * @prop {string} correct_answer
 * @prop {string[]} incorrect_answers
 * 
 * @typedef QuestionPaginatedResponse
 * @prop {number} response_code
 * @prop {QuestionResult[]} results
 */

/**
 * @param {GetQuestionOptions} param0 
 * @returns {Promise<QuestionPaginatedResponse>}
 */
async function getQuestions({ limit, category, difficulty, questionType }) {
    const url = new URL('', BASE_URL)
    url.searchParams.append('limit', limit ?? DEFAULT_LIMIT)
    if (category) url.searchParams.append('category', category)
    if (difficulty) url.searchParams.append('difficulty', difficulty)
    if (questionType) url.searchParams.append('type', questionType)

    const response = await axios.get(url)
    if (response.status !== 200) throw new Error('Fail to get questions!')
    return response.data
}

module.exports = {
    getQuestions
}