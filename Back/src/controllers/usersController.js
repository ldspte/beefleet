const {db} = require('../database');

function generatePassword(longitud=10) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        password += caracteres[indice];
    }
    return password;
}

const getUsers = async() => {
    const [result] = await db.query(
      'SELECT * FROM Usuarios'
    );
    return result.length > 0 ? result[0] : null;
}

const getUsersById = async(id_usuario) => {
    const result = await db.query(`
    SELECT * FROM Usuarios WHERE id_usuario = ?
  `,
  [id_usuario]
  );
 return result[0].length > 0 ? result[0][0] : null;
}

const createUser = async(nombre_usuario, apellido_usuario, correo_usuario) => {
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Usuarios (nombre_usuario, apellido_usuario, correo_usuario) VALUES (?, ?, ?, ?)',
      [nombre_usuario, apellido_usuario, correo_usuario, hashedPassword]
    );
    return result.insertId;
}

const updateUser = async(id_usuario, nombre_usuario, apellido_usuario, correo_usuario) => {
    const [result] = await db.query(
      'UPDATE Usuarios SET nombre_usuario = ?, apellido_usuario = ?, email_usuario = ? WHERE id_usuario = ?',
      [nombre_usuario, apellido_usuario, correo_usuario, id_usuario]
    );
    return result.affectedRows > 0;
}

module.exports = {
    getUsers,
    getUsersById,
    createUser,
    updateUser
}