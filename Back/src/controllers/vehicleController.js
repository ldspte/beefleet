const {db} = require('../database.js');

const getVehicles = async() => {
  const [results] = await db.query(`SELECT * FROM vehiculos`);
  return results || [];
}

const getVehiclesById = async(id_vehiculo) => {
  const [result] = await db.query(`SELECT * FROM vehiculos WHERE id_vehiculo = ?`, [id_vehiculo]);
  return result.length > 0 ? result[0] : null;
}

const getEstadosVehiculo = async() => {
  try {
    const [results] = await db.query(`SELECT id_estado, descripcion FROM estado_vehiculo ORDER BY id_estado`);
    return results || [];
  } catch (error) {
    console.error('Error getting estados vehiculo:', error);
    throw error;
  }
}

const createVehicle = async (vehicleData) => {
  // Validar campos requeridos
  const requiredFields = ['placa', 'modelo', 'marca'];
  const missingFields = requiredFields.filter(field => !vehicleData[field]);
  if (missingFields.length > 0) {
    throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
  }

  // Validar conductor si está presente
  if (vehicleData.conductor && vehicleData.conductor !== '') {
    try {
      const [conductor] = await db.query(
        'SELECT id_conductor FROM conductores WHERE id_conductor = ?', 
        [vehicleData.conductor]
      );
      if (!conductor.length) {
        throw new Error(`Conductor no encontrado`);
      }
    } catch (error) {
      throw new Error(`Error validando conductor: ${error.message}`);
    }
  }

  // Validar y convertir estado_vehiculo
  let estadoVehiculo = 1; // Default: Activo
  if (vehicleData.estado_vehiculo) {
    try {
      // Obtener todos los estados disponibles
      const [estadosDisponibles] = await db.query('SELECT id_estado, descripcion FROM estado_vehiculos');
      
      // Intentar buscar por ID primero (si es un número)
      if (!isNaN(vehicleData.estado_vehiculo)) {
        const estadoPorId = estadosDisponibles.find(e => e.id_estado == vehicleData.estado_vehiculo);
        if (estadoPorId) {
          estadoVehiculo = parseInt(vehicleData.estado_vehiculo);
        } else {
          throw new Error(`ID de estado no válido: ${vehicleData.estado_vehiculo}`);
        }
      } else {
        // Buscar por descripción si no es un número
        const estadoPorDescripcion = estadosDisponibles.find(e => 
          e.descripcion.toLowerCase().trim() === vehicleData.estado_vehiculo.toLowerCase().trim()
        );
        if (estadoPorDescripcion) {
          estadoVehiculo = estadoPorDescripcion.id_estado;
          console.log(`Estado convertido: "${vehicleData.estado_vehiculo}" -> ID ${estadoVehiculo}`);
        } else {
          throw new Error(`Descripción de estado no válida: "${vehicleData.estado_vehiculo}". Estados disponibles: ${estadosDisponibles.map(e => e.descripcion).join(', ')}`);
        }
      }
    } catch (error) {
      throw new Error(`Error validando estado del vehículo: ${error.message}`);
    }
  }

  const query = `
    INSERT INTO vehiculos (
      placa, modelo, peso, matricula, seguro, estado_vehiculo,
      conductor, marca, color, capacidad, tipo, kilometraje
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    vehicleData.placa,
    vehicleData.modelo, 
    vehicleData.peso || 0,
    vehicleData.matricula || '',
    vehicleData.seguro || '',
    estadoVehiculo, // Ahora siempre será un ID válido
    vehicleData.conductor && vehicleData.conductor !== '' ? vehicleData.conductor : null,
    vehicleData.marca,
    vehicleData.color || null,
    vehicleData.capacidad || null,
    vehicleData.tipo || null,
    vehicleData.kilometraje || 0
  ];
  
  try {
    console.log('Creando vehículo con estado ID:', estadoVehiculo);
    const [result] = await db.query(query, values);
    const [newVehicle] = await db.query('SELECT * FROM vehiculos WHERE id_vehiculo = ?', [result.insertId]);
    return newVehicle[0];
  } catch (error) {
    console.error('Error en createVehicle:', error);
    console.error('Values:', values);
    throw new Error(`Error al crear vehículo: ${error.message}`);
  }
};

const updateVehicle = async(id_vehiculo, vehicleData) => {
    try {
        console.log('=== DEBUGGING updateVehicle ===');
        console.log('ID del vehículo:', id_vehiculo);
        console.log('Datos recibidos:', JSON.stringify(vehicleData, null, 2));
        
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
            kilometraje
        } = vehicleData;

        // Validar y convertir estado_vehiculo si es necesario
        let estadoVehiculoFinal = estado_vehiculo;
        if (estado_vehiculo) {
            // Obtener todos los estados disponibles
            const [estadosDisponibles] = await db.query('SELECT id_estado, descripcion FROM estado_vehiculos');
            console.log('Estados disponibles:', estadosDisponibles);
            console.log('Estado recibido:', estado_vehiculo, 'Tipo:', typeof estado_vehiculo);
            
            // Si no es un número, buscar por descripción
            if (isNaN(estado_vehiculo)) {
                const estadoPorDescripcion = estadosDisponibles.find(e => 
                    e.descripcion.toLowerCase().trim() === estado_vehiculo.toLowerCase().trim()
                );
                if (estadoPorDescripcion) {
                    estadoVehiculoFinal = estadoPorDescripcion.id_estado;
                    console.log(`Estado convertido: "${estado_vehiculo}" -> ID ${estadoVehiculoFinal}`);
                } else {
                    throw new Error(`Descripción de estado no válida: "${estado_vehiculo}". Estados disponibles: ${estadosDisponibles.map(e => e.descripcion).join(', ')}`);
                }
            } else {
                // Verificar que el ID existe
                const estadoPorId = estadosDisponibles.find(e => e.id_estado == estado_vehiculo);
                if (!estadoPorId) {
                    throw new Error(`ID de estado no válido: ${estado_vehiculo}`);
                }
                estadoVehiculoFinal = parseInt(estado_vehiculo);
            }
        }

        // Validar conductor si está presente y no es una cadena vacía
        if (conductor && conductor !== '' && conductor !== 'null') {
            const [conductorExiste] = await db.query(
                'SELECT id_conductor FROM conductores WHERE id_conductor = ?', 
                [conductor]
            );
            if (!conductorExiste.length) {
                throw new Error(`Conductor no encontrado con ID: ${conductor}`);
            }
        }

        const finalValues = [
            placa, 
            modelo, 
            peso || 0, 
            matricula || '', 
            seguro || '', 
            estadoVehiculoFinal, 
            (conductor && conductor !== '' && conductor !== 'null') ? conductor : null, 
            marca, 
            color || null, 
            capacidad || null, 
            tipo || null, 
            kilometraje || 0, 
            id_vehiculo
        ];

        console.log('Valores finales para actualizar:', finalValues);

        const [result] = await db.query(`
            UPDATE vehiculos SET 
                placa = ?, modelo = ?, peso = ?, matricula = ?, seguro = ?, 
                estado_vehiculo = ?, conductor = ?, marca = ?, color = ?, 
                capacidad = ?, tipo = ?, kilometraje = ?
            WHERE id_vehiculo = ?
        `, finalValues);
        console.log('Resultado de la actualización:', result);
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
    getVehiclesByDriver,
    getEstadosVehiculo
}