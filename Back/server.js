const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await db;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to database' });
  }
});

app.listen(3001, () => {
  console.log('Server listening on port 3000');
});



