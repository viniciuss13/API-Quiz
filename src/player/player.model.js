// @ts-check


const mongoose = require('mongoose');


/**
 * @typedef Player
 * @prop {mongoose.Types.ObjectId} _id
 * @prop {string} name
 * @prop {number} points
 * 
 * @typedef {Pick< Player, 'name'>} CreatePlayer
 * @typedef {Partial<Omit<Player, '_id'>>} UpdatePlayer
 */


const SCHEMA = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, required: true }
}, { versionKey: false })

const MODEL = mongoose.model('players', SCHEMA)

/**
 * @param {string} id
 * @returns {Promise<Player>}
 */
async function getPlayerById(id) {
    const playerInDb = await MODEL.findById(id)
    if (playerInDb === null) throw new Error(`Player not found with id ${id}`)
    return playerInDb.toObject()

}

async function getPlayerByName(name) {
    const playerInDb = await MODEL.findOne({name: name})
    if (playerInDb === null) throw new Error(`Player not found with name ${name}`)
    return playerInDb.toObject()

}

/**
 * @param {CreatePlayer} input
 * @returns {Promise<Player>}
 */
async function createPlayer(input) {
    const existingPlayer = await MODEL.findOne({name: input.name});
    if(existingPlayer){
        throw new Error(`Nome de usuário ${input.name} já escolhido`)
    }
    const player = new MODEL({ ...input, points: 0 })
    await player.save({ validateBeforeSave: true })
    return player.toObject()
}

/**
 * @param {string} id
 * @param {UpdatePlayer} input
 * @returns {Promise<Player>}
 */
async function updatePlayer(id, input) {
    const playerUpdated = await MODEL.findByIdAndUpdate(id, input, { new: true })
    if (playerUpdated === null) throw new Error(`Player not found with id ${id}`)
    return playerUpdated.toObject()
}

module.exports = { MODEL, createPlayer, updatePlayer, getPlayerById, getPlayerByName }