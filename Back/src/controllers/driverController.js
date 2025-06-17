const {db} = require('../database.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendPasswordEmail = async (correo_conductor, password, nombre_conductor, apellido_conductor) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    auth: {
      user: process.env.MAIL, 
      pass: process.env.PASSWORD 
    }
  });

  const mailOptions = {
    from: 'beefleet25@gmail.com', 
    to: correo_conductor, 
    subject: 'Bienvenido a Beefleet', 
    text: `Hola ${nombre_conductor} ${apellido_conductor}, tu contraseña por defecto es: ${password}`, 
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Beefleet</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ff6b35, #ff8c42); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
              🚛 Beefleet
            </h1>
            <p style="color: #fff3e6; font-size: 18px; margin: 10px 0 0 0;">
              Sistema de Gestión de Conductores
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #d84315; font-size: 24px; margin-bottom: 20px;">
              ¡Bienvenido a bordo, ${nombre_conductor} ${apellido_conductor}!
            </h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Nos complace informarte que tu cuenta ha sido creada exitosamente en nuestro sistema. 
              A continuación encontrarás tus credenciales de acceso:
            </p>

            <!-- Credentials Box -->
            <div style="background: linear-gradient(135deg, #fff3e6, #ffe0cc); border: 2px solid #ff6b35; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
              <h3 style="color: #d84315; margin: 0 0 15px 0; font-size: 18px;">
                🔑 Credenciales de Acceso
              </h3>
              <p style="color: #666; margin: 5px 0;">
                <strong>Email:</strong> ${correo_conductor}
              </p>
              <p style="color: #666; margin: 5px 0 15px 0;">
                <strong>Contraseña temporal:</strong>
              </p>
              <div style="background-color: #ff6b35; color: white; padding: 12px 20px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 1px;">
                ${password}
              </div>
            </div>

            <!-- Important Notice -->
            <div style="background-color: #ffab91; border-left: 4px solid #ff5722; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #d84315; margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Por motivos de seguridad, te recomendamos cambiar esta contraseña temporal en tu primer inicio de sesión.
              </p>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Si tienes alguna pregunta o necesitas asistencia, no dudes en contactar a nuestro equipo de soporte.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: linear-gradient(135deg, #ff6b35, #ff5722); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); transition: all 0.3s ease;">
                Iniciar Sesión
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #ff8c42; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              © 2024 Beefleet - Sistema de Gestión de Conductores
            </p>
            <p style="color: #fff3e6; margin: 5px 0 0 0; font-size: 12px;">
              Este es un correo automático, por favor no responder directamente.
            </p>
          </div>
        </div>
      </body>
      </html>
    ` 
  };

  // Envía el correo
  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

function generatePassword(longitud=10) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      password += caracteres[indice];
  }
  return password;
}

const getDrivers = async() => {
  const results = await db.query(`
    SELECT * FROM Conductores  
  `)
  return results.length > 0 ? results[0] : null;
}

const getDriversById = async(id_conductor) => {
  const result = await db.query(`
    SELECT * FROM conductores WHERE id_conductor = ?
  `,
  [id_conductor]
  );
  return result.length > 0 ? result[0] : null;
}

const createDriver = async(tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia, estado) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(`
    INSERT INTO conductores (tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, contraseña, direccion, tipo_licencia, fecha_vencimiento, experiencia, estado) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, hashedPassword, direccion, tipo_licencia, fecha_vencimiento, experiencia, estado]
  );
  // Función actualizada con nombre y apellido
  await sendPasswordEmail(correo_conductor, password, nombre_conductor, apellido_conductor);
  return result;
}

const updateDriver = async(id_conductor, tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia, estado) => {
  const result = await db.query(`
    UPDATE Conductores SET tipo_documento = ?, documento = ?, nombre_conductor = ?, apellido_conductor = ?, correo_conductor = ?, foto = ?, telefono = ?, ciudad = ? , direccion = ? , tipo_licencia = ?, fecha_vencimiento = ?, experiencia = ?, estado = ?  WHERE id_conductor = ?
  `,
  [tipo_documento, documento, nombre_conductor, apellido_conductor, correo_conductor, foto, telefono, ciudad, direccion,  tipo_licencia, fecha_vencimiento, experiencia, estado, id_conductor]
  );
  return result;
}

const deleteDriver = async(id_conductor) => {
  const result = await db.query(`
    DELETE FROM Conductores WHERE id_conductor = ?
  `,
  [id_conductor]
  );
  return result;
}

const newpasswordDriver = async(email_conductor, contraseña) => {
  const [result] = await db.query(
    'UPDATE Conductores SET contraseña = ? WHERE correo_conductor = ?',
    [contraseña, email_conductor]
  );
  return result;
}

const updateStateDriver = async( estadoConductor , id_conductor) =>{
  const [result] = await db.query(
    'UPDATE Conductores SET estado = ? WHERE id_conductor = ?',
    [estadoConductor, id_conductor]
  );
  return result;
}

const activeDriver = async() =>{
  const [results] = await db.query(
    'SELECT * FROM conductores WHERE estado = Activo'
  )
  return results.length > 0 ? results[0] : null;
}

module.exports = {
  getDrivers,
  getDriversById,
  createDriver,
  updateDriver,
  deleteDriver,
  newpasswordDriver,
  activeDriver,
  updateStateDriver
}