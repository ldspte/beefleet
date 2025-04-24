const express = require('express');
const cors = require('cors');
<<<<<<< HEAD:Back/server.js
const route = require('./src/routes/index');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', route);
dotenv.config();
 // Cambia esto por una clave secreta más segura
=======
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
>>>>>>> 52dcd98a50ed82802a9bf2fbb86b140c5e97fcbb:Back/src/server.js



// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// app.listen(3001, () => {
//   console.log('Server listening on port 3001');
// });

module.exports = app;



