const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // NUEVO
const crypto = require('crypto');         // NUEVO

const app = express();
const route = require('./routes/index');

// Configurar Gmail con tu App Password - NUEVO
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'michelleoa1516@gmail.com',      // Tu email
    pass: 'mglw axsk rqog qjvu' // Cambia por tu App Password
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

app.use(cors());
app.use(express.json());

// NUEVA RUTA para recuperar contraseña
app.post('/forgot-password', async (req, res) => {
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
app.get('/reset-password/:token', (req, res) => {
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
app.post('/reset-password/:token', (req, res) => {
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

// Tus rutas existentes
app.use('/', route);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('🚀 Server listening on port 3001');
  console.log('📧 Endpoint de recuperación: http://localhost:3001/forgot-password');
  
  const contraseña = 'hola123';
  const hashpassword = bcrypt.hashSync(contraseña, 10);
  console.log('🔑 Hash de prueba:', hashpassword);
});

module.exports = app;