/**
 * Admin · Settings
 */
import { api, requireAuth } from './auth.js';
requireAuth();

async function loadSettings() {
  try {
    const { data } = await api('/settings');
    if (data.siteName)        document.getElementById('siteName').value = data.siteName;
    if (data.siteEmail)       document.getElementById('siteEmail').value = data.siteEmail;
    if (data.siteTimezone)    document.getElementById('siteTimezone').value = data.siteTimezone;
    if (data.notifyEmail)     document.getElementById('notifyEmail').value = data.notifyEmail;
    if (data.notifContact)    document.getElementById('notifContact').checked = true;
    if (data.notifWeekly)     document.getElementById('notifWeekly').checked = true;

    const health = await api('/health');
    document.getElementById('dbStatus').innerHTML = '✅ Connected — ' + health.timestamp;
  } catch (e) {
    document.getElementById('dbStatus').innerHTML = '❌ ' + e.message;
  }
}

document.getElementById('siteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await save({
    siteName:     document.getElementById('siteName').value,
    siteEmail:    document.getElementById('siteEmail').value,
    siteTimezone: document.getElementById('siteTimezone').value
  });
});

document.getElementById('notifForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await save({
    notifContact: document.getElementById('notifContact').checked,
    notifWeekly:  document.getElementById('notifWeekly').checked,
    notifyEmail:  document.getElementById('notifyEmail').value
  });
});

async function save(data) {
  try {
    await api('/settings', { method: 'PUT', body: JSON.stringify(data) });
    alert('Settings saved');
  } catch (e) { alert('Error: ' + e.message); }
}

document.getElementById('clearCacheBtn').addEventListener('click', async () => {
  if (confirm('Clear all cached data?')) {
    try { await api('/cache/clear', { method: 'POST' }); alert('Cache cleared'); }
    catch (e) { alert('Error: ' + e.message); }
  }
});

document.getElementById('resetDbBtn').addEventListener('click', () => {
  if (!confirm('⚠️ This will DELETE all data. Are you sure?')) return;
  if (!confirm('Really sure? This cannot be undone.')) return;
  api('/admin/reset', { method: 'POST' })
    .then(() => alert('Database reset. Reloading…') || setTimeout(() => location.reload(), 1500))
    .catch(e => alert('Error: ' + e.message));
});

loadSettings();
