const db = require('../database.js');

const getDrivers = async() => {
  const results = await db.query(`
    SELECT * FROM conductores  
  `)
  return results;
}

const getDriversById = async(id) => {
  const result = await db.query(`
    SELECT * FROM conductores WHERE id_conductor = ?
  `,
  [id]
  );
  return result;
}

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, email_conductor, foto, telefono, ciudad) => {
  const result = await db.query(`
    INSERT INTO conductores (tipo_documento, documento, nombre_conductor, apellido_conducor, email_conductor, foto, telefono, ciudad) VALUES  (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, email_conductor, foto, telefono, ciudad]
  );
  return result;
}


const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, email_conductor, foto, telefono, ciudad) => {
  const result = await db.query(`
    UPDATE Conductores SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, email_conductor = ?, foto = ?, telefono = ?, ciudad = ? WHERE id_conductor = ?
  `,
  [id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, email_conductor, foto, telefono, ciudad]
  );
  return result;
}

const deleteDriver = async(id) => {
  const result = await db.query(`
    DELETE FROM Conductores WHERE id_conductor = ?
  `,
  [id]
  );
  return result;
}



module.exports = {
  getDrivers,
  getDriversById,
  createDriver,
  updateDriver,
  deleteDriver
}