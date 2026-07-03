/**
 * Admin Dashboard
 * Loads summary stats, traffic chart, recent messages
 */

import { api, getUser, requireAuth, logout } from './auth.js';
requireAuth();

// ----- Stat cards -----
async function loadStats() {
  try {
    const summary = await api('/analytics/summary');
    document.getElementById('statViews').textContent    = formatNum(summary.data.pageviews);
    document.getElementById('statVisitors').textContent = formatNum(summary.data.visitors);

    const projects = await api('/projects/meta/stats');
    document.getElementById('statProjects').textContent = projects.data.total || 0;

    const messages = await api('/contact/meta/stats');
    document.getElementById('statMessages').textContent = messages.data.new_count || 0;
    document.getElementById('unreadBadge').textContent  = messages.data.new_count || 0;

    document.getElementById('lastUpdated').textContent =
      `Updated ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}

// ----- Traffic chart (last 30 days) -----
async function loadTrafficChart() {
  try {
    const { data } = await api('/analytics/daily?days=30');
    drawChart('trafficChart', data);
  } catch (e) {
    console.error('Failed to load chart:', e);
  }
}

function drawChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const pad = 30;

  ctx.clearRect(0, 0, w, h);

  if (!data.length) {
    ctx.fillStyle = '#5b6391';
    ctx.font = '14px sans-serif';
    ctx.fillText('No data yet', w / 2 - 40, h / 2);
    return;
  }

  const max = Math.max(...data.map(d => d.total_views), 1);
  const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);

  // Grid
  ctx.strokeStyle = 'rgba(120, 160, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = pad + ((h - pad * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  // Line
  ctx.beginPath();
  ctx.moveTo(pad, h - pad - (data[0].total_views / max) * (h - pad * 2));
  data.forEach((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.total_views / max) * (h - pad * 2);
    ctx.lineTo(x, y);
  });

  const grad = ctx.createLinearGradient(0, pad, 0, h - pad);
  grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
  grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill
  ctx.lineTo(pad + (data.length - 1) * stepX, h - pad);
  ctx.lineTo(pad, h - pad);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Dots
  data.forEach((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.total_views / max) * (h - pad * 2);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
  });
}

// ----- Top pages -----
async function loadTopPages() {
  try {
    const { data } = await api('/analytics/top-pages?days=30');
    const tbody = document.getElementById('topPagesBody');
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-muted">No data yet</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(p => `
      <tr>
        <td>${escapeHtml(p.path)}</td>
        <td>${formatNum(p.views)}</td>
        <td>${formatNum(p.visitors)}</td>
      </tr>
    `).join('');
  } catch (e) { console.error(e); }
}

// ----- Recent messages -----
async function loadRecentMessages() {
  try {
    const { data } = await api('/contact?status=&limit=5');
    const tbody = document.getElementById('messagesBody');
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-muted">No messages yet</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(m => `
      <tr>
        <td>${m.is_starred ? '⭐' : ''}</td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.subject || '(no subject)')}</td>
        <td><span class="status-pill status-${m.status}">${m.status}</span></td>
        <td>${formatDate(m.created_at)}</td>
        <td><a href="messages.html" class="btn btn-ghost">View</a></td>
      </tr>
    `).join('');
  } catch (e) { console.error(e); }
}

// ----- Helpers -----
function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n || 0);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[c]);
}

// ----- Init -----
loadStats();
loadTrafficChart();
loadTopPages();
loadRecentMessages();

// Refresh every 30 seconds
setInterval(() => {
  loadStats();
  loadRecentMessages();
}, 30000);
