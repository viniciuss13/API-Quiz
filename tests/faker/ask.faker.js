const { faker } = require('@faker-js/faker')
const { ASK_DIFICULT } = require('../../src/ask/ask.model')

/**
 * @param {Partial<import("../../src/ask/ask.model").CreateAsk} override 
 * @returns {import("../../src/ask/ask.model").CreateAsk}
 */
function createAskFaker(override = {}) {
    const answer = faker.string.sample({ min: 1 })
    const choices = faker.helpers.uniqueArray([...faker.helpers.multiple(() => faker.string.sample({ min: 1 })), answer], 4)

    return {
        answer,
        choices,
        question: faker.string.sample(),
        tag: faker.string.sample(),
        dificulty: faker.helpers.objectValue(ASK_DIFICULT),
        ...override
    }
}

module.exports = { createAskFaker }