const express = require('express');
const bodyParser = require('body-parser');
const { connect, disconnect } = require('./database');
const populateQuestionsFromQuizAPI = require('./ask/populate');
const { service } = require('./ask');
const { servicePlayer } = require('./player');

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
        
        service.loadCrud(app)
        servicePlayer.loadCrudPlayer(app)

        SERVER = app.listen(port, () => {
            console.log(`Servidor iniciado na porta ${port}`);
        });

        await populateQuestionsFromQuizAPI();
        
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

async function closeServer() {
    SERVER?.close(() => console.log('Server stopped'));
    await disconnect()
}

module.exports = { DEFAULT_PORT, startServer, closeServer }
