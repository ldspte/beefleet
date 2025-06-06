const {db} = require('../database.js');

const getVehicles = async() => {
  const results = await db.query(`
    SELECT * FROM Vehiculos  
  `)
  return results.length > 0 ? results[0] : null;
}

const getVehiclesById = async(id_vehiculo) => {
  const result = await db.query(`
    SELECT * FROM vehiculos WHERE id_vehiculo = ?
  `,
  [id_vehiculo]
  );
  return result.length > 0 ? result[0] : null;
}

const createVehicle = async(placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor) => {
    const result = await db.query(`
        INSERT INTO vehiculos (placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor) VALUES  (?, ?, ?, ?, ?, ?, ?)
    `,
    [placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor]
    );
    return result.length > 0 ? result[0] : null;
}

const updateVehicle = async(id_vehiculo, vehicleData) => {
    try {
        const {
            placa, 
            modelo, 
            peso, 
            matricula, 
            seguro, 
            estado_vehiculo, 
            conductor,
            marca, 
            color, 
            capacidad, 
            tipo, 
            año, 
            kilometraje
        } = vehicleData;

        const [result] = await db.query(`
            UPDATE vehiculos SET 
                placa = ?, modelo = ?, peso = ?, matricula = ?, seguro = ?, 
                estado_vehiculo = ?, conductor = ?, marca = ?, color = ?, 
                capacidad = ?, tipo = ?, año = ?, kilometraje = ?
            WHERE id_vehiculo = ?
        `,
        [placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor, marca, color, capacidad, tipo, año, kilometraje, id_vehiculo]
        );
        
        return result;
    } catch (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    }
}

const deleteVehicle = async(id_vehiculo) => {
    try {
        const [result] = await db.query(`
            DELETE FROM vehiculos WHERE id_vehiculo = ?
        `,
        [id_vehiculo]
        );
        return result;
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
    }
}

const getVehiclesByDriver = async(id_conductor) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM vehiculos WHERE conductor = ?
        `,
        [id_conductor]
        );
        return rows;
    } catch (error) {
        console.error('Error getting vehicles by driver:', error);
        throw error;
    }
}

module.exports = {
    getVehicles,
    getVehiclesById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByDriver
}