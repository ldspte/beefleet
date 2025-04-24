const db = require('../database');

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

const addDriver = async(nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic) => {
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
  [nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic]
  );
  return result;
}


const deleteDriver = async(id) => {
    const result = await db.query(
        `UPDATE Conductores SET estado = false WHERE id_conductor = ? `,
        [id]
    )
    return result;
}

const updateDriver = async(id,nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic) => {
  const resul = await db.query(
    `UPDATE * SET id_conductor = ?`
  )
}


module.exports = {
    getDrivers,
    getDriversById,
    addDriver,
    deleteDriver,
    updateDriver
}