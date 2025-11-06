document.addEventListener("DOMContentLoaded", function() {
    
    const buscarContactosForm = document.querySelector("#buscarContactosForm");
    const resultadosBusqueda = document.querySelector("#resultadosBusqueda");

    buscarContactosForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const nombre = buscarContactosForm.querySelector("input[name='nombre']").value.trim(); // Obtener el nombre del contacto a buscar

        try {
            // Realizar una solicitud GET al servidor para buscar contactos por nombre
            const response = await fetch(`/contactos/buscar/${nombre}`);
            const contactos = await response.json();
            
            // Mostrar los resultados en la página
            mostrarResultados(contactos);
        } catch (error) {
            console.error("Error al buscar contactos:", error);
            resultadosBusqueda.innerHTML = "<p>Ocurrió un error al buscar contactos. Por favor, inténtalo de nuevo más tarde.</p>";
        }
    });

    function mostrarResultados(contactos) {
        resultadosBusqueda.innerHTML = ""; // Limpiar los resultados anteriores
    
        if (contactos.length === 0) {
            resultadosBusqueda.innerHTML = "<p>No se encontraron resultados.</p>";
        } else {
            const listaResultados = document.createElement("ul");
    
            for (const contacto of contactos) {
                
                const Resultado = document.createElement("li");
                Resultado.classList.add("resultado");
    
                const detallesContacto = `
                    <h2><i class="fas fa-user"></i> ${contacto.nombre} ${contacto.apellidos}</h2>
                    <p>
                        <strong class="icono-texto"><i class="fas fa-phone"></i>Teléfono:</strong>
                        <span class="datos">${contacto.telefono}</span>
                    </p>
                    <p>
                        <strong class="icono-texto"><i class="fas fa-envelope"></i> Email:</strong>
                        <span class="datos">${contacto.email}</span>
                    </p>
                    <p>
                        <strong class="icono-texto"><i class="fas fa-map-marker-alt"></i> Dirección:</strong>
                        <span class="datos">${contacto.direccion}</span>
                    </p>
                    <p>
                        <strong class="icono-texto"><i class="fas fa-city"></i> Ciudad:</strong>
                        <span class="datos">${contacto.ciudad}</span>
                    </p>

                `;
                Resultado.innerHTML = detallesContacto;
    
                listaResultados.append(Resultado);
            }
    
            resultadosBusqueda.append(listaResultados);
        }
    }
});
