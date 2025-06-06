const {db} = require('../database.js');

const getVehicles = async() => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM vehiculos  
        `);
        return rows;
    } catch (error) {
        console.error('Error getting vehicles:', error);
        throw error;
    }
}

const getVehiclesById = async(id_vehiculo) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM vehiculos WHERE id_vehiculo = ?
        `,
        [id_vehiculo]
        );
        return rows[0]; // Retorna el primer elemento o undefined
    } catch (error) {
        console.error('Error getting vehicle by ID:', error);
        throw error;
    }
}

const createVehicle = async(vehicleData) => {
    try {
        const {
            placa, 
            modelo, 
            peso = 0, // Valor por defecto
            matricula = '', // Valor por defecto
            seguro = '', // Valor por defecto
            estado_vehiculo = 'Activo', 
            conductor = null, // Puede ser null si no hay conductor asignado
            marca = '', 
            color = '', 
            capacidad = '', 
            tipo = '', 
            año, 
            kilometraje = 0
        } = vehicleData;

        const [result] = await db.query(`
            INSERT INTO vehiculos (
                placa, modelo, peso, matricula, seguro, estado_vehiculo, 
                conductor, marca, color, capacidad, tipo, año, kilometraje
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor, marca, color, capacidad, tipo, año, kilometraje]
        );
        
        return {
            id_vehiculo: result.insertId,
            ...vehicleData
        };
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    }
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