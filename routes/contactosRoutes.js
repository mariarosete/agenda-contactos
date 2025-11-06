const express = require('express');
const router = express.Router();
const contactosController = require('../controllers/contactosController');

// Ruta para obtener TODOS los contactos
router.get('/', contactosController.getAllContactosController);

// Ruta para AGREGAR un nuevo contacto
router.post('/agregar', contactosController.agregarContactoController);

// Ruta para ELIMINAR un contacto
router.delete('/eliminar/:contacto_id', contactosController.eliminarContactoController);

// Ruta para EDITAR un contacto
router.put('/editar/:contacto_id', contactosController.editarContactoController);

// Ruta para OBTENER los DETALLES de un contacto específico
router.get('/:contacto_id', contactosController.getContactoController);

// Ruta para ELIMINAR TODOS los contactos
router.delete('/borrar-todos', contactosController.eliminarTodosLosContactosController);

// Ruta para BUSCAR contactos por NOMBRE
router.get('/buscar/:nombre', contactosController.buscarContactoPorNombreController);

// Ruta para ORDENAR contactos por criterio
router.get('/ordenar-por/:criterio', contactosController.ordenarContactosController);

// Ruta para obtener SOLO los contactos FAVORITOS
router.get('/favoritos', contactosController.getFavoritosController);

module.exports = router;