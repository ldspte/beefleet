const {db} = require('../database.js');


const getStateVehicles = async() => {
    const results = await db.query(`
        SELECT * FROM reporte_vehiculos  
    `)
     return results.length > 0 ? results[0] : null;
}

const getStateVehiclesById = async(id_reporte) => {
    const result = await db.query(`
        SELECT * FROM reporte_vehiculos WHERE id_reporte = ?
    `,
    [id_reporte]
    );
    return result;
}

const createStateVehicle = async(descripcion, vehiculo, tipo_reporte) => {
    const result = await db.query(`
        INSERT INTO estado_vehiculos (descripcion, vehiculo, tipo_reporte) VALUES  (?, ?, ?)
    `,
    [descripcion, vehiculo, tipo_reporte]
    );
    return result;
}

const updateStateVehicle = async(id_reporte, descripcion, vehiculo, tipo_reporte) => {
    const result = await db.query(`
        UPDATE reporte_vehiculos SET descripcion = ?, vehiculo = ? ,tipo_estado = ?, tipo_reporte WHERE id_reporte = ?
    `,
    [id_reporte, descripcion, vehiculo, tipo_reporte]
    );
    return result;
}

const deleteStateVehicle = async(id_reporte) => {
    const result = await db.query(`
        DELETE FROM reporte_vehiculos WHERE id_reporte = ?
    `,
    [id_reporte]
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