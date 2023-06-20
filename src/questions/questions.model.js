// @ts-check

const mongoose = require('mongoose');
const { DIFFICULTY } = require('../gateways/trivia.gateway');


/**
 * @typedef QuestionAnswer
 * @prop {mongoose.Types.ObjectId} playerId
 * @prop {boolean} isCorrect
 */

/** 
* @typedef Question
* @prop {mongoose.Types.ObjectId} _id
* @prop {string} category
* @prop {string} question
* @prop {string[]} choices
* @prop {string} answer
* @prop {DIFFICULTY} dificulty
* @prop {QuestionAnswer[]} playerAnswers
*
* @typedef {Omit<Question, '_id'>} CreateQuestion
* @typedef {Partial<CreateQuestion>} UpdateQuestion
*/

const SCHEMA = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    choices: { type: [String], required: true },
    answer: { type: String, required: true },
    dificulty: { type: String, enum: Object.values(DIFFICULTY), required: true },
    playerAnswers: [{
        playerId: { type: mongoose.Types.ObjectId, required: true },
        isCorrect: { type: Boolean, required: true }
    }]
}, { versionKey: false })

const MODEL = mongoose.model('questions', SCHEMA)

/**
 * @param {CreateQuestion} input
 * @returns {Promise<Question>}
 */
async function create(input) {
    if (!input.choices.includes(input.answer))
        throw new Error('A resposta correta deve estar entre as alternativas fornecidas')

    const doc = new MODEL(input);
    await doc.save({ validateBeforeSave: true })
    return doc.toObject()
}

/**
 * @param {string} id
 * @returns {Promise<Question>}
 */
async function getById(id) {
    const doc = await MODEL.findById(id)
    if (doc === null) throw new Error(`Questão não encontrada com id ${id}`)
    return doc.toObject()
}

/**
 * 
 * @param {mongoose.FilterQuery<Omit<Question, '_id'>>} filter 
 * @returns {Promise<Question | null>}
 */
async function findOne(filter) {
    const doc = await MODEL.findOne(filter)
    if (doc === null) return doc
    return doc.toObject()
}


/**
 * 
 * @param {string} id 
 * @param {mongoose.UpdateQuery<UpdateQuestion>} input 
 * @returns {Promise<Question>}
 */
async function updateById(id, input) {
    const doc = await MODEL.findByIdAndUpdate(id, input, { new: true })
    if (doc === null) throw new Error(`Questão não encontrada com id ${id}`)
    return doc.toObject()
}

/**
 * @param {string} id
 */
async function removeAsk(id) {
    MODEL.findByIdAndRemove(id)
}


module.exports = { create, updateById, getById, findOne, removeAsk }