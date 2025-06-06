const {db} = require('../database.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const sendPasswordEmail = async (correo_conductor, password) => {
  // Configura el transportador de Nodemailer
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'fabioreggae98@gmail.com',
      pass: 'cquq zyez jhsi jeaj'
    }
  });

  const mailOptions = {
    from: 'fabioreggae98@gmail.com',
    to: correo_conductor,
    subject: 'Bienvenido a Beefleet',
    text: `Hola, tu contraseña por defecto es: ${password}`,
    html: `<p>Hola, tu contraseña por defecto es: <strong>${password}</strong></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

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
  const results = await db.query(`
    SELECT * FROM Conductores  
  `);
  return results.length > 0 ? results[0] : null;
}

const getDriversById = async(id_conductor) => {
  const result = await db.query(`
    SELECT * FROM conductores WHERE id_conductor = ?
  `, [id_conductor]);
  return result.length > 0 ? result[0] : null;
}

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia, estado) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(`
    INSERT INTO conductores (tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, contraseña, direccion, tipo_licencia, fecha_vencimiento, experiencia, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, hashedPassword, direccion, tipo_licencia, fecha_vencimiento, experiencia, estado]);
  
  await sendPasswordEmail(correo_conductor, password);
  return result;
}

// FUNCIÓN CORREGIDA - Incluye todos los parámetros necesarios
const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia) => {
  const result = await db.query(`
    UPDATE Conductores 
    SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, 
        correo_conductor = ?, foto = ?, telefono = ?, ciudad = ?, direccion = ?, 
        tipo_licencia = ?, fecha_vencimiento = ?, experiencia = ? 
    WHERE id_conductor = ?
  `, [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia, id_conductor]);
  return result;
}

const deleteDriver = async(id_conductor) => {
  const result = await db.query(`
    DELETE FROM Conductores WHERE id_conductor = ?
  `, [id_conductor]);
  return result;
}

module.exports = {
  getDrivers,
  getDriversById,
  createDriver,
  updateDriver,
  deleteDriver
}