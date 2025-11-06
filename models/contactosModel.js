const { pool } = require('../config/db');

// === Helpers ===
// Convierte true/false a 1/0 para columnas TINYINT(1)
const toTinyInt = (v) => (v ? 1 : 0);

// Obtener TODOS los contactos
async function getAllContactosModel() {
  const [rows] = await pool.query(
    `SELECT contacto_id, nombre, apellidos, telefono, email, direccion, ciudad, favorito
       FROM contactos
     ORDER BY nombre`
  );
  return rows;
}

// Obtener un contacto por ID
async function getContactoById(contactoId) {
  const [rows] = await pool.query(
    `SELECT contacto_id, nombre, apellidos, telefono, email, direccion, ciudad, favorito
       FROM contactos
      WHERE contacto_id = ?`,
    [contactoId]
  );
  return rows[0] || null;
}

// Agregar contacto
async function agregarContactoModel({ nombre, apellidos, telefono, email, direccion, ciudad, favorito }) {
  const fav = toTinyInt(favorito);
  await pool.query(
    `INSERT INTO contactos (nombre, apellidos, telefono, email, direccion, ciudad, favorito)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellidos, telefono, email, direccion, ciudad, fav]
  );
}

// Editar contacto
async function editarContactoModel(contactoId, datosActualizados) {
  const { nombre, apellidos, telefono, email, direccion, ciudad, favorito } = datosActualizados;
  const fav = toTinyInt(favorito);
  await pool.query(
    `UPDATE contactos
        SET nombre   = ?,
            apellidos= ?,
            telefono = ?,
            email    = ?,
            direccion= ?,
            ciudad   = ?,
            favorito = ?
      WHERE contacto_id = ?`,
    [nombre, apellidos, telefono, email, direccion, ciudad, fav, contactoId]
  );
}

// Eliminar 1
async function eliminarContactoModel(contactoId) {
  await pool.query('DELETE FROM contactos WHERE contacto_id = ?', [contactoId]);
}

// Eliminar todos
async function eliminarTodosLosContactosModel() {
  await pool.query('DELETE FROM contactos');
}

// Buscar por nombre 
async function buscarContactoPorNombreModel(nombre) {
  const [rows] = await pool.query(
    `SELECT contacto_id, nombre, apellidos, telefono, email, direccion, ciudad, favorito
       FROM contactos
      WHERE nombre LIKE ?`,
    [`%${nombre}%`]
  );
  return rows;
}

// Ordenar por criterio 
async function ordenarContactosModel(criterio) {
  const map = { nombre: 'nombre', apellidos: 'apellidos', ciudad: 'ciudad' };
  const col = map[(criterio || '').toLowerCase()];
  if (!col) {
    // Fallback: por nombre
    return getAllContactosModel();
  }
  const [rows] = await pool.query(
    `SELECT contacto_id, nombre, apellidos, telefono, email, direccion, ciudad, favorito
       FROM contactos
     ORDER BY ${col}`
  );
  return rows;
}

// Solo favoritos
async function getFavoritosModel() {
  const [rows] = await pool.query(
    `SELECT contacto_id, nombre, apellidos, telefono, email, direccion, ciudad, favorito
       FROM contactos
      WHERE favorito = 1
     ORDER BY nombre`
  );
  return rows;
}

module.exports = {
  getAllContactosModel,
  getContactoById,
  agregarContactoModel,
  editarContactoModel,
  eliminarContactoModel,
  eliminarTodosLosContactosModel,
  buscarContactoPorNombreModel,
  ordenarContactosModel,
  getFavoritosModel,
};
