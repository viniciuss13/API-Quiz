// @ts-check
require('dotenv').config()
const { startServer } = require("./server");


/** @type {Partial<import('./database').ConnectionOptions>} */
const databaseOptions = {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
}

// @ts-ignore
startServer(databaseOptions)