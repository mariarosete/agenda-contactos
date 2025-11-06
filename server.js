require('dotenv').config(); // Carga variables de entorno desde .env
const express = require('express');
const path = require('path');

// Importa las rutas de contactos
const contactosRoutes = require('./routes/contactosRoutes');
const app = express();

// Middleware para procesar formularios y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Carpeta pública para servir HTML, CSS, JS, imágenes, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Rutas del API (todas las que empiecen por /contactos)
app.use('/contactos', contactosRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en localhost:${PORT}`);
});
