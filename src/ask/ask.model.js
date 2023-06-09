// @ts-check

const mongoose = require('mongoose');

/** @enum {string} */
const ASK_DIFICULT = {
    EASY: 'FÁCIL',
    INTERMIDIARY: 'MÉDIO',
    HARD: 'DIFÍCIL'
}

/** 
* @typedef Ask
* @prop {string} _id
* @prop {string} tag
* @prop {string} question
* @prop {string[]} choices
* @prop {string} answer
* @prop {ASK_DIFICULT} dificulty
*
* @typedef {Omit<Ask, '_id'>} CreateAsk
* @typedef {Partial<CreateAsk>} UpdateAsk
*/

const SCHEMA = new mongoose.Schema({
    tag: { type: String, required: true },
    question: { type: String, required: true },
    choices: { type: [String], required: true },
    answer: { type: String, required: true },
    dificulty: { type: String, enum: Object.values(ASK_DIFICULT), required: true }
})

const MODEL = mongoose.model('questions', SCHEMA)

/**
 * @param {string} id
 * @returns {Promise<Ask>}
 */
async function getById(id) {
    const doc = await MODEL.findById(id)
    if (doc === null) throw new Error(`Questão não encontrada com id ${id}`)
    return doc.toObject()
}

/**
 * @returns {Promise<Ask[]>}
 */
async function listAllAsks() {
    const doc = await MODEL.find()
    return doc.map((v) => v.toObject())
}

/**
 * @param {CreateAsk} input
 * @returns {Promise<Ask>}
 */
async function createAsk(input) {
    if (!input.choices.includes(input.answer))
        throw new Error('A resposta correta deve estar entre as alternativas fornecidas')

    const doc = new MODEL(input)
    await doc.save({ validateBeforeSave: true })

    return doc.toObject()
}


/**
 * @param {number} id 
 * @param {UpdateAsk} input 
 */
async function updateAsk(id, input) {
    const doc = await MODEL.findByIdAndUpdate(id, input)
    if (doc === null) throw new Error(`Questão não encontrada com id ${id}`)
    return doc.toObject()
}


/**
 * @param {number} id
 */
async function removeAsk(id) {
    MODEL.findByIdAndRemove(id)
}


module.exports = { ASK_DIFICULT, getById, listAllAsks, createAsk, updateAsk, removeAsk }