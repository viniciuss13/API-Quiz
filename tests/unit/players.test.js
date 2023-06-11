// @ts-check


const { default: mongoose } = require('mongoose')
const { model } = require('../../src/player')
const { faker } = require('@faker-js/faker')

describe('Player tests', () => {

    afterEach(async () => {
        await model.MODEL.deleteMany({})
    })

    describe('Create player tests', () => {
        it('should create a player', async () => {
            /** @type {model.CreatePlayer} */
            const input = { name: faker.person.fullName() }

            const result = await model.createPlayer(input)
            const inDb = await model.MODEL.findOne(input)

            const expectation = {
                _id: expect.anything(),
                points: 0,
                ...input
            }
            expect(inDb?.toObject()).toStrictEqual(expectation)
            expect(result).toStrictEqual(expectation)
        })

        it('should throw error when input has invalid data', async () => {
            const input = {}

            // @ts-ignore
            const result = model.createPlayer(input)
            await expect(result).rejects.toThrowError()
        })
    })

    describe('Update player tests', () => {
        it('should update a player', async () => {
            const player = await model.MODEL.create({ name: faker.person.fullName(), points: 0 })

            /**@type {model.UpdatePlayer} */
            const input = { name: faker.person.fullName(), points: faker.number.int() }
            const updatedPlayer = await model.updatePlayer(player._id.toString(), input)

            const inDb = await model.MODEL.findById(player._id)
            expect(inDb?.toObject()).not.toStrictEqual(player.toObject())
            expect(updatedPlayer).not.toStrictEqual(player.toObject())
        })

        it('should throw error when tries to update a non existing player', async () => {
            const id = faker.database.mongodbObjectId()
            const result = model.updatePlayer(id, { points: 99999 })
            await expect(result).rejects.toThrowError(`Player not found with id ${id}`)
        })
    })

    describe('Get player tests', () => {
        it('should get a player', async () => {
            const player = await model.MODEL.create({ name: faker.person.firstName(), points: faker.number.int() })
            const playerInDb = await model.getPlayerById(player._id.toString())
            expect(playerInDb).toStrictEqual(player.toObject())
        })

        it('should throw error when tries to get', async()=>{
            const id = faker.database.mongodbObjectId()
            const result = model.getPlayerById(id)
            await expect(result).rejects.toThrowError(`Player not found with id ${id}`)
        })
    })


})


