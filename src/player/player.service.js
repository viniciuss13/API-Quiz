// @ts-check

const { getPlayerById, createPlayer, updatePlayer, getPlayerByName } = require("./player.model");

const ENDPOINT = "player";

/**
 * @param {import ('express').Express} playerapp
 */

async function loadCrudPlayer(playerapp) {
  // Obter player pelo ID
// Obter jogador por ID
playerapp.get(`/${ENDPOINT}/id/:id`, async (req, res) => {
  try {
      const player = await getPlayerById(req.params.id);
      res.json(player);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obter jogador por nome
playerapp.get(`/${ENDPOINT}/name/:name`, async (req, res) => {
  try {
      const player = await getPlayerByName(req.params.name);
      res.json(player);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

  // Criar um player
  playerapp.post(`/${ENDPOINT}`, async (req, res) => {
    try {
      const player = await createPlayer(req.body);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Atualizar um player
  playerapp.put(`/${ENDPOINT}/:id`, async (req, res) => {
    try {
      const player = await updatePlayer(req.params.id, req.body);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

}

module.exports = { loadCrudPlayer };
