const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('./database'); // Asegúrate de tener tu pool de conexiones configurado
const app = express();
app.use(cors());
app.use(express.json());
const SECRET_KEY = process.env.SECRET_KEY || 'lossimpsom'; // Cambia esto por una clave secreta más segura
const dirversRoute = require('./routes/driversRoute');

app.use(dirversRoute)

// Registro de usuario
app.post('/api/register', [
  body('email_usuario').isString().notEmpty(),
  body('contraseña').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email_usuario, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query('INSERT INTO Usuarios (email_usuario, contraseña) VALUES (?, ?)', [email_usuario, hashedPassword]);
    res.status(201).send('User  registered');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Inicio de sesión
app.post('/api/login ', [
  body('email_usuario').isString().notEmpty(),
  body('contraseña').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email_usuario, password } = req.body;
  try {
    const [user] = await pool.query('SELECT * FROM Usuarios WHERE email_usuario = ?', [email_usuario]);

    if (!user.length || !(await bcrypt.compare(password, user[0].contraseña))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user[0].id_usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Middleware para proteger rutas
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Ruta protegida
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

// Ruta de prueba para verificar conexión a la base de datos
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1'); // Simple consulta para verificar la conexión
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to database' });
  }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// app.listen(3001, () => {
//   console.log('Server listening on port 3001');
// });

module.exports = app;



