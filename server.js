const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new Database('./database.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    data TEXT,
    horario TEXT
  )
`).run();

app.get('/agendamentos', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM agendamentos ORDER BY data, horario').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
  }
});

app.post('/agendar', (req, res) => {
  const { nome, cpf, data, horario } = req.body;

  if (!nome || !cpf || !data || !horario) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO agendamentos (nome, cpf, data, horario) VALUES (?, ?, ?, ?)'
    );

    const result = stmt.run(nome, cpf, data, horario);

    res.json({ sucesso: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar no banco.' });
  }
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
