const {db} = require('../database')

const getRoutes = async() => {
  try {
    // Usar execute en lugar de query para mayor compatibilidad
    const [rows] = await db.execute(`SELECT * FROM rutas`);
    console.log('🔍 Resultados de la BD (rows):', rows);
    console.log('🔍 Tipo de rows:', typeof rows);
    console.log('🔍 Es array?:', Array.isArray(rows));
    
    // Si rows es un array, devolverlo directamente
    if (Array.isArray(rows)) {
      return rows;
    }
    
    // Si no es array, intentar obtener los datos
    console.log('⚠️ rows no es array, intentando fallback...');
    const results = await db.query(`SELECT * FROM rutas`);
    console.log('🔍 Fallback results:', results);
    
    // Si results es array, devolverlo
    if (Array.isArray(results)) {
      return results;
    }
    
    // Si results tiene propiedad de filas (dependiendo del driver)
    if (results && Array.isArray(results[0])) {
      return results[0];
    }
    
    // Último recurso
    return results || [];
    
  } catch (error) {
    console.error('❌ Error en getRoutes:', error);
    throw error;
  }
}

const getRoutesById = async(id_ruta) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM rutas WHERE id_ruta = ?
    `, [id_ruta]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('❌ Error en getRoutesById:', error);
    throw error;
  }
}

const createRoute = async(origen, destino, distancia, carga) => {
  try {
    const [result] = await db.execute(`
      INSERT INTO rutas (origen, destino, distancia, carga) 
      VALUES (?, ?, ?, ?)
    `, [origen, destino, distancia, carga]);
    
    console.log('✅ Ruta creada con ID:', result.insertId);
    return { 
      id_ruta: result.insertId, 
      origen, 
      destino, 
      distancia, 
      carga 
    };
  } catch (error) {
    console.error('❌ Error en createRoute:', error);
    throw error;
  }
}

// ❌ ERROR CORREGIDO: era id_ruta, debe ser id
const updateRoute = async(id, origen, destino, distancia, carga) => {
  try {
    const [result] = await db.execute(`
      UPDATE rutas 
      SET origen = ?, destino = ?, distancia = ?, carga = ? 
      WHERE id_ruta = ?
    `, [origen, destino, distancia, carga, id]); // ✅ Ahora usa 'id'
    
    if (result.affectedRows > 0) {
      // Devolver la ruta actualizada
      return await getRoutesById(id);
    }
    return null;
  } catch (error) {
    console.error('❌ Error en updateRoute:', error);
    throw error;
  }
}

// ❌ ERROR CORREGIDO: era id_ruta, debe ser id
const deleteRoute = async(id) => {
  try {
    const [result] = await db.execute(`
      DELETE FROM rutas WHERE id_ruta = ?
    `, [id]); // ✅ Ahora usa 'id'
    
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error('❌ Error en deleteRoute:', error);
    throw error;
  }
}

const getAllCargas = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT id_carga, descripcion, peso, tipo, estado 
      FROM cargas 
      ORDER BY id_carga DESC
    `);
    return rows;
  } catch (error) {
    console.error('❌ Error getting all cargas:', error);
    throw error;
  }
}

module.exports = {
  getRoutes,
  getRoutesById,
  createRoute,
  updateRoute,
  deleteRoute,
  getAllCargas
};