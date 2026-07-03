/**
 * Admin Authentication
 * Handles login form, token storage, auth state
 */

const API_BASE = '/api/v1';
const TOKEN_KEY = 'admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('admin_user');
}

export function getUser() {
  const raw = localStorage.getItem('admin_user');
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...options, headers });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login.html';
    return;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export function requireAuth() {
  if (!getToken()) {
    window.location.href = '/admin/login.html';
  }
}

export function logout() {
  clearToken();
  window.location.href = '/admin/login.html';
}

// ----- Login form -----
const form = document.getElementById('loginForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('error');
    errEl.classList.add('hidden');

    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        errEl.textContent = err.error || 'Invalid credentials';
        errEl.classList.remove('hidden');
        return;
      }

      const { token, user } = await res.json();
      setToken(token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      window.location.href = '/admin/dashboard.html';
    } catch (e) {
      errEl.textContent = 'Network error — please try again';
      errEl.classList.remove('hidden');
    }
  });
}

// ----- Logout button (on every page) -----
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// ----- Auto-fill user info -----
const user = getUser();
if (user) {
  const name = document.getElementById('userName');
  const role = document.getElementById('userRole');
  const av   = document.getElementById('userAvatar');
  if (name) name.textContent = user.full_name || user.email;
  if (role) role.textContent = user.role;
  if (av)   av.textContent   = (user.full_name || user.email)[0].toUpperCase();
}

// Hide admin-only items for non-admins
if (user && user.role !== 'admin') {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
}
