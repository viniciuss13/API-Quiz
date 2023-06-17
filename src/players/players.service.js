const model = require('./players.model')

/**
 * @param {string} id
 * @returns {Promise<import("./players.model").Player>}
 */
async function getPlayerById(id) {
    return model.getById(id)
}

/**
 * @param {import('./players.model').CreatePlayer} input
 * @returns {Promise<import("./players.model").Player>}
 */
async function createPlayer(input) {
    return model.create(input)
}

/**
 * @param {string} id
 * @param {import('./players.model').UpdatePlayer} input
 * @returns {Promise<import("./players.model").Player>}
 */
async function updatePlayerById(id, input) {
    return model.updateById(id, input)
}

module.exports = { getPlayerById, createPlayer, updatePlayerById }