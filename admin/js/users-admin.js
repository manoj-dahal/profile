/**
 * Admin · Users management
 */
import { api, requireAuth } from './auth.js';
requireAuth();

const tbody = document.getElementById('usersBody');
const modal = document.getElementById('userModal');
const form  = document.getElementById('userForm');
let allUsers = [];

async function load() {
  try {
    const { data } = await api('/users');
    allUsers = data;
    render();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted">Error: ${e.message}</td></tr>`;
  }
}

function render() {
  if (!allUsers.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-muted">No users</td></tr>';
    return;
  }
  tbody.innerHTML = allUsers.map(u => `
    <tr>
      <td>${escapeHtml(u.full_name || '—')}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="status-pill status-${u.role === 'admin' ? 'replied' : 'read'}">${u.role}</span></td>
      <td>${u.is_active ? '✅ Active' : '❌ Inactive'}</td>
      <td>${u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : '—'}</td>
      <td>${new Date(u.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn-icon" data-action="edit" data-id="${u.id}">✎</button>
        ${u.id !== 1 ? `<button class="btn-icon" data-action="delete" data-id="${u.id}">🗑</button>` : ''}
      </td>
    </tr>
  `).join('');
}

document.getElementById('newUserBtn').addEventListener('click', () => openModal());
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => modal.classList.remove('open')));

function openModal(user = null) {
  form.reset();
  document.getElementById('modalTitle').textContent = user ? 'Edit User' : 'New User';
  if (user) {
    document.getElementById('fullName').value = user.full_name || '';
    document.getElementById('email').value     = user.email || '';
    document.getElementById('role').value      = user.role || 'user';
  }
  modal.classList.add('open');
}

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const u = allUsers.find(x => x.id == btn.dataset.id);
  if (!u) return;
  if (btn.dataset.action === 'edit') openModal(u);
  if (btn.dataset.action === 'delete' && confirm(`Delete ${u.email}?`)) {
    api(`/users/${u.id}`, { method: 'DELETE' }).then(load).catch(e => alert(e.message));
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    full_name: document.getElementById('fullName').value,
    email:     document.getElementById('email').value,
    role:      document.getElementById('role').value
  };
  const pw = document.getElementById('password').value;
  if (pw) data.password = pw;
  try {
    await api('/users', { method: 'POST', body: JSON.stringify(data) });
    modal.classList.remove('open');
    load();
  } catch (e) { alert(e.message); }
});

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
}

load();
