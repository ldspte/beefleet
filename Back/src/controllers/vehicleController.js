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

const updateVehicle = async(id_vehiculo, placa, modelo, peso, matricula, seguro, estado_vehiculo) => {
    const result = await db.query(`
        UPDATE vehiculos SET placa = ?, modelo = ?, peso = ?, matricula = ?, seguro = ?, estado_vehiculo = ? WHERE id_vehiculo = ?
    `,
    [placa, modelo, peso, matricula, seguro, estado_vehiculo, id_vehiculo]
    );
    return result;
}

const deleteVehicle = async(id_vehiculo) => {
    const result = await db.query(`
        DELETE FROM vehiculos WHERE id_vehiculo = ?
    `,
    [id_vehiculo]
    );
    return result;
}

const getVehiclesByDriver = async(id_conductor) => {
    const result = await db.query(`
        SELECT * FROM vehiculos WHERE id_conductor = ?
    `,
    [id_conductor]
    );
    return result;
  }



module.exports = {
  getVehicles,
  getVehiclesById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver
}

