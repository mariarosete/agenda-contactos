require('dotenv').config();
const { pool } = require('../config/db');

async function main() {
  
  // 1) Crear tabla si no existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contactos (
      contacto_id INT AUTO_INCREMENT PRIMARY KEY,
      nombre      VARCHAR(80)  NOT NULL,
      apellidos   VARCHAR(120) NOT NULL,
      telefono    VARCHAR(30)  NOT NULL,
      email       VARCHAR(120) NOT NULL,
      direccion   VARCHAR(160) NOT NULL,
      ciudad      VARCHAR(80)  NOT NULL,
      favorito    TINYINT(1)   NOT NULL DEFAULT 0,
      UNIQUE KEY uk_contactos_telefono (telefono),
      UNIQUE KEY uk_contactos_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);


  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM contactos`);
  if (total > 0) {
    console.log(`Ya hay ${total} contactos, no se inserto los datos de ejemplo.`);
    process.exit(0);
  }

  // 3) Insertar datos de ejemplo
  const data = [
    ['Adrián', 'Vega Rodríguez', '653127859', 'adrian@hotmail.com', 'Calle La Pipa', 'Oviedo', 0],
    ['Carlos', 'Martínez Sánchez', '655666777', 'carlos@example.com', 'Calle Principal', 'Avilés', 0],
    ['Jesús', 'Muñiz Alonso', '653704998', 'jesus@hotmail.com', 'Avenida 124', 'Murcia', 0],
    ['Tania', 'Fernández Fernández', '985635986', 'tania@gmail.com', 'Calle Principal', 'Avilés', 1],
    ['Raquel', 'Suárez Pérez', '689635147', 'raquel@gmail.com', 'Avenida 789', 'Oviedo', 0],
    ['Pili', 'Suárez Suárez', '985632585', 'pili@gmail.com', 'Menéndez Valdés', 'Gijón', 0],
    ['Pepe', 'Álvarez Rodríguez', '985632595', 'pepe@hotmail.com', 'Calle avenida', 'Luarca', 0],
    
  ];

  await pool.query(
    `INSERT INTO contactos (nombre, apellidos, telefono, email, direccion, ciudad, favorito)
     VALUES ?`,
    [data]
  );

  console.log(` Insertados ${data.length} contactos de ejemplo.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error en contactos:', err);
  process.exit(1);
});
