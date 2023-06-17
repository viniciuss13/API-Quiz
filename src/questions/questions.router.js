// @ts-check

const { getRandomQuestion, answerQuestion } = require('./questions.service');

const ENDPOINT = 'perguntas';

/**
 * @param {import('express').Express} app
 */
function loadCrud(app) {
  app.get(`/${ENDPOINT}/random/:playerId`, async (req, res) => {
    try {
      const question = await getRandomQuestion(req.params.playerId)
      return res.json(question)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  })

  app.post(`/${ENDPOINT}/:questionId`, async ({ body, params: { questionId } }, res) => {
    const { playerId, answer } = body
    const errors = []

    if (!playerId) errors.push('playerId é obrigatório no body')
    if (!answer) errors.push('answer é obrigatório no body')

    if (errors.length > 0) return res.status(400).json({ errors })

    try {
      const isCorrect = await answerQuestion(playerId, questionId, answer)
      return res.json({ isCorrect })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }

  })
}

module.exports = { loadCrud }