const {db} = require('../database.js');
const bcrypt = require('bcryptjs'); // Agregar esta importación

function generatePassword(longitud=10) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      password += caracteres[indice];
  }
  return password;
}

const getDrivers = async() => {
  try {
    const [results] = await db.query(`SELECT * FROM Conductores`);
    return results;
  } catch (error) {
    console.error('Error en getDrivers:', error);
    throw error;
  }
}

const getDriversById = async(id_conductor) => {
  try {
    const [result] = await db.query(`
      SELECT * FROM Conductores WHERE id_conductor = ?
    `, [id_conductor]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error en getDriversById:', error);
    throw error;
  }
}

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion) => {
  try {
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(`
      INSERT INTO Conductores (tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, contraseña, direccion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, hashedPassword, direccion]);
    
    return { id: result.insertId, password }; // Devolver también la contraseña para enviarla por email
  } catch (error) {
    console.error('Error en createDriver:', error);
    throw error;
  }
}

const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion) => {
  try {
    const [result] = await db.query(`
      UPDATE Conductores SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, correo_conductor = ?, foto = ?, telefono = ?, ciudad = ?, direccion = ? 
      WHERE id_conductor = ?
    `, [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, id_conductor]);
    
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('Error en updateDriver:', error);
    throw error;
  }
}

const deleteDriver = async(id) => {
  try {
    const [result] = await db.query(`
      DELETE FROM Conductores WHERE id_conductor = ?
    `, [id]);
    
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('Error en deleteDriver:', error);
    throw error;
  }
}

module.exports = {
  getDrivers,
  getDriversById,
  createDriver,
  updateDriver,
  deleteDriver
}