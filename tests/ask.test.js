const { createAsk } = require("../src/ask/ask.model")
const { createAskFaker } = require("./faker/ask.faker")

describe('Ask tests', () => {
    it('should create a ask', async () => {
        const createInput = createAskFaker()
        const ask = await createAsk(createInput)

        expect(ask).toMatchObject(createInput)
    })
})