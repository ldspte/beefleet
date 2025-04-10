const db = require('../database');

const getloads = async() => {
  const results = await db.query(`
    SELECT * FROM Conductores  
  `)
  return results;
}

const getLoadsById = async(id) => {
  const result = await db.query(`
    SELECT * FROM Conductores WHERE id_conductor = ?
  `,
  [id]);
  return result;
}

const addLoad = async(nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic) => {
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


const deleteLoad = async(id) => {
    const result = await db.query(
        `UPDATE Conductores SET estado = false WHERE id_conductor = ? `,
        [id]
    )
    return result;
}

const updateLoad = async(id,nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic) => {

}