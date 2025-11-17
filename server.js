const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Banco conectado com sucesso.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    data TEXT,
    horario TEXT
  )
`);

app.post('/agendar', (req, res) => {
  const { nome, cpf, data, horario } = req.body;

  if (!nome || !cpf || !data || !horario) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  // Rota para listar os agendamentos
app.get('/agendamentos', (req, res) => {
    const sql = 'SELECT * FROM agendamentos ORDER BY data, horario';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
        } else {
            res.json(rows);
        }
    });
});


  db.run(
    `INSERT INTO agendamentos (nome, cpf, data, horario) VALUES (?, ?, ?, ?)`,
    [nome, cpf, data, horario],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao salvar no banco.' });
      } else {
        res.json({ sucesso: true, id: this.lastID });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
