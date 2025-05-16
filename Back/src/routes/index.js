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
    const token = jwt.sign({ id: user[0].id_conductor }, SECRET_KEY, { expiresIn: '1h' });
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

route.get('/api/drivers/:id_conductor', async (req,res) => {
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
route.delete('/api/drivers/:id', authenticateJWT, async (req,res) => {
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




//rutas de vehiculos

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

route.get('/api/vehicles/:id', authenticateJWT, async(req,res)=>{
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


// Crear vehiculo

route.post('/api/vehicles', authenticateJWT,  async (req,res) => {
  const {placa, modelo, peso, matricula, seguro, estado_vehiculo} = req.body;
  try {
    const vehicle = await createVehicle(placa, modelo, peso, matricula, seguro, estado_vehiculo);
    return res.status(201).json({ vehicle });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating vehicle' });
  }
});

// Actualizar vehiculo

route.put('/api/vehicles/:id', authenticateJWT, async (req,res) => {
  const { id_vehiculo } = req.params;
  const {placa, modelo, peso, matricula, seguro, estado_vehiculo} = req.body;
  try {
    const vehicle = await updateVehicle(id_vehiculo, placa, modelo, peso, matricula, seguro, estado_vehiculo);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating vehicle' });
  }
});
// eliminar vehiculo

route.delete('/api/vehicles/:id', authenticateJWT, async (req,res) => {
  const { id_vehiculo } = req.params;
  try {
    const vehicle = await deleteVehicle(id_vehiculo);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting vehicle' });
  }
});


//obtener Clientes
route.get('/api/clients', authenticateJWT, async (req,res) => {
  try {
    const values = await getClients();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching clients' });
  }
});


// obtener cliente por ID
route.get('/api/clients/:id', authenticateJWT, async (req,res) => {
  const { id_cliente } = req.params;
  try {
    const client = await getClientsById(id_cliente);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching client' });
  }
});

// crear cliente

route.post('/api/clients', authenticateJWT, async (req,res) => {
  const {tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa} = req.body;
  try {
    const client = await createClient(tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa);
    return res.status(201).json({ client });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating client' });
  }
});
// actualizar cliente

route.put('/api/clients/:id', authenticateJWT, async (req,res) => {
  const { id_cliente } = req.params;
  const {tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa} = req.body;
  try {
    const client = await updateClient(id_cliente, tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating client' });
  }
});
// eliminar cliente

route.delete('/api/clients/:id', authenticateJWT, async (req,res) => {
  const { id_cliente } = req.params;
  try {
    const client = await deleteClient(id_cliente);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting client' });
  }
});


//obtener ventas

route.get('api/sales', authenticateJWT, async (req,res) => {
  try {
    const values = await getSales();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales' });
  }
});

//obtener Venta por ID 

route.get('api/sales/:id', authenticateJWT, async (req,res) => {
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

route.put('/api/sales/:id', authenticateJWT, async (req,res) => {
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
route.delete('/api/sales/:id', authenticateJWT, async (req,res) => {
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

route.get('/api/routes/:id', authenticateJWT, async (req,res) => {
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

route.post('/api/routes', authenticateJWT, async (req,res) => {
  const {origen, destino, distancia, carga} = req.body;
  try {
    const route = await createRoute(origen, destino, distancia, carga);
    return res.status(201).json({ route });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating route' });
  }
});

// actualizar ruta

route.put('/api/routes/:id', authenticateJWT, async (req,res) => {
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

route.delete('/api/routes/:id', authenticateJWT, async (req,res) => {
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

//Obtener Cargas Por conductor

route.get('/api/loads/:id_conductor', authenticateJWT, async (req,res) => {
  const { id_conductor } = req.params;
  try {
    const values = await getLoadsByDriver(id_conductor);
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching loads' });
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