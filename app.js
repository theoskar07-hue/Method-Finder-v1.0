let procedures = JSON.parse(localStorage.getItem('procedures')) || [
    // Datos iniciales del Excel (ejemplo; reemplaza con datos reales)
    { id: 1, nombre: 'Procedimiento 1', descripcion: 'Descripción calibración', instrumento: 'Instrumento A', acreditacion: 'ANAB' },
    { id: 2, nombre: 'Procedimiento 2', descripcion: 'Otra descripción', instrumento: 'Instrumento B', acreditacion: 'TRAZABLE' },
    // Agrega más basados en el Excel
];

function filterProcedures() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const anab = document.getElementById('anab').checked;
    const ema = document.getElementById('ema').checked;
    const trazable = document.getElementById('trazable').checked;
    const selectedAcc = [];
    if (anab) selectedAcc.push('ANAB');
    if (ema) selectedAcc.push('EMA');
    if (trazable) selectedAcc.push('TRAZABLE');

    const filtered = procedures.filter(p => {
        const matchesKeyword = keyword === '' || p.nombre.toLowerCase().includes(keyword) || p.descripcion.toLowerCase().includes(keyword) || p.instrumento.toLowerCase().includes(keyword);
        const matchesAcc = selectedAcc.length === 0 || selectedAcc.includes(p.acreditacion);
        return matchesKeyword && matchesAcc;
    });
    displayProcedures(filtered);
}

function displayProcedures(list) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    list.forEach(p => {
        const row = `<tr>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>${p.instrumento}</td>
            <td>${p.acreditacion}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProcedure(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProcedure(${p.id})">Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function saveProcedure() {
    const id = document.getElementById('editId').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const instrumento = document.getElementById('instrumento').value;
    const acreditacion = document.getElementById('acreditacion').value;

    if (id) {
        const index = procedures.findIndex(p => p.id == id);
        procedures[index] = { id: parseInt(id), nombre, descripcion, instrumento, acreditacion };
    } else {
        const newId = procedures.length ? Math.max(...procedures.map(p => p.id)) + 1 : 1;
        procedures.push({ id: newId, nombre, descripcion, instrumento, acreditacion });
    }
    localStorage.setItem('procedures', JSON.stringify(procedures));
    document.getElementById('procedureForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    filterProcedures();
    alert('Ya Quedo :).');
}

function editProcedure(id) {
    const p = procedures.find(p => p.id == id);
    document.getElementById('editId').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('descripcion').value = p.descripcion;
    document.getElementById('instrumento').value = p.instrumento;
    document.getElementById('acreditacion').value = p.acreditacion;
    document.getElementById('modalTitle').textContent = 'Editar Metodo';
    new bootstrap.Modal(document.getElementById('addModal')).show();
}

function deleteProcedure(id) {
    if (confirm('¿Eliminar este Metodo?')) {
        procedures = procedures.filter(p => p.id != id);
        localStorage.setItem('procedures', JSON.stringify(procedures));
        filterProcedures();
        alert('Metodo eliminado.');
    }
}

// Inicializar
filterProcedures();
