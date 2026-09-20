// =========================================
// AUTENTICACIÓN DEL COMITÉ DIRECTIVO
// =========================================

const ADMIN_CREDENTIALS = {
    user: 'comite.gto',
    pass: 'GTO2026'
};

function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin_user').value.trim();
    const pass = document.getElementById('admin_pass').value;
    const errorBox = document.getElementById('login-error');
    const errorMsg = document.getElementById('login-error-msg');

    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
        sessionStorage.setItem('gto_admin_auth', 'true');
        sessionStorage.setItem('gto_admin_user', user);
        window.location.href = 'admin.html';
    } else {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'Usuario o contraseña incorrectos';
    }
}

function requireAdminAuth() {
    if (sessionStorage.getItem('gto_admin_auth') !== 'true') {
        window.location.href = 'login-admin.html';
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('gto_admin_auth');
    sessionStorage.removeItem('gto_admin_user');
    window.location.href = 'index.html';
}

// =========================================
// CUENTAS DE EMPRENDEDOR (localStorage)
// =========================================

function getEmprendedores() {
    return JSON.parse(localStorage.getItem('gto_emprendedores')) || [];
}

function saveEmprendedores(list) {
    localStorage.setItem('gto_emprendedores', JSON.stringify(list));
}

// ---------- Tabs de Login / Registro ----------
function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');

    // Limpiar errores
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('register-error').classList.add('hidden');

    if (tab === 'login') {
        tabLogin.className = 'flex-1 py-2 text-sm font-semibold rounded-md bg-white text-brand-dark shadow-sm transition';
        tabRegister.className = 'flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 transition';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        title.innerText = 'Acceso Emprendedor';
        subtitle.innerText = 'Ingresa a tu cuenta para gestionar tus propuestas';
    } else {
        tabRegister.className = 'flex-1 py-2 text-sm font-semibold rounded-md bg-white text-brand-dark shadow-sm transition';
        tabLogin.className = 'flex-1 py-2 text-sm font-semibold rounded-md text-gray-500 transition';
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        title.innerText = 'Crear Cuenta';
        subtitle.innerText = 'Regístrate para enviar y dar seguimiento a tus propuestas';
    }
}

// ---------- Registro ----------
function handleEmprendedorRegister(e) {
    e.preventDefault();

    const nombre = document.getElementById('reg_nombre').value.trim();
    const correo = document.getElementById('reg_correo').value.trim().toLowerCase();
    const pass = document.getElementById('reg_pass').value;
    const errorBox = document.getElementById('register-error');
    const errorMsg = document.getElementById('register-error-msg');

    if (nombre.length < 3) {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'El nombre debe tener al menos 3 caracteres';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'Ingresa un correo electrónico válido';
        return;
    }

    if (pass.length < 6) {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'La contraseña debe tener al menos 6 caracteres';
        return;
    }

    const emprendedores = getEmprendedores();
    if (emprendedores.some(emp => emp.correo === correo)) {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'Ya existe una cuenta con este correo. Inicia sesión.';
        return;
    }

    // Crear cuenta
    const nuevo = { nombre, correo, pass };
    emprendedores.push(nuevo);
    saveEmprendedores(emprendedores);

    // Iniciar sesión automáticamente
    sessionStorage.setItem('gto_emp_auth', 'true');
    sessionStorage.setItem('gto_emp_correo', correo);

    window.location.href = 'mi-cuenta.html';
}

// ---------- Login ----------
function handleEmprendedorLogin(e) {
    e.preventDefault();

    const correo = document.getElementById('login_correo').value.trim().toLowerCase();
    const pass = document.getElementById('login_pass').value;
    const errorBox = document.getElementById('login-error');
    const errorMsg = document.getElementById('login-error-msg');

    const emprendedores = getEmprendedores();
    const emp = emprendedores.find(x => x.correo === correo && x.pass === pass);

    if (!emp) {
        errorBox.classList.remove('hidden');
        errorMsg.innerText = 'Correo o contraseña incorrectos';
        return;
    }

    sessionStorage.setItem('gto_emp_auth', 'true');
    sessionStorage.setItem('gto_emp_correo', emp.correo);

    window.location.href = 'mi-cuenta.html';
}

// ---------- Protección de rutas ----------
function requireEmprendedorAuth() {
    if (sessionStorage.getItem('gto_emp_auth') !== 'true') {
        window.location.href = 'login-emprendedor.html';
    }
}

function logoutEmprendedor() {
    sessionStorage.removeItem('gto_emp_auth');
    sessionStorage.removeItem('gto_emp_correo');
    window.location.href = 'index.html';
}