const db = require('../db');


const getUsers = async() => {
    const [files] = await db.query(
      'SELECT * FROM Usuarios'
    );
    return files;
}

const getUsersById = async(id) => {
    const [files] = await db.query(
      'SELECT * FROM Usuarios WHERE id_usuario = ?',
      [id]
    );
    return files[0];
}

const createUser = async(user) => {
    const [result] = await db.query(
      'INSERT INTO Usuarios (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
      [user.nombre, user.apellido, user.email, user.telefono]
    );
    return result.insertId;
}



module.exports = {
    getUsers,
    getUsersById
}