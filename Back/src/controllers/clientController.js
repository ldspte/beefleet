const db = require('../database.js');

const getClients = async() => {
  const results = await db.query(`
    SELECT * FROM clientes  
  `)
  return results;
}

const getClientsById = async(id_cliente) => {
    const result = await db.query(`
        SELECT * FROM clientes WHERE id_cliente = ?
    `,
    [id_cliente]
    );
    return result;
}

const createClient = async(tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa) => {
    const result = await db.query(`
        INSERT INTO clientes (tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa) VALUES  (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa]
    );
    return result;
}

const updateClient = async(id_cliente, tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa) => {
    const result = await db.query(`
        UPDATE clientes SET tipo_documento = ?, documento = ?, nombre_cliente = ?, apellido_cliente = ?, direccion = ?, ciudad = ?, telefono = ?, empresa = ? WHERE id_cliente = ?
    `,
    [tipo_documento, documento, nombre_cliente, apellido_cliente, direccion, ciudad, telefono, empresa, id_cliente]
    );
    return result;
}

const deleteClient = async(id_cliente) => {
    const result = await db.query(`
        DELETE FROM clientes WHERE id_cliente = ?
    `,
    [id_cliente]
    );
    return result;
}


module.exports = {
  getClients,
  getClientsById,
  createClient,
  updateClient,
  deleteClient
}
