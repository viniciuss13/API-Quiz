// @ts-check

const mongoose = require("mongoose")



/**
 * @typedef ConnectionOptions
 * @prop {string} host
 * @prop {string} user
 * @prop {string} password
 * @prop {string} database  
 * @prop {string | undefined} protocol
 * @prop {number | string | undefined} port
 */

/** @param {ConnectionOptions} options */
async function connect({ protocol, database, host, port, user, password }) {
    const url = `${protocol ?? 'mongodb:'}//${user}:${password}@${host}:${port ?? 27017}/${database}`
    await mongoose.connect(url)
}

async function disconnect() {
    await mongoose.disconnect()
}

module.exports = { connect, disconnect }