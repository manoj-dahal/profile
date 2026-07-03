/**
 * Admin · Audit log
 */
import { api, requireAuth } from './auth.js';
requireAuth();

const tbody = document.getElementById('auditBody');
const filter = document.getElementById('actionFilter');

async function load() {
  try {
    const { data } = await api('/audit' + (filter.value ? `?action=${filter.value}` : ''));
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-muted">No entries</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(a => `
      <tr>
        <td>${new Date(a.created_at).toLocaleString()}</td>
        <td>${escapeHtml(a.user_email || '—')}</td>
        <td><code>${escapeHtml(a.action)}</code></td>
        <td>${escapeHtml(a.resource || '')}${a.resource_id ? ' #' + escapeHtml(a.resource_id) : ''}</td>
        <td><pre style="font-size:11px;max-width:300px;overflow:auto;">${escapeHtml(a.changes || '').substring(0, 200)}</pre></td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted">Error: ${e.message}</td></tr>`;
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
}

filter.addEventListener('change', load);
load();
