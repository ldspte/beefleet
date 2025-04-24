require('dotenv').config();

const mysql  =require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


<<<<<<< HEAD
module.exports = db;
=======
module.exports = {db};
>>>>>>> 52dcd98a50ed82802a9bf2fbb86b140c5e97fcbb
