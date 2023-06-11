// @ts-check


const { listAllAsks, createAsk, removeAsk, updateAsk } = require('./ask.model');


const ENDPOINT = 'perguntas';

/**
 * @param {import('express').Express} app
 */
async function loadCrud(app) {
  // app.use(bodyParser.json());
  // Listar todas as perguntas
  app.get(`/${ENDPOINT}`, async (req, res) => {
    try {
      const result = await listAllAsks()
      return res.json(result)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  });

  // Adicionar uma nova pergunta
  app.post(`/${ENDPOINT}`, async (req, res) => {
    try {
      const ask = await createAsk(req.body)
      return res.status(201).json(ask)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  });

  // Remover uma pergunta
  app.delete(`/${ENDPOINT}/:id`, async (req, res) => {
    const { id } = req.params;
    try {
      await removeAsk(id)
      return res.status(201).send()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  });

  // Atualizar uma pergunta
  app.put(`/${ENDPOINT}/:id`, async (req, res) => {
    const { id } = req.params;
    try {
      const ask = await updateAsk(id, req.body)
      return res.status(201).json(ask)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }

  });
}

module.exports = { loadCrud }