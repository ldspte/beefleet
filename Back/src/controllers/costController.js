const {db} = require('../database.js');

const getCosts = async() => {
    const results = await db.query(`
        SELECT * FROM costos 
    `)
    return results;
}

const getCostsById = async(id_costos) => {
    const result = await db.query(`
        SELECT * FROM costos WHERE id_costos = ?
    `,
    [id_costos]
    );
    return result;
}

const createCost = async(fecha, valor, descripcion, foto, carga)=>{
    const result = await db.query(`
        INSERT INTO costos (fecha, valor, descripcion, foto, carga) VALUES  (?, ?, ?, ?, ?)
    `,
    [fecha, valor, descripcion, foto, carga]
    );
    return result;
}

const updateCost = async(id_costos, fecha, valor, descripcion, foto, carga) => {
    const result = await db.query(`
        UPDATE costos SET fecha = ?, valor = ?, descripcion = ?, foto = ?, carga = ? WHERE id_costos = ?
    `,
    [fecha, valor, descripcion, foto, carga, id_costos]
    );
    return result;
}

const deleteCost = async(id_costos) => {
    const result = await db.query(`
        DELETE FROM costos WHERE id_costos = ?
    `,
    [id_costos]
    );
    return result;
}

module.exports = {
    getCosts,
    getCostsById,
    createCost,
    updateCost,
    deleteCost
}