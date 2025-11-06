
const ContactosModel = require('../models/contactosModel');

// Controlador para obtener todos los contactos
async function getAllContactosController(req, res) {
    
    try {
        const contactos = await ContactosModel.getAllContactosModel();
        res.json(contactos);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para agregar un nuevo contacto
async function agregarContactoController(req, res) {
    
    try {
        
        const { nombre, apellidos, telefono, email, direccion, ciudad, favorito } = req.body
        await ContactosModel.agregarContactoModel({ nombre, apellidos, telefono, email, direccion, ciudad, favorito });
        res.json({ message: 'Contacto agregado correctamente' });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const eliminarContactoController = async (req, res) => {
    const { contacto_id } = req.params;

    try {
       
        await ContactosModel.eliminarContactoModel(contacto_id);
        res.status(200).json({ message: "Contacto eliminado correctamente" });
    
    } catch (error) {
        console.error("Error al eliminar contacto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// Controlador para editar un contacto
async function editarContactoController(req, res) {
    try {
        const contactoId = req.params.contacto_id;
        const datosActualizados = req.body; 

        // Obtener los detalles del contacto que se va a editar
        const contactoExistente = await ContactosModel.getContactoById(contactoId);

        if (!contactoExistente) {
            return res.status(404).json({ error: "El contacto no existe" });
        }

        // Combinar los datos actuales del contacto con los nuevos datos enviados en la solicitud
        const datosCombinados = { ...contactoExistente, ...datosActualizados };

        // Actualizar el contacto con los datos combinados
        await ContactosModel.editarContactoModel(contactoId, datosCombinados);

        // Obtener los detalles del contacto actualizado
        const contactoActualizado = await ContactosModel.getContactoById(contactoId);

        res.json({ message: 'Contacto editado correctamente', contacto: contactoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Controlador para obtener los detalles de un contacto específico
async function getContactoController(req, res) {
    
    try {
        const { contacto_id } = req.params;
        const contacto = await ContactosModel.getContactoById(contacto_id);
        res.json(contacto);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Controlador para eliminar todos los contactos
async function eliminarTodosLosContactosController(req, res) {
    
    try {
        await ContactosModel.eliminarTodosLosContactosModel();
        res.status(200).json({ message: "Todos los contactos han sido eliminados correctamente." });
    
    } catch (error) {
        console.error("Error al eliminar todos los contactos:", error);
        res.status(500).json({ error: "Error interno del servidor al intentar eliminar todos los contactos." });
    }
}


// Controlador para buscar contactos por nombre
async function buscarContactoPorNombreController(req, res) {
    
    try {
        const { nombre } = req.params;
        const contactos = await ContactosModel.buscarContactoPorNombreModel(nombre);
        res.json(contactos);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Controlador para ordenar los contactos
async function ordenarContactosController(req, res) {
    
    try {
        const { criterio } = req.params;
        let contactos = await ContactosModel.getAllContactosModel();

        // Verificar si el criterio de ordenación es válido
        switch (criterio.toLowerCase()) {
            case 'nombre':
                contactos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'apellidos':
                contactos.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
                break;
            case 'ciudad':
                contactos.sort((a, b) => a.ciudad.localeCompare(b.ciudad));
                break;
            default:
                return res.status(400).json({ error: 'Criterio de ordenación no válido' });
        }

        res.json(contactos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para obtener SOLO los contactos FAVORITOS
async function getFavoritosController(req, res) {
    try {
        const contactosFavoritos = await ContactosModel.getFavoritosModel();
        res.json(contactosFavoritos);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAllContactosController,
    agregarContactoController,
    eliminarContactoController,
    editarContactoController,
    getContactoController,
    eliminarTodosLosContactosController,
    buscarContactoPorNombreController,
    ordenarContactosController,
    getFavoritosController

  
};