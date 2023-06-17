const model = require('./player.model')

/**
 * @param {string} id
 * @returns {Promise<import("./player.model").Player>}
 */
async function getPlayerById(id) {
    return model.getById(id)
}

/**
 * @param {import('./player.model').CreatePlayer} input
 * @returns {Promise<import("./player.model").Player>}
 */
async function createPlayer(input) {
    return model.create(input)
}

/**
 * @param {string} id
 * @param {import('./player.model').UpdatePlayer} input
 * @returns {Promise<import("./player.model").Player>}
 */
async function updatePlayerById(id, input) {
    return model.updateById(id, input)
}

module.exports = { getPlayerById, createPlayer, updatePlayerById }