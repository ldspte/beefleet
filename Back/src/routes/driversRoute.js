const express = require('express');
const router = express.Router();
const { getDrivers, getDriversById, addDriver, deleteDriver, updateDriver} = require('../controllers/driversControllers');

// Obtener todos los clientes
router.get('/drivers', async(req,res)=>{
    try {
        const values = getDrivers();
        return res.status(200).json(values)
    } catch (error) {
        return res.status(404).send(error.message);
    }
});

// Crear un nuevo cliente
router.post('/drivers/:id', async(req,res) =>{
    try {
        const {nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic} = req.body;
        const values = addDriver(nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic)
        return res.status(200).json(values);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// Actualizar un cliente
router.put('/drivers/:id', async(req,res) =>{
    try {
        const {nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic} = req.body
        const values = updateDriver(nombre_conductor, apellido_conductor, correo_coductor, foto, telefono, ciudad, direccion, tipo_licencia, fecha_vencimiento_lic)
        return res.status(200).json(values)
    } catch (error) {
        
    }
});
    

// Eliminar un cliente
router.put('/drivers/delete/:id');

module.exports = router;