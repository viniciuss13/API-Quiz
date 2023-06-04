const express = require('express');
const mysql = require('mysql2')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'db_quiz'
});

// Função para criar as tabelas
function createTables() {
  // Tabela 'questions'
  const createQuestionsTableQuery = `
    CREATE TABLE IF NOT EXISTS questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT,
      tags VARCHAR(255),
      difficulty VARCHAR(255)
    );
  `;

  // Tabela 'answers'
  const createAnswersTableQuery = `
    CREATE TABLE IF NOT EXISTS answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question_id INT,
      answer TEXT,
      is_correct BOOLEAN,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `;

  // Executando as consultas
  connection.query(createQuestionsTableQuery, (error, results) => {
    if (error) {
      console.error('Erro ao criar a tabela "questions":', error);
    } else {
      console.log('Tabela "questions" criada com sucesso!');
    }
  });

  connection.query(createAnswersTableQuery, (error, results) => {
    if (error) {
      console.error('Erro ao criar a tabela "answers":', error);
    } else {
      console.log('Tabela "answers" criada com sucesso!');
    }
  });
}

// Chamando a função para criar as tabelas
createTables();


// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
  } else {
    console.log('Conexão estabelecida com o banco de dados');
  }
});

// Rota para obter todos os quizzes
app.get('/quizzes', (req, res) => {
  connection.query('SELECT * FROM quizzes', (err, results) => {
    if (err) {
      console.error('Erro ao obter quizzes: ', err);
      res.status(500).send('Erro ao obter quizzes');
    } else {
      res.json(results);
    }
  });
});

// Rota para obter um quiz específico
app.get('/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  connection.query('SELECT * FROM quizzes WHERE id = ?', [quizId], (err, results) => {
    if (err) {
      console.error('Erro ao obter quiz: ', err);
      res.status(500).send('Erro ao obter quiz');
    } else if (results.length === 0) {
      res.status(404).send('Quiz não encontrado');
    } else {
      res.json(results[0]);
    }
  });
});

// Rota para criar um novo quiz
app.post('/quizzes', (req, res) => {
  const quiz = req.body;
  connection.query('INSERT INTO quizzes SET ?', quiz, (err, result) => {
    if (err) {
      console.error('Erro ao criar quiz: ', err);
      res.status(500).send('Erro ao criar quiz');
    } else {
      res.status(201).send('Quiz criado com sucesso');
    }
  });
});

// Rota para atualizar um quiz existente
app.put('/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  const updatedQuiz = req.body;
  connection.query('UPDATE quizzes SET ? WHERE id = ?', [updatedQuiz, quizId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar quiz: ', err);
      res.status(500).send('Erro ao atualizar quiz');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Quiz não encontrado');
    } else {
      res.send('Quiz atualizado com sucesso');
    }
  });
});

// Rota para excluir um quiz
app.delete('/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  connection.query('DELETE FROM quizzes WHERE id = ?', [quizId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir quiz: ', err);
      res.status(500).send('Erro ao excluir quiz');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Quiz não encontrado');
    } else {
      res.send('Quiz excluído com sucesso');
    }
  });
});

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
