/**
 * Admin · Analytics page
 */

import { api, requireAuth } from './auth.js';
requireAuth();

const range = document.getElementById('range');

async function load() {
  const days = range.value;
  try {
    const [pages, referrers, countries, devices] = await Promise.all([
      api(`/analytics/top-pages?days=${days}`),
      api(`/analytics/top-referrers?days=${days}`),
      api(`/analytics/top-countries?days=${days}`),
      api(`/analytics/devices?days=${days}`)
    ]);

    const traffic = await api(`/analytics/daily?days=${days}`);
    drawChart(traffic.data);

    renderTable('pagesBody',       pages.data.map(p => [p.path, p.views, p.visitors]));
    renderTable('referrersBody',   referrers.data.map(r => [r.referrer || '(direct)', r.count]));
    renderTable('countriesBody',   countries.data.map(c => [c.country || 'Unknown', c.count]));
    renderTable('devicesBody',     devices.data.map(d => [d.device, d.browser, d.os, d.count]));
  } catch (e) {
    console.error(e);
  }
}

function drawChart(data) {
  const canvas = document.getElementById('trafficChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height, pad = 30;

  ctx.clearRect(0, 0, w, h);
  if (!data.length) {
    ctx.fillStyle = '#5b6391';
    ctx.font = '14px sans-serif';
    ctx.fillText('No data yet', w / 2 - 40, h / 2);
    return;
  }

  const max = Math.max(...data.map(d => d.total_views), 1);
  const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);

  ctx.strokeStyle = 'rgba(120, 160, 255, 0.1)';
  for (let i = 0; i <= 4; i++) {
    const y = pad + ((h - pad * 2) / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
  }

  const grad = ctx.createLinearGradient(0, pad, 0, h - pad);
  grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
  grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

  ctx.beginPath();
  ctx.moveTo(pad, h - pad - (data[0].total_views / max) * (h - pad * 2));
  data.forEach((d, i) => {
    ctx.lineTo(pad + i * stepX, h - pad - (d.total_views / max) * (h - pad * 2));
  });
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2; ctx.stroke();

  ctx.lineTo(pad + (data.length - 1) * stepX, h - pad);
  ctx.lineTo(pad, h - pad);
  ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
}

function renderTable(id, rows) {
  const tbody = document.getElementById(id);
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="' + (rows[0]?.length || 1) + '" class="text-muted">No data</td></tr>';
    return;
  }
  const cols = rows[0].length;
  tbody.innerHTML = rows.map(row =>
    '<tr>' + row.map(c => `<td>${c ?? '—'}</td>`).join('') + '</tr>'
  ).join('');
}

range.addEventListener('change', load);
load();
