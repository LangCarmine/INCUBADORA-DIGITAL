// =========================================
// BASE DE DATOS LOCAL (SEMILLA)
// =========================================
const SEED_PROJECTS = [
    {
        id: 'GTO-4601',
        nombre: 'Carlos Ramírez Ortega',
        correo: 'carlos@mediconnect.mx',
        proyecto: 'MediConnect GTO',
        giro: 'Salud Digital',
        municipio: 'León, Guanajuato',
        tiempo: 'Menos de 6 meses',
        innovacion: '3',
        propuesta: 'Plataforma que unifica el expediente clínico electrónico para clínicas privadas en el Bajío.',
        plan: 'Suscripción para consultorios independientes. Meta inicial 50 médicos en León.',
        monetizacion: 'SaaS. Tier básico $300 MXN/mes. Tier Pro $800 MXN/mes.',
        requiere: 'Mentoría legal sobre protección de datos de salud (NOM-024) y capital para marketing B2B.',
        estado: 'Pendiente'
    }
];

// =========================================
// CARGA DE DATOS (localStorage > semilla)
// =========================================
let projects = JSON.parse(localStorage.getItem('gto_projects')) || [...SEED_PROJECTS];

function saveProjects() {
    localStorage.setItem('gto_projects', JSON.stringify(projects));
}

// =========================================
// LÓGICA DE INNOVACIÓN (formulario.html)
// =========================================
function setInnov(val, event) {
    document.querySelectorAll('.innov-btn').forEach(btn => btn.classList.remove('selected'));
    if (event && event.target) {
        event.target.classList.add('selected');
    }
    document.getElementById('f_innovacion').value = val;
}

// =========================================
// ENVIAR FORMULARIO (formulario.html)
// =========================================
function submitForm(e) {
    e.preventDefault();

    const correo = sessionStorage.getItem('gto_emp_correo');
    if (!correo) {
        window.location.href = 'login-emprendedor.html';
        return;
    }

    // Obtener nombre desde la cuenta registrada
    const emprendedores = JSON.parse(localStorage.getItem('gto_emprendedores')) || [];
    const cuenta = emprendedores.find(x => x.correo === correo);
    const nombre = cuenta ? cuenta.nombre : 'Sin nombre';

    const folio = 'GTO-' + Math.floor(1000 + Math.random() * 9000);

    const newProj = {
        id: folio,
        correo: correo,
        nombre: nombre,
        proyecto: document.getElementById('f_proyecto').value,
        giro: document.getElementById('f_giro').value,
        municipio: document.getElementById('f_municipio').value,
        tiempo: document.getElementById('f_tiempo').value,
        innovacion: document.getElementById('f_innovacion').value,
        propuesta: document.getElementById('f_propuesta').value,
        plan: document.getElementById('f_plan').value,
        monetizacion: document.getElementById('f_monetizacion').value,
        requiere: document.getElementById('f_requiere').value,
        estado: 'Pendiente',
        fecha: new Date().toISOString()
    };

    projects.push(newProj);
    saveProjects();

    sessionStorage.setItem('gto_last_folio', folio);
    window.location.href = 'confirmacion.html';
}

// =========================================
// PANEL DEL EMPRENDEDOR (mi-cuenta.html)
// =========================================
function renderMiCuenta() {
    const correo = sessionStorage.getItem('gto_emp_correo');
    if (!correo) return;

    // Datos del usuario
    const emprendedores = JSON.parse(localStorage.getItem('gto_emprendedores')) || [];
    const cuenta = emprendedores.find(x => x.correo === correo);

    document.getElementById('emp-nombre-display').innerText = cuenta ? cuenta.nombre : '—';
    document.getElementById('emp-correo-display').innerText = correo;

    // Filtrar propuestas del usuario
    const misProps = projects.filter(p => p.correo === correo);
    document.getElementById('emp-total-props').innerText = misProps.length;

    // Verificar si hay alguna pendiente
    const hayPendiente = misProps.some(p => p.estado === 'Pendiente');
    const btnNueva = document.getElementById('btn-nueva-postulacion');
    const bloqueo = document.getElementById('bloqueo-msg');

    if (hayPendiente) {
        btnNueva.disabled = true;
        btnNueva.classList.add('opacity-50', 'cursor-not-allowed');
        bloqueo.classList.remove('hidden');
    } else {
        btnNueva.disabled = false;
        btnNueva.classList.remove('opacity-50', 'cursor-not-allowed');
        bloqueo.classList.add('hidden');
    }

    // Renderizar lista de propuestas
    const cont = document.getElementById('mis-propuestas');
    cont.innerHTML = '';

    if (misProps.length === 0) {
        cont.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <i class="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Aún no has enviado ninguna propuesta.</p>
            </div>`;
        return;
    }

    [...misProps].reverse().forEach(p => {
        const estadoInfo = getEstadoInfo(p.estado);
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden';

        card.innerHTML = `
            <div class="p-5 flex justify-between items-center flex-wrap gap-3">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-xs">
                        ${p.proyecto.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-bold text-brand-dark">${p.proyecto}</h4>
                        <p class="text-xs text-gray-500 font-mono">${p.id} · ${p.giro}</p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold ${estadoInfo.bg} ${estadoInfo.color}">
                    <i class="fas ${estadoInfo.icon} mr-1"></i> ${p.estado}
                </span>
            </div>

            <div class="border-t border-gray-100 px-5 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between flex-wrap gap-2">
                <span><i class="fas fa-map-marker-alt mr-1"></i> ${p.municipio}</span>
                <span><i class="fas fa-chart-line mr-1"></i> Innovación nivel ${p.innovacion}/5</span>
                <span><i class="fas fa-clock mr-1"></i> ${p.tiempo}</span>
            </div>

            ${p.estado === 'Más Info' ? `
                <div class="border-t border-orange-100 bg-orange-50 px-5 py-3 text-sm text-orange-700 flex items-start">
                    <i class="fas fa-exclamation-circle mt-1 mr-2"></i>
                    <span>El comité solicita más información sobre tu proyecto. Por favor, envía una nueva postulación con datos ampliados.</span>
                </div>
            ` : ''}

            ${p.estado === 'Aprobado' ? `
                <div class="border-t border-green-100 bg-green-50 px-5 py-3 text-sm text-green-700 flex items-start">
                    <i class="fas fa-check-circle mt-1 mr-2"></i>
                    <span>¡Felicidades! Tu proyecto fue aprobado por el Comité Directivo.</span>
                </div>
            ` : ''}

            ${p.estado === 'Rechazado' ? `
                <div class="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 flex items-start">
                    <i class="fas fa-times-circle mt-1 mr-2"></i>
                    <span>Tu propuesta fue rechazada. Puedes enviar una nueva versión.</span>
                </div>
            ` : ''}
        `;
        cont.appendChild(card);
    });
}

function getEstadoInfo(estado) {
    switch (estado) {
        case 'Pendiente':
            return { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: 'fa-hourglass-half' };
        case 'Aprobado':
            return { color: 'text-green-700', bg: 'bg-green-100', icon: 'fa-check' };
        case 'Rechazado':
            return { color: 'text-red-700', bg: 'bg-red-100', icon: 'fa-times' };
        case 'Más Info':
            return { color: 'text-orange-700', bg: 'bg-orange-100', icon: 'fa-exclamation-triangle' };
        default:
            return { color: 'text-gray-700', bg: 'bg-gray-100', icon: 'fa-info' };
    }
}

function irANuevaPostulacion() {
    window.location.href = 'formulario.html';
}

// =========================================
// RENDERIZAR PANEL ADMINISTRADOR (admin.html)
// =========================================
function renderAdmin() {
    const list = document.getElementById('admin-list');
    if (!list) return;

    list.innerHTML = '';

    const pendientes = projects.filter(p => p.estado === 'Pendiente');
    const counter = document.getElementById('admin-counter');
    if (counter) counter.innerText = `${pendientes.length} propuestas en revisión`;

    if (pendientes.length === 0) {
        list.innerHTML = `<div class="text-center p-10 text-gray-400 bg-white rounded-xl shadow-sm">No hay proyectos pendientes por evaluar.</div>`;
        return;
    }

    [...pendientes].reverse().forEach((p, index) => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all";

        card.innerHTML = `
            <div class="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50" onclick="toggleAccordion('${p.id}')">
                <div class="flex items-center space-x-4">
                    <div class="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold">${index + 1}</div>
                    <div>
                        <h4 class="font-bold text-brand-dark">${p.proyecto}</h4>
                        <p class="text-xs text-gray-500">${p.nombre} · ${p.giro} · ${p.municipio}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="px-3 py-1 bg-purple-100 text-brand-purple text-xs font-mono rounded-full">${p.id}</span>
                    <i class="fas fa-chevron-down text-gray-400 transition-transform" id="icon-${p.id}"></i>
                </div>
            </div>

            <div id="content-${p.id}" class="accordion-content border-t border-gray-100 flex flex-col md:flex-row">
                <div class="md:w-1/3 p-6 bg-white space-y-4">
                    <h5 class="text-xs font-semibold text-gray-400 mb-4">DATOS OPERATIVOS</h5>

                    <div><p class="text-xs text-gray-400 uppercase">Cliente</p><p class="text-sm font-medium text-brand-dark">${p.nombre}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Correo</p><p class="text-sm text-brand-purple break-all">${p.correo}</p></div>
                    <hr class="border-gray-100">
                    <div><p class="text-xs text-gray-400 uppercase">Giro Empresarial</p><p class="text-sm text-brand-dark">${p.giro}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Tiempo en mercado</p><p class="text-sm text-brand-dark">${p.tiempo}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Nivel de Innovación</p>
                        <span class="inline-flex items-center mt-1 px-2 py-1 rounded bg-purple-100 text-brand-purple text-xs font-bold">
                            <span class="w-4 h-4 bg-brand-purple text-white rounded-full flex items-center justify-center mr-2">${p.innovacion}</span> Nivel Declarado
                        </span>
                    </div>
                </div>

                <div class="md:w-2/3 p-6 bg-brand-dark text-white">
                    <h5 class="text-xs font-semibold text-gray-400 mb-4">INFORMACIÓN ESTRATÉGICA</h5>

                    <div class="space-y-5">
                        <div><p class="text-xs font-semibold text-brand-accent mb-1 uppercase">1. Propuesta de Valor</p><p class="text-sm text-gray-300 leading-relaxed">${p.propuesta}</p></div>
                        <div><p class="text-xs font-semibold text-brand-accent mb-1 uppercase">2. Plan de Negocio</p><p class="text-sm text-gray-300 leading-relaxed">${p.plan}</p></div>
                        <div><p class="text-xs font-semibold text-brand-accent mb-1 uppercase">3. Modelo de Monetización</p><p class="text-sm text-gray-300 leading-relaxed">${p.monetizacion}</p></div>
                        <div><p class="text-xs font-semibold text-brand-accent mb-1 uppercase">4. Apoyo Requerido</p><p class="text-sm text-gray-300 leading-relaxed">${p.requiere}</p></div>
                    </div>
                </div>
            </div>

            <div id="action-${p.id}" class="bg-gray-50 p-4 border-t border-gray-200 hidden justify-between items-center flex-wrap gap-3">
                <span class="text-sm text-gray-500">Panel de Decisión — <strong class="text-brand-dark font-mono">${p.id}</strong></span>
                <div class="flex space-x-3 flex-wrap gap-2">
                    <button onclick="evaluateProject('${p.id}', 'Aprobado')" class="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded text-sm font-semibold hover:bg-green-100 transition"><i class="fas fa-check mr-1"></i> Aprobar</button>
                    <button onclick="evaluateProject('${p.id}', 'Más Info')" class="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded text-sm font-semibold hover:bg-orange-100 transition"><i class="fas fa-exclamation-triangle mr-1"></i> Más Información</button>
                    <button onclick="evaluateProject('${p.id}', 'Rechazado')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-semibold hover:bg-red-100 transition"><i class="fas fa-times mr-1"></i> Rechazar</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// =========================================
// CONTROL DE ACORDEÓN
// =========================================
function toggleAccordion(id) {
    const content = document.getElementById(`content-${id}`);
    const actionPanel = document.getElementById(`action-${id}`);
    const icon = document.getElementById(`icon-${id}`);

    if (content.classList.contains('open')) {
        content.classList.remove('open');
        icon.style.transform = 'rotate(0deg)';
        actionPanel.classList.add('hidden');
        actionPanel.classList.remove('flex');
    } else {
        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('[id^="icon-"]').forEach(el => el.style.transform = 'rotate(0deg)');
        document.querySelectorAll('[id^="action-"]').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });

        content.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
        actionPanel.classList.remove('hidden');
        actionPanel.classList.add('flex');
    }
}

// =========================================
// EVALUACIÓN DE PROYECTO
// =========================================
function evaluateProject(id, decision) {
    const index = projects.findIndex(p => p.id === id);
    if (index > -1) {
        projects[index].estado = decision;
        saveProjects();
        showToast(`Proyecto ${id} marcado como: ${decision}`);
        renderAdmin();
    }
}

// =========================================
// NOTIFICACIONES
// =========================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}