/**
 * Admin · Messages
 */

import { api, requireAuth } from './auth.js';
requireAuth();

const tbody   = document.getElementById('messagesBody');
const modal   = document.getElementById('messageModal');
const filter  = document.getElementById('statusFilter');
let allMessages = [];
let currentId   = null;

async function load() {
  try {
    const status = filter.value;
    const { data } = await api(`/contact?status=${status}&limit=100`);
    allMessages = data;

    document.getElementById('unreadBadge').textContent =
      data.filter(m => m.status === 'new').length;

    render();
  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted">Error: ${e.message}</td></tr>`;
  }
}

function render() {
  if (!allMessages.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No messages</td></tr>';
    return;
  }
  tbody.innerHTML = allMessages.map(m => `
    <tr data-id="${m.id}">
      <td>${m.is_starred ? '⭐' : ''}</td>
      <td>${escapeHtml(m.name)}<br><small class="text-muted">${escapeHtml(m.email)}</small></td>
      <td>${escapeHtml(m.subject || '(no subject)')}</td>
      <td><span class="status-pill status-${m.status}">${m.status}</span></td>
      <td>${formatDate(m.created_at)}</td>
      <td>
        <button class="btn btn-ghost" data-action="view" data-id="${m.id}">View</button>
      </td>
    </tr>
  `).join('');
}

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const m = allMessages.find(x => x.id == id);
  if (m) openModal(m);
});

function openModal(m) {
  currentId = m.id;
  document.getElementById('msgSubject').textContent = m.subject || '(no subject)';
  document.getElementById('msgFrom').textContent = m.name;
  document.getElementById('msgEmail').textContent = m.email;
  document.getElementById('msgDate').textContent = new Date(m.created_at).toLocaleString();
  document.getElementById('msgBody').textContent = m.message;
  document.getElementById('replyText').value = '';
  modal.classList.add('open');

  if (m.status === 'new') {
    api(`/contact/${m.id}/read`, { method: 'PATCH' }).then(load).catch(console.error);
  }
}

function closeModal() { modal.classList.remove('open'); currentId = null; }
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

document.getElementById('markRepliedBtn').addEventListener('click', async () => {
  if (!currentId) return;
  await api(`/contact/${currentId}/replied`, { method: 'PATCH' });
  closeModal();
  load();
});

document.getElementById('sendReplyBtn').addEventListener('click', async () => {
  if (!currentId) return;
  const text = document.getElementById('replyText').value.trim();
  if (!text) { alert('Please type a reply'); return; }
  try {
    await api(`/contact/${currentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message: text })
    });
    alert('Reply sent!');
    closeModal();
    load();
  } catch (e) { alert('Send failed: ' + e.message); }
});

filter.addEventListener('change', load);

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[c]);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

load();
