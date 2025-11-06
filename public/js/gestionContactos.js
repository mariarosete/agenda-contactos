document.addEventListener('DOMContentLoaded', () => {
  // ===== Estado =====
  let allContacts = [];
  let viewContacts = [];
  let currentPage = 1;
  let pageSize = 10;

  // ===== DOM =====
  const $tabla           = document.querySelector('.tabla-contactos');
  const hasActions       = ($tabla?.dataset.actions || 'false') === 'true';
  const $lista           = document.querySelector('.lista-contactos');
  const $selOrden        = document.getElementById('selectOrden');
  const $selFiltro       = document.getElementById('filtroContactos');
  const $selPageSize     = document.getElementById('pageSize');
  const $prevBtn         = document.getElementById('prevPage');
  const $nextBtn         = document.getElementById('nextPage');
  const $pageInfo        = document.getElementById('pageInfo');
  const $editarModal     = document.getElementById('editarModal');
  const $editForm        = document.getElementById('editarContactoForm');
  const $cerrarEditBtn   = document.getElementById('cerrarModal2');
  const $confirmModal    = document.getElementById('confirmModal');
  const $confirmYes      = document.getElementById('confirmarEliminar');
  const $confirmNo       = document.getElementById('cancelarEliminar');

  // ===== Feedback editar =====
  const showEditFeedback = (msg, type = 'ok') => {
    const box = document.getElementById('editFormFeedback');
    if (!box) return;
    box.className = `form-feedback ${type}`;
    box.textContent = msg;
  };
  const clearEditFeedback = () => showEditFeedback('', 'ok');

  // ===== Init =====
  cargarContactos();
  cargarCiudades();

  // ===== Data =====
  function cargarContactos() {
    fetch('/contactos')
      .then(r => r.json())
      .then(data => {
        allContacts = Array.isArray(data) ? data : [];
        currentPage = 1;
        recomputeAndRender();
      })
      .catch(err => console.error('Error al cargar los contactos:', err));
  }

  window.cargarContactos = cargarContactos;

  function recomputeAndRender() {
    const onlyFavs = $selFiltro?.value === 'favoritos';
    viewContacts = onlyFavs ? allContacts.filter(c => !!c.favorito) : [...allContacts];

    const key = $selOrden?.value || 'nombre';
    viewContacts.sort((a, b) => {
      const va = (a[key] ?? '').toString().toLowerCase();
      const vb = (b[key] ?? '').toString().toLowerCase();
      return va < vb ? -1 : va > vb ? 1 : 0;
    });

    const totalPages = Math.max(1, Math.ceil(viewContacts.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    renderPage();
    renderPaginationControls();
  }

  function renderPage() {
    $lista.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const end   = start + pageSize;
    const slice = viewContacts.slice(start, end);

    if (slice.length === 0) {
      const tr = document.createElement('tr');
      // 7 columnas si no hay acciones; 8 si hay
      const cols = hasActions ? 8 : 7;
      tr.innerHTML = `<td colspan="${cols}">No se encontraron contactos</td>`;
      $lista.append(tr);
      return;
    }

    for (const c of slice) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.nombre ?? ''}</td>
        <td>${c.apellidos ?? ''}</td>
        <td>${c.telefono ?? ''}</td>
        <td>${c.email ?? ''}</td>
        <td>${c.direccion ?? ''}</td>
        <td>${c.ciudad ?? ''}</td>
        <td>${c.favorito ? '<i class="fas fa-star"></i>' : ''}</td>
        ${hasActions ? `
          <td>
            <i class="fas fa-pencil-alt accion" title="Editar" data-contacto-id="${c.contacto_id}"></i>
            <i class="fas fa-trash-alt accion"  title="Eliminar" data-contacto-id="${c.contacto_id}"></i>
          </td>` : ``}
      `;
      if (c.favorito) tr.classList.add('favorito');
      $lista.append(tr);
    }
  }

  function renderPaginationControls() {
    const total = viewContacts.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if ($pageInfo) $pageInfo.textContent = `Página ${currentPage} de ${totalPages} — ${total} contactos`;
    if ($prevBtn)  $prevBtn.disabled = currentPage <= 1;
    if ($nextBtn)  $nextBtn.disabled = currentPage >= totalPages;
  }

  // ===== Delegación de eventos (solo si hay acciones) =====
  if (hasActions) {
    $lista.addEventListener('click', (e) => {
      const icon = e.target.closest('i');
      if (!icon) return;
      const id = icon.getAttribute('data-contacto-id');
      if (!id) return;

      if (icon.classList.contains('fa-pencil-alt')) {
        mostrarFormularioEdicion(id);
      } else if (icon.classList.contains('fa-trash-alt')) {
        mostrarModalConfirmacion(id);
      }
    });
  }

  // ===== Paginación =====
  $prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      renderPaginationControls();
    }
  });

  $nextBtn?.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(viewContacts.length / pageSize));
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      renderPaginationControls();
    }
  });

  $selPageSize?.addEventListener('change', () => {
    pageSize = parseInt($selPageSize.value, 10) || 10;
    currentPage = 1;
    recomputeAndRender();
  });

  $selOrden?.addEventListener('change', () => {
    currentPage = 1;
    recomputeAndRender();
  });
  $selFiltro?.addEventListener('change', () => {
    currentPage = 1;
    recomputeAndRender();
  });

  // ===== Eliminar  =====
  function mostrarModalConfirmacion(contactoId) {
    if (!$confirmModal) return; 
    $confirmModal.style.display = 'block';

    const onYes = () => {
      $confirmModal.style.display = 'none';
      $confirmYes.removeEventListener('click', onYes);
      $confirmNo.removeEventListener('click', onNo);
      eliminarContacto(contactoId);
    };
    const onNo = () => {
      $confirmModal.style.display = 'none';
      $confirmYes.removeEventListener('click', onYes);
      $confirmNo.removeEventListener('click', onNo);
    };

    $confirmYes.addEventListener('click', onYes, { once: true });
    $confirmNo.addEventListener('click', onNo, { once: true });
  }

  function eliminarContacto(contactoId) {
    fetch(`/contactos/eliminar/${contactoId}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        allContacts = allContacts.filter(c => String(c.contacto_id) !== String(contactoId));
        recomputeAndRender();
      })
      .catch(err => console.error('Error al eliminar:', err));
  }

  // ===== Editar =====
  function mostrarFormularioEdicion(contactoId) {
    if (!$editarModal) return; 
    clearEditFeedback();
    $editarModal.style.display = 'block';

    fetch(`/contactos/${contactoId}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        const c = Array.isArray(data) ? data[0]
                : (data && data.contacto) ? data.contacto
                : data;

        if (!c || !c.contacto_id) throw new Error('No se encontró el contacto.');

        document.getElementById('contactoIdInput').value       = c.contacto_id;
        document.getElementById('editarNombreInput').value     = c.nombre ?? '';
        document.getElementById('editarApellidosInput').value  = c.apellidos ?? '';
        document.getElementById('editarTelefonoInput').value   = c.telefono ?? '';
        document.getElementById('editarEmailInput').value      = c.email ?? '';
        document.getElementById('editarDireccionInput').value  = c.direccion ?? '';

        const selCiudad = document.getElementById('editarCiudadInput');
        if (selCiudad && Array.from(selCiudad.options).some(o => o.value === c.ciudad)) {
          selCiudad.value = c.ciudad;
        }
        document.getElementById('editarFavoritoInput').checked = !!c.favorito;
      })
      .catch(err => {
        console.error('Error al obtener el contacto:', err);
        showEditFeedback(' No se pudo cargar el contacto.', 'error');
      });
  }

  $editForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const contactoId = document.getElementById('contactoIdInput').value;
    const datosActualizados = {
      nombre:    document.getElementById('editarNombreInput').value.trim(),
      apellidos: document.getElementById('editarApellidosInput').value.trim(),
      telefono:  document.getElementById('editarTelefonoInput').value.trim(),
      email:     document.getElementById('editarEmailInput').value.trim(),
      direccion: document.getElementById('editarDireccionInput').value.trim(),
      ciudad:    document.getElementById('editarCiudadInput').value,
      favorito:  document.getElementById('editarFavoritoInput').checked,
    };

    fetch(`/contactos/editar/${contactoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados),
    })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'No se pudo editar');

      const i = allContacts.findIndex(c => String(c.contacto_id) === String(contactoId));
      if (i > -1) allContacts[i] = { ...allContacts[i], ...datosActualizados };

      recomputeAndRender();
      showEditFeedback('✅ Contacto actualizado correctamente.', 'ok');

      setTimeout(() => {
        $editarModal.style.display = 'none';
        $editForm.reset();
        clearEditFeedback();
      }, 1200);
    })
    .catch(err => {
      console.error('Error al editar:', err);
      showEditFeedback(` ${err.message}`, 'error');
    });
  });

  $cerrarEditBtn?.addEventListener('click', () => {
    $editarModal.style.display = 'none';
    clearEditFeedback();
  });

  // ===== Ciudades  =====
  function cargarCiudades() {
    fetch('datos/ciudades.json') 
      .then(r => r.json())
      .then(data => {
        const addOptions = (selId) => {
          const sel = document.getElementById(selId);
          if (!sel) return;
          const frag = document.createDocumentFragment();
          data.ciudades.forEach(ci => {
            const opt = document.createElement('option');
            opt.value = ci.nombre;
            opt.text  = ci.nombre;
            frag.appendChild(opt);
          });
          sel.appendChild(frag);
        };
        addOptions('ciudadInput');        
        addOptions('editarCiudadInput');  
      })
      .catch(err => console.error('Error al cargar ciudades:', err));
  }
});
