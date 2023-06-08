const readline = require('readline-sync');

function playGame(perguntas) {
  let pontuacao = 0;

  for (const pergunta of perguntas) {
    console.log(pergunta.pergunta);
    const respostaUsuario = readline.question('Resposta: ');

    if (respostaUsuario === pergunta.resposta_correta) {
      pontuacao++;
    }
  }

  const porcentagemAcertos = (pontuacao / perguntas.length) * 100;

  console.log('--- Resultado do Jogo ---');
  console.log(`Pontuação: ${pontuacao} de ${perguntas.length}`);
  console.log(`Porcentagem de Acertos: ${porcentagemAcertos.toFixed(2)}%`);

  if (porcentagemAcertos >= 70) {
    console.log('Nível: Avançado');
  } else if (porcentagemAcertos >= 40) {
    console.log('Nível: Intermediário');
  } else {
    console.log('Nível: Iniciante');
  }
}

module.exports = { playGame };
