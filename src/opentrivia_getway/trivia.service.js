const axios = require('axios');
const { createAsk } = require('./ask.model');

async function populateQuestionsFromQuizAPI() {
        // Fazer uma solicitação GET para a API externa
        const response = await axios.get('https://quizapi.io/api/v1/questions', {
            params: {
                apiKey: 'IrN7RwZIWov8UrA6tEtdkZyy9owFxOUrvuCY8C3Z',  // substitua pela sua chave API
                limit: 10,  // limite o número de perguntas recebidas (ajuste conforme necessário)
                tags: 'JavaScript'  // filtre as perguntas pela tag JavaScript (ajuste conforme necessário)
            }
        });
    
        // Mapear a resposta para se adequar ao esquema da sua tabela de perguntas
        const questions = response.data.map((question) => ({
            tag: 'JavaScript',  // ajuste conforme necessário
            question: question.question,
            choices: Object.values(question.answers),
            answer: Object.values(question.correct_answers)[0],  // assumindo que a primeira resposta é a correta
            dificulty: 'EASY'  // ajuste conforme necessário
        }));
    
        // Salvar as perguntas na sua tabela
        for (const question of questions) {
            await createAsk(question);
        }
}

module.exports = populateQuestionsFromQuizAPI;
