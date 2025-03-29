const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({
      status: 'Base de datos conectada con éxito',
      result: rows
    });
  } catch (error) {
    console.error('Database error', error);
    res.status(500).json({ 
      message: 'Error connecting to database',
      error: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});



