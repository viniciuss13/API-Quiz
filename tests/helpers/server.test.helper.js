// @ts-check

const { faker } = require("@faker-js/faker");
const { MongoMemoryServer } = require('mongodb-memory-server');
const { startServer, closeServer } = require("../../src/server");

/** @type {MongoMemoryServer} */
let MONGOD

/** @returns {Promise<import("../../src/database").ConnectionOptions>} */
async function getDatabaseOptions() {
    const database = 'example'
    /** @type {import('mongodb-memory-server-core/lib/MongoMemoryServer').CreateUser} */
    const user = { createUser: 'test', pwd: 'test', database, roles: [{ db: database, role: 'readWrite' }] }
    MONGOD = new MongoMemoryServer({ auth: { extraUsers: [user] } })

    await MONGOD.start()
    const uri = new URL(MONGOD.getUri())
    return {
        host: uri.hostname,
        database,
        user: user.createUser,
        password: user.pwd,
        protocol: uri.protocol,
        port: uri.port
    }
}

async function startTestServer() {
    const databaseOptions = await getDatabaseOptions()
    await startServer(databaseOptions, faker.number.int({ min: 3001, max: 3999 }))
}

async function closeTestServer() {
    await closeServer()
    await MONGOD.stop()
}

module.exports = { startTestServer, closeTestServer }