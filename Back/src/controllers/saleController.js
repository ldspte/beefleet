const {db} = require('../database.js');

const getSales = async() => {
    const results = await db.query(`
        SELECT * FROM ventas  
    `)
    return results;
}

const getSalesById = async(id_venta) => {
    const result = await db.query(`SELECT * FROM ventas WHERE id_venta = ?
    `,
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

module.exports = {
    getSales,
    getSalesById,
    createSale,
    updateSale,
    deleteSale
}
