const express = require('express');
const route = express.Router();
const { body, validationResult } = require('express-validator');
const {db} = require('../database'); // Asegúrate de tener tu pool de conexiones configurado
const SECRET_KEY = process.env.SECRET_KEY || 'lossimpsom';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDrivers, getDriversById, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const {getClients, getClientsById, createClient, updateClient, deleteClient} = require('../controllers/clientController');
const {getUsers, getUsersById, createUser, updateUser} = require('../controllers/usersController');
const {getSales, getSalesById, createSale, updateSale, deleteSale} = require('../controllers/saleController');
const {getRoutes, getRoutesById, createRoute, updateRoute, deleteRoute} = require('../controllers/routeController');
const {getVehicles, getVehiclesById, createVehicle, updateVehicle, deleteVehicle} = require('../controllers/vehicleController');


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
    const token = jwt.sign({ id: user[0].id_conductor }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});
  // Middleware para proteger rutas
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
  
  // Ruta protegida
route.get('/api/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});
  
  // Ruta de prueba para verificar conexión a la base de datos
route.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT 1'); // Simple consulta para verificar la conexión
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error connecting to database' });
    }
});


// Obtener todos los conductores

route.get('/api/drivers', async (req,res) => {
  try {
    const values = await getDrivers();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
})

// crear un conductor

route.post('/api/drivers', async (req,res) => {
  const {tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion } = req.body;
  try {
    const driver = await createDriver(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion);
    return res.status(201).json({ driver });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating driver' });
  }
});

// Buscar por id conductor

route.get('/api/drivers/:id', async (req,res) => {
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

route.put('/api/drivers/:id', async (req,res) => {
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
route.delete('/api/drivers/:id', async (req,res) => {
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


//rutas de vehiculos

// Obtener todos los vehiculos

route.get('/api/vehicles', async (req,res) => {
  try {
    const values = await getVehicles();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
})

// Obtener vehiculo por ID 

route.get('/api/vehicles/:id', async(req,res)=>{
  try {
    const id_vehiculo = req.params;
    const vehiculo = await getVehiclesById(id_vehiculo);
    if(!vehiculo){
      return res.status(404).json({ message: 'Vehicles not found' });
    }
    return res.status(200).json(vehiculo);
  } catch (error) {
    
  }
})






module.exports = route;