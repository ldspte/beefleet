const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const route = require('./routes/index');


app.use(cors());
app.use(express.json());

// Tus rutas existentes
app.use('/', route);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Server listening on port 3001');
  const contraseña = 'hola123';
  console.log('🚀 Server listening on port 3001');
  console.log('📧 Endpoint de recuperación: http://localhost:3001/forgot-password');
  
  const hashpassword = bcrypt.hashSync(contraseña, 10);
  console.log('🔑 Hash de prueba:', hashpassword);
});

module.exports = app;