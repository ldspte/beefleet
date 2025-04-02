const express = require('express');
const router = express.Router();
const { getUser, getusersById } = require('../controllers/usersController');

// Obtener todos los clientes
router.get('/', getUser);

// Crear un nuevo cliente
router.post('/:id', createUser);

// Actualizar un cliente
router.put('/:id', updateUser);

// Eliminar un cliente
router.delete('/:id', deleteUser);

module.exports = router;