const {db} = require('../database.js');

const getSales = async() => {
    try {
        const results = await db.query(`SELECT * FROM ventas ORDER BY fecha DESC`);
        console.log('📊 Datos de BD:', results); // Para debug
        return results;
    } catch (error) {
        console.error('❌ Error en getSales:', error);
        throw error;
    }
}

const getSalesById = async(id_venta) => {
    const result = await db.query(`SELECT * FROM ventas WHERE id_venta = ?`,
    [id_venta]
    );
    return result;
}

const createSale = async(fecha, valor, descripcion, carga) => {
    const result = await db.query(`
        INSERT INTO ventas (fecha, valor, descripcion, carga) VALUES  (?, ?, ?, ?)
    `,
    [fecha, valor, descripcion, carga]
    );
    return result;
}

const updateSale = async(id_venta, fecha, valor, descripcion, carga) => {
    const result = await db.query(`
        UPDATE ventas SET fecha = ?, valor = ?, descripcion = ?, carga = ? WHERE id_venta = ?
    `,
    [fecha, valor, descripcion, carga, id_venta]
    );
    return result;
}

const deleteSale = async(id_venta) => {
    const result = await db.query(`
        DELETE FROM ventas WHERE id_venta = ?
    `,
    [id_venta]
    );
    return result;
}

// ==================== FUNCIONES PARA CARGAS ====================
const getLoads = async() => {
    try {
        const results = await db.query(`SELECT * FROM cargas ORDER BY id_carga DESC`);
        console.log('📊 Cargas de BD:', results); // Para debug
        return results;
    } catch (error) {
        console.error('❌ Error en getLoads:', error);
        throw error;
    }
}

const getLoadById = async(id_carga) => {
    const result = await db.query(`SELECT * FROM cargas WHERE id_carga = ?`,
    [id_carga]
    );
    return result;
}

const createLoad = async(descripcion, fecha, estado) => {
    const result = await db.query(`
        INSERT INTO cargas (descripcion, fecha, estado) VALUES (?, ?, ?)
    `,
    [descripcion, fecha, estado]
    );
    return result;
}

const updateLoad = async(id_carga, descripcion, fecha, estado) => {
    const result = await db.query(`
        UPDATE cargas SET descripcion = ?, fecha = ?, estado = ? WHERE id_carga = ?
    `,
    [descripcion, fecha, estado, id_carga]
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

module.exports = {
    // Ventas
    getSales,
    getSalesById,
    createSale,
    updateSale,
    deleteSale,
    // Cargas
    getLoads,
    getLoadById,
    createLoad,
    updateLoad,
    deleteLoad
}
