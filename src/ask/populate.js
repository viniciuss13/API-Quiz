const axios = require('axios');
const { createAsk } = require('./ask.model');

async function populateQuestionsFromQuizAPI() {
        // Fazer uma solicitação GET para a API externa
        const response = await axios.get('https://quizapi.io/api/v1/questions', {
            params: {
                apiKey: 'IrN7RwZIWov8UrA6tEtdkZyy9owFxOUrvuCY8C3Z',  // substitua pela sua chave API
                limit: 10,  // limite o número de perguntas recebidas (ajuste conforme necessário)
                tags: 'Linux'  // filtre as perguntas pela tag JavaScript (ajuste conforme necessário)
            }
        });
    
        // Mapear a resposta para se adequar ao esquema da sua tabela de perguntas
        const questions = response.data.map((question) => {
            const correctAnswerKey = Object.keys(question.correct_answers).find(key => question.correct_answers[key] === "true");
            const answerKey = correctAnswerKey.replace("_correct", "");
        
            return {
                tag: 'Linux',
                question: question.question,
                choices: Object.values(question.answers).filter(choice => choice !== null), // removendo nulls
                answer: question.answers[answerKey],
                dificulty: 'FÁCIL'
            };
        });
    
        // Salvar as perguntas na sua tabela
        for (const question of questions) {
            try {
                await createAsk(question);
            } catch (error) {
                console.error(`Failed to create question: ${question.question}`);
                console.error(error);
            }
        }
}

module.exports = populateQuestionsFromQuizAPI;
