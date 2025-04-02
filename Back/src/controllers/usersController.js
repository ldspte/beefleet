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



module.exports = {
    getUsers,
    getUsersById
}