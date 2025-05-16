const express = require('express'); // Asegúrate de importar express
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');

const route = require('./routes/index'); // Asegúrate de que la ruta sea correcta

app.use(cors()); // Puedes configurar CORS aquí si es necesario
app.use(express.json());
app.use('/', route);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Server listening on port 3001');
  const contraseña = 'juan123';
  const hashpassword = bcrypt.hashSync(contraseña, 10);
  console.log(hashpassword);
});

module.exports = app;



