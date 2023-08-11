const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const dbPath = 'database/database.db';
const port = 6969;
const hostname = 'localhost';

const app = express();

// Inicializar o banco de dados
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
        // Encerrar o processo se o banco de dados não puder ser aberto
        process.exit(1);
    } else {
        console.log('Banco de dados aberto com sucesso!');
    }
});

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
        res.json(rows);
    });
});

app.post('/verify', (req, res) => {
    const { email, senha } = req.body;
    console.log(email, senha)
    const query = "SELECT * FROM usuarios WHERE email = ?";
    db.get(query, [email], (err, row) => {
        console.log(row)
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao executar consulta' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        if (senha !== row.senha) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.status(200).json({ message: 'Login bem-sucedido' });
    });
});





// Certifique-se de fechar o banco de dados quando o aplicativo for encerrado
process.on('exit', (code) => {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Banco de dados fechado com sucesso.');
            }
        });
    }
});

app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}/`);
});
