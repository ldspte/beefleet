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
    SELECT * FROM conductores  
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

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia) => {
  const password = generatePassword();
  const hashedPassword = '123' /* await bcrypt.hash(password, 10);*/
  console.log('inicio')
  const result = await db.query(`
    INSERT INTO conductores (tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia, contraseña) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
     [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento, experiencia, hashedPassword]
  );
  return result;
}


const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion) => {
  const result = await db.query(`
    UPDATE conductores SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, correo_conductor = ?, foto = ?, telefono = ?, ciudad = ? , direccion = ? WHERE id_conductor = ?
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion, id_conductor]
  );
  return result;
}

const deleteDriver = async(id) => {
  const result = await db.query(`
    DELETE FROM conductores WHERE id_conductor = ?
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