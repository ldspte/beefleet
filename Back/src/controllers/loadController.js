const {db} = require('../database.js');


const getLoads = async() => {
  const results = await db.query(`
    SELECT * FROM cargas  
  `)
  return results.length > 0 ? results[0] : null;
}

const getLoadsById = async(id_carga) => {
    const results = await db.query(`
        SELECT * FROM cargas WHERE id_carga = ?
    `,
    [id_carga]
    );
    return results.length > 0 ? results[0] : null;
}

const createLoad = async( descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, estado) => {
    const result = await db.query(`
        INSERT INTO cargas ( descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, estado) VALUES  (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, estado]
    );
    return result;
}


const updateLoad = async(id_carga, descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, estado) => {
    const result = await db.query(`
        UPDATE cargas SET descripcion = ?, peso = ?, foto_carga = ?, fecha_inicio = ?, fecha_fin = ?, vehiculo = ?, cliente = ?, estado = ? WHERE id_carga = ?
    `,
    [descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, estado, id_carga]
    );
    return result;
}

const deleteLoad = async(id_carga) => {
    const result = await db.query(`
        DELETE FROM cargas WHERE id_carga = ?
    `,
    [id_carga]
    );
    return result;
}


const getLoadsByDriver = async(id_conductor) => {
    const result = await db.query(`
        SELECT * FROM cargas WHERE conductor = ?
    `,
    [id_conductor]
    );
    return result;
}

module.exports = {
  getLoads,
  getLoadsById,
  createLoad,
  updateLoad,
  deleteLoad,
  getLoadsByDriver
}