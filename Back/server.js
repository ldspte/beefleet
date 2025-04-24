const express = require('express');
const cors = require('cors');
const route = require('./src/routes/index');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', route);
dotenv.config();
 // Cambia esto por una clave secreta más segura



// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});



