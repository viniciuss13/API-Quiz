const { gateway, CATEGORIES, DIFFICULTY, QUESTION_TYPE } = require('../gateways/trivia.gateway');
const questionsModel = require('./questions.model')
const { model: playersModel } = require('../players')

/**
 * @typedef PrepareOptions
 * @prop {number?} quantity
 * @prop {DIFFICULTY?} difficulty
 */

/**
 * @param {PrepareOptions} param0 
 * @returns {Promise<import('../gateways/trivia.gateway/gateway').QuestionResult[]>}
 */
async function getNewUniqueQuestionsByGateway({ quantity, difficulty }) {
    let newQuestionsList = []
    let tries = 0

    while (newQuestionsList.length !== quantity) {
        try{
            const gatewayQuestionResponse = await gateway.getQuestions({
                limit: quantity,
                category: CATEGORIES.science_and_nature,
                difficulty: difficulty,
                questionType: QUESTION_TYPE.multiple
            })
            const gatewayNewQuestions = await Promise.all(gatewayQuestionResponse.filter(async ({ question }) => {
                const dbQuestion = await questionsModel.findOne({ question })
                return dbQuestion === null
            }))
            if (gatewayNewQuestions.length > 0) newQuestionsList = [...newQuestionsList, ...gatewayNewQuestions]
        } catch (error) {
            console.error(error.message)
            tries += 1
        } finally {
            if (tries === 3) process.exit(1)
        }
    }

    return newQuestionsList.slice(0, quantity)
}

/**
 * @param {PrepareOptions} options 
 * @returns {Promise<import('./questions.model').Question[]}
 */
async function prepareNewQuestions(options) {
    const quantity = options?.quantity ?? 3
    const difficulty = options?.difficulty

    const newQuestions = await getNewUniqueQuestionsByGateway({ quantity, difficulty })

    const newQuestionsInDb = await Promise.all(
        newQuestions.map(async (input) => {
            const question = await questionsModel.create({
                answer: input.correct_answer,
                category: input.category,
                choices: [...input.incorrect_answers, input.correct_answer],
                dificulty: input.difficulty,
                question: input.question,
                playerAnswers: [],
            })
            return question
        })
    )

    return newQuestionsInDb
}

/**
 * @param {string} playerId 
 * @returns {Promise<import('./questions.model').Question}
 */
async function getRandomQuestion(playerId) {
    /** @type {import('./questions.model').Question} */
    let question;
    question = await questionsModel.findOne({ 'playerAnswers.playerId': { $ne: playerId }, 'playerAnswers.isCorrect': false })
    if (question === null) {
        const newQuestions = await prepareNewQuestions()
        const randomQuestionIndex = Math.floor(Math.random() * newQuestions.length)
        question = newQuestions[randomQuestionIndex]
    }
    return question
}

/**
 * @param {string} playerId 
 * @param {string} questionId 
 * @param {string} answer 
 * @returns {Promise<boolean>} if is correct or not
 */
async function answerQuestion(playerId, questionId, answer) {
    const question = await questionsModel.getById(questionId)
    const isCorrect = question.answer.toLowerCase() === answer.toLowerCase()

    if (isCorrect) await playersModel.updateById(playerId, { $inc: { points: 1 } })

    /** @type {import('./questions.model').QuestionAnswer} */
    const newPlayerAnswer = { playerId, isCorrect }
    await questionsModel.updateById(questionId, { $push: { playerAnswers: newPlayerAnswer } })

    return isCorrect
}

module.exports = { answerQuestion, getRandomQuestion, prepareNewQuestions }