const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());






// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'db_quiz'
});

// Conexão com o banco de dados
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL.');
});

// Rota para obter todas as questões
app.get('/questoes', (req, res) => {
  connection.query('SELECT * FROM questoes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Rota para obter uma questão específica
app.get('/questoes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM questoes WHERE id = ?', id, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Rota para criar uma nova questão
app.post('/questoes', (req, res) => {
  const questao = req.body;
  connection.query('INSERT INTO questoes SET ?', questao, (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId });
  });
});

// Rota para atualizar uma questão existente
app.put('/questoes/:id', (req, res) => {
  const id = req.params.id;
  const questao = req.body;
  connection.query('UPDATE questoes SET ? WHERE id = ?', [questao, id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Rota para excluir uma questão
app.delete('/questoes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM questoes WHERE id = ?', id, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});
