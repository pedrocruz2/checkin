const path = require('path')
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = 'database/database.db'; // Substitua pelo caminho desejado para o seu banco de dados
const port = 6969
const hostname = 'localhost'
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
      console.log('Banco de dados aberto com sucesso!');
    }
  });
app.use(express.static("frontend"));

//endpoint que leva para home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/register.html'));
});
app.use(express.json());
app.use(express.static("/frontend"));
app.listen(port, hostname, () => { // Ligação com o servidor
    console.log(`Server listening on http://${hostname}:${port}/`);
});
  const checkTableExistsQuery = `
  SELECT name FROM sqlite_master
    WHERE type='table' AND name='usuarios'
`;

db.get(checkTableExistsQuery, (err, row) => {
  if (err) {
    console.error('Erro ao verificar a tabela:', err.message);
    return;
  }

  if (!row) {
    // A tabela 'usuarios' não existe, então criamos ela
    const createTableQuery = `
      CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        senha TEXT NOT NULL
      )
    `;

    db.run(createTableQuery, [], (err) => {
      if (err) {
        console.error('Erro ao criar a tabela:', err.message);
      } else {
        console.log('Tabela "usuarios" criada com sucesso!');
      }
    });
  } else {
    console.log('A tabela "usuarios" já existe.');
  }

});
app.post('/register', (req, res) => { 
  const insert = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
  db.run(insert,[req.body.email, req.body.senha], (err) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({
              error: 'Failed to register user!'
          });
      } else {
          res.status(201).json({
              message: 'User registered successfully!'
          });
      }
  });
});