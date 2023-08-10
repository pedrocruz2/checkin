const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Configurações
const dbPath = 'database/database.db';
const port = 6969;
const hostname = 'localhost';

// Inicialização
const app = express();
const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados:', err.message);
        } else {
            console.log('Banco de dados aberto com sucesso!');
        }
    }
);

// Middlewares
app.use(express.json());
app.use(express.static("frontend"));

// Endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/homepageLogged.html'));

});

app.post('/register', (req, res) => {
    const insert = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
    db.run(insert, [req.body.email, req.body.senha], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to register user!' });
        } else {
            res.status(201).json({ message: 'User registered successfully!' });
        }
    });
});

app.get('/dados', (req, res) => {
    const query = "SELECT * FROM usuarios";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao executar consulta' });
        }

        // Não feche o banco de dados aqui, pois outros endpoints podem precisar dele.
        // db.close();

        res.json(rows);
    });
});

// Configuração do banco de dados
const checkTableExistsQuery = `
    SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';
`;

db.get(checkTableExistsQuery, (err, row) => {
    if (err) {
        console.error('Erro ao verificar a tabela:', err.message);
        return;
    }

    if (!row) {
        const createTableQuery = `
            CREATE TABLE usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                senha TEXT NOT NULL
            );
        `;

        db.run(createTableQuery, [], (err) => {
            if (err) {
                console.error('Erro ao criar a tabela:', err.message);
            } else {
                console.log('Tabela "usuarios" criada com sucesso!');
            }
        });
    }
});

app.post('/verify', (req, res) => {
  const { email, senha } = req.body; // Extrai email e senha da requisição

  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.get(query, [email], (err, row) => {
      if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Erro ao executar consulta' });
      }
      console.log(row)
      if (!row) {
          // Se não encontrarmos nenhum usuário com esse email
          console.log('Usuário não encontrado')
          return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Neste exemplo, a senha está sendo armazenada em texto simples no banco de dados,
      // o que não é seguro. Na prática, você deve usar um hashing seguro, como bcrypt, para
      // armazenar e verificar senhas.
      if (senha !== row.senha) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Se chegarmos até aqui, as credenciais são válidas
      console.log('Login bem-sucedido')
      res.status(200).json({ message: 'Login bem-sucedido' });
  });
});







// Inicialização do servidor
app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}/`);
});
