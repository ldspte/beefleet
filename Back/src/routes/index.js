const express = require('express');
const route = express.Router();
const { body, validationResult } = require('express-validator');
const {db} = require('../database'); // Asegúrate de tener tu pool de conexiones configurado
const SECRET_KEY = process.env.SECRET_KEY || 'lossimpsom';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
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
  try {
    const values = await getDrivers();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
})

// crear un conductor

route.post('/api/drivers',  async (req,res) => {
  const {tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia, estado} = req.body;
  try {
    const driver = await createDriver(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia, estado);
    return res.status(201).json({ driver });
  } catch (error) {
    console.error('Error creating driver:', error); // Log del error
    return res.status(500).json({ message: 'Error creating driver', error: error.message });
  }
});


//contraseña por defecto 
// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//       user: 'ldspte9807@gmail.com',
//       pass: 'lossimpsom123' 
//   }
// });

// route.post('/api/send-password', (req, res) => {
//   const { correo_conductor, contraseña } = req.body;

//   const mailOptions = {
//       from: 'ldspte9807@gmail.com',
//       to: correo_conductor,
//       subject: 'Bienvenido a Beeflet',
//       text: `Se ha creado tu cuenta en Beefleet y Tu contraseña es: ${contraseña}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return res.status(500).send(error.toString());
//       }
//       res.status(200).send('Correo enviado: ' + info.response);
//   });
// });

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

route.get('/api/admin/:id_usuario',  async (req,res) => {
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

route.get('/api/vehicles',  async (req,res) => {
  try {
    const values = await getVehicles();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching drivers' });
  }
})

// Obtener vehiculo por ID 

route.get('/api/vehicles/:id_vehiculo', async(req,res)=>{
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



route.post('/api/vehicles', async (req,res) => {
  const {placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor} = req.body;
  try {
    const vehicle = await createVehicle(placa, modelo, peso, matricula, seguro, estado_vehiculo, conductor);
    return res.status(201).json({ vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return res.status(500).json({ message: 'Error creating vehicle' });
  }
});

// Actualizar vehiculo

route.put('/api/vehicles/:id_vehiculo', async (req,res) => {
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

route.delete('/api/vehicles/:id_vehiculo', async (req,res) => {
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
route.get('/api/clients', authenticateJWT, async (req,res) => {
  try {
    const values = await getClients();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching clients' });
  }
});


// obtener cliente por ID
route.get('/api/clients/:id_cliente', async (req,res) => {
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

route.post('/api/clients', async (req,res) => {
  const {tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa} = req.body;
  try {
    const client = await createClient(tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa);
    return res.status(201).json({ client });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating client' });
  }
});
// actualizar cliente

route.put('/api/clients/:id_cliente', async (req,res) => {
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

route.delete('/api/clients/:id_cliente',  async (req,res) => {
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

route.get('api/sales',  async (req,res) => {
  try {
    const values = await getSales();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sales' });
  }
});

//obtener Venta por ID 

route.get('api/sales/:id_venta',  async (req,res) => {
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


route.post('/api/sales', async (req,res) => {
  const {fecha, valor, descripcion, carga} = req.body;
  try {
    const sale = await createSale(fecha, valor, descripcion, carga);
    return res.status(201).json({ sale });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating sale' });
  }
});


//actualizar venta

route.put('/api/sales/:id_venta',  async (req,res) => {
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
route.delete('/api/sales/:id_venta', async (req,res) => {
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

route.get('/api/routes/:id_ruta', async (req,res) => {
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

route.put('/api/routes/:id_ruta', async (req,res) => {
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

//Obtener Cargas Por conductor

route.get('/api/loads/:id_conductor', async (req,res) => {
  const { id_conductor } = req.params;
  try {
    const values = await getLoadsByDriver(id_conductor);
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching loads' });
  }
});

//obtener reportes

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


//obtener cargas

route.get('/api/loads', async (req,res) => {
  try {
    const values = await getLoads();
    return res.status(200).json(values);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Loads' });
  }
});

//obtener carga por ID

route.get('/api/loads/:id_carga', async (req,res) => {
  const { id_carga } = req.params;
  try {
    const route = await getLoadsById(id_carga);
    if (!route) {
      return res.status(404).json({ message: 'Load not found' });
    }
    return res.status(200).json(route);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Load' });
  }
});

// crear reporte

route.post('/api/loads', async (req,res) => {
  const {descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, conductor} = req.body;
  try {
    const route = await createLoad(descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, conductor);
    return res.status(201).json({ route });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating Load' });
  }
});

// actualizar carga

route.put('/api/loads/:id_carga', async (req,res) => {
  const {id_carga, descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, conductor} = req.body;
  try {
    const route = await updateLoad(id_carga, descripcion, peso, foto_carga, fecha_inicio, fecha_fin, vehiculo, cliente, conductor);
    if (!route) {
      return res.status(404).json({ message: 'Load not found' });
    }
    return res.status(200).json({ message: 'Load updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating Load' });
  }
});

// eliminar carga

route.delete('/apiloads/:id_carga', async (req,res) => {
  const { id_carga } = req.params;
  try {
    const route = await deleteLoad(id_carga);
    if (!route) {
      return res.status(404).json({ message: 'load not found' });
    }
    return res.status(200).json({ message: 'load deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting load' });
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


// Configurar Gmail con tu App Password - NUEVO
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.MAIL, 
    pass: process.env.PASSWORD 
  }
});

// Verificar conexión con Gmail - NUEVO
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error configurando Gmail:', error);
  } else {
    console.log('✅ Gmail configurado correctamente');
  }
});

// Almacenar tokens temporalmente - NUEVO (en producción usar BD)
const resetTokens = new Map();


// NUEVA RUTA para recuperar contraseña
route.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  console.log('📧 Solicitud de recuperación para:', email);
  
  try {
    // Aquí deberías verificar si el usuario existe en tu BD
    // Por ahora simulamos que existe
    const usuarioExiste = true; // Reemplaza con tu lógica de BD
    
    if (!usuarioExiste) {
      return res.status(404).json({ 
        success: false, 
        message: 'No encontramos una cuenta con ese correo electrónico' 
      });
    }
    
    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 3600000; // 1 hora
    
    // Guardar token
    resetTokens.set(resetToken, {
      email: email.toLowerCase(),
      expires: tokenExpiry,
      used: false
    });
    
    // URL para restablecer
    const resetLink = `http://localhost:3001/reset-password/${resetToken}`;
    
    // Configurar email
    const mailOptions = {
      from: '"Mi App Móvil" <michelleandrea217@gmail.com>',
      to: email,
      subject: '🔐 Restablecer contraseña - Beefleet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #FB8500; margin: 0; font-size: 28px;">🔐 Restablecer Contraseña</h1>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hola,<br><br>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #FB8500; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 25px; font-weight: bold; 
                        font-size: 16px; display: inline-block;">
                ✨ Restablecer mi contraseña
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              O copia este enlace: ${resetLink}
            </p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⚠️ <strong>Importante:</strong> Este enlace expira en 1 hora.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Si no solicitaste esto, ignora este correo.
            </p>
            
          </div>
        </div>
      `
    };
    
    // Enviar email
    await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado a:', email);
    
    res.json({ 
      success: true, 
      message: 'Correo de recuperación enviado exitosamente' 
    });
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el correo' 
    });
  }
});

// NUEVA RUTA para manejar el enlace (cuando hacen click)
route.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const tokenData = resetTokens.get(token);
  
  if (!tokenData || Date.now() > tokenData.expires || tokenData.used) {
    return res.send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2 style="color: #e74c3c;">❌ Enlace inválido o expirado</h2>
          <p>Este enlace no es válido, ya fue usado o expiró.</p>
        </body>
      </html>
    `);
  }
  
  // Mostrar formulario para nueva contraseña
  res.send(`
    <html>
      <head>
        <title>Restablecer Contraseña</title>
        <style>
          body { font-family: Arial; max-width: 400px; margin: 50px auto; padding: 20px; }
          input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
          button { background-color: #FB8500; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%; }
        </style>
      </head>
      <body>
        <h2 style="color: #FB8500; text-align: center;">🔐 Nueva Contraseña</h2>
        <form action="/reset-password/${token}" method="POST">
          <input type="password" name="password" placeholder="Nueva contraseña" required minlength="6">
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" required minlength="6">
          <button type="submit">Actualizar contraseña</button>
        </form>
      </body>
    </html>
  `);
});

// NUEVA RUTA para procesar la nueva contraseña
route.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  
  const tokenData = resetTokens.get(token);
  
  if (!tokenData || Date.now() > tokenData.expires || tokenData.used) {
    return res.send('<h2>❌ Error: Enlace inválido o expirado</h2>');
  }
  
  if (password !== confirmPassword) {
    return res.send('<h2>❌ Error: Las contraseñas no coinciden</h2>');
  }
  
  // Marcar token como usado
  tokenData.used = true;
  resetTokens.set(token, tokenData);
  
  // Aquí actualizarías la contraseña en tu base de datos
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(`🔑 Nueva contraseña para ${tokenData.email}:`, hashedPassword);
  
  res.send(`
    <html>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h2 style="color: #27ae60;">✅ ¡Contraseña actualizada!</h2>
        <p>Tu contraseña ha sido actualizada exitosamente.</p>
        <p>Ya puedes iniciar sesión en la app.</p>
      </body>
    </html>
  `);
});


module.exports = route;