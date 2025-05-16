const {db} = require('../database.js');


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
  `)
  return results;
}

const getDriversById = async(id_conductor) => {
  const result = await db.query(`
    SELECT * FROM conductores WHERE id_conductor = ?
  `,
  [id_conductor]
  );
  return result.length > 0 ? result[0] : null;
}

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(`
    INSERT INTO conductores (tipo_documento, documento, nombre_conductor, apellido_conducor, correo_conductor, foto, telefono, ciudad, contraseña, direccion tipo_licencia, fecha_vencimiento, experiencia) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, hashedPassword, direccion, tipo_licencia, fecha_vencimiento, experiencia]
  );
  return result;
}


const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion) => {
  const result = await db.query(`
    UPDATE Conductores SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, correo_conductor = ?, foto = ?, telefono = ?, ciudad = ? , direccion = ? , tipo_licencia = ?, fecha_vencimiento = ?, experiencia = ?  WHERE id_conductor = ?
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia, id_conductor]
  );
  return result;
}

const deleteDriver = async(id_conductor) => {
  const result = await db.query(`
    DELETE FROM Conductores WHERE id_conductor = ?
  `,
  [id_conductor]
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