const {db} = require('../database.js');


const getStateVehicles = async() => {
    const results = await db.query(`
        SELECT * FROM estado_vehiculos  
    `)
    return results;
}

const getStateVehiclesById = async(id_estado) => {
    const result = await db.query(`
        SELECT * FROM estado_vehiculos WHERE id_estado = ?
    `,
    [id_estado]
    );
    return result;
}

const createStateVehicle = async(descripcion, foto, tipo_estado, tipo_reporte) => {
    const result = await db.query(`
        INSERT INTO estado_vehiculos (descripcion, foto, tipo_estado, tipo_reporte) VALUES  (?, ?, ?, ?)
    `,
    [descripcion, foto, tipo_estado, tipo_reporte]
    );
    return result;
}

const updateStateVehicle = async(id_estado, descripcion, foto, tipo_estado, tipo_reporte) => {
    const result = await db.query(`
        UPDATE estado_vehiculos SET descripcion = ?, foto = ?, tipo_estado = ?, tipo_reporte WHERE id_estado = ?
    `,
    [descripcion, foto, tipo_estado, tipo_reporte, id_estado]
    );
    return result;
}

const deleteStateVehicle = async(id_estado) => {
    const result = await db.query(`
        DELETE FROM estado_vehiculos WHERE id_estado = ?
    `,
    [id_estado]
    );
    return result;
}


module.exports = {
    getStateVehicles,
    getStateVehiclesById,
    createStateVehicle,
    updateStateVehicle,
    deleteStateVehicle
}