window.onload = function () {
    // ----- Utilidades de feedback -----
    function showFeedback(text, type = 'ok') {
      const box = document.getElementById('formFeedback');
      if (!box) return;
      box.className = `form-feedback ${type}`;
      box.textContent = text;
    }
  
    function clearFeedback() {
      const box = document.getElementById('formFeedback');
      if (!box) return;
      box.className = 'form-feedback';
      box.textContent = '';
    }
  
    // ----- Agregar contacto -----
    function agregarContacto() {
        const nuevoContacto = {
          nombre:    document.querySelector('#nombreInput').value.trim(),
          apellidos: document.querySelector('#apellidosInput').value.trim(),
          telefono:  document.querySelector('#telefonoInput').value.trim(),
          email:     document.querySelector('#emailInput').value.trim(),
          direccion: document.querySelector('#direccionInput').value.trim(),
          ciudad:    document.querySelector('#ciudadInput').value,
          favorito:  document.querySelector('#favoritoInput').checked
        };
      
        // Limpia feedback antes de enviar
        const fb = document.getElementById('formFeedback');
        if (fb) { fb.className = 'form-feedback'; fb.textContent = ''; }
      
        fetch('/contactos/agregar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoContacto)
        })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || 'No se pudo agregar el contacto');
          return data;
        })
        .then(() => {
          // Refresca la lista si tienes la función
          if (typeof cargarContactos === 'function') cargarContactos();
      
          // Muestra mensaje de éxito dentro del modal
          if (fb) {
            fb.className = 'form-feedback ok';
            fb.textContent = '✅ Contacto creado correctamente.';
            fb.scrollIntoView({ block: 'nearest' });
          }
      
          // Espera 2s para que el usuario lo vea y luego cierra + resetea
          setTimeout(() => {
            document.querySelector('#modal').style.display = 'none';
            document.querySelector('#registro').reset();
            if (fb) { fb.className = 'form-feedback'; fb.textContent = ''; }
          }, 2000);
        })
        .catch((error) => {
          console.error('Error al agregar el contacto:', error);
          if (fb) { fb.className = 'form-feedback error'; fb.textContent = ` ${error.message}`; }
        });
      }
      
  
    // ----- Apertura del modal -----
    document.querySelector('#agregar-contacto')?.addEventListener('click', function (event) {
      event.preventDefault();
      clearFeedback();
      document.querySelector('#modal').style.display = 'block';
    });
  
    // ----- Envío del formulario -----
    document.querySelector('#registro').addEventListener('submit', function (event) {
      event.preventDefault();
      agregarContacto();
    });
  
    // ----- Cierre modal (botones) -----
    document.querySelector('#cerrarModal')?.addEventListener('click', function () {
      document.querySelector('#modal').style.display = 'none';
    });
  
    document.querySelector('#cerrarModal2')?.addEventListener('click', function () {
      document.querySelector('#editarModal').style.display = 'none';
    });
  
    // ----- Cierre modal (clic fuera) -----
    window.addEventListener('click', function (event) {
      if (event.target === document.querySelector('#modal')) {
        document.querySelector('#modal').style.display = 'none';
      }
      if (event.target === document.querySelector('#editarModal')) {
        document.querySelector('#editarModal').style.display = 'none';
      }
    });
  };