// @ts-check

const { startTestServer, closeTestServer } = require('./helpers/server.test.helper')

jest.setTimeout(30000)

beforeAll(startTestServer)
afterAll(closeTestServer)