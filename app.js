const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'db_quiz'
});

// Middleware para processar requisições com JSON
app.use(express.json());

// Rota para inserir uma nova pergunta e respostas
app.post('/questions', (req, res) => {
  const { question, answers, tags, difficulty } = req.body;

  connection.query('INSERT INTO questions (question, tags, difficulty) VALUES (?, ?, ?)', [question, tags, difficulty], (error, results) => {
    if (error) {
      console.error('Erro ao inserir pergunta:', error);
      res.status(500).json({ error: 'Erro ao inserir pergunta' });
      return;
    }

    const questionId = results.insertId;

    // Cria um array de valores para as respostas
    const answerValues = answers.map(answer => [questionId, answer.answer, answer.isCorrect]);

    // Insere as respostas no banco de dados
    connection.query('INSERT INTO answers (question_id, answer, is_correct) VALUES ?', [answerValues], (error) => {
      if (error) {
        console.error('Erro ao inserir respostas:', error);
        res.status(500).json({ error: 'Erro ao inserir respostas' });
        return;
      }

      res.status(201).json({ message: 'Pergunta e respostas inseridas com sucesso!' });
    });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});