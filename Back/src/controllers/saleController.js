const {db} = require('../database.js');

const getSales = async() => {
    const results = await db.query(`
        SELECT * FROM Ventas  
    `)
    return results.length > 0 ? results[0] : null;
}

const getSalesById = async(id_venta) => {
    const result = await db.query(`SELECT * FROM ventas WHERE id_venta = ?
    `,
    [id_venta]
    );
    return result;

}

const createSale = async( valor, carga) => {
    const result = await db.query(`
        INSERT INTO ventas (valor, carga) VALUES  (?, ?)
    `,
    [ valor, carga]
    );
    return result;
}


const updateSale = async(id_venta, valor, carga) => {
    const result = await db.query(`
        UPDATE ventas SET  valor = ?, carga = ? WHERE id_venta = ?
    `,
    [valor, carga, id_venta]
    );
    return result;
}

const deleteSale = async(id_venta) => {
    const result = await db.query(`
        DELETE FROM Ventas WHERE id_venta = ?
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
