const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conectar ao banco
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Banco conectado com sucesso.');
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    data TEXT,
    horario TEXT
  )
`);

// Buscar agendamentos
app.get('/agendamentos', (req, res) => {
  db.all('SELECT * FROM agendamentos ORDER BY data, horario', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }
    res.json(rows);
  });
});

// Inserir agendamento
app.post('/agendar', (req, res) => {
  const { nome, cpf, data, horario } = req.body;

  if (!nome || !cpf || !data || !horario) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  const sql = `INSERT INTO agendamentos (nome, cpf, data, horario) VALUES (?, ?, ?, ?)`;

  db.run(sql, [nome, cpf, data, horario], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao salvar no banco.' });
    }
    res.json({ sucesso: true, id: this.lastID });
  });
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
