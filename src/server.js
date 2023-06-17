const express = require('express');
const bodyParser = require('body-parser');
const { connect, disconnect } = require('./database');
const { router: questionsRouter } = require('./questions');
const { router: playersRouter } = require('./player')

/** @type {import('http').Server} */
let SERVER;
const DEFAULT_PORT = 3000;

/**
 * @param {import('./database').ConnectionOptions} databaseOption
 */
async function startServer(databaseOption, port = DEFAULT_PORT) {
    try {
        await connect(databaseOption)

        const app = express()
        app.use(bodyParser.json());

        questionsRouter.loadCrud(app)
        playersRouter.loadCrud(app)

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

module.exports = { DEFAULT_PORT, startServer, closeServer }