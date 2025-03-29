const express = require('express');
const cors = require('cors');
const db = require('./db'); // Asegurar que db.js exporte la conexión correctamente

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar conexión a la base de datos
app.get('/', async (req, res) => {
  try {
    // Ejecuta una consulta de prueba (ej: SELECT 1)
    const [rows] = await db.query('SELECT 1');
    res.json({ 
      status: 'Base de Datos conectada con éxito',
      result: rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Error conectando la Base de Datos',
      error: error.message 
    });
  }
});

// Ejemplo de ruta para obtener usuarios (ajusta según tu DB)
app.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM Usuarios');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



