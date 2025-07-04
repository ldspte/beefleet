const {db} = require('../database')

const getRoutes = async() => {    
  const results = await db.query(`
    SELECT * FROM rutas
  `)
  return results.length > 0 ? results[0] : null;
}

const getRoutesById = async(id_ruta) => {
  const results = await db.query(`
    SELECT * FROM rutas WHERE id_ruta = ?
  `,
  [id_ruta]
  );
  return results.length > 0 ? results[0] : null;
}

const createRoute = async(origen, destino, distancia, carga) => {
    const result = await db.query(`
        INSERT INTO rutas (origen, destino, distancia, carga) VALUES  (?, ?, ?, ?)
    `,
    [origen, destino, distancia, carga]
    );
    return result;
}

const updateRoute = async(id_ruta, origen, destino, distancia, carga) => {
    const result = await db.query(`
        UPDATE rutas SET origen = ?, destino = ?, distancia = ?, carga = ? WHERE id_ruta = ?
    `,
    [origen, destino, distancia, carga, id_ruta]
    );
    return result;
}

const deleteRoute = async(id_ruta) => {
    const result = await db.query(`
        DELETE FROM rutas WHERE id_ruta = ?
    `,
    [id_ruta]
    );
    return result;
}

module.exports = {
  getRoutes,
  getRoutesById,
  createRoute,
  updateRoute,
  deleteRoute
}