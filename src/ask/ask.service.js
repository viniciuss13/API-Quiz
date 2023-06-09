// @ts-check


const { listAllAsks, createAsk, removeAsk, updateAsk } = require('./ask.model');


/**
 * @param {import('express').Express} app
 */
async function loadCrud(app) {
  // app.use(bodyParser.json());
  // Listar todas as perguntas
  app.get('/perguntas', async (req, res) => {
    try {
      const result = listAllAsks()
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  });

  // Adicionar uma nova pergunta
  app.post('/perguntas', async (req, res) => {
    try {
      await createAsk(req.body)
      return res.status(201)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  });

  // Remover uma pergunta
  app.delete('/perguntas/:id', async (req, res) => {
    const id = parseFloat(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: 'id precisa ser um número' })

    try {
      await removeAsk(id)
      return res.status(201)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  });

  // Atualizar uma pergunta
  app.put('/perguntas/:id', async (req, res) => {
    const id = parseFloat(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: 'id precisa ser um número' })

    try {
      await updateAsk(id, req.body)
      return res.status(201)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }

  });
}

module.exports = { loadCrud }