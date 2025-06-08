const {db} = require('../database.js');

const getClients = async() => {
  console.log('=== getClients controller called ===');
  try {
    const query = 'SELECT * FROM clientes';
    console.log('Executing query:', query);
    
    const results = await db.query(query);
    console.log('Query results:', results);
    console.log('Results type:', typeof results);
    console.log('Is array:', Array.isArray(results));
    console.log('Results length:', results?.length);
    
    // Log first result if exists
    if (results && results.length > 0) {
      console.log('First result:', results[0]);
    }
    
    return results;
  } catch (error) {
    console.error('Error in getClients controller:', error);
    throw error;
  }
}

const getClientsById = async(id_cliente) => {
  console.log('=== getClientsById called with id:', id_cliente);
  try {
    const result = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    );
    console.log('getClientsById result:', result);
    return result;
  } catch (error) {
    console.error('Error in getClientsById:', error);
    throw error;
  }
}

const createClient = async(nit, direccion, ciudad, telefono, empresa) => {
  console.log('=== createClient called with:', { nit, direccion, ciudad, telefono, empresa });
  try {
    const result = await db.query(
      'INSERT INTO clientes (nit, direccion, ciudad, telefono, empresa) VALUES (?, ?, ?, ?, ?)',
      [nit, direccion, ciudad, telefono, empresa]
    );
    console.log('createClient result:', result);
    return result;
  } catch (error) {
    console.error('Error in createClient:', error);
    throw error;
  }
}

const updateClient = async(id_cliente, nit, direccion, ciudad, telefono, empresa) => {
  console.log('=== updateClient called with:', { id_cliente, nit, direccion, ciudad, telefono, empresa });
  try {
    const result = await db.query(
      'UPDATE clientes SET nit = ?, direccion = ?, ciudad = ?, telefono = ?, empresa = ? WHERE id_cliente = ?',
      [nit, direccion, ciudad, telefono, empresa, id_cliente]
    );
    console.log('updateClient result:', result);
    return result;
  } catch (error) {
    console.error('Error in updateClient:', error);
    throw error;
  }
}

const deleteClient = async(id_cliente) => {
  console.log('=== deleteClient called with id:', id_cliente);
  try {
    const result = await db.query(
      'DELETE FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    );
    console.log('deleteClient result:', result);
    return result;
  } catch (error) {
    console.error('Error in deleteClient:', error);
    throw error;
  }
}

module.exports = {
  getClients,
  getClientsById,
  createClient,
  updateClient,
  deleteClient
}