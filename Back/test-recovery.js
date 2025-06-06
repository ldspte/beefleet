const http = require('http');

function makeRequest(hostname, port, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function testRecovery() {
  console.log('🧪 Probando recuperación de contraseña...\n');
  
  const hostname = 'localhost'; // Cambia por tu IP si es necesario
  const port = 3001;
  
  try {
    // Prueba 1: Email válido
    console.log('📧 Prueba 1: Email válido');
    const result1 = await makeRequest(hostname, port, '/forgot-password', {
      email: 'test@example.com'
    });
    console.log(`✅ Status: ${result1.status}`);
    console.log('✅ Resultado:', result1.data);
    console.log('');
    
    // Prueba 2: Email inválido
    console.log('📧 Prueba 2: Email inválido');
    const result2 = await makeRequest(hostname, port, '/forgot-password', {
      email: 'email-invalido'
    });
    console.log(`❌ Status: ${result2.status}`);
    console.log('❌ Resultado:', result2.data);
    console.log('');
    
    // Prueba 3: Email vacío
    console.log('📧 Prueba 3: Email vacío');
    const result3 = await makeRequest(hostname, port, '/forgot-password', {
      email: ''
    });
    console.log(`❌ Status: ${result3.status}`);
    console.log('❌ Resultado:', result3.data);
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('- Verifica que el servidor esté corriendo en puerto 3001');
    console.log('- Ejecuta: node server.js');
    console.log('- Cambia hostname por tu IP si usas dispositivo físico');
  }
}

// Ejecutar pruebas
testRecovery();