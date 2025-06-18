const {db} = require('../database.js');

const getVehicles = async() => {
  const results = await db.query(`
    SELECT * FROM Vehiculos  
  `)
  return results.length > 0 ? results[0] : null;
}

const getVehiclesById = async(id_vehiculo) => {
  const result = await db.query(`
    SELECT * FROM Vehiculos WHERE id_vehiculo = ?
  `,
  [id_vehiculo]
  );
  return result.length > 0 ? result[0] : null;
}

const createVehicle = async(placa, marca, modelo, kilometraje, color, capacidad, tipo, conductor, estado_vehiculo ) => {
    const result = await db.query(`
        INSERT INTO vehiculos (placa, marca, modelo, kilometraje, color, capacidad, tipo, conductor, estado_vehiculo ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [placa, marca, modelo, kilometraje, color, capacidad, tipo, conductor, estado_vehiculo ]
    );
    return result.length > 0 ? result[0] : null;
}

const updateVehicle = async(id_vehiculo, placa, marca, modelo, kilometraje, color, capacidad, tipo, conductor, estado_vehiculo ) => {
    const result = await db.query(`
        UPDATE vehiculos SET placa = ?, marca = ?, modelo = ?, kilometraje = ?, color = ?, capacidad = ?, tipo = ?, conductor = ?, estado_vehiculo = ?  WHERE id_vehiculo = ?
    `,
    [placa, marca, modelo, kilometraje, color, capacidad, tipo, conductor, estado_vehiculo , id_vehiculo]
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

const getDriverByVehicle = async (id_vehiculo) => {
    const result = await db.query(`
        SELECT conductor FROM Vehiculos WHERE id_vehiculo = ?
    `, [id_vehiculo]);
    console.log(result);
    if (result.length > 0) {
        return result; 
    } else {
        return null; 
    }
}



module.exports = {
  getVehicles,
  getVehiclesById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getDriverByVehicle
}

