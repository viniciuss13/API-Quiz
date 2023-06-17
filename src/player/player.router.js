// @ts-check

const { getPlayerById, createPlayer, updatePlayerById } = require("./player.service");

const ENDPOINT = "player";

/**
 * @param {import ('express').Express} app
 */
function loadCrud(app) {
  // Obter player pelo ID
  app.get(`/${ENDPOINT}/:id`, async (req, res) => {
    try {
      const player = await getPlayerById(req.params.id);
      return res.json(player);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Criar um player
  app.post(`/${ENDPOINT}`, async (req, res) => {
    try {
      const player = await createPlayer(req.body);
      return res.json(player);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Atualizar um player
  app.put(`/${ENDPOINT}/:id`, async (req, res) => {
    try {
      const player = await updatePlayerById(req.params.id, req.body);
      return res.json(player);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

}

module.exports = { loadCrud };
