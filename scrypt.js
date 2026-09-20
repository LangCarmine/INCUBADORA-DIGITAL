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
// NAVEGACIÓN
// =========================================
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'view-admin') renderAdmin();
}

// =========================================
// LÓGICA DE INNOVACIÓN
// =========================================
function setInnov(val) {
    document.querySelectorAll('.innov-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    document.getElementById('f_innovacion').value = val;
}

// =========================================
// ENVIAR FORMULARIO
// =========================================
function submitForm(e) {
    e.preventDefault();

    const newProj = {
        id: 'GTO-' + Math.floor(1000 + Math.random() * 9000),
        nombre: document.getElementById('f_nombre').value,
        correo: document.getElementById('f_correo').value,
        proyecto: document.getElementById('f_proyecto').value,
        giro: document.getElementById('f_giro').value,
        municipio: document.getElementById('f_municipio').value,
        tiempo: document.getElementById('f_tiempo').value,
        innovacion: document.getElementById('f_innovacion').value,
        propuesta: document.getElementById('f_propuesta').value,
        plan: document.getElementById('f_plan').value,
        monetizacion: document.getElementById('f_monetizacion').value,
        requiere: document.getElementById('f_requiere').value,
        estado: 'Pendiente'
    };

    projects.push(newProj);
    saveProjects();

    document.getElementById('projectForm').reset();
    setInnov(1);

    showToast("Proyecto enviado con éxito. Folio: " + newProj.id);
    setTimeout(() => switchView('view-login'), 1500);
}

// =========================================
// RENDERIZAR PANEL ADMINISTRADOR
// =========================================
function renderAdmin() {
    const list = document.getElementById('admin-list');
    list.innerHTML = '';

    const pendientes = projects.filter(p => p.estado === 'Pendiente');
    document.getElementById('admin-counter').innerText = `${pendientes.length} propuestas en revisión`;

    if (pendientes.length === 0) {
        list.innerHTML = `<div class="text-center p-10 text-gray-400 bg-white rounded-xl shadow-sm">No hay proyectos pendientes por evaluar.</div>`;
        return;
    }

    [...pendientes].reverse().forEach((p, index) => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all";

        card.innerHTML = `
            <!-- Header Acordeón -->
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

            <!-- Contenido Expandible -->
            <div id="content-${p.id}" class="accordion-content border-t border-gray-100 flex flex-col md:flex-row">
                <!-- Columna Izquierda: Datos Operativos -->
                <div class="md:w-1/3 p-6 bg-white space-y-4">
                    <h5 class="text-xs font-semibold text-gray-400 mb-4">DATOS OPERATIVOS</h5>

                    <div><p class="text-xs text-gray-400 uppercase">Cliente</p><p class="text-sm font-medium text-brand-dark">${p.nombre}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Correo</p><p class="text-sm text-brand-purple">${p.correo}</p></div>
                    <hr class="border-gray-100">
                    <div><p class="text-xs text-gray-400 uppercase">Giro Empresarial</p><p class="text-sm text-brand-dark">${p.giro}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Tiempo en mercado</p><p class="text-sm text-brand-dark">${p.tiempo}</p></div>
                    <div><p class="text-xs text-gray-400 uppercase">Nivel de Innovación</p>
                        <span class="inline-flex items-center mt-1 px-2 py-1 rounded bg-purple-100 text-brand-purple text-xs font-bold">
                            <span class="w-4 h-4 bg-brand-purple text-white rounded-full flex items-center justify-center mr-2">${p.innovacion}</span> Nivel Declarado
                        </span>
                    </div>
                </div>

                <!-- Columna Derecha: Estrategia -->
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

            <!-- Panel de Decisión (Fijo al expandir) -->
            <div id="action-${p.id}" class="bg-gray-50 p-4 border-t border-gray-200 hidden justify-between items-center">
                <span class="text-sm text-gray-500">Panel de Decisión — <strong class="text-brand-dark font-mono">${p.id}</strong></span>
                <div class="flex space-x-3">
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
// EXPORTAR A GITHUB (descarga scrypt.js actualizado)
// =========================================
function exportToGitHub() {
    // Genera el contenido del archivo con TODOS los proyectos actuales
    const content =
        "// =========================================\n" +
        "// BASE DE DATOS LOCAL (SEMILLA)\n" +
        "// =========================================\n" +
        "const SEED_PROJECTS = " + JSON.stringify(projects, null, 4) + ";\n\n" +
        "// =========================================\n" +
        "// CARGA DE DATOS (localStorage > semilla)\n" +
        "// =========================================\n" +
        "let projects = JSON.parse(localStorage.getItem('gto_projects')) || [...SEED_PROJECTS];\n\n" +
        "function saveProjects() {\n" +
        "    localStorage.setItem('gto_projects', JSON.stringify(projects));\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// NAVEGACIÓN\n" +
        "// =========================================\n" +
        "function switchView(viewId) {\n" +
        "    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));\n" +
        "    document.getElementById(viewId).classList.add('active');\n" +
        "    if (viewId === 'view-admin') renderAdmin();\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// LÓGICA DE INNOVACIÓN\n" +
        "// =========================================\n" +
        "function setInnov(val) {\n" +
        "    document.querySelectorAll('.innov-btn').forEach(btn => btn.classList.remove('selected'));\n" +
        "    event.target.classList.add('selected');\n" +
        "    document.getElementById('f_innovacion').value = val;\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// ENVIAR FORMULARIO\n" +
        "// =========================================\n" +
        "function submitForm(e) {\n" +
        "    e.preventDefault();\n\n" +
        "    const newProj = {\n" +
        "        id: 'GTO-' + Math.floor(1000 + Math.random() * 9000),\n" +
        "        nombre: document.getElementById('f_nombre').value,\n" +
        "        correo: document.getElementById('f_correo').value,\n" +
        "        proyecto: document.getElementById('f_proyecto').value,\n" +
        "        giro: document.getElementById('f_giro').value,\n" +
        "        municipio: document.getElementById('f_municipio').value,\n" +
        "        tiempo: document.getElementById('f_tiempo').value,\n" +
        "        innovacion: document.getElementById('f_innovacion').value,\n" +
        "        propuesta: document.getElementById('f_propuesta').value,\n" +
        "        plan: document.getElementById('f_plan').value,\n" +
        "        monetizacion: document.getElementById('f_monetizacion').value,\n" +
        "        requiere: document.getElementById('f_requiere').value,\n" +
        "        estado: 'Pendiente'\n" +
        "    };\n\n" +
        "    projects.push(newProj);\n" +
        "    saveProjects();\n\n" +
        "    document.getElementById('projectForm').reset();\n" +
        "    setInnov(1);\n\n" +
        "    showToast(\"Proyecto enviado con éxito. Folio: \" + newProj.id);\n" +
        "    setTimeout(() => switchView('view-login'), 1500);\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// RENDERIZAR PANEL ADMINISTRADOR\n" +
        "// =========================================\n" +
        "function renderAdmin() {\n" +
        "    const list = document.getElementById('admin-list');\n" +
        "    list.innerHTML = '';\n\n" +
        "    const pendientes = projects.filter(p => p.estado === 'Pendiente');\n" +
        "    document.getElementById('admin-counter').innerText = `${pendientes.length} propuestas en revisión`;\n\n" +
        "    if (pendientes.length === 0) {\n" +
        "        list.innerHTML = `<div class=\"text-center p-10 text-gray-400 bg-white rounded-xl shadow-sm\">No hay proyectos pendientes por evaluar.</div>`;\n" +
        "        return;\n" +
        "    }\n\n" +
        "    [...pendientes].reverse().forEach((p, index) => {\n" +
        "        const card = document.createElement('div');\n" +
        "        card.className = \"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all\";\n\n" +
        "        card.innerHTML = `\n" +
        "            <div class=\"p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50\" onclick=\"toggleAccordion('${p.id}')\">\n" +
        "                <div class=\"flex items-center space-x-4\">\n" +
        "                    <div class=\"w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold\">${index + 1}</div>\n" +
        "                    <div>\n" +
        "                        <h4 class=\"font-bold text-brand-dark\">${p.proyecto}</h4>\n" +
        "                        <p class=\"text-xs text-gray-500\">${p.nombre} · ${p.giro} · ${p.municipio}</p>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"flex items-center space-x-4\">\n" +
        "                    <span class=\"px-3 py-1 bg-purple-100 text-brand-purple text-xs font-mono rounded-full\">${p.id}</span>\n" +
        "                    <i class=\"fas fa-chevron-down text-gray-400 transition-transform\" id=\"icon-${p.id}\"></i>\n" +
        "                </div>\n" +
        "            </div>\n\n" +
        "            <div id=\"content-${p.id}\" class=\"accordion-content border-t border-gray-100 flex flex-col md:flex-row\">\n" +
        "                <div class=\"md:w-1/3 p-6 bg-white space-y-4\">\n" +
        "                    <h5 class=\"text-xs font-semibold text-gray-400 mb-4\">DATOS OPERATIVOS</h5>\n" +
        "                    <div><p class=\"text-xs text-gray-400 uppercase\">Cliente</p><p class=\"text-sm font-medium text-brand-dark\">${p.nombre}</p></div>\n" +
        "                    <div><p class=\"text-xs text-gray-400 uppercase\">Correo</p><p class=\"text-sm text-brand-purple\">${p.correo}</p></div>\n" +
        "                    <hr class=\"border-gray-100\">\n" +
        "                    <div><p class=\"text-xs text-gray-400 uppercase\">Giro Empresarial</p><p class=\"text-sm text-brand-dark\">${p.giro}</p></div>\n" +
        "                    <div><p class=\"text-xs text-gray-400 uppercase\">Tiempo en mercado</p><p class=\"text-sm text-brand-dark\">${p.tiempo}</p></div>\n" +
        "                    <div><p class=\"text-xs text-gray-400 uppercase\">Nivel de Innovación</p>\n" +
        "                        <span class=\"inline-flex items-center mt-1 px-2 py-1 rounded bg-purple-100 text-brand-purple text-xs font-bold\">\n" +
        "                            <span class=\"w-4 h-4 bg-brand-purple text-white rounded-full flex items-center justify-center mr-2\">${p.innovacion}</span> Nivel Declarado\n" +
        "                        </span>\n" +
        "                    </div>\n" +
        "                </div>\n\n" +
        "                <div class=\"md:w-2/3 p-6 bg-brand-dark text-white\">\n" +
        "                    <h5 class=\"text-xs font-semibold text-gray-400 mb-4\">INFORMACIÓN ESTRATÉGICA</h5>\n" +
        "                    <div class=\"space-y-5\">\n" +
        "                        <div><p class=\"text-xs font-semibold text-brand-accent mb-1 uppercase\">1. Propuesta de Valor</p><p class=\"text-sm text-gray-300 leading-relaxed\">${p.propuesta}</p></div>\n" +
        "                        <div><p class=\"text-xs font-semibold text-brand-accent mb-1 uppercase\">2. Plan de Negocio</p><p class=\"text-sm text-gray-300 leading-relaxed\">${p.plan}</p></div>\n" +
        "                        <div><p class=\"text-xs font-semibold text-brand-accent mb-1 uppercase\">3. Modelo de Monetización</p><p class=\"text-sm text-gray-300 leading-relaxed\">${p.monetizacion}</p></div>\n" +
        "                        <div><p class=\"text-xs font-semibold text-brand-accent mb-1 uppercase\">4. Apoyo Requerido</p><p class=\"text-sm text-gray-300 leading-relaxed\">${p.requiere}</p></div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n\n" +
        "            <div id=\"action-${p.id}\" class=\"bg-gray-50 p-4 border-t border-gray-200 hidden justify-between items-center\">\n" +
        "                <span class=\"text-sm text-gray-500\">Panel de Decisión — <strong class=\"text-brand-dark font-mono\">${p.id}</strong></span>\n" +
        "                <div class=\"flex space-x-3\">\n" +
        "                    <button onclick=\"evaluateProject('${p.id}', 'Aprobado')\" class=\"px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded text-sm font-semibold hover:bg-green-100 transition\"><i class=\"fas fa-check mr-1\"></i> Aprobar</button>\n" +
        "                    <button onclick=\"evaluateProject('${p.id}', 'Más Info')\" class=\"px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded text-sm font-semibold hover:bg-orange-100 transition\"><i class=\"fas fa-exclamation-triangle mr-1\"></i> Más Información</button>\n" +
        "                    <button onclick=\"evaluateProject('${p.id}', 'Rechazado')\" class=\"px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-semibold hover:bg-red-100 transition\"><i class=\"fas fa-times mr-1\"></i> Rechazar</button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        `;\n" +
        "        list.appendChild(card);\n" +
        "    });\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// CONTROL DE ACORDEÓN\n" +
        "// =========================================\n" +
        "function toggleAccordion(id) {\n" +
        "    const content = document.getElementById(`content-${id}`);\n" +
        "    const actionPanel = document.getElementById(`action-${id}`);\n" +
        "    const icon = document.getElementById(`icon-${id}`);\n\n" +
        "    if (content.classList.contains('open')) {\n" +
        "        content.classList.remove('open');\n" +
        "        icon.style.transform = 'rotate(0deg)';\n" +
        "        actionPanel.classList.add('hidden');\n" +
        "        actionPanel.classList.remove('flex');\n" +
        "    } else {\n" +
        "        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));\n" +
        "        document.querySelectorAll('[id^=\"icon-\"]').forEach(el => el.style.transform = 'rotate(0deg)');\n" +
        "        document.querySelectorAll('[id^=\"action-\"]').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });\n\n" +
        "        content.classList.add('open');\n" +
        "        icon.style.transform = 'rotate(180deg)';\n" +
        "        actionPanel.classList.remove('hidden');\n" +
        "        actionPanel.classList.add('flex');\n" +
        "    }\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// EVALUACIÓN DE PROYECTO\n" +
        "// =========================================\n" +
        "function evaluateProject(id, decision) {\n" +
        "    const index = projects.findIndex(p => p.id === id);\n" +
        "    if (index > -1) {\n" +
        "        projects[index].estado = decision;\n" +
        "        saveProjects();\n" +
        "        showToast(`Proyecto ${id} marcado como: ${decision}`);\n" +
        "        renderAdmin();\n" +
        "    }\n" +
        "}\n\n" +
        "// =========================================\n" +
        "// NOTIFICACIONES\n" +
        "// =========================================\n" +
        "function showToast(msg) {\n" +
        "    const toast = document.getElementById('toast');\n" +
        "    document.getElementById('toast-msg').innerText = msg;\n" +
        "    toast.classList.remove('translate-y-20', 'opacity-0');\n" +
        "    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);\n" +
        "}\n";

    // Descarga el archivo
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrypt.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('scrypt.js generado. Súbelo a tu repositorio de GitHub.');
}

// =========================================
// NOTIFICACIONES
// =========================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}