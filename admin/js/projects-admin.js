/**
 * Admin · Projects Management
 * CRUD for projects
 */

import { api, requireAuth, logout } from './auth.js';
requireAuth();

const tbody = document.getElementById('projectsBody');
const modal = document.getElementById('projectModal');
const form  = document.getElementById('projectForm');
const search = document.getElementById('searchInput');
const filter = document.getElementById('statusFilter');

let allProjects = [];

// ----- Load & render -----
async function load() {
  try {
    const status = filter.value;
    const { data } = await api(`/projects?status=${status}&limit=100`);
    allProjects = data;
    render();
  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted">Error: ${e.message}</td></tr>`;
  }
}

function render() {
  const q = (search.value || '').toLowerCase();
  const filtered = allProjects.filter(p =>
    !q || p.title.toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-muted">No projects</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr data-id="${p.id}">
      <td><input type="checkbox" class="row-check" /></td>
      <td><strong>${escapeHtml(p.title)}</strong><br><small class="text-muted">${escapeHtml(p.slug || '')}</small></td>
      <td>${escapeHtml(p.category || '—')}</td>
      <td><span class="status-pill status-${p.status}">${p.status}</span></td>
      <td>${p.view_count || 0}</td>
      <td>${formatDate(p.updated_at)}</td>
      <td>
        <button class="btn-icon" data-action="edit" data-id="${p.id}">✎</button>
        <button class="btn-icon" data-action="delete" data-id="${p.id}">🗑</button>
      </td>
    </tr>
  `).join('');
}

// ----- Form open/close -----
function openModal(project = null) {
  form.reset();
  document.getElementById('projectId').value = project?.id || '';
  document.getElementById('modalTitle').textContent = project ? 'Edit Project' : 'New Project';
  if (project) {
    document.getElementById('title').value = project.title || '';
    document.getElementById('slug').value = project.slug || '';
    document.getElementById('subtitle').value = project.subtitle || '';
    document.getElementById('description').value = project.description || '';
    document.getElementById('category').value = project.category || 'ai';
    document.getElementById('year').value = project.year || new Date().getFullYear();
    document.getElementById('status').value = project.status || 'draft';
    document.getElementById('featured').checked = !!project.featured;
  }
  modal.classList.add('open');
}

function closeModal() { modal.classList.remove('open'); }

document.getElementById('newProjectBtn').addEventListener('click', () => openModal());
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

// Auto-generate slug from title
document.getElementById('title').addEventListener('input', (e) => {
  const slug = document.getElementById('slug');
  if (!slug.value || slug.dataset.touched !== 'true') {
    slug.value = e.target.value.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});
document.getElementById('slug').addEventListener('input', () => {
  document.getElementById('slug').dataset.touched = 'true';
});

// ----- Save -----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('projectId').value;
  const data = {
    title:       document.getElementById('title').value,
    slug:        document.getElementById('slug').value,
    subtitle:    document.getElementById('subtitle').value,
    description: document.getElementById('description').value,
    category:    document.getElementById('category').value,
    year:        parseInt(document.getElementById('year').value) || new Date().getFullYear(),
    status:      document.getElementById('status').value,
    featured:    document.getElementById('featured').checked
  };

  try {
    if (id) {
      await api(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    } else {
      await api('/projects', { method: 'POST', body: JSON.stringify(data) });
    }
    closeModal();
    load();
  } catch (e) {
    alert('Save failed: ' + e.message);
  }
});

// ----- Row actions -----
tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id   = btn.dataset.id;
  const proj = allProjects.find(p => p.id == id);

  if (btn.dataset.action === 'edit' && proj) {
    openModal(proj);
  } else if (btn.dataset.action === 'delete') {
    if (confirm(`Delete "${proj?.title}"?`)) {
      try {
        await api(`/projects/${id}`, { method: 'DELETE' });
        load();
      } catch (e) { alert('Delete failed: ' + e.message); }
    }
  }
});

// ----- Filters -----
search.addEventListener('input', render);
filter.addEventListener('change', load);

// ----- Helpers -----
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[c]);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

load();
