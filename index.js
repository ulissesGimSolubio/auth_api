require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testa a conexão com o banco
pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL'))
  .catch((err) => {
    console.error('Erro ao conectar ao PostgreSQL:', err);
    process.exit(1); // encerra o processo se falhar
  });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// Rota para cadastro de usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Verifica dados básicos
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e senha são obrigatórios' });
  }

  try {
    // Verifica se usuário já existe
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Usuário já existe' });
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere usuário no banco
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username e senha são obrigatórios' });

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0)
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    // Gera token JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware para autenticar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rota protegida (exemplo)
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Olá, ${req.user.username}! Esse é seu perfil.` });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
