const express = require('express');
const bodyParser = require('body-parser');
const { connect, disconnect } = require('./database');
const { service } = require('./ask');

/** @type {import('http').Server} */
let SERVER;


/**
 * @param {import('./database').ConnectionOptions} databaseOption
 */
async function startServer(databaseOption, port = 3000) {
    try {
        await connect(databaseOption)

        const app = express()
        app.use(bodyParser.json());
        service.loadCrud(app)

        SERVER = app.listen(port, () => {
            console.log(`Servidor iniciado na porta ${port}`);
        });
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }

}

async function closeServer() {
    SERVER?.closeAllConnections()
    await disconnect()
}

module.exports = { startServer, closeServer }