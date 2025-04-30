const express = require('express'); 
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');

const route = require('./routes/index'); 

app.use(cors()); 
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
  const contraseña = 'losimpsom1';
  const hashpassword = bcrypt.hashSync(contraseña, 10);
  console.log(hashpassword);
});

module.exports = app;



