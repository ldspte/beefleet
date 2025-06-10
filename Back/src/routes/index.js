const express = require('express');
const route = express.Router();
const { body, validationResult } = require('express-validator');
const {db} = require('../database'); // Asegúrate de tener tu pool de conexiones configurado
const SECRET_KEY = process.env.SECRET_KEY || 'lossimpsom';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { getDrivers, getDriversById, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const {getClients, getClientsById, createClient, updateClient, deleteClient} = require('../controllers/clientController');
const {getUsers, getUsersById, createUser, updateUser} = require('../controllers/usersController');
const {getSales, getSalesById, createSale, updateSale, deleteSale} = require('../controllers/saleController');
const {getRoutes, getRoutesById, createRoute, updateRoute, deleteRoute} = require('../controllers/routeController');
const {getVehicles, getVehiclesById, createVehicle, updateVehicle, deleteVehicle} = require('../controllers/vehicleController');
const {getLoads, getLoadsById, getLoadsByDriver, createLoad, updateLoad, deleteLoad} = require('../controllers/loadController');
const {getStateVehicles, getStateVehiclesById, createStateVehicle, updateStateVehicle, deleteStateVehicle } = require('../controllers/stateVehicleController');

// Inicio de sesión Conductor

route.post('/api/logindrivers', [
  body('correo_conductor').isString().notEmpty(),
  body('contraseña').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { correo_conductor, contraseña } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM Conductores WHERE correo_conductor = ?', [correo_conductor]);
    if (!user.length || !(await bcrypt.compare(contraseña, user[0].contraseña))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user[0].id_conductor }, SECRET_KEY, { expiresIn: '3h' });
    console.log('inicio')
    res.json({ token , user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});



// Inicio de sesión Usuario
route.post('/api/admin', [
  body('correo_usuario').isString().notEmpty(),
  body('contraseña').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { correo_usuario, contraseña } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE correo_usuario = ?', [correo_usuario]);
    if (!user.length || !(await bcrypt.compare(contraseña, user[0].contraseña))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user[0].id_usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token , user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  console.log('Authorization Header:', authHeader);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log('JWT Error:', err.message);
        return res.status(403).json({ 
          error: 'Token inválido o expirado',
          message: err.message 
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ 
      error: 'Token no proporcionado',
      message: 'Se requiere un token de autorización válido' 
    });
  }
};
  
// Obtener todos los conductores

route.get('/api/drivers', authenticateJWT, async (req,res) => {
  console.log('Petición recibida para obtener drivers');
  try {
    const values = await getDrivers();
    console.log('Drivers obtenidos:', values);
    return res.status(200).json(values);
  } catch (error) {
    console.error('Error en ruta drivers:', error);
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
});

// crear un conductor
route.post('/api/drivers', authenticateJWT, async (req,res) => {
  const {tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion } = req.body;
  try {
    const driver = await createDriver(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion);
    return res.status(201).json({ driver });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating driver' });
  }
});


//contraseña por defecto 
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
      user: 'ldspte9807@gmail.com',
      pass: 'lossimpsom123' 
  }
});

route.post('/api/send-password', (req, res) => {
  const { correo_conductor, contraseña } = req.body;

  const mailOptions = {
      from: 'ldspte9807@gmail.com',
      to: correo_conductor,
      subject: 'Bienvenido a Beeflet',
      text: `Se ha creado tu cuenta en Beefleet y Tu contraseña es: ${contraseña}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).send(error.toString());
      }
      res.status(200).send('Correo enviado: ' + info.response);
  });
});

// Buscar por id conductor

route.get('/api/drivers/:id_conductor', authenticateJWT, async (req,res) => {
  const { id_conductor } = req.params;
  try {
    const driver = await getDriversById(id_conductor);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    return res.status(200).json(driver);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching driver' });
  }
});

//actualizar conductor

route.put('/api/drivers/:id_conductor', authenticateJWT, async (req,res) => {
  const { id_conductor } = req.params;
  const { tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion } = req.body;
  try {
    const driver = await updateDriver(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    return res.status(200).json({ message: 'Driver updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating driver' });
  }
});


// eliminar conductor
route.delete('/api/drivers/:id_conductor', authenticateJWT, async (req,res) => {
  const { id_conductor } = req.params;
  try {
    const driver = await deleteDriver(id_conductor);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    return res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting driver' });
  }
});

// Login de admin

route.post('/api/loginadmin', [
  body('correo_usuario').isString().notEmpty(),
  body('contraseña').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { correo_usuario, contraseña } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM Conductores WHERE correo_conductor = ?', [correo_usuario]);
    if (!user.length || !(await bcrypt.compare(contraseña, user[0].contraseña))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user[0].id_usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

//obtener Usuario por id

route.get('/api/admin/:id_usuario', authenticateJWT, async (req,res) => {
  const { id_usuario } = req.params;
  try {
    const user = await getDriversById(id_usuario);
    if (!user) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching driver' });
  }
})

// Obtener todos los vehiculos

route.get('/api/vehicles', authenticateJWT, async (req,res) => {
  try {
    const values = await getVehicles();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
})

// Obtener vehiculo por ID 
route.get('/api/vehicles/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await getVehiclesById(id);
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json(vehiculo);
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    return res.status(500).json({ message: 'Error fetching vehicle' });
  }
})

// Crear vehiculo
route.post('/api/vehicles', authenticateJWT, async (req, res) => {
  const { placa, marca, modelo, año, color, tipo, capacidad, kilometraje, estado_vehiculo, conductor } = req.body;
  try {
    const vehicle = await createVehicle(placa, marca, modelo, año, color, tipo, capacidad, kilometraje, estado_vehiculo, conductor);
    return res.status(201).json({ vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return res.status(500).json({ message: 'Error creating vehicle' });
  }
});

// Actualizar vehiculo
route.put('/api/vehicles/:id_vehiculo', authenticateJWT, async (req, res) => {
  const { id_vehiculo } = req.params;
  const { placa, marca, modelo, año, color, tipo, capacidad, kilometraje, estado_vehiculo, conductor } = req.body;
  try {
    const vehicle = await updateVehicle(id_vehiculo, placa, marca, modelo, año, color, tipo, capacidad, kilometraje, estado_vehiculo, conductor);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return res.status(500).json({ message: 'Error updating vehicle' });
  }
});

// eliminar vehiculo
route.delete('/api/vehicles/:id_vehiculo', authenticateJWT, async (req, res) => {
  const { id_vehiculo } = req.params;
  try {
    const vehicle = await deleteVehicle(id_vehiculo);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return res.status(500).json({ message: 'Error deleting vehicle' });
  }
});

//obtener Clientes
route.get('/api/clients', authenticateJWT, async (req, res) => {
  console.log('=== GET /api/clients route called ===');
  console.log('User from JWT:', req.user);
  
  try {
    console.log('Calling getClients controller...');
    const clients = await getClients();
    
    console.log('Controller returned:', clients);
    console.log('Clients type:', typeof clients);
    console.log('Is array:', Array.isArray(clients));
    console.log('Clients length:', clients?.length);
    
    // Ensure we always return an array
    const clientsArray = Array.isArray(clients) ? clients : [];
    
    console.log('Sending response with', clientsArray.length, 'clients');
    
    res.status(200).json(clientsArray);
  } catch (error) {
    console.error('=== ERROR in GET /api/clients ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Error fetching clients',
      error: error.message 
    });
  }
});

// obtener cliente por ID
route.get('/api/clients/:id_cliente', authenticateJWT, async (req, res) => {
  const { id_cliente } = req.params;
  console.log('=== GET /api/clients/:id route called with id:', id_cliente);
  
  try {
    const client = await getClientsById(id_cliente);
    console.log('Found client:', client);
    
    if (!client || client.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.status(200).json(client[0]);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    res.status(500).json({ message: 'Error fetching client' });
  }
});

// crear cliente
route.post('/api/clients', authenticateJWT, async (req, res) => {
  console.log('=== POST /api/clients route called ===');
  console.log('Request body:', req.body);
  
  const { nit, direccion, ciudad, telefono, empresa } = req.body;
  
  if (!nit || !direccion || !ciudad || !telefono || !empresa) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const result = await createClient(nit, direccion, ciudad, telefono, empresa);
    console.log('Client created successfully:', result);
    
    res.status(201).json({ 
      message: 'Client created successfully',
      client_id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client' });
  }
});

// actualizar cliente
route.put('/api/clients/:id_cliente', authenticateJWT, async (req, res) => {
  const { id_cliente } = req.params;
  const { nit, direccion, ciudad, telefono, empresa } = req.body;
  
  console.log('=== PUT /api/clients/:id route called ===');
  console.log('ID:', id_cliente);
  console.log('Body:', req.body);
  
  if (!nit || !direccion || !ciudad || !telefono || !empresa) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const existingClient = await getClientsById(id_cliente);
    if (!existingClient || existingClient.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const result = await updateClient(id_cliente, nit, direccion, ciudad, telefono, empresa);
    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error updating client' });
  }
});

// eliminar cliente
route.delete('/api/clients/:id_cliente', authenticateJWT, async (req, res) => {
  const { id_cliente } = req.params;
  console.log('=== DELETE /api/clients/:id route called with id:', id_cliente);
  
  try {
    const existingClient = await getClientsById(id_cliente);
    if (!existingClient || existingClient.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const result = await deleteClient(id_cliente);
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

// Obtener todas las cargas
route.get('/api/loads', authenticateJWT, async (req, res) => {
  try {
    const cargas = await getLoads();
    
    // Asegurar que siempre se devuelva un array
    const cargasArray = Array.isArray(cargas) ? cargas : [];
    
    return res.status(200).json(cargasArray);
  } catch (error) {
    console.error('Error fetching cargas:', error);
    return res.status(500).json({ 
      message: 'Error fetching cargas',
      error: error.message 
    });
  }
});

// Obtener carga por ID
route.get('/api/loads/:id_carga', authenticateJWT, async (req, res) => {
  const { id_carga } = req.params;
  
  // Validar que el ID sea un número
  if (!id_carga || isNaN(id_carga)) {
    return res.status(400).json({ message: 'ID de carga inválido' });
  }
  
  try {
    const carga = await getLoadsById(id_carga);
    
    if (!carga || (Array.isArray(carga) && carga.length === 0)) {
      return res.status(404).json({ message: 'Carga no encontrada' });
    }
    
    // Si es un array, devolver el primer elemento, si no, devolver el objeto
    const cargaData = Array.isArray(carga) ? carga[0] : carga;
    
    return res.status(200).json(cargaData);
  } catch (error) {
    console.error('Error fetching carga:', error);
    return res.status(500).json({ 
      message: 'Error fetching carga',
      error: error.message 
    });
  }
});

// Crear nueva carga
route.post('/api/loads', authenticateJWT, async (req, res) => {
  const { 
    descripcion, 
    peso, 
    foto_carga, 
    fecha_inicio, 
    fecha_fin, 
    vehiculo, 
    cliente, 
    conductor 
  } = req.body;
  
  // Validación de campos requeridos
  if (!descripcion || !peso || !fecha_inicio || !fecha_fin || !cliente) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos: descripcion, peso, fecha_inicio, fecha_fin, cliente' 
    });
  }
  
  // Validar fechas
  const fechaInicio = new Date(fecha_inicio);
  const fechaFin = new Date(fecha_fin);
  
  if (fechaInicio >= fechaFin) {
    return res.status(400).json({ 
      message: 'La fecha de inicio debe ser anterior a la fecha de fin' 
    });
  }
  
  try {
    // Convertir valores vacíos a null
    const cargaData = {
      descripcion: descripcion.trim(),
      peso: peso.trim(),
      foto_carga: foto_carga ? foto_carga.trim() : null,
      fecha_inicio,
      fecha_fin,
      vehiculo: vehiculo ? parseInt(vehiculo) : null,
      cliente: parseInt(cliente),
      conductor: conductor ? parseInt(conductor) : null
    };
    
    const result = await createLoad(
      cargaData.descripcion,
      cargaData.peso,
      cargaData.foto_carga,
      cargaData.fecha_inicio,
      cargaData.fecha_fin,
      cargaData.vehiculo,
      cargaData.cliente,
      cargaData.conductor
    );
    
    return res.status(201).json({
      message: 'Carga creada exitosamente',
      id_carga: result.insertId || result.id
    });
  } catch (error) {
    console.error('Error creating carga:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: 'Cliente, vehículo o conductor no válido' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error creating carga',
      error: error.message 
    });
  }
});

// Actualizar carga
route.put('/api/loads/:id_carga', authenticateJWT, async (req, res) => {
  const { id_carga } = req.params;
  const { 
    descripcion, 
    peso, 
    foto_carga, 
    fecha_inicio, 
    fecha_fin, 
    vehiculo, 
    cliente, 
    conductor 
  } = req.body;
  
  // Validar que el ID sea un número
  if (!id_carga || isNaN(id_carga)) {
    return res.status(400).json({ message: 'ID de carga inválido' });
  }
  
  // Validación de campos requeridos
  if (!descripcion || !peso || !fecha_inicio || !fecha_fin || !cliente) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos: descripcion, peso, fecha_inicio, fecha_fin, cliente' 
    });
  }
  
  // Validar fechas
  const fechaInicio = new Date(fecha_inicio);
  const fechaFin = new Date(fecha_fin);
  
  if (fechaInicio >= fechaFin) {
    return res.status(400).json({ 
      message: 'La fecha de inicio debe ser anterior a la fecha de fin' 
    });
  }
  
  try {
    // Verificar si la carga existe
    const existingCarga = await getLoadsById(id_carga);
    if (!existingCarga || (Array.isArray(existingCarga) && existingCarga.length === 0)) {
      return res.status(404).json({ message: 'Carga no encontrada' });
    }
    
    // Preparar datos para actualización
    const cargaData = {
      descripcion: descripcion.trim(),
      peso: peso.trim(),
      foto_carga: foto_carga ? foto_carga.trim() : null,
      fecha_inicio,
      fecha_fin,
      vehiculo: vehiculo ? parseInt(vehiculo) : null,
      cliente: parseInt(cliente),
      conductor: conductor ? parseInt(conductor) : null
    };
    
    await updateLoad(
      id_carga,
      cargaData.descripcion,
      cargaData.peso,
      cargaData.foto_carga,
      cargaData.fecha_inicio,
      cargaData.fecha_fin,
      cargaData.vehiculo,
      cargaData.cliente,
      cargaData.conductor
    );
    
    return res.status(200).json({ message: 'Carga actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating carga:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        message: 'Cliente, vehículo o conductor no válido' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error updating carga',
      error: error.message 
    });
  }
});

// Eliminar carga
route.delete('/api/loads/:id_carga', authenticateJWT, async (req, res) => {
  const { id_carga } = req.params;
  
  // Validar que el ID sea un número
  if (!id_carga || isNaN(id_carga)) {
    return res.status(400).json({ message: 'ID de carga inválido' });
  }
  
  try {
    // Verificar si la carga existe
    const existingCarga = await getLoadsById(id_carga);
    if (!existingCarga || (Array.isArray(existingCarga) && existingCarga.length === 0)) {
      return res.status(404).json({ message: 'Carga no encontrada' });
    }
    
    await deleteLoad(id_carga);
    return res.status(200).json({ message: 'Carga eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting carga:', error);
    
    // Manejar errores de integridad referencial
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        message: 'No se puede eliminar la carga porque está siendo referenciada por otros registros' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error deleting carga',
      error: error.message 
    });
  }
});

// Obtener cargas por conductor
route.get('/api/loads/driver/:id_conductor', authenticateJWT, async (req, res) => {
  const { id_conductor } = req.params;
  try {
    const cargas = await getLoadsByDriver(id_conductor);
    return res.status(200).json(cargas);
  } catch (error) {
    console.error('Error fetching cargas by driver:', error);
    return res.status(500).json({ message: 'Error fetching cargas by driver' });
  }
});

//obtener ventas

route.get('/api/sales', authenticateJWT, async (req, res) => {
  try {
    const values = await getSales();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales' });
  }
});

//obtener Venta por ID 

route.get('api/sales/:id_venta', authenticateJWT, async (req,res) => {
  const { id_venta } = req.params;
  try {
    const sale = await getSalesById(id_venta);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    return res.status(200).json(sale);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sale' });
  }
});


// crear venta
route.post('/api/sales', authenticateJWT, async (req,res) => {
  const {fecha, valor, descripcion, carga} = req.body;
  try {
    const sale = await createSale(fecha, valor, descripcion, carga);
    return res.status(201).json({ sale });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating sale' });
  }
});


//actualizar venta
route.put('/api/sales/:id_venta', authenticateJWT, async (req,res) => {
  const { id_venta } = req.params;
  const {fecha, valor, descripcion, carga} = req.body;
  try {
    const sale = await updateSale(id_venta, fecha, valor, descripcion, carga);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    return res.status(200).json({ message: 'Sale updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating sale' });
  }
});

// eliminar venta
route.delete('/api/sales/:id_venta', authenticateJWT, async (req,res) => {
  const { id_venta } = req.params;
  try {
    const sale = await deleteSale(id_venta);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    return res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting sale' });
  }
});

// Obtener cargas
route.get('/api/loads', authenticateJWT, async (req, res) => {
  try {
    const cargas = await getLoads();
    // Asegúrate de devolver un array
    res.status(200).json(Array.isArray(cargas) ? cargas : []);
  } catch (error) {
    console.error('Error fetching cargas:', error);
    res.status(500).json({ message: 'Error fetching cargas' });
  }
});

//obtener rutas

route.get('/api/routes', authenticateJWT, async (req,res) => {
  try {
    const values = await getRoutes();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching routes' });
  }
});

//obtener ruta por ID

route.get('/api/routes/:id_ruta', authenticateJWT, async (req,res) => {
  const { id_ruta } = req.params;
  try {
    const route = await getRoutesById(id_ruta);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    return res.status(200).json(route);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching route' });
  }
});

// crear ruta

route.post('/api/routes', async (req,res) => {
  const {origen, destino, distancia, carga} = req.body;
  try {
    const route = await createRoute(origen, destino, distancia, carga);
    return res.status(201).json({ route });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating route' });
  }
});

// actualizar ruta

route.put('/api/routes/:id_ruta', authenticateJWT, async (req,res) => {
  const {id_ruta, origen, destino, distancia, carga} = req.body;
  try {
    const route = await updateRoute(id_ruta, origen, destino, distancia, carga);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    return res.status(200).json({ message: 'Route updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating route' });
  }
});

// eliminar ruta

route.delete('/api/routes/:id_ruta',  async (req,res) => {
  const { id_ruta } = req.params;
  try {
    const route = await deleteRoute(id_ruta);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    return res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting route' });
  }
});


//obtener reporte

route.get('/api/reports', async (req,res) => {
  try {
    const values = await getStateVehicles();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching States' });
  }
});

//obtener reporte por ID

route.get('/api/reports/:id_estado', async (req,res) => {
  const { id_estado } = req.params;
  try {
    const route = await getStateVehiclesById(id_estado);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    return res.status(200).json(route);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching State' });
  }
});

// crear reporte

route.post('/api/reports', async (req,res) => {
  const {descripcion, foto, tipo_estado, tipo_reporte} = req.body;
  try {
    const route = await createStateVehicle(descripcion, foto, tipo_estado, tipo_reporte);
    return res.status(201).json({ route });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating State' });
  }
});

// actualizar reporte

route.put('/api/reports/:id_estado', async (req,res) => {
  const {id_estado, descripcion, foto, tipo_estado, tipo_reporte} = req.body;
  try {
    const route = await updateStateVehicle(id_estado, descripcion, foto, tipo_estado, tipo_reporte);
    if (!route) {
      return res.status(404).json({ message: 'State not found' });
    }
    return res.status(200).json({ message: 'State updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating State' });
  }
});

// eliminar reporte

route.delete('/api/reports/:id_estado', async (req,res) => {
  const { id_estado } = req.params;
  try {
    const route = await deleteStateVehicle(id_estado);
    if (!route) {
      return res.status(404).json({ message: 'State not found' });
    }
    return res.status(200).json({ message: 'State deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting state' });
  }
});


// Registro de usuario
// route.post('/api/register', [
//     body('email_usuario').isString().notEmpty(),
//     body('contraseña').isLength({ min: 6 })
//   ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     const { email_usuario, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
  
//     try {
//       await pool.query('INSERT INTO Usuarios (email_usuario, contraseña) VALUES (?, ?)', [email_usuario, hashedPassword]);
//       res.status(201).send('User  registered');
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error registering user' });
//     }
// });


module.exports = route;