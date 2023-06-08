// @ts-check

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'db_quiz'
});

connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados: ' + error);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados');
  }
});

// Listar todas as perguntas
app.get('/perguntas', (req, res) => {
  const query = 'SELECT * FROM perguntas';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar as perguntas: ' + error);
      res.status(500).json({ error: 'Erro ao buscar as perguntas' });
    } else {
      res.json(results);
    }
  });
});

// Adicionar uma nova pergunta
app.post('/perguntas', (req, res) => {
  const { tag, pergunta, alternativas, resposta_correta, dificuldade } = req.body;

  const novaPergunta = {
    tag,
    pergunta,
    alternativas,
    resposta_correta,
    dificuldade
  };

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!tag || !pergunta || !alternativas || !resposta_correta || !dificuldade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // Verifica se a resposta correta está presente nas alternativas
  if (!alternativas.includes(resposta_correta)) {
    return res.status(400).json({ error: 'A resposta correta deve estar entre as alternativas fornecidas' });
  }

  // Insere a nova pergunta no banco de dados
  const query = 'INSERT INTO perguntas (tag, pergunta, alternativas, resposta_correta, dificuldade) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [tag, pergunta, JSON.stringify(alternativas), resposta_correta, dificuldade], (error, results) => {
    if (error) {
      console.error('Erro ao adicionar a pergunta: ' + error);
      res.status(500).json({ error: 'Erro ao adicionar a pergunta' });
    } else {
      res.json({ message: 'Pergunta adicionada com sucesso' });
    }
  });
});

// Remover uma pergunta
app.delete('/perguntas/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM perguntas WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erro ao remover a pergunta: ' + error);
      res.status(500).json({ error: 'Erro ao remover a pergunta' });
    } else {
      res.json({ message: 'Pergunta removida com sucesso' });
    }
  });
});

// Atualizar uma pergunta
app.put('/perguntas/:id', (req, res) => {
  const id = req.params.id;
  const { tag, pergunta, alternativas, resposta_correta, dificuldade } = req.body;

  const atualizacao = {
    tag,
    pergunta,
    alternativas,
    resposta_correta,
    dificuldade
  };

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!tag || !pergunta || !alternativas || !resposta_correta || !dificuldade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // Verifica se a resposta correta está presente nas alternativas
  if (!alternativas.includes(resposta_correta)) {
    return res.status(400).json({ error: 'A resposta correta deve estar entre as alternativas fornecidas' });
  }

  // Atualiza a pergunta no banco de dados
  const query = 'UPDATE perguntas SET tag = ?, pergunta = ?, alternativas = ?, resposta_correta = ?, dificuldade = ? WHERE id = ?';
  connection.query(query, [tag, pergunta, JSON.stringify(alternativas), resposta_correta, dificuldade, id], (error, results) => {
    if (error) {
      console.error('Erro ao atualizar a pergunta: ' + error);
      res.status(500).json({ error: 'Erro ao atualizar a pergunta' });
    } else {
      res.json({ message: 'Pergunta atualizada com sucesso' });
    }
  });
});

// Adicionar várias perguntas
app.post('/perguntas/batch', (req, res) => {
  const perguntas = req.body;

  if (!Array.isArray(perguntas) || perguntas.length === 0) {
    return res.status(400).json({ error: 'Nenhuma pergunta fornecida' });
  }

  const values = perguntas.map((pergunta) => {
    const { tag, pergunta: perguntaText, alternativas, resposta_correta, dificuldade } = pergunta;
    return [tag, perguntaText, JSON.stringify(alternativas), resposta_correta, dificuldade];
  });

  const query = 'INSERT INTO perguntas (tag, pergunta, alternativas, resposta_correta, dificuldade) VALUES ?';
  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Erro ao adicionar as perguntas: ' + error);
      res.status(500).json({ error: 'Erro ao adicionar as perguntas' });
    } else {
      res.json({ message: 'Perguntas adicionadas com sucesso' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
