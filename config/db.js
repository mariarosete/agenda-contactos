const mysql = require('mysql2/promise');
require('dotenv').config(); // Lee variables desde .env

// Comprobamos que las variables existen
const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Falta la variable ${k} en .env`);
}

// Pool de conexiones 
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,                
  connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
  queueLimit: 0,                            
});

module.exports = { pool };
