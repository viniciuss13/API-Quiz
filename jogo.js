const axios = require('axios');
const { playGame } = require('./gameFunctions');

const API_URL = 'http://localhost:3000';

function startGame() {
  axios.get(`${API_URL}/perguntas`)
    .then(response => {
      const perguntas = response.data;
      playGame(perguntas);
    })
    .catch(error => {
      console.error('Erro ao carregar as perguntas:', error);
    });
}

startGame();
