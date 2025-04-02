const mysql  =require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


module.exports = {db};




const getLoads = async() => {
  const files = await db.query(
    'SELECT * FROM Cargas'
  );
  return files;
}

const getSales = async() => {
  const files = await db.query(
    'SELECT * FROM Ventas'
  );
  return files; 
}

const getLoadsByClient = async(id) => {
  const files = await db.query(
    'SELECT c.id_cliente c.nombre_cliente c.apellido_cliente ca.id_carga ca.descripcion ca.fecha_inicio ca.fecha_fin FROM Clientes c INNER JOIN Cargas ca ON c.id_cliente = ca.cliente WHERE c.id_cliente = ? ORDER BY  c.id_cliente;',
    [id]
  );
  return files;
}

const getLoadsByTruck = async(idVehiculo) => {
  const results = await db.query( `
    SELECT 
      v.id_vehiculo,
      v.placa,
      v.modelo,
      ca.id_carga,
      ca.descripcion,
      ca.fecha_inicio,
      ca.fecha_fin
    FROM 
      Vehiculos v
      INNER JOIN Cargas ca ON v.id_vehiculo = ca.vehiculo
    WHERE 
      v.id_vehiculo = ?
    ORDER BY 
      ca.fecha_inicio;
  `,
  [idVehiculo]
  );
  return results;
}

const getDrivers = async() => {
  const results = await db.query(`
    SELECT * FROM Conductores  
  `)
  return results;
}

const getDriversById = async(id) => {
  const result = await db.query(`
    SELECT * FROM Conductores WHERE id_conductor = ?
  `,
  [id]);
  return result;
}

const addDriver = async(type_doc, doc, nameDri , lastName, email, img, number, city) => {
  const result = await db.query(`
    INSERT INTO Conductores (
      tipo_documento,
      documento,
      nombre_conductor,
      apellido_conductor,
      email_conductor,
      foto,
      telefono,
      ciudad
    )VALUES (?,?,?,?,?,?,?,?)
  `,
  [type_doc, doc, nameDri , lastName, email, img, number, city]
  );
  return result;
}
